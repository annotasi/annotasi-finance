"use client";

import { useAuth, useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
import { exchangeProviderToken } from "@/lib/api-client";
import { safeClerkErrorMessage } from "@/lib/clerk-errors";
import { loginSchema, type LoginValues } from "@/lib/validation";

export default function LoginPage() {
  const { signIn } = useSignIn();
  const { getToken } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues): Promise<void> {
    setErrorMessage(null);

    try {
      const { error } = await signIn.password({
        emailAddress: values.email,
        password: values.password,
      });
      if (error) {
        setErrorMessage(safeClerkErrorMessage(error.code));
        return;
      }

      if (signIn.status !== "complete") {
        setErrorMessage(
          "Masuk belum lengkap. Silakan hubungi dukungan jika ini terus terjadi.",
        );
        return;
      }

      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) {
        setErrorMessage(safeClerkErrorMessage(finalizeError.code));
        return;
      }

      const providerToken = await getToken();
      if (providerToken === null) {
        setErrorMessage(
          "Tidak dapat membuat sesi. Silakan muat ulang halaman dan coba lagi.",
        );
        return;
      }

      await exchangeProviderToken(providerToken);
      router.push("/session");
    } catch {
      // Covers a thrown password/finalize/getToken/exchange failure. No
      // navigation occurs; the form remains retryable.
      setErrorMessage(
        "Tidak dapat membuat sesi. Silakan muat ulang halaman dan coba lagi.",
      );
    }
  }

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Masuk ke Annotasi Finance</CardTitle>
          <CardDescription>Masukkan email dan kata sandi Anda.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {errorMessage !== null && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form
            className="grid gap-4"
            onSubmit={(event) => {
              void form.handleSubmit(onSubmit)(event);
            }}
            noValidate
          >
            <div className="grid gap-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                aria-invalid={form.formState.errors.email !== undefined}
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive" role="alert">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Kata sandi</Label>
                <a
                  className="text-sm underline underline-offset-4"
                  href="/forgot-password"
                >
                  Lupa kata sandi?
                </a>
              </div>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                aria-invalid={form.formState.errors.password !== undefined}
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive" role="alert">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <a className="underline underline-offset-4" href="/signup">
              Daftar
            </a>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
