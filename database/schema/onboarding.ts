import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  date,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    externalSubject: text("external_subject").notNull(),
    verifiedEmailNormalized: text("verified_email_normalized").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("users_external_subject_key").on(table.externalSubject),
    check(
      "users_external_subject_length",
      sql`char_length(${table.externalSubject}) BETWEEN 1 AND 255`,
    ),
    check(
      "users_verified_email_length",
      sql`char_length(${table.verifiedEmailNormalized}) BETWEEN 3 AND 254`,
    ),
  ],
);

export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerUserId: uuid("owner_user_id")
      .notNull()
      .references(() => users.id),
    currency: text("currency").notNull().default("IDR"),
    timezone: text("timezone").notNull().default("Asia/Jakarta"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("workspaces_owner_user_id_key").on(table.ownerUserId),
    check("workspaces_currency_idr", sql`${table.currency} = 'IDR'`),
    check(
      "workspaces_timezone_jakarta",
      sql`${table.timezone} = 'Asia/Jakarta'`,
    ),
  ],
);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    name: text("name").notNull(),
    type: text("type").notNull(),
    openingBalance: bigint("opening_balance", { mode: "bigint" }).notNull(),
    openingBalanceEffectiveDate: date("opening_balance_effective_date", {
      mode: "string",
    }).notNull(),
    totalBalance: bigint("total_balance", { mode: "bigint" }).notNull(),
    unallocatedBalance: bigint("unallocated_balance", {
      mode: "bigint",
    }).notNull(),
    lifecycleStatus: text("lifecycle_status").notNull().default("active"),
    isStarter: boolean("is_starter").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    version: bigint("version", { mode: "bigint" })
      .notNull()
      .default(sql`1`),
  },
  (table) => [
    index("accounts_workspace_id_idx").on(table.workspaceId),
    uniqueIndex("accounts_one_starter_per_workspace")
      .on(table.workspaceId)
      .where(sql`${table.isStarter}`),
    check(
      "accounts_name_length",
      sql`char_length(btrim(${table.name})) BETWEEN 1 AND 100`,
    ),
    check(
      "accounts_type",
      sql`${table.type} IN ('cash', 'bank_account', 'e_wallet', 'other')`,
    ),
    check("accounts_nonnegative_opening", sql`${table.openingBalance} >= 0`),
    check("accounts_nonnegative_total", sql`${table.totalBalance} >= 0`),
    check(
      "accounts_nonnegative_unallocated",
      sql`${table.unallocatedBalance} >= 0`,
    ),
    check(
      "accounts_lifecycle",
      sql`${table.lifecycleStatus} IN ('active', 'archived')`,
    ),
    check(
      "accounts_archived_at_consistency",
      sql`(${table.lifecycleStatus} = 'active' AND ${table.archivedAt} IS NULL) OR (${table.lifecycleStatus} = 'archived' AND ${table.archivedAt} IS NOT NULL AND ${table.totalBalance} = 0)`,
    ),
    check("accounts_version_positive", sql`${table.version} >= 1`),
    check(
      "accounts_unallocated_le_total",
      sql`${table.unallocatedBalance} <= ${table.totalBalance}`,
    ),
  ],
);

export const privateBetaInvitations = pgTable(
  "private_beta_invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    invitedEmailNormalized: text("invited_email_normalized").notNull(),
    tokenHash: text("token_hash").notNull(),
    issuedAt: timestamp("issued_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    revokedReason: text("revoked_reason"),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    consumedByUserId: uuid("consumed_by_user_id").references(() => users.id),
    consumedWorkspaceId: uuid("consumed_workspace_id").references(
      () => workspaces.id,
    ),
    consumedAccountId: uuid("consumed_account_id").references(
      () => accounts.id,
    ),
  },
  (table) => [
    uniqueIndex("private_beta_invitations_token_hash_key").on(table.tokenHash),
    index("private_beta_invitations_email_idx").on(
      table.invitedEmailNormalized,
    ),
    check(
      "private_beta_invitations_token_hash_format",
      sql`${table.tokenHash} ~ '^[0-9a-f]{64}$'`,
    ),
    check(
      "private_beta_invitations_email_length",
      sql`char_length(${table.invitedEmailNormalized}) BETWEEN 3 AND 254`,
    ),
    check(
      "private_beta_invitations_expiry_after_issue",
      sql`${table.expiresAt} IS NULL OR ${table.expiresAt} > ${table.issuedAt}`,
    ),
    check(
      "private_beta_invitations_revocation_state",
      sql`(${table.revokedAt} IS NULL AND ${table.revokedReason} IS NULL) OR (${table.revokedAt} IS NOT NULL AND ${table.revokedReason} IS NOT NULL)`,
    ),
    check(
      "private_beta_invitations_consumption_state",
      sql`(${table.consumedAt} IS NULL AND ${table.consumedByUserId} IS NULL AND ${table.consumedWorkspaceId} IS NULL AND ${table.consumedAccountId} IS NULL) OR (${table.consumedAt} IS NOT NULL AND ${table.consumedByUserId} IS NOT NULL AND ${table.consumedWorkspaceId} IS NOT NULL AND ${table.consumedAccountId} IS NOT NULL)`,
    ),
    check(
      "private_beta_invitations_not_revoked_and_consumed",
      sql`${table.revokedAt} IS NULL OR ${table.consumedAt} IS NULL`,
    ),
  ],
);

export const onboardingIdempotency = pgTable(
  "onboarding_idempotency",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    idempotencyKey: text("idempotency_key").notNull(),
    requestFingerprint: text("request_fingerprint").notNull(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("onboarding_idempotency_user_key").on(
      table.userId,
      table.idempotencyKey,
    ),
    check(
      "onboarding_idempotency_key_length",
      sql`char_length(${table.idempotencyKey}) BETWEEN 16 AND 128`,
    ),
    check(
      "onboarding_idempotency_fingerprint_format",
      sql`${table.requestFingerprint} ~ '^[0-9a-f]{64}$'`,
    ),
  ],
);

export const onboardingAuditEvents = pgTable(
  "onboarding_audit_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    event: text("event").notNull(),
    reason: text("reason").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check(
      "onboarding_audit_event",
      sql`${table.event} IN ('invitation_issued', 'invitation_revoked', 'redemption_succeeded', 'redemption_rejected')`,
    ),
    check(
      "onboarding_audit_reason",
      sql`char_length(${table.reason}) BETWEEN 1 AND 64 AND ${table.reason} ~ '^[a-z0-9_]+$'`,
    ),
  ],
);
