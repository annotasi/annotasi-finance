import type { NextConfig } from "next";

const isDevelopment = process.env["NODE_ENV"] !== "production";

const apiOrigin =
  process.env["NEXT_PUBLIC_API_ORIGIN"] ?? "http://localhost:3001";

const clerkFrontendApiOrigin =
  process.env["NEXT_PUBLIC_CLERK_FRONTEND_API_URL"];

const compact = (values: Array<string | undefined>): string =>
  values.filter((value): value is string => Boolean(value)).join(" ");

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",

  `script-src ${compact([
    "'self'",
    "'unsafe-inline'",
    isDevelopment ? "'unsafe-eval'" : undefined,
    clerkFrontendApiOrigin,
    "https://challenges.cloudflare.com",
    "https://*.protect.clerk.com",
  ])}`,

  `connect-src ${compact([
    "'self'",
    apiOrigin,
    clerkFrontendApiOrigin,
    "https://clerk-telemetry.com",
    "https://*.clerk-telemetry.com",
    "https://*.protect.clerk.com",
  ])}`,

  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://img.clerk.com",
  "font-src 'self'",
  "worker-src 'self' blob:",
  "frame-src 'self' https://challenges.cloudflare.com https://*.protect.clerk.com",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), geolocation=(), microphone=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
