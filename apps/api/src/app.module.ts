import { Module } from "@nestjs/common";

import { HealthController } from "./health.controller.js";
import { IdentitySessionModule } from "./identity-session/identity-session.module.js";

@Module({
  imports: [IdentitySessionModule],
  controllers: [HealthController],
})
export class AppModule {}
