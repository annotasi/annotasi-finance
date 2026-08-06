import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import { applicationSessions } from "../../schema/application-sessions.js";
import { AccountStore } from "./account-store.js";
import { OnboardingStore } from "./onboarding-store.js";

const { Pool } = pg;

const runtimeSchema = { applicationSessions };

export type SessionStoreClient = ReturnType<
  typeof drizzle<typeof runtimeSchema>
>;

export interface SessionStoreConnection {
  readonly db: SessionStoreClient;
  readonly onboarding: OnboardingStore;
  readonly account: AccountStore;
  close(): Promise<void>;
}

/**
 * Creates a runtime-only PostgreSQL connection for session storage.
 *
 * The caller must supply the application role's connection string
 * (DATABASE_APPLICATION_URL). This module never reads migration or admin
 * credentials and performs no schema changes.
 */
export function createSessionStoreConnection(
  connectionUrl: string,
): SessionStoreConnection {
  const pool = new Pool({ connectionString: connectionUrl });
  const db = drizzle(pool, { schema: runtimeSchema });

  return {
    db,
    onboarding: new OnboardingStore(pool),
    account: new AccountStore(pool),
    close: () => pool.end(),
  };
}
