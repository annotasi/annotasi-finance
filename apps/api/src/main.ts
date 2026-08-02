import {
  parseFoundationConfig,
  parseIdentitySessionConfig,
} from "@annotasi/config";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyCsrfProtection from "@fastify/csrf-protection";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  const config = parseFoundationConfig(process.env);
  const identityConfig = parseIdentitySessionConfig(process.env);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(fastifyCookie);
  await app.register(fastifyCsrfProtection, {
    sessionPlugin: "@fastify/cookie",
    csrfOpts: { hmacKey: identityConfig.CSRF_SECRET, userInfo: false },
  });
  await app.register(fastifyCors, {
    origin: [identityConfig.WEB_ORIGIN],
    credentials: true,
  });

  await app.listen(config.PORT, "0.0.0.0");
}

bootstrap().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unknown startup error";
  process.stderr.write(`API foundation failed to start: ${message}\n`);
  process.exitCode = 1;
});
