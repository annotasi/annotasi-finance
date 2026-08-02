import { randomBytes } from "node:crypto";

import fastifyCookie from "@fastify/cookie";
import fastifyCsrfProtection from "@fastify/csrf-protection";
import {
  createSessionStoreConnection,
  hashOnboardingMaterial,
  SessionStore,
} from "@annotasi/database/runtime";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { AppModule } from "../src/app.module.js";
import { IDENTITY_PROVIDER } from "../src/identity-session/identity-provider.port.js";
import { hashSessionToken } from "../src/identity-session/token.js";
import {
  type ApiFoundationEnvironment,
  startApiFoundationEnvironment,
} from "./support/foundation-environment.js";
import {
  FakeIdentityProvider,
  validProviderToken,
} from "./support/fake-identity-provider.js";

const { Client } = pg;
const WEB_ORIGIN = "http://localhost:3000";
const BALANCE = "918273645";

function parseSetCookies(response: {
  headers: Record<string, string | string[] | number | undefined>;
}): Record<string, string> {
  const raw = response.headers["set-cookie"];
  const values = Array.isArray(raw)
    ? raw
    : raw === undefined
      ? []
      : [String(raw)];
  return Object.fromEntries(
    values.map((entry) => {
      const pair = entry.split(";", 1)[0] ?? "";
      const index = pair.indexOf("=");
      return [pair.slice(0, index), pair.slice(index + 1)];
    }),
  );
}

function cookieHeader(cookies: Record<string, string | undefined>): string {
  return Object.entries(cookies)
    .filter((entry): entry is [string, string] => entry[1] !== undefined)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

function invitationToken(): string {
  return `afbeta_${randomBytes(32).toString("base64url")}`;
}

describe("IAM-002 onboarding HTTP security", () => {
  let environment: ApiFoundationEnvironment;
  let app: NestFastifyApplication;
  let identityProvider: FakeIdentityProvider;
  let fixtureConnection: ReturnType<typeof createSessionStoreConnection>;
  const logs: string[] = [];
  const secrets: string[] = [];

  beforeAll(async () => {
    environment = await startApiFoundationEnvironment();
    process.env["DATABASE_APPLICATION_URL"] = environment.applicationUrl;
    identityProvider = new FakeIdentityProvider();

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(IDENTITY_PROVIDER)
      .useValue(identityProvider)
      .compile();
    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter({
        logger: {
          level: "info",
          stream: { write: (message: string) => logs.push(message) },
        },
      }),
      { logger: false },
    );
    await app.register(fastifyCookie);
    await app.register(fastifyCsrfProtection, {
      sessionPlugin: "@fastify/cookie",
      csrfOpts: { hmacKey: "a".repeat(32), userInfo: false },
    });
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    fixtureConnection = createSessionStoreConnection(
      environment.applicationUrl,
    );
  }, 120_000);

  afterAll(async () => {
    await fixtureConnection?.close();
    await app?.close();
    await environment?.container.stop();
  });

  async function issue(email: string): Promise<string> {
    const token = invitationToken();
    const operator = new Client({ connectionString: environment.operatorUrl });
    await operator.connect();
    try {
      await operator.query(
        `INSERT INTO private_beta_invitations
           (invited_email_normalized, token_hash)
         VALUES ($1, $2)`,
        [email, hashOnboardingMaterial(token)],
      );
    } finally {
      await operator.end();
    }
    secrets.push(token, email);
    return token;
  }

  async function exchange(subject: string): Promise<string> {
    const providerToken = validProviderToken(subject, `provider_${subject}`);
    secrets.push(subject, providerToken);
    const response = await app.inject({
      method: "POST",
      url: "/identity/exchange",
      headers: { authorization: `Bearer ${providerToken}` },
    });
    expect(response.statusCode).toBe(201);
    return parseSetCookies(response)["af_session"] ?? "";
  }

  async function authenticated(subject: string) {
    const session = await exchange(subject);
    secrets.push(session);
    const status = await app.inject({
      method: "GET",
      url: "/onboarding/status",
      headers: { cookie: `af_session=${session}` },
    });
    expect(status.statusCode).toBe(200);
    const csrfToken = status.json().csrfToken as string;
    const csrfCookie = parseSetCookies(status)["_csrf"];
    secrets.push(csrfToken, csrfCookie ?? "");
    return {
      session,
      csrfToken,
      csrfCookie,
      cookie: cookieHeader({ af_session: session, _csrf: csrfCookie }),
    };
  }

  function body(token: string) {
    return {
      invitationToken: token,
      accountName: "Kas Utama",
      accountType: "cash",
      openingBalance: BALANCE,
      openingBalanceEffectiveDate: "2026-08-02",
    };
  }

  function redeemHeaders(
    auth: Awaited<ReturnType<typeof authenticated>>,
    overrides: Record<string, string | undefined> = {},
  ): Record<string, string> {
    const headers = {
      cookie: auth.cookie,
      origin: WEB_ORIGIN,
      "content-type": "application/json",
      "x-csrf-token": auth.csrfToken,
      "idempotency-key": "onboarding-key-0001",
      ...overrides,
    };
    return Object.fromEntries(
      Object.entries(headers).filter(
        (entry): entry is [string, string] => entry[1] !== undefined,
      ),
    );
  }

  it("rejects unauthenticated, forged, revoked, expired, and Bearer-only sessions", async () => {
    const subject = "session_matrix_subject";
    const providerToken = validProviderToken(
      subject,
      "provider-payload-sentinel",
    );
    secrets.push(subject, providerToken, "forged-cookie-sentinel");
    const unauthenticated = await app.inject({
      method: "GET",
      url: "/onboarding/status",
    });
    const forged = await app.inject({
      method: "GET",
      url: "/onboarding/status",
      headers: { cookie: "af_session=forged-cookie-sentinel" },
    });
    const bearerOnly = await app.inject({
      method: "GET",
      url: "/onboarding/status",
      headers: { authorization: `Bearer ${providerToken}` },
    });

    const sessionStore = new SessionStore(fixtureConnection.db);
    const revokedRaw = randomBytes(32).toString("base64url");
    const revoked = await sessionStore.create({
      tokenHash: hashSessionToken(revokedRaw),
      externalSubject: subject,
      providerSessionId: null,
      expiresAt: new Date("2099-01-01T00:00:00.000Z"),
    });
    await sessionStore.revokeById(revoked.id, "test_revoked");
    const expiredRaw = randomBytes(32).toString("base64url");
    await sessionStore.create({
      tokenHash: hashSessionToken(expiredRaw),
      externalSubject: subject,
      providerSessionId: null,
      expiresAt: new Date("2000-01-01T00:00:00.000Z"),
    });
    secrets.push(revokedRaw, expiredRaw);
    const revokedResponse = await app.inject({
      method: "GET",
      url: "/onboarding/status",
      headers: { cookie: `af_session=${revokedRaw}` },
    });
    const expiredResponse = await app.inject({
      method: "GET",
      url: "/onboarding/status",
      headers: { cookie: `af_session=${expiredRaw}` },
    });

    for (const response of [
      unauthenticated,
      forged,
      bearerOnly,
      revokedResponse,
      expiredResponse,
    ]) {
      expect(response.statusCode).toBe(401);
      expect(response.body).not.toContain("stack");
    }
  });

  it("accepts a valid opaque application session", async () => {
    const auth = await authenticated("valid_cookie_subject");
    const response = await app.inject({
      method: "GET",
      url: "/onboarding/status",
      headers: { cookie: `af_session=${auth.session}` },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ status: "invitation_required" });
  });

  it("enforces Origin, CSRF, JSON, and Idempotency-Key before redemption", async () => {
    const subject = "mutation_guards_subject";
    const email = `${subject}@example.test`;
    identityProvider.setVerifiedEmails(subject, [email]);
    const token = await issue(email);
    const auth = await authenticated(subject);
    const requestBody = body(token);
    const cases = [
      { headers: redeemHeaders(auth, { origin: undefined }), status: 403 },
      {
        headers: redeemHeaders(auth, { origin: "https://evil.example" }),
        status: 403,
      },
      {
        headers: redeemHeaders(auth, { "x-csrf-token": undefined }),
        status: 403,
      },
      {
        headers: redeemHeaders(auth, { "x-csrf-token": "invalid-csrf" }),
        status: 403,
      },
      {
        headers: redeemHeaders(auth, { "content-type": "text/plain" }),
        status: 403,
      },
      {
        headers: redeemHeaders(auth, { "idempotency-key": undefined }),
        status: 400,
      },
      {
        headers: redeemHeaders(auth, { "idempotency-key": "short" }),
        status: 400,
      },
    ];
    for (const testCase of cases) {
      const response = await app.inject({
        method: "POST",
        url: "/onboarding/redeem",
        headers: testCase.headers,
        payload:
          testCase.headers["content-type"] === "text/plain"
            ? JSON.stringify(requestBody)
            : requestBody,
      });
      expect(response.statusCode).toBe(testCase.status);
    }
  });

  it("returns a safe response for an invalid invitation", async () => {
    const subject = "invalid_invitation_subject";
    const email = `${subject}@example.test`;
    identityProvider.setVerifiedEmails(subject, [email]);
    const auth = await authenticated(subject);
    const token = invitationToken();
    secrets.push(token, email);
    const response = await app.inject({
      method: "POST",
      url: "/onboarding/redeem",
      headers: redeemHeaders(auth),
      payload: body(token),
    });
    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({
      code: "INVITATION_REJECTED",
    });
    for (const secret of [token, email, subject, BALANCE, auth.session]) {
      expect(response.body).not.toContain(secret);
    }
  });

  it("redeems once, ignores client authority fields, replays exactly, and rejects changed material", async () => {
    const subject = "successful_http_subject";
    const email = `${subject}@example.test`;
    identityProvider.setVerifiedEmails(subject, [email]);
    const token = await issue(email);
    const auth = await authenticated(subject);
    const guessedWorkspaceId = "11111111-1111-4111-8111-111111111111";
    const requestBody = {
      ...body(token),
      userId: "attacker-user",
      workspaceId: guessedWorkspaceId,
      ownerId: "attacker-owner",
    };
    const headers = redeemHeaders(auth, {
      "idempotency-key": "successful-key-0001",
    });
    const first = await app.inject({
      method: "POST",
      url: "/onboarding/redeem",
      headers,
      payload: requestBody,
    });
    expect(first.statusCode).toBe(201);
    expect(first.json()).toMatchObject({
      status: "workspace_ready",
      replayed: false,
    });
    expect(first.json().workspaceId).not.toBe(guessedWorkspaceId);

    const replay = await app.inject({
      method: "POST",
      url: "/onboarding/redeem",
      headers,
      payload: requestBody,
    });
    expect(replay.statusCode).toBe(201);
    expect(replay.json()).toEqual({ ...first.json(), replayed: true });

    const changed = await app.inject({
      method: "POST",
      url: "/onboarding/redeem",
      headers,
      payload: { ...requestBody, accountName: "Changed" },
    });
    expect(changed.statusCode).toBe(409);
    expect(changed.json()).toMatchObject({ code: "IDEMPOTENCY_CONFLICT" });

    const status = await app.inject({
      method: "GET",
      url: "/onboarding/status",
      headers: { cookie: `af_session=${auth.session}` },
    });
    expect(status.statusCode).toBe(200);
    expect(status.json()).toMatchObject({
      status: "workspace_ready",
      workspaceId: first.json().workspaceId,
      accountId: first.json().accountId,
    });
  });

  it("does not expose sensitive onboarding or identity material in API logs", () => {
    const output = logs.join("\n");
    expect(output).not.toContain(BALANCE);
    for (const secret of secrets.filter((value) => value.length > 0)) {
      expect(output).not.toContain(secret);
    }
  });
});
