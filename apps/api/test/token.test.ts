import { fc, test as fcTest } from "@fast-check/vitest";
import { describe, expect, it } from "vitest";

import {
  generateSessionToken,
  hashSessionToken,
} from "../src/identity-session/token.js";

describe("session token generation", () => {
  it("produces a token with at least 256 bits of entropy", () => {
    const token = generateSessionToken();
    const decoded = Buffer.from(token, "base64url");
    expect(decoded.byteLength).toBeGreaterThanOrEqual(32);
  });

  it("produces distinct tokens across calls", () => {
    const tokens = new Set(
      Array.from({ length: 100 }, () => generateSessionToken()),
    );
    expect(tokens.size).toBe(100);
  });
});

describe("session token hashing", () => {
  it("is deterministic for the same raw token", () => {
    const token = generateSessionToken();
    expect(hashSessionToken(token)).toBe(hashSessionToken(token));
  });

  it("never contains the raw token as a substring", () => {
    const token = generateSessionToken();
    expect(hashSessionToken(token)).not.toContain(token);
  });
});

describe("session token property tests", () => {
  fcTest.prop([fc.string(), fc.string()])(
    "hashes distinct raw tokens to distinct hashes",
    (a, b) => {
      fc.pre(a !== b);
      expect(hashSessionToken(a)).not.toBe(hashSessionToken(b));
    },
  );

  fcTest.prop([fc.string()])(
    "an arbitrary forged token never matches a hash of a real generated token",
    (forged) => {
      const real = generateSessionToken();
      fc.pre(forged !== real);
      expect(hashSessionToken(forged)).not.toBe(hashSessionToken(real));
    },
  );
});
