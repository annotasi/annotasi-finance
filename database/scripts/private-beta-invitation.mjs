import { createHash, randomBytes } from "node:crypto";

import pg from "pg";

import {
  assertNoRevokeArguments,
  parseFutureExpiry,
  parseNamedArguments,
  readInvitationTokenFromStdin,
} from "./private-beta-invitation-input.mjs";

const { Client } = pg;
const [command, ...rawArgs] = process.argv.slice(2);
const args = parseNamedArguments(rawArgs);

const databaseUrl = process.env.DATABASE_OPERATOR_URL;
if (databaseUrl === undefined || databaseUrl === "") {
  throw new Error("DATABASE_OPERATOR_URL is required.");
}

function normalizeEmail(value) {
  const normalized = value.normalize("NFKC").trim().toLowerCase();
  if (
    normalized.length < 3 ||
    normalized.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(normalized)
  ) {
    throw new Error("--email must be a valid email address.");
  }
  return normalized;
}

function hashToken(token) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

const client = new Client({ connectionString: databaseUrl });
await client.connect();
try {
  if (command === "issue") {
    const email = args.get("email");
    if (email === undefined) throw new Error("--email is required.");
    const invitedEmail = normalizeEmail(email);
    const token = `afbeta_${randomBytes(32).toString("base64url")}`;
    const expiresAt = parseFutureExpiry(args.get("expires-at"));
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO private_beta_invitations
         (invited_email_normalized, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [invitedEmail, hashToken(token), expiresAt],
    );
    await client.query(
      "INSERT INTO onboarding_audit_events (event, reason) VALUES ('invitation_issued', 'operator_issue')",
    );
    await client.query("COMMIT");
    process.stdout.write(
      `${JSON.stringify({ invitationToken: token, expiresAt: expiresAt?.toISOString() ?? null })}\n`,
    );
  } else if (command === "revoke") {
    assertNoRevokeArguments(rawArgs);
    const token = await readInvitationTokenFromStdin(process.stdin);
    await client.query("BEGIN");
    const result = await client.query(
      `UPDATE private_beta_invitations
          SET revoked_at = now(), revoked_reason = 'operator_revoked'
        WHERE token_hash = $1 AND revoked_at IS NULL AND consumed_at IS NULL`,
      [hashToken(token)],
    );
    if (result.rowCount !== 1) {
      throw new Error("Invitation is unavailable or already finalized.");
    }
    await client.query(
      "INSERT INTO onboarding_audit_events (event, reason) VALUES ('invitation_revoked', 'operator_revoke')",
    );
    await client.query("COMMIT");
    process.stdout.write(`${JSON.stringify({ status: "revoked" })}\n`);
  } else {
    throw new Error("Use command 'issue' or 'revoke'.");
  }
} catch (error) {
  await client.query("ROLLBACK").catch(() => undefined);
  throw error;
} finally {
  await client.end();
}
