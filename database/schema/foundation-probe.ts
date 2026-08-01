import { bigint, index, pgTable, text, uuid } from "drizzle-orm/pg-core";

/**
 * Temporary technical evidence for Workspace-scoped RLS and BIGINT behavior.
 * This is not the product Workspace model or a financial table.
 */
export const foundationWorkspaceScopeProbe = pgTable(
  "foundation_workspace_scope_probe",
  {
    id: uuid("id").primaryKey(),
    workspaceId: uuid("workspace_id").notNull(),
    marker: text("marker").notNull(),
    exactIntegerValue: bigint("exact_integer_value", {
      mode: "bigint",
    }).notNull(),
  },
  (table) => [
    index("foundation_workspace_scope_probe_workspace_idx").on(
      table.workspaceId,
    ),
  ],
);
