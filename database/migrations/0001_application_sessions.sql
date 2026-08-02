CREATE TABLE "application_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_hash" text NOT NULL,
	"external_subject" text NOT NULL,
	"provider_session_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"revoked_reason" text,
	CONSTRAINT "application_sessions_revocation_state" CHECK (("application_sessions"."revoked_at" IS NULL AND "application_sessions"."revoked_reason" IS NULL) OR ("application_sessions"."revoked_at" IS NOT NULL AND "application_sessions"."revoked_reason" IS NOT NULL))
);
--> statement-breakpoint
CREATE UNIQUE INDEX "application_sessions_token_hash_key" ON "application_sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "application_sessions_subject_idx" ON "application_sessions" USING btree ("external_subject");--> statement-breakpoint
CREATE INDEX "application_sessions_expires_at_idx" ON "application_sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "application_sessions_provider_session_idx" ON "application_sessions" USING btree ("provider_session_id");
--> statement-breakpoint
COMMENT ON TABLE "application_sessions" IS 'Annotasi Finance-owned opaque application session (identity/session technical evidence only); not a User, Workspace, entitlement, or financial table, and not Workspace-scoped.';
--> statement-breakpoint
REVOKE ALL ON TABLE "application_sessions" FROM PUBLIC;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE ON TABLE "application_sessions" TO "annotasi_application";