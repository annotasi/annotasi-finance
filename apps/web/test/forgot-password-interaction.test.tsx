import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();
const getTokenMock = vi.fn(async () => "provider-token");
const createMock = vi.fn(async () => ({
  error: null as { code: string } | null,
}));
const sendCodeMock = vi.fn(async () => ({
  error: null as { code: string } | null,
}));
const verifyCodeMock = vi.fn(async () => ({
  error: null as { code: string } | null,
}));
const submitPasswordMock = vi.fn(async () => ({
  error: null as { code: string } | null,
}));
const finalizeMock = vi.fn(async () => ({
  error: null as { code: string } | null,
}));
const completeRecoveryMock = vi.fn(async () => ({
  status: "verified" as const,
}));

let signInStatus: string = "complete";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@clerk/nextjs", () => ({
  useSignIn: () => ({
    signIn: {
      get status() {
        return signInStatus;
      },
      create: createMock,
      resetPasswordEmailCode: {
        sendCode: sendCodeMock,
        verifyCode: verifyCodeMock,
        submitPassword: submitPasswordMock,
      },
      finalize: finalizeMock,
    },
  }),
  useAuth: () => ({ getToken: getTokenMock }),
}));

vi.mock("@/lib/api-client", () => ({
  completeRecovery: completeRecoveryMock,
}));

const { default: ForgotPasswordPage } =
  await import("../app/forgot-password/page");

describe("forgot-password screen interaction", () => {
  beforeEach(() => {
    signInStatus = "complete";
    // mockReset (not mockClear) so a mockImplementation/mockRejectedValueOnce
    // left over by one test can never leak into the next test's mock calls.
    pushMock.mockReset();
    getTokenMock.mockReset();
    createMock.mockReset();
    sendCodeMock.mockReset();
    verifyCodeMock.mockReset();
    submitPasswordMock.mockReset();
    finalizeMock.mockReset();
    completeRecoveryMock.mockReset();
    getTokenMock.mockResolvedValue("provider-token");
    createMock.mockResolvedValue({ error: null });
    sendCodeMock.mockResolvedValue({ error: null });
    verifyCodeMock.mockResolvedValue({ error: null });
    submitPasswordMock.mockResolvedValue({ error: null });
    finalizeMock.mockResolvedValue({ error: null });
    completeRecoveryMock.mockResolvedValue({ status: "verified" });
  });

  it("moves to the reset stage on a valid request", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordPage />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.click(
      screen.getByRole("button", { name: "Kirim kode pemulihan" }),
    );

    expect(await screen.findByLabelText("Kode pemulihan")).toBeTruthy();
  });

  it("moves to the same generic reset stage for an unknown account (non-enumerating)", async () => {
    const user = userEvent.setup();
    createMock.mockResolvedValueOnce({
      error: { code: "form_identifier_not_found" },
    });

    render(<ForgotPasswordPage />);
    await user.type(screen.getByLabelText("Email"), "nobody@example.com");
    await user.click(
      screen.getByRole("button", { name: "Kirim kode pemulihan" }),
    );

    expect(await screen.findByLabelText("Kode pemulihan")).toBeTruthy();
    expect(sendCodeMock).not.toHaveBeenCalled();
  });

  it("stays retryable on a provider-returned operational error", async () => {
    const user = userEvent.setup();
    createMock.mockResolvedValueOnce({
      error: { code: "too_many_requests" },
    });

    render(<ForgotPasswordPage />);
    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.click(
      screen.getByRole("button", { name: "Kirim kode pemulihan" }),
    );

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toBeTruthy();
    expect(screen.queryByLabelText("Kode pemulihan")).toBeNull();
    expect(
      screen.getByRole("button", { name: "Kirim kode pemulihan" }),
    ).toHaveProperty("disabled", false);
  });

  it("stays retryable and reports a safe message on a thrown exception", async () => {
    const user = userEvent.setup();
    createMock.mockRejectedValueOnce(new Error("network down"));

    render(<ForgotPasswordPage />);
    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.click(
      screen.getByRole("button", { name: "Kirim kode pemulihan" }),
    );

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).not.toContain("network down");
    expect(screen.queryByLabelText("Kode pemulihan")).toBeNull();

    // Retry succeeds once the transient failure is gone.
    await user.click(
      screen.getByRole("button", { name: "Kirim kode pemulihan" }),
    );
    expect(await screen.findByLabelText("Kode pemulihan")).toBeTruthy();
  });

  it("does not allow a duplicate reset submission while pending", async () => {
    const user = userEvent.setup();
    let resolveVerify: (value: { error: null }) => void = () => {};
    verifyCodeMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveVerify = resolve;
        }),
    );

    render(<ForgotPasswordPage />);
    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.click(
      screen.getByRole("button", { name: "Kirim kode pemulihan" }),
    );
    await screen.findByLabelText("Kode pemulihan");

    await user.type(screen.getByLabelText("Kode pemulihan"), "123456");
    await user.type(screen.getByLabelText("Kata sandi baru"), "newpassword1");

    const submitButton = screen.getByRole("button", {
      name: "Atur ulang kata sandi",
    });
    await user.click(submitButton);
    await user.click(submitButton);

    resolveVerify({ error: null });
    await waitFor(() => expect(completeRecoveryMock).toHaveBeenCalled());

    expect(verifyCodeMock).toHaveBeenCalledTimes(1);
  });

  it("calls the Annotasi Finance recovery-completion endpoint once reset succeeds", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordPage />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.click(
      screen.getByRole("button", { name: "Kirim kode pemulihan" }),
    );
    await screen.findByLabelText("Kode pemulihan");

    await user.type(screen.getByLabelText("Kode pemulihan"), "123456");
    await user.type(screen.getByLabelText("Kata sandi baru"), "newpassword1");
    await user.click(
      screen.getByRole("button", { name: "Atur ulang kata sandi" }),
    );

    await waitFor(() => {
      expect(completeRecoveryMock).toHaveBeenCalledWith("provider-token");
    });
    expect(pushMock).toHaveBeenCalledWith("/session");
  });

  async function fillAndSubmitReset(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.click(
      screen.getByRole("button", { name: "Kirim kode pemulihan" }),
    );
    await screen.findByLabelText("Kode pemulihan");

    await user.type(screen.getByLabelText("Kode pemulihan"), "123456");
    await user.type(screen.getByLabelText("Kata sandi baru"), "newpassword1");
    await user.click(
      screen.getByRole("button", { name: "Atur ulang kata sandi" }),
    );
  }

  it("recovers safely when resetPasswordEmailCode.verifyCode throws", async () => {
    const user = userEvent.setup();
    verifyCodeMock.mockRejectedValueOnce(new Error("network down"));

    render(<ForgotPasswordPage />);
    await fillAndSubmitReset(user);

    const alert = await screen.findByText(
      "Tidak dapat membuat sesi baru. Silakan masuk kembali secara manual.",
    );
    expect(alert.textContent).not.toContain("network down");
    expect(pushMock).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Atur ulang kata sandi" }),
    ).toHaveProperty("disabled", false);
  });

  it("recovers safely when resetPasswordEmailCode.submitPassword throws", async () => {
    const user = userEvent.setup();
    submitPasswordMock.mockRejectedValueOnce(new Error("submit failed"));

    render(<ForgotPasswordPage />);
    await fillAndSubmitReset(user);

    const alert = await screen.findByText(
      "Tidak dapat membuat sesi baru. Silakan masuk kembali secara manual.",
    );
    expect(alert.textContent).not.toContain("submit failed");
    expect(pushMock).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Atur ulang kata sandi" }),
    ).toHaveProperty("disabled", false);
  });

  it("recovers safely when signIn.finalize throws after reset succeeds", async () => {
    const user = userEvent.setup();
    finalizeMock.mockRejectedValueOnce(new Error("finalize failed"));

    render(<ForgotPasswordPage />);
    await fillAndSubmitReset(user);

    const alert = await screen.findByText(
      "Tidak dapat membuat sesi baru. Silakan masuk kembali secara manual.",
    );
    expect(alert.textContent).not.toContain("finalize failed");
    expect(pushMock).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Atur ulang kata sandi" }),
    ).toHaveProperty("disabled", false);
  });

  it("recovers safely when getToken throws after a successful finalize", async () => {
    const user = userEvent.setup();
    getTokenMock.mockRejectedValueOnce(new Error("token fetch failed"));

    render(<ForgotPasswordPage />);
    await fillAndSubmitReset(user);

    const alert = await screen.findByText(
      "Tidak dapat membuat sesi baru. Silakan masuk kembali secara manual.",
    );
    expect(alert.textContent).not.toContain("token fetch failed");
    expect(pushMock).not.toHaveBeenCalled();
    expect(completeRecoveryMock).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Atur ulang kata sandi" }),
    ).toHaveProperty("disabled", false);
  });

  it("recovers safely when the recovery-completion call throws", async () => {
    const user = userEvent.setup();
    completeRecoveryMock.mockRejectedValueOnce(new Error("recovery down"));

    render(<ForgotPasswordPage />);
    await fillAndSubmitReset(user);

    const alert = await screen.findByText(
      "Tidak dapat membuat sesi baru. Silakan masuk kembali secara manual.",
    );
    expect(alert.textContent).not.toContain("recovery down");
    expect(pushMock).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Atur ulang kata sandi" }),
    ).toHaveProperty("disabled", false);
  });
});
