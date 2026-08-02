import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();
const routerMock = { push: pushMock };
const fetchOnboardingStatusMock = vi.fn();
const redeemOnboardingMock = vi.fn();

class MockApiRequestError extends Error {
  public constructor(
    public readonly status: number,
    public readonly body: { message?: string } | null,
  ) {
    super(body?.message);
  }
}

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

vi.mock("@/lib/api-client", () => ({
  ApiRequestError: MockApiRequestError,
  fetchOnboardingStatus: fetchOnboardingStatusMock,
  redeemOnboarding: redeemOnboardingMock,
}));

const { default: OnboardingPage } = await import("../app/onboarding/page");

describe("private-beta onboarding screen", () => {
  beforeEach(() => {
    pushMock.mockClear();
    fetchOnboardingStatusMock.mockReset();
    redeemOnboardingMock.mockReset();
    fetchOnboardingStatusMock.mockResolvedValue({
      status: "invitation_required",
      csrfToken: "csrf-token",
    });
  });

  it("renders an accessible loading state before status resolves", () => {
    fetchOnboardingStatusMock.mockReturnValue(new Promise(() => undefined));
    render(<OnboardingPage />);
    expect(screen.getByRole("status").textContent).toContain(
      "Memeriksa akses beta...",
    );
  });

  it("collects the exact starter Account facts and submits once", async () => {
    const user = userEvent.setup();
    redeemOnboardingMock.mockResolvedValue({
      status: "workspace_ready",
      workspaceId: "00000000-0000-4000-8000-000000000002",
      accountId: "00000000-0000-4000-8000-000000000003",
      replayed: false,
    });
    render(<OnboardingPage />);

    await user.type(
      await screen.findByLabelText("Kode undangan beta"),
      `afbeta_${"a".repeat(43)}`,
    );
    await user.type(screen.getByLabelText("Nama akun awal"), "Bank utama");
    await user.selectOptions(
      screen.getByLabelText("Jenis akun"),
      "bank_account",
    );
    const balance = screen.getByLabelText("Saldo awal (Rupiah)");
    await user.clear(balance);
    await user.type(balance, "250000");
    await user.click(
      screen.getByRole("button", { name: "Buka Workspace pribadi" }),
    );

    await waitFor(() => expect(redeemOnboardingMock).toHaveBeenCalledTimes(1));
    expect(await redeemOnboardingMock.mock.results[0]?.value).toMatchObject({
      status: "workspace_ready",
    });
    expect(redeemOnboardingMock).toHaveBeenCalledWith(
      expect.objectContaining({
        accountName: "Bank utama",
        accountType: "bank_account",
        openingBalance: "250000",
      }),
      "csrf-token",
      expect.any(String),
    );
    expect(
      await screen.findByText(
        "Workspace pribadi dan akun awal Anda sudah siap.",
      ),
    ).toBeTruthy();
  });

  it("shows inline validation errors without making a request", async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);
    await user.click(
      await screen.findByRole("button", { name: "Buka Workspace pribadi" }),
    );
    expect(await screen.findByText("Kode undangan tidak valid.")).toBeTruthy();
    expect(await screen.findByText("Nama akun wajib diisi.")).toBeTruthy();
    expect(redeemOnboardingMock).not.toHaveBeenCalled();
  });

  it("renders the minimal Workspace-ready state for an onboarded user", async () => {
    fetchOnboardingStatusMock.mockResolvedValue({
      status: "workspace_ready",
      workspaceId: "00000000-0000-4000-8000-000000000002",
      accountId: "00000000-0000-4000-8000-000000000003",
      csrfToken: "csrf-token",
    });
    render(<OnboardingPage />);
    expect(
      await screen.findByText(
        "Workspace pribadi dan akun awal Anda sudah siap.",
      ),
    ).toBeTruthy();
    expect(screen.queryByLabelText("Kode undangan beta")).toBeNull();
  });
});
