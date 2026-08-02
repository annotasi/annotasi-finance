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
import { completeRecovery } from "@/lib/api-client";
import { clerkErrorCode, safeClerkErrorMessage } from "@/lib/clerk-errors";
import {
  forgotPasswordRequestSchema,
  forgotPasswordResetSchema,
  type ForgotPasswordRequestValues,
  type ForgotPasswordResetValues,
} from "@/lib/validation";

type Stage = "request" | "requested" | "reset" | "finishing";

const REQUEST_SENT_NOTICE =
  "Jika email tersebut terdaftar, kami telah mengirimkan kode pemulihan ke email tersebut.";

/**
 * Clerk error codes that indicate the lookup simply didn't find a matching
 * account (or an equivalent identifier-level outcome). These are treated
 * identically to a successful request — same generic notice, same stage
 * transition — so the response never reveals whether an account exists.
 */
const ACCOUNT_LOOKUP_ERROR_CODES = new Set([
  "form_identifier_not_found",
  "resource_not_found",
]);

export default function ForgotPasswordPage() {
  const { signIn } = useSignIn();
  const { getToken } = useAuth();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("request");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestForm = useForm<ForgotPasswordRequestValues>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ForgotPasswordResetValues>({
    resolver: zodResolver(forgotPasswordResetSchema),
    defaultValues: { code: "", password: "" },
  });

  async function onSubmitRequest(
    values: ForgotPasswordRequestValues,
  ): Promise<void> {
    setErrorMessage(null);

    try {
      const { error: createError } = await signIn.create({
        identifier: values.email,
      });

      const createErrorCode = clerkErrorCode(createError);
      if (
        createError &&
        (createErrorCode === undefined ||
          !ACCOUNT_LOOKUP_ERROR_CODES.has(createErrorCode))
      ) {
        setErrorMessage(safeClerkErrorMessage(createError));
        return;
      }

      if (!createError) {
        const { error: sendCodeError } =
          await signIn.resetPasswordEmailCode.sendCode();
        const sendCodeErrorCode = clerkErrorCode(sendCodeError);
        if (
          sendCodeError &&
          (sendCodeErrorCode === undefined ||
            !ACCOUNT_LOOKUP_ERROR_CODES.has(sendCodeErrorCode))
        ) {
          setErrorMessage(safeClerkErrorMessage(sendCodeError));
          return;
        }
      }

      // Either the request fully succeeded, or it failed only with an
      // account-lookup-style outcome — both produce the same generic,
      // non-enumerating response (PRD §20 / architecture §16).
      setStage("requested");
    } catch {
      // Provider/network/delivery failure: no reset attempt was reliably
      // prepared, so stay on the request stage with a retry-safe message.
      setErrorMessage(safeClerkErrorMessage(undefined));
    }
  }

  async function onSubmitReset(
    values: ForgotPasswordResetValues,
  ): Promise<void> {
    setErrorMessage(null);

    try {
      const { error: verifyError } =
        await signIn.resetPasswordEmailCode.verifyCode({ code: values.code });
      if (verifyError) {
        setErrorMessage(safeClerkErrorMessage(verifyError));
        return;
      }

      const { error: submitError } =
        await signIn.resetPasswordEmailCode.submitPassword({
          password: values.password,
          signOutOfOtherSessions: true,
        });
      if (submitError) {
        setErrorMessage(safeClerkErrorMessage(submitError));
        return;
      }

      if (signIn.status !== "complete") {
        setErrorMessage(
          "Pemulihan belum lengkap. Silakan periksa kode Anda dan coba lagi.",
        );
        return;
      }

      setStage("finishing");

      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError) {
        setErrorMessage(safeClerkErrorMessage(finalizeError));
        setStage("reset");
        return;
      }

      const providerToken = await getToken();
      if (providerToken === null) {
        setErrorMessage(
          "Tidak dapat membuat sesi baru. Silakan masuk kembali secara manual.",
        );
        setStage("reset");
        return;
      }

      await completeRecovery(providerToken);
      router.push("/session");
    } catch {
      // Covers a thrown verifyCode/submitPassword/finalize/getToken/recovery
      // failure. The "finishing" state must never remain stuck, so always
      // fall back to the retryable reset stage.
      setErrorMessage(
        "Tidak dapat membuat sesi baru. Silakan masuk kembali secara manual.",
      );
      setStage("reset");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Pulihkan kata sandi</CardTitle>
          <CardDescription>
            {stage === "request" &&
              "Masukkan email akun Anda untuk menerima kode pemulihan."}
            {stage === "requested" &&
              "Masukkan kode pemulihan dan kata sandi baru Anda."}
            {(stage === "reset" || stage === "finishing") &&
              "Masukkan kode pemulihan dan kata sandi baru Anda."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {errorMessage !== null && (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {stage === "request" && (
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                void requestForm.handleSubmit(onSubmitRequest)(event);
              }}
              noValidate
            >
              <div className="grid gap-1.5">
                <Label htmlFor="recovery-email">Email</Label>
                <Input
                  id="recovery-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={
                    requestForm.formState.errors.email !== undefined
                  }
                  {...requestForm.register("email")}
                />
                {requestForm.formState.errors.email && (
                  <p className="text-sm text-destructive" role="alert">
                    {requestForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={requestForm.formState.isSubmitting}
              >
                {requestForm.formState.isSubmitting
                  ? "Memproses..."
                  : "Kirim kode pemulihan"}
              </Button>
            </form>
          )}

          {stage !== "request" && (
            <>
              <Alert>
                <AlertDescription>{REQUEST_SENT_NOTICE}</AlertDescription>
              </Alert>
              <form
                className="grid gap-4"
                onSubmit={(event) => {
                  void resetForm.handleSubmit(onSubmitReset)(event);
                }}
                noValidate
              >
                <div className="grid gap-1.5">
                  <Label htmlFor="recovery-code">Kode pemulihan</Label>
                  <Input
                    id="recovery-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    aria-invalid={resetForm.formState.errors.code !== undefined}
                    {...resetForm.register("code")}
                  />
                  {resetForm.formState.errors.code && (
                    <p className="text-sm text-destructive" role="alert">
                      {resetForm.formState.errors.code.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="recovery-password">Kata sandi baru</Label>
                  <Input
                    id="recovery-password"
                    type="password"
                    autoComplete="new-password"
                    aria-invalid={
                      resetForm.formState.errors.password !== undefined
                    }
                    {...resetForm.register("password")}
                  />
                  {resetForm.formState.errors.password && (
                    <p className="text-sm text-destructive" role="alert">
                      {resetForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={
                    resetForm.formState.isSubmitting || stage === "finishing"
                  }
                >
                  {stage === "finishing"
                    ? "Menyelesaikan..."
                    : "Atur ulang kata sandi"}
                </Button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Ingat kata sandi Anda?{" "}
            <a className="underline underline-offset-4" href="/login">
              Masuk
            </a>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
