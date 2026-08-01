import {
  readinessResponseSchema,
  type ReadinessResponse,
} from "@annotasi/contracts";
import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  readiness(): ReadinessResponse {
    return readinessResponseSchema.parse({
      service: "annotasi-finance-api",
      status: "ready",
    });
  }
}
