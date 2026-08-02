import { PostgreSqlContainer } from "@testcontainers/postgresql";
import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";

interface FoundationModule {
  readonly APPLICATION_ROLE: string;
  readonly MIGRATION_ROLE: string;
  readonly OPERATOR_ROLE: string;
  readonly POSTGRES_IMAGE: string;
  bootstrapRoles(input: {
    adminUrl: string;
    migrationPassword: string;
    applicationPassword: string;
    operatorPassword: string;
  }): Promise<void>;
  connectionUrlForRole(
    adminUrl: string,
    role: string,
    password: string,
  ): string;
  createFoundationPassword(label: string): string;
  runMigrations(url: string): Promise<unknown>;
}

export interface ApiFoundationEnvironment {
  readonly container: StartedPostgreSqlContainer;
  readonly adminUrl: string;
  readonly applicationUrl: string;
  readonly operatorUrl: string;
}

export async function startApiFoundationEnvironment(): Promise<ApiFoundationEnvironment> {
  const foundationUrl = new URL(
    "../../../../database/scripts/database-foundation.mjs",
    import.meta.url,
  ).href;
  const foundation = (await import(foundationUrl)) as FoundationModule;
  const adminPassword = foundation.createFoundationPassword("api-admin");
  const migrationPassword =
    foundation.createFoundationPassword("api-migration");
  const applicationPassword =
    foundation.createFoundationPassword("api-application");
  const operatorPassword = foundation.createFoundationPassword("api-operator");
  const container = await new PostgreSqlContainer(foundation.POSTGRES_IMAGE)
    .withDatabase("annotasi_onboarding_http")
    .withUsername("foundation_admin")
    .withPassword(adminPassword)
    .withStartupTimeout(120_000)
    .start();
  const adminUrl = container.getConnectionUri();

  await foundation.bootstrapRoles({
    adminUrl,
    migrationPassword,
    applicationPassword,
    operatorPassword,
  });
  const migrationUrl = foundation.connectionUrlForRole(
    adminUrl,
    foundation.MIGRATION_ROLE,
    migrationPassword,
  );
  const applicationUrl = foundation.connectionUrlForRole(
    adminUrl,
    foundation.APPLICATION_ROLE,
    applicationPassword,
  );
  const operatorUrl = foundation.connectionUrlForRole(
    adminUrl,
    foundation.OPERATOR_ROLE,
    operatorPassword,
  );
  await foundation.runMigrations(migrationUrl);

  return { container, adminUrl, applicationUrl, operatorUrl };
}
