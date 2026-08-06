import { randomUUID } from "node:crypto";

import type pg from "pg";

import { resolveWorkspaceContext, setLocal } from "./workspace-context.js";

export type AccountType = "cash" | "bank_account" | "e_wallet" | "other";
export type AccountLifecycleStatus = "active" | "archived";

export interface AccountRecord {
  readonly id: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly type: AccountType;
  readonly openingBalance: bigint;
  readonly openingBalanceEffectiveDate: string;
  readonly totalBalance: bigint;
  readonly unallocatedBalance: bigint;
  readonly lifecycleStatus: AccountLifecycleStatus;
  readonly isStarter: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly archivedAt: Date | null;
  readonly version: bigint;
}

export type AccountFailureCode =
  | "ACCOUNT_SCOPE_REJECTED"
  | "ACCOUNT_NOT_FOUND"
  | "ACCOUNT_NOT_ACTIVE"
  | "ACCOUNT_NOT_ARCHIVED"
  | "ACCOUNT_ARCHIVE_BALANCE_NON_ZERO"
  | "ACCOUNT_CONFLICT";

export class AccountStoreError extends Error {
  public constructor(public readonly code: AccountFailureCode) {
    super(code);
    this.name = "AccountStoreError";
  }
}

export interface CreateAccountInput {
  readonly name: string;
  readonly type: AccountType;
  readonly openingBalance: bigint;
  readonly openingBalanceEffectiveDate: string;
}

export type DeleteEligibilityReasonCode =
  | "OPENING_BALANCE_NOT_ZERO"
  | "FINANCIAL_EVENT_HISTORY_EXISTS"
  | "DEPENDENCY_EXISTS";

export interface DeleteEligibilityResult {
  readonly accountId: string;
  readonly eligible: boolean;
  readonly reasonCodes: readonly DeleteEligibilityReasonCode[];
  readonly facts: {
    readonly openingBalanceZero: boolean;
    readonly hasFinancialEventHistory: boolean;
    readonly hasOtherDependency: boolean;
  };
}

interface AccountRow {
  id: string;
  workspace_id: string;
  name: string;
  type: AccountType;
  opening_balance: string;
  opening_balance_effective_date: string;
  total_balance: string;
  unallocated_balance: string;
  lifecycle_status: AccountLifecycleStatus;
  is_starter: boolean;
  created_at: Date;
  updated_at: Date;
  archived_at: Date | null;
  version: string;
}

const ACCOUNT_COLUMNS = `id, workspace_id, name, type,
       opening_balance::text, opening_balance_effective_date::text,
       total_balance::text, unallocated_balance::text,
       lifecycle_status, is_starter, created_at, updated_at, archived_at,
       version::text`;

function toRecord(row: AccountRow): AccountRecord {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    name: row.name,
    type: row.type,
    openingBalance: BigInt(row.opening_balance),
    openingBalanceEffectiveDate: row.opening_balance_effective_date,
    totalBalance: BigInt(row.total_balance),
    unallocatedBalance: BigInt(row.unallocated_balance),
    lifecycleStatus: row.lifecycle_status,
    isStarter: row.is_starter,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at,
    version: BigInt(row.version),
  };
}

/**
 * Runtime-only Account persistence. Every trust context is transaction-local
 * (see workspace-context.ts); every query and mutation relies on the existing
 * `accounts_private_workspace` forced-RLS policy for Workspace scoping.
 */
export class AccountStore {
  public constructor(private readonly pool: pg.Pool) {}

  public async list(externalSubject: string): Promise<AccountRecord[]> {
    return this.withContext(externalSubject, async (client, workspaceId) => {
      const result = await client.query<AccountRow>(
        `SELECT ${ACCOUNT_COLUMNS}
           FROM accounts
          WHERE workspace_id = $1
          ORDER BY created_at ASC, id ASC`,
        [workspaceId],
      );
      return result.rows.map(toRecord);
    });
  }

  public async create(
    externalSubject: string,
    input: CreateAccountInput,
  ): Promise<AccountRecord> {
    return this.withContext(externalSubject, async (client, workspaceId) => {
      const id = randomUUID();
      const result = await client.query<AccountRow>(
        `INSERT INTO accounts
           (id, workspace_id, name, type, opening_balance,
            opening_balance_effective_date, total_balance,
            unallocated_balance, lifecycle_status, is_starter)
         VALUES ($1, $2, $3, $4, $5, $6, $5, $5, 'active', false)
         RETURNING ${ACCOUNT_COLUMNS}`,
        [
          id,
          workspaceId,
          input.name,
          input.type,
          input.openingBalance.toString(),
          input.openingBalanceEffectiveDate,
        ],
      );
      const row = result.rows[0];
      if (row === undefined) {
        throw new Error("Account creation returned no row.");
      }
      return toRecord(row);
    });
  }

  public async rename(
    externalSubject: string,
    accountId: string,
    name: string,
    expectedVersion: bigint,
  ): Promise<AccountRecord> {
    return this.withContext(externalSubject, async (client) => {
      const result = await client.query<AccountRow>(
        `UPDATE accounts
            SET name = $2, updated_at = now(), version = version + 1
          WHERE id = $1 AND version = $3
          RETURNING ${ACCOUNT_COLUMNS}`,
        [accountId, name, expectedVersion.toString()],
      );
      const row = result.rows[0];
      if (row !== undefined) return toRecord(row);
      await this.diagnoseConflict(client, accountId, expectedVersion);
      throw new AccountStoreError("ACCOUNT_CONFLICT");
    });
  }

  public async archive(
    externalSubject: string,
    accountId: string,
    expectedVersion: bigint,
  ): Promise<AccountRecord> {
    return this.withContext(externalSubject, async (client) => {
      const result = await client.query<AccountRow>(
        `UPDATE accounts
            SET lifecycle_status = 'archived', archived_at = now(),
                updated_at = now(), version = version + 1
          WHERE id = $1 AND version = $2
            AND lifecycle_status = 'active' AND total_balance = 0
          RETURNING ${ACCOUNT_COLUMNS}`,
        [accountId, expectedVersion.toString()],
      );
      const row = result.rows[0];
      if (row !== undefined) return toRecord(row);
      const current = await this.diagnoseConflict(
        client,
        accountId,
        expectedVersion,
      );
      if (current.lifecycle_status !== "active") {
        throw new AccountStoreError("ACCOUNT_NOT_ACTIVE");
      }
      if (current.total_balance !== "0") {
        throw new AccountStoreError("ACCOUNT_ARCHIVE_BALANCE_NON_ZERO");
      }
      throw new AccountStoreError("ACCOUNT_CONFLICT");
    });
  }

  public async restore(
    externalSubject: string,
    accountId: string,
    expectedVersion: bigint,
  ): Promise<AccountRecord> {
    return this.withContext(externalSubject, async (client) => {
      const result = await client.query<AccountRow>(
        `UPDATE accounts
            SET lifecycle_status = 'active', archived_at = NULL,
                updated_at = now(), version = version + 1
          WHERE id = $1 AND version = $2 AND lifecycle_status = 'archived'
          RETURNING ${ACCOUNT_COLUMNS}`,
        [accountId, expectedVersion.toString()],
      );
      const row = result.rows[0];
      if (row !== undefined) return toRecord(row);
      const current = await this.diagnoseConflict(
        client,
        accountId,
        expectedVersion,
      );
      if (current.lifecycle_status !== "archived") {
        throw new AccountStoreError("ACCOUNT_NOT_ARCHIVED");
      }
      throw new AccountStoreError("ACCOUNT_CONFLICT");
    });
  }

  /**
   * Read-only. Never mutates Account state. Evaluates every dependency that
   * exists in the current schema; later slices (Financial Event, allocation)
   * must add their own dependency checks here before permanent deletion is
   * ever implemented.
   */
  public async evaluateDeleteEligibility(
    externalSubject: string,
    accountId: string,
  ): Promise<DeleteEligibilityResult> {
    return this.withContext(externalSubject, async (client) => {
      const result = await client.query<{ opening_balance: string }>(
        "SELECT opening_balance::text FROM accounts WHERE id = $1",
        [accountId],
      );
      const row = result.rows[0];
      if (row === undefined) {
        throw new AccountStoreError("ACCOUNT_NOT_FOUND");
      }
      const openingBalanceZero = BigInt(row.opening_balance) === 0n;
      // No Financial Event or allocation table exists yet in this slice's
      // schema, so this check is currently a vacuous fact.
      const hasFinancialEventHistory = false;
      // onboarding_idempotency.account_id (ON DELETE RESTRICT) is a real,
      // currently-existing Account dependency: every onboarding-created
      // starter Account has exactly one such row, inserted in the same
      // transaction that also set private_beta_invitations.consumed_
      // account_id to the same Account ID, so checking this one table is
      // sufficient. Only existence is checked — no idempotency_key,
      // request_fingerprint, or user_id column is ever read — and the query
      // runs inside the existing Account transaction context, so it stays
      // scoped by the existing onboarding_idempotency_own_user RLS policy
      // (app.user_id) without broadening any grant or policy.
      const dependency = await client.query<{ exists: boolean }>(
        "SELECT EXISTS (SELECT 1 FROM onboarding_idempotency WHERE account_id = $1) AS exists",
        [accountId],
      );
      const hasOtherDependency = dependency.rows[0]?.exists ?? false;
      const reasonCodes: DeleteEligibilityReasonCode[] = [];
      if (!openingBalanceZero) reasonCodes.push("OPENING_BALANCE_NOT_ZERO");
      if (hasFinancialEventHistory) {
        reasonCodes.push("FINANCIAL_EVENT_HISTORY_EXISTS");
      }
      if (hasOtherDependency) reasonCodes.push("DEPENDENCY_EXISTS");
      return {
        accountId,
        eligible: reasonCodes.length === 0,
        reasonCodes,
        facts: {
          openingBalanceZero,
          hasFinancialEventHistory,
          hasOtherDependency,
        },
      };
    });
  }

  private async diagnoseConflict(
    client: pg.PoolClient,
    accountId: string,
    expectedVersion: bigint,
  ): Promise<{
    lifecycle_status: AccountLifecycleStatus;
    total_balance: string;
  }> {
    const current = await client.query<{
      version: string;
      lifecycle_status: AccountLifecycleStatus;
      total_balance: string;
    }>(
      "SELECT version::text, lifecycle_status, total_balance::text FROM accounts WHERE id = $1",
      [accountId],
    );
    const row = current.rows[0];
    if (row === undefined) {
      throw new AccountStoreError("ACCOUNT_NOT_FOUND");
    }
    if (BigInt(row.version) !== expectedVersion) {
      throw new AccountStoreError("ACCOUNT_CONFLICT");
    }
    return row;
  }

  private async withContext<T>(
    externalSubject: string,
    body: (client: pg.PoolClient, workspaceId: string) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await setLocal(client, "app.external_subject", externalSubject);
      const context = await resolveWorkspaceContext(client, externalSubject);
      if (context === null) {
        throw new AccountStoreError("ACCOUNT_SCOPE_REJECTED");
      }
      await setLocal(client, "app.user_id", context.user_id);
      await setLocal(client, "app.workspace_id", context.workspace_id);
      const result = await body(client, context.workspace_id);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
