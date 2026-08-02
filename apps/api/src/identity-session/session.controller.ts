import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";

// NestJS constructor injection needs the runtime class reference (via
// emitDecoratorMetadata); `import type` would erase it at compile time.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { SessionCookiePolicy } from "./cookie.service.js";
import { OriginCsrfGuard } from "./origin-csrf.guard.js";
import { SessionGuard } from "./session.guard.js";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { SessionService } from "./session.service.js";

/**
 * Ordinary protected session routes: status (also the testable protected
 * probe and CSRF-token issuance point), current-session logout, and
 * all-session logout. Every route requires the opaque application-session
 * cookie; the two logout routes additionally require Origin/CSRF/content-
 * type checks because they are state-changing.
 */
@Controller("identity/session")
@UseGuards(SessionGuard)
export class SessionController {
  public constructor(
    private readonly sessionService: SessionService,
    private readonly cookiePolicy: SessionCookiePolicy,
  ) {}

  @Get()
  public status(
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): { status: "active"; expiresAt: string; csrfToken: string } {
    const session = request.applicationSession;
    if (session === undefined) {
      throw new Error("SessionGuard did not attach an application session.");
    }

    return {
      status: "active",
      expiresAt: session.expiresAt.toISOString(),
      csrfToken: reply.generateCsrf(),
    };
  }

  @Post("logout")
  @UseGuards(OriginCsrfGuard)
  public async logout(
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<{ status: "revoked" }> {
    const session = request.applicationSession;
    if (session === undefined) {
      throw new Error("SessionGuard did not attach an application session.");
    }

    await this.sessionService.revokeCurrent(
      session.id,
      session.providerSessionId,
      "user_logout",
    );
    reply.clearCookie(
      this.cookiePolicy.cookieName,
      this.cookiePolicy.buildClearOptions(),
    );
    request.log?.info(
      { event: "application_session_revoked", reason: "user_logout" },
      "Application session revoked",
    );
    return { status: "revoked" };
  }

  @Post("logout-all")
  @UseGuards(OriginCsrfGuard)
  public async logoutAll(
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<{ status: "revoked" }> {
    const session = request.applicationSession;
    if (session === undefined) {
      throw new Error("SessionGuard did not attach an application session.");
    }

    await this.sessionService.revokeAllForSubject(
      session.externalSubject,
      "user_logout_all",
    );
    reply.clearCookie(
      this.cookiePolicy.cookieName,
      this.cookiePolicy.buildClearOptions(),
    );
    request.log?.info(
      { event: "application_sessions_revoked", reason: "user_logout_all" },
      "Application sessions revoked",
    );
    return { status: "revoked" };
  }
}
