import { z } from "zod";

export const foundationConfigSchema = z.object({
  APP_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
});

export type FoundationConfig = z.infer<typeof foundationConfigSchema>;

export function parseFoundationConfig(input: unknown): FoundationConfig {
  return foundationConfigSchema.parse(input);
}
