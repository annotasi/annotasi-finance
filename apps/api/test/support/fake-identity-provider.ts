import {
  UnverifiedIdentityError,
  type IdentityProvider,
  type RevokeAllProviderSessionsOptions,
  type VerifiedIdentity,
} from "../../src/identity-session/identity-provider.port.js";

/**
 * Deterministic test double for IdentityProvider. Tokens formatted as
 * `valid:<subject>:<providerSessionId>` verify successfully; every other
 * token is rejected. Never calls a live provider.
 */
export class FakeIdentityProvider implements IdentityProvider {
  public readonly revokedSessions: string[] = [];
  public readonly revokedSubjects: string[] = [];
  public readonly revokeAllRequests: {
    externalSubject: string;
    options: RevokeAllProviderSessionsOptions | undefined;
  }[] = [];
  private readonly activeSessionsBySubject = new Map<string, string[]>();
  /** When true, revocation calls reject — used to prove best-effort handling. */
  public failRevocation = false;

  public setActiveProviderSessions(
    externalSubject: string,
    providerSessionIds: readonly string[],
  ): void {
    this.activeSessionsBySubject.set(externalSubject, [...providerSessionIds]);
  }

  public verifyProviderToken(providerToken: string): Promise<VerifiedIdentity> {
    const parts = providerToken.split(":");
    if (parts.length !== 3 || parts[0] !== "valid") {
      return Promise.reject(new UnverifiedIdentityError());
    }

    const [, externalSubject, providerSessionId] = parts;
    return Promise.resolve({
      externalSubject: externalSubject ?? "",
      providerSessionId:
        providerSessionId === "" ? null : (providerSessionId ?? null),
    });
  }

  public revokeProviderSession(providerSessionId: string): Promise<void> {
    this.revokedSessions.push(providerSessionId);
    if (this.failRevocation) {
      return Promise.reject(new Error("simulated provider revocation failure"));
    }
    return Promise.resolve();
  }

  public revokeAllProviderSessions(
    externalSubject: string,
    options?: RevokeAllProviderSessionsOptions,
  ): Promise<void> {
    this.revokedSubjects.push(externalSubject);
    this.revokeAllRequests.push({ externalSubject, options });
    if (this.failRevocation) {
      return Promise.reject(new Error("simulated provider revocation failure"));
    }

    const uniqueIds = new Set(
      this.activeSessionsBySubject.get(externalSubject) ?? [],
    );
    for (const providerSessionId of uniqueIds) {
      if (providerSessionId !== options?.excludeProviderSessionId) {
        this.revokedSessions.push(providerSessionId);
      }
    }
    return Promise.resolve();
  }
}

export function validProviderToken(
  subject: string,
  providerSessionId = "",
): string {
  return `valid:${subject}:${providerSessionId}`;
}
