"use client";

import { useAuth, useSignUp } from "@clerk/nextjs";
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
import {
  signUpSchema,
  verifyCodeSchema,
  type SignUpValues,
  type VerifyCodeValues,
} from "@/lib/validation";

type Stage = "form" | "verifying" | "finishing";

export default function SignUpPage() {
  const { signUp } = useSignUp();
  const { getToken } = useAuth();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("form");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
  });

  const verifyForm = useForm<VerifyCodeValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: "" },
  });

  async function onSubmitSignUp(values: SignUpValues): Promise<void> {
    setErrorMessage(null);

    try {
      const { error } = await signUp.password({
        emailAddress: values.email,
        password: values.password,
      });
      if (error) {
        setErrorMessage(safeClerkErrorMessage(error));
        return;
      }

      const { error: codeError } = await signUp.verifications.sendEmailCode();
      if (codeError) {
        setErrorMessage(safeClerkErrorMessage(codeError));
        return;
      }

      setStage("verifying");
    } catch {
      // Thrown provider/network failure — no reset was reliably prepared,
      // so stay on the form stage with a retry-safe message.
      setErrorMessage(safeClerkErrorMessage(undefined));
    }
  }

  async function onSubmitVerify(values: VerifyCodeValues): Promise<void> {
    setErrorMessage(null);

    try {
      const { error } = await signUp.verifications.verifyEmailCode({
        code: values.code,
      });
      if (error) {
        setErrorMessage(safeClerkErrorMessage(error));
        return;
      }

      if (signUp.status !== "complete") {
        setErrorMessage("Verifikasi belum lengkap. Silakan periksa kode Anda.");
        return;
      }

      setStage("finishing");

      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        setErrorMessage(safeClerkErrorMessage(finalizeError));
        setStage("verifying");
        return;
      }

      const providerToken = await getToken();
      if (providerToken === null) {
        setErrorMessage(
          "Tidak dapat membuat sesi. Silakan muat ulang halaman dan coba lagi.",
        );
        setStage("verifying");
        return;
      }

      await exchangeProviderToken(providerToken);
      router.push("/onboarding");
    } catch {
      // Covers a thrown verifyEmailCode/finalize/getToken/exchange failure —
      // the "finishing" state must never remain stuck, so always fall back
      // to the retryable verification stage.
      setErrorMessage(
        "Tidak dapat membuat sesi. Silakan muat ulang halaman dan coba lagi.",
      );
      setStage("verifying");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Buat akun Annotasi Finance</CardTitle>
          <CardDescription>
            {stage === "form"
              ? "Masukkan email dan kata sandi Anda untuk memulai."
              : "Masukkan kode yang kami kirim ke email Anda."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {errorMessage !== null && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {stage === "form" && (
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                void signUpForm.handleSubmit(onSubmitSignUp)(event);
              }}
              noValidate
            >
              <div className="grid gap-1.5">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={signUpForm.formState.errors.email !== undefined}
                  {...signUpForm.register("email")}
                />
                {signUpForm.formState.errors.email && (
                  <p className="text-sm text-destructive" role="alert">
                    {signUpForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="signup-password">Kata sandi</Label>
                <Input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={
                    signUpForm.formState.errors.password !== undefined
                  }
                  {...signUpForm.register("password")}
                />
                {signUpForm.formState.errors.password && (
                  <p className="text-sm text-destructive" role="alert">
                    {signUpForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div id="clerk-captcha" className="w-full" />
              <Button
                type="submit"
                disabled={signUpForm.formState.isSubmitting}
              >
                {signUpForm.formState.isSubmitting ? "Memproses..." : "Daftar"}
              </Button>
            </form>
          )}

          {stage !== "form" && (
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                void verifyForm.handleSubmit(onSubmitVerify)(event);
              }}
              noValidate
            >
              <div className="grid gap-1.5">
                <Label htmlFor="verify-code">Kode verifikasi</Label>
                <Input
                  id="verify-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  aria-invalid={verifyForm.formState.errors.code !== undefined}
                  {...verifyForm.register("code")}
                />
                {verifyForm.formState.errors.code && (
                  <p className="text-sm text-destructive" role="alert">
                    {verifyForm.formState.errors.code.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={
                  verifyForm.formState.isSubmitting || stage === "finishing"
                }
              >
                {stage === "finishing" ? "Menyelesaikan..." : "Verifikasi"}
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <a className="underline underline-offset-4" href="/login">
              Masuk
            </a>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
