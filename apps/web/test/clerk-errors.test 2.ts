import { describe, expect, it } from "vitest";

import { safeClerkErrorMessage } from "../lib/clerk-errors";

describe("safeClerkErrorMessage", () => {
  it("maps a known error code to a safe Indonesian message", () => {
    expect(safeClerkErrorMessage("form_password_incorrect")).toBe(
      "Email atau kata sandi salah.",
    );
  });

  it("falls back to a generic message for an unknown code", () => {
    const message = safeClerkErrorMessage("some_unmapped_future_code");
    expect(message).toBe(
      "Terjadi kesalahan. Silakan periksa kembali data Anda dan coba lagi.",
    );
  });

  it("falls back to a generic message when no code is provided", () => {
    const message = safeClerkErrorMessage(undefined);
    expect(message).toBe(
      "Terjadi kesalahan. Silakan periksa kembali data Anda dan coba lagi.",
    );
  });

  it("never returns raw provider text containing English debugging phrases", () => {
    const message = safeClerkErrorMessage("form_identifier_not_found");
    expect(message).not.toMatch(/is invalid|not found|required/iu);
  });
});
