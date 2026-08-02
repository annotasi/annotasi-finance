import type { IdentitySessionConfig } from "@annotasi/config";
import { describe, expect, it } from "vitest";

import { SessionCookiePolicy } from "../src/identity-session/cookie.service.js";

function baseConfig(
  overrides: Partial<IdentitySessionConfig> = {},
): IdentitySessionConfig {
  return {
    APP_ENV: "development",
    CLERK_PUBLISHABLE_KEY: "pk_test",
    CLERK_SECRET_KEY: "sk_test",
    WEB_ORIGIN: "http://localhost:3000",
    API_ORIGIN: "http://localhost:3001",
    DATABASE_APPLICATION_URL: "postgresql://user:pass@localhost:5432/db",
    SESSION_COOKIE_NAME: "af_session",
    SESSION_TTL_SECONDS: 2_592_000,
    CSRF_SECRET: "a".repeat(32),
    SECURE_COOKIES: undefined,
    ...overrides,
  };
}

describe("SessionCookiePolicy", () => {
  it("uses a plain cookie name and non-Secure attribute in development by default", () => {
    const policy = new SessionCookiePolicy(baseConfig());
    expect(policy.cookieName).toBe("af_session");
    expect(policy.buildSetOptions(new Date()).secure).toBe(false);
  });

  it("honors an explicit SECURE_COOKIES=true override in development", () => {
    const policy = new SessionCookiePolicy(
      baseConfig({ SECURE_COOKIES: true }),
    );
    expect(policy.buildSetOptions(new Date()).secure).toBe(true);
  });

  it("uses the __Host- prefix and Secure attribute in production", () => {
    const policy = new SessionCookiePolicy(
      baseConfig({ APP_ENV: "production" }),
    );
    expect(policy.cookieName).toBe("__Host-af_session");
    expect(policy.buildSetOptions(new Date()).secure).toBe(true);
  });

  it("clears the cookie with exactly matching attributes", () => {
    const policy = new SessionCookiePolicy(baseConfig());
    const setOptions = policy.buildSetOptions(new Date());
    const clearOptions = policy.buildClearOptions();
    expect(clearOptions.httpOnly).toBe(setOptions.httpOnly);
    expect(clearOptions.secure).toBe(setOptions.secure);
    expect(clearOptions.sameSite).toBe(setOptions.sameSite);
    expect(clearOptions.path).toBe(setOptions.path);
  });

  it("always sets HttpOnly and SameSite=lax", () => {
    const policy = new SessionCookiePolicy(baseConfig());
    const options = policy.buildSetOptions(new Date());
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe("lax");
    expect(options.path).toBe("/");
  });
});
