import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  completeRecovery,
  exchangeProviderToken,
  fetchOnboardingStatus,
  fetchSessionStatus,
  logoutAllSessions,
  logoutCurrentSession,
  redeemOnboarding,
} from "../lib/api-client";

function mockFetchOnce(body: unknown, ok = true) {
  // Params must match fetch's signature so fetchMock.mock.calls is typed as
  // [string, RequestInit] instead of [].
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => ({
    ok,
    status: ok ? 200 : 401,
    json: async () => body,
  }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("api-client request shapes", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends the exchange request with Authorization only, no Content-Type, no body", async () => {
    const fetchMock = mockFetchOnce({ status: "verified" });

    await exchangeProviderToken("provider-token");

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect(init.credentials).toBe("include");
    expect((init.headers as Record<string, string>)["Authorization"]).toBe(
      "Bearer provider-token",
    );
    expect(init.headers).not.toHaveProperty("Content-Type");
    expect(init.body).toBeUndefined();
  });

  it("sends the recovery-completion request with Authorization only, no Content-Type, no body", async () => {
    const fetchMock = mockFetchOnce({ status: "verified" });

    await completeRecovery("provider-token");

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["Authorization"]).toBe(
      "Bearer provider-token",
    );
    expect(init.headers).not.toHaveProperty("Content-Type");
    expect(init.body).toBeUndefined();
  });

  it("sends the session-status request as a GET with no Content-Type and no body", async () => {
    const fetchMock = mockFetchOnce({
      status: "active",
      expiresAt: "2026-01-01T00:00:00.000Z",
      csrfToken: "csrf",
    });

    await fetchSessionStatus();

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("GET");
    expect(init.credentials).toBe("include");
    expect(init.headers).not.toHaveProperty("Content-Type");
    expect(init.body).toBeUndefined();
  });

  it("sends the current-logout request with Content-Type, a JSON body, and the CSRF header", async () => {
    const fetchMock = mockFetchOnce({ status: "revoked" });

    await logoutCurrentSession("csrf-token");

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe(
      "application/json",
    );
    expect((init.headers as Record<string, string>)["x-csrf-token"]).toBe(
      "csrf-token",
    );
    expect(init.body).toBe("{}");
    expect(init.credentials).toBe("include");
  });

  it("sends the logout-all request with Content-Type, a JSON body, and the CSRF header", async () => {
    const fetchMock = mockFetchOnce({ status: "revoked" });

    await logoutAllSessions("csrf-token");

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe(
      "application/json",
    );
    expect((init.headers as Record<string, string>)["x-csrf-token"]).toBe(
      "csrf-token",
    );
    expect(init.body).toBe("{}");
  });

  it("checks onboarding status with the application cookie and no provider token", async () => {
    const fetchMock = mockFetchOnce({
      status: "invitation_required",
      csrfToken: "csrf-token",
    });
    await fetchOnboardingStatus();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/onboarding/status");
    expect(init.method).toBe("GET");
    expect(init.credentials).toBe("include");
    expect(init.headers).not.toHaveProperty("Authorization");
  });

  it("redeems with JSON, CSRF, and an explicit idempotency key", async () => {
    const fetchMock = mockFetchOnce({ status: "workspace_ready" });
    const body = {
      invitationToken: `afbeta_${"a".repeat(43)}`,
      accountName: "Tunai",
      accountType: "cash" as const,
      openingBalance: "0",
      openingBalanceEffectiveDate: "2026-08-02",
    };
    await redeemOnboarding(body, "csrf-token", "idempotency-key");
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.headers).toMatchObject({
      "Content-Type": "application/json",
      "x-csrf-token": "csrf-token",
      "Idempotency-Key": "idempotency-key",
    });
    expect(JSON.parse(String(init.body))).toEqual(body);
  });
});
