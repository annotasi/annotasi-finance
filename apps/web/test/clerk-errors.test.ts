import { describe, expect, it } from "vitest";

import {
  clerkErrorCode,
  isCredentialMismatchError,
  safeClerkErrorMessage,
} from "../lib/clerk-errors";

describe("clerkErrorCode", () => {
  it("reads a direct Clerk error code", () => {
    expect(clerkErrorCode({ code: "form_password_incorrect" })).toBe(
      "form_password_incorrect",
    );
  });

  it("reads the Frontend API errors-array response shape", () => {
    expect(
      clerkErrorCode({
        errors: [
          {
            code: "form_password_pwned",
            message: "provider text must not be rendered",
          },
        ],
      }),
    ).toBe("form_password_pwned");
  });

  it("reads a root error array returned by Clerk Future APIs", () => {
    expect(
      clerkErrorCode([
        {
          code: "form_password_incorrect",
          message: "provider text must not be rendered",
        },
      ]),
    ).toBe("form_password_incorrect");
  });

  it("reads Clerk hook field errors", () => {
    expect(
      clerkErrorCode({
        fields: {
          password: { code: "form_password_incorrect" },
        },
      }),
    ).toBe("form_password_incorrect");
  });

  it("reads nested response data without exposing provider text", () => {
    expect(
      clerkErrorCode({
        response: {
          data: {
            errors: [
              {
                code: "form_identifier_not_found",
                longMessage: "provider text must not be rendered",
              },
            ],
          },
        },
      }),
    ).toBe("form_identifier_not_found");
  });

  it("reads a nested error response shape", () => {
    expect(
      clerkErrorCode({
        error: { errors: [{ code: "verification_expired" }] },
      }),
    ).toBe("verification_expired");
  });
});

describe("safeClerkErrorMessage", () => {
  it("maps a known error code to a safe Indonesian message", () => {
    expect(safeClerkErrorMessage("form_password_incorrect")).toBe(
      "Email atau kata sandi tidak cocok. Periksa kembali keduanya, atau gunakan opsi lupa kata sandi.",
    );
  });

  it("maps enumeration-protected credential failures to the safe login message", () => {
    expect(
      safeClerkErrorMessage({
        code: "form_password_or_identifier_incorrect",
      }),
    ).toBe(
      "Email atau kata sandi tidak cocok. Periksa kembali keduanya, atau gunakan opsi lupa kata sandi.",
    );
  });

  it("maps a pwned-password Frontend API response without exposing provider text", () => {
    const message = safeClerkErrorMessage({
      errors: [
        {
          code: "form_password_pwned",
          long_message: "Password has been found in an online data breach.",
        },
      ],
    });

    expect(message).toBe(
      "Kata sandi ini pernah ditemukan dalam kebocoran data. Gunakan kata sandi lain yang unik.",
    );
    expect(message).not.toMatch(/online data breach|long_message/iu);
  });

  it("falls back to a generic message for an unknown code", () => {
    const message = safeClerkErrorMessage("some_unmapped_future_code");
    expect(message).toBe(
      "Terjadi kendala saat memproses permintaan Anda. Silakan coba kembali.",
    );
  });

  it("falls back to a generic message when no code is provided", () => {
    const message = safeClerkErrorMessage(undefined);
    expect(message).toBe(
      "Terjadi kendala saat memproses permintaan Anda. Silakan coba kembali.",
    );
  });

  it("never returns raw provider text containing English debugging phrases", () => {
    const message = safeClerkErrorMessage({
      errors: [
        {
          code: "form_identifier_not_found",
          message: "identifier was not found",
        },
      ],
    });
    expect(message).not.toMatch(/is invalid|not found|required/iu);
  });
});

describe("isCredentialMismatchError", () => {
  it("recognizes credential-mismatch codes across Clerk shapes", () => {
    expect(isCredentialMismatchError({ code: "form_password_incorrect" })).toBe(
      true,
    );
    expect(
      isCredentialMismatchError({
        errors: [{ code: "form_identifier_not_found" }],
      }),
    ).toBe(true);
    expect(
      isCredentialMismatchError({
        code: "form_password_or_identifier_incorrect",
      }),
    ).toBe(true);
    expect(
      isCredentialMismatchError({ code: "form_password_validation_failed" }),
    ).toBe(true);
    expect(isCredentialMismatchError({ code: "form_password_pwned" })).toBe(
      false,
    );
  });
});
