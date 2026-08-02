import { randomUUID } from "node:crypto";

import {
  createSessionStoreConnection,
  hashOnboardingMaterial,
} from "../src/runtime/index.js";
import {
  createOnboardingStoreWithTestFailpoint,
  type OnboardingTestFailpoint,
} from "../src/runtime/onboarding-store.js";
import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  type FoundationEnvironment,
  startFoundationEnvironment,
} from "./support/foundation-environment.js";

const { Client, Pool } = pg;
const DATE = "2026-08-02";
const FAILPOINTS: readonly OnboardingTestFailpoint[] = [
  "after_user_mapping",
  "after_workspace_insert",
  "after_account_insert",
  "after_idempotency_insert",
  "after_invitation_consumption",
  "before_commit",
];

describe("IAM-002 onboarding persistence and isolation", () => {
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

  async function issueExpired(email: string): Promise<string> {
    const token = `afbeta_${Buffer.from(randomUUID().replaceAll("-", "")).toString("base64url").padEnd(43, "a").slice(0, 43)}`;
    const admin = new Client({ connectionString: environment.adminUrl });
    await admin.connect();
    try {
      await admin.query(
        `INSERT INTO private_beta_invitations
           (invited_email_normalized, token_hash, issued_at, expires_at)
         VALUES ($1, $2, now() - interval '2 hours', now() - interval '1 hour')`,
        [email, hashOnboardingMaterial(token)],
      );
    } finally {
      await admin.end();
    }
    return token;
  }

  async function subjectCounts(subject: string, token: string) {
    const admin = new Client({ connectionString: environment.adminUrl });
    await admin.connect();
    try {
      return (
        await admin.query(
          `SELECT
             (SELECT count(*)::int FROM users WHERE external_subject = $1) AS users,
             (SELECT count(*)::int FROM workspaces w JOIN users u ON u.id = w.owner_user_id WHERE u.external_subject = $1) AS workspaces,
             (SELECT count(*)::int FROM accounts a JOIN workspaces w ON w.id = a.workspace_id JOIN users u ON u.id = w.owner_user_id WHERE u.external_subject = $1) AS accounts,
             (SELECT count(*)::int FROM onboarding_idempotency i JOIN users u ON u.id = i.user_id WHERE u.external_subject = $1) AS idempotency,
             (SELECT consumed_at IS NOT NULL FROM private_beta_invitations WHERE token_hash = $2) AS consumed`,
          [subject, hashOnboardingMaterial(token)],
        )
      ).rows[0];
    } finally {
      await admin.end();
    }
  }

  function input(subject: string, token: string, key = randomUUID()) {
    const tokenHash = hashOnboardingMaterial(token);
    return {
      externalSubject: subject,
      verifiedEmails: [`${subject}@example.test`],
      invitationTokenHash: tokenHash,
      idempotencyKey: key,
      requestFingerprint: hashOnboardingMaterial(
        `${tokenHash}:Tunai:cash:100000:${DATE}`,
      ),
      account: {
        name: "Tunai",
        type: "cash" as const,
        openingBalance: 100_000n,
        openingBalanceEffectiveDate: DATE,
      },
    };
  }

  it("atomically creates one User, private Workspace, and starter Account", async () => {
    const token = await issue("success@example.test");
    const result = await connection.onboarding.redeem(input("success", token));
    expect(result.replayed).toBe(false);

    const admin = new Client({ connectionString: environment.adminUrl });
    await admin.connect();
    try {
      const account = await admin.query(
        `SELECT name, type, opening_balance::text, total_balance::text,
                unallocated_balance::text, opening_balance_effective_date::text,
                lifecycle_status, is_starter
           FROM accounts WHERE id = $1`,
        [result.accountId],
      );
      expect(account.rows[0]).toEqual({
        name: "Tunai",
        type: "cash",
        opening_balance: "100000",
        total_balance: "100000",
        unallocated_balance: "100000",
        opening_balance_effective_date: DATE,
        lifecycle_status: "active",
        is_starter: true,
      });
      expect(
        await admin.query("SELECT count(*)::int AS count FROM workspaces"),
      ).toHaveProperty("rows.0.count", 1);
      expect(
        await admin.query(
          "SELECT to_regclass('public.categories') AS categories, to_regclass('public.financial_events') AS events",
        ),
      ).toHaveProperty("rows.0", { categories: null, events: null });
    } finally {
      await admin.end();
    }
  });

  it("returns the original committed result for an identical replay", async () => {
    const token = await issue("replay@example.test");
    const request = input("replay", token);
    const first = await connection.onboarding.redeem(request);
    const second = await connection.onboarding.redeem(request);
    expect(second).toEqual({ ...first, replayed: true });
    expect(await subjectCounts("replay", token)).toEqual({
      users: 1,
      workspaces: 1,
      accounts: 1,
      idempotency: 1,
      consumed: true,
    });
  });

  it("rejects the same idempotency key with changed material input", async () => {
    const token = await issue("conflict@example.test");
    const request = input("conflict", token);
    await connection.onboarding.redeem(request);
    await expect(
      connection.onboarding.redeem({
        ...request,
        requestFingerprint: hashOnboardingMaterial("changed"),
      }),
    ).rejects.toMatchObject({
      code: "IDEMPOTENCY_CONFLICT",
    });
    expect(await subjectCounts("conflict", token)).toEqual({
      users: 1,
      workspaces: 1,
      accounts: 1,
      idempotency: 1,
      consumed: true,
    });
  });

  it("does not create product rows for a verified-email mismatch", async () => {
    const token = await issue("invited@example.test");
    await expect(
      connection.onboarding.redeem(input("different", token)),
    ).rejects.toMatchObject({
      code: "INVITATION_EMAIL_MISMATCH",
    });
    const admin = new Client({ connectionString: environment.adminUrl });
    await admin.connect();
    try {
      const result = await admin.query(
        "SELECT count(*)::int AS count FROM users WHERE external_subject = 'different'",
      );
      expect(result.rows[0]?.count).toBe(0);
    } finally {
      await admin.end();
    }
  });

  it("blocks expired, revoked, and unverified-identity redemption", async () => {
    const expired = await issueExpired("expired@example.test");
    const revoked = await issue("revoked@example.test");
    const unverified = await issue("unverified@example.test");
    const operator = new Client({ connectionString: environment.operatorUrl });
    await operator.connect();
    try {
      await operator.query(
        "UPDATE private_beta_invitations SET revoked_at = now(), revoked_reason = 'operator_revoked' WHERE token_hash = $1",
        [hashOnboardingMaterial(revoked)],
      );
    } finally {
      await operator.end();
    }
    await expect(
      connection.onboarding.redeem(input("expired", expired)),
    ).rejects.toMatchObject({ code: "INVITATION_UNAVAILABLE" });
    await expect(
      connection.onboarding.redeem(input("revoked", revoked)),
    ).rejects.toMatchObject({ code: "INVITATION_UNAVAILABLE" });
    await expect(
      connection.onboarding.redeem({
        ...input("unverified", unverified),
        verifiedEmails: [],
      }),
    ).rejects.toMatchObject({ code: "INVITATION_EMAIL_MISMATCH" });
  });

  it("enforces expiry ordering in the database and accepts a future expiry", async () => {
    const admin = new Client({ connectionString: environment.adminUrl });
    await admin.connect();
    try {
      for (const expiresAt of [
        "2026-08-02T00:00:00.000Z",
        "2026-08-01T23:59:59.000Z",
      ]) {
        await expect(
          admin.query(
            `INSERT INTO private_beta_invitations
               (invited_email_normalized, token_hash, issued_at, expires_at)
             VALUES ('constraint@example.test', $1, '2026-08-02T00:00:00.000Z', $2)`,
            [hashOnboardingMaterial(randomUUID()), expiresAt],
          ),
        ).rejects.toMatchObject({ code: "23514" });
      }
      await expect(
        admin.query(
          `INSERT INTO private_beta_invitations
             (invited_email_normalized, token_hash, issued_at, expires_at)
           VALUES ('future@example.test', $1, '2026-08-02T00:00:00.000Z', '2026-08-02T00:00:01.000Z')`,
          [hashOnboardingMaterial(randomUUID())],
        ),
      ).resolves.toHaveProperty("rowCount", 1);
    } finally {
      await admin.end();
    }
  });

  it("uses PostgreSQL time for redemption rather than the application clock", async () => {
    const source = await import("node:fs/promises").then(({ readFile }) =>
      readFile(
        new URL("../src/runtime/onboarding-store.ts", import.meta.url),
        "utf8",
      ),
    );
    expect(source).not.toContain("Date.now");
    expect(source).toContain("expires_at <= now()");
  });

  it("rolls back every product and entitlement mutation on an unexpected database failure", async () => {
    const token = await issue("rollback@example.test");
    const request = input("rollback", token);
    await expect(
      connection.onboarding.redeem({
        ...request,
        account: { ...request.account, name: "   " },
      }),
    ).rejects.toThrow();

    const admin = new Client({ connectionString: environment.adminUrl });
    await admin.connect();
    try {
      const result = await admin.query(
        `SELECT
           (SELECT count(*)::int FROM users WHERE external_subject = 'rollback') AS users,
           (SELECT count(*)::int FROM workspaces w JOIN users u ON u.id = w.owner_user_id WHERE u.external_subject = 'rollback') AS workspaces,
           (SELECT consumed_at IS NULL FROM private_beta_invitations WHERE token_hash = $1) AS invitation_available`,
        [hashOnboardingMaterial(token)],
      );
      expect(result.rows[0]).toEqual({
        users: 0,
        workspaces: 0,
        invitation_available: true,
      });
    } finally {
      await admin.end();
    }
  });

  it.each(FAILPOINTS)(
    "rolls back %s and permits a clean retry",
    async (stage) => {
      const subject = `fail_${stage}`;
      const token = await issue(`${subject}@example.test`);
      const request = input(subject, token);
      const pool = new Pool({ connectionString: environment.applicationUrl });
      const failingStore = createOnboardingStoreWithTestFailpoint(pool, stage);
      try {
        await expect(failingStore.redeem(request)).rejects.toThrow(stage);
        expect(await subjectCounts(subject, token)).toEqual({
          users: 0,
          workspaces: 0,
          accounts: 0,
          idempotency: 0,
          consumed: false,
        });
      } finally {
        await pool.end();
      }
      await expect(
        connection.onboarding.redeem(request),
      ).resolves.toMatchObject({
        replayed: false,
      });
      expect(await subjectCounts(subject, token)).toEqual({
        users: 1,
        workspaces: 1,
        accounts: 1,
        idempotency: 1,
        consumed: true,
      });
    },
    15_000,
  );

  it("serializes a same-token race into one commit and one replay", async () => {
    const token = await issue("token_race@example.test");
    const request = input("token_race", token);
    const results = await Promise.all([
      connection.onboarding.redeem(request),
      connection.onboarding.redeem(request),
    ]);
    expect(results.filter((result) => !result.replayed)).toHaveLength(1);
    expect(results.filter((result) => result.replayed)).toHaveLength(1);
    expect(new Set(results.map((result) => result.workspaceId)).size).toBe(1);
    expect(await subjectCounts("token_race", token)).toEqual({
      users: 1,
      workspaces: 1,
      accounts: 1,
      idempotency: 1,
      consumed: true,
    });
  });

  it("serializes one token with different keys into one success and one finalized rejection", async () => {
    const token = await issue("token_keys@example.test");
    const settled = await Promise.allSettled([
      connection.onboarding.redeem(input("token_keys", token, randomUUID())),
      connection.onboarding.redeem(input("token_keys", token, randomUUID())),
    ]);
    expect(
      settled.filter((result) => result.status === "fulfilled"),
    ).toHaveLength(1);
    expect(
      settled.find((result) => result.status === "rejected"),
    ).toMatchObject({
      reason: { code: "ALREADY_ONBOARDED" },
    });
    expect(await subjectCounts("token_keys", token)).toMatchObject({
      users: 1,
      workspaces: 1,
      accounts: 1,
      idempotency: 1,
      consumed: true,
    });
  });

  it("allows only one subject to consume one invitation", async () => {
    const token = await issue("token_subject_a@example.test");
    const second = input("token_subject_b", token);
    const settled = await Promise.allSettled([
      connection.onboarding.redeem(input("token_subject_a", token)),
      connection.onboarding.redeem({
        ...second,
        verifiedEmails: ["token_subject_a@example.test"],
      }),
    ]);
    expect(
      settled.filter((result) => result.status === "fulfilled"),
    ).toHaveLength(1);
    expect(
      settled.find((result) => result.status === "rejected"),
    ).toMatchObject({
      reason: { code: "INVITATION_UNAVAILABLE" },
    });
    const admin = new Client({ connectionString: environment.adminUrl });
    await admin.connect();
    try {
      const counts = await admin.query(
        `SELECT count(*)::int AS users,
                (SELECT count(*)::int FROM workspaces w JOIN users u ON u.id = w.owner_user_id WHERE u.external_subject IN ('token_subject_a', 'token_subject_b')) AS workspaces,
                (SELECT count(*)::int FROM accounts a JOIN workspaces w ON w.id = a.workspace_id JOIN users u ON u.id = w.owner_user_id WHERE u.external_subject IN ('token_subject_a', 'token_subject_b')) AS accounts,
                (SELECT count(*)::int FROM onboarding_idempotency i JOIN users u ON u.id = i.user_id WHERE u.external_subject IN ('token_subject_a', 'token_subject_b')) AS idempotency,
                (SELECT count(*)::int FROM private_beta_invitations WHERE token_hash = $1 AND consumed_at IS NOT NULL) AS consumed
           FROM users WHERE external_subject IN ('token_subject_a', 'token_subject_b')`,
        [hashOnboardingMaterial(token)],
      );
      expect(counts.rows[0]).toEqual({
        users: 1,
        workspaces: 1,
        accounts: 1,
        idempotency: 1,
        consumed: 1,
      });
    } finally {
      await admin.end();
    }
  });

  it("allows only one Workspace when one subject races two valid invitations", async () => {
    const [firstToken, secondToken] = await Promise.all([
      issue("subject_race@example.test"),
      issue("subject_race@example.test"),
    ]);
    const settled = await Promise.allSettled([
      connection.onboarding.redeem(input("subject_race", firstToken)),
      connection.onboarding.redeem(input("subject_race", secondToken)),
    ]);
    expect(
      settled.filter((result) => result.status === "fulfilled"),
    ).toHaveLength(1);
    const rejected = settled.find((result) => result.status === "rejected");
    expect(rejected).toMatchObject({
      reason: { code: "ALREADY_ONBOARDED" },
    });
    const admin = new Client({ connectionString: environment.adminUrl });
    await admin.connect();
    try {
      const counts = await admin.query(
        `SELECT
           (SELECT count(*)::int FROM users WHERE external_subject = 'subject_race') AS users,
           (SELECT count(*)::int FROM workspaces w JOIN users u ON u.id = w.owner_user_id WHERE u.external_subject = 'subject_race') AS workspaces,
           (SELECT count(*)::int FROM accounts a JOIN workspaces w ON w.id = a.workspace_id JOIN users u ON u.id = w.owner_user_id WHERE u.external_subject = 'subject_race') AS accounts,
           (SELECT count(*)::int FROM onboarding_idempotency i JOIN users u ON u.id = i.user_id WHERE u.external_subject = 'subject_race') AS idempotency,
           (SELECT count(*)::int FROM private_beta_invitations WHERE token_hash IN ($1, $2) AND consumed_at IS NOT NULL) AS consumed`,
        [
          hashOnboardingMaterial(firstToken),
          hashOnboardingMaterial(secondToken),
        ],
      );
      expect(counts.rows[0]).toEqual({
        users: 1,
        workspaces: 1,
        accounts: 1,
        idempotency: 1,
        consumed: 1,
      });
    } finally {
      await admin.end();
    }
  });

  it("rejects a different idempotency key after a completed onboarding", async () => {
    const token = await issue("later_key@example.test");
    await connection.onboarding.redeem(input("later_key", token, randomUUID()));
    await expect(
      connection.onboarding.redeem(input("later_key", token, randomUUID())),
    ).rejects.toMatchObject({ code: "ALREADY_ONBOARDED" });
    expect(await subjectCounts("later_key", token)).toEqual({
      users: 1,
      workspaces: 1,
      accounts: 1,
      idempotency: 1,
      consumed: true,
    });
  });

  it("forces RLS and keeps both runtime and operator roles least-privileged", async () => {
    const application = new Client({
      connectionString: environment.applicationUrl,
    });
    const operator = new Client({ connectionString: environment.operatorUrl });
    await application.connect();
    await operator.connect();
    try {
      for (const table of [
        "users",
        "private_beta_invitations",
        "workspaces",
        "accounts",
      ]) {
        const result = await application.query(
          `SELECT count(*)::int AS count FROM ${table}`,
        );
        expect(result.rows[0]?.count).toBe(0);
      }
      await expect(
        application.query(
          "INSERT INTO private_beta_invitations (invited_email_normalized, token_hash) VALUES ('x@example.test', $1)",
          ["a".repeat(64)],
        ),
      ).rejects.toThrow();
      await expect(
        application.query("CREATE TABLE forbidden_runtime_ddl (id int)"),
      ).rejects.toThrow();
      for (const table of [
        "users",
        "workspaces",
        "accounts",
        "onboarding_idempotency",
        "application_sessions",
      ]) {
        await expect(
          operator.query(`SELECT * FROM ${table}`),
        ).rejects.toMatchObject({ code: "42501" });
      }

      await expect(
        application.query(
          "UPDATE users SET external_subject = 'stolen' WHERE external_subject = 'success'",
        ),
      ).rejects.toMatchObject({ code: "42501" });
      await expect(
        application.query(
          "UPDATE private_beta_invitations SET revoked_at = now(), revoked_reason = 'forbidden'",
        ),
      ).rejects.toMatchObject({ code: "42501" });
      await expect(
        operator.query(
          "UPDATE private_beta_invitations SET consumed_at = now() WHERE token_hash = $1",
          [hashOnboardingMaterial("not-present")],
        ),
      ).rejects.toMatchObject({ code: "42501" });
      await expect(
        operator.query(
          "SELECT invited_email_normalized FROM private_beta_invitations",
        ),
      ).rejects.toMatchObject({ code: "42501" });

      const own = await connection.onboarding.status("success");
      const other = await connection.onboarding.status("replay");
      expect(own).not.toBeNull();
      expect(other).not.toBeNull();
      await application.query("BEGIN");
      await application.query(
        "SELECT set_config('app.external_subject', 'success', true)",
      );
      const ownUser = await application.query<{ id: string }>(
        "SELECT id FROM users WHERE external_subject = 'success'",
      );
      await application.query("SELECT set_config('app.user_id', $1, true)", [
        ownUser.rows[0]?.id,
      ]);
      await application.query(
        "SELECT set_config('app.workspace_id', $1, true)",
        [other?.workspaceId],
      );
      const crossWorkspace = await application.query(
        "SELECT count(*)::int AS count FROM accounts",
      );
      expect(crossWorkspace.rows[0]?.count).toBe(0);
      await application.query("ROLLBACK");

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
        await application.query("ROLLBACK");
      }

      await application.query("BEGIN");
      await application.query(
        "SELECT set_config('app.user_id', 'not-a-uuid', true), set_config('app.workspace_id', 'also-not-a-uuid', true)",
      );
      await expect(
        application.query(
          `INSERT INTO workspaces (id, owner_user_id)
           VALUES ($1, $2)`,
          [randomUUID(), randomUUID()],
        ),
      ).rejects.toMatchObject({ code: "42501" });
      await application.query("ROLLBACK");

      await application.query("BEGIN");
      await application.query(
        "SELECT set_config('app.external_subject', 'success', true)",
      );
      await application.query("COMMIT");
      expect(
        (
          await application.query(
            "SELECT count(*)::int AS count FROM users WHERE external_subject = 'success'",
          )
        ).rows[0]?.count,
      ).toBe(0);

      await application.query("BEGIN");
      await application.query(
        "SELECT set_config('app.external_subject', 'success', true)",
      );
      await application.query("ROLLBACK");
      expect(
        (
          await application.query(
            "SELECT count(*)::int AS count FROM users WHERE external_subject = 'success'",
          )
        ).rows[0]?.count,
      ).toBe(0);

      await application.query("BEGIN");
      await application.query(
        "SELECT set_config('app.external_subject', 'success', true)",
      );
      const successUser = await application.query<{ id: string }>(
        "SELECT id FROM users WHERE external_subject = 'success'",
      );
      await application.query(
        "SELECT set_config('app.user_id', $1, true), set_config('app.workspace_id', $2, true)",
        [successUser.rows[0]?.id, own?.workspaceId],
      );
      expect(
        (
          await application.query(
            "SELECT count(*)::int AS count FROM accounts WHERE id = $1",
            [own?.accountId],
          )
        ).rows[0]?.count,
      ).toBe(1);
      expect(
        (
          await application.query(
            "SELECT count(*)::int AS count FROM accounts WHERE id = $1",
            [other?.accountId],
          )
        ).rows[0]?.count,
      ).toBe(0);
      await expect(
        application.query(
          `INSERT INTO accounts
             (id, workspace_id, name, type, opening_balance,
              opening_balance_effective_date, total_balance,
              unallocated_balance, is_starter)
           VALUES ($1, $2, 'cross', 'cash', 0, $3, 0, 0, false)`,
          [randomUUID(), other?.workspaceId, DATE],
        ),
      ).rejects.toMatchObject({ code: "42501" });
      await application.query("ROLLBACK");

      await application.query("BEGIN");
      await application.query(
        "SELECT set_config('app.external_subject', 'success', true)",
      );
      await application.query(
        "SELECT set_config('app.user_id', $1, true), set_config('app.workspace_id', $2, true)",
        [successUser.rows[0]?.id, own?.workspaceId],
      );
      await expect(
        application.query("UPDATE accounts SET name = 'cross' WHERE id = $1", [
          other?.accountId,
        ]),
      ).rejects.toMatchObject({ code: "42501" });
      await application.query("ROLLBACK");
      await expect(
        application.query("DELETE FROM accounts WHERE id = $1", [
          other?.accountId,
        ]),
      ).rejects.toMatchObject({ code: "42501" });

      await application.query("BEGIN");
      await application.query(
        "SELECT set_config('app.external_subject', 'replay', true)",
      );
      const replayUser = await application.query<{ id: string }>(
        "SELECT id FROM users WHERE external_subject = 'replay'",
      );
      await application.query(
        "SELECT set_config('app.user_id', $1, true), set_config('app.workspace_id', $2, true)",
        [replayUser.rows[0]?.id, other?.workspaceId],
      );
      expect(
        (
          await application.query(
            "SELECT count(*)::int AS count FROM accounts WHERE id = $1",
            [other?.accountId],
          )
        ).rows[0]?.count,
      ).toBe(1);
      expect(
        (
          await application.query(
            "SELECT count(*)::int AS count FROM accounts WHERE id = $1",
            [own?.accountId],
          )
        ).rows[0]?.count,
      ).toBe(0);
      await application.query("ROLLBACK");

      const policies = await new Client({
        connectionString: environment.adminUrl,
      });
      await policies.connect();
      try {
        const result = await policies.query(
          `SELECT c.relname, c.relrowsecurity, c.relforcerowsecurity
             FROM pg_class c
            WHERE c.relname IN ('users', 'private_beta_invitations', 'workspaces', 'accounts', 'onboarding_idempotency')`,
        );
        expect(result.rows).toHaveLength(5);
        expect(
          result.rows.every(
            (row) => row.relrowsecurity && row.relforcerowsecurity,
          ),
        ).toBe(true);

        const roles = await policies.query(
          `SELECT rolname, rolsuper, rolbypassrls, rolcreaterole, rolcreatedb
             FROM pg_roles
            WHERE rolname IN ('annotasi_migration', 'annotasi_application', 'annotasi_operator')
            ORDER BY rolname`,
        );
        expect(roles.rows).toHaveLength(3);
        expect(
          roles.rows.every(
            (role) =>
              !role.rolsuper &&
              !role.rolbypassrls &&
              !role.rolcreaterole &&
              !role.rolcreatedb,
          ),
        ).toBe(true);

        const owners = await policies.query(
          `SELECT c.relname, r.rolname AS owner
             FROM pg_class c
             JOIN pg_roles r ON r.oid = c.relowner
            WHERE c.relname IN ('users', 'private_beta_invitations', 'workspaces', 'accounts', 'onboarding_idempotency')`,
        );
        expect(
          owners.rows.every((row) => row.owner === "annotasi_migration"),
        ).toBe(true);

        const forbiddenColumns = await policies.query(
          `SELECT grantee, table_name, column_name, privilege_type
             FROM information_schema.column_privileges
            WHERE table_schema = 'public'
              AND ((grantee = 'annotasi_application'
                    AND table_name = 'private_beta_invitations'
                    AND privilege_type = 'UPDATE'
                    AND column_name IN ('token_hash', 'invited_email_normalized', 'expires_at', 'revoked_at', 'revoked_reason'))
                OR (grantee = 'annotasi_application'
                    AND table_name = 'users'
                    AND privilege_type = 'UPDATE'
                    AND column_name = 'external_subject')
                OR (grantee = 'annotasi_operator'
                    AND table_name = 'private_beta_invitations'
                    AND privilege_type = 'UPDATE'
                    AND column_name IN ('consumed_at', 'consumed_by_user_id', 'consumed_workspace_id', 'consumed_account_id')))`,
        );
        expect(forbiddenColumns.rows).toEqual([]);

        const allowedColumns = await policies.query(
          `SELECT grantee, column_name
             FROM information_schema.column_privileges
            WHERE table_schema = 'public'
              AND table_name = 'private_beta_invitations'
              AND privilege_type = 'UPDATE'
              AND grantee IN ('annotasi_application', 'annotasi_operator')`,
        );
        expect(allowedColumns.rows).toEqual(
          expect.arrayContaining([
            { grantee: "annotasi_application", column_name: "consumed_at" },
            {
              grantee: "annotasi_application",
              column_name: "consumed_by_user_id",
            },
            { grantee: "annotasi_operator", column_name: "revoked_at" },
            { grantee: "annotasi_operator", column_name: "revoked_reason" },
          ]),
        );
      } finally {
        await policies.end();
      }
    } finally {
      await application.end();
      await operator.end();
    }
  });
});
