import { Module } from "@nestjs/common";

import { IdentitySessionModule } from "../identity-session/identity-session.module.js";
import { AccountController } from "./account.controller.js";
import { AccountService } from "./account.service.js";

@Module({
  imports: [IdentitySessionModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
