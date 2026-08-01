import { z } from "zod";

export const readinessResponseSchema = z.object({
  service: z.literal("annotasi-finance-api"),
  status: z.literal("ready"),
});

export type ReadinessResponse = z.infer<typeof readinessResponseSchema>;
