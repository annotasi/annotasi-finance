"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  fetchSessionStatus,
  logoutAllSessions,
  logoutCurrentSession,
} from "@/lib/api-client";

type LoadState =
  | { kind: "loading" }
  | { kind: "active"; expiresAt: string; csrfToken: string }
  | { kind: "unauthenticated" };

/**
 * Minimal post-authenticated status: confirms the opaque Annotasi Finance
 * application session is active. Onboarding, Workspace, and Account setup
 * are out of scope for SLICE-IAM-001 and are not implemented here.
 */
export default function SessionStatusPage() {
  const router = useRouter();
  const { signOut } = useClerk();
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchSessionStatus()
      .then((result) => {
        if (!cancelled) {
          setState({
            kind: "active",
            expiresAt: result.expiresAt,
            csrfToken: result.csrfToken,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ kind: "unauthenticated" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout(): Promise<void> {
    if (state.kind !== "active") {
      return;
    }
    setErrorMessage(null);
    try {
      await logoutCurrentSession(state.csrfToken);
    } catch {
      setErrorMessage("Gagal keluar. Silakan coba lagi.");
      return;
    }

    // The Annotasi Finance application session is already revoked at this
    // point. Clearing Clerk's local client state is cleanup only — a
    // failure here must never restore or reactivate the already-revoked
    // application session, so it never blocks navigation.
    await signOut().catch(() => undefined);
    router.push("/login");
  }

  async function handleLogoutAll(): Promise<void> {
    if (state.kind !== "active") {
      return;
    }
    setErrorMessage(null);
    try {
      await logoutAllSessions(state.csrfToken);
    } catch {
      setErrorMessage("Gagal keluar dari semua perangkat. Silakan coba lagi.");
      return;
    }

    await signOut().catch(() => undefined);
    router.push("/login");
  }

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Status sesi</CardTitle>
          <CardDescription>
            {state.kind === "active" &&
              "Identitas Anda sudah terverifikasi. Fitur Annotasi Finance lainnya belum tersedia."}
            {state.kind === "unauthenticated" &&
              "Sesi Anda telah berakhir. Silakan masuk kembali untuk melanjutkan."}
            {state.kind === "loading" && "Memeriksa status sesi..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {errorMessage !== null && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {state.kind === "active" && (
            <div className="grid gap-2">
              <Button onClick={() => void handleLogout()}>Keluar</Button>
              <Button variant="outline" onClick={() => void handleLogoutAll()}>
                Keluar dari semua perangkat
              </Button>
            </div>
          )}

          {state.kind === "unauthenticated" && (
            <a href="/login" className={buttonVariants({ variant: "default" })}>
              Masuk
            </a>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
