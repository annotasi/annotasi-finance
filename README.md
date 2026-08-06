# Annotasi Finance

This repository contains the SLICE-FOUND-001 non-database technical foundation,
the SLICE-FOUND-002 local database foundation, the SLICE-IAM-001 managed
identity/application-session slice, the SLICE-IAM-002 private-beta
onboarding/isolation slice, and the SLICE-ACC-001 Account management baseline:
a pnpm/Turborepo workspace, strict TypeScript, framework shells, automated
Architecture-boundary checks, PostgreSQL migration/RLS evidence, Clerk-based
managed identity with an Annotasi Finance-owned opaque application session,
operator-issued invitation entitlements, one private Workspace and starter
Account per verified identity, forced RLS, Account create/list/rename/archive/
restore/delete-eligibility evaluation with optimistic-version concurrency,
smoke tests, and Foundation Gate CI.

IAM-002 intentionally stops after the starter Account: it creates no category,
financial event, reporting workflow, collaboration feature, import, or
deployment. ACC-001 turns that starter Account into an ordinary managed
Account and adds creation, rename, archive/restore, and read-only delete-
eligibility evaluation, but performs no permanent deletion, no Opening Balance
or effective-date correction, and no financial behavior. See
`docs/implementation/ONBOARDING_ISOLATION_REGISTER.md` for IAM-002 evidence,
`docs/implementation/IDENTITY_SESSION_REGISTER.md` for IAM-001, and
`docs/implementation/ACCOUNT_MANAGEMENT_REGISTER.md` for ACC-001.

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
                 login, recovery, onboarding, and session screens
  api/           NestJS/Fastify shell: readiness probe + the identity-session
                 module (provider-token exchange, application-session
                 issuance/validation/revocation, recovery completion)
packages/
  domain/        framework-independent boundary skeleton
  contracts/     transport-shape skeleton
  config/        validated non-secret foundation and identity-session configuration
  test-support/  test-only utilities
database/        migration/operator tooling, real-PostgreSQL integration tests,
                 and runtime-safe session/onboarding persistence
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
pnpm iam2:test
pnpm iam2:test:integration
pnpm iam2:test:http
pnpm iam2:test:web
pnpm ci:iam2
pnpm account:test
pnpm account:test:integration
pnpm account:test:security
pnpm account:test:web
pnpm ci:acc1
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
sequence and is what the `identity-session` CI job runs. `pnpm ci:iam2` runs
the IAM-002 service/property, PostgreSQL atomicity/concurrency/RLS, real
NestJS/Fastify HTTP security, and browser evidence used by the onboarding CI
job. `pnpm account:test` runs the ACC-001 contract/service unit and property
tests (INV-ACC-01–03). `pnpm account:test:integration` runs the
Testcontainers-backed Account PostgreSQL/RLS/concurrency evidence.
`pnpm account:test:security` runs the real NestJS/Fastify HTTP evidence for
Account routes. `pnpm account:test:web` runs the `/accounts` frontend
interaction tests. `pnpm ci:acc1` runs all four in sequence and is what the
`account-management` CI job runs. `pnpm run ci` runs the complete local
Foundation Gate plus both IAM gates and the ACC-001 gate.
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

`annotasi_operator` is a third non-owner/non-superuser role limited to private-
beta invitation operations. It cannot read User, Workspace, Account, or
application-session rows.

In addition to the technical foundation probe and IAM-001 session table,
IAM-002 adds:

- `users` — the Clerk-subject mapping and current normalized verified email.
- `private_beta_invitations` — the hashed single-use beta entitlement.
- `workspaces` — one private IDR/Asia-Jakarta Workspace per User.
- `accounts` — the starter Account and exact whole-Rupiah opening balances.
  ACC-001 extends this table with `lifecycle_status` (`active`/`archived`),
  `archived_at`, `updated_at`, and an optimistic `version` counter; it removes
  the IAM-002-era hard pin forcing `total_balance`/`unallocated_balance` to
  always equal `opening_balance`, since a future Financial Event slice must be
  able to change them while `opening_balance` itself stays fixed.
- `onboarding_idempotency` and `onboarding_audit_events` — replay and safe
  operational evidence.

Workspace-scoped product rows use forced RLS with transaction-local scope
derived from the validated application session, never request payload fields.
Missing, empty, and malformed context values safely expose no rows without a
UUID-cast error. Application and operator invitation mutations use explicit
column grants: runtime can write consumption fields only, while the operator
can write revocation fields only. PostgreSQL `now()` evaluates redemption
expiry while the invitation row is locked, and a database check requires every
expiry to be later than issuance.

## Private-beta invitation and onboarding

After migration, an operator-only process can issue or revoke invitations.
Issuance prints the raw token once; only its SHA-256 hash is persisted.

```bash
pnpm invite:issue -- --email invited@example.com
pnpm invite:issue -- --email invited@example.com --expires-at 2026-08-31T17:00:00Z

# zsh: silent prompt; the raw token is sent on stdin, never as a process argument.
read -rs "INVITATION_TOKEN?Invitation token: "
printf '\n'
print -r -- "$INVITATION_TOKEN" | pnpm invite:revoke
unset INVITATION_TOKEN
```

The commands require `DATABASE_OPERATOR_URL`, documented in
`infra/local/.env.example`. Reissuing creates a new record and never overwrites
an older invitation. Do not place raw tokens in URLs, shared shell history,
logs, source files, analytics, or screenshots. An explicit `--expires-at` must
be a valid future ISO-8601 instant. Revocation never prints the raw token.

The database suite injects deterministic failures after User mapping,
Workspace insert, starter Account insert, idempotency insert, invitation
consumption, and immediately before commit. Each stage proves complete rollback
and successful retry. Its bounded concurrency matrix covers one token with the
same and different keys, two subjects with one token, one subject with two
tokens, replay/conflict, and retry. The Isolation Gate additionally checks role
attributes and ownership, forced RLS, malformed context, A/B raw-SQL and store
isolation, guessed identifiers, forbidden writes, and transaction-local context
reset. `pnpm iam2:test:http` covers real PostgreSQL application sessions and the
real session/Origin/CSRF guards with a deterministic fake Clerk provider.

The browser path is `/signup` or `/login` → application-session exchange →
`/onboarding`. The form collects the invitation token and exactly the starter
Account name, type, non-negative whole-Rupiah opening balance, and date-only
effective date. Already-onboarded identities receive a minimal ready state.

A step-by-step live testing guide, field explanations, realistic examples, and
future-editability boundaries are documented in
`docs/implementation/IAM_002_ONBOARDING_TESTING_GUIDE.md`.

## Account management

SLICE-ACC-001 turns the IAM-002 starter Account into an ordinary managed
Account and adds the smallest REST surface for list/create/rename/archive/
restore/delete-eligibility evaluation. The browser path is
`/onboarding` → **Lanjutkan** → `/accounts`.

```bash
pnpm --filter @annotasi/api dev
pnpm --filter @annotasi/web dev
```

Open `/accounts`. It lists Active and Archived Accounts separately, and
supports:

- **Create** — Nama akun, Jenis akun (Tunai/Rekening Bank/Dompet Digital/
  Lainnya), Saldo awal (whole Rupiah), Tanggal saldo awal. Duplicate names are
  accepted by design.
- **Rename** — updates only the name; Account ID, Type, Opening Balance,
  Opening-Balance Effective Date, and all balances stay unchanged.
- **Archive** — only accepted when Total Account Balance is exactly Rp0;
  otherwise the API returns `ACCOUNT_ARCHIVE_BALANCE_NON_ZERO` with an
  Indonesian explanation that never claims confirmation can override the
  rule.
- **Restore** — reactivates an archived Account as the same row; no
  recalculation.
- **Delete-eligibility evaluation** — a read-only check (`eligible`, safe
  reason codes, and the underlying facts) against Opening Balance and real
  persisted dependencies (an onboarding-created starter Account is currently
  ineligible while its `onboarding_idempotency` row exists). It never deletes
  anything: there is no DELETE route, and the application database role has
  no DELETE privilege on `accounts`.

Every mutation requires the caller's last-known `expectedVersion` (an
optimistic version counter). A stale version returns `ACCOUNT_CONFLICT`
instead of silently overwriting a concurrent change; the browser reloads
Account state after a conflict rather than guessing.

Explicitly excluded from ACC-001: permanent deletion, Opening Balance
correction, Opening-Balance Effective Date correction, Account Type editing,
negative balances, credit-card/liability Accounts, Category, Dedicated Fund,
Debt Record, Financial Event, dashboard, and reporting. See
`docs/implementation/ACCOUNT_MANAGEMENT_REGISTER.md` for full evidence.

Database-boundary hardening (correction pass): the single `accounts`
Row-Level Security policy is split into explicit SELECT/INSERT/UPDATE
policies. The INSERT policy additionally requires Total = Unallocated =
Opening Balance, active lifecycle, no `archived_at`, and `version = 1`, so
the application role cannot insert an Account that violates ACC-001's
creation invariants even with direct SQL. A permanent
`unallocated_balance <= total_balance` check is preserved for future Fund
Allocation without pinning `total_balance = unallocated_balance` forever.
Account IDs are validated as strict UUIDs and `expectedVersion` as a bounded
positive BIGINT string before either ever reaches PostgreSQL, so malformed
input returns a safe `ACCOUNT_REQUEST_INVALID` 400 instead of a database
error. A real IAM-002→ACC-001 migration-upgrade test applies only migrations
0000-0002, seeds a representative starter Account, then applies 0003 and
confirms every starter Account fact is preserved. ACC-001 itself emits no
structured Account lifecycle log lines; the only logging surface exercised
in tests is Fastify's generic HTTP request log, and the test suite proves
dynamic Account IDs are redacted from it rather than merely excluding
request logs from the safety check.

Final correction pass: delete-eligibility evaluation now checks a real
persisted dependency — `onboarding_idempotency.account_id` (`ON DELETE
RESTRICT`) — instead of a hard-coded `false`, so the IAM-002 starter Account
is currently ineligible (`DEPENDENCY_EXISTS`) even at Opening Balance Rp0,
while a dependency-free additional zero-balance Account remains eligible.
Every Archived Account's `total_balance = 0` is now enforced twice,
independently: by `AccountStore` and by a PostgreSQL CHECK constraint, so a
direct SQL `UPDATE` bypassing the application layer cannot archive a
non-zero-balance Account either. Renaming an Account now returns
`ACCOUNT_NAME_INVALID` only for an invalid name; a malformed
`expectedVersion` or an extra immutable/authority field returns
`ACCOUNT_REQUEST_INVALID` instead, and the database is never reached in
either failure case.

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
pnpm db:migrate   # applies FOUND-002, IAM-001, and IAM-002 migrations
pnpm --filter @annotasi/web dev
pnpm --filter @annotasi/api dev
```

### Manual sandbox smoke flow

With a real Clerk development-instance tenant configured:

1. Sign up at `/signup`; confirm the verification email arrives and the code
   completes verification.
2. Confirm the browser receives only the opaque `af_session` cookie — no
   Clerk token appears in `localStorage`/`sessionStorage`.
3. Issue a private-beta invitation for the same verified email, redeem it at
   `/onboarding`, and confirm exactly one User, Workspace, and starter Account
   exist with no category or financial event.
4. Retry the same redemption and confirm it returns the same Workspace/Account.
5. Call the protected probes (`GET /identity/session` and
   `GET /onboarding/workspace`) and confirm they succeed using only the cookie.
6. Restart the API process; confirm the same cookie is still accepted (proves
   persisted, not in-memory, validation).
7. Sign out (`POST /identity/session/logout`); confirm the cookie is cleared
   and rejected afterward.
8. Sign in from two browser sessions, then use "sign out of all devices"
   (`POST /identity/session/logout-all`) from one; confirm both are rejected.
9. Run the forgot-password flow end to end; confirm the old session cookie is
   rejected once the new password takes effect.

Automated tests never perform this flow against a live Clerk tenant; they use
a deterministic fake `IdentityProvider` (`apps/api/test/support`). This manual
flow is the only way to validate real Clerk deliverability, verified-email
metadata, token delivery, and end-to-end sandbox behavior, and remains pending
until run against a real tenant.

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
