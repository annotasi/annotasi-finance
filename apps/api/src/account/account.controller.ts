import type {
  AccountResponse,
  DeleteEligibilityResponse,
  ListAccountsResponse,
} from "@annotasi/contracts";
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { FastifyRequest } from "fastify";

import { OriginCsrfGuard } from "../identity-session/origin-csrf.guard.js";
import { SessionGuard } from "../identity-session/session.guard.js";
// NestJS constructor injection needs the runtime class reference.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AccountService } from "./account.service.js";

function subjectFrom(request: FastifyRequest): string {
  const subject = request.applicationSession?.externalSubject;
  if (subject === undefined) {
    throw new Error("SessionGuard did not attach an application session.");
  }
  return subject;
}

@Controller("accounts")
@UseGuards(SessionGuard)
export class AccountController {
  public constructor(private readonly accounts: AccountService) {}

  @Get()
  public list(@Req() request: FastifyRequest): Promise<ListAccountsResponse> {
    return this.accounts.list(subjectFrom(request));
  }

  @Post()
  @UseGuards(OriginCsrfGuard)
  public create(
    @Req() request: FastifyRequest,
    @Body() body: unknown,
  ): Promise<AccountResponse> {
    return this.accounts.create(subjectFrom(request), body);
  }

  @Patch(":id")
  @UseGuards(OriginCsrfGuard)
  public rename(
    @Req() request: FastifyRequest,
    @Param("id") id: string,
    @Body() body: unknown,
  ): Promise<AccountResponse> {
    return this.accounts.rename(subjectFrom(request), id, body);
  }

  @Post(":id/archive")
  @UseGuards(OriginCsrfGuard)
  public archive(
    @Req() request: FastifyRequest,
    @Param("id") id: string,
    @Body() body: unknown,
  ): Promise<AccountResponse> {
    return this.accounts.archive(subjectFrom(request), id, body);
  }

  @Post(":id/restore")
  @UseGuards(OriginCsrfGuard)
  public restore(
    @Req() request: FastifyRequest,
    @Param("id") id: string,
    @Body() body: unknown,
  ): Promise<AccountResponse> {
    return this.accounts.restore(subjectFrom(request), id, body);
  }

  @Get(":id/delete-eligibility")
  public deleteEligibility(
    @Req() request: FastifyRequest,
    @Param("id") id: string,
  ): Promise<DeleteEligibilityResponse> {
    return this.accounts.evaluateDeleteEligibility(subjectFrom(request), id);
  }
}
