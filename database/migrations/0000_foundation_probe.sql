CREATE TABLE "foundation_workspace_scope_probe" (
	"id" uuid PRIMARY KEY NOT NULL,
	"workspace_id" uuid NOT NULL,
	"marker" text NOT NULL,
	"exact_integer_value" bigint NOT NULL
);
--> statement-breakpoint
CREATE INDEX "foundation_workspace_scope_probe_workspace_idx" ON "foundation_workspace_scope_probe" USING btree ("workspace_id");
--> statement-breakpoint
COMMENT ON TABLE "foundation_workspace_scope_probe" IS 'Temporary technical foundation evidence for Workspace-scoped RLS and BIGINT behavior; not a product Workspace or financial table.';
--> statement-breakpoint
ALTER TABLE "foundation_workspace_scope_probe" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "foundation_workspace_scope_probe" FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
REVOKE ALL ON TABLE "foundation_workspace_scope_probe" FROM PUBLIC;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "foundation_workspace_scope_probe" TO "annotasi_application";
--> statement-breakpoint
CREATE POLICY "foundation_workspace_scope_policy"
ON "foundation_workspace_scope_probe"
AS PERMISSIVE
FOR ALL
TO "annotasi_application"
USING (
	"workspace_id" = NULLIF(current_setting('app.workspace_id', true), '')::uuid
)
WITH CHECK (
	"workspace_id" = NULLIF(current_setting('app.workspace_id', true), '')::uuid
);
