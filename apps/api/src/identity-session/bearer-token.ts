import type { FastifyRequest } from "fastify";

const BEARER_PATTERN = /^Bearer\s+(.+)$/iu;

/**
 * Extracts a provider Bearer token from the Authorization header. Used only
 * by the narrowly scoped exchange and recovery-completion routes — never by
 * ordinary protected routes.
 */
export function extractBearerToken(request: FastifyRequest): string | null {
  const header = request.headers.authorization;
  if (typeof header !== "string") {
    return null;
  }

  const match = BEARER_PATTERN.exec(header);
  const token = match?.[1]?.trim();
  return token !== undefined && token.length > 0 ? token : null;
}
