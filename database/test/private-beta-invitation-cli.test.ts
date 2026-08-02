import { Readable } from "node:stream";

import { describe, expect, it } from "vitest";

import {
  assertNoRevokeArguments,
  parseFutureExpiry,
  parseNamedArguments,
  readInvitationTokenFromStdin,
} from "../scripts/private-beta-invitation-input.mjs";

const TOKEN = `afbeta_${"a".repeat(43)}`;

describe("private-beta invitation operator input", () => {
  it("accepts pnpm-forwarded named arguments with or without a separator", () => {
    expect(
      parseNamedArguments(["--email", "invited@example.com"]).get("email"),
    ).toBe("invited@example.com");
    expect(
      parseNamedArguments(["--", "--email", "invited@example.com"]).get(
        "email",
      ),
    ).toBe("invited@example.com");
  });

  it("accepts revoke secrets from standard input", async () => {
    await expect(
      readInvitationTokenFromStdin(Readable.from([`${TOKEN}\n`])),
    ).resolves.toBe(TOKEN);
  });

  it("does not support a revoke token argument", () => {
    expect(() => assertNoRevokeArguments(["--token", TOKEN])).toThrow(
      "accepts no arguments",
    );
    expect(() => assertNoRevokeArguments([])).not.toThrow();
    expect(() => assertNoRevokeArguments(["--"])).not.toThrow();
  });

  it("rejects malformed stdin secrets without echoing them", async () => {
    const secret = "raw-secret-that-must-not-appear";
    await expect(
      readInvitationTokenFromStdin(Readable.from([secret])),
    ).rejects.not.toThrow(secret);
  });

  it("requires explicit expiries to be valid future instants", () => {
    const now = new Date("2026-08-02T00:00:00.000Z");
    expect(
      parseFutureExpiry("2026-08-02T00:00:01.000Z", now)?.toISOString(),
    ).toBe("2026-08-02T00:00:01.000Z");
    expect(() => parseFutureExpiry("not-an-instant", now)).toThrow(
      "valid ISO-8601",
    );
    expect(() => parseFutureExpiry(now.toISOString(), now)).toThrow(
      "in the future",
    );
    expect(() => parseFutureExpiry("2026-08-01T23:59:59.000Z", now)).toThrow(
      "in the future",
    );
  });
});
