import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const { Client, Pool } = pg;

export const POSTGRES_IMAGE = "postgres:17.10-alpine3.24";
export const MIGRATION_ROLE = "annotasi_migration";
export const APPLICATION_ROLE = "annotasi_application";
export const PROBE_TABLE = "foundation_workspace_scope_probe";

const MIGRATIONS_FOLDER = fileURLToPath(
  new URL("../migrations", import.meta.url),
);
const SAFE_PASSWORD = /^[A-Za-z0-9_-]{16,128}$/u;
const SAFE_IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]{0,62}$/u;

function assertSafePassword(password, label) {
  if (!SAFE_PASSWORD.test(password)) {
    throw new Error(
      `${label} must be 16-128 characters using only letters, digits, underscore, or hyphen.`,
    );
  }
}

function quoteIdentifier(identifier) {
  if (!SAFE_IDENTIFIER.test(identifier)) {
    throw new Error(`Unsafe PostgreSQL identifier: ${identifier}`);
  }

  return `"${identifier}"`;
}

export function createFoundationPassword(label) {
  return `${label}_${randomBytes(18).toString("hex")}`;
}

export function connectionUrlForRole(baseUrl, role, password, database) {
  const url = new URL(baseUrl);
  url.username = role;
  url.password = password;
  if (database !== undefined) {
    url.pathname = `/${database}`;
  }
  return url.toString();
}

export async function bootstrapRoles({
  adminUrl,
  migrationPassword,
  applicationPassword,
}) {
  assertSafePassword(migrationPassword, "Migration role password");
  assertSafePassword(applicationPassword, "Application role password");

  const admin = new Client({ connectionString: adminUrl });
  await admin.connect();

  try {
    const databaseResult = await admin.query(
      "SELECT current_database() AS name",
    );
    const databaseName = databaseResult.rows[0]?.name;
    if (typeof databaseName !== "string") {
      throw new Error("Unable to resolve the current PostgreSQL database.");
    }

    const databaseIdentifier = quoteIdentifier(databaseName);
    await admin.query(`
      DO $foundation_roles$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${MIGRATION_ROLE}') THEN
          CREATE ROLE ${quoteIdentifier(MIGRATION_ROLE)};
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${APPLICATION_ROLE}') THEN
          CREATE ROLE ${quoteIdentifier(APPLICATION_ROLE)};
        END IF;
      END
      $foundation_roles$;
    `);
    await admin.query(`
      ALTER ROLE ${quoteIdentifier(MIGRATION_ROLE)} WITH
        LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS
        PASSWORD '${migrationPassword}'
    `);
    await admin.query(`
      ALTER ROLE ${quoteIdentifier(APPLICATION_ROLE)} WITH
        LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS
        PASSWORD '${applicationPassword}'
    `);
    await admin.query(
      `REVOKE CONNECT, TEMPORARY ON DATABASE ${databaseIdentifier} FROM PUBLIC`,
    );
    await admin.query(
      `GRANT CONNECT, CREATE ON DATABASE ${databaseIdentifier} TO ${quoteIdentifier(MIGRATION_ROLE)}`,
    );
    await admin.query(
      `GRANT CONNECT ON DATABASE ${databaseIdentifier} TO ${quoteIdentifier(APPLICATION_ROLE)}`,
    );
    await admin.query("REVOKE CREATE ON SCHEMA public FROM PUBLIC");
    await admin.query(
      `GRANT USAGE, CREATE ON SCHEMA public TO ${quoteIdentifier(MIGRATION_ROLE)}`,
    );
    await admin.query(
      `GRANT USAGE ON SCHEMA public TO ${quoteIdentifier(APPLICATION_ROLE)}`,
    );

    return { databaseName };
  } finally {
    await admin.end();
  }
}

export async function runMigrations(migrationUrl) {
  const pool = new Pool({ connectionString: migrationUrl, max: 1 });

  try {
    const before = await migrationCount(pool);
    await migrate(drizzle(pool), { migrationsFolder: MIGRATIONS_FOLDER });
    const after = await migrationCount(pool);
    return { before, after, applied: after - before };
  } finally {
    await pool.end();
  }
}

async function migrationCount(pool) {
  const relation = await pool.query(
    "SELECT to_regclass('drizzle.__drizzle_migrations') AS name",
  );
  if (relation.rows[0]?.name === null) {
    return 0;
  }

  const result = await pool.query(
    "SELECT count(*)::integer AS count FROM drizzle.__drizzle_migrations",
  );
  const count = result.rows[0]?.count;
  if (typeof count !== "number") {
    throw new Error("Unable to determine the Drizzle migration count.");
  }
  return count;
}

export async function createEmptyDatabase(adminUrl, databaseName) {
  const databaseIdentifier = quoteIdentifier(databaseName);
  const admin = new Client({ connectionString: adminUrl });
  await admin.connect();
  try {
    await admin.query(`CREATE DATABASE ${databaseIdentifier}`);
  } finally {
    await admin.end();
  }
  return connectionUrlForRole(
    adminUrl,
    new URL(adminUrl).username,
    new URL(adminUrl).password,
    databaseName,
  );
}
