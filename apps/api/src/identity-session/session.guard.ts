import {
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import type { FastifyRequest } from "fastify";

// NestJS constructor injection needs the runtime class reference (via
// emitDecoratorMetadata); `import type` would erase it at compile time.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { SessionCookiePolicy } from "./cookie.service.js";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { SessionService } from "./session.service.js";

const SESSION_REJECTED = {
  code: "SESSION_REJECTED",
  message: "Sesi telah berakhir. Silakan masuk kembali untuk melanjutkan.",
};

/**
 * Ordinary protected-route guard. Accepts only the opaque Annotasi Finance
 * application-session cookie — a Clerk Bearer token alone is never
 * sufficient, and every request performs a fresh server-side database
 * lookup rather than trusting in-process session state.
 */
@Injectable()
export class SessionGuard implements CanActivate {
  public constructor(
    private readonly sessionService: SessionService,
    private readonly cookiePolicy: SessionCookiePolicy,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const rawToken = request.cookies[this.cookiePolicy.cookieName];

    if (typeof rawToken !== "string" || rawToken.length === 0) {
      request.log?.warn(
        { event: "application_session_rejected", reason: "missing_cookie" },
        "Application session rejected",
      );
      throw new UnauthorizedException(SESSION_REJECTED);
    }

    const session = await this.sessionService.validateSession(rawToken);
    if (session === null) {
      request.log?.warn(
        {
          event: "application_session_rejected",
          reason: "inactive_or_unknown",
        },
        "Application session rejected",
      );
      throw new UnauthorizedException(SESSION_REJECTED);
    }

    request.applicationSession = session;
    return true;
  }
}
