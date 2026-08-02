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

const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/u);

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
