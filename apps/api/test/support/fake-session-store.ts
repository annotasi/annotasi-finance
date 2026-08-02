import { randomUUID } from "node:crypto";

import type {
  ApplicationSessionRecord,
  CreateApplicationSessionInput,
} from "@annotasi/database/runtime";

/**
 * In-memory test double for SessionStore. Used to test the API layer
 * (guards, controllers, CSRF/origin behavior) in isolation from a real
 * PostgreSQL instance — the real-database proof lives in the database
 * package's own Testcontainers integration tests.
 */
export class FakeSessionStore {
  private readonly rows = new Map<string, ApplicationSessionRecord>();

  public create(input: CreateApplicationSessionInput): Promise<{ id: string }> {
    const id = randomUUID();
    const now = new Date();
    this.rows.set(id, {
      id,
      tokenHash: input.tokenHash,
      externalSubject: input.externalSubject,
      providerSessionId: input.providerSessionId,
      createdAt: now,
      lastUsedAt: now,
      expiresAt: input.expiresAt,
      revokedAt: null,
      revokedReason: null,
    });
    return Promise.resolve({ id });
  }

  public findActiveByTokenHash(
    tokenHash: string,
  ): Promise<ApplicationSessionRecord | null> {
    for (const row of this.rows.values()) {
      if (
        row.tokenHash === tokenHash &&
        row.revokedAt === null &&
        row.expiresAt.getTime() > Date.now()
      ) {
        return Promise.resolve(row);
      }
    }
    return Promise.resolve(null);
  }

  public touchLastUsed(id: string): Promise<void> {
    const row = this.rows.get(id);
    if (row !== undefined) {
      this.rows.set(id, { ...row, lastUsedAt: new Date() });
    }
    return Promise.resolve();
  }

  public revokeById(id: string, reason: string): Promise<void> {
    const row = this.rows.get(id);
    if (row !== undefined && row.revokedAt === null) {
      this.rows.set(id, {
        ...row,
        revokedAt: new Date(),
        revokedReason: reason,
      });
    }
    return Promise.resolve();
  }

  public revokeAllForSubject(
    externalSubject: string,
    reason: string,
  ): Promise<number> {
    let count = 0;
    for (const [id, row] of this.rows.entries()) {
      if (row.externalSubject === externalSubject && row.revokedAt === null) {
        this.rows.set(id, {
          ...row,
          revokedAt: new Date(),
          revokedReason: reason,
        });
        count += 1;
      }
    }
    return Promise.resolve(count);
  }

  public all(): ApplicationSessionRecord[] {
    return [...this.rows.values()];
  }
}
