import { Module } from "@nestjs/common";

import { HealthController } from "./health.controller.js";
import { IdentitySessionModule } from "./identity-session/identity-session.module.js";
import { OnboardingModule } from "./onboarding/onboarding.module.js";

@Module({
  imports: [IdentitySessionModule, OnboardingModule],
  controllers: [HealthController],
})
export class AppModule {}
