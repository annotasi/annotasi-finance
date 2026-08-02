import { describe, expect, it, vi } from "vitest";

import {
  PROVIDER_SESSION_PAGE_SIZE,
  revokeAllActiveProviderSessions,
  type ProviderSessionsApiPort,
} from "../src/identity-session/revoke-all-provider-sessions.js";

function makeSessions(count: number): { id: string }[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `sess_${index}`,
  }));
}

/**
 * A fake Clerk sessions API that mimics real "active" filtering: a
 * successful revoke removes the session from the underlying active list, so
 * a subsequent offset:0 fetch naturally returns the next batch.
 */
function makeFakeSessionsApi(initial: { id: string }[]) {
  let active = [...initial];
  const getSessionListCalls: {
    userId: string;
    limit: number;
    offset: number;
  }[] = [];
  const revokeSessionCalls: string[] = [];
  const failingIds = new Set<string>();

  const api: ProviderSessionsApiPort = {
    getSessionList: vi.fn(async ({ userId, limit, offset }) => {
      getSessionListCalls.push({ userId, limit, offset });
      return {
        data: active.slice(offset, offset + limit),
        totalCount: active.length,
      };
    }),
    revokeSession: vi.fn((sessionId: string) => {
      revokeSessionCalls.push(sessionId);
      if (failingIds.has(sessionId)) {
        return Promise.reject(new Error("simulated revoke failure"));
      }
      active = active.filter((session) => session.id !== sessionId);
      return Promise.resolve();
    }),
  };

  return { api, getSessionListCalls, revokeSessionCalls, failingIds };
}

describe("revokeAllActiveProviderSessions", () => {
  it("does nothing when there are zero active sessions", async () => {
    const { api, revokeSessionCalls } = makeFakeSessionsApi([]);

    await revokeAllActiveProviderSessions(api, "user_1");

    expect(revokeSessionCalls).toEqual([]);
  });

  it("revokes every session within a single page", async () => {
    const { api, revokeSessionCalls } = makeFakeSessionsApi(makeSessions(3));

    await revokeAllActiveProviderSessions(api, "user_1");

    expect(revokeSessionCalls.sort()).toEqual(
      ["sess_0", "sess_1", "sess_2"].sort(),
    );
  });

  it("excludes only the requested fresh session from the revocation set", async () => {
    const { api, revokeSessionCalls } = makeFakeSessionsApi([
      { id: "sess_old_1" },
      { id: "sess_fresh" },
      { id: "sess_old_2" },
    ]);

    await revokeAllActiveProviderSessions(api, "user_1", {
      excludeProviderSessionId: "sess_fresh",
    });

    expect(revokeSessionCalls.sort()).toEqual(
      ["sess_old_1", "sess_old_2"].sort(),
    );
    expect(revokeSessionCalls).not.toContain("sess_fresh");
  });

  it("drains multiple pages, including a partially filled last page", async () => {
    const total = PROVIDER_SESSION_PAGE_SIZE * 2 + 30;
    const { api, revokeSessionCalls, getSessionListCalls } =
      makeFakeSessionsApi(makeSessions(total));

    await revokeAllActiveProviderSessions(api, "user_1");

    expect(revokeSessionCalls).toHaveLength(total);
    expect(new Set(revokeSessionCalls).size).toBe(total);
    // At least 3 fetches were required to drain 2 full pages + 1 partial page.
    expect(getSessionListCalls.length).toBeGreaterThanOrEqual(3);
  });

  it("continues revoking later sessions after one revoke failure, without retrying the failed one", async () => {
    const { api, revokeSessionCalls, failingIds } = makeFakeSessionsApi(
      makeSessions(5),
    );
    failingIds.add("sess_2");

    await revokeAllActiveProviderSessions(api, "user_1");

    const attemptsOnFailingSession = revokeSessionCalls.filter(
      (id) => id === "sess_2",
    );
    expect(attemptsOnFailingSession).toHaveLength(1);
    expect(revokeSessionCalls).toEqual(
      expect.arrayContaining(["sess_0", "sess_1", "sess_3", "sess_4"]),
    );
  });

  it("never revokes the same session id more than once", async () => {
    const total = PROVIDER_SESSION_PAGE_SIZE + 10;
    const { api, revokeSessionCalls } = makeFakeSessionsApi(
      makeSessions(total),
    );

    await revokeAllActiveProviderSessions(api, "user_1");

    const counts = new Map<string, number>();
    for (const id of revokeSessionCalls) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    expect([...counts.values()].every((count) => count === 1)).toBe(true);
  });

  it("only requests sessions for the given subject", async () => {
    const { api, getSessionListCalls } = makeFakeSessionsApi(makeSessions(2));

    await revokeAllActiveProviderSessions(api, "user_only_this_one");

    expect(getSessionListCalls.length).toBeGreaterThan(0);
    expect(
      getSessionListCalls.every((call) => call.userId === "user_only_this_one"),
    ).toBe(true);
  });

  it("dedupes a session id that reappears across two fetched pages", async () => {
    const revokeSessionCalls: string[] = [];
    // Page 1 returns sess_0..sess_1, but the *last* id also reappears as
    // the first id of page 2 (e.g. the underlying list shifted by one
    // between the two fetches) — the collector must still revoke it
    // exactly once.
    const pages = [
      [{ id: "sess_0" }, { id: "sess_1" }],
      [{ id: "sess_1" }, { id: "sess_2" }],
      [],
    ];
    let call = 0;
    const api: ProviderSessionsApiPort = {
      getSessionList: vi.fn(async () => {
        const data = pages[call] ?? [];
        call += 1;
        return { data, totalCount: 5 };
      }),
      revokeSession: vi.fn((sessionId: string) => {
        revokeSessionCalls.push(sessionId);
        return Promise.resolve();
      }),
    };

    await revokeAllActiveProviderSessions(api, "user_1");

    expect(revokeSessionCalls.sort()).toEqual(["sess_0", "sess_1", "sess_2"]);
  });

  it("never revokes an excluded id even when duplicates appear across pages", async () => {
    const revokeSessionCalls: string[] = [];
    const pages = [
      [{ id: "sess_old_1" }, { id: "sess_fresh" }],
      [{ id: "sess_fresh" }, { id: "sess_old_2" }],
      [],
    ];
    let call = 0;
    const api: ProviderSessionsApiPort = {
      getSessionList: vi.fn(async () => {
        const data = pages[call] ?? [];
        call += 1;
        return { data, totalCount: 5 };
      }),
      revokeSession: vi.fn((sessionId: string) => {
        revokeSessionCalls.push(sessionId);
        return Promise.resolve();
      }),
    };

    await revokeAllActiveProviderSessions(api, "user_1", {
      excludeProviderSessionId: "sess_fresh",
    });

    expect(revokeSessionCalls.sort()).toEqual(
      ["sess_old_1", "sess_old_2"].sort(),
    );
    expect(revokeSessionCalls.filter((id) => id === "sess_fresh")).toEqual([]);
  });

  it("still attempts every id from later pages even when an entire earlier page fails to revoke", async () => {
    const total = PROVIDER_SESSION_PAGE_SIZE * 2 + 5;
    const { api, revokeSessionCalls, failingIds } = makeFakeSessionsApi(
      makeSessions(total),
    );
    // Fail every id collected from the first page.
    for (let index = 0; index < PROVIDER_SESSION_PAGE_SIZE; index += 1) {
      failingIds.add(`sess_${index}`);
    }

    await revokeAllActiveProviderSessions(api, "user_1");

    // Every id — including the ones whose revocation failed — was attempted
    // exactly once, and every id from the later, non-failing pages is
    // present too.
    expect(revokeSessionCalls).toHaveLength(total);
    expect(new Set(revokeSessionCalls).size).toBe(total);
    for (let index = PROVIDER_SESSION_PAGE_SIZE; index < total; index += 1) {
      expect(revokeSessionCalls).toContain(`sess_${index}`);
    }
  });

  it("terminates safely and still revokes already-collected ids when listing fails mid-collection", async () => {
    const revokeSessionCalls: string[] = [];
    let call = 0;
    const api: ProviderSessionsApiPort = {
      getSessionList: vi.fn(async () => {
        call += 1;
        if (call === 1) {
          return {
            data: makeSessions(PROVIDER_SESSION_PAGE_SIZE),
            totalCount: PROVIDER_SESSION_PAGE_SIZE * 3,
          };
        }
        throw new Error("simulated listing failure");
      }),
      revokeSession: vi.fn((sessionId: string) => {
        revokeSessionCalls.push(sessionId);
        return Promise.resolve();
      }),
    };

    await expect(
      revokeAllActiveProviderSessions(api, "user_1"),
    ).resolves.toBeUndefined();

    // Only the first, successfully-listed page was collected and revoked;
    // the listing failure on page 2 stopped collection without throwing.
    expect(revokeSessionCalls).toHaveLength(PROVIDER_SESSION_PAGE_SIZE);
  });

  it("never loops forever against a provider that keeps reporting more pages", async () => {
    let calls = 0;
    const api: ProviderSessionsApiPort = {
      getSessionList: vi.fn(async ({ offset, limit }) => {
        calls += 1;
        // Always reports a huge totalCount and always returns a full page,
        // so only the page cap (not totalCount/empty-page detection) can
        // stop this from looping forever.
        return {
          data: Array.from({ length: limit }, (_, index) => ({
            id: `sess_${offset + index}`,
          })),
          totalCount: Number.MAX_SAFE_INTEGER,
        };
      }),
      revokeSession: vi.fn(() => Promise.resolve()),
    };

    await revokeAllActiveProviderSessions(api, "user_1");

    expect(calls).toBeLessThan(2000);
  });
});
