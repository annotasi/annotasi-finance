import type {
  OnboardingRedemptionResponse,
  OnboardingStatusResponse,
} from "@annotasi/contracts";
import {
  Controller,
  Get,
  Headers,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
  Body,
} from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";

import { OriginCsrfGuard } from "../identity-session/origin-csrf.guard.js";
import { SessionGuard } from "../identity-session/session.guard.js";
// NestJS constructor injection needs the runtime class reference.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { OnboardingService } from "./onboarding.service.js";

function subjectFrom(request: FastifyRequest): string {
  const subject = request.applicationSession?.externalSubject;
  if (subject === undefined) {
    throw new Error("SessionGuard did not attach an application session.");
  }
  return subject;
}

@Controller("onboarding")
@UseGuards(SessionGuard)
export class OnboardingController {
  public constructor(private readonly onboarding: OnboardingService) {}

  @Get("status")
  public async status(
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<OnboardingStatusResponse> {
    const status = await this.onboarding.status(subjectFrom(request));
    const csrfToken = reply.generateCsrf();
    return status === null
      ? { status: "invitation_required", csrfToken }
      : { status: "workspace_ready", ...status, csrfToken };
  }

  @Get("workspace")
  public async workspace(@Req() request: FastifyRequest) {
    const status = await this.onboarding.status(subjectFrom(request));
    if (status === null) {
      throw new NotFoundException({
        code: "WORKSPACE_NOT_READY",
        message: "Workspace pribadi belum tersedia.",
      });
    }
    return { status: "ready" as const, ...status };
  }

  @Post("redeem")
  @UseGuards(OriginCsrfGuard)
  public redeem(
    @Req() request: FastifyRequest,
    @Headers("idempotency-key") idempotencyKey: string | undefined,
    @Body() body: unknown,
  ): Promise<OnboardingRedemptionResponse> {
    return this.onboarding.redeem(subjectFrom(request), idempotencyKey, body);
  }
}
