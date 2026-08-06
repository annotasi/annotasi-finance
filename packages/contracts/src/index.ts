import { z } from "zod";

export const readinessResponseSchema = z.object({
  service: z.literal("annotasi-finance-api"),
  status: z.literal("ready"),
});

export type ReadinessResponse = z.infer<typeof readinessResponseSchema>;

export const starterAccountTypeSchema = z.enum([
  "cash",
  "bank_account",
  "e_wallet",
  "other",
]);

export const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/u);
export const accountIdSchema = z.string().uuid();
export const accountNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(/^[^\p{Cc}]+$/u);
export const moneyAmountSchema = z.string().regex(/^(0|[1-9]\d*)$/u);

const MAX_BIGINT_STRING = "9223372036854775807";

export const accountVersionSchema = z
  .string()
  .regex(/^[1-9]\d*$/u)
  .max(MAX_BIGINT_STRING.length)
  .refine(
    (value) =>
      value.length < MAX_BIGINT_STRING.length || value <= MAX_BIGINT_STRING,
    { message: "Account version exceeds the maximum supported value." },
  );
export const accountLifecycleStatusSchema = z.enum(["active", "archived"]);

export const onboardingRedemptionRequestSchema = z.object({
  invitationToken: z.string().regex(/^afbeta_[A-Za-z0-9_-]{43}$/u),
  accountName: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[^\p{Cc}]+$/u),
  accountType: starterAccountTypeSchema,
  openingBalance: z.string().regex(/^(0|[1-9]\d*)$/u),
  openingBalanceEffectiveDate: dateOnlySchema,
});

export const onboardingStatusResponseSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("invitation_required"),
    csrfToken: z.string().min(1),
  }),
  z.object({
    status: z.literal("workspace_ready"),
    workspaceId: z.string().uuid(),
    accountId: z.string().uuid(),
    csrfToken: z.string().min(1),
  }),
]);

export const onboardingRedemptionResponseSchema = z.object({
  status: z.literal("workspace_ready"),
  workspaceId: z.string().uuid(),
  accountId: z.string().uuid(),
  replayed: z.boolean(),
});

export type StarterAccountType = z.infer<typeof starterAccountTypeSchema>;
export type OnboardingRedemptionRequest = z.infer<
  typeof onboardingRedemptionRequestSchema
>;
export type OnboardingStatusResponse = z.infer<
  typeof onboardingStatusResponseSchema
>;
export type OnboardingRedemptionResponse = z.infer<
  typeof onboardingRedemptionResponseSchema
>;

export const accountSchema = z.object({
  id: z.string().uuid(),
  name: accountNameSchema,
  type: starterAccountTypeSchema,
  openingBalance: moneyAmountSchema,
  openingBalanceEffectiveDate: dateOnlySchema,
  totalBalance: moneyAmountSchema,
  unallocatedBalance: moneyAmountSchema,
  lifecycleStatus: accountLifecycleStatusSchema,
  isStarter: z.boolean(),
  version: accountVersionSchema,
});

export const createAccountRequestSchema = z
  .object({
    name: accountNameSchema,
    type: starterAccountTypeSchema,
    openingBalance: moneyAmountSchema,
    openingBalanceEffectiveDate: dateOnlySchema,
  })
  .strict();

export const renameAccountRequestSchema = z
  .object({
    name: accountNameSchema,
    expectedVersion: accountVersionSchema,
  })
  .strict();

export const accountLifecycleActionRequestSchema = z
  .object({
    expectedVersion: accountVersionSchema,
  })
  .strict();

export const listAccountsResponseSchema = z.object({
  accounts: z.array(accountSchema),
});

export const accountResponseSchema = z.object({
  account: accountSchema,
});

export const deleteEligibilityReasonCodeSchema = z.enum([
  "OPENING_BALANCE_NOT_ZERO",
  "FINANCIAL_EVENT_HISTORY_EXISTS",
  "DEPENDENCY_EXISTS",
]);

export const deleteEligibilityResponseSchema = z.object({
  accountId: z.string().uuid(),
  eligible: z.boolean(),
  reasonCodes: z.array(deleteEligibilityReasonCodeSchema),
  facts: z.object({
    openingBalanceZero: z.boolean(),
    hasFinancialEventHistory: z.boolean(),
    hasOtherDependency: z.boolean(),
  }),
});

export type Account = z.infer<typeof accountSchema>;
export type CreateAccountRequest = z.infer<typeof createAccountRequestSchema>;
export type RenameAccountRequest = z.infer<typeof renameAccountRequestSchema>;
export type AccountLifecycleActionRequest = z.infer<
  typeof accountLifecycleActionRequestSchema
>;
export type ListAccountsResponse = z.infer<typeof listAccountsResponseSchema>;
export type AccountResponse = z.infer<typeof accountResponseSchema>;
export type DeleteEligibilityReasonCode = z.infer<
  typeof deleteEligibilityReasonCodeSchema
>;
export type DeleteEligibilityResponse = z.infer<
  typeof deleteEligibilityResponseSchema
>;
