import { defineConfig } from "drizzle-kit";

const migrationUrl = process.env["DATABASE_MIGRATION_URL"];

export default defineConfig({
  dialect: "postgresql",
  schema: [
    "./schema/foundation-probe.ts",
    "./schema/application-sessions.ts",
    "./schema/onboarding.ts",
  ],
  out: "./migrations",
  strict: true,
  verbose: true,
  ...(migrationUrl === undefined
    ? {}
    : { dbCredentials: { url: migrationUrl } }),
});
