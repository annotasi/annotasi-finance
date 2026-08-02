import { describe, expect, it } from "vitest";

import { parseIdentitySessionConfig } from "../src/index.js";

function validEnv(
  overrides: Record<string, string | undefined> = {},
): Record<string, string | undefined> {
  return {
    APP_ENV: "development",
    CLERK_PUBLISHABLE_KEY: "pk_test_x",
    CLERK_SECRET_KEY: "sk_test_x",
    WEB_ORIGIN: "http://localhost:3000",
    API_ORIGIN: "http://localhost:3001",
    DATABASE_APPLICATION_URL: "postgresql://user:pass@localhost:5432/db",
    CSRF_SECRET: "a".repeat(32),
    ...overrides,
  };
}

describe("parseIdentitySessionConfig", () => {
  it("parses a valid configuration and applies defaults", () => {
    const config = parseIdentitySessionConfig(validEnv());
    expect(config.SESSION_COOKIE_NAME).toBe("af_session");
    expect(config.SESSION_TTL_SECONDS).toBe(60 * 60 * 24 * 30);
  });

  it("rejects a missing required field", () => {
    const env = validEnv();
    delete env["CLERK_SECRET_KEY"];
    expect(() => parseIdentitySessionConfig(env)).toThrow();
  });

  it("rejects a CSRF secret shorter than 32 characters", () => {
    expect(() =>
      parseIdentitySessionConfig(validEnv({ CSRF_SECRET: "short" })),
    ).toThrow();
  });

  it("fails fast when APP_ENV is production and SECURE_COOKIES is false", () => {
    expect(() =>
      parseIdentitySessionConfig(
        validEnv({ APP_ENV: "production", SECURE_COOKIES: "false" }),
      ),
    ).toThrow();
  });

  it("allows APP_ENV=production without SECURE_COOKIES set", () => {
    expect(() =>
      parseIdentitySessionConfig(validEnv({ APP_ENV: "production" })),
    ).not.toThrow();
  });

  it("allows SECURE_COOKIES=false in non-production environments", () => {
    expect(() =>
      parseIdentitySessionConfig(
        validEnv({ APP_ENV: "development", SECURE_COOKIES: "false" }),
      ),
    ).not.toThrow();
  });
});
