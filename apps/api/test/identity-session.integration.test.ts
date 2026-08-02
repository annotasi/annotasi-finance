import fastifyCookie from "@fastify/cookie";
import fastifyCsrfProtection from "@fastify/csrf-protection";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { AppModule } from "../src/app.module.js";
import { IDENTITY_PROVIDER } from "../src/identity-session/identity-provider.port.js";
import { SESSION_STORE } from "../src/identity-session/session-store.token.js";
import {
  FakeIdentityProvider,
  validProviderToken,
} from "./support/fake-identity-provider.js";
import { FakeSessionStore } from "./support/fake-session-store.js";

const WEB_ORIGIN = "http://localhost:3000";

function parseSetCookies(response: {
  headers: Record<string, string | string[] | number | undefined>;
}): Record<string, string> {
  const raw = response.headers["set-cookie"];
  const values = Array.isArray(raw)
    ? raw
    : raw !== undefined
      ? [String(raw)]
      : [];
  const cookies: Record<string, string> = {};
  for (const entry of values) {
    const pair = entry.split(";")[0];
    const separatorIndex = pair?.indexOf("=") ?? -1;
    if (pair !== undefined && separatorIndex > 0) {
      cookies[pair.slice(0, separatorIndex)] = pair.slice(separatorIndex + 1);
    }
  }
  return cookies;
}

function cookieHeader(cookies: Record<string, string | undefined>): string {
  return Object.entries(cookies)
    .filter((entry): entry is [string, string] => entry[1] !== undefined)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

describe("identity-session API", () => {
  let app: NestFastifyApplication;
  let identityProvider: FakeIdentityProvider;
  let sessionStore: FakeSessionStore;

  beforeAll(async () => {
    identityProvider = new FakeIdentityProvider();
    sessionStore = new FakeSessionStore();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(IDENTITY_PROVIDER)
      .useValue(identityProvider)
      .overrideProvider(SESSION_STORE)
      .useValue(sessionStore)
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.register(fastifyCookie);
    await app.register(fastifyCsrfProtection, {
      sessionPlugin: "@fastify/cookie",
      csrfOpts: { hmacKey: "a".repeat(32), userInfo: false },
    });
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("rejects an unverified provider token at exchange", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/identity/exchange",
      headers: { authorization: "Bearer garbage-token" },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).not.toHaveProperty("stack");
  });

  it("establishes exactly one application session on a valid exchange", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/identity/exchange",
      headers: {
        authorization: `Bearer ${validProviderToken("user_a", "sess_a")}`,
      },
    });

    expect(response.statusCode).toBe(201);
    const cookies = parseSetCookies(response);
    expect(cookies["af_session"]).toBeTruthy();
    expect(sessionStore.all()).toHaveLength(1);
  });

  it("rejects an ordinary protected route when only a Clerk Bearer token is presented", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/identity/session",
      headers: {
        authorization: `Bearer ${validProviderToken("user_a")}`,
      },
    });

    expect(response.statusCode).toBe(401);
  });

  it("accepts an ordinary protected route with a valid application-session cookie", async () => {
    const exchange = await app.inject({
      method: "POST",
      url: "/identity/exchange",
      headers: {
        authorization: `Bearer ${validProviderToken("user_b")}`,
      },
    });
    const sessionCookie = parseSetCookies(exchange)["af_session"];

    const response = await app.inject({
      method: "GET",
      url: "/identity/session",
      headers: { cookie: `af_session=${sessionCookie}` },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ status: "active" });
  });

  it("rejects a forged application-session cookie with a safe 401", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/identity/session",
      headers: { cookie: "af_session=forged-token-value" },
    });

    expect(response.statusCode).toBe(401);
    const body = response.json();
    expect(body.message).not.toContain("forged-token-value");
  });

  it("rejects state-changing requests from a disallowed origin", async () => {
    const exchange = await app.inject({
      method: "POST",
      url: "/identity/exchange",
      headers: {
        authorization: `Bearer ${validProviderToken("user_origin")}`,
      },
    });
    const sessionCookie = parseSetCookies(exchange)["af_session"];

    const response = await app.inject({
      method: "POST",
      url: "/identity/session/logout",
      headers: {
        cookie: `af_session=${sessionCookie}`,
        origin: "https://evil.example",
        "content-type": "application/json",
      },
      payload: {},
    });

    expect(response.statusCode).toBe(403);
  });

  it("rejects logout without a valid CSRF token", async () => {
    const exchange = await app.inject({
      method: "POST",
      url: "/identity/exchange",
      headers: {
        authorization: `Bearer ${validProviderToken("user_csrf")}`,
      },
    });
    const sessionCookie = parseSetCookies(exchange)["af_session"];

    const response = await app.inject({
      method: "POST",
      url: "/identity/session/logout",
      headers: {
        cookie: `af_session=${sessionCookie}`,
        origin: WEB_ORIGIN,
        "content-type": "application/json",
      },
      payload: {},
    });

    expect(response.statusCode).toBe(403);
  });

  it("logs out the current session with a valid CSRF token, clears the cookie, and best-effort revokes the provider session", async () => {
    const exchange = await app.inject({
      method: "POST",
      url: "/identity/exchange",
      headers: {
        authorization: `Bearer ${validProviderToken("user_logout", "sess_logout_http")}`,
      },
    });
    const sessionCookie = parseSetCookies(exchange)["af_session"];

    const statusResponse = await app.inject({
      method: "GET",
      url: "/identity/session",
      headers: { cookie: `af_session=${sessionCookie}` },
    });
    const csrfToken = statusResponse.json().csrfToken as string;
    const csrfCookie = parseSetCookies(statusResponse)["_csrf"];

    const logoutResponse = await app.inject({
      method: "POST",
      url: "/identity/session/logout",
      headers: {
        cookie: cookieHeader({ af_session: sessionCookie, _csrf: csrfCookie }),
        origin: WEB_ORIGIN,
        "content-type": "application/json",
        "x-csrf-token": csrfToken,
      },
      payload: {},
    });

    expect(logoutResponse.statusCode).toBe(201);
    expect(identityProvider.revokedSessions).toContain("sess_logout_http");

    const afterLogout = await app.inject({
      method: "GET",
      url: "/identity/session",
      headers: { cookie: `af_session=${sessionCookie}` },
    });
    expect(afterLogout.statusCode).toBe(401);
  });

  it("logout-all revokes every session for the subject but not other subjects", async () => {
    identityProvider.setActiveProviderSessions("user_multi", [
      "sess_x",
      "sess_y",
    ]);
    identityProvider.setActiveProviderSessions("user_other", ["sess_other"]);
    const firstExchange = await app.inject({
      method: "POST",
      url: "/identity/exchange",
      headers: {
        authorization: `Bearer ${validProviderToken("user_multi", "sess_x")}`,
      },
    });
    const firstCookie = parseSetCookies(firstExchange)["af_session"];

    const secondExchange = await app.inject({
      method: "POST",
      url: "/identity/exchange",
      headers: {
        authorization: `Bearer ${validProviderToken("user_multi", "sess_y")}`,
      },
    });
    const secondCookie = parseSetCookies(secondExchange)["af_session"];

    const otherExchange = await app.inject({
      method: "POST",
      url: "/identity/exchange",
      headers: {
        authorization: `Bearer ${validProviderToken("user_other")}`,
      },
    });
    const otherCookie = parseSetCookies(otherExchange)["af_session"];

    const statusResponse = await app.inject({
      method: "GET",
      url: "/identity/session",
      headers: { cookie: `af_session=${firstCookie}` },
    });
    const csrfToken = statusResponse.json().csrfToken as string;
    const csrfCookie = parseSetCookies(statusResponse)["_csrf"];

    const logoutAllResponse = await app.inject({
      method: "POST",
      url: "/identity/session/logout-all",
      headers: {
        cookie: cookieHeader({ af_session: firstCookie, _csrf: csrfCookie }),
        origin: WEB_ORIGIN,
        "content-type": "application/json",
        "x-csrf-token": csrfToken,
      },
      payload: {},
    });
    expect(logoutAllResponse.statusCode).toBe(201);
    expect(identityProvider.revokeAllRequests.at(-1)).toEqual({
      externalSubject: "user_multi",
      options: undefined,
    });
    expect(identityProvider.revokedSessions).toEqual(
      expect.arrayContaining(["sess_x", "sess_y"]),
    );
    expect(identityProvider.revokedSessions).not.toContain("sess_other");

    const firstAfter = await app.inject({
      method: "GET",
      url: "/identity/session",
      headers: { cookie: `af_session=${firstCookie}` },
    });
    const secondAfter = await app.inject({
      method: "GET",
      url: "/identity/session",
      headers: { cookie: `af_session=${secondCookie}` },
    });
    const otherAfter = await app.inject({
      method: "GET",
      url: "/identity/session",
      headers: { cookie: `af_session=${otherCookie}` },
    });

    expect(firstAfter.statusCode).toBe(401);
    expect(secondAfter.statusCode).toBe(401);
    expect(otherAfter.statusCode).toBe(200);
  });

  it("recovery completion revokes prior sessions before establishing a new one", async () => {
    identityProvider.setActiveProviderSessions("user_recovery", [
      "sess_old",
      "sess_new",
    ]);
    const exchange = await app.inject({
      method: "POST",
      url: "/identity/exchange",
      headers: {
        authorization: `Bearer ${validProviderToken("user_recovery", "sess_old")}`,
      },
    });
    const oldCookie = parseSetCookies(exchange)["af_session"];

    const recoveryResponse = await app.inject({
      method: "POST",
      url: "/identity/recovery/complete",
      headers: {
        authorization: `Bearer ${validProviderToken("user_recovery", "sess_new")}`,
      },
    });
    expect(recoveryResponse.statusCode).toBe(201);
    expect(identityProvider.revokeAllRequests.at(-1)).toEqual({
      externalSubject: "user_recovery",
      options: { excludeProviderSessionId: "sess_new" },
    });
    expect(identityProvider.revokedSessions).toContain("sess_old");
    expect(identityProvider.revokedSessions).not.toContain("sess_new");
    const newCookie = parseSetCookies(recoveryResponse)["af_session"];

    const oldStatus = await app.inject({
      method: "GET",
      url: "/identity/session",
      headers: { cookie: `af_session=${oldCookie}` },
    });
    const newStatus = await app.inject({
      method: "GET",
      url: "/identity/session",
      headers: { cookie: `af_session=${newCookie}` },
    });

    expect(oldStatus.statusCode).toBe(401);
    expect(newStatus.statusCode).toBe(200);
    const activeRecoveryRows = sessionStore
      .all()
      .filter(
        (row) =>
          row.externalSubject === "user_recovery" && row.revokedAt === null,
      );
    expect(activeRecoveryRows).toHaveLength(1);
    expect(activeRecoveryRows[0]?.providerSessionId).toBe("sess_new");
  });

  describe("frontend request-shape regression evidence", () => {
    it("accepts exchange with Authorization and no JSON header/body, matching the frontend client", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/identity/exchange",
        headers: {
          authorization: `Bearer ${validProviderToken("user_shape_exchange")}`,
        },
        // Deliberately no content-type header and no payload.
      });

      expect(response.statusCode).toBe(201);
    });

    it("accepts recovery completion with Authorization and no JSON header/body, matching the frontend client", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/identity/recovery/complete",
        headers: {
          authorization: `Bearer ${validProviderToken("user_shape_recovery")}`,
        },
        // Deliberately no content-type header and no payload.
      });

      expect(response.statusCode).toBe(201);
    });

    it("accepts logout with application/json and an explicit '{}' body, matching the frontend client", async () => {
      const exchange = await app.inject({
        method: "POST",
        url: "/identity/exchange",
        headers: {
          authorization: `Bearer ${validProviderToken("user_shape_logout")}`,
        },
      });
      const sessionCookie = parseSetCookies(exchange)["af_session"];
      const statusResponse = await app.inject({
        method: "GET",
        url: "/identity/session",
        headers: { cookie: `af_session=${sessionCookie}` },
      });
      const csrfToken = statusResponse.json().csrfToken as string;
      const csrfCookie = parseSetCookies(statusResponse)["_csrf"];

      const response = await app.inject({
        method: "POST",
        url: "/identity/session/logout",
        headers: {
          cookie: cookieHeader({
            af_session: sessionCookie,
            _csrf: csrfCookie,
          }),
          origin: WEB_ORIGIN,
          "content-type": "application/json",
          "x-csrf-token": csrfToken,
        },
        payload: "{}",
      });

      expect(response.statusCode).toBe(201);
    });

    it("rejects logout with Content-Type: application/json and an empty body — proving the regression test is meaningful", async () => {
      const exchange = await app.inject({
        method: "POST",
        url: "/identity/exchange",
        headers: {
          authorization: `Bearer ${validProviderToken("user_shape_empty_body")}`,
        },
      });
      const sessionCookie = parseSetCookies(exchange)["af_session"];
      const statusResponse = await app.inject({
        method: "GET",
        url: "/identity/session",
        headers: { cookie: `af_session=${sessionCookie}` },
      });
      const csrfToken = statusResponse.json().csrfToken as string;
      const csrfCookie = parseSetCookies(statusResponse)["_csrf"];

      const response = await app.inject({
        method: "POST",
        url: "/identity/session/logout",
        headers: {
          cookie: cookieHeader({
            af_session: sessionCookie,
            _csrf: csrfCookie,
          }),
          origin: WEB_ORIGIN,
          "content-type": "application/json",
          "x-csrf-token": csrfToken,
        },
        // No payload at all — this is the exact pre-fix client bug.
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
