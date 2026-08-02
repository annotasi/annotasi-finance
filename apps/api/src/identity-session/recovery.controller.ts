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
    "Verifikasi identitas diperlukan untuk menyelesaikan pemulihan akun.",
};

/**
 * Recovery-completion boundary. Accepts only a fresh Clerk Bearer token
 * issued after a successful password reset. Revokes every prior Annotasi
 * Finance application session for that subject before establishing a new
 * one — an old application-session cookie is never trusted after recovery.
 */
@Controller("identity/recovery")
export class RecoveryController {
  public constructor(
    private readonly sessionService: SessionService,
    private readonly cookiePolicy: SessionCookiePolicy,
  ) {}

  @Post("complete")
  public async complete(
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<{ status: "verified" }> {
    const providerToken = extractBearerToken(request);
    if (providerToken === null) {
      request.log?.warn(
        { event: "identity_recovery_rejected", reason: "missing_bearer" },
        "Identity recovery completion rejected",
      );
      throw new UnauthorizedException(VERIFICATION_REQUIRED);
    }

    try {
      const { rawToken, expiresAt } =
        await this.sessionService.establishSessionAfterRecovery(providerToken);
      reply.setCookie(
        this.cookiePolicy.cookieName,
        rawToken,
        this.cookiePolicy.buildSetOptions(expiresAt),
      );
      request.log?.info(
        { event: "application_session_recovered" },
        "Application session established after recovery",
      );
      return { status: "verified" };
    } catch (error) {
      if (error instanceof UnverifiedIdentityError) {
        request.log?.warn(
          {
            event: "identity_recovery_rejected",
            reason: "provider_token_unverified",
          },
          "Identity recovery completion rejected",
        );
        throw new UnauthorizedException(VERIFICATION_REQUIRED);
      }
      throw error;
    }
  }
}
