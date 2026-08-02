import { createHash, randomBytes } from "node:crypto";

const TOKEN_BYTES = 32; // 256 bits of entropy

/**
 * Generates a cryptographically secure opaque application-session token.
 * The raw token is returned only to be placed in the session cookie — it is
 * never persisted.
 */
export function generateSessionToken(): string {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}

/**
 * SHA-256 hash of an opaque session token, hex-encoded. Only the hash is
 * persisted; the raw token can never be recovered from it.
 */
export function hashSessionToken(rawToken: string): string {
  return createHash("sha256").update(rawToken, "utf8").digest("hex");
}
