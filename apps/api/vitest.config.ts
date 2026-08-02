import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      APP_ENV: "test",
      CLERK_PUBLISHABLE_KEY: "pk_test_isolated_test_placeholder",
      CLERK_SECRET_KEY: "sk_test_isolated_test_placeholder",
      WEB_ORIGIN: "http://localhost:3000",
      API_ORIGIN: "http://localhost:3001",
      DATABASE_APPLICATION_URL: "postgresql://test:test@127.0.0.1:5432/test",
      CSRF_SECRET: "test_only_csrf_secret_at_least_32_chars",
    },
  },
});
