const API_ORIGIN =
  process.env["NEXT_PUBLIC_API_ORIGIN"] ?? "http://localhost:3001";

export interface ApiErrorBody {
  readonly code?: string;
  readonly message?: string;
}

export class ApiRequestError extends Error {
  public constructor(
    public readonly status: number,
    public readonly body: ApiErrorBody | null,
  ) {
    super(body?.message ?? "Request failed");
    this.name = "ApiRequestError";
  }
}

interface RequestOptions {
  readonly method: "GET" | "POST";
  readonly headers?: Record<string, string>;
  /** Only present for requests that actually send a JSON body. */
  readonly body?: Record<string, never>;
}

/**
 * A `Content-Type: application/json` header is added only when a JSON body
 * is actually being sent. Fastify rejects an empty body when
 * `application/json` is declared, so requests with no body (the exchange
 * and recovery-completion routes, which only carry an Authorization header)
 * must never send that header.
 */
async function request<T>(path: string, options: RequestOptions): Promise<T> {
  const headers: Record<string, string> = { ...options.headers };
  let body: string | undefined;

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_ORIGIN}${path}`, {
    method: options.method,
    credentials: "include",
    headers,
    ...(body !== undefined ? { body } : {}),
  });

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as ApiErrorBody | null;
    throw new ApiRequestError(response.status, errorBody);
  }

  return (await response.json()) as T;
}

export function exchangeProviderToken(
  providerToken: string,
): Promise<{ status: "verified" }> {
  return request("/identity/exchange", {
    method: "POST",
    headers: { Authorization: `Bearer ${providerToken}` },
  });
}

export function completeRecovery(
  providerToken: string,
): Promise<{ status: "verified" }> {
  return request("/identity/recovery/complete", {
    method: "POST",
    headers: { Authorization: `Bearer ${providerToken}` },
  });
}

export function fetchSessionStatus(): Promise<{
  status: "active";
  expiresAt: string;
  csrfToken: string;
}> {
  return request("/identity/session", { method: "GET" });
}

export function logoutCurrentSession(
  csrfToken: string,
): Promise<{ status: "revoked" }> {
  return request("/identity/session/logout", {
    method: "POST",
    headers: { "x-csrf-token": csrfToken },
    body: {},
  });
}

export function logoutAllSessions(
  csrfToken: string,
): Promise<{ status: "revoked" }> {
  return request("/identity/session/logout-all", {
    method: "POST",
    headers: { "x-csrf-token": csrfToken },
    body: {},
  });
}
