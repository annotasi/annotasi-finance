import type { IdentitySessionConfig } from "@annotasi/config";
import {
  ForbiddenException,
  Inject,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";

import { IDENTITY_SESSION_CONFIG } from "./config.token.js";

const REQUEST_REJECTED = {
  code: "REQUEST_REJECTED",
  message: "Permintaan ditolak. Silakan muat ulang halaman dan coba lagi.",
};

/**
 * Enforces Origin allowlisting, double-submit CSRF verification (via
 * @fastify/csrf-protection, registered against @fastify/cookie), and the
 * expected JSON content type for every state-changing, cookie-authorized
 * request. A CSRF token is never treated as an alternative authentication
 * credential — it only supplements the application-session cookie.
 */
@Injectable()
export class OriginCsrfGuard implements CanActivate {
  public constructor(
    @Inject(IDENTITY_SESSION_CONFIG)
    private readonly config: IdentitySessionConfig,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest<FastifyRequest>();
    const reply = http.getResponse<FastifyReply>();

    if (request.headers.origin !== this.config.WEB_ORIGIN) {
      request.log?.warn(
        { event: "session_mutation_rejected", reason: "invalid_origin" },
        "Session mutation rejected",
      );
      throw new ForbiddenException(REQUEST_REJECTED);
    }

    const contentType = request.headers["content-type"];
    if (
      typeof contentType !== "string" ||
      !contentType.startsWith("application/json")
    ) {
      request.log?.warn(
        {
          event: "session_mutation_rejected",
          reason: "invalid_content_type",
        },
        "Session mutation rejected",
      );
      throw new ForbiddenException(REQUEST_REJECTED);
    }

    await new Promise<void>((resolve, reject) => {
      request.server.csrfProtection(request, reply, (error?: Error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    }).catch(() => {
      request.log?.warn(
        { event: "session_mutation_rejected", reason: "csrf_failed" },
        "Session mutation rejected",
      );
      throw new ForbiddenException(REQUEST_REJECTED);
    });

    return true;
  }
}
