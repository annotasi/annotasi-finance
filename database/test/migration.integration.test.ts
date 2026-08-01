import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  MIGRATION_ROLE,
  bootstrapRoles,
  connectionUrlForRole,
  createEmptyDatabase,
  runMigrations,
} from "../scripts/database-foundation.mjs";
import {
  type FoundationEnvironment,
  startFoundationEnvironment,
} from "./support/foundation-environment.js";

const { Client } = pg;

describe("database foundation migration history", () => {
  let environment: FoundationEnvironment;

  beforeAll(async () => {
    environment = await startFoundationEnvironment();
  });

  afterAll(async () => {
    await environment?.container.stop();
  });

  it("applies the complete reviewed history to an empty PostgreSQL 17.10 database", async () => {
    expect(environment.firstMigration).toEqual({
      before: 0,
      after: 1,
      applied: 1,
    });

    const client = new Client({ connectionString: environment.migrationUrl });
    await client.connect();
    try {
      const result = await client.query(
        "SELECT current_setting('server_version') AS version, to_regclass('public.foundation_workspace_scope_probe') AS probe",
      );
      expect(result.rows[0]).toMatchObject({
        version: expect.stringMatching(/^17\.10(?:\s|$)/u),
        probe: "foundation_workspace_scope_probe",
      });
    } finally {
      await client.end();
    }
  });

  it("makes a repeated migration command a tracked no-op", async () => {
    await expect(runMigrations(environment.migrationUrl)).resolves.toEqual({
      before: 1,
      after: 1,
      applied: 0,
    });
  });

  it("replays the complete history into a second fresh empty database", async () => {
    const secondAdminUrl = await createEmptyDatabase(
      environment.adminUrl,
      "annotasi_foundation_replay",
    );
    await bootstrapRoles({
      adminUrl: secondAdminUrl,
      migrationPassword: environment.migrationPassword,
      applicationPassword: environment.applicationPassword,
    });
    const secondMigrationUrl = connectionUrlForRole(
      secondAdminUrl,
      MIGRATION_ROLE,
      environment.migrationPassword,
    );

    await expect(runMigrations(secondMigrationUrl)).resolves.toEqual({
      before: 0,
      after: 1,
      applied: 1,
    });
  });
});
