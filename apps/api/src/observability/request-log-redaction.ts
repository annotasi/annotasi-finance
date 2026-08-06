const UUID_PATTERN =
  /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/gu;

/**
 * Redacts UUID-shaped path segments (Account, Workspace, User, and other
 * resource IDs) from a request URL before it reaches any log line. Fastify's
 * default request logging otherwise writes the raw URL, and dynamic Account
 * routes embed the Account ID directly in the path.
 */
export function redactRequestUrl(url: string): string {
  return url.replaceAll(UUID_PATTERN, "[id]");
}
