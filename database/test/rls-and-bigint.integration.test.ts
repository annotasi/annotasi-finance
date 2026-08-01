import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  APPLICATION_ROLE,
  PROBE_TABLE,
} from "../scripts/database-foundation.mjs";
import {
  type FoundationEnvironment,
  startFoundationEnvironment,
} from "./support/foundation-environment.js";

const { Client, Pool } = pg;
const WORKSPACE_A = "11111111-1111-4111-8111-111111111111";
const WORKSPACE_B = "22222222-2222-4222-8222-222222222222";
const ROW_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const ROW_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const ABOVE_SAFE_INTEGER = "9007199254740993";

async function applicationClient(url: string): Promise<pg.Client> {
  const client = new Client({ connectionString: url });
  await client.connect();
  return client;
}

async function setWorkspace(
  client: pg.Client,
  workspaceId: string,
): Promise<void> {
  await client.query("SELECT set_config('app.workspace_id', $1, true)", [
    workspaceId,
  ]);
}

async function insertProbe(
  client: pg.Client,
  values: {
    id: string;
    workspaceId: string;
    marker: string;
    exactValue: string;
  },
): Promise<void> {
  await client.query(
    `INSERT INTO ${PROBE_TABLE} (id, workspace_id, marker, exact_integer_value)
     VALUES ($1::uuid, $2::uuid, $3, $4::bigint)`,
    [values.id, values.workspaceId, values.marker, values.exactValue],
  );
}

describe("database foundation RLS and exact BIGINT evidence", () => {
  let environment: FoundationEnvironment;

  beforeAll(async () => {
    environment = await startFoundationEnvironment();
  });

  afterAll(async () => {
    await environment?.container.stop();
  });

  it("keeps the application role non-privileged and a non-owner", async () => {
    const client = await applicationClient(environment.applicationUrl);
    try {
      const role = await client.query(
        "SELECT rolsuper, rolbypassrls FROM pg_roles WHERE rolname = current_user",
      );
      const ownership = await client.query(
        `SELECT owner.rolname AS owner
         FROM pg_class AS relation
         JOIN pg_roles AS owner ON owner.oid = relation.relowner
         WHERE relation.oid = $1::regclass`,
        [PROBE_TABLE],
      );
      const privileges = await client.query(
        `SELECT
           has_database_privilege(current_user, current_database(), 'CREATE') AS can_create_database_object,
           has_schema_privilege(current_user, 'public', 'CREATE') AS can_create_in_schema`,
      );

      expect(role.rows[0]).toEqual({ rolsuper: false, rolbypassrls: false });
      expect(ownership.rows[0]?.owner).not.toBe(APPLICATION_ROLE);
      expect(privileges.rows[0]).toEqual({
        can_create_database_object: false,
        can_create_in_schema: false,
      });
    } finally {
      await client.end();
    }
  });

  it("rejects application-role schema creation, alteration, and deletion", async () => {
    const client = await applicationClient(environment.applicationUrl);
    try {
      await expect(
        client.query("CREATE TABLE foundation_forbidden_create (id integer)"),
      ).rejects.toMatchObject({ code: "42501" });
      await expect(
        client.query(`ALTER TABLE ${PROBE_TABLE} ADD COLUMN forbidden text`),
      ).rejects.toMatchObject({ code: "42501" });
      await expect(
        client.query(`DROP TABLE ${PROBE_TABLE}`),
      ).rejects.toMatchObject({ code: "42501" });
    } finally {
      await client.end();
    }
  });

  it("denies reads and inserts when Workspace context is absent", async () => {
    const client = await applicationClient(environment.applicationUrl);
    try {
      const rows = await client.query(`SELECT id FROM ${PROBE_TABLE}`);
      expect(rows.rowCount).toBe(0);
      await expect(
        insertProbe(client, {
          id: ROW_A,
          workspaceId: WORKSPACE_A,
          marker: "no-context",
          exactValue: "1",
        }),
      ).rejects.toMatchObject({ code: "42501" });
    } finally {
      await client.end();
    }
  });

  it("allows matching Workspace writes while denying cross-Workspace writes and reads", async () => {
    const clientA = await applicationClient(environment.applicationUrl);
    const clientB = await applicationClient(environment.applicationUrl);
    try {
      await clientA.query("BEGIN");
      await setWorkspace(clientA, WORKSPACE_A);
      await insertProbe(clientA, {
        id: ROW_A,
        workspaceId: WORKSPACE_A,
        marker: "workspace-a",
        exactValue: ABOVE_SAFE_INTEGER,
      });
      await expect(
        insertProbe(clientA, {
          id: ROW_B,
          workspaceId: WORKSPACE_B,
          marker: "cross-workspace",
          exactValue: "2",
        }),
      ).rejects.toMatchObject({ code: "42501" });
      await clientA.query("ROLLBACK");

      await clientA.query("BEGIN");
      await setWorkspace(clientA, WORKSPACE_A);
      await insertProbe(clientA, {
        id: ROW_A,
        workspaceId: WORKSPACE_A,
        marker: "workspace-a",
        exactValue: ABOVE_SAFE_INTEGER,
      });
      await clientA.query("COMMIT");

      await clientB.query("BEGIN");
      await setWorkspace(clientB, WORKSPACE_B);
      await insertProbe(clientB, {
        id: ROW_B,
        workspaceId: WORKSPACE_B,
        marker: "workspace-b",
        exactValue: "2",
      });
      const visibleToB = await clientB.query(
        `SELECT workspace_id FROM ${PROBE_TABLE} ORDER BY workspace_id`,
      );
      expect(visibleToB.rows).toEqual([{ workspace_id: WORKSPACE_B }]);
      await clientB.query("COMMIT");

      await clientA.query("BEGIN");
      await setWorkspace(clientA, WORKSPACE_A);
      const visibleToA = await clientA.query(
        `SELECT workspace_id, exact_integer_value FROM ${PROBE_TABLE} ORDER BY workspace_id`,
      );
      expect(visibleToA.rows).toEqual([
        {
          workspace_id: WORKSPACE_A,
          exact_integer_value: ABOVE_SAFE_INTEGER,
        },
      ]);
      expect(typeof visibleToA.rows[0]?.exact_integer_value).toBe("string");
      await clientA.query("COMMIT");
    } finally {
      await clientA.end();
      await clientB.end();
    }
  });

  it("clears transaction-local Workspace context on a reused connection", async () => {
    const pool = new Pool({
      connectionString: environment.applicationUrl,
      max: 1,
    });
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await setWorkspace(client, WORKSPACE_A);
      expect(
        (await client.query(`SELECT id FROM ${PROBE_TABLE}`)).rowCount,
      ).toBe(1);
      await client.query("COMMIT");

      expect(
        (await client.query(`SELECT id FROM ${PROBE_TABLE}`)).rowCount,
      ).toBe(0);
      await client.query("BEGIN");
      expect(
        (await client.query(`SELECT id FROM ${PROBE_TABLE}`)).rowCount,
      ).toBe(0);
      await client.query("ROLLBACK");
    } finally {
      client.release();
      await pool.end();
    }
  });
});
