"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ApiRequestError,
  fetchOnboardingStatus,
  redeemOnboarding,
  type OnboardingStatus,
  type RedeemOnboardingBody,
} from "@/lib/api-client";

const formSchema = z.object({
  invitationToken: z
    .string()
    .regex(/^afbeta_[A-Za-z0-9_-]{43}$/u, "Kode undangan tidak valid."),
  accountName: z
    .string()
    .trim()
    .min(1, "Nama akun wajib diisi.")
    .max(100)
    .regex(/^[^\p{Cc}]+$/u, "Nama akun mengandung karakter yang tidak valid."),
  accountType: z.enum(["cash", "bank_account", "e_wallet", "other"]),
  openingBalance: z
    .string()
    .regex(/^(0|[1-9]\d*)$/u, "Gunakan Rupiah utuh tanpa tanda atau desimal."),
  openingBalanceEffectiveDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/u, "Tanggal saldo awal wajib diisi."),
});

type FormValues = z.infer<typeof formSchema>;

function jakartaToday(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return `${value["year"]}-${value["month"]}-${value["day"]}`;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const retry = useRef<{ signature: string; key: string } | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invitationToken: "",
      accountName: "",
      accountType: "cash",
      openingBalance: "0",
      openingBalanceEffectiveDate: jakartaToday(),
    },
  });

  useEffect(() => {
    let active = true;
    void fetchOnboardingStatus()
      .then((result) => {
        if (active) setStatus(result);
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof ApiRequestError && error.status === 401) {
          router.push("/login");
          return;
        }
        setErrorMessage("Status Workspace tidak dapat dimuat. Coba lagi.");
      });
    return () => {
      active = false;
    };
  }, [router]);

  async function onSubmit(values: FormValues): Promise<void> {
    if (status?.status !== "invitation_required") return;
    setErrorMessage(null);
    const body: RedeemOnboardingBody = values;
    const signature = JSON.stringify(body);
    if (retry.current?.signature !== signature) {
      retry.current = { signature, key: crypto.randomUUID() };
    }
    try {
      const result = await redeemOnboarding(
        body,
        status.csrfToken,
        retry.current.key,
      );
      setStatus({
        status: "workspace_ready",
        workspaceId: result.workspaceId,
        accountId: result.accountId,
        csrfToken: status.csrfToken,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof ApiRequestError && error.body?.message
          ? error.body.message
          : "Workspace belum dapat dibuka. Periksa data lalu coba lagi.",
      );
    }
  }

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Siapkan Workspace pribadi</CardTitle>
          <CardDescription>
            Satu ruang privat untuk pencatatan keuangan Anda dalam IDR.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {errorMessage !== null && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {status === null && errorMessage === null && (
            <p role="status" className="text-sm text-muted-foreground">
              Memeriksa akses beta...
            </p>
          )}

          {status?.status === "workspace_ready" && (
            <div className="grid gap-4">
              <Alert>
                <AlertDescription>
                  Workspace pribadi dan akun awal Anda sudah siap.
                </AlertDescription>
              </Alert>
              <Button type="button" onClick={() => router.push("/accounts")}>
                Lanjutkan
              </Button>
            </div>
          )}

          {status?.status === "invitation_required" && (
            <form
              className="grid gap-4"
              onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
              noValidate
            >
              <div className="grid gap-1.5">
                <Label htmlFor="invitation-token">Kode undangan beta</Label>
                <Input
                  id="invitation-token"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={
                    form.formState.errors.invitationToken !== undefined
                  }
                  {...form.register("invitationToken")}
                />
                {form.formState.errors.invitationToken && (
                  <p className="text-sm text-destructive" role="alert">
                    {form.formState.errors.invitationToken.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="account-name">Nama akun awal</Label>
                <Input
                  id="account-name"
                  type="text"
                  autoComplete="off"
                  aria-invalid={form.formState.errors.accountName !== undefined}
                  {...form.register("accountName")}
                />
                {form.formState.errors.accountName && (
                  <p className="text-sm text-destructive" role="alert">
                    {form.formState.errors.accountName.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="account-type">Jenis akun</Label>
                <select
                  id="account-type"
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...form.register("accountType")}
                >
                  <option value="cash">Tunai</option>
                  <option value="bank_account">Rekening Bank</option>
                  <option value="e_wallet">Dompet Digital</option>
                  <option value="other">Lainnya</option>
                </select>
                {form.formState.errors.accountType && (
                  <p className="text-sm text-destructive" role="alert">
                    {form.formState.errors.accountType.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="opening-balance">Saldo awal (Rupiah)</Label>
                <Input
                  id="opening-balance"
                  type="text"
                  inputMode="numeric"
                  aria-invalid={
                    form.formState.errors.openingBalance !== undefined
                  }
                  {...form.register("openingBalance")}
                />
                {form.formState.errors.openingBalance && (
                  <p className="text-sm text-destructive" role="alert">
                    {form.formState.errors.openingBalance.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="opening-date">Tanggal saldo awal</Label>
                <Input
                  id="opening-date"
                  type="date"
                  aria-invalid={
                    form.formState.errors.openingBalanceEffectiveDate !==
                    undefined
                  }
                  {...form.register("openingBalanceEffectiveDate")}
                />
                {form.formState.errors.openingBalanceEffectiveDate && (
                  <p className="text-sm text-destructive" role="alert">
                    {form.formState.errors.openingBalanceEffectiveDate.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Membuka Workspace..."
                  : "Buka Workspace pribadi"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
