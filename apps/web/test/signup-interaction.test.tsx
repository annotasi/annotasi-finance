import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

type MockClerkError =
  { code: string } | { errors: Array<{ code: string; message?: string }> };

const pushMock = vi.fn();
const getTokenMock = vi.fn(async () => "provider-token");
const passwordMock = vi.fn(async () => ({
  error: null as MockClerkError | null,
}));
const sendEmailCodeMock = vi.fn(async () => ({
  error: null as MockClerkError | null,
}));
const verifyEmailCodeMock = vi.fn(async () => ({
  error: null as MockClerkError | null,
}));
const finalizeMock = vi.fn(async () => ({
  error: null as MockClerkError | null,
}));
const exchangeProviderTokenMock = vi.fn(async () => ({
  status: "verified" as const,
}));

let signUpStatus: string = "missing_requirements";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@clerk/nextjs", () => ({
  useSignUp: () => ({
    signUp: {
      get status() {
        return signUpStatus;
      },
      password: passwordMock,
      verifications: {
        sendEmailCode: sendEmailCodeMock,
        verifyEmailCode: verifyEmailCodeMock,
      },
      finalize: finalizeMock,
    },
  }),
  useAuth: () => ({ getToken: getTokenMock }),
}));

vi.mock("@/lib/api-client", () => ({
  exchangeProviderToken: exchangeProviderTokenMock,
}));

const { default: SignUpPage } = await import("../app/signup/page");

describe("signup screen interaction", () => {
  beforeEach(() => {
    signUpStatus = "missing_requirements";
    // mockReset (not mockClear) so a mockImplementation/mockRejectedValueOnce
    // left over by one test can never leak into the next test's mock calls.
    pushMock.mockReset();
    getTokenMock.mockReset();
    passwordMock.mockReset();
    sendEmailCodeMock.mockReset();
    verifyEmailCodeMock.mockReset();
    finalizeMock.mockReset();
    exchangeProviderTokenMock.mockReset();
    getTokenMock.mockResolvedValue("provider-token");
    passwordMock.mockResolvedValue({ error: null });
    sendEmailCodeMock.mockResolvedValue({ error: null });
    verifyEmailCodeMock.mockResolvedValue({ error: null });
    finalizeMock.mockResolvedValue({ error: null });
    exchangeProviderTokenMock.mockResolvedValue({ status: "verified" });
  });

  it("mounts the Clerk CAPTCHA placeholder before signup starts", () => {
    render(<SignUpPage />);

    expect(document.getElementById("clerk-captcha")).not.toBeNull();
  });

  it("lets the user enter email and password and invokes the Clerk Future API on submit", async () => {
    const user = userEvent.setup();
    render(<SignUpPage />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Kata sandi"), "password123");
    await user.click(screen.getByRole("button", { name: "Daftar" }));

    await waitFor(() => {
      expect(passwordMock).toHaveBeenCalledWith({
        emailAddress: "user@example.com",
        password: "password123",
      });
    });
    expect(sendEmailCodeMock).toHaveBeenCalledTimes(1);
  });

  it("moves to the verification-code state after a successful signup", async () => {
    const user = userEvent.setup();
    render(<SignUpPage />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Kata sandi"), "password123");
    await user.click(screen.getByRole("button", { name: "Daftar" }));

    expect(await screen.findByLabelText("Kode verifikasi")).toBeTruthy();
  });

  it("shows a disabled/loading state while the verification submit is pending", async () => {
    const user = userEvent.setup();
    let resolveVerify: (value: { error: null }) => void = () => {};
    verifyEmailCodeMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveVerify = resolve;
        }),
    );
    signUpStatus = "complete";

    render(<SignUpPage />);
    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Kata sandi"), "password123");
    await user.click(screen.getByRole("button", { name: "Daftar" }));
    await screen.findByLabelText("Kode verifikasi");

    await user.type(screen.getByLabelText("Kode verifikasi"), "123456");
    await user.click(screen.getByRole("button", { name: "Verifikasi" }));

    const pendingButton = await screen.findByRole("button", {
      name: "Verifikasi",
    });
    expect(pendingButton).toHaveProperty("disabled", true);

    resolveVerify({ error: null });
  });

  it("recovers safely when signUp.password throws", async () => {
    const user = userEvent.setup();
    passwordMock.mockRejectedValueOnce(new Error("network down"));

    render(<SignUpPage />);
    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Kata sandi"), "password123");
    await user.click(screen.getByRole("button", { name: "Daftar" }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).not.toContain("network down");
    expect(screen.queryByLabelText("Kode verifikasi")).toBeNull();
    expect(screen.getByRole("button", { name: "Daftar" })).toHaveProperty(
      "disabled",
      false,
    );
  });

  it("recovers safely when sendEmailCode throws", async () => {
    const user = userEvent.setup();
    sendEmailCodeMock.mockRejectedValueOnce(new Error("delivery failed"));

    render(<SignUpPage />);
    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Kata sandi"), "password123");
    await user.click(screen.getByRole("button", { name: "Daftar" }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).not.toContain("delivery failed");
    expect(screen.queryByLabelText("Kode verifikasi")).toBeNull();
  });

  it("recovers safely when verifyEmailCode throws", async () => {
    const user = userEvent.setup();
    verifyEmailCodeMock.mockRejectedValueOnce(new Error("network down"));

    render(<SignUpPage />);
    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Kata sandi"), "password123");
    await user.click(screen.getByRole("button", { name: "Daftar" }));
    await screen.findByLabelText("Kode verifikasi");

    await user.type(screen.getByLabelText("Kode verifikasi"), "123456");
    await user.click(screen.getByRole("button", { name: "Verifikasi" }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).not.toContain("network down");
    // Still on the verification stage, retryable, not stuck "finishing".
    expect(screen.getByRole("button", { name: "Verifikasi" })).toHaveProperty(
      "disabled",
      false,
    );
  });

  it("recovers safely when finalize or getToken throws after verification succeeds", async () => {
    const user = userEvent.setup();
    signUpStatus = "complete";
    finalizeMock.mockRejectedValueOnce(new Error("finalize failed"));

    render(<SignUpPage />);
    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Kata sandi"), "password123");
    await user.click(screen.getByRole("button", { name: "Daftar" }));
    await screen.findByLabelText("Kode verifikasi");

    await user.type(screen.getByLabelText("Kode verifikasi"), "123456");
    await user.click(screen.getByRole("button", { name: "Verifikasi" }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).not.toContain("finalize failed");
    expect(pushMock).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Verifikasi" })).toHaveProperty(
      "disabled",
      false,
    );
  });

  it("announces a safe Frontend API errors-array response through an accessible alert", async () => {
    const user = userEvent.setup();
    passwordMock.mockResolvedValueOnce({
      error: {
        errors: [
          {
            code: "form_password_pwned",
            message: "Password has been found in an online data breach.",
          },
        ],
      },
    });

    render(<SignUpPage />);
    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Kata sandi"), "password123");
    await user.click(screen.getByRole("button", { name: "Daftar" }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain(
      "Kata sandi ini pernah ditemukan dalam kebocoran data",
    );
    // Never leaks the raw Clerk error code or provider text to the user.
    expect(alert.textContent).not.toContain("form_password_pwned");
    expect(alert.textContent).not.toContain("online data breach");
    expect(sendEmailCodeMock).not.toHaveBeenCalled();
  });
});
