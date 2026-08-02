/**
 * Maps Clerk's machine-stable error codes to safe, generic Indonesian
 * messages. Clerk's own `error.message`/`longMessage` are developer-facing
 * English text and are never shown to the user directly.
 */
const CODE_MESSAGES: Record<string, string> = {
  form_identifier_exists:
    "Alamat email ini sudah terdaftar. Coba masuk, atau gunakan opsi lupa kata sandi.",
  form_password_pwned:
    "Kata sandi ini pernah bocor di kebocoran data lain. Silakan gunakan kata sandi lain.",
  form_password_length_too_short: "Kata sandi terlalu pendek.",
  form_password_incorrect: "Email atau kata sandi salah.",
  form_identifier_not_found: "Email atau kata sandi salah.",
  form_code_incorrect:
    "Kode yang Anda masukkan salah atau sudah tidak berlaku.",
  verification_expired:
    "Kode verifikasi sudah kedaluwarsa. Silakan minta kode baru.",
  too_many_requests:
    "Terlalu banyak percobaan. Silakan coba lagi beberapa saat lagi.",
};

const DEFAULT_MESSAGE =
  "Terjadi kesalahan. Silakan periksa kembali data Anda dan coba lagi.";

export function safeClerkErrorMessage(code: string | undefined): string {
  if (code === undefined) {
    return DEFAULT_MESSAGE;
  }
  return CODE_MESSAGES[code] ?? DEFAULT_MESSAGE;
}
