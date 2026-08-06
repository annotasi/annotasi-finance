ALTER TABLE "accounts" DROP CONSTRAINT "accounts_opening_initializes_total";--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_opening_initializes_unallocated";--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_lifecycle";--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "version" bigint DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_nonnegative_total" CHECK ("accounts"."total_balance" >= 0);--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_nonnegative_unallocated" CHECK ("accounts"."unallocated_balance" >= 0);--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_archived_at_consistency" CHECK (("accounts"."lifecycle_status" = 'active' AND "accounts"."archived_at" IS NULL) OR ("accounts"."lifecycle_status" = 'archived' AND "accounts"."archived_at" IS NOT NULL AND "accounts"."total_balance" = 0));--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_version_positive" CHECK ("accounts"."version" >= 1);--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_lifecycle" CHECK ("accounts"."lifecycle_status" IN ('active', 'archived'));
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_unallocated_le_total" CHECK ("accounts"."unallocated_balance" <= "accounts"."total_balance");
--> statement-breakpoint
GRANT UPDATE ("name", "lifecycle_status", "archived_at", "updated_at", "version") ON TABLE "accounts" TO "annotasi_application";
--> statement-breakpoint
DROP POLICY "accounts_private_workspace" ON "accounts";
--> statement-breakpoint
CREATE POLICY "accounts_select_private_workspace" ON "accounts" FOR SELECT TO "annotasi_application" USING ("workspace_id"::text = nullif(current_setting('app.workspace_id', true), '') AND EXISTS (SELECT 1 FROM "workspaces" w WHERE w."id" = "accounts"."workspace_id" AND w."owner_user_id"::text = nullif(current_setting('app.user_id', true), '')));
--> statement-breakpoint
CREATE POLICY "accounts_insert_private_workspace" ON "accounts" FOR INSERT TO "annotasi_application" WITH CHECK ("workspace_id"::text = nullif(current_setting('app.workspace_id', true), '') AND EXISTS (SELECT 1 FROM "workspaces" w WHERE w."id" = "accounts"."workspace_id" AND w."owner_user_id"::text = nullif(current_setting('app.user_id', true), '')) AND "total_balance" = "opening_balance" AND "unallocated_balance" = "opening_balance" AND "lifecycle_status" = 'active' AND "archived_at" IS NULL AND "version" = 1);
--> statement-breakpoint
CREATE POLICY "accounts_update_private_workspace" ON "accounts" FOR UPDATE TO "annotasi_application" USING ("workspace_id"::text = nullif(current_setting('app.workspace_id', true), '') AND EXISTS (SELECT 1 FROM "workspaces" w WHERE w."id" = "accounts"."workspace_id" AND w."owner_user_id"::text = nullif(current_setting('app.user_id', true), ''))) WITH CHECK ("workspace_id"::text = nullif(current_setting('app.workspace_id', true), '') AND EXISTS (SELECT 1 FROM "workspaces" w WHERE w."id" = "accounts"."workspace_id" AND w."owner_user_id"::text = nullif(current_setting('app.user_id', true), '')));
--> statement-breakpoint
COMMENT ON TABLE "accounts" IS 'Workspace-scoped Account. ACC-001 adds Active/Archived lifecycle, rename, and optimistic version; opening balance, type, and effective date remain fixed after creation. RLS is split into explicit SELECT/INSERT/UPDATE policies; INSERT additionally requires Total=Unallocated=Opening, active lifecycle, no archived_at, and version=1. No DELETE grant or policy exists; permanent deletion is not implemented.';