import { z } from "zod";

export const foundationConfigSchema = z.object({
  APP_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
});

export type FoundationConfig = z.infer<typeof foundationConfigSchema>;

export function parseFoundationConfig(input: unknown): FoundationConfig {
  return foundationConfigSchema.parse(input);
}

const SESSION_TTL_SECONDS_DEFAULT = 60 * 60 * 24 * 30;

export const identitySessionConfigSchema = z
  .object({
    APP_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    CLERK_PUBLISHABLE_KEY: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    WEB_ORIGIN: z.string().url(),
    API_ORIGIN: z.string().url(),
    DATABASE_APPLICATION_URL: z.string().min(1),
    SESSION_COOKIE_NAME: z.string().min(1).default("af_session"),
    SESSION_TTL_SECONDS: z.coerce
      .number()
      .int()
      .positive()
      .default(SESSION_TTL_SECONDS_DEFAULT),
    CSRF_SECRET: z.string().min(32),
    SECURE_COOKIES: z
      .enum(["true", "false"])
      .optional()
      .transform((value) =>
        value === undefined ? undefined : value === "true",
      ),
  })
  .refine(
    (config) =>
      config.APP_ENV !== "production" || config.SECURE_COOKIES !== false,
    {
      message:
        "SECURE_COOKIES must not be false when APP_ENV is production; the application-session cookie must stay Secure in production.",
      path: ["SECURE_COOKIES"],
    },
  );

export type IdentitySessionConfig = z.infer<typeof identitySessionConfigSchema>;

export function parseIdentitySessionConfig(
  input: unknown,
): IdentitySessionConfig {
  return identitySessionConfigSchema.parse(input);
}
