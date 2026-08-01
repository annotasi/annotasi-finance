import pg from "pg";

const { Client } = pg;
const migrationUrl = process.env.DATABASE_MIGRATION_URL;
if (migrationUrl === undefined || migrationUrl === "") {
  throw new Error("DATABASE_MIGRATION_URL is required for verification.");
}

const client = new Client({ connectionString: migrationUrl });
await client.connect();
try {
  const result = await client.query(`
    SELECT
      current_setting('server_version') AS server_version,
      (SELECT count(*)::integer FROM drizzle.__drizzle_migrations) AS migrations,
      (SELECT count(*)::integer FROM pg_policies WHERE tablename = 'foundation_workspace_scope_probe') AS policies
  `);
  const row = result.rows[0];
  process.stdout.write(
    `Database verification: PostgreSQL ${row?.server_version}, migrations=${row?.migrations}, policies=${row?.policies}.\n`,
  );
} finally {
  await client.end();
}
