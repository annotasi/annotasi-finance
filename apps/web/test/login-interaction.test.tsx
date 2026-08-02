import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();
const getTokenMock = vi.fn(async () => "provider-token");
const passwordMock = vi.fn(async (): Promise<{ error: unknown }> => ({
  error: null,
}));
const finalizeMock = vi.fn(async () => ({
  error: null as { code: string } | null,
}));
const exchangeProviderTokenMock = vi.fn(async () => ({
  status: "verified" as const,
}));

let signInStatus: string = "complete";
let signInErrors: {
  fields: {
    password?: unknown;
    identifier?: unknown;
  };
} = { fields: {} };

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@clerk/nextjs", () => ({
  useSignIn: () => ({
    errors: signInErrors,
    signIn: {
      get status() {
        return signInStatus;
      },
      password: passwordMock,
      finalize: finalizeMock,
    },
  }),
  useAuth: () => ({ getToken: getTokenMock }),
}));

vi.mock("@/lib/api-client", () => ({
  exchangeProviderToken: exchangeProviderTokenMock,
}));

const { default: LoginPage } = await import("../app/login/page");

describe("login screen interaction", () => {
  beforeEach(() => {
    signInStatus = "complete";
    signInErrors = { fields: {} };
    // mockReset (not mockClear) so a mockImplementation/mockRejectedValueOnce
    // left over by one test can never leak into the next test's mock calls.
    pushMock.mockReset();
    getTokenMock.mockReset();
    passwordMock.mockReset();
    finalizeMock.mockReset();
    exchangeProviderTokenMock.mockReset();
    getTokenMock.mockResolvedValue("provider-token");
    passwordMock.mockResolvedValue({ error: null });
    finalizeMock.mockResolvedValue({ error: null });
    exchangeProviderTokenMock.mockResolvedValue({ status: "verified" });
  });

  async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Kata sandi"), "password123");
    await user.click(screen.getByRole("button", { name: "Masuk" }));
  }

  it("submits entered credentials", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await fillAndSubmit(user);

    await waitFor(() => {
      expect(passwordMock).toHaveBeenCalledWith({
        emailAddress: "user@example.com",
        password: "password123",
      });
    });
  });

  it("blocks duplicate submits while a submission is pending", async () => {
    const user = userEvent.setup();
    let resolvePassword: (value: { error: null }) => void = () => {};
    passwordMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePassword = resolve;
        }),
    );

    render(<LoginPage />);
    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Kata sandi"), "password123");

    const submitButton = screen.getByRole("button", { name: "Masuk" });
    await user.click(submitButton);
    await user.click(submitButton);
    await user.click(submitButton);

    resolvePassword({ error: null });
    await waitFor(() => expect(exchangeProviderTokenMock).toHaveBeenCalled());

    expect(passwordMock).toHaveBeenCalledTimes(1);
  });

  it("invokes the application-session exchange after successful finalization", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await fillAndSubmit(user);

    await waitFor(() => {
      expect(exchangeProviderTokenMock).toHaveBeenCalledWith("provider-token");
    });
    expect(pushMock).toHaveBeenCalledWith("/session");
  });

  it("produces a safe accessible message on failure", async () => {
    const user = userEvent.setup();
    passwordMock.mockResolvedValueOnce({
      error: { code: "form_password_incorrect" },
    });

    render(<LoginPage />);
    await fillAndSubmit(user);

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Email atau kata sandi tidak cocok.");
    expect(screen.getByLabelText("Email").getAttribute("aria-invalid")).toBe(
      "true",
    );
    expect(
      screen.getByLabelText("Kata sandi").getAttribute("aria-invalid"),
    ).toBe("true");
    expect(alert.textContent).not.toContain("form_password_incorrect");
  });

  it("handles Clerk's root errors-array credential response shape", async () => {
    const user = userEvent.setup();
    passwordMock.mockResolvedValueOnce({
      error: [
        {
          code: "form_password_incorrect",
          message: "Password is incorrect",
        },
      ],
    });

    render(<LoginPage />);
    await fillAndSubmit(user);

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Email atau kata sandi tidak cocok.");
    expect(alert.textContent).not.toContain("Password is incorrect");
  });

  it("does not render a stale Clerk hook error before the user submits", () => {
    signInErrors = {
      fields: {
        password: {
          code: "form_password_incorrect",
          message: "Password is incorrect",
        },
      },
    };

    render(<LoginPage />);

    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByLabelText("Email").getAttribute("aria-invalid")).toBe(
      "false",
    );
    expect(
      screen.getByLabelText("Kata sandi").getAttribute("aria-invalid"),
    ).toBe("false");
  });

  it("maps Clerk's enumeration-protected credential error", async () => {
    const user = userEvent.setup();
    passwordMock.mockResolvedValueOnce({
      error: { code: "form_password_or_identifier_incorrect" },
    });

    render(<LoginPage />);
    await fillAndSubmit(user);

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Email atau kata sandi tidak cocok.");
    expect(screen.getByLabelText("Email").getAttribute("aria-invalid")).toBe(
      "true",
    );
    expect(
      screen.getByLabelText("Kata sandi").getAttribute("aria-invalid"),
    ).toBe("true");
  });

  it("recovers safely when signIn.password throws", async () => {
    const user = userEvent.setup();
    passwordMock.mockRejectedValueOnce(new Error("network down"));

    render(<LoginPage />);
    await fillAndSubmit(user);

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).not.toContain("network down");
    expect(pushMock).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Masuk" })).toHaveProperty(
      "disabled",
      false,
    );
  });

  it("recovers safely when signIn.finalize throws", async () => {
    const user = userEvent.setup();
    finalizeMock.mockRejectedValueOnce(new Error("finalize failed"));

    render(<LoginPage />);
    await fillAndSubmit(user);

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).not.toContain("finalize failed");
    expect(pushMock).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Masuk" })).toHaveProperty(
      "disabled",
      false,
    );
  });

  it("recovers safely when getToken throws after a successful finalize", async () => {
    const user = userEvent.setup();
    getTokenMock.mockRejectedValueOnce(new Error("token fetch failed"));

    render(<LoginPage />);
    await fillAndSubmit(user);

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).not.toContain("token fetch failed");
    expect(pushMock).not.toHaveBeenCalled();
    expect(exchangeProviderTokenMock).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Masuk" })).toHaveProperty(
      "disabled",
      false,
    );
  });

  it("recovers safely when the application-session exchange throws", async () => {
    const user = userEvent.setup();
    exchangeProviderTokenMock.mockRejectedValueOnce(new Error("exchange down"));

    render(<LoginPage />);
    await fillAndSubmit(user);

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).not.toContain("exchange down");
    expect(pushMock).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Masuk" })).toHaveProperty(
      "disabled",
      false,
    );
  });
});
