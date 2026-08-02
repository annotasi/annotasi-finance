# Onboarding and Isolation Register

## Scope

This register records SLICE-IAM-002 only: one Clerk-verified identity redeems
one operator-issued private-beta entitlement to atomically establish one local
User, one private Workspace, and one starter Account. It stops before
categories, financial events, reporting workflows, collaboration, import, and
all later slices.

## Authoritative mapping

| Requirement                           | Implementation evidence                                                                                                             |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| WB-01, one private Workspace          | `users.external_subject` and `workspaces.owner_user_id` are unique; onboarding creates both in one transaction.                     |
| Exact private-beta entitlement        | `private_beta_invitations` binds normalized invited email to a SHA-256 token hash; raw tokens are never persisted.                  |
| Verified identity, not email identity | The application session supplies Clerk subject; Clerk backend metadata supplies only addresses with verification status `verified`. |
| One starter Account                   | `accounts_one_starter_per_workspace` is a partial unique index; initial total and unallocated balances equal opening balance.       |
| IDR and Asia/Jakarta                  | Database checks fix Workspace currency to `IDR` and timezone to `Asia/Jakarta`; opening date stays date-only.                       |
| No event/category side effect         | Migration `0002_onboarding_isolation.sql` creates neither table; PostgreSQL integration evidence asserts both relations are absent. |

## Invitation lifecycle

The operator CLI is `database/scripts/private-beta-invitation.mjs`, surfaced as
`pnpm invite:issue` and `pnpm invite:revoke`. It uses only
`DATABASE_OPERATOR_URL`. Generated tokens contain 256 random bits and use the
`afbeta_` prefix; only SHA-256 hashes reach PostgreSQL. Issue, revoke, consume,
expiry, and safe rejection outcomes are durable categorical audit rows.
Reissuance inserts a distinct row and never updates an older invitation.
PostgreSQL `now()` determines expiry inside the redemption transaction while
the invitation is row-locked; application-clock time is not a security input.
The database rejects an expiry equal to or earlier than issuance, and the CLI
also requires an explicit expiry to be a valid future ISO-8601 instant.

Revocation accepts no raw-token command-line argument. The operator supplies
the token on stdin (the README uses a silent zsh prompt), and revocation prints
only categorical status. Root pnpm wrappers forward issue arguments without
embedding a literal `--`; the CLI input parser also tolerates one conventional
leading pnpm separator so direct and wrapped invocations behave consistently.

The runtime role can select only the invitation whose hash matches the
transaction-local server-derived token context and can update only its four
consumption columns. It has no invitation INSERT grant and cannot alter email,
token, issue/expiry, or revocation facts. The operator can insert issuance
columns, select only token/revocation/consumption facts required by revocation,
and update only `revoked_at` and `revoked_reason`. It has no grants on User,
Workspace, Account, idempotency, or application-session data. PostgreSQL ACL
integration assertions prove both allowed and forbidden column privileges.

## Transaction and replay contract

Redemption uses PostgreSQL `READ COMMITTED` in one transaction. It acquires a
transaction-scoped subject advisory lock and `FOR UPDATE` lock on the invitation
row. Unique subject/owner/token/starter constraints remain database backstops.
This lock order serializes both same-token races and two-valid-token races for
the same subject across API processes.

`Idempotency-Key` is required (16–128 URL-safe characters). The stored
fingerprint hashes the invitation-token hash and every material starter Account
fact. An identical committed replay returns the original Workspace/Account
identifiers with `replayed: true`; a changed payload with the same key yields
`IDEMPOTENCY_CONFLICT`. Failed product mutations roll back. Safe rejection
audit evidence is written separately and contains categorical reasons only.

Test-only failpoints, unavailable through package runtime exports, environment,
or HTTP, inject failure after User mapping, Workspace insert, starter Account
insert, idempotency insert, invitation consumption, and before commit. Every
stage proves that no partial User, Workspace, Account, idempotency success, or
consumption survives and that the same token/key can then succeed.

## Isolation model

`users`, `private_beta_invitations`, `workspaces`, `accounts`,
`onboarding_idempotency`, and `onboarding_audit_events` have enabled and forced
RLS. Runtime context uses transaction-local PostgreSQL settings:

- `app.external_subject`
- `app.invitation_token_hash`
- `app.user_id`
- `app.workspace_id`

Values come only from the validated application session, server-side hashing,
and resolved database identifiers. Browser payloads cannot select User or
Workspace scope. `resolve_private_workspace_context` is a narrow
`SECURITY DEFINER` resolver whose forced-RLS policies still restrict it to the
current external subject. The migration owner, application role, and operator
role are all non-superuser and `NOBYPASSRLS`; runtime and operator roles do not
own the tables. UUID columns compare their text representation to the settings;
absent, empty, or malformed settings therefore deny without SQLSTATE `22P02`,
and malformed-context writes fail RLS checks.

## API and browser contract

- `GET /onboarding/status`: application cookie only; returns invitation-needed
  or Workspace-ready state and a CSRF token.
- `POST /onboarding/redeem`: application cookie, exact Origin, JSON, CSRF, and
  `Idempotency-Key`; never accepts Clerk subject, User ID, or Workspace ID.
- `GET /onboarding/workspace`: protected Workspace-readiness probe.
- `/onboarding`: Indonesian, keyboard-operable form for invitation token,
  Account name/type, whole-Rupiah opening balance, and date-only effective date.

Account labels are `Tunai`, `Rekening Bank`, `Dompet Digital`, and `Lainnya`,
mapped to stable internal values `cash`, `bank_account`, `e_wallet`, and
`other`. The token is entered in the form and is not put in a URL.

## Safe operational evidence

Durable audit rows use only event/reason categories. Focused HTTP tests capture
application logs and error bodies and prove they exclude raw invitation tokens,
email addresses, Clerk subjects, balances, cookies, provider payloads, and
stack traces. Public invitation rejection responses deliberately do not
distinguish unknown, expired, revoked, consumed, or email-mismatch tokens.

## Validation inventory

- API service and property tests: `apps/api/test/onboarding.service.test.ts`
- PostgreSQL atomicity/concurrency/RLS tests:
  `database/test/onboarding.integration.test.ts`
- NestJS/Fastify/PostgreSQL security tests:
  `apps/api/test/onboarding.integration.test.ts`
- Operator secret-input tests:
  `database/test/private-beta-invitation-cli.test.ts`
- Browser interaction tests: `apps/web/test/onboarding-interaction.test.tsx`
- Browser request-shape tests: `apps/web/test/api-client.test.ts`
- Migration/replay: `database/test/migration.integration.test.ts`
- Aggregate gate: `pnpm ci:iam2`

The bounded PostgreSQL concurrency matrix covers same token/same key, same
token/different keys, two subjects/one token, one subject/two tokens, exact
replay, changed material, a different key after success, and retry after every
rollback failpoint. Count assertions preserve at most one subject mapping, one
private Workspace, one starter Account, and one consumption result.

The complete Isolation Gate uses restricted roles—not administrator behavior—
to prove no/empty/malformed/own/cross scope, A-only and B-only reads, guessed
Account denial, cross-Workspace insert/update/delete denial, raw-SQL and runtime
store isolation, connection reuse and rollback context clearing, and body
Workspace authority being ignored. Administrator access is used only to inspect
role attributes, table ownership, `FORCE ROW LEVEL SECURITY`, ACL metadata, and
postcondition counts.

The HTTP suite uses the real `SessionGuard`, `OriginCsrfGuard`, Fastify stack,
opaque PostgreSQL sessions, and disposable Testcontainers PostgreSQL. It proves
missing/forged/revoked/expired/Bearer-only authentication rejection, valid
cookie access, Origin/CSRF/content-type/idempotency rejection, safe invalid
invitation behavior, successful redemption, exact replay, changed-payload
conflict, ignored client authority identifiers, ready status, and log/error
safety. Only Clerk metadata is deterministic test data.

## Research and compatibility record

Checked 2026-08-02 against official sources and registries:

- Clerk Backend User and EmailAddress/Verification references: backend lookup
  returns User email addresses and verification status; only exact `verified`
  entries are accepted.
- PostgreSQL 17 row-security, explicit-locking, transaction-isolation,
  `set_config`, constraint, and `INSERT ... ON CONFLICT` documentation.
- Drizzle transaction and migration documentation.
- npm registry: `@clerk/backend 3.15.0`, `fast-check 4.9.0`,
  `@fast-check/vitest 0.4.1`, `drizzle-orm 0.45.2`, `drizzle-kit 0.31.10`,
  and `pg 8.22.0` are the current pinned versions. No external dependency was
  added.
- GitHub Advisory CVE-2026-42349 affects `@clerk/backend` through 3.2.13;
  pinned 3.15.0 is outside the affected range.

## Live Clerk onboarding evidence

A real Clerk development instance was exercised locally on 2026-08-02 with the
repository-supported Node.js 24 runtime. The live flow proved that an opaque
Annotasi Finance application session reaches `/onboarding`, the operator CLI
issues a one-time invitation for the same provider-verified email, the backend
resolves that verified email through Clerk metadata, and browser redemption
commits the Workspace-ready outcome.

The observed postcondition query returned exactly one local User, one private
Workspace, one Account, one starter Account, one consumed invitation, and one
onboarding idempotency result. The UI returned the minimal already-onboarded
Workspace-ready state. No raw email, invitation token, cookie, CSRF token, Clerk
identifier, or database credential is recorded in this evidence.

Deterministic Testcontainers evidence remains the authority for concurrent
races, failpoint rollback/retry, idempotent replay/conflict, and cross-Workspace
Isolation Gate certification. The repeatable local steps and starter Account
field semantics are documented in
`docs/implementation/IAM_002_ONBOARDING_TESTING_GUIDE.md`.
