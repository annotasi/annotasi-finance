import type { IdentitySessionConfig } from "@annotasi/config";
import type { SessionStore } from "@annotasi/database/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import { SessionService } from "../src/identity-session/session.service.js";
import {
  FakeIdentityProvider,
  validProviderToken,
} from "./support/fake-identity-provider.js";
import { FakeSessionStore } from "./support/fake-session-store.js";

function baseConfig(): IdentitySessionConfig {
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
  };
}

describe("SessionService", () => {
  let store: FakeSessionStore;
  let provider: FakeIdentityProvider;
  let service: SessionService;

  beforeEach(() => {
    store = new FakeSessionStore();
    provider = new FakeIdentityProvider();
    service = new SessionService(
      store as unknown as SessionStore,
      provider,
      baseConfig(),
    );
  });

  it("establishes exactly one persisted session for a verified identity", async () => {
    const result = await service.establishSession(
      validProviderToken("user_1", "sess_1"),
    );

    expect(result.rawToken).toBeTruthy();
    expect(store.all()).toHaveLength(1);
    expect(store.all()[0]?.externalSubject).toBe("user_1");
  });

  it("rejects an unverified provider token without persisting a session", async () => {
    await expect(service.establishSession("garbage-token")).rejects.toThrow();
    expect(store.all()).toHaveLength(0);
  });

  it("resolves an active session from a valid raw token", async () => {
    const { rawToken } = await service.establishSession(
      validProviderToken("user_1"),
    );

    const session = await service.validateSession(rawToken);
    expect(session?.externalSubject).toBe("user_1");
  });

  it("returns null for a forged or unknown token", async () => {
    await service.establishSession(validProviderToken("user_1"));
    const session = await service.validateSession("forged-raw-token");
    expect(session).toBeNull();
  });

  it("returns null for a revoked session", async () => {
    const { rawToken } = await service.establishSession(
      validProviderToken("user_1"),
    );
    const session = await service.validateSession(rawToken);
    await service.revokeCurrent(
      session!.id,
      session!.providerSessionId,
      "user_logout",
    );

    expect(await service.validateSession(rawToken)).toBeNull();
  });

  it("passes the exact persisted providerSessionId to the provider adapter on current logout", async () => {
    const { rawToken } = await service.establishSession(
      validProviderToken("user_1", "sess_exact"),
    );
    const session = await service.validateSession(rawToken);
    await service.revokeCurrent(
      session!.id,
      session!.providerSessionId,
      "user_logout",
    );

    expect(provider.revokedSessions).toEqual(["sess_exact"]);
  });

  it("does not call the provider when providerSessionId is null", async () => {
    const { rawToken } = await service.establishSession(
      validProviderToken("user_1"),
    );
    const session = await service.validateSession(rawToken);
    expect(session!.providerSessionId).toBeNull();

    await service.revokeCurrent(
      session!.id,
      session!.providerSessionId,
      "user_logout",
    );

    expect(provider.revokedSessions).toEqual([]);
    expect(await service.validateSession(rawToken)).toBeNull();
  });

  it("leaves another subject's provider session untouched on current logout", async () => {
    const first = await service.establishSession(
      validProviderToken("user_1", "sess_1"),
    );
    await service.establishSession(validProviderToken("user_2", "sess_2"));
    const session = await service.validateSession(first.rawToken);

    await service.revokeCurrent(
      session!.id,
      session!.providerSessionId,
      "user_logout",
    );

    expect(provider.revokedSessions).toEqual(["sess_1"]);
    expect(provider.revokedSessions).not.toContain("sess_2");
  });

  it("keeps the application session revoked even when provider revocation fails", async () => {
    const { rawToken } = await service.establishSession(
      validProviderToken("user_1", "sess_1"),
    );
    const session = await service.validateSession(rawToken);
    provider.failRevocation = true;

    await expect(
      service.revokeCurrent(
        session!.id,
        session!.providerSessionId,
        "user_logout",
      ),
    ).resolves.toBeUndefined();

    expect(await service.validateSession(rawToken)).toBeNull();
  });

  it("revokes only sessions belonging to the target subject", async () => {
    await service.establishSession(validProviderToken("user_1"));
    await service.establishSession(validProviderToken("user_2"));
    provider.setActiveProviderSessions("user_1", ["sess_1", "sess_2"]);
    provider.setActiveProviderSessions("user_2", ["sess_other"]);

    const revokedCount = await service.revokeAllForSubject(
      "user_1",
      "user_logout_all",
    );

    expect(revokedCount).toBe(1);
    const remaining = store.all().filter((row) => row.revokedAt === null);
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.externalSubject).toBe("user_2");
    expect(provider.revokeAllRequests).toEqual([
      { externalSubject: "user_1", options: undefined },
    ]);
    expect(provider.revokedSessions).toEqual(["sess_1", "sess_2"]);
    expect(provider.revokedSessions).not.toContain("sess_other");
  });

  it("keeps every application session revoked (logout-all) even when provider revocation fails", async () => {
    const { rawToken } = await service.establishSession(
      validProviderToken("user_1"),
    );
    provider.failRevocation = true;

    await expect(
      service.revokeAllForSubject("user_1", "user_logout_all"),
    ).resolves.toBe(1);

    expect(await service.validateSession(rawToken)).toBeNull();
  });

  it("revokes old application and provider sessions but preserves the fresh recovery session", async () => {
    const first = await service.establishSession(
      validProviderToken("user_1", "sess_old"),
    );
    provider.setActiveProviderSessions("user_1", ["sess_old", "sess_fresh"]);

    await service.establishSessionAfterRecovery(
      validProviderToken("user_1", "sess_fresh"),
    );

    expect(await service.validateSession(first.rawToken)).toBeNull();
    expect(provider.revokeAllRequests).toEqual([
      {
        externalSubject: "user_1",
        options: { excludeProviderSessionId: "sess_fresh" },
      },
    ]);
    expect(provider.revokedSessions).toEqual(["sess_old"]);
    expect(provider.revokedSessions).not.toContain("sess_fresh");
    const active = store.all().filter((row) => row.revokedAt === null);
    expect(active).toHaveLength(1);
    expect(active[0]?.revokedReason).toBeNull();
    expect(active[0]?.providerSessionId).toBe("sess_fresh");
  });

  it("skips unsafe provider bulk revocation when recovery has no providerSessionId", async () => {
    const first = await service.establishSession(
      validProviderToken("user_1", "sess_old"),
    );
    provider.setActiveProviderSessions("user_1", ["sess_old"]);

    const fresh = await service.establishSessionAfterRecovery(
      validProviderToken("user_1"),
    );

    expect(provider.revokeAllRequests).toEqual([]);
    expect(provider.revokedSessions).toEqual([]);
    expect(await service.validateSession(first.rawToken)).toBeNull();
    expect(await service.validateSession(fresh.rawToken)).not.toBeNull();
    const active = store.all().filter((row) => row.revokedAt === null);
    expect(active).toHaveLength(1);
    expect(active[0]?.providerSessionId).toBeNull();
  });

  it("still establishes a fresh session on recovery even when provider revocation fails", async () => {
    const first = await service.establishSession(
      validProviderToken("user_1", "sess_old"),
    );
    provider.setActiveProviderSessions("user_1", ["sess_old", "sess_fresh"]);
    provider.failRevocation = true;

    const fresh = await service.establishSessionAfterRecovery(
      validProviderToken("user_1", "sess_fresh"),
    );

    expect(fresh.rawToken).toBeTruthy();
    expect(provider.revokeAllRequests).toEqual([
      {
        externalSubject: "user_1",
        options: { excludeProviderSessionId: "sess_fresh" },
      },
    ]);
    expect(await service.validateSession(first.rawToken)).toBeNull();
    expect(await service.validateSession(fresh.rawToken)).not.toBeNull();
    const active = store.all().filter((row) => row.revokedAt === null);
    expect(active).toHaveLength(1);
    expect(active[0]?.providerSessionId).toBe("sess_fresh");
  });
});
