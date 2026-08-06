import { createHash, randomUUID } from "node:crypto";

import type pg from "pg";

import { resolveWorkspaceContext, setLocal } from "./workspace-context.js";

export type StarterAccountType = "cash" | "bank_account" | "e_wallet" | "other";

export interface StarterAccountInput {
  readonly name: string;
  readonly type: StarterAccountType;
  readonly openingBalance: bigint;
  readonly openingBalanceEffectiveDate: string;
}

export interface OnboardingResult {
  readonly userId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly replayed: boolean;
}

export type OnboardingFailureCode =
  | "INVITATION_UNAVAILABLE"
  | "INVITATION_EMAIL_MISMATCH"
  | "ALREADY_ONBOARDED"
  | "IDEMPOTENCY_CONFLICT";

export class OnboardingStoreError extends Error {
  public constructor(public readonly code: OnboardingFailureCode) {
    super(code);
    this.name = "OnboardingStoreError";
  }
}

export interface RedeemOnboardingInput {
  readonly externalSubject: string;
  readonly verifiedEmails: readonly string[];
  readonly invitationTokenHash: string;
  readonly idempotencyKey: string;
  readonly requestFingerprint: string;
  readonly account: StarterAccountInput;
}

interface InvitationRow {
  id: string;
  invited_email_normalized: string;
  is_expired: boolean;
  revoked_at: Date | null;
  consumed_at: Date | null;
  consumed_by_user_id: string | null;
}

interface UserRow {
  id: string;
}

interface IdempotencyRow {
  request_fingerprint: string;
  workspace_id: string;
  account_id: string;
}

export type OnboardingTestFailpoint =
  | "after_user_mapping"
  | "after_workspace_insert"
  | "after_account_insert"
  | "after_idempotency_insert"
  | "after_invitation_consumption"
  | "before_commit";

const testFailpoints = new WeakMap<OnboardingStore, OnboardingTestFailpoint>();

function triggerTestFailpoint(
  store: OnboardingStore,
  stage: OnboardingTestFailpoint,
): void {
  if (testFailpoints.get(store) === stage) {
    throw new Error(`Onboarding test failpoint: ${stage}`);
  }
}

/** Runtime-only onboarding persistence. Every trust context is transaction-local. */
export class OnboardingStore {
  public constructor(private readonly pool: pg.Pool) {}

  public async status(
    externalSubject: string,
  ): Promise<{ workspaceId: string; accountId: string } | null> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await setLocal(client, "app.external_subject", externalSubject);
      const context = await resolveWorkspaceContext(client, externalSubject);
      if (context === null) {
        await client.query("COMMIT");
        return null;
      }
      await setLocal(client, "app.user_id", context.user_id);
      await setLocal(client, "app.workspace_id", context.workspace_id);
      const account = await client.query<{ id: string }>(
        "SELECT id FROM accounts WHERE workspace_id = $1 AND is_starter = true LIMIT 1",
        [context.workspace_id],
      );
      const accountId = account.rows[0]?.id;
      if (accountId === undefined) {
        throw new Error("The private Workspace has no starter Account.");
      }
      await client.query("COMMIT");
      return { workspaceId: context.workspace_id, accountId };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  public async redeem(input: RedeemOnboardingInput): Promise<OnboardingResult> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN ISOLATION LEVEL READ COMMITTED");
      await setLocal(client, "app.external_subject", input.externalSubject);
      // Serializes onboarding for one provider subject across every API
      // process. Invitation row locks still serialize single-token use; this
      // transaction-scoped database lock covers two different valid tokens
      // racing to create the same subject's unique private Workspace.
      await client.query(
        "SELECT pg_advisory_xact_lock(hashtextextended($1, 0))",
        [input.externalSubject],
      );
      await setLocal(
        client,
        "app.invitation_token_hash",
        input.invitationTokenHash,
      );

      const invitationResult = await client.query<InvitationRow>(
        `SELECT id, invited_email_normalized,
                (expires_at IS NOT NULL AND expires_at <= now()) AS is_expired,
                revoked_at,
                consumed_at, consumed_by_user_id
           FROM private_beta_invitations
          WHERE token_hash = $1
          FOR UPDATE`,
        [input.invitationTokenHash],
      );
      const invitation = invitationResult.rows[0];
      if (invitation === undefined || invitation.revoked_at !== null) {
        throw new OnboardingStoreError("INVITATION_UNAVAILABLE");
      }

      let user = (
        await client.query<UserRow>(
          "SELECT id FROM users WHERE external_subject = $1 LIMIT 1",
          [input.externalSubject],
        )
      ).rows[0];

      if (user !== undefined) {
        await setLocal(client, "app.user_id", user.id);
      }

      if (invitation.consumed_at !== null) {
        if (user === undefined || invitation.consumed_by_user_id !== user.id) {
          throw new OnboardingStoreError("INVITATION_UNAVAILABLE");
        }
        const replay = await this.findIdempotency(
          client,
          user.id,
          input.idempotencyKey,
        );
        if (replay?.request_fingerprint !== input.requestFingerprint) {
          throw new OnboardingStoreError(
            replay === null ? "ALREADY_ONBOARDED" : "IDEMPOTENCY_CONFLICT",
          );
        }
        await client.query("COMMIT");
        return {
          userId: user.id,
          workspaceId: replay.workspace_id,
          accountId: replay.account_id,
          replayed: true,
        };
      }

      if (invitation.is_expired) {
        throw new OnboardingStoreError("INVITATION_UNAVAILABLE");
      }
      if (!input.verifiedEmails.includes(invitation.invited_email_normalized)) {
        throw new OnboardingStoreError("INVITATION_EMAIL_MISMATCH");
      }

      if (user === undefined) {
        user = (
          await client.query<UserRow>(
            `INSERT INTO users (external_subject, verified_email_normalized)
             VALUES ($1, $2)
             ON CONFLICT (external_subject) DO UPDATE
               SET verified_email_normalized = EXCLUDED.verified_email_normalized,
                   updated_at = now()
             RETURNING id`,
            [input.externalSubject, invitation.invited_email_normalized],
          )
        ).rows[0];
      }
      if (user === undefined) {
        throw new Error("User persistence returned no row.");
      }
      await setLocal(client, "app.user_id", user.id);
      triggerTestFailpoint(this, "after_user_mapping");

      const existingContext = await resolveWorkspaceContext(
        client,
        input.externalSubject,
      );
      if (existingContext !== null) {
        await setLocal(
          client,
          "app.workspace_id",
          existingContext.workspace_id,
        );
        const replay = await this.findIdempotency(
          client,
          user.id,
          input.idempotencyKey,
        );
        if (replay !== null) {
          if (replay.request_fingerprint !== input.requestFingerprint) {
            throw new OnboardingStoreError("IDEMPOTENCY_CONFLICT");
          }
          await client.query("COMMIT");
          return {
            userId: user.id,
            workspaceId: replay.workspace_id,
            accountId: replay.account_id,
            replayed: true,
          };
        }
        throw new OnboardingStoreError("ALREADY_ONBOARDED");
      }

      const workspaceId = randomUUID();
      const accountId = randomUUID();
      await setLocal(client, "app.workspace_id", workspaceId);
      await client.query(
        `INSERT INTO workspaces (id, owner_user_id, currency, timezone)
         VALUES ($1, $2, 'IDR', 'Asia/Jakarta')`,
        [workspaceId, user.id],
      );
      triggerTestFailpoint(this, "after_workspace_insert");
      await client.query(
        `INSERT INTO accounts
           (id, workspace_id, name, type, opening_balance,
            opening_balance_effective_date, total_balance,
            unallocated_balance, lifecycle_status, is_starter)
         VALUES ($1, $2, $3, $4, $5, $6, $5, $5, 'active', true)`,
        [
          accountId,
          workspaceId,
          input.account.name,
          input.account.type,
          input.account.openingBalance.toString(),
          input.account.openingBalanceEffectiveDate,
        ],
      );
      triggerTestFailpoint(this, "after_account_insert");
      await client.query(
        `INSERT INTO onboarding_idempotency
           (user_id, idempotency_key, request_fingerprint, workspace_id, account_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          user.id,
          input.idempotencyKey,
          input.requestFingerprint,
          workspaceId,
          accountId,
        ],
      );
      triggerTestFailpoint(this, "after_idempotency_insert");
      await client.query(
        `UPDATE private_beta_invitations
            SET consumed_at = now(), consumed_by_user_id = $2,
                consumed_workspace_id = $3, consumed_account_id = $4
          WHERE id = $1`,
        [invitation.id, user.id, workspaceId, accountId],
      );
      triggerTestFailpoint(this, "after_invitation_consumption");
      await client.query(
        "INSERT INTO onboarding_audit_events (event, reason) VALUES ('redemption_succeeded', 'onboarding_committed')",
      );
      triggerTestFailpoint(this, "before_commit");
      await client.query("COMMIT");
      return { userId: user.id, workspaceId, accountId, replayed: false };
    } catch (error) {
      await client.query("ROLLBACK");
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "23505" &&
        "constraint" in error &&
        error.constraint === "workspaces_owner_user_id_key"
      ) {
        throw new OnboardingStoreError("ALREADY_ONBOARDED");
      }
      throw error;
    } finally {
      client.release();
    }
  }

  public async recordRejection(reason: string): Promise<void> {
    await this.pool.query(
      "INSERT INTO onboarding_audit_events (event, reason) VALUES ('redemption_rejected', $1)",
      [reason],
    );
  }

  private async findIdempotency(
    client: pg.PoolClient,
    userId: string,
    idempotencyKey: string,
  ): Promise<IdempotencyRow | null> {
    const result = await client.query<IdempotencyRow>(
      `SELECT request_fingerprint, workspace_id, account_id
         FROM onboarding_idempotency
        WHERE user_id = $1 AND idempotency_key = $2
        LIMIT 1`,
      [userId, idempotencyKey],
    );
    return result.rows[0] ?? null;
  }
}

/**
 * Database-test-only entry point. It is deliberately absent from the package's
 * public runtime barrel and package exports, and cannot be enabled by HTTP or
 * environment configuration.
 */
export function createOnboardingStoreWithTestFailpoint(
  pool: pg.Pool,
  stage: OnboardingTestFailpoint,
): OnboardingStore {
  const store = new OnboardingStore(pool);
  testFailpoints.set(store, stage);
  return store;
}

export function hashOnboardingMaterial(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
