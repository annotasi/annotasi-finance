import { and, eq, gt, isNull, sql } from "drizzle-orm";

import { applicationSessions } from "../../schema/application-sessions.js";
import type { SessionStoreClient } from "./client.js";

export type ApplicationSessionRecord = typeof applicationSessions.$inferSelect;

export interface CreateApplicationSessionInput {
  readonly tokenHash: string;
  readonly externalSubject: string;
  readonly providerSessionId: string | null;
  readonly expiresAt: Date;
}

/**
 * Runtime-only repository for the `application_sessions` table.
 *
 * Every method issues a fresh, parameterized query against PostgreSQL —
 * nothing is cached or trusted from process memory, so lookups remain
 * correct across API process restarts and multiple instances.
 */
export class SessionStore {
  public constructor(private readonly db: SessionStoreClient) {}

  public async create(
    input: CreateApplicationSessionInput,
  ): Promise<{ id: string }> {
    const [row] = await this.db
      .insert(applicationSessions)
      .values({
        tokenHash: input.tokenHash,
        externalSubject: input.externalSubject,
        providerSessionId: input.providerSessionId,
        expiresAt: input.expiresAt,
      })
      .returning({ id: applicationSessions.id });

    if (row === undefined) {
      throw new Error("Failed to persist a new application session.");
    }

    return row;
  }

  /**
   * Resolves an active (non-revoked, non-expired) session by its token
   * hash. Returns null for a forged, unknown, expired, or revoked token.
   */
  public async findActiveByTokenHash(
    tokenHash: string,
  ): Promise<ApplicationSessionRecord | null> {
    const [row] = await this.db
      .select()
      .from(applicationSessions)
      .where(
        and(
          eq(applicationSessions.tokenHash, tokenHash),
          isNull(applicationSessions.revokedAt),
          gt(applicationSessions.expiresAt, sql`now()`),
        ),
      )
      .limit(1);

    return row ?? null;
  }

  public async touchLastUsed(id: string): Promise<void> {
    await this.db
      .update(applicationSessions)
      .set({ lastUsedAt: sql`now()` })
      .where(eq(applicationSessions.id, id));
  }

  /**
   * Revokes exactly one session by row id. Idempotent: revoking an
   * already-revoked session leaves its original revocation untouched.
   */
  public async revokeById(id: string, reason: string): Promise<void> {
    await this.db
      .update(applicationSessions)
      .set({ revokedAt: sql`now()`, revokedReason: reason })
      .where(
        and(
          eq(applicationSessions.id, id),
          isNull(applicationSessions.revokedAt),
        ),
      );
  }

  /**
   * Revokes every currently active session for one external subject.
   * Never touches sessions belonging to another subject.
   */
  public async revokeAllForSubject(
    externalSubject: string,
    reason: string,
  ): Promise<number> {
    const revoked = await this.db
      .update(applicationSessions)
      .set({ revokedAt: sql`now()`, revokedReason: reason })
      .where(
        and(
          eq(applicationSessions.externalSubject, externalSubject),
          isNull(applicationSessions.revokedAt),
        ),
      )
      .returning({ id: applicationSessions.id });

    return revoked.length;
  }
}
