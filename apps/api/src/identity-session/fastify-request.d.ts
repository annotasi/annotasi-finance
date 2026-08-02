import type { ApplicationSessionRecord } from "@annotasi/database/runtime";

declare module "fastify" {
  interface FastifyRequest {
    applicationSession?: ApplicationSessionRecord;
  }
}
