import type { IdentitySessionConfig } from "@annotasi/config";
import type {
  ApplicationSessionRecord,
  SessionStore,
} from "@annotasi/database/runtime";
import { Inject, Injectable } from "@nestjs/common";

import { IDENTITY_SESSION_CONFIG } from "./config.token.js";
import {
  IDENTITY_PROVIDER,
  type IdentityProvider,
} from "./identity-provider.port.js";
import { SESSION_STORE } from "./session-store.token.js";
import { generateSessionToken, hashSessionToken } from "./token.js";

const LAST_USED_THROTTLE_MS = 5 * 60 * 1000;

export interface EstablishedSession {
  readonly rawToken: string;
  readonly expiresAt: Date;
}

@Injectable()
export class SessionService {
  public constructor(
    @Inject(SESSION_STORE) private readonly sessionStore: SessionStore,
    @Inject(IDENTITY_PROVIDER)
    private readonly identityProvider: IdentityProvider,
    @Inject(IDENTITY_SESSION_CONFIG)
    private readonly config: IdentitySessionConfig,
  ) {}

  /**
   * Verifies a provider token and establishes exactly one new, persisted
   * Annotasi Finance application session for the verified external
   * subject.
   */
  public async establishSession(
    providerToken: string,
  ): Promise<EstablishedSession> {
    const verified =
      await this.identityProvider.verifyProviderToken(providerToken);
    return this.persistNewSession(
      verified.externalSubject,
      verified.providerSessionId,
    );
  }

  /**
   * Recovery-completion path: verifies the fresh provider token, revokes
   * every prior application session for that subject (an old cookie must
   * never be trusted after a password reset), and only then establishes a
   * brand-new application session. Old provider sessions are revoked
   * best-effort while the fresh provider session is explicitly excluded.
   * When the verified token has no provider-session id, unsafe provider bulk
   * revocation is skipped. In either case a fresh application session is
   * established, so an unrelated Clerk-side error cannot lock the user out
   * of their own just-completed recovery.
   */
  public async establishSessionAfterRecovery(
    providerToken: string,
  ): Promise<EstablishedSession> {
    const verified =
      await this.identityProvider.verifyProviderToken(providerToken);
    await this.sessionStore.revokeAllForSubject(
      verified.externalSubject,
      "password_recovery",
    );
    if (verified.providerSessionId !== null) {
      await this.identityProvider
        .revokeAllProviderSessions(verified.externalSubject, {
          excludeProviderSessionId: verified.providerSessionId,
        })
        .catch(() => undefined);
    }
    return this.persistNewSession(
      verified.externalSubject,
      verified.providerSessionId,
    );
  }

  private async persistNewSession(
    externalSubject: string,
    providerSessionId: string | null,
  ): Promise<EstablishedSession> {
    const rawToken = generateSessionToken();
    const tokenHash = hashSessionToken(rawToken);
    const expiresAt = new Date(
      Date.now() + this.config.SESSION_TTL_SECONDS * 1000,
    );

    await this.sessionStore.create({
      tokenHash,
      externalSubject,
      providerSessionId,
      expiresAt,
    });

    return { rawToken, expiresAt };
  }

  /**
   * Resolves a persisted, active application session from a raw cookie
   * token. Always queries PostgreSQL — never trusts in-process state — so
   * the result is correct across API process restarts and instances.
   */
  public async validateSession(
    rawToken: string,
  ): Promise<ApplicationSessionRecord | null> {
    const tokenHash = hashSessionToken(rawToken);
    const session = await this.sessionStore.findActiveByTokenHash(tokenHash);

    if (session === null) {
      return null;
    }

    if (Date.now() - session.lastUsedAt.getTime() > LAST_USED_THROTTLE_MS) {
      await this.sessionStore.touchLastUsed(session.id);
    }

    return session;
  }

  /**
   * Revokes exactly one application session, then attempts (best-effort) to
   * revoke the associated Clerk provider session so the browser cannot
   * obtain another provider token for an immediate re-exchange. The
   * application-session revocation always happens first and is never rolled
   * back if the provider call fails.
   */
  public async revokeCurrent(
    sessionId: string,
    providerSessionId: string | null,
    reason: string,
  ): Promise<void> {
    await this.sessionStore.revokeById(sessionId, reason);

    if (providerSessionId !== null) {
      await this.identityProvider
        .revokeProviderSession(providerSessionId)
        .catch(() => undefined);
    }
  }

  /**
   * Revokes every active application session for one external subject.
   * Provider-side revocation is attempted best-effort and never restores
   * an already-revoked application session on partial failure.
   */
  public async revokeAllForSubject(
    externalSubject: string,
    reason: string,
  ): Promise<number> {
    const revokedCount = await this.sessionStore.revokeAllForSubject(
      externalSubject,
      reason,
    );
    await this.identityProvider
      .revokeAllProviderSessions(externalSubject)
      .catch(() => undefined);
    return revokedCount;
  }
}
