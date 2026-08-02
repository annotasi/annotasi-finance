import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();
const fetchSessionStatusMock = vi.fn(async () => ({
  status: "active" as const,
  expiresAt: new Date(Date.now() + 3600_000).toISOString(),
  csrfToken: "csrf-token",
}));
const logoutCurrentSessionMock = vi.fn(async () => ({
  status: "revoked" as const,
}));
const logoutAllSessionsMock = vi.fn(async () => ({
  status: "revoked" as const,
}));
const signOutMock = vi.fn(async () => undefined);

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@clerk/nextjs", () => ({
  useClerk: () => ({ signOut: signOutMock }),
}));

vi.mock("@/lib/api-client", () => ({
  fetchSessionStatus: fetchSessionStatusMock,
  logoutCurrentSession: logoutCurrentSessionMock,
  logoutAllSessions: logoutAllSessionsMock,
}));

const { default: SessionStatusPage } = await import("../app/session/page");

describe("session status screen interaction", () => {
  beforeEach(() => {
    pushMock.mockClear();
    fetchSessionStatusMock.mockClear();
    logoutCurrentSessionMock.mockClear();
    logoutAllSessionsMock.mockClear();
    signOutMock.mockClear();
    signOutMock.mockResolvedValue(undefined);
    fetchSessionStatusMock.mockResolvedValue({
      status: "active",
      expiresAt: new Date(Date.now() + 3600_000).toISOString(),
      csrfToken: "csrf-token",
    });
  });

  it("represents a loading status before the session check resolves", async () => {
    let resolveStatus: (value: {
      status: "active";
      expiresAt: string;
      csrfToken: string;
    }) => void = () => {};
    fetchSessionStatusMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveStatus = resolve;
        }),
    );

    render(<SessionStatusPage />);

    expect(screen.getByText("Memeriksa status sesi...")).toBeTruthy();

    resolveStatus({
      status: "active",
      expiresAt: new Date().toISOString(),
      csrfToken: "csrf-token",
    });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Keluar" })).toBeTruthy(),
    );
  });

  it("invokes current-session revocation on logout", async () => {
    const user = userEvent.setup();
    render(<SessionStatusPage />);

    const logoutButton = await screen.findByRole("button", { name: "Keluar" });
    await user.click(logoutButton);

    await waitFor(() => {
      expect(logoutCurrentSessionMock).toHaveBeenCalledWith("csrf-token");
    });
    expect(logoutAllSessionsMock).not.toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/login");
  });

  it("invokes all-session revocation on logout-all", async () => {
    const user = userEvent.setup();
    render(<SessionStatusPage />);

    const logoutAllButton = await screen.findByRole("button", {
      name: "Keluar dari semua perangkat",
    });
    await user.click(logoutAllButton);

    await waitFor(() => {
      expect(logoutAllSessionsMock).toHaveBeenCalledWith("csrf-token");
    });
    expect(logoutCurrentSessionMock).not.toHaveBeenCalled();
  });

  it("still navigates away when Clerk local sign-out fails, since the application session is already revoked", async () => {
    const user = userEvent.setup();
    signOutMock.mockRejectedValueOnce(new Error("clerk sign-out failed"));

    render(<SessionStatusPage />);
    const logoutButton = await screen.findByRole("button", { name: "Keluar" });
    await user.click(logoutButton);

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/login"));
    expect(logoutCurrentSessionMock).toHaveBeenCalledWith("csrf-token");
  });

  it("announces a logout error through an accessible alert", async () => {
    const user = userEvent.setup();
    logoutCurrentSessionMock.mockRejectedValueOnce(new Error("network down"));

    render(<SessionStatusPage />);
    const logoutButton = await screen.findByRole("button", { name: "Keluar" });
    await user.click(logoutButton);

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).not.toContain("network down");
  });

  it("exposes logout controls as native, keyboard-operable buttons", async () => {
    render(<SessionStatusPage />);

    const logoutButton = await screen.findByRole("button", { name: "Keluar" });
    const logoutAllButton = screen.getByRole("button", {
      name: "Keluar dari semua perangkat",
    });

    expect(logoutButton.tagName).toBe("BUTTON");
    expect(logoutAllButton.tagName).toBe("BUTTON");
    expect(logoutButton).toHaveProperty("disabled", false);
    expect(logoutAllButton).toHaveProperty("disabled", false);
  });
});
