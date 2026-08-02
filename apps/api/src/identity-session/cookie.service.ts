import type { IdentitySessionConfig } from "@annotasi/config";
import type { CookieSerializeOptions } from "@fastify/cookie";

/**
 * Builds and clears the Annotasi Finance opaque application-session cookie.
 *
 * In production the cookie uses the `__Host-` prefix (requires Secure,
 * Path=/, and no Domain attribute — all satisfied here). In local
 * development, where HTTPS is not always available, the cookie falls back
 * to a plain name and an explicit, documented non-Secure exception.
 */
export class SessionCookiePolicy {
  public constructor(private readonly config: IdentitySessionConfig) {}

  public get cookieName(): string {
    return this.isProduction
      ? `__Host-${this.config.SESSION_COOKIE_NAME}`
      : this.config.SESSION_COOKIE_NAME;
  }

  private get isProduction(): boolean {
    return this.config.APP_ENV === "production";
  }

  private get secure(): boolean {
    if (this.isProduction) {
      return true;
    }
    return this.config.SECURE_COOKIES ?? false;
  }

  public buildSetOptions(expiresAt: Date): CookieSerializeOptions {
    return {
      httpOnly: true,
      secure: this.secure,
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    };
  }

  public buildClearOptions(): CookieSerializeOptions {
    return {
      httpOnly: true,
      secure: this.secure,
      sameSite: "lax",
      path: "/",
    };
  }
}
