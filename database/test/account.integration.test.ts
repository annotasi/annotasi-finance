import { randomUUID } from "node:crypto";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  createSessionStoreConnection,
  hashOnboardingMaterial,
} from "../src/runtime/index.js";
import {
  bootstrapRoles,
  connectionUrlForRole,
  createEmptyDatabase,
  MIGRATION_ROLE,
  runMigrations,
} from "../scripts/database-foundation.mjs";
import {
  type FoundationEnvironment,
  startFoundationEnvironment,
} from "./support/foundation-environment.js";

const { Pool } = pg;
const SOURCE_MIGRATIONS_FOLDER = fileURLToPath(
  new URL("../migrations", import.meta.url),
);

/** Builds a migrations folder trimmed to entries with idx <= maxIdx. */
async function createTrimmedMigrationsFolder(maxIdx: number): Promise<string> {
  const journalRaw = await readFile(
    path.join(SOURCE_MIGRATIONS_FOLDER, "meta", "_journal.json"),
    "utf8",
  );
  const journal = JSON.parse(journalRaw) as {
    version: string;
    dialect: string;
    entries: { idx: number; tag: string }[];
  };
  const entries = journal.entries.filter((entry) => entry.idx <= maxIdx);
  const target = path.join(
    tmpdir(),
    `acc001-migration-upgrade-${randomUUID()}`,
  );
  await mkdir(path.join(target, "meta"), { recursive: true });
  for (const entry of entries) {
    await cp(
      path.join(SOURCE_MIGRATIONS_FOLDER, `${entry.tag}.sql`),
      path.join(target, `${entry.tag}.sql`),
    );
  }
  await writeFile(
    path.join(target, "meta", "_journal.json"),
    JSON.stringify({ ...journal, entries }, null, 2),
  );
  return target;
}

const { Client } = pg;
const DATE = "2026-08-03";
const ABOVE_SAFE_INTEGER = 9_007_199_254_740_993n;

describe("ACC-001 Account persistence, lifecycle, RLS, and concurrency", () => {
  let environment: FoundationEnvironment;
  let connection: ReturnType<typeof createSessionStoreConnection>;

  beforeAll(async () => {
    environment = await startFoundationEnvironment();
    connection = createSessionStoreConnection(environment.applicationUrl);
  });

  afterAll(async () => {
    await connection?.close();
    await environment?.container.stop();
  });

  async function issue(email: string): Promise<string> {
    const token = `afbeta_${Buffer.from(randomUUID().replaceAll("-", "")).toString("base64url").padEnd(43, "a").slice(0, 43)}`;
    const operator = new Client({ connectionString: environment.operatorUrl });
    await operator.connect();
    try {
      await operator.query(
        "INSERT INTO private_beta_invitations (invited_email_normalized, token_hash) VALUES ($1, $2)",
        [email, hashOnboardingMaterial(token)],
      );
    } finally {
      await operator.end();
    }
    return token;
  }

  async function onboard(subject: string): Promise<{
    workspaceId: string;
    starterAccountId: string;
  }> {
    const token = await issue(`${subject}@example.test`);
    const result = await connection.onboarding.redeem({
      externalSubject: subject,
      verifiedEmails: [`${subject}@example.test`],
      invitationTokenHash: hashOnboardingMaterial(token),
      idempotencyKey: randomUUID(),
      requestFingerprint: hashOnboardingMaterial(subject),
      account: {
        name: "Starter",
        type: "cash",
        openingBalance: 0n,
        openingBalanceEffectiveDate: DATE,
      },
    });
    return {
      workspaceId: result.workspaceId,
      starterAccountId: result.accountId,
    };
  }

  it("lists, renames, and preserves identity of the IAM-002 starter Account", async () => {
    const subject = "starter_subject";
    const { starterAccountId } = await onboard(subject);

    const listed = await connection.account.list(subject);
    expect(listed).toHaveLength(1);
    expect(listed[0]?.id).toBe(starterAccountId);
    expect(listed[0]?.isStarter).toBe(true);
    expect(listed[0]?.version).toBe(1n);

    const renamed = await connection.account.rename(
      subject,
      starterAccountId,
      "Renamed starter",
      1n,
    );
    expect(renamed.id).toBe(starterAccountId);
    expect(renamed.name).toBe("Renamed starter");
    expect(renamed.type).toBe("cash");
    expect(renamed.openingBalance).toBe(0n);
    expect(renamed.openingBalanceEffectiveDate).toBe(DATE);
    expect(renamed.totalBalance).toBe(0n);
    expect(renamed.unallocatedBalance).toBe(0n);
    expect(renamed.version).toBe(2n);
  });

  it("creates a zero and a positive opening-balance Account, and accepts duplicate names", async () => {
    const subject = "create_subject";
    await onboard(subject);

    const zero = await connection.account.create(subject, {
      name: "Duplicate",
      type: "bank_account",
      openingBalance: 0n,
      openingBalanceEffectiveDate: DATE,
    });
    const positive = await connection.account.create(subject, {
      name: "Duplicate",
      type: "e_wallet",
      openingBalance: 500_000n,
      openingBalanceEffectiveDate: DATE,
    });
    const large = await connection.account.create(subject, {
      name: "Above safe integer",
      type: "other",
      openingBalance: ABOVE_SAFE_INTEGER,
      openingBalanceEffectiveDate: DATE,
    });

    expect(zero.totalBalance).toBe(0n);
    expect(zero.unallocatedBalance).toBe(0n);
    expect(positive.totalBalance).toBe(500_000n);
    expect(positive.unallocatedBalance).toBe(500_000n);
    expect(large.openingBalance).toBe(ABOVE_SAFE_INTEGER);
    expect(large.totalBalance).toBe(ABOVE_SAFE_INTEGER);
    expect(zero.name).toBe(positive.name);
    expect(zero.id).not.toBe(positive.id);

    const list = await connection.account.list(subject);
    expect(list).toHaveLength(4); // starter + 3 created above
  });

  it("rejects invalid Account facts at the database boundary", async () => {
    const admin = new Client({ connectionString: environment.adminUrl });
    await admin.connect();
    try {
      const workspaceId = (
        await admin.query<{ id: string }>("SELECT id FROM workspaces LIMIT 1")
      ).rows[0]?.id;
      await expect(
        admin.query(
          `INSERT INTO accounts
             (id, workspace_id, name, type, opening_balance,
              opening_balance_effective_date, total_balance, unallocated_balance)
           VALUES ($1, $2, 'x', 'credit_card', 0, $3, 0, 0)`,
          [randomUUID(), workspaceId, DATE],
        ),
      ).rejects.toMatchObject({ code: "23514" });
      await expect(
        admin.query(
          `INSERT INTO accounts
             (id, workspace_id, name, type, opening_balance,
              opening_balance_effective_date, total_balance, unallocated_balance)
           VALUES ($1, $2, 'x', 'cash', -1, $3, -1, -1)`,
          [randomUUID(), workspaceId, DATE],
        ),
      ).rejects.toMatchObject({ code: "23514" });
      await expect(
        admin.query(
          `INSERT INTO accounts
             (id, workspace_id, name, type, opening_balance,
              opening_balance_effective_date, total_balance, unallocated_balance)
           VALUES ($1, $2, '', 'cash', 0, $3, 0, 0)`,
          [randomUUID(), workspaceId, DATE],
        ),
      ).rejects.toMatchObject({ code: "23514" });
      expect(
        (
          await admin.query(
            "SELECT to_regclass('public.categories') AS categories, to_regclass('public.financial_events') AS events",
          )
        ).rows[0],
      ).toEqual({ categories: null, events: null });
    } finally {
      await admin.end();
    }
  });

  it("no longer hard-pins total/unallocated equal to opening balance (ACC-001 removal)", async () => {
    const admin = new Client({ connectionString: environment.adminUrl });
    await admin.connect();
    try {
      const id = randomUUID();
      const workspaceId = (
        await admin.query<{ id: string }>("SELECT id FROM workspaces LIMIT 1")
      ).rows[0]?.id;
      await expect(
        admin.query(
          `INSERT INTO accounts
             (id, workspace_id, name, type, opening_balance,
              opening_balance_effective_date, total_balance, unallocated_balance)
           VALUES ($1, $2, 'divergent', 'cash', 100, $3, 250, 250)`,
          [id, workspaceId, DATE],
        ),
      ).resolves.toHaveProperty("rowCount", 1);
      await expect(
        admin.query("UPDATE accounts SET total_balance = -1 WHERE id = $1", [
          id,
        ]),
      ).rejects.toMatchObject({ code: "23514" });
    } finally {
      await admin.end();
    }
  });

  it("RLS INSERT policy accepts valid creation facts and rejects every invalid combination", async () => {
    const subject = "rls_insert_subject";
    const { workspaceId } = await onboard(subject);

    const application = new Client({
      connectionString: environment.applicationUrl,
    });
    await application.connect();

    async function insertWithContext(
      columns: string,
      values: string,
      params: unknown[],
    ): Promise<unknown> {
      await application.query("BEGIN");
      try {
        await application.query(
          "SELECT set_config('app.external_subject', $1, true)",
          [subject],
        );
        const context = await application.query<{
          user_id: string;
          workspace_id: string;
        }>(
          "SELECT user_id, workspace_id FROM resolve_private_workspace_context($1)",
          [subject],
        );
        await application.query(
          "SELECT set_config('app.user_id', $1, true), set_config('app.workspace_id', $2, true)",
          [context.rows[0]?.user_id, context.rows[0]?.workspace_id],
        );
        return await application.query(
          `INSERT INTO accounts (${columns}) VALUES (${values})`,
          params,
        );
      } finally {
        await application.query("ROLLBACK");
      }
    }

    try {
      // Valid starter-shaped creation (workspace scope + Total=Unallocated=Opening,
      // active, no archived_at, version 1) is accepted by the split INSERT policy.
      await expect(
        insertWithContext(
          "id, workspace_id, name, type, opening_balance, opening_balance_effective_date, total_balance, unallocated_balance, lifecycle_status, is_starter, version",
          "$1, $2, 'Valid', 'cash', 500, $3, 500, 500, 'active', false, 1",
          [randomUUID(), workspaceId, DATE],
        ),
      ).resolves.toHaveProperty("rowCount", 1);

      await expect(
        insertWithContext(
          "id, workspace_id, name, type, opening_balance, opening_balance_effective_date, total_balance, unallocated_balance, lifecycle_status, is_starter, version",
          "$1, $2, 'Mismatched total', 'cash', 500, $3, 999, 500, 'active', false, 1",
          [randomUUID(), workspaceId, DATE],
        ),
      ).rejects.toMatchObject({ code: "42501" });

      await expect(
        insertWithContext(
          "id, workspace_id, name, type, opening_balance, opening_balance_effective_date, total_balance, unallocated_balance, lifecycle_status, is_starter, version",
          "$1, $2, 'Mismatched unallocated', 'cash', 500, $3, 500, 999, 'active', false, 1",
          [randomUUID(), workspaceId, DATE],
        ),
      ).rejects.toMatchObject({ code: "42501" });

      await expect(
        insertWithContext(
          "id, workspace_id, name, type, opening_balance, opening_balance_effective_date, total_balance, unallocated_balance, lifecycle_status, archived_at, is_starter, version",
          "$1, $2, 'Archived at creation', 'cash', 500, $3, 500, 500, 'archived', now(), false, 1",
          [randomUUID(), workspaceId, DATE],
        ),
      ).rejects.toMatchObject({ code: "42501" });

      await expect(
        insertWithContext(
          "id, workspace_id, name, type, opening_balance, opening_balance_effective_date, total_balance, unallocated_balance, lifecycle_status, is_starter, version",
          "$1, $2, 'Wrong version', 'cash', 500, $3, 500, 500, 'active', false, 2",
          [randomUUID(), workspaceId, DATE],
        ),
      ).rejects.toMatchObject({ code: "42501" });
    } finally {
      await application.end();
    }
  });

  it("permanently rejects unallocated greater than total at the database boundary", async () => {
    const admin = new Client({ connectionString: environment.adminUrl });
    await admin.connect();
    try {
      const workspaceId = (
        await admin.query<{ id: string }>("SELECT id FROM workspaces LIMIT 1")
      ).rows[0]?.id;
      await expect(
        admin.query(
          `INSERT INTO accounts
             (id, workspace_id, name, type, opening_balance,
              opening_balance_effective_date, total_balance, unallocated_balance)
           VALUES ($1, $2, 'over-allocated', 'cash', 500, $3, 500, 600)`,
          [randomUUID(), workspaceId, DATE],
        ),
      ).rejects.toMatchObject({ code: "23514" });
    } finally {
      await admin.end();
    }
  });

  it("archives a zero-total Active Account and rejects a non-zero Account", async () => {
    const subject = "archive_subject";
    const { starterAccountId } = await onboard(subject);
    const positive = await connection.account.create(subject, {
      name: "Has balance",
      type: "cash",
      openingBalance: 1_000n,
      openingBalanceEffectiveDate: DATE,
    });

    const archived = await connection.account.archive(
      subject,
      starterAccountId,
      1n,
    );
    expect(archived.lifecycleStatus).toBe("archived");
    expect(archived.archivedAt).not.toBeNull();
    expect(archived.id).toBe(starterAccountId);
    expect(archived.openingBalance).toBe(0n);

    await expect(
      connection.account.archive(subject, positive.id, positive.version),
    ).rejects.toMatchObject({ code: "ACCOUNT_ARCHIVE_BALANCE_NON_ZERO" });

    const list = await connection.account.list(subject);
    const stillActive = list.find((a) => a.id === positive.id);
    expect(stillActive?.lifecycleStatus).toBe("active");
    expect(stillActive?.version).toBe(positive.version);
  });

  it("enforces total_balance = 0 for every Archived Account with a database CHECK, independent of AccountStore", async () => {
    const subject = "archived_zero_check_subject";
    await onboard(subject);
    const positive = await connection.account.create(subject, {
      name: "Direct archive attempt",
      type: "cash",
      openingBalance: 1_000n,
      openingBalanceEffectiveDate: DATE,
    });
    const zero = await connection.account.create(subject, {
      name: "Direct zero archive",
      type: "cash",
      openingBalance: 0n,
      openingBalanceEffectiveDate: DATE,
    });

    const application = new Client({
      connectionString: environment.applicationUrl,
    });
    await application.connect();

    async function withOwnContext(
      query: string,
      params: unknown[],
    ): Promise<unknown> {
      await application.query("BEGIN");
      await application.query(
        "SELECT set_config('app.external_subject', $1, true)",
        [subject],
      );
      const context = await application.query<{
        user_id: string;
        workspace_id: string;
      }>(
        "SELECT user_id, workspace_id FROM resolve_private_workspace_context($1)",
        [subject],
      );
      await application.query(
        "SELECT set_config('app.user_id', $1, true), set_config('app.workspace_id', $2, true)",
        [context.rows[0]?.user_id, context.rows[0]?.workspace_id],
      );
      try {
        return await application.query(query, params);
      } finally {
        await application.query("ROLLBACK");
      }
    }

    try {
      // A consistent lifecycle/timestamp update (matching exactly what
      // AccountStore.archive would set) on a non-zero-balance Account is
      // rejected by the CHECK constraint itself, not merely by AccountStore.
      await expect(
        withOwnContext(
          "UPDATE accounts SET lifecycle_status = 'archived', archived_at = now() WHERE id = $1",
          [positive.id],
        ),
      ).rejects.toMatchObject({ code: "23514" });

      // The rejected update preserves Active state.
      const stillActive = await connection.account.list(subject);
      expect(
        stillActive.find((a) => a.id === positive.id)?.lifecycleStatus,
      ).toBe("active");

      // The identical consistent update on a zero-balance Account remains
      // valid.
      await expect(
        withOwnContext(
          "UPDATE accounts SET lifecycle_status = 'archived', archived_at = now() WHERE id = $1",
          [zero.id],
        ),
      ).resolves.toHaveProperty("rowCount", 1);
    } finally {
      await application.end();
    }
  });

  it("restores an archived Account as the same row, unchanged facts, and rejects invalid repeats", async () => {
    const subject = "restore_subject";
    const { starterAccountId } = await onboard(subject);
    const archived = await connection.account.archive(
      subject,
      starterAccountId,
      1n,
    );
    const restored = await connection.account.restore(
      subject,
      starterAccountId,
      archived.version,
    );
    expect(restored.id).toBe(starterAccountId);
    expect(restored.lifecycleStatus).toBe("active");
    expect(restored.archivedAt).toBeNull();
    expect(restored.openingBalance).toBe(archived.openingBalance);
    expect(restored.openingBalanceEffectiveDate).toBe(
      archived.openingBalanceEffectiveDate,
    );

    await expect(
      connection.account.restore(subject, starterAccountId, restored.version),
    ).rejects.toMatchObject({ code: "ACCOUNT_NOT_ARCHIVED" });
    await expect(
      connection.account.archive(subject, starterAccountId, 999n),
    ).rejects.toMatchObject({ code: "ACCOUNT_CONFLICT" });
  });

  it("evaluates delete eligibility as a read-only operation using real persisted dependencies", async () => {
    const subject = "eligibility_subject";
    const { starterAccountId } = await onboard(subject);
    const zeroNoDependency = await connection.account.create(subject, {
      name: "Zero, dependency-free",
      type: "cash",
      openingBalance: 0n,
      openingBalanceEffectiveDate: DATE,
    });
    const positive = await connection.account.create(subject, {
      name: "Non-zero",
      type: "cash",
      openingBalance: 250n,
      openingBalanceEffectiveDate: DATE,
    });

    // Outcome 1: the IAM-002 starter Account has Opening Balance Rp0 but a
    // real onboarding_idempotency dependency, so it is not eligible.
    const starterEligibility =
      await connection.account.evaluateDeleteEligibility(
        subject,
        starterAccountId,
      );
    expect(starterEligibility.eligible).toBe(false);
    expect(starterEligibility.facts.openingBalanceZero).toBe(true);
    expect(starterEligibility.facts.hasOtherDependency).toBe(true);
    expect(starterEligibility.reasonCodes).toContain("DEPENDENCY_EXISTS");
    expect(starterEligibility.reasonCodes).not.toContain(
      "OPENING_BALANCE_NOT_ZERO",
    );

    // Outcome 2: an additionally created zero-balance Account has no
    // onboarding_idempotency row, so it is eligible.
    const zeroEligibility = await connection.account.evaluateDeleteEligibility(
      subject,
      zeroNoDependency.id,
    );
    expect(zeroEligibility.eligible).toBe(true);
    expect(zeroEligibility.facts.hasOtherDependency).toBe(false);
    expect(zeroEligibility.reasonCodes).toEqual([]);

    // Outcome 3: a non-zero-balance additional Account is ineligible for
    // its Opening Balance alone.
    const nonZeroEligibility =
      await connection.account.evaluateDeleteEligibility(subject, positive.id);
    expect(nonZeroEligibility.eligible).toBe(false);
    expect(nonZeroEligibility.facts.hasOtherDependency).toBe(false);
    expect(nonZeroEligibility.reasonCodes).toContain(
      "OPENING_BALANCE_NOT_ZERO",
    );

    const before = await connection.account.list(subject);
    await connection.account.evaluateDeleteEligibility(
      subject,
      starterAccountId,
    );
    const after = await connection.account.list(subject);
    expect(after).toEqual(before);
  });

  it("has no DELETE privilege for the application role, and no Account is ever physically deleted", async () => {
    const application = new Client({
      connectionString: environment.applicationUrl,
    });
    await application.connect();
    try {
      await expect(
        application.query("DELETE FROM accounts WHERE true"),
      ).rejects.toMatchObject({ code: "42501" });
    } finally {
      await application.end();
    }
  });

  it("cannot mutate balance or type columns from the application role", async () => {
    const subject = "no_balance_grant_subject";
    const { starterAccountId } = await onboard(subject);
    const application = new Client({
      connectionString: environment.applicationUrl,
    });
    await application.connect();

    async function withContext(query: string): Promise<unknown> {
      await application.query("BEGIN");
      await application.query(
        "SELECT set_config('app.external_subject', $1, true)",
        [subject],
      );
      const context = await application.query<{
        user_id: string;
        workspace_id: string;
      }>(
        "SELECT user_id, workspace_id FROM resolve_private_workspace_context($1)",
        [subject],
      );
      await application.query(
        "SELECT set_config('app.user_id', $1, true), set_config('app.workspace_id', $2, true)",
        [context.rows[0]?.user_id, context.rows[0]?.workspace_id],
      );
      try {
        return await application.query(query, [starterAccountId]);
      } finally {
        await application.query("ROLLBACK");
      }
    }

    try {
      await expect(
        withContext("UPDATE accounts SET total_balance = 999999 WHERE id = $1"),
      ).rejects.toMatchObject({ code: "42501" });
      await expect(
        withContext(
          "UPDATE accounts SET opening_balance = 999999 WHERE id = $1",
        ),
      ).rejects.toMatchObject({ code: "42501" });
      await expect(
        withContext("UPDATE accounts SET type = 'other' WHERE id = $1"),
      ).rejects.toMatchObject({ code: "42501" });
    } finally {
      await application.end();
    }
  });

  it("denies no-context, empty-context, and malformed-context Account reads and writes", async () => {
    const subject = "malformed_context_subject";
    const { starterAccountId } = await onboard(subject);
    const application = new Client({
      connectionString: environment.applicationUrl,
    });
    await application.connect();
    try {
      for (const context of [undefined, "", "not-a-uuid"]) {
        await application.query("BEGIN");
        if (context !== undefined) {
          await application.query(
            "SELECT set_config('app.user_id', $1, true), set_config('app.workspace_id', $1, true)",
            [context],
          );
        }
        await expect(
          application.query("SELECT count(*)::int AS count FROM accounts"),
        ).resolves.toHaveProperty("rows.0.count", 0);
        await expect(
          application.query(
            "UPDATE accounts SET name = 'leaked' WHERE id = $1",
            [starterAccountId],
          ),
        ).resolves.toHaveProperty("rowCount", 0);
        await application.query("ROLLBACK");
      }
    } finally {
      await application.end();
    }
  });

  it("denies cross-Workspace direct UPDATE for rename, archive, and restore, and A cannot restore B's archived Account", async () => {
    const subjectA = "direct_update_a";
    const subjectB = "direct_update_b";
    const { starterAccountId: accountB } = await onboard(subjectB);
    await onboard(subjectA);

    const application = new Client({
      connectionString: environment.applicationUrl,
    });
    await application.connect();

    async function withContextA(
      query: string,
      params: unknown[],
    ): Promise<unknown> {
      await application.query("BEGIN");
      await application.query(
        "SELECT set_config('app.external_subject', $1, true)",
        [subjectA],
      );
      const context = await application.query<{
        user_id: string;
        workspace_id: string;
      }>(
        "SELECT user_id, workspace_id FROM resolve_private_workspace_context($1)",
        [subjectA],
      );
      await application.query(
        "SELECT set_config('app.user_id', $1, true), set_config('app.workspace_id', $2, true)",
        [context.rows[0]?.user_id, context.rows[0]?.workspace_id],
      );
      try {
        return await application.query(query, params);
      } finally {
        await application.query("ROLLBACK");
      }
    }

    try {
      await expect(
        withContextA(
          "UPDATE accounts SET name = 'stolen rename' WHERE id = $1",
          [accountB],
        ),
      ).resolves.toHaveProperty("rowCount", 0);
      await expect(
        withContextA(
          "UPDATE accounts SET lifecycle_status = 'archived', archived_at = now() WHERE id = $1",
          [accountB],
        ),
      ).resolves.toHaveProperty("rowCount", 0);

      // Seed B's Account as archived directly (admin bypass), then prove A
      // cannot restore an archived Account that belongs to B.
      const admin = new Client({ connectionString: environment.adminUrl });
      await admin.connect();
      try {
        await admin.query(
          "UPDATE accounts SET lifecycle_status = 'archived', archived_at = now() WHERE id = $1",
          [accountB],
        );
      } finally {
        await admin.end();
      }
      await expect(
        withContextA(
          "UPDATE accounts SET lifecycle_status = 'active', archived_at = NULL WHERE id = $1",
          [accountB],
        ),
      ).resolves.toHaveProperty("rowCount", 0);
      await expect(
        connection.account.restore(subjectA, accountB, 1n),
      ).rejects.toMatchObject({ code: "ACCOUNT_NOT_FOUND" });
    } finally {
      await application.end();
    }
  });

  it("forces true physical-connection reuse across Workspace contexts and never leaks context across a rollback or commit", async () => {
    const subjectA = "pool_reuse_a";
    const subjectB = "pool_reuse_b";
    const { starterAccountId: accountA } = await onboard(subjectA);
    const { starterAccountId: accountB } = await onboard(subjectB);

    const pool = new Pool({
      connectionString: environment.applicationUrl,
      max: 1,
    });

    async function withRawContext(
      subject: string | undefined,
      run: (client: pg.PoolClient) => Promise<void>,
    ): Promise<void> {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        if (subject !== undefined) {
          await client.query(
            "SELECT set_config('app.external_subject', $1, true)",
            [subject],
          );
          const ctx = await client.query<{
            user_id: string;
            workspace_id: string;
          }>(
            "SELECT user_id, workspace_id FROM resolve_private_workspace_context($1)",
            [subject],
          );
          await client.query(
            "SELECT set_config('app.user_id', $1, true), set_config('app.workspace_id', $2, true)",
            [ctx.rows[0]?.user_id, ctx.rows[0]?.workspace_id],
          );
        }
        await run(client);
      } finally {
        client.release();
      }
    }

    try {
      // Transaction 1: Workspace A context, then ROLLBACK.
      await withRawContext(subjectA, async (client) => {
        const rows = await client.query<{ id: string }>(
          "SELECT id FROM accounts",
        );
        expect(rows.rows.map((row) => row.id)).toEqual([accountA]);
        await client.query("ROLLBACK");
      });

      // Transaction 2: the exact same physical connection (pool max: 1),
      // now under Workspace B context. Must see only B's Account, proving
      // A's rolled-back context did not survive onto this connection.
      await withRawContext(subjectB, async (client) => {
        const rows = await client.query<{ id: string }>(
          "SELECT id FROM accounts",
        );
        expect(rows.rows.map((row) => row.id)).toEqual([accountB]);
        await client.query("COMMIT");
      });

      // Transaction 3: same physical connection, no context set at all.
      // Must see zero rows and be unable to write, proving neither prior
      // transaction's context (rolled back or committed) survived.
      await withRawContext(undefined, async (client) => {
        const count = await client.query<{ count: number }>(
          "SELECT count(*)::int AS count FROM accounts",
        );
        expect(count.rows[0]?.count).toBe(0);
        const update = await client.query(
          "UPDATE accounts SET name = 'leaked' WHERE id = $1",
          [accountA],
        );
        expect(update.rowCount).toBe(0);
        await client.query("ROLLBACK");
      });
    } finally {
      await pool.end();
    }
  });

  it("isolates Workspace A from Workspace B for every Account operation, including guessed IDs", async () => {
    const subjectA = "isolation_a";
    const subjectB = "isolation_b";
    const { starterAccountId: accountA } = await onboard(subjectA);
    const { starterAccountId: accountB } = await onboard(subjectB);

    const listA = await connection.account.list(subjectA);
    const listB = await connection.account.list(subjectB);
    expect(listA.map((a) => a.id)).toEqual([accountA]);
    expect(listB.map((a) => a.id)).toEqual([accountB]);

    await expect(
      connection.account.rename(subjectA, accountB, "stolen", 1n),
    ).rejects.toMatchObject({ code: "ACCOUNT_NOT_FOUND" });
    await expect(
      connection.account.archive(subjectA, accountB, 1n),
    ).rejects.toMatchObject({ code: "ACCOUNT_NOT_FOUND" });
    await expect(
      connection.account.evaluateDeleteEligibility(subjectA, accountB),
    ).rejects.toMatchObject({ code: "ACCOUNT_NOT_FOUND" });
    await expect(
      connection.account.restore(subjectA, accountB, 1n),
    ).rejects.toMatchObject({ code: "ACCOUNT_NOT_FOUND" });
    // A guessed, well-formed but nonexistent Account ID is indistinguishable
    // from a real foreign Account ID: both yield ACCOUNT_NOT_FOUND, never a
    // different error that would reveal existence.
    const guessedId = randomUUID();
    await expect(
      connection.account.rename(subjectA, guessedId, "guessed", 1n),
    ).rejects.toMatchObject({ code: "ACCOUNT_NOT_FOUND" });
    await expect(
      connection.account.archive(subjectA, guessedId, 1n),
    ).rejects.toMatchObject({ code: "ACCOUNT_NOT_FOUND" });
    await expect(
      connection.account.restore(subjectA, guessedId, 1n),
    ).rejects.toMatchObject({ code: "ACCOUNT_NOT_FOUND" });
    await expect(
      connection.account.evaluateDeleteEligibility(subjectA, guessedId),
    ).rejects.toMatchObject({ code: "ACCOUNT_NOT_FOUND" });
  });

  it("rejects Account operations for a subject without a completed Workspace", async () => {
    await expect(
      connection.account.list("no_workspace_subject"),
    ).rejects.toMatchObject({ code: "ACCOUNT_SCOPE_REJECTED" });
  });

  it("clears transaction-local context on pooled-connection reuse", async () => {
    const subject = "context_cleanup_subject";
    await onboard(subject);
    // Exercising the store repeatedly forces pool connection reuse; each
    // call must re-derive its own context rather than trusting a prior one.
    for (let i = 0; i < 5; i += 1) {
      const list = await connection.account.list(subject);
      expect(list).toHaveLength(1);
    }
  });

  it("serializes concurrent renames into one accepted and one conflict, preserving identity", async () => {
    const subject = "concurrent_rename_subject";
    const { starterAccountId } = await onboard(subject);
    const settled = await Promise.allSettled([
      connection.account.rename(subject, starterAccountId, "First", 1n),
      connection.account.rename(subject, starterAccountId, "Second", 1n),
    ]);
    expect(settled.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(settled.find((r) => r.status === "rejected")).toMatchObject({
      reason: { code: "ACCOUNT_CONFLICT" },
    });
    const list = await connection.account.list(subject);
    expect(list).toHaveLength(1);
    expect(list[0]?.id).toBe(starterAccountId);
    expect(list[0]?.version).toBe(2n);
  });

  it("serializes two concurrent archive requests into one accepted and one deterministic rejection", async () => {
    const subject = "concurrent_archive_subject";
    const { starterAccountId } = await onboard(subject);
    const settled = await Promise.allSettled([
      connection.account.archive(subject, starterAccountId, 1n),
      connection.account.archive(subject, starterAccountId, 1n),
    ]);
    expect(settled.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(settled.filter((r) => r.status === "rejected")).toHaveLength(1);
    const list = await connection.account.list(subject);
    expect(list[0]?.lifecycleStatus).toBe("archived");
    expect(list[0]?.version).toBe(2n);
  });

  it("serializes two concurrent restore requests into one accepted and one deterministic rejection", async () => {
    const subject = "concurrent_restore_subject";
    const { starterAccountId } = await onboard(subject);
    const archived = await connection.account.archive(
      subject,
      starterAccountId,
      1n,
    );
    const settled = await Promise.allSettled([
      connection.account.restore(subject, starterAccountId, archived.version),
      connection.account.restore(subject, starterAccountId, archived.version),
    ]);
    expect(settled.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(settled.filter((r) => r.status === "rejected")).toHaveLength(1);
    const list = await connection.account.list(subject);
    expect(list[0]?.lifecycleStatus).toBe("active");
    expect(list[0]?.version).toBe(3n);
  });

  it("upgrades a real IAM-002 database to ACC-001 while preserving every starter Account fact", async () => {
    const databaseName = `annotasi_migration_upgrade_${randomUUID().replaceAll("-", "")}`;
    const secondAdminUrl = await createEmptyDatabase(
      environment.adminUrl,
      databaseName,
    );
    await bootstrapRoles({
      adminUrl: secondAdminUrl,
      migrationPassword: environment.migrationPassword,
      applicationPassword: environment.applicationPassword,
      operatorPassword: environment.operatorPassword,
    });
    const secondMigrationUrl = connectionUrlForRole(
      secondAdminUrl,
      MIGRATION_ROLE,
      environment.migrationPassword,
    );
    const secondApplicationUrl = connectionUrlForRole(
      secondAdminUrl,
      "annotasi_application",
      environment.applicationPassword,
    );

    // Step 1: bring the database to a real IAM-002-only shape (migrations
    // 0000-0002), not a hand-written imitation of that schema.
    const trimmedFolder = await createTrimmedMigrationsFolder(2);
    const trimmedPool = new Pool({
      connectionString: secondMigrationUrl,
      max: 1,
    });
    try {
      await migrate(drizzle(trimmedPool), {
        migrationsFolder: trimmedFolder,
      });
    } finally {
      await trimmedPool.end();
    }

    // Step 2: establish representative IAM-002 state (User, private
    // Workspace, starter Account) using the exact IAM-002 column set, via
    // the admin connection (bypasses RLS, matching the existing pattern for
    // direct fact injection elsewhere in this file).
    const admin = new Client({ connectionString: secondAdminUrl });
    await admin.connect();
    const userId = randomUUID();
    const workspaceId = randomUUID();
    const accountId = randomUUID();
    try {
      await admin.query(
        `INSERT INTO users (id, external_subject, verified_email_normalized)
         VALUES ($1, 'upgrade_subject', 'upgrade_subject@example.test')`,
        [userId],
      );
      await admin.query(
        `INSERT INTO workspaces (id, owner_user_id, currency, timezone)
         VALUES ($1, $2, 'IDR', 'Asia/Jakarta')`,
        [workspaceId, userId],
      );
      await admin.query(
        `INSERT INTO accounts
           (id, workspace_id, name, type, opening_balance,
            opening_balance_effective_date, total_balance,
            unallocated_balance, lifecycle_status, is_starter)
         VALUES ($1, $2, 'Starter', 'cash', 750, $3, 750, 750, 'active', true)`,
        [accountId, workspaceId, DATE],
      );
    } finally {
      await admin.end();
    }

    const beforeUpgrade = new Client({ connectionString: secondAdminUrl });
    await beforeUpgrade.connect();
    let before: Record<string, unknown>;
    try {
      const result = await beforeUpgrade.query(
        `SELECT id, workspace_id, name, type, opening_balance::text,
                opening_balance_effective_date::text, total_balance::text,
                unallocated_balance::text, lifecycle_status
           FROM accounts WHERE id = $1`,
        [accountId],
      );
      before = result.rows[0];
      expect(before).toBeDefined();
    } finally {
      await beforeUpgrade.end();
    }

    // Step 3: apply 0003 on top of the real IAM-002 database via the
    // ordinary migration runner (not a hand-rebuilt schema).
    await expect(runMigrations(secondMigrationUrl)).resolves.toEqual({
      before: 3,
      after: 4,
      applied: 1,
    });

    const after = new Client({ connectionString: secondAdminUrl });
    await after.connect();
    try {
      const result = await after.query(
        `SELECT id, workspace_id, name, type, opening_balance::text,
                opening_balance_effective_date::text, total_balance::text,
                unallocated_balance::text, lifecycle_status, archived_at,
                version::text,
                (SELECT relforcerowsecurity FROM pg_class WHERE oid = 'accounts'::regclass) AS force_rls
           FROM accounts WHERE id = $1`,
        [accountId],
      );
      const row = result.rows[0];
      expect(row.id).toBe(before["id"]);
      expect(row.workspace_id).toBe(before["workspace_id"]);
      expect(row.name).toBe(before["name"]);
      expect(row.type).toBe(before["type"]);
      expect(row.opening_balance).toBe(before["opening_balance"]);
      expect(row.opening_balance_effective_date).toBe(
        before["opening_balance_effective_date"],
      );
      expect(row.total_balance).toBe(before["total_balance"]);
      expect(row.unallocated_balance).toBe(before["unallocated_balance"]);
      expect(row.lifecycle_status).toBe("active");
      expect(row.archived_at).toBeNull();
      expect(row.version).toBe("1");
      expect(row.force_rls).toBe(true);
    } finally {
      await after.end();
    }

    // Step 4: the application role can list and rename the upgraded Account
    // through the ordinary ACC-001 runtime path.
    const upgradedConnection =
      createSessionStoreConnection(secondApplicationUrl);
    try {
      const listed = await upgradedConnection.account.list("upgrade_subject");
      expect(listed).toHaveLength(1);
      expect(listed[0]?.id).toBe(accountId);
      const renamed = await upgradedConnection.account.rename(
        "upgrade_subject",
        accountId,
        "Renamed after upgrade",
        1n,
      );
      expect(renamed.name).toBe("Renamed after upgrade");
      expect(renamed.openingBalance).toBe(750n);
    } finally {
      await upgradedConnection.close();
    }
  });

  it("does not silently overwrite a rename racing against an archive", async () => {
    const subject = "rename_vs_archive_subject";
    const { starterAccountId } = await onboard(subject);
    const settled = await Promise.allSettled([
      connection.account.rename(subject, starterAccountId, "Renamed", 1n),
      connection.account.archive(subject, starterAccountId, 1n),
    ]);
    const fulfilled = settled.filter((r) => r.status === "fulfilled");
    const rejected = settled.filter((r) => r.status === "rejected");
    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    const list = await connection.account.list(subject);
    expect(list[0]?.id).toBe(starterAccountId);
    expect(list[0]?.version).toBe(2n);
    expect(list[0]?.totalBalance).toBeGreaterThanOrEqual(0n);
  });
});
