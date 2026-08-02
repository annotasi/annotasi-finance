CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "external_subject" text NOT NULL,
  "verified_email_normalized" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "users_external_subject_length" CHECK (char_length("external_subject") BETWEEN 1 AND 255),
  CONSTRAINT "users_verified_email_length" CHECK (char_length("verified_email_normalized") BETWEEN 3 AND 254)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "users_external_subject_key" ON "users" ("external_subject");
--> statement-breakpoint
CREATE TABLE "private_beta_invitations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "invited_email_normalized" text NOT NULL,
  "token_hash" text NOT NULL,
  "issued_at" timestamp with time zone DEFAULT now() NOT NULL,
  "expires_at" timestamp with time zone,
  "revoked_at" timestamp with time zone,
  "revoked_reason" text,
  "consumed_at" timestamp with time zone,
  "consumed_by_user_id" uuid,
  "consumed_workspace_id" uuid,
  "consumed_account_id" uuid,
  CONSTRAINT "private_beta_invitations_token_hash_format" CHECK ("token_hash" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "private_beta_invitations_email_length" CHECK (char_length("invited_email_normalized") BETWEEN 3 AND 254),
  CONSTRAINT "private_beta_invitations_expiry_after_issue" CHECK ("expires_at" IS NULL OR "expires_at" > "issued_at"),
  CONSTRAINT "private_beta_invitations_revocation_state" CHECK (("revoked_at" IS NULL AND "revoked_reason" IS NULL) OR ("revoked_at" IS NOT NULL AND "revoked_reason" IS NOT NULL)),
  CONSTRAINT "private_beta_invitations_consumption_state" CHECK (("consumed_at" IS NULL AND "consumed_by_user_id" IS NULL AND "consumed_workspace_id" IS NULL AND "consumed_account_id" IS NULL) OR ("consumed_at" IS NOT NULL AND "consumed_by_user_id" IS NOT NULL AND "consumed_workspace_id" IS NOT NULL AND "consumed_account_id" IS NOT NULL)),
  CONSTRAINT "private_beta_invitations_not_revoked_and_consumed" CHECK ("revoked_at" IS NULL OR "consumed_at" IS NULL)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "private_beta_invitations_token_hash_key" ON "private_beta_invitations" ("token_hash");
--> statement-breakpoint
CREATE INDEX "private_beta_invitations_email_idx" ON "private_beta_invitations" ("invited_email_normalized");
--> statement-breakpoint
CREATE TABLE "workspaces" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "owner_user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
  "currency" text DEFAULT 'IDR' NOT NULL,
  "timezone" text DEFAULT 'Asia/Jakarta' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "workspaces_currency_idr" CHECK ("currency" = 'IDR'),
  CONSTRAINT "workspaces_timezone_jakarta" CHECK ("timezone" = 'Asia/Jakarta')
);
--> statement-breakpoint
CREATE UNIQUE INDEX "workspaces_owner_user_id_key" ON "workspaces" ("owner_user_id");
--> statement-breakpoint
CREATE FUNCTION "resolve_private_workspace_context"("subject" text)
RETURNS TABLE ("user_id" uuid, "workspace_id" uuid)
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT u.id, w.id
  FROM public.users u
  JOIN public.workspaces w ON w.owner_user_id = u.id
  WHERE u.external_subject = "subject"
    AND "subject" = nullif(current_setting('app.external_subject', true), '')
  LIMIT 1
$$;
--> statement-breakpoint
REVOKE ALL ON FUNCTION "resolve_private_workspace_context"(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION "resolve_private_workspace_context"(text) TO "annotasi_application";
--> statement-breakpoint
CREATE TABLE "accounts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "workspace_id" uuid NOT NULL REFERENCES "workspaces"("id") ON DELETE RESTRICT,
  "name" text NOT NULL,
  "type" text NOT NULL,
  "opening_balance" bigint NOT NULL,
  "opening_balance_effective_date" date NOT NULL,
  "total_balance" bigint NOT NULL,
  "unallocated_balance" bigint NOT NULL,
  "lifecycle_status" text DEFAULT 'active' NOT NULL,
  "is_starter" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "accounts_name_length" CHECK (char_length(btrim("name")) BETWEEN 1 AND 100),
  CONSTRAINT "accounts_type" CHECK ("type" IN ('cash', 'bank_account', 'e_wallet', 'other')),
  CONSTRAINT "accounts_nonnegative_opening" CHECK ("opening_balance" >= 0),
  CONSTRAINT "accounts_opening_initializes_total" CHECK ("total_balance" = "opening_balance"),
  CONSTRAINT "accounts_opening_initializes_unallocated" CHECK ("unallocated_balance" = "opening_balance"),
  CONSTRAINT "accounts_lifecycle" CHECK ("lifecycle_status" = 'active')
);
--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_one_starter_per_workspace" ON "accounts" ("workspace_id") WHERE "is_starter";
--> statement-breakpoint
CREATE INDEX "accounts_workspace_id_idx" ON "accounts" ("workspace_id");
--> statement-breakpoint
CREATE TABLE "onboarding_idempotency" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
  "idempotency_key" text NOT NULL,
  "request_fingerprint" text NOT NULL,
  "workspace_id" uuid NOT NULL REFERENCES "workspaces"("id") ON DELETE RESTRICT,
  "account_id" uuid NOT NULL REFERENCES "accounts"("id") ON DELETE RESTRICT,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "onboarding_idempotency_key_length" CHECK (char_length("idempotency_key") BETWEEN 16 AND 128),
  CONSTRAINT "onboarding_idempotency_fingerprint_format" CHECK ("request_fingerprint" ~ '^[0-9a-f]{64}$')
);
--> statement-breakpoint
CREATE UNIQUE INDEX "onboarding_idempotency_user_key" ON "onboarding_idempotency" ("user_id", "idempotency_key");
--> statement-breakpoint
CREATE TABLE "onboarding_audit_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "event" text NOT NULL,
  "reason" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "onboarding_audit_event" CHECK ("event" IN ('invitation_issued', 'invitation_revoked', 'redemption_succeeded', 'redemption_rejected')),
  CONSTRAINT "onboarding_audit_reason" CHECK (char_length("reason") BETWEEN 1 AND 64 AND "reason" ~ '^[a-z0-9_]+$')
);
--> statement-breakpoint
ALTER TABLE "private_beta_invitations" ADD CONSTRAINT "private_beta_invitations_consumed_user_fk" FOREIGN KEY ("consumed_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT;
--> statement-breakpoint
ALTER TABLE "private_beta_invitations" ADD CONSTRAINT "private_beta_invitations_consumed_workspace_fk" FOREIGN KEY ("consumed_workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT;
--> statement-breakpoint
ALTER TABLE "private_beta_invitations" ADD CONSTRAINT "private_beta_invitations_consumed_account_fk" FOREIGN KEY ("consumed_account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT;
--> statement-breakpoint
REVOKE ALL ON TABLE "users", "private_beta_invitations", "workspaces", "accounts", "onboarding_idempotency", "onboarding_audit_events" FROM PUBLIC;
--> statement-breakpoint
GRANT SELECT, INSERT ON TABLE "users" TO "annotasi_application";
GRANT UPDATE ("verified_email_normalized", "updated_at") ON TABLE "users" TO "annotasi_application";
GRANT SELECT ON TABLE "private_beta_invitations" TO "annotasi_application";
GRANT UPDATE ("consumed_at", "consumed_by_user_id", "consumed_workspace_id", "consumed_account_id") ON TABLE "private_beta_invitations" TO "annotasi_application";
GRANT SELECT, INSERT ON TABLE "workspaces", "accounts", "onboarding_idempotency" TO "annotasi_application";
GRANT INSERT ON TABLE "onboarding_audit_events" TO "annotasi_application";
GRANT SELECT ("token_hash", "revoked_at", "consumed_at") ON TABLE "private_beta_invitations" TO "annotasi_operator";
GRANT INSERT ("invited_email_normalized", "token_hash", "expires_at") ON TABLE "private_beta_invitations" TO "annotasi_operator";
GRANT UPDATE ("revoked_at", "revoked_reason") ON TABLE "private_beta_invitations" TO "annotasi_operator";
GRANT INSERT ON TABLE "onboarding_audit_events" TO "annotasi_operator";
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" FORCE ROW LEVEL SECURITY;
CREATE POLICY "users_own_subject" ON "users" TO "annotasi_application" USING ("external_subject" = nullif(current_setting('app.external_subject', true), '')) WITH CHECK ("external_subject" = nullif(current_setting('app.external_subject', true), ''));
CREATE POLICY "users_context_resolver" ON "users" FOR SELECT TO "annotasi_migration" USING ("external_subject" = nullif(current_setting('app.external_subject', true), ''));
--> statement-breakpoint
ALTER TABLE "private_beta_invitations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "private_beta_invitations" FORCE ROW LEVEL SECURITY;
CREATE POLICY "invitations_runtime_token" ON "private_beta_invitations" TO "annotasi_application" USING ("token_hash" = nullif(current_setting('app.invitation_token_hash', true), '')) WITH CHECK ("token_hash" = nullif(current_setting('app.invitation_token_hash', true), ''));
CREATE POLICY "invitations_operator" ON "private_beta_invitations" TO "annotasi_operator" USING (true) WITH CHECK (true);
--> statement-breakpoint
ALTER TABLE "workspaces" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workspaces" FORCE ROW LEVEL SECURITY;
CREATE POLICY "workspaces_private_owner" ON "workspaces" TO "annotasi_application" USING ("id"::text = nullif(current_setting('app.workspace_id', true), '') AND "owner_user_id"::text = nullif(current_setting('app.user_id', true), '')) WITH CHECK ("id"::text = nullif(current_setting('app.workspace_id', true), '') AND "owner_user_id"::text = nullif(current_setting('app.user_id', true), ''));
CREATE POLICY "workspaces_context_resolver" ON "workspaces" FOR SELECT TO "annotasi_migration" USING ("owner_user_id" IN (SELECT u.id FROM "users" u WHERE u."external_subject" = nullif(current_setting('app.external_subject', true), '')));
--> statement-breakpoint
ALTER TABLE "accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "accounts" FORCE ROW LEVEL SECURITY;
CREATE POLICY "accounts_private_workspace" ON "accounts" TO "annotasi_application" USING ("workspace_id"::text = nullif(current_setting('app.workspace_id', true), '') AND EXISTS (SELECT 1 FROM "workspaces" w WHERE w."id" = "accounts"."workspace_id" AND w."owner_user_id"::text = nullif(current_setting('app.user_id', true), ''))) WITH CHECK ("workspace_id"::text = nullif(current_setting('app.workspace_id', true), '') AND EXISTS (SELECT 1 FROM "workspaces" w WHERE w."id" = "accounts"."workspace_id" AND w."owner_user_id"::text = nullif(current_setting('app.user_id', true), '')));
--> statement-breakpoint
ALTER TABLE "onboarding_idempotency" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "onboarding_idempotency" FORCE ROW LEVEL SECURITY;
CREATE POLICY "onboarding_idempotency_own_user" ON "onboarding_idempotency" TO "annotasi_application" USING ("user_id"::text = nullif(current_setting('app.user_id', true), '')) WITH CHECK ("user_id"::text = nullif(current_setting('app.user_id', true), ''));
--> statement-breakpoint
ALTER TABLE "onboarding_audit_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "onboarding_audit_events" FORCE ROW LEVEL SECURITY;
CREATE POLICY "onboarding_audit_runtime_insert" ON "onboarding_audit_events" FOR INSERT TO "annotasi_application" WITH CHECK (true);
CREATE POLICY "onboarding_audit_operator_insert" ON "onboarding_audit_events" FOR INSERT TO "annotasi_operator" WITH CHECK (true);
--> statement-breakpoint
COMMENT ON TABLE "private_beta_invitations" IS 'Operator-issued private-beta entitlement. Stores only token hashes; never raw invitation tokens.';
COMMENT ON TABLE "workspaces" IS 'One private Workspace per verified local User; fixed to IDR and Asia/Jakarta for IAM-002.';
COMMENT ON TABLE "accounts" IS 'Workspace-scoped Account. IAM-002 creates exactly one starter Account without financial events.';
