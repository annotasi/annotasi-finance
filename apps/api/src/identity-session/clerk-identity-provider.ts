import { createClerkClient, verifyToken } from "@clerk/backend";

import {
  UnverifiedIdentityError,
  type IdentityProvider,
  type RevokeAllProviderSessionsOptions,
  type VerifiedIdentity,
} from "./identity-provider.port.js";
import { revokeAllActiveProviderSessions } from "./revoke-all-provider-sessions.js";

/**
 * Real Clerk-backed IdentityProvider adapter. Used only for provider-token
 * verification and best-effort provider-side session revocation — never as
 * the ordinary application authorization mechanism.
 */
export class ClerkIdentityProvider implements IdentityProvider {
  private readonly clerkClient: ReturnType<typeof createClerkClient>;

  public constructor(
    private readonly secretKey: string,
    private readonly authorizedParties: readonly string[],
  ) {
    this.clerkClient = createClerkClient({ secretKey });
  }

  public async getVerifiedEmailAddresses(
    externalSubject: string,
  ): Promise<readonly string[]> {
    const user = await this.clerkClient.users.getUser(externalSubject);
    return user.emailAddresses
      .filter((email) => email.verification?.status === "verified")
      .map((email) => email.emailAddress);
  }

  public async verifyProviderToken(
    providerToken: string,
  ): Promise<VerifiedIdentity> {
    try {
      const payload = await verifyToken(providerToken, {
        secretKey: this.secretKey,
        authorizedParties: [...this.authorizedParties],
      });

      return {
        externalSubject: payload.sub,
        providerSessionId: payload.sid,
      };
    } catch {
      throw new UnverifiedIdentityError();
    }
  }

  public async revokeProviderSession(providerSessionId: string): Promise<void> {
    try {
      await this.clerkClient.sessions.revokeSession(providerSessionId);
    } catch {
      // Best-effort: provider-side revocation failure must never block or
      // reverse Annotasi Finance's own application-session revocation.
    }
  }

  public async revokeAllProviderSessions(
    externalSubject: string,
    options?: RevokeAllProviderSessionsOptions,
  ): Promise<void> {
    try {
      await revokeAllActiveProviderSessions(
        this.clerkClient.sessions,
        externalSubject,
        options,
      );
    } catch {
      // Best-effort, see above.
    }
  }
}
