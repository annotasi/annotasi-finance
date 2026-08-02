import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  createSessionStoreConnection,
  SessionStore,
} from "../src/runtime/index.js";
import {
  type FoundationEnvironment,
  startFoundationEnvironment,
} from "./support/foundation-environment.js";

const { Client } = pg;

function futureDate(seconds: number): Date {
  return new Date(Date.now() + seconds * 1000);
}

function pastDate(seconds: number): Date {
  return new Date(Date.now() - seconds * 1000);
}

describe("application_sessions runtime evidence", () => {
  let environment: FoundationEnvironment;

  beforeAll(async () => {
    environment = await startFoundationEnvironment();
  });

  afterAll(async () => {
    await environment?.container.stop();
  });

  it("persists and resolves an active session via the runtime-safe store", async () => {
    const connection = createSessionStoreConnection(environment.applicationUrl);
    const store = new SessionStore(connection.db);
    try {
      await store.create({
        tokenHash: "hash-persisted-lookup",
        externalSubject: "user_persist",
        providerSessionId: "sess_persist",
        expiresAt: futureDate(3600),
      });

      const session = await store.findActiveByTokenHash(
        "hash-persisted-lookup",
      );
      expect(session?.externalSubject).toBe("user_persist");
      expect(session?.providerSessionId).toBe("sess_persist");
    } finally {
      await connection.close();
    }
  });

  it("does not persist the raw token — only its hash", async () => {
    const connection = createSessionStoreConnection(environment.applicationUrl);
    const client = new Client({ connectionString: environment.applicationUrl });
    await client.connect();
    try {
      const store = new SessionStore(connection.db);
      await store.create({
        tokenHash: "hash-no-raw-token",
        externalSubject: "user_no_raw",
        providerSessionId: null,
        expiresAt: futureDate(3600),
      });

      const columns = await client.query(
        "SELECT column_name FROM information_schema.columns WHERE table_name = 'application_sessions'",
      );
      const columnNames = columns.rows.map(
        (row: { column_name: string }) => row.column_name,
      );
      expect(columnNames).toContain("token_hash");
      expect(columnNames).not.toContain("token");
      expect(columnNames).not.toContain("raw_token");
    } finally {
      await client.end();
      await connection.close();
    }
  });

  it("treats an expired session as not found", async () => {
    const connection = createSessionStoreConnection(environment.applicationUrl);
    const store = new SessionStore(connection.db);
    try {
      await store.create({
        tokenHash: "hash-expired",
        externalSubject: "user_expired",
        providerSessionId: null,
        expiresAt: pastDate(1),
      });

      expect(await store.findActiveByTokenHash("hash-expired")).toBeNull();
    } finally {
      await connection.close();
    }
  });

  it("treats a revoked session as not found after revokeById", async () => {
    const connection = createSessionStoreConnection(environment.applicationUrl);
    const store = new SessionStore(connection.db);
    try {
      const { id } = await store.create({
        tokenHash: "hash-revoked",
        externalSubject: "user_revoked",
        providerSessionId: null,
        expiresAt: futureDate(3600),
      });

      await store.revokeById(id, "user_logout");
      expect(await store.findActiveByTokenHash("hash-revoked")).toBeNull();
    } finally {
      await connection.close();
    }
  });

  it("rejects a forged or unknown token hash", async () => {
    const connection = createSessionStoreConnection(environment.applicationUrl);
    const store = new SessionStore(connection.db);
    try {
      expect(
        await store.findActiveByTokenHash("hash-never-created"),
      ).toBeNull();
    } finally {
      await connection.close();
    }
  });

  it("revokes only sessions belonging to the target subject", async () => {
    const connection = createSessionStoreConnection(environment.applicationUrl);
    const store = new SessionStore(connection.db);
    try {
      await store.create({
        tokenHash: "hash-subject-a-1",
        externalSubject: "user_subject_a",
        providerSessionId: null,
        expiresAt: futureDate(3600),
      });
      await store.create({
        tokenHash: "hash-subject-a-2",
        externalSubject: "user_subject_a",
        providerSessionId: null,
        expiresAt: futureDate(3600),
      });
      await store.create({
        tokenHash: "hash-subject-b-1",
        externalSubject: "user_subject_b",
        providerSessionId: null,
        expiresAt: futureDate(3600),
      });

      const revokedCount = await store.revokeAllForSubject(
        "user_subject_a",
        "user_logout_all",
      );

      expect(revokedCount).toBe(2);
      expect(await store.findActiveByTokenHash("hash-subject-a-1")).toBeNull();
      expect(await store.findActiveByTokenHash("hash-subject-a-2")).toBeNull();
      expect(
        (await store.findActiveByTokenHash("hash-subject-b-1"))
          ?.externalSubject,
      ).toBe("user_subject_b");
    } finally {
      await connection.close();
    }
  });

  it("resolves persisted state correctly from an entirely new connection (restart-safe)", async () => {
    const writer = createSessionStoreConnection(environment.applicationUrl);
    try {
      const writerStore = new SessionStore(writer.db);
      await writerStore.create({
        tokenHash: "hash-restart-safe",
        externalSubject: "user_restart",
        providerSessionId: null,
        expiresAt: futureDate(3600),
      });
    } finally {
      await writer.close();
    }

    // A brand-new connection/instance, simulating a fresh API process.
    const reader = createSessionStoreConnection(environment.applicationUrl);
    try {
      const readerStore = new SessionStore(reader.db);
      const session =
        await readerStore.findActiveByTokenHash("hash-restart-safe");
      expect(session?.externalSubject).toBe("user_restart");
    } finally {
      await reader.close();
    }
  });

  it("grants the application role only SELECT, INSERT, and UPDATE on application_sessions", async () => {
    const client = new Client({ connectionString: environment.applicationUrl });
    await client.connect();
    try {
      const privileges = await client.query(
        `SELECT privilege_type FROM information_schema.role_table_grants
         WHERE table_name = 'application_sessions' AND grantee = current_user
         ORDER BY privilege_type`,
      );
      const grantedPrivileges = privileges.rows.map(
        (row: { privilege_type: string }) => row.privilege_type,
      );

      expect(grantedPrivileges).toEqual(["INSERT", "SELECT", "UPDATE"]);

      await expect(
        client.query("DELETE FROM application_sessions WHERE 1 = 0"),
      ).rejects.toMatchObject({ code: "42501" });
      await expect(
        client.query(
          "ALTER TABLE application_sessions ADD COLUMN forbidden text",
        ),
      ).rejects.toMatchObject({ code: "42501" });
      await expect(
        client.query("DROP TABLE application_sessions"),
      ).rejects.toMatchObject({ code: "42501" });
    } finally {
      await client.end();
    }
  });
});
