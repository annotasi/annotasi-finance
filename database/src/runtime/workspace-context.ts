import type pg from "pg";

export interface WorkspaceContextRow {
  user_id: string;
  workspace_id: string;
}

/** Sets one transaction-local PostgreSQL setting via `set_config(..., true)`. */
export async function setLocal(
  client: pg.PoolClient,
  name: string,
  value: string,
): Promise<void> {
  await client.query("SELECT set_config($1, $2, true)", [name, value]);
}

/**
 * Resolves the server-derived User/Workspace context for a verified external
 * subject through the `resolve_private_workspace_context` SECURITY DEFINER
 * function. Requires `app.external_subject` to already be set locally on
 * this transaction. Returns `null` before onboarding completes.
 */
export async function resolveWorkspaceContext(
  client: pg.PoolClient,
  externalSubject: string,
): Promise<WorkspaceContextRow | null> {
  const result = await client.query<WorkspaceContextRow>(
    "SELECT user_id, workspace_id FROM resolve_private_workspace_context($1)",
    [externalSubject],
  );
  return result.rows[0] ?? null;
}
