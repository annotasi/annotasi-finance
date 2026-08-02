export interface VerifiedIdentity {
  readonly externalSubject: string;
  readonly providerSessionId: string | null;
}

export class UnverifiedIdentityError extends Error {
  public constructor(message = "The provider token could not be verified.") {
    super(message);
    this.name = "UnverifiedIdentityError";
  }
}

export interface RevokeAllProviderSessionsOptions {
  readonly excludeProviderSessionId?: string;
}

/**
 * Boundary between Annotasi Finance and the managed identity provider.
 *
 * Production wiring uses ClerkIdentityProvider. Automated tests use a
 * deterministic fake so CI never calls a live provider.
 */
export interface IdentityProvider {
  /** Returns only provider-confirmed verified email addresses for a subject. */
  getVerifiedEmailAddresses(
    externalSubject: string,
  ): Promise<readonly string[]>;

  /**
   * Verifies a short-lived provider token and returns the verified
   * external identity. Throws UnverifiedIdentityError for any invalid,
   * expired, or unverifiable token — never returns a partial result.
   */
  verifyProviderToken(providerToken: string): Promise<VerifiedIdentity>;

  /**
   * Best-effort revocation of one provider-side session. Failures must not
   * prevent Annotasi Finance's own application-session revocation from
   * proceeding or from being reported as successful.
   */
  revokeProviderSession(providerSessionId: string): Promise<void>;

  /**
   * Best-effort revocation of provider-side sessions for one external
   * subject. Logout-all omits options and revokes every session; password
   * recovery excludes the freshly authenticated provider session.
   */
  revokeAllProviderSessions(
    externalSubject: string,
    options?: RevokeAllProviderSessionsOptions,
  ): Promise<void>;
}

export const IDENTITY_PROVIDER = Symbol("IDENTITY_PROVIDER");
