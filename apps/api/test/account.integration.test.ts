import { randomBytes } from "node:crypto";

import fastifyCookie from "@fastify/cookie";
import fastifyCsrfProtection from "@fastify/csrf-protection";
import { hashOnboardingMaterial } from "@annotasi/database/runtime";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { AppModule } from "../src/app.module.js";
import { IDENTITY_PROVIDER } from "../src/identity-session/identity-provider.port.js";
import { redactRequestUrl } from "../src/observability/request-log-redaction.js";
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

describe("ACC-001 Account HTTP security", () => {
  let environment: ApiFoundationEnvironment;
  let app: NestFastifyApplication;
  let identityProvider: FakeIdentityProvider;
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
          // Fastify's default request log line writes the raw URL, which
          // embeds the dynamic Account ID for every /accounts/:id route.
          // This is real, reusable redaction (apps/api/src/observability),
          // not test-only exclusion: request logging stays on and captured,
          // so the log-safety assertions below inspect genuine log content.
          serializers: {
            req: (request: { method: string; url: string }) => ({
              method: request.method,
              url: redactRequestUrl(request.url),
            }),
          },
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
  }, 120_000);

  afterAll(async () => {
    await app?.close();
    await environment?.container.stop();
  });

  async function onboardedAuth(subject: string) {
    const email = `${subject}@example.test`;
    identityProvider.setVerifiedEmails(subject, [email]);
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
    secrets.push(token, email, subject);

    const providerToken = validProviderToken(subject, `provider_${subject}`);
    secrets.push(providerToken);
    const exchange = await app.inject({
      method: "POST",
      url: "/identity/exchange",
      headers: { authorization: `Bearer ${providerToken}` },
    });
    const session = parseSetCookies(exchange)["af_session"] ?? "";
    secrets.push(session);

    const status = await app.inject({
      method: "GET",
      url: "/onboarding/status",
      headers: { cookie: `af_session=${session}` },
    });
    const csrfToken = status.json().csrfToken as string;
    const csrfCookie = parseSetCookies(status)["_csrf"];
    secrets.push(csrfToken, csrfCookie ?? "");
    const cookie = cookieHeader({ af_session: session, _csrf: csrfCookie });

    await app.inject({
      method: "POST",
      url: "/onboarding/redeem",
      headers: {
        cookie,
        origin: WEB_ORIGIN,
        "content-type": "application/json",
        "x-csrf-token": csrfToken,
        "idempotency-key": `${subject.replaceAll(/[^A-Za-z0-9_-]/gu, "_")}-onboarding-key`,
      },
      payload: {
        invitationToken: token,
        accountName: "Starter",
        accountType: "cash",
        openingBalance: "0",
        openingBalanceEffectiveDate: "2026-08-03",
      },
    });

    return { session, csrfToken, cookie };
  }

  function mutationHeaders(
    auth: Awaited<ReturnType<typeof onboardedAuth>>,
    overrides: Record<string, string | undefined> = {},
  ): Record<string, string> {
    const headers = {
      cookie: auth.cookie,
      origin: WEB_ORIGIN,
      "content-type": "application/json",
      "x-csrf-token": auth.csrfToken,
      ...overrides,
    };
    return Object.fromEntries(
      Object.entries(headers).filter(
        (entry): entry is [string, string] => entry[1] !== undefined,
      ),
    );
  }

  it("rejects unauthenticated, forged, and Bearer-only list requests", async () => {
    const providerToken = validProviderToken(
      "matrix_subject",
      "provider-sentinel",
    );
    secrets.push(providerToken);
    const unauthenticated = await app.inject({
      method: "GET",
      url: "/accounts",
    });
    const forged = await app.inject({
      method: "GET",
      url: "/accounts",
      headers: { cookie: "af_session=forged-cookie-sentinel" },
    });
    const bearerOnly = await app.inject({
      method: "GET",
      url: "/accounts",
      headers: { authorization: `Bearer ${providerToken}` },
    });
    for (const response of [unauthenticated, forged, bearerOnly]) {
      expect(response.statusCode).toBe(401);
    }
  });

  it("lists only the authenticated Workspace's own Accounts", async () => {
    const auth = await onboardedAuth("list_scope_subject");
    const response = await app.inject({
      method: "GET",
      url: "/accounts",
      headers: { cookie: auth.cookie },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().accounts).toHaveLength(1);
    expect(response.json().accounts[0]).toMatchObject({
      name: "Starter",
      lifecycleStatus: "active",
      isStarter: true,
      version: "1",
    });
  });

  it("enforces Origin, CSRF, and JSON content-type before create", async () => {
    const auth = await onboardedAuth("create_guards_subject");
    const body = {
      name: "Tunai",
      type: "cash",
      openingBalance: "0",
      openingBalanceEffectiveDate: "2026-08-03",
    };
    const cases = [
      { headers: mutationHeaders(auth, { origin: undefined }), status: 403 },
      {
        headers: mutationHeaders(auth, { origin: "https://evil.example" }),
        status: 403,
      },
      {
        headers: mutationHeaders(auth, { "x-csrf-token": undefined }),
        status: 403,
      },
      {
        headers: mutationHeaders(auth, { "content-type": "text/plain" }),
        status: 403,
      },
    ];
    for (const testCase of cases) {
      const response = await app.inject({
        method: "POST",
        url: "/accounts",
        headers: testCase.headers,
        payload:
          testCase.headers["content-type"] === "text/plain"
            ? JSON.stringify(body)
            : body,
      });
      expect(response.statusCode).toBe(testCase.status);
    }
  });

  it("creates an Account, rejects client-authority fields, and rejects immutable-field mutation payloads", async () => {
    const auth = await onboardedAuth("create_subject");
    const rejectedForAuthorityFields = await app.inject({
      method: "POST",
      url: "/accounts",
      headers: mutationHeaders(auth),
      payload: {
        name: "Rekening baru",
        type: "bank_account",
        openingBalance: BALANCE,
        openingBalanceEffectiveDate: "2026-08-03",
        workspaceId: "attacker-workspace",
        userId: "attacker-user",
      },
    });
    expect(rejectedForAuthorityFields.statusCode).toBe(400);

    const created = await app.inject({
      method: "POST",
      url: "/accounts",
      headers: mutationHeaders(auth),
      payload: {
        name: "Rekening baru",
        type: "bank_account",
        openingBalance: BALANCE,
        openingBalanceEffectiveDate: "2026-08-03",
      },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json().account).toMatchObject({
      name: "Rekening baru",
      type: "bank_account",
      totalBalance: BALANCE,
      unallocatedBalance: BALANCE,
      version: "1",
    });

    const accountId = created.json().account.id as string;
    const rejectedRename = await app.inject({
      method: "PATCH",
      url: `/accounts/${accountId}`,
      headers: mutationHeaders(auth),
      payload: { name: "Renamed", expectedVersion: "1", type: "cash" },
    });
    expect(rejectedRename.statusCode).toBe(400);

    const rename = await app.inject({
      method: "PATCH",
      url: `/accounts/${accountId}`,
      headers: mutationHeaders(auth),
      payload: { name: "Renamed", expectedVersion: "1" },
    });
    expect(rename.statusCode).toBe(200);
    expect(rename.json().account).toMatchObject({
      id: accountId,
      name: "Renamed",
      version: "2",
      totalBalance: BALANCE,
    });
  });

  it("archives a zero-total Account and safely rejects a non-zero Account with an Indonesian explanation", async () => {
    const auth = await onboardedAuth("archive_subject");
    const list = await app.inject({
      method: "GET",
      url: "/accounts",
      headers: { cookie: auth.cookie },
    });
    const starter = list.json().accounts[0];

    const archived = await app.inject({
      method: "POST",
      url: `/accounts/${starter.id}/archive`,
      headers: mutationHeaders(auth),
      payload: { expectedVersion: starter.version },
    });
    expect(archived.statusCode).toBe(201);
    expect(archived.json().account.lifecycleStatus).toBe("archived");

    const created = await app.inject({
      method: "POST",
      url: "/accounts",
      headers: mutationHeaders(auth),
      payload: {
        name: "Non-zero",
        type: "cash",
        openingBalance: "1000",
        openingBalanceEffectiveDate: "2026-08-03",
      },
    });
    const blocked = await app.inject({
      method: "POST",
      url: `/accounts/${created.json().account.id}/archive`,
      headers: mutationHeaders(auth),
      payload: { expectedVersion: created.json().account.version },
    });
    expect(blocked.statusCode).toBe(409);
    expect(blocked.json()).toMatchObject({
      code: "ACCOUNT_ARCHIVE_BALANCE_NON_ZERO",
    });
    expect(blocked.json().message).toMatch(/saldo/iu);
    expect(blocked.json().message).not.toMatch(/konfirmasi/iu);

    const restored = await app.inject({
      method: "POST",
      url: `/accounts/${starter.id}/restore`,
      headers: mutationHeaders(auth),
      payload: { expectedVersion: archived.json().account.version },
    });
    expect(restored.statusCode).toBe(201);
    expect(restored.json().account.lifecycleStatus).toBe("active");
  });

  it("returns ACCOUNT_CONFLICT for a stale expectedVersion without overwriting state", async () => {
    const auth = await onboardedAuth("conflict_subject");
    const list = await app.inject({
      method: "GET",
      url: "/accounts",
      headers: { cookie: auth.cookie },
    });
    const starter = list.json().accounts[0];
    await app.inject({
      method: "PATCH",
      url: `/accounts/${starter.id}`,
      headers: mutationHeaders(auth),
      payload: { name: "First rename", expectedVersion: starter.version },
    });
    const stale = await app.inject({
      method: "PATCH",
      url: `/accounts/${starter.id}`,
      headers: mutationHeaders(auth),
      payload: { name: "Stale rename", expectedVersion: starter.version },
    });
    expect(stale.statusCode).toBe(409);
    expect(stale.json()).toMatchObject({ code: "ACCOUNT_CONFLICT" });
  });

  it("denies a foreign rename/archive and evaluates eligibility read-only", async () => {
    const authA = await onboardedAuth("cross_a_subject");
    const authB = await onboardedAuth("cross_b_subject");
    const listB = await app.inject({
      method: "GET",
      url: "/accounts",
      headers: { cookie: authB.cookie },
    });
    const accountB = listB.json().accounts[0];

    const foreignRename = await app.inject({
      method: "PATCH",
      url: `/accounts/${accountB.id}`,
      headers: mutationHeaders(authA),
      payload: { name: "stolen", expectedVersion: accountB.version },
    });
    expect(foreignRename.statusCode).toBe(404);

    const foreignArchive = await app.inject({
      method: "POST",
      url: `/accounts/${accountB.id}/archive`,
      headers: mutationHeaders(authA),
      payload: { expectedVersion: accountB.version },
    });
    expect(foreignArchive.statusCode).toBe(404);

    const eligibility = await app.inject({
      method: "GET",
      url: `/accounts/${accountB.id}/delete-eligibility`,
      headers: { cookie: authA.cookie },
    });
    expect(eligibility.statusCode).toBe(404);

    const ownEligibility = await app.inject({
      method: "GET",
      url: `/accounts/${accountB.id}/delete-eligibility`,
      headers: { cookie: authB.cookie },
    });
    expect(ownEligibility.statusCode).toBe(200);
    // accountB is the onboarding-created starter Account, so it carries a
    // real onboarding_idempotency dependency and is not eligible, even
    // though its Opening Balance is Rp0.
    expect(ownEligibility.json()).toMatchObject({
      accountId: accountB.id,
      eligible: false,
      reasonCodes: ["DEPENDENCY_EXISTS"],
    });
    const listAfter = await app.inject({
      method: "GET",
      url: "/accounts",
      headers: { cookie: authB.cookie },
    });
    expect(listAfter.json().accounts[0].version).toBe(accountB.version);
  });

  it("rejects a malformed Account ID with a safe 400 before it ever reaches PostgreSQL", async () => {
    const auth = await onboardedAuth("malformed_id_subject");
    const malformedId = "not-a-uuid";

    const rename = await app.inject({
      method: "PATCH",
      url: `/accounts/${malformedId}`,
      headers: mutationHeaders(auth),
      payload: { name: "Tunai", expectedVersion: "1" },
    });
    const archive = await app.inject({
      method: "POST",
      url: `/accounts/${malformedId}/archive`,
      headers: mutationHeaders(auth),
      payload: { expectedVersion: "1" },
    });
    const restore = await app.inject({
      method: "POST",
      url: `/accounts/${malformedId}/restore`,
      headers: mutationHeaders(auth),
      payload: { expectedVersion: "1" },
    });
    const eligibility = await app.inject({
      method: "GET",
      url: `/accounts/${malformedId}/delete-eligibility`,
      headers: { cookie: auth.cookie },
    });

    for (const response of [rename, archive, restore, eligibility]) {
      expect(response.statusCode).toBe(400);
      expect(response.json()).toMatchObject({
        code: "ACCOUNT_REQUEST_INVALID",
      });
      const message = response.json().message as string;
      expect(message).not.toMatch(/22P02|invalid input syntax|postgres|sql/iu);
    }
  });

  it("rejects a malformed expectedVersion on rename/archive/restore with ACCOUNT_REQUEST_INVALID and never mutates state", async () => {
    const malformedVersions = [
      "0",
      "01",
      "1.5",
      "1e3",
      "9223372036854775808",
      "1".repeat(50),
    ];

    for (const expectedVersion of malformedVersions) {
      const auth = await onboardedAuth(`bad_version_${expectedVersion}`);
      const list = await app.inject({
        method: "GET",
        url: "/accounts",
        headers: { cookie: auth.cookie },
      });
      const starter = list.json().accounts[0];

      const rename = await app.inject({
        method: "PATCH",
        url: `/accounts/${starter.id}`,
        headers: mutationHeaders(auth),
        payload: { name: "Renamed", expectedVersion },
      });
      const archive = await app.inject({
        method: "POST",
        url: `/accounts/${starter.id}/archive`,
        headers: mutationHeaders(auth),
        payload: { expectedVersion },
      });
      const restore = await app.inject({
        method: "POST",
        url: `/accounts/${starter.id}/restore`,
        headers: mutationHeaders(auth),
        payload: { expectedVersion },
      });

      for (const response of [rename, archive, restore]) {
        expect(response.statusCode).toBe(400);
        expect(response.json()).toMatchObject({
          code: "ACCOUNT_REQUEST_INVALID",
        });
        expect(response.json().code).not.toBe("ACCOUNT_CONFLICT");
        const message = response.json().message as string;
        expect(message).not.toMatch(
          /22P02|invalid input syntax|postgres|sql/iu,
        );
      }

      const after = await app.inject({
        method: "GET",
        url: "/accounts",
        headers: { cookie: auth.cookie },
      });
      expect(after.json().accounts[0]).toMatchObject({
        name: starter.name,
        version: starter.version,
        lifecycleStatus: "active",
      });
    }
  });

  it("exposes no DELETE route for Accounts", async () => {
    const auth = await onboardedAuth("no_delete_route_subject");
    const list = await app.inject({
      method: "GET",
      url: "/accounts",
      headers: { cookie: auth.cookie },
    });
    const starter = list.json().accounts[0];
    const response = await app.inject({
      method: "DELETE",
      url: `/accounts/${starter.id}`,
      headers: { cookie: auth.cookie },
    });
    expect([404, 405]).toContain(response.statusCode);
  });

  it("redacts and never logs any Account or identity secret across every dynamic route", async () => {
    const subject = "log_safety_subject";
    const auth = await onboardedAuth(subject);
    const sentinelName = "Sentinel Log Safety Account Name";
    const sentinelBalance = "777777";
    const sentinelDate = "2026-03-17";

    const created = await app.inject({
      method: "POST",
      url: "/accounts",
      headers: mutationHeaders(auth),
      payload: {
        name: sentinelName,
        type: "bank_account",
        openingBalance: sentinelBalance,
        openingBalanceEffectiveDate: sentinelDate,
      },
    });
    const accountId = created.json().account.id as string;
    const renamedSentinel = "Sentinel Renamed For Log Safety";

    // Exercise every dynamic /accounts/:id route so the Account ID appears
    // in a real, captured request-log line if redaction were not applied.
    await app.inject({
      method: "PATCH",
      url: `/accounts/${accountId}`,
      headers: mutationHeaders(auth),
      payload: { name: renamedSentinel, expectedVersion: "1" },
    });
    await app.inject({
      method: "POST",
      url: `/accounts/${accountId}/archive`,
      headers: mutationHeaders(auth),
      payload: { expectedVersion: "2" },
    });
    await app.inject({
      method: "POST",
      url: `/accounts/${accountId}/restore`,
      headers: mutationHeaders(auth),
      payload: { expectedVersion: "3" },
    });
    await app.inject({
      method: "GET",
      url: `/accounts/${accountId}/delete-eligibility`,
      headers: { cookie: auth.cookie },
    });

    // User ID and Workspace ID never appear in any HTTP response body;
    // fetch them directly to prove they are absent from logs too.
    const admin = new Client({ connectionString: environment.adminUrl });
    await admin.connect();
    let userId: string;
    let workspaceId: string;
    try {
      const row = (
        await admin.query<{ id: string; workspace_id: string }>(
          `SELECT u.id, w.id AS workspace_id
             FROM users u JOIN workspaces w ON w.owner_user_id = u.id
            WHERE u.external_subject = $1`,
          [subject],
        )
      ).rows[0];
      if (row === undefined) {
        throw new Error(
          "Expected a User/Workspace row for the log-safety subject.",
        );
      }
      userId = row.id;
      workspaceId = row.workspace_id;
    } finally {
      await admin.end();
    }

    secrets.push(
      accountId,
      sentinelName,
      renamedSentinel,
      sentinelBalance,
      sentinelDate,
      userId,
      workspaceId,
      subject,
    );

    const output = logs.join("\n");
    expect(output).not.toContain(BALANCE);
    for (const secret of secrets.filter((value) => value.length > 0)) {
      expect(output).not.toContain(secret);
    }
    // Prove redaction actually engaged (logging stayed on and captured
    // real content), rather than the assertions above passing only because
    // nothing was logged at all.
    expect(output).toContain("[id]");
  });
});
