# Annotasi Finance

This repository contains the SLICE-FOUND-001 non-database technical foundation,
the SLICE-FOUND-002 local database foundation, and the SLICE-IAM-001 managed
identity and persisted application-session slice: a pnpm/Turborepo workspace,
strict TypeScript, framework shells, automated Architecture-boundary checks,
PostgreSQL migration/RLS evidence, Clerk-based managed identity with an
Annotasi Finance-owned opaque application session, smoke tests, and Foundation
Gate CI.

No local User, Workspace, Account, entitlement, onboarding, financial feature,
product table, or deployment is implemented in these slices. See
`docs/implementation/IDENTITY_SESSION_REGISTER.md` for the full SLICE-IAM-001
evidence register.

## Prerequisites

- Node.js 24.x LTS (validated with 24.18.0)
- pnpm 11.19.0, pinned by the root `packageManager` field
- Docker-compatible runtime with Compose (validated with Docker 29.4.0 and
  Compose 5.1.2)
- A Clerk development-instance tenant, for exercising the real signup/login/
  recovery flow manually (automated tests use a deterministic fake provider
  and never require this)

## Workspace

```text
apps/
  web/           Next.js shell: technical status page + Clerk-backed signup,
                 login, forgot-password, and post-authenticated session screens
  api/           NestJS/Fastify shell: readiness probe + the identity-session
                 module (provider-token exchange, application-session
                 issuance/validation/revocation, recovery completion)
packages/
  domain/        framework-independent boundary skeleton
  contracts/     transport-shape skeleton
  config/        validated non-secret foundation and identity-session configuration
  test-support/  test-only utilities
database/        private migration tooling, real-PostgreSQL integration tests,
                 and the runtime-safe @annotasi/database/runtime session store
infra/local/     local-only PostgreSQL Compose configuration
```

## Commands

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm boundaries
pnpm build:web
pnpm build:api
pnpm db:check
pnpm db:test
pnpm iam:test
pnpm iam:test:integration
pnpm iam:test:security
pnpm iam:test:web
pnpm run ci
```

`pnpm ci:foundation` runs the seven post-install FOUND-001 validation commands
in the same order as the existing eight-check CI job. `pnpm ci:database` runs
the Testcontainers-backed empty-database migration, migration replay/no-op,
RLS isolation, exact BIGINT, and `application_sessions` runtime evidence.
`pnpm iam:test` runs the SLICE-IAM-001 unit/property tests (token generation
and hashing, cookie policy, session lifecycle, guards, config validation).
`pnpm iam:test:integration` runs the Testcontainers-backed
`application_sessions` PostgreSQL evidence in isolation. `pnpm iam:test:security`
runs the NestJS/Fastify HTTP-level exchange/session/CSRF/origin/revocation
evidence against a deterministic fake identity provider — no live Clerk
credential is ever used. `pnpm iam:test:web` runs the frontend validation,
provider-error-mapping, and auth-screen tests. `pnpm ci:iam` runs all four in
sequence and is what the `identity-session` CI job runs. `pnpm run ci` runs
the complete local Foundation Gate plus the database and IAM gates.
`pnpm format` is the explicit write-mode formatter; CI uses only
`format:check`. Use `pnpm run ci` for the aggregate package script because
pnpm reserves the shorter `pnpm ci` form as an install alias. Before TypeScript
validation, `pnpm typecheck` generates
the Next.js route types required by a clean checkout. The generated
`apps/web/next-env.d.ts` is intentionally not tracked.

## Local PostgreSQL

The local runtime uses the exact official image
`postgres:17.10-alpine3.24`. Its data lives in a named Docker volume and is
throwaway local data only. The committed environment example contains
non-production placeholders; never reuse them outside local development.

```bash
cp infra/local/.env.example infra/local/.env
pnpm db:up
pnpm db:migrate
pnpm db:verify
pnpm db:down
```

Useful database commands:

```bash
pnpm db:up       # start PostgreSQL and wait for health
pnpm db:down     # stop PostgreSQL while preserving its named volume
pnpm db:logs     # follow local PostgreSQL logs
pnpm db:migrate  # bootstrap local roles and apply reviewed SQL migrations
pnpm db:verify   # perform read-only version/migration/policy verification
pnpm db:check    # verify empty-DB migration, no-op, and fresh replay
pnpm db:test     # verify RLS roles/isolation/context and exact BIGINT behavior
pnpm db:reset    # stop PostgreSQL and delete the throwaway named volume
```

The container administrator is bootstrap-only. The separate
`annotasi_migration` role owns migration-managed objects, while the
`annotasi_application` role is a non-owner, non-superuser role without
`BYPASSRLS` or schema-creation privileges. Application RLS evidence always
connects as the application role. Migrations are explicit commands; application
startup never synchronizes or migrates the schema.

The database now contains two tables:

- `foundation_workspace_scope_probe` — a temporary technical probe for
  transaction-local Workspace RLS and exact BIGINT behavior.
- `application_sessions` — the SLICE-IAM-001 opaque application-session
  table (see "Identity and sessions" below).

Neither is the product Workspace model, a User table, or a financial table.

## Identity and sessions

SLICE-IAM-001 uses [Clerk](https://clerk.com) only for managed identity
verification (signup, email verification, login, password recovery). Clerk's
own session/JWT is never the ordinary browser-to-API authorization credential.
After Clerk verifies the identity, the API exchanges the short-lived Clerk
token for its own opaque, server-side application session — a
`HttpOnly`/`Secure`/`SameSite=Lax` cookie whose value is never derivable from
the Clerk token and is looked up in PostgreSQL on every protected request.

### Local environment setup

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local
cp infra/local/.env.example infra/local/.env
```

`apps/api/.env.local` is loaded automatically by `pnpm --filter @annotasi/api dev`
via Node 24's native `--env-file` flag (no `dotenv` dependency). It is **not**
loaded by `pnpm --filter @annotasi/api start` (the production command) — a
real deployment must supply its environment another way. All three files stay
git-ignored; never commit real values into them.

Only two values in `apps/api/.env.local` and one in `apps/web/.env.local`
require a **real** Clerk development-instance credential — every other value
in both `.env.example` files is a safe local placeholder:

- `apps/api/.env.local`: `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`.
- `apps/web/.env.local`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.

### Clerk development-instance setup

1. Create a Clerk application at [clerk.com](https://clerk.com) and select a
   **development** instance (test mode, capped at 100 users, emails sent from
   `@accounts.dev`).
2. Enable the **email address + password** authentication strategy (no
   social login, no passkeys, no MFA beyond an unavoidable provider default).
3. Copy the publishable and secret keys into `apps/web/.env.local` and
   `apps/api/.env.local` respectively (see the non-secret variables below;
   never commit real keys).

### Confirming `apps/api/.env.local` is actually loaded

A quick smoke check, since a missing or unloaded env file is otherwise a
silent failure mode:

```bash
# Pick an unused port to prove this run's config, not a stale process.
echo "PORT=3099" >> apps/api/.env.local
pnpm --filter @annotasi/api dev &
sleep 2
curl -sf http://localhost:3099/health && echo "  <- .env.local was loaded"
kill %1
# Remove the temporary PORT override afterward.
```

If `apps/api/.env.local` does not exist, Node's `--env-file` flag fails fast
with a clear `not found` error rather than silently starting with defaults —
run the `cp` command above first. CI never runs `pnpm dev`, so it never
requires this file.

### Non-secret environment variables

See `apps/web/.env.example` and `apps/api/.env.example` for the full,
placeholder-only list. Key variables: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
(safe for the browser by Clerk's own design), `CLERK_SECRET_KEY` (API-only,
never `NEXT_PUBLIC_*`), `WEB_ORIGIN`/`API_ORIGIN` (CORS/CSRF allowlist),
`DATABASE_APPLICATION_URL` (reuses the FOUND-002 application role),
`SESSION_COOKIE_NAME`, `SESSION_TTL_SECONDS`, `CSRF_SECRET`, and the
local-development-only `SECURE_COOKIES=false` exception (rejected outright
when `APP_ENV=production`).

### Migration and startup

```bash
pnpm db:migrate   # applies both the FOUND-002 and IAM-001 migrations
pnpm --filter @annotasi/web dev
pnpm --filter @annotasi/api dev
```

### Manual sandbox smoke flow

With a real Clerk development-instance tenant configured:

1. Sign up at `/signup`; confirm the verification email arrives and the code
   completes verification.
2. Confirm the browser receives only the opaque `af_session` cookie — no
   Clerk token appears in `localStorage`/`sessionStorage`.
3. Call the protected probe (`GET /identity/session`) and confirm it succeeds
   using only the cookie.
4. Restart the API process; confirm the same cookie is still accepted (proves
   persisted, not in-memory, validation).
5. Sign out (`POST /identity/session/logout`); confirm the cookie is cleared
   and rejected afterward.
6. Sign in from two browser sessions, then use "sign out of all devices"
   (`POST /identity/session/logout-all`) from one; confirm both are rejected.
7. Run the forgot-password flow end to end; confirm the old session cookie is
   rejected once the new password takes effect.
8. Confirm no User, Workspace, Account, entitlement, or financial row is ever
   created — SLICE-IAM-001 persists only `application_sessions`.

Automated tests never perform this flow against a live Clerk tenant; they use
a deterministic fake `IdentityProvider` (`apps/api/test/support`). This manual
flow is the only way to validate real Clerk deliverability, verification
copy, and sandbox behavior, and is a pending validation step until run against
a real tenant.

### Sandbox limitations

Development-instance emails come from `@accounts.dev` and cannot achieve
production-grade deliverability; a production instance requires a custom
sending domain with SPF/DKIM (and DMARC recommended). This is a pre-beta
concern, not a SLICE-IAM-001 blocker.

## Development

Run `pnpm dev` to start the web and API foundation shells together. The API
performs an initial TypeScript build before it starts. API live reload is not
part of SLICE-FOUND-001.

Local non-secret settings are documented in each application's `.env.example`
and `infra/local/.env.example`. Use those files as references when providing
process environment variables; real local environment files remain ignored.
