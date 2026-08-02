import type { RevokeAllProviderSessionsOptions } from "./identity-provider.port.js";

export interface ProviderSessionSummary {
  readonly id: string;
}

export interface ProviderSessionsApiPort {
  getSessionList(params: {
    userId: string;
    status: "active";
    limit: number;
    offset: number;
  }): Promise<{ data: ProviderSessionSummary[]; totalCount: number }>;
  revokeSession(sessionId: string): Promise<unknown>;
}

/** Clerk's documented maximum `limit` is 500; this stays well within it. */
export const PROVIDER_SESSION_PAGE_SIZE = 100;

/** Safety cap so a misbehaving provider API can never cause an infinite loop. */
const MAX_PAGES = 1000;

/**
 * Revokes active Clerk sessions for one external subject, optionally
 * preserving one freshly authenticated provider session.
 *
 * Two-phase collect-then-revoke: first page through `getSessionList` with a
 * properly incrementing offset, collecting every unique session id, until
 * either a page returns no rows or the running offset reaches the
 * provider-reported `totalCount`. Only once collection is complete is the
 * optional excluded id removed from the deduplicated revocation set, and
 * only then does revocation begin.
 *
 * This ordering matters: revoking sessions while still paginating (as an
 * offset:0-repeated "drain" would) mutates the very "active" set being
 * paged through, which can either skip sessions (incrementing offset while
 * revoking shrinks the set) or terminate early (offset:0 with an
 * already-attempted filter stops as soon as one fetched page is entirely
 * already-attempted, even though further real pages remain). Collecting
 * first makes revocation-time failures unable to affect what was already
 * seen, and a listing failure partway through still leaves whatever was
 * already collected eligible for revocation — it only stops collecting
 * further pages.
 *
 * Every step is best-effort: a listing failure terminates collection
 * without throwing, and each session's revocation failure is independent of
 * every other session's, so one failing id (or a whole page of them) can
 * never prevent later ids from being attempted.
 */
export async function revokeAllActiveProviderSessions(
  sessionsApi: ProviderSessionsApiPort,
  externalSubject: string,
  options?: RevokeAllProviderSessionsOptions,
): Promise<void> {
  const collected = new Map<string, ProviderSessionSummary>();
  let offset = 0;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    let result: { data: ProviderSessionSummary[]; totalCount: number };
    try {
      result = await sessionsApi.getSessionList({
        userId: externalSubject,
        status: "active",
        limit: PROVIDER_SESSION_PAGE_SIZE,
        offset,
      });
    } catch {
      // Best-effort: a listing failure stops collecting further pages, but
      // whatever was already collected is still revoked below.
      break;
    }

    for (const session of result.data) {
      collected.set(session.id, session);
    }

    if (result.data.length === 0) {
      break;
    }

    offset += result.data.length;

    if (offset >= result.totalCount) {
      break;
    }
  }

  const idsToRevoke = [...collected.keys()].filter(
    (id) => id !== options?.excludeProviderSessionId,
  );

  await Promise.all(
    idsToRevoke.map((id) =>
      sessionsApi.revokeSession(id).catch(() => undefined),
    ),
  );
}
