import { bootstrapRoles, runMigrations } from "./database-foundation.mjs";

const required = [
  "DATABASE_ADMIN_URL",
  "DATABASE_MIGRATION_URL",
  "DATABASE_MIGRATION_PASSWORD",
  "DATABASE_APPLICATION_PASSWORD",
  "DATABASE_OPERATOR_PASSWORD",
];

for (const name of required) {
  if (process.env[name] === undefined || process.env[name] === "") {
    throw new Error(`${name} is required for local database migration.`);
  }
}

await bootstrapRoles({
  adminUrl: process.env.DATABASE_ADMIN_URL,
  migrationPassword: process.env.DATABASE_MIGRATION_PASSWORD,
  applicationPassword: process.env.DATABASE_APPLICATION_PASSWORD,
  operatorPassword: process.env.DATABASE_OPERATOR_PASSWORD,
});
const result = await runMigrations(process.env.DATABASE_MIGRATION_URL);

process.stdout.write(
  result.applied === 0
    ? `Database migration history already current (${result.after} migration).\n`
    : `Applied ${result.applied} database migration (${result.after} total).\n`,
);
