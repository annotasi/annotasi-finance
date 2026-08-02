import { PostgreSqlContainer } from "@testcontainers/postgresql";
import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";

import {
  APPLICATION_ROLE,
  MIGRATION_ROLE,
  OPERATOR_ROLE,
  POSTGRES_IMAGE,
  bootstrapRoles,
  connectionUrlForRole,
  createFoundationPassword,
  runMigrations,
} from "../../scripts/database-foundation.mjs";

export interface FoundationEnvironment {
  container: StartedPostgreSqlContainer;
  adminUrl: string;
  migrationUrl: string;
  applicationUrl: string;
  operatorUrl: string;
  migrationPassword: string;
  applicationPassword: string;
  operatorPassword: string;
  firstMigration: { before: number; after: number; applied: number };
}

export async function startFoundationEnvironment(): Promise<FoundationEnvironment> {
  const adminPassword = createFoundationPassword("admin");
  const migrationPassword = createFoundationPassword("migration");
  const applicationPassword = createFoundationPassword("application");
  const operatorPassword = createFoundationPassword("operator");
  const container = await new PostgreSqlContainer(POSTGRES_IMAGE)
    .withDatabase("annotasi_foundation")
    .withUsername("foundation_admin")
    .withPassword(adminPassword)
    .withStartupTimeout(120_000)
    .start();
  const adminUrl = container.getConnectionUri();

  await bootstrapRoles({
    adminUrl,
    migrationPassword,
    applicationPassword,
    operatorPassword,
  });

  const migrationUrl = connectionUrlForRole(
    adminUrl,
    MIGRATION_ROLE,
    migrationPassword,
  );
  const applicationUrl = connectionUrlForRole(
    adminUrl,
    APPLICATION_ROLE,
    applicationPassword,
  );
  const operatorUrl = connectionUrlForRole(
    adminUrl,
    OPERATOR_ROLE,
    operatorPassword,
  );
  const firstMigration = await runMigrations(migrationUrl);

  return {
    container,
    adminUrl,
    migrationUrl,
    applicationUrl,
    operatorUrl,
    migrationPassword,
    applicationPassword,
    operatorPassword,
    firstMigration,
  };
}
