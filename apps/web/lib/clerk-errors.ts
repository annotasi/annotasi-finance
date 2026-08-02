/**
 * Maps Clerk's machine-stable error codes to safe, human-readable Indonesian
 * messages. Clerk's own `error.message`/`longMessage` are developer-facing
 * English text and are never shown to the user directly.
 */
const CODE_MESSAGES: Record<string, string> = {
  form_identifier_exists:
    "Alamat email ini sudah terdaftar. Coba masuk, atau gunakan opsi lupa kata sandi.",
  form_password_pwned:
    "Kata sandi ini pernah ditemukan dalam kebocoran data. Gunakan kata sandi lain yang unik.",
  form_password_length_too_short: "Kata sandi terlalu pendek.",
  form_password_incorrect:
    "Email atau kata sandi tidak cocok. Periksa kembali keduanya, atau gunakan opsi lupa kata sandi.",
  form_password_or_identifier_incorrect:
    "Email atau kata sandi tidak cocok. Periksa kembali keduanya, atau gunakan opsi lupa kata sandi.",
  form_password_validation_failed:
    "Email atau kata sandi tidak cocok. Periksa kembali keduanya, atau gunakan opsi lupa kata sandi.",
  form_identifier_not_found:
    "Email atau kata sandi tidak cocok. Periksa kembali keduanya, atau gunakan opsi lupa kata sandi.",
  form_code_incorrect:
    "Kode yang Anda masukkan salah atau sudah tidak berlaku.",
  verification_expired:
    "Kode verifikasi sudah kedaluwarsa. Silakan minta kode baru.",
  too_many_requests:
    "Terlalu banyak percobaan. Silakan coba lagi beberapa saat lagi.",
  captcha_invalid:
    "Verifikasi keamanan gagal. Muat ulang halaman, lalu coba kembali.",
  captcha_missing_token:
    "Verifikasi keamanan belum selesai. Muat ulang halaman, lalu coba kembali.",
};

const DEFAULT_MESSAGE =
  "Terjadi kendala saat memproses permintaan Anda. Silakan coba kembali.";

export const CREDENTIAL_MISMATCH_CODES = new Set([
  "form_password_incorrect",
  "form_password_or_identifier_incorrect",
  "form_password_validation_failed",
  "form_identifier_not_found",
]);

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

/**
 * Clerk's Future API can surface errors as a direct object, a root array, an
 * `{ errors: [...] }` response, or a nested `{ error: ... }` wrapper. Keep the
 * traversal intentionally narrow and bounded so provider messages and
 * metadata are never rendered accidentally.
 */
function findCode(value: unknown, depth = 0): string | undefined {
  if (depth > 4) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    for (const candidate of value) {
      const code = findCode(candidate, depth + 1);
      if (code !== undefined) {
        return code;
      }
    }
    return undefined;
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const directCode = value["code"];
  if (typeof directCode === "string") {
    return directCode;
  }

  const knownContainers = [
    "errors",
    "error",
    "fields",
    "global",
    "password",
    "identifier",
    "response",
    "data",
    "body",
    "cause",
  ] as const;

  for (const key of knownContainers) {
    const nestedCode = findCode(value[key], depth + 1);
    if (nestedCode !== undefined) {
      return nestedCode;
    }
  }

  return undefined;
}

/**
 * Returns only Clerk's machine-stable code. Provider messages, metadata,
 * email addresses, trace data, and authentication material are discarded.
 */
export function clerkErrorCode(error: unknown): string | undefined {
  return findCode(error);
}

export function isCredentialMismatchError(error: unknown): boolean {
  const code = clerkErrorCode(error);
  return code !== undefined && CREDENTIAL_MISMATCH_CODES.has(code);
}

export function safeClerkErrorMessage(error: unknown): string {
  const code = clerkErrorCode(error);
  return code === undefined
    ? DEFAULT_MESSAGE
    : (CODE_MESSAGES[code] ?? DEFAULT_MESSAGE);
}
