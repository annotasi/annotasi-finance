import { fc, test as fcTest } from "@fast-check/vitest";
import { onboardingRedemptionRequestSchema } from "@annotasi/contracts";
import {
  OnboardingStoreError,
  type RedeemOnboardingInput,
  type SessionStoreConnection,
} from "@annotasi/database/runtime";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import { beforeEach, describe, expect, it } from "vitest";

import { OnboardingService } from "../src/onboarding/onboarding.service.js";
import { FakeIdentityProvider } from "./support/fake-identity-provider.js";

const TOKEN = `afbeta_${"a".repeat(43)}`;
const KEY = "idempotency_key_1";

class FakeOnboardingStore {
  public nextError: Error | null = null;
  public readonly rejections: string[] = [];
  public lastInput: RedeemOnboardingInput | null = null;

  public status() {
    return Promise.resolve(null);
  }

  public redeem(input: RedeemOnboardingInput) {
    this.lastInput = input;
    if (this.nextError !== null) return Promise.reject(this.nextError);
    return Promise.resolve({
      userId: "00000000-0000-4000-8000-000000000001",
      workspaceId: "00000000-0000-4000-8000-000000000002",
      accountId: "00000000-0000-4000-8000-000000000003",
      replayed: false,
    });
  }

  public recordRejection(reason: string) {
    this.rejections.push(reason);
    return Promise.resolve();
  }
}

function validBody(openingBalance = "0") {
  return {
    invitationToken: TOKEN,
    accountName: "Rekening utama",
    accountType: "bank_account" as const,
    openingBalance,
    openingBalanceEffectiveDate: "2026-08-02",
  };
}

describe("OnboardingService", () => {
  let store: FakeOnboardingStore;
  let provider: FakeIdentityProvider;
  let service: OnboardingService;

  beforeEach(() => {
    store = new FakeOnboardingStore();
    provider = new FakeIdentityProvider();
    provider.setVerifiedEmails("subject", [" Invited@Example.Test "]);
    service = new OnboardingService(
      { onboarding: store } as unknown as SessionStoreConnection,
      provider,
    );
  });

  it("uses provider-verified normalized email metadata and exact bigint facts", async () => {
    const result = await service.redeem("subject", KEY, validBody("100000"));
    expect(result.status).toBe("workspace_ready");
    expect(store.lastInput).toMatchObject({
      externalSubject: "subject",
      verifiedEmails: ["invited@example.test"],
      idempotencyKey: KEY,
      account: {
        type: "bank_account",
        openingBalance: 100_000n,
        openingBalanceEffectiveDate: "2026-08-02",
      },
    });
  });

  it("rejects malformed requests and records a safe audit category", async () => {
    await expect(
      service.redeem("subject", KEY, { nope: true }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(store.rejections).toEqual(["invalid_request"]);
  });

  it("rejects impossible date-only values before persistence", async () => {
    await expect(
      service.redeem("subject", KEY, {
        ...validBody(),
        openingBalanceEffectiveDate: "2026-02-30",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(store.lastInput).toBeNull();
  });

  it("maps invitation failures to one non-enumerating response", async () => {
    store.nextError = new OnboardingStoreError("INVITATION_EMAIL_MISMATCH");
    await expect(
      service.redeem("subject", KEY, validBody()),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(store.rejections).toEqual(["invitation_email_mismatch"]);
  });

  it("rejects changed-payload idempotency conflicts", async () => {
    store.nextError = new OnboardingStoreError("IDEMPOTENCY_CONFLICT");
    await expect(
      service.redeem("subject", KEY, validBody()),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});

describe("onboarding contract properties", () => {
  fcTest.prop([fc.bigInt({ min: 0n, max: 9_223_372_036_854_775_807n })])(
    "accepts every representable non-negative whole-Rupiah amount",
    (amount) => {
      expect(
        onboardingRedemptionRequestSchema.safeParse(
          validBody(amount.toString()),
        ).success,
      ).toBe(true);
    },
  );

  fcTest.prop([fc.integer({ min: 1, max: 1_000_000 })])(
    "rejects negative and fractional money representations",
    (amount) => {
      expect(
        onboardingRedemptionRequestSchema.safeParse(validBody(`-${amount}`))
          .success,
      ).toBe(false);
      expect(
        onboardingRedemptionRequestSchema.safeParse(validBody(`${amount}.5`))
          .success,
      ).toBe(false);
    },
  );
});
