import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();
const routerMock = { push: pushMock };
const fetchOnboardingStatusMock = vi.fn();
const fetchAccountsMock = vi.fn();
const createAccountMock = vi.fn();
const renameAccountMock = vi.fn();
const archiveAccountMock = vi.fn();
const restoreAccountMock = vi.fn();
const fetchDeleteEligibilityMock = vi.fn();

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
  fetchAccounts: fetchAccountsMock,
  createAccount: createAccountMock,
  renameAccount: renameAccountMock,
  archiveAccount: archiveAccountMock,
  restoreAccount: restoreAccountMock,
  fetchDeleteEligibility: fetchDeleteEligibilityMock,
}));

const { default: AccountsPage } = await import("../app/accounts/page");

const STARTER = {
  id: "00000000-0000-4000-8000-000000000001",
  name: "Tunai",
  type: "cash" as const,
  openingBalance: "0",
  openingBalanceEffectiveDate: "2026-08-03",
  totalBalance: "0",
  unallocatedBalance: "0",
  lifecycleStatus: "active" as const,
  isStarter: true,
  version: "1",
};

describe("Account management screen", () => {
  beforeEach(() => {
    pushMock.mockClear();
    for (const mock of [
      fetchOnboardingStatusMock,
      fetchAccountsMock,
      createAccountMock,
      renameAccountMock,
      archiveAccountMock,
      restoreAccountMock,
      fetchDeleteEligibilityMock,
    ]) {
      mock.mockReset();
    }
    fetchOnboardingStatusMock.mockResolvedValue({
      status: "workspace_ready",
      workspaceId: "00000000-0000-4000-8000-000000000002",
      accountId: STARTER.id,
      csrfToken: "csrf-token",
    });
    fetchAccountsMock.mockResolvedValue({ accounts: [STARTER] });
  });

  it("routes a non-onboarded identity safely to /onboarding", async () => {
    fetchOnboardingStatusMock.mockResolvedValue({
      status: "invitation_required",
      csrfToken: "csrf-token",
    });
    render(<AccountsPage />);
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/onboarding"));
  });

  it("routes an unauthenticated identity to /login", async () => {
    fetchOnboardingStatusMock.mockRejectedValue(
      new MockApiRequestError(401, null),
    );
    render(<AccountsPage />);
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/login"));
  });

  it("shows the starter Account in the Active section", async () => {
    render(<AccountsPage />);
    expect(await screen.findByText("Tunai")).toBeTruthy();
    expect(screen.getByText("Aktif")).toBeTruthy();
    expect(screen.getByText("Diarsipkan")).toBeTruthy();
    expect(screen.getByText("Belum ada akun yang diarsipkan.")).toBeTruthy();
  });

  it("validates the create form and does not submit an invalid request", async () => {
    const user = userEvent.setup();
    render(<AccountsPage />);
    await screen.findByText("Tunai");
    await user.clear(screen.getByLabelText("Nama akun"));
    await user.click(screen.getByRole("button", { name: "Tambah akun" }));
    expect(await screen.findByText("Nama akun wajib diisi.")).toBeTruthy();
    expect(createAccountMock).not.toHaveBeenCalled();
  });

  it("creates an Account and refreshes the list without a duplicate request", async () => {
    const user = userEvent.setup();
    createAccountMock.mockResolvedValue({
      account: { ...STARTER, id: "new-account", name: "BCA Gaji" },
    });
    render(<AccountsPage />);
    await screen.findByText("Tunai");

    await user.type(screen.getByLabelText("Nama akun"), "BCA Gaji");
    await user.selectOptions(
      screen.getByLabelText("Jenis akun"),
      "bank_account",
    );
    const button = screen.getByRole("button", { name: "Tambah akun" });
    await user.click(button);
    await user.click(button);

    await waitFor(() => expect(createAccountMock).toHaveBeenCalledTimes(1));
    expect(fetchAccountsMock).toHaveBeenCalled();
  });

  it("renames an Account while keeping the same entry", async () => {
    const user = userEvent.setup();
    renameAccountMock.mockResolvedValue({
      account: { ...STARTER, name: "Rekening Utama", version: "2" },
    });
    render(<AccountsPage />);
    await screen.findByText("Tunai");

    await user.click(screen.getByRole("button", { name: "Ubah nama" }));
    const input = screen.getByLabelText("Nama akun baru");
    await user.clear(input);
    await user.type(input, "Rekening Utama");
    await user.click(screen.getByRole("button", { name: "Simpan nama" }));

    await waitFor(() =>
      expect(renameAccountMock).toHaveBeenCalledWith(
        STARTER.id,
        { name: "Rekening Utama", expectedVersion: STARTER.version },
        "csrf-token",
      ),
    );
  });

  it("archives a zero-balance Account", async () => {
    const user = userEvent.setup();
    archiveAccountMock.mockResolvedValue({
      account: { ...STARTER, lifecycleStatus: "archived", version: "2" },
    });
    render(<AccountsPage />);
    await screen.findByText("Tunai");
    await user.click(screen.getByRole("button", { name: "Arsipkan" }));
    await waitFor(() =>
      expect(archiveAccountMock).toHaveBeenCalledWith(
        STARTER.id,
        { expectedVersion: STARTER.version },
        "csrf-token",
      ),
    );
  });

  it("shows an actionable explanation when a non-zero Account cannot archive", async () => {
    const user = userEvent.setup();
    archiveAccountMock.mockRejectedValue(
      new MockApiRequestError(409, {
        message:
          "Akun ini masih memiliki saldo yang tersisa dan tidak dapat diarsipkan.",
      }),
    );
    render(<AccountsPage />);
    await screen.findByText("Tunai");
    await user.click(screen.getByRole("button", { name: "Arsipkan" }));
    expect(
      await screen.findByText(
        "Akun ini masih memiliki saldo yang tersisa dan tidak dapat diarsipkan.",
      ),
    ).toBeTruthy();
  });

  it("restores an archived Account", async () => {
    fetchAccountsMock.mockResolvedValue({
      accounts: [{ ...STARTER, lifecycleStatus: "archived" }],
    });
    restoreAccountMock.mockResolvedValue({
      account: { ...STARTER, version: "2" },
    });
    const user = userEvent.setup();
    render(<AccountsPage />);
    await screen.findByText("Tunai");
    await user.click(screen.getByRole("button", { name: "Pulihkan" }));
    await waitFor(() =>
      expect(restoreAccountMock).toHaveBeenCalledWith(
        STARTER.id,
        { expectedVersion: STARTER.version },
        "csrf-token",
      ),
    );
  });

  it("displays delete eligibility without offering a delete action", async () => {
    const user = userEvent.setup();
    fetchDeleteEligibilityMock.mockResolvedValue({
      accountId: STARTER.id,
      eligible: true,
      reasonCodes: [],
      facts: {
        openingBalanceZero: true,
        hasFinancialEventHistory: false,
        hasOtherDependency: false,
      },
    });
    render(<AccountsPage />);
    await screen.findByText("Tunai");
    await user.click(
      screen.getByRole("button", { name: "Cek kelayakan hapus" }),
    );
    expect(
      await screen.findByText(/memenuhi syarat untuk dihapus permanen/u),
    ).toBeTruthy();
    expect(screen.queryByRole("button", { name: /^hapus$/iu })).toBeNull();
  });

  it("explains an onboarding-dependency ineligibility in Indonesian without leaking onboarding details", async () => {
    const user = userEvent.setup();
    fetchDeleteEligibilityMock.mockResolvedValue({
      accountId: STARTER.id,
      eligible: false,
      reasonCodes: ["DEPENDENCY_EXISTS"],
      facts: {
        openingBalanceZero: true,
        hasFinancialEventHistory: false,
        hasOtherDependency: true,
      },
    });
    render(<AccountsPage />);
    await screen.findByText("Tunai");
    await user.click(
      screen.getByRole("button", { name: "Cek kelayakan hapus" }),
    );
    const explanation = await screen.findByText(
      /belum memenuhi syarat untuk dihapus permanen/u,
    );
    expect(explanation).toBeTruthy();
    expect(explanation.textContent).not.toMatch(
      /token|invitation|undangan|email|idempotency/iu,
    );
    expect(screen.queryByRole("button", { name: /^hapus$/iu })).toBeNull();
  });
});
