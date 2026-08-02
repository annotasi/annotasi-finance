import { describe, expect, it } from "vitest";

import {
  forgotPasswordResetSchema,
  loginSchema,
  signUpSchema,
} from "../lib/validation";

describe("signUpSchema", () => {
  it("accepts a valid email and password", () => {
    const result = signUpSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email with an Indonesian message", () => {
    const result = signUpSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Format email tidak valid.");
    }
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = signUpSchema.safeParse({
      email: "user@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires a non-empty password without a minimum length", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("forgotPasswordResetSchema", () => {
  it("requires both a code and a new password", () => {
    const result = forgotPasswordResetSchema.safeParse({
      code: "",
      password: "newpassword1",
    });
    expect(result.success).toBe(false);
  });
});
