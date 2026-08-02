import { Module } from "@nestjs/common";

import { IdentitySessionModule } from "../identity-session/identity-session.module.js";
import { OnboardingController } from "./onboarding.controller.js";
import { OnboardingService } from "./onboarding.service.js";

@Module({
  imports: [IdentitySessionModule],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}
