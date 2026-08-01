import { parseFoundationConfig } from "@annotasi/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  const config = parseFoundationConfig(process.env);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.listen(config.PORT, "0.0.0.0");
}

bootstrap().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unknown startup error";
  process.stderr.write(`API foundation failed to start: ${message}\n`);
  process.exitCode = 1;
});
