import {
  parseIdentitySessionConfig,
  type IdentitySessionConfig,
} from "@annotasi/config";
import {
  createSessionStoreConnection,
  SessionStore,
  type SessionStoreConnection,
} from "@annotasi/database/runtime";
import { Inject, Module, type OnModuleDestroy } from "@nestjs/common";

import { ClerkIdentityProvider } from "./clerk-identity-provider.js";
import { IDENTITY_SESSION_CONFIG } from "./config.token.js";
import { SessionCookiePolicy } from "./cookie.service.js";
import { ExchangeController } from "./exchange.controller.js";
import { IDENTITY_PROVIDER } from "./identity-provider.port.js";
import { OriginCsrfGuard } from "./origin-csrf.guard.js";
import { RecoveryController } from "./recovery.controller.js";
import {
  SESSION_STORE,
  SESSION_STORE_CONNECTION,
} from "./session-store.token.js";
import { SessionController } from "./session.controller.js";
import { SessionGuard } from "./session.guard.js";
import { SessionService } from "./session.service.js";

@Module({
  controllers: [ExchangeController, RecoveryController, SessionController],
  providers: [
    {
      provide: IDENTITY_SESSION_CONFIG,
      useFactory: (): IdentitySessionConfig =>
        parseIdentitySessionConfig(process.env),
    },
    {
      provide: SessionCookiePolicy,
      useFactory: (config: IdentitySessionConfig) =>
        new SessionCookiePolicy(config),
      inject: [IDENTITY_SESSION_CONFIG],
    },
    {
      provide: SESSION_STORE_CONNECTION,
      useFactory: (config: IdentitySessionConfig): SessionStoreConnection =>
        createSessionStoreConnection(config.DATABASE_APPLICATION_URL),
      inject: [IDENTITY_SESSION_CONFIG],
    },
    {
      provide: SESSION_STORE,
      useFactory: (connection: SessionStoreConnection) =>
        new SessionStore(connection.db),
      inject: [SESSION_STORE_CONNECTION],
    },
    {
      provide: IDENTITY_PROVIDER,
      useFactory: (config: IdentitySessionConfig) =>
        new ClerkIdentityProvider(config.CLERK_SECRET_KEY, [config.WEB_ORIGIN]),
      inject: [IDENTITY_SESSION_CONFIG],
    },
    SessionService,
    SessionGuard,
    OriginCsrfGuard,
  ],
  exports: [
    SessionCookiePolicy,
    SessionService,
    SessionGuard,
    OriginCsrfGuard,
    IDENTITY_PROVIDER,
    SESSION_STORE_CONNECTION,
    IDENTITY_SESSION_CONFIG,
  ],
})
export class IdentitySessionModule implements OnModuleDestroy {
  public constructor(
    @Inject(SESSION_STORE_CONNECTION)
    private readonly connection: SessionStoreConnection,
  ) {}

  public async onModuleDestroy(): Promise<void> {
    await this.connection.close();
  }
}
