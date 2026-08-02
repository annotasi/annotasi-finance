import {
  onboardingRedemptionRequestSchema,
  type OnboardingRedemptionResponse,
} from "@annotasi/contracts";
import {
  hashOnboardingMaterial,
  OnboardingStoreError,
  type SessionStoreConnection,
} from "@annotasi/database/runtime";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";

import { IDENTITY_PROVIDER } from "../identity-session/identity-provider.port.js";
import type { IdentityProvider } from "../identity-session/identity-provider.port.js";
import { SESSION_STORE_CONNECTION } from "../identity-session/session-store.token.js";

const MAX_RUPIAH = 9_223_372_036_854_775_807n;
const SAFE_INVITATION_REJECTION = {
  code: "INVITATION_REJECTED",
  message: "Undangan tidak dapat digunakan untuk akun ini.",
};

function normalizeEmail(value: string): string {
  return value.normalize("NFKC").trim().toLowerCase();
}

function isRealDateOnly(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value);
  if (match === null) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

@Injectable()
export class OnboardingService {
  public constructor(
    @Inject(SESSION_STORE_CONNECTION)
    private readonly connection: SessionStoreConnection,
    @Inject(IDENTITY_PROVIDER)
    private readonly identityProvider: IdentityProvider,
  ) {}

  public status(externalSubject: string) {
    return this.connection.onboarding.status(externalSubject);
  }

  public async redeem(
    externalSubject: string,
    idempotencyKey: string | undefined,
    body: unknown,
  ): Promise<OnboardingRedemptionResponse> {
    if (
      idempotencyKey === undefined ||
      !/^[A-Za-z0-9_-]{16,128}$/u.test(idempotencyKey)
    ) {
      await this.recordRejection("invalid_idempotency_key");
      throw new BadRequestException({
        code: "INVALID_IDEMPOTENCY_KEY",
        message: "Kunci idempotensi tidak valid.",
      });
    }
    const parsed = onboardingRedemptionRequestSchema.safeParse(body);
    if (!parsed.success) {
      await this.recordRejection("invalid_request");
      throw new BadRequestException({
        code: "INVALID_ONBOARDING_REQUEST",
        message: "Data pembukaan Workspace belum valid.",
      });
    }
    const request = parsed.data;
    const openingBalance = BigInt(request.openingBalance);
    if (
      openingBalance > MAX_RUPIAH ||
      !isRealDateOnly(request.openingBalanceEffectiveDate)
    ) {
      await this.recordRejection("invalid_account_facts");
      throw new BadRequestException({
        code: "INVALID_ONBOARDING_REQUEST",
        message: "Saldo atau tanggal saldo awal belum valid.",
      });
    }

    let verifiedEmails: readonly string[];
    try {
      verifiedEmails = (
        await this.identityProvider.getVerifiedEmailAddresses(externalSubject)
      ).map(normalizeEmail);
    } catch {
      await this.recordRejection("identity_provider_unavailable");
      throw new ServiceUnavailableException({
        code: "ONBOARDING_UNAVAILABLE",
        message: "Pembukaan Workspace sementara tidak tersedia.",
      });
    }

    const invitationTokenHash = hashOnboardingMaterial(request.invitationToken);
    const requestFingerprint = hashOnboardingMaterial(
      JSON.stringify({
        invitationTokenHash,
        accountName: request.accountName,
        accountType: request.accountType,
        openingBalance: request.openingBalance,
        openingBalanceEffectiveDate: request.openingBalanceEffectiveDate,
      }),
    );

    try {
      const result = await this.connection.onboarding.redeem({
        externalSubject,
        verifiedEmails,
        invitationTokenHash,
        idempotencyKey,
        requestFingerprint,
        account: {
          name: request.accountName,
          type: request.accountType,
          openingBalance,
          openingBalanceEffectiveDate: request.openingBalanceEffectiveDate,
        },
      });
      return {
        status: "workspace_ready",
        workspaceId: result.workspaceId,
        accountId: result.accountId,
        replayed: result.replayed,
      };
    } catch (error) {
      if (!(error instanceof OnboardingStoreError)) {
        await this.recordRejection("persistence_failure");
        throw new ServiceUnavailableException({
          code: "ONBOARDING_UNAVAILABLE",
          message: "Pembukaan Workspace sementara tidak tersedia.",
        });
      }
      await this.recordRejection(error.code.toLowerCase());
      if (error.code === "IDEMPOTENCY_CONFLICT") {
        throw new ConflictException({
          code: error.code,
          message: "Kunci idempotensi sudah digunakan untuk data berbeda.",
        });
      }
      if (error.code === "ALREADY_ONBOARDED") {
        throw new ConflictException({
          code: error.code,
          message: "Workspace pribadi sudah tersedia untuk akun ini.",
        });
      }
      throw new ForbiddenException(SAFE_INVITATION_REJECTION);
    }
  }

  private async recordRejection(reason: string): Promise<void> {
    try {
      await this.connection.onboarding.recordRejection(reason);
    } catch {
      throw new ServiceUnavailableException({
        code: "AUDIT_UNAVAILABLE",
        message: "Pembukaan Workspace sementara tidak tersedia.",
      });
    }
  }
}
