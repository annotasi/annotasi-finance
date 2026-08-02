import {
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";

import { extractBearerToken } from "./bearer-token.js";
// NestJS constructor injection needs the runtime class reference (via
// emitDecoratorMetadata); `import type` would erase it at compile time.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { SessionCookiePolicy } from "./cookie.service.js";
import { UnverifiedIdentityError } from "./identity-provider.port.js";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { SessionService } from "./session.service.js";

const VERIFICATION_REQUIRED = {
  code: "VERIFICATION_REQUIRED",
  message:
    "Verifikasi identitas diperlukan sebelum sesi dapat dibuat. Silakan selesaikan proses verifikasi email Anda.",
};

/**
 * Provider-session-to-application-session exchange. Accepts only a Clerk
 * Bearer token; establishes exactly one persisted, opaque Annotasi Finance
 * application session and returns it as an HttpOnly cookie.
 */
@Controller("identity")
export class ExchangeController {
  public constructor(
    private readonly sessionService: SessionService,
    private readonly cookiePolicy: SessionCookiePolicy,
  ) {}

  @Post("exchange")
  public async exchange(
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<{ status: "verified" }> {
    const providerToken = extractBearerToken(request);
    if (providerToken === null) {
      request.log?.warn(
        { event: "identity_exchange_rejected", reason: "missing_bearer" },
        "Identity exchange rejected",
      );
      throw new UnauthorizedException(VERIFICATION_REQUIRED);
    }

    try {
      const { rawToken, expiresAt } =
        await this.sessionService.establishSession(providerToken);
      reply.setCookie(
        this.cookiePolicy.cookieName,
        rawToken,
        this.cookiePolicy.buildSetOptions(expiresAt),
      );
      request.log?.info(
        { event: "application_session_established" },
        "Application session established",
      );
      return { status: "verified" };
    } catch (error) {
      if (error instanceof UnverifiedIdentityError) {
        request.log?.warn(
          {
            event: "identity_exchange_rejected",
            reason: "provider_token_unverified",
          },
          "Identity exchange rejected",
        );
        throw new UnauthorizedException(VERIFICATION_REQUIRED);
      }
      throw error;
    }
  }
}
