"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  archiveAccount,
  createAccount,
  fetchAccounts,
  fetchDeleteEligibility,
  fetchOnboardingStatus,
  renameAccount,
  restoreAccount,
  type AccountView,
  type DeleteEligibility,
} from "@/lib/api-client";
import { formatDateOnly, formatIDR } from "@/lib/format";

const ACCOUNT_TYPE_LABELS: Record<AccountView["type"], string> = {
  cash: "Tunai",
  bank_account: "Rekening Bank",
  e_wallet: "Dompet Digital",
  other: "Lainnya",
};

const createFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama akun wajib diisi.")
    .max(100)
    .regex(/^[^\p{Cc}]+$/u, "Nama akun mengandung karakter yang tidak valid."),
  type: z.enum(["cash", "bank_account", "e_wallet", "other"]),
  openingBalance: z
    .string()
    .regex(/^(0|[1-9]\d*)$/u, "Gunakan Rupiah utuh tanpa tanda atau desimal."),
  openingBalanceEffectiveDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/u, "Tanggal saldo awal wajib diisi."),
});

type CreateFormValues = z.infer<typeof createFormSchema>;

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

function safeMessage(error: unknown, fallback: string): string {
  return error instanceof ApiRequestError && error.body?.message !== undefined
    ? error.body.message
    : fallback;
}

interface AccountRowProps {
  account: AccountView;
  csrfToken: string;
  onChanged: () => Promise<void>;
}

function AccountRow({ account, csrfToken, onChanged }: AccountRowProps) {
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(account.name);
  const [pending, setPending] = useState(false);
  const [rowError, setRowError] = useState<string | null>(null);
  const [eligibility, setEligibility] = useState<DeleteEligibility | null>(
    null,
  );

  async function submitRename(): Promise<void> {
    if (pending) return;
    setPending(true);
    setRowError(null);
    try {
      await renameAccount(
        account.id,
        { name: nameDraft, expectedVersion: account.version },
        csrfToken,
      );
      setRenaming(false);
      await onChanged();
    } catch (error) {
      setRowError(safeMessage(error, "Nama akun belum dapat diubah."));
      await onChanged();
    } finally {
      setPending(false);
    }
  }

  async function handleArchive(): Promise<void> {
    if (pending) return;
    setPending(true);
    setRowError(null);
    try {
      await archiveAccount(
        account.id,
        { expectedVersion: account.version },
        csrfToken,
      );
      await onChanged();
    } catch (error) {
      setRowError(safeMessage(error, "Akun belum dapat diarsipkan."));
      await onChanged();
    } finally {
      setPending(false);
    }
  }

  async function handleRestore(): Promise<void> {
    if (pending) return;
    setPending(true);
    setRowError(null);
    try {
      await restoreAccount(
        account.id,
        { expectedVersion: account.version },
        csrfToken,
      );
      await onChanged();
    } catch (error) {
      setRowError(safeMessage(error, "Akun belum dapat dipulihkan."));
      await onChanged();
    } finally {
      setPending(false);
    }
  }

  async function handleCheckEligibility(): Promise<void> {
    try {
      setEligibility(await fetchDeleteEligibility(account.id));
    } catch {
      setRowError("Kelayakan penghapusan belum dapat dievaluasi.");
    }
  }

  return (
    <Card size="sm" data-testid={`account-row-${account.id}`}>
      <CardContent className="grid gap-2">
        {rowError !== null && (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{rowError}</AlertDescription>
          </Alert>
        )}
        {renaming ? (
          <div className="grid gap-1.5">
            <Label htmlFor={`rename-${account.id}`}>Nama akun baru</Label>
            <Input
              id={`rename-${account.id}`}
              value={nameDraft}
              onChange={(event) => setNameDraft(event.target.value)}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                disabled={pending}
                onClick={() => void submitRename()}
              >
                Simpan nama
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => {
                  setNameDraft(account.name);
                  setRenaming(false);
                }}
              >
                Batal
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium">{account.name}</p>
              <p className="text-sm text-muted-foreground">
                {ACCOUNT_TYPE_LABELS[account.type]} &middot;{" "}
                {account.lifecycleStatus === "active" ? "Aktif" : "Diarsipkan"}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRenaming(true)}
            >
              Ubah nama
            </Button>
          </div>
        )}

        <dl className="grid grid-cols-2 gap-x-2 text-sm">
          <dt className="text-muted-foreground">Total saldo akun</dt>
          <dd>{formatIDR(account.totalBalance)}</dd>
          <dt className="text-muted-foreground">Jumlah belum dialokasikan</dt>
          <dd>{formatIDR(account.unallocatedBalance)}</dd>
          <dt className="text-muted-foreground">Saldo awal</dt>
          <dd>{formatIDR(account.openingBalance)}</dd>
          <dt className="text-muted-foreground">Tanggal saldo awal</dt>
          <dd>{formatDateOnly(account.openingBalanceEffectiveDate)}</dd>
        </dl>

        <div className="flex flex-wrap gap-2">
          {account.lifecycleStatus === "active" ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() => void handleArchive()}
            >
              Arsipkan
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() => void handleRestore()}
            >
              Pulihkan
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void handleCheckEligibility()}
          >
            Cek kelayakan hapus
          </Button>
        </div>

        {eligibility !== null && (
          <p role="status" className="text-sm text-muted-foreground">
            {eligibility.eligible
              ? "Akun ini memenuhi syarat untuk dihapus permanen (evaluasi saja, belum ada tindakan hapus)."
              : "Akun ini belum memenuhi syarat untuk dihapus permanen karena masih memiliki saldo awal atau riwayat/ketergantungan."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<AccountView[] | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(
    null,
  );

  const form = useForm<CreateFormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: "",
      type: "cash",
      openingBalance: "0",
      openingBalanceEffectiveDate: jakartaToday(),
    },
  });

  async function reload(): Promise<void> {
    const result = await fetchAccounts();
    setAccounts(result.accounts);
  }

  useEffect(() => {
    let active = true;
    void fetchOnboardingStatus()
      .then(async (status) => {
        if (!active) return;
        if (status.status === "invitation_required") {
          router.push("/onboarding");
          return;
        }
        setCsrfToken(status.csrfToken);
        await reload();
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof ApiRequestError && error.status === 401) {
          router.push("/login");
          return;
        }
        setErrorMessage("Daftar akun tidak dapat dimuat. Coba lagi.");
      });
    return () => {
      active = false;
    };
  }, [router]);

  async function onCreateSubmit(values: CreateFormValues): Promise<void> {
    if (csrfToken === null) return;
    setCreateErrorMessage(null);
    try {
      await createAccount(values, csrfToken);
      form.reset({
        name: "",
        type: "cash",
        openingBalance: "0",
        openingBalanceEffectiveDate: jakartaToday(),
      });
      await reload();
    } catch (error) {
      setCreateErrorMessage(
        safeMessage(
          error,
          "Akun baru belum dapat dibuat. Periksa data lalu coba lagi.",
        ),
      );
    }
  }

  const activeAccounts =
    accounts?.filter((a) => a.lifecycleStatus === "active") ?? [];
  const archivedAccounts =
    accounts?.filter((a) => a.lifecycleStatus === "archived") ?? [];

  return (
    <main className="mx-auto grid w-full max-w-2xl gap-4 p-4">
      <h1 className="text-lg font-semibold">Akun</h1>

      {errorMessage !== null && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tambah akun</CardTitle>
          <CardDescription>
            Catat tempat uang Anda berada secara nyata atau operasional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {createErrorMessage !== null && (
            <Alert variant="destructive" role="alert" className="mb-4">
              <AlertDescription>{createErrorMessage}</AlertDescription>
            </Alert>
          )}
          <form
            className="grid gap-4"
            onSubmit={(event) => void form.handleSubmit(onCreateSubmit)(event)}
            noValidate
          >
            <div className="grid gap-1.5">
              <Label htmlFor="new-account-name">Nama akun</Label>
              <Input
                id="new-account-name"
                type="text"
                autoComplete="off"
                aria-invalid={form.formState.errors.name !== undefined}
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive" role="alert">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="new-account-type">Jenis akun</Label>
              <select
                id="new-account-type"
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...form.register("type")}
              >
                <option value="cash">Tunai</option>
                <option value="bank_account">Rekening Bank</option>
                <option value="e_wallet">Dompet Digital</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="new-account-balance">Saldo awal (Rupiah)</Label>
              <Input
                id="new-account-balance"
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
              <Label htmlFor="new-account-date">Tanggal saldo awal</Label>
              <Input
                id="new-account-date"
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
              {form.formState.isSubmitting ? "Menyimpan..." : "Tambah akun"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {accounts === null && errorMessage === null && (
        <p role="status" className="text-sm text-muted-foreground">
          Memuat daftar akun...
        </p>
      )}

      {accounts !== null && csrfToken !== null && (
        <>
          <section className="grid gap-2">
            <h2 className="text-sm font-semibold text-muted-foreground">
              Aktif
            </h2>
            {activeAccounts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Belum ada akun aktif.
              </p>
            )}
            {activeAccounts.map((account) => (
              <AccountRow
                key={account.id}
                account={account}
                csrfToken={csrfToken}
                onChanged={reload}
              />
            ))}
          </section>

          <section className="grid gap-2">
            <h2 className="text-sm font-semibold text-muted-foreground">
              Diarsipkan
            </h2>
            {archivedAccounts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Belum ada akun yang diarsipkan.
              </p>
            )}
            {archivedAccounts.map((account) => (
              <AccountRow
                key={account.id}
                account={account}
                csrfToken={csrfToken}
                onChanged={reload}
              />
            ))}
          </section>
        </>
      )}
    </main>
  );
}
