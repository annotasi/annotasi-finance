import { sql } from "drizzle-orm";
import {
  check,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Annotasi Finance's own opaque, server-side application session.
 *
 * This is a technical session table, not a User, Workspace, entitlement, or
 * financial table. It is pre-Workspace and therefore carries no Workspace
 * scope and no Workspace-scoped Row-Level Security policy.
 */
export const applicationSessions = pgTable(
  "application_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tokenHash: text("token_hash").notNull(),
    externalSubject: text("external_subject").notNull(),
    providerSessionId: text("provider_session_id"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    lastUsedAt: timestamp("last_used_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true, mode: "date" }),
    revokedReason: text("revoked_reason"),
  },
  (table) => [
    uniqueIndex("application_sessions_token_hash_key").on(table.tokenHash),
    index("application_sessions_subject_idx").on(table.externalSubject),
    index("application_sessions_expires_at_idx").on(table.expiresAt),
    index("application_sessions_provider_session_idx").on(
      table.providerSessionId,
    ),
    check(
      "application_sessions_revocation_state",
      sql`(${table.revokedAt} IS NULL AND ${table.revokedReason} IS NULL) OR (${table.revokedAt} IS NOT NULL AND ${table.revokedReason} IS NOT NULL)`,
    ),
  ],
);
