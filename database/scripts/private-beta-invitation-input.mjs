function withoutPnpmSeparator(rawArgs) {
  return rawArgs[0] === "--" ? rawArgs.slice(1) : rawArgs;
}

export function parseNamedArguments(rawArgs) {
  const normalizedArgs = withoutPnpmSeparator(rawArgs);
  const args = new Map();
  for (let index = 0; index < normalizedArgs.length; index += 2) {
    const name = normalizedArgs[index];
    const value = normalizedArgs[index + 1];
    if (name === undefined || !name.startsWith("--") || value === undefined) {
      throw new Error("Arguments must use --name value pairs.");
    }
    args.set(name.slice(2), value);
  }
  return args;
}

export function parseFutureExpiry(value, now = new Date()) {
  if (value === undefined) return null;
  const expiry = new Date(value);
  if (Number.isNaN(expiry.getTime())) {
    throw new Error("--expires-at must be a valid ISO-8601 instant.");
  }
  if (expiry.getTime() <= now.getTime()) {
    throw new Error("--expires-at must be in the future.");
  }
  return expiry;
}

export function validateInvitationToken(token) {
  if (!/^afbeta_[A-Za-z0-9_-]{43}$/u.test(token)) {
    throw new Error("Standard input must contain a valid private-beta token.");
  }
  return token;
}

export function assertNoRevokeArguments(rawArgs) {
  if (withoutPnpmSeparator(rawArgs).length !== 0) {
    throw new Error(
      "The revoke command accepts no arguments; provide the token on standard input.",
    );
  }
}

export async function readInvitationTokenFromStdin(input) {
  let value = "";
  input.setEncoding("utf8");
  for await (const chunk of input) value += chunk;
  return validateInvitationToken(value.trim());
}
