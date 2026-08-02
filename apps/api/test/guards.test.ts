import type { IdentitySessionConfig } from "@annotasi/config";
import type { SessionStore } from "@annotasi/database/runtime";
import { UnauthorizedException, type ExecutionContext } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";

import { SessionCookiePolicy } from "../src/identity-session/cookie.service.js";
import { OriginCsrfGuard } from "../src/identity-session/origin-csrf.guard.js";
import { SessionGuard } from "../src/identity-session/session.guard.js";
import { SessionService } from "../src/identity-session/session.service.js";
import {
  FakeIdentityProvider,
  validProviderToken,
} from "./support/fake-identity-provider.js";
import { FakeSessionStore } from "./support/fake-session-store.js";

function baseConfig(
  overrides: Partial<IdentitySessionConfig> = {},
): IdentitySessionConfig {
  return {
    APP_ENV: "test",
    CLERK_PUBLISHABLE_KEY: "pk_test",
    CLERK_SECRET_KEY: "sk_test",
    WEB_ORIGIN: "http://localhost:3000",
    API_ORIGIN: "http://localhost:3001",
    DATABASE_APPLICATION_URL: "postgresql://user:pass@localhost:5432/db",
    SESSION_COOKIE_NAME: "af_session",
    SESSION_TTL_SECONDS: 3600,
    CSRF_SECRET: "a".repeat(32),
    SECURE_COOKIES: undefined,
    ...overrides,
  };
}

function contextWith(
  request: unknown,
  response: unknown = {},
): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
    }),
  } as unknown as ExecutionContext;
}

describe("SessionGuard", () => {
  function buildGuard() {
    const store = new FakeSessionStore();
    const provider = new FakeIdentityProvider();
    const config = baseConfig();
    const service = new SessionService(
      store as unknown as SessionStore,
      provider,
      config,
    );
    const cookiePolicy = new SessionCookiePolicy(config);
    return {
      service,
      cookiePolicy,
      guard: new SessionGuard(service, cookiePolicy),
    };
  }

  it("rejects a request with no application-session cookie", async () => {
    const { guard } = buildGuard();
    const context = contextWith({ cookies: {} });

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it("rejects a forged or unknown application-session cookie", async () => {
    const { guard, cookiePolicy } = buildGuard();
    const context = contextWith({
      cookies: { [cookiePolicy.cookieName]: "forged-token" },
    });

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it("rejects a Clerk Bearer token presented alone (no cookie)", async () => {
    const { guard } = buildGuard();
    const context = contextWith({
      cookies: {},
      headers: { authorization: `Bearer ${validProviderToken("user_1")}` },
    });

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it("accepts a valid application-session cookie and attaches the session", async () => {
    const { guard, service, cookiePolicy } = buildGuard();
    const { rawToken } = await service.establishSession(
      validProviderToken("user_1"),
    );
    const request: {
      cookies: Record<string, string>;
      applicationSession?: unknown;
    } = {
      cookies: { [cookiePolicy.cookieName]: rawToken },
    };
    const context = contextWith(request);

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.applicationSession).toBeDefined();
  });
});

describe("OriginCsrfGuard", () => {
  function buildGuard(config: IdentitySessionConfig = baseConfig()) {
    return new OriginCsrfGuard(config);
  }

  it("rejects a request from a disallowed origin", async () => {
    const guard = buildGuard();
    const context = contextWith(
      {
        headers: {
          origin: "https://evil.example",
          "content-type": "application/json",
        },
      },
      { csrfProtection: vi.fn() },
    );

    await expect(guard.canActivate(context)).rejects.toMatchObject({
      status: 403,
    });
  });

  it("rejects a request with the wrong content type", async () => {
    const guard = buildGuard();
    const context = contextWith(
      {
        headers: {
          origin: "http://localhost:3000",
          "content-type": "text/plain",
        },
      },
      { csrfProtection: vi.fn() },
    );

    await expect(guard.canActivate(context)).rejects.toMatchObject({
      status: 403,
    });
  });

  it("rejects when the underlying CSRF check fails", async () => {
    const guard = buildGuard();
    const server = {
      csrfProtection: vi.fn(
        (_req: unknown, _reply: unknown, done: (error?: Error) => void) => {
          done(new Error("invalid csrf token"));
        },
      ),
    };
    const context = contextWith(
      {
        headers: {
          origin: "http://localhost:3000",
          "content-type": "application/json",
        },
        server,
      },
      {},
    );

    await expect(guard.canActivate(context)).rejects.toMatchObject({
      status: 403,
    });
  });

  it("accepts a same-origin, JSON, CSRF-valid request", async () => {
    const guard = buildGuard();
    const server = {
      csrfProtection: vi.fn(
        (_req: unknown, _reply: unknown, done: (error?: Error) => void) => {
          done();
        },
      ),
    };
    const context = contextWith(
      {
        headers: {
          origin: "http://localhost:3000",
          "content-type": "application/json",
        },
        server,
      },
      {},
    );

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });
});
