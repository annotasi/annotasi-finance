# Account Management Register

## Scope

Session 29 / `SLICE-ACC-001`: Account create, list, rename, archive, restore,
and delete-eligibility evaluation, extending the IAM-002 Account baseline. It
stops before Opening Balance/effective-date correction, Account Type editing,
negative balances, Category, Dedicated Fund, Debt Record, Financial Event,
reporting, and every later slice.

## First correction pass

A follow-up correction pass on the same uncommitted `SLICE-ACC-001` working
tree closed eight gaps found in review, without starting any later slice:

1. Split the single `accounts_private_workspace` RLS policy into explicit
   SELECT/INSERT/UPDATE policies; the INSERT policy now enforces Total =
   Unallocated = Opening Balance, active lifecycle, no `archived_at`, and
   `version = 1` as a database-level `WITH CHECK`, and a permanent
   `unallocated_balance <= total_balance` check was added.
2. Account IDs are validated as strict UUIDs, and `expectedVersion` as a
   bounded positive BIGINT string, before either reaches the store — malformed
   input now returns `ACCOUNT_REQUEST_INVALID` (400) with no PostgreSQL
   `22P02` path and no database error text.
3. `accountVersionSchema` now rejects `0`, negative, fractional, exponent,
   leading-zero, and above-BIGINT-maximum or excessively long digit strings.
4. Added a real IAM-002→ACC-001 migration-upgrade test: applies only
   migrations 0000-0002, seeds a representative starter Account, applies
   0003, and verifies every starter Account fact is preserved.
5. Added a complete isolation/context evidence matrix: cross-Workspace direct
   `UPDATE` denial for rename/archive/restore, A cannot restore B's archived
   Account, malformed/empty/no-context write denial, and genuine forced
   single-physical-connection (`max: 1`) reuse across a rolled-back Workspace
   A transaction and a committed Workspace B transaction.
6. Added a generated fast-check property test over lifecycle/action
   sequences (rename, archive, restore, delete-eligibility evaluation,
   stale-version mutation attempts) using a schema-valid Account-name
   arbitrary, asserting every invariant and identity fact at each step.
7. Added comprehensive log-safety sentinels (Account ID, name, all three
   balances, effective date, User ID, Workspace ID, external subject,
   session/CSRF material) and real URL redaction
   (`apps/api/src/observability/request-log-redaction.ts`) so dynamic Account
   IDs never reach a log line, proven by asserting the redaction placeholder
   is present rather than merely excluding request logs from the check.
8. Documentation corrected to match all of the above (this file and
   `README.md` only).

## Second correction pass (this session)

A final correction pass on the same uncommitted working tree closed four
further gaps found in review, without starting any later slice:

1. `AccountStore.evaluateDeleteEligibility` no longer hard-codes
   `hasOtherDependency = false`. It now checks
   `EXISTS (SELECT 1 FROM onboarding_idempotency WHERE account_id = $1)` —
   a real, currently-existing Account dependency (`onboarding_idempotency.
account_id`, `ON DELETE RESTRICT`) — inside the existing Account
   transaction context, scoped by the pre-existing
   `onboarding_idempotency_own_user` RLS policy. Only existence is checked;
   no idempotency key, request fingerprint, User ID, email, or invitation
   token is ever read, and no grant or policy was broadened. The IAM-002
   starter Account therefore now correctly evaluates as **not eligible**
   (`DEPENDENCY_EXISTS`) even though its Opening Balance is Rp0; a
   dependency-free additional Account with Opening Balance Rp0 remains
   eligible.
2. `accounts_archived_at_consistency` now also requires `total_balance = 0`
   on the archived branch, enforced by PostgreSQL itself — not only by
   `AccountStore`'s own conditional `UPDATE`.
3. `AccountService.rename` no longer maps every schema failure to
   `ACCOUNT_NAME_INVALID`. A failure is `ACCOUNT_NAME_INVALID` only when
   every validation issue is on the `name` field; any invalid
   `expectedVersion` (zero, negative, fractional, exponent, leading-zero,
   above-BIGINT, or excessively long) or extra immutable/authority field now
   correctly returns `ACCOUNT_REQUEST_INVALID`, and `AccountStore` is never
   called when validation fails.
4. Documentation corrected to match all of the above (this file and
   `README.md` only).

## Sources loaded

Complete reads: `CLAUDE.md`, `docs/project/PROJECT_STATE.md`,
`docs/implementation/MVP_IMPLEMENTATION_PLAN.md`,
`docs/architecture/ARCHITECTURE_BASELINE.md`,
`docs/implementation/DATABASE_FOUNDATION_REGISTER.md`,
`docs/implementation/IDENTITY_SESSION_REGISTER.md`,
`docs/implementation/ONBOARDING_ISOLATION_REGISTER.md`,
`docs/implementation/IAM_002_ONBOARDING_TESTING_GUIDE.md`. Targeted reads:
`docs/product/ANNOTASI_FINANCE_MVP_PRD.md`, `docs/domain/UBIQUITOUS_LANGUAGE.md`,
`docs/domain/DOMAIN_CONCEPT_MODEL.md`, `docs/domain/DOMAIN_BEHAVIOR_CATALOG.md`,
`docs/domain/DOMAIN_DECISION_REGISTER.md`,
`docs/domain/EXECUTABLE_DOMAIN_SPECIFICATION.md`.

## Existing IAM-002 Account baseline

`0002_onboarding_isolation.sql` created `accounts` with `id`, `workspace_id`,
`name`, `type`, `opening_balance`, `opening_balance_effective_date`,
`total_balance`, `unallocated_balance`, `lifecycle_status` (hard-pinned to
`'active'`), `is_starter`, `created_at`. Two CHECK constraints forced
`total_balance = opening_balance` and `unallocated_balance = opening_balance`
permanently. `annotasi_application` had `SELECT, INSERT` only — no `UPDATE`,
no `DELETE`.

## Migration (`0003_account_management.sql`)

Generated via `drizzle-kit generate` against the updated
`database/schema/onboarding.ts`, then hand-extended with the reviewed
grant/comment additions (matching the 0001/0002 pattern):

- dropped `accounts_opening_initializes_total` and
  `accounts_opening_initializes_unallocated` (the equality-to-opening pins);
- dropped and replaced `accounts_lifecycle` — now
  `CHECK (lifecycle_status IN ('active', 'archived'))` instead of pinning to
  `'active'` only;
- added `accounts_nonnegative_total` and `accounts_nonnegative_unallocated`
  (`>= 0`), preserving the existing `accounts_nonnegative_opening`;
- added `updated_at timestamptz NOT NULL DEFAULT now()`;
- added `archived_at timestamptz NULL`, with
  `accounts_archived_at_consistency` requiring `archived_at IS NULL` iff
  `lifecycle_status = 'active'`, and (**second correction pass**)
  `total_balance = 0` whenever `lifecycle_status = 'archived'`, enforced by
  PostgreSQL itself in addition to `AccountStore`'s own conditional
  `UPDATE`;
- added `version bigint NOT NULL DEFAULT 1`, with `accounts_version_positive`
  (`>= 1`);
- `GRANT UPDATE (name, lifecycle_status, archived_at, updated_at, version) ON
TABLE accounts TO annotasi_application` — no grant on `opening_balance`,
  `total_balance`, `unallocated_balance`, `type`, or
  `opening_balance_effective_date`; no `DELETE` grant, ever;
- added a permanent `accounts_unallocated_le_total` CHECK
  (`unallocated_balance <= total_balance`), which stays valid once Account-
  Backed Fund Allocation can reduce Unallocated while preserving Total;
- **(correction pass)** dropped the single `accounts_private_workspace`
  policy and replaced it with three explicit policies —
  `accounts_select_private_workspace` (SELECT),
  `accounts_insert_private_workspace` (INSERT), and
  `accounts_update_private_workspace` (UPDATE), each still scoped by the same
  Workspace/owner condition. The INSERT policy's `WITH CHECK` additionally
  requires `total_balance = opening_balance`,
  `unallocated_balance = opening_balance`, `lifecycle_status = 'active'`,
  `archived_at IS NULL`, and `version = 1`, so the application role cannot
  insert an Account that violates ACC-001's creation invariants even via
  direct SQL bypassing `AccountStore`. No DELETE policy exists;
- updated table comment.

Deliberately **not** added: `deleted_at`, a permanent-deletion state, Account
Type change history, correction tables, Financial Event/Category/Fund/Debt
references, or a `total_balance = unallocated_balance` constraint (which would
block a later Account-Backed Fund Allocation slice from ever holding
`total > unallocated`).

## Account lifecycle representation

`lifecycle_status: 'active' | 'archived'` — no third Account-level state.
Trash/soft-deletion is Financial-Event-specific machinery per
`docs/domain/UBIQUITOUS_LANGUAGE.md` and does not apply to Account. The
Executable Domain Specification's lifecycle table (`§20`) explicitly allows
AC-05 delete-eligibility evaluation from either `Active` or `Archived` —
no "must be Archived first" rule exists, and none was invented.

## Exact Account fields

`id`, `workspace_id`, `name`, `type`, `opening_balance`,
`opening_balance_effective_date`, `total_balance`, `unallocated_balance`,
`lifecycle_status`, `is_starter`, `created_at`, `updated_at`, `archived_at`,
`version`.

**Immutable after creation:** `id`, `workspace_id`, `type`, `opening_balance`,
`opening_balance_effective_date`. Rename changes only `name`. Archive/restore
change only `lifecycle_status`, `archived_at`, `updated_at`, `version`.

## Create behavior

Requires name (1–100 chars, no control characters), one fixed Account Type,
non-negative whole-Rupiah Opening Balance (validated against the exact
`BIGINT` maximum `9223372036854775807`), and a real calendar date-only
effective date. Establishes stable identity, lifecycle `active`,
`total_balance = unallocated_balance = opening_balance`, zero allocations
(no allocation table exists yet), no Financial Event/Income row, and
`version = 1`. Duplicate names across Accounts are accepted (no uniqueness
constraint), matching DEC-NAME-01/04.

## Rename behavior

Accepts any non-deleted Account, including an Archived one (no lifecycle
restriction in the domain rule). Preserves identity, Workspace, Account Type,
Opening Balance, Effective Date, Total/Unallocated Balance, and lifecycle
state; updates only `name`, `updated_at`, and increments `version`.

## Archive rule

Requires `lifecycle_status = 'active'` AND `total_balance = 0`, checked
atomically in one conditional `UPDATE ... WHERE version = $expected AND
lifecycle_status = 'active' AND total_balance = 0`. Rejection codes:
`ACCOUNT_NOT_ACTIVE`, `ACCOUNT_ARCHIVE_BALANCE_NON_ZERO`, `ACCOUNT_CONFLICT`
(stale version) — checked in that precedence order once the account is found
and the version matches. The Indonesian rejection message states the Account
still has a remaining balance and never claims confirmation can override the
rule. **(second correction pass)** `total_balance = 0` for every Archived
Account is enforced twice, independently: by `AccountStore`'s own conditional
`UPDATE` above, and permanently by the `accounts_archived_at_consistency`
CHECK constraint at the PostgreSQL level, so even a direct SQL `UPDATE`
bypassing `AccountStore` cannot archive a non-zero-balance Account.

## Restore rule

Requires `lifecycle_status = 'archived'`. Reactivates the same row, clears
`archived_at`, updates `updated_at`, increments `version`. No recalculation
(none exists yet — no Financial Event).

## Deletion-eligibility rule

`eligible = (opening_balance == 0) AND no Financial Event history AND no
other dependency`. **(second correction pass)** The Financial Event history
check remains a vacuous fact (`false`) because no Financial Event/allocation
table exists yet in this slice's schema — that part of the claim still
stands. The dependency check, however, is **not** vacuous: IAM-002's
`onboarding_idempotency.account_id` (`ON DELETE RESTRICT`) is a real,
currently-existing Account dependency, and `evaluateDeleteEligibility` checks
its existence directly (see "Second correction pass" above). Consequently:

- the IAM-002 starter Account has Opening Balance Rp0 but a real onboarding
  dependency, so it is **not eligible** (`DEPENDENCY_EXISTS`) while that
  dependency exists — this is not a hard-coded `is_starter` rule, it is a
  fact evaluated from persisted `onboarding_idempotency` data, so a future
  slice that removes or supersedes that dependency changes the answer
  without any code change here;
- an additionally created zero-balance Account, which has no
  `onboarding_idempotency` row, is eligible;
- a non-zero-balance Account is ineligible for its Opening Balance alone,
  independent of dependency status.

The query boundary (`evaluateDeleteEligibility`) remains isolated so a later
slice can add a Financial Event dependency check here before permanent
deletion is ever implemented. Lifecycle state (Active vs. Archived) is
**not** a determining condition, per the Executable Domain Specification's
lifecycle table. This evaluation never mutates state and never authorizes
deletion.

## No-delete guarantee

No DELETE HTTP route exists on the Account controller. `annotasi_application`
has no `DELETE` grant on `accounts` (proven by
`database/test/account.integration.test.ts`). No Account row is ever
physically removed by this slice.

## RLS and privileges

**(correction pass)** The single `accounts_private_workspace` forced-RLS
policy is split into three explicit command-scoped policies —
`accounts_select_private_workspace`, `accounts_insert_private_workspace`,
`accounts_update_private_workspace` — each still gated by the same
transaction-local `app.workspace_id`/`app.user_id` context matched against
the owning Workspace. The INSERT policy's `WITH CHECK` additionally proves
Account-creation facts at the database boundary (Total = Unallocated =
Opening, active, no `archived_at`, `version = 1`), closing a gap where the
table-level INSERT grant plus the old all-command policy's Workspace-only
check would have let the application role insert an Account violating AC-01
via direct SQL. No DELETE policy exists. `AccountStore` reuses the exact
IAM-002 `setLocal`/`resolve_private_workspace_context` context-setting
mechanism, extracted into a shared `database/src/runtime/workspace-context.ts`
module (also refactored into `OnboardingStore` to remove the prior
duplication).

## Strict ID and version validation

**(correction pass)** Account IDs are validated with `accountIdSchema`
(`z.string().uuid()`, exported from `@annotasi/contracts`) inside
`AccountService.parseAccountId` before rename, archive, restore, or
delete-eligibility evaluation ever calls `AccountStore`. A malformed ID
returns `ACCOUNT_REQUEST_INVALID` (400) with a safe Indonesian message and
never reaches PostgreSQL, so no `22P02` error path or database error text can
leak. `accountVersionSchema` now requires `^[1-9]\d*$`, capped at 19 digits
(the PostgreSQL BIGINT maximum's digit count) with a string-lexicographic
bound check against `9223372036854775807` — rejecting `0`, negative,
fractional, exponent-notation, leading-zero, above-maximum, and excessively
long digit strings without ever converting an unbounded string to `BigInt`.
The same schema gates `expectedVersion` on rename/archive/restore.

## Server-derived Workspace authority

`opaque application session → external subject → local User → owned
Workspace → transaction-local app.user_id/app.workspace_id`, identical to
IAM-002. The browser never supplies Workspace/User/Owner authority; every
Account request/response schema is `.strict()` and rejects any such field
(400), including the mutation-payload cases like `type` on a rename.

## Concurrency mechanism

Optimistic version (`version bigint NOT NULL DEFAULT 1`), enforced via
conditional `UPDATE ... WHERE id = $1 AND version = $expected [AND ...state
checks]`. Zero rows affected → a follow-up `SELECT` (still RLS-scoped)
distinguishes not-found vs. stale-version vs. wrong-lifecycle-state, in that
precedence. No process-local mutex; PostgreSQL's own row-level locking during
the conditional `UPDATE` makes two concurrent requests against the same row
serialize deterministically — the first to commit wins, the second observes
its `expectedVersion` no longer matches and receives `ACCOUNT_CONFLICT`. The
browser reloads Account state after any conflict rather than guessing.

## API surface

`GET /accounts`, `POST /accounts`, `PATCH /accounts/:id` (rename),
`POST /accounts/:id/archive`, `POST /accounts/:id/restore`,
`GET /accounts/:id/delete-eligibility`. All require the existing opaque
`SessionGuard`; all four mutating routes additionally require
`OriginCsrfGuard` (Origin allowlist + double-submit CSRF + JSON content-type).
No DELETE route. Safe codes: `ACCOUNT_SCOPE_REJECTED`, `ACCOUNT_NOT_FOUND`,
`ACCOUNT_NAME_INVALID`, `ACCOUNT_CREATE_INVALID`, `ACCOUNT_REQUEST_INVALID`,
`ACCOUNT_NOT_ACTIVE`, `ACCOUNT_NOT_ARCHIVED`,
`ACCOUNT_ARCHIVE_BALANCE_NON_ZERO`, `ACCOUNT_CONFLICT`. (`ACCOUNT_DELETE_NOT_ELIGIBLE`
from the original prompt's example list is not surfaced as a thrown code in
this slice: there is no delete action to reject against, since eligibility is
returned inline as `{ eligible: false, reasonCodes: [...] }` rather than as an
HTTP error. It remains available to a future permanent-deletion slice.)
**(second correction pass)** On rename, `ACCOUNT_NAME_INVALID` is returned
only when every validation issue is on the `name` field; a malformed
`expectedVersion` or any extra immutable/authority field returns
`ACCOUNT_REQUEST_INVALID` instead, and `AccountStore` is never called in
either failure case.

## Logging behavior

**(correction pass, accurate as of this session)** ACC-001 source code
(`apps/api/src/account/*.ts`, `database/src/runtime/account-store.ts`) emits
**no structured Account lifecycle log lines of its own** — there is no
`logger.info`/`logger.warn`/`console.*` call anywhere in the Account
controller, service, or store. `apps/api/src/main.ts` constructs its
`FastifyAdapter` with no `logger` option at all, so Fastify's own default
(`logger: false`) means request logging is already fully disabled in
production; this is not a new change, it is the pre-existing state, recorded
here so it is not silently assumed. The only logging surface that exists at
all is Fastify's generic built-in HTTP request/response log, which the test
suite deliberately enables (only inside `apps/api/test/account.integration.test.ts`)
to prove log safety. That built-in log line writes the raw request URL by
default, which would otherwise include the dynamic Account ID for every
`/accounts/:id` route. `apps/api/src/observability/request-log-redaction.ts`
exports `redactRequestUrl`, a real, reusable, production-importable string
transform (not a test-only trick) that replaces UUID-shaped path segments
with `[id]`; the test wires it into the Fastify logger's `req` serializer and
keeps request logging genuinely enabled and captured — it does not disable or
exclude request logs from the safety check, and the test explicitly asserts
the `[id]` placeholder appears in the captured output, so the assertions
cannot pass vacuously against an empty log.

## Frontend

`/accounts` (Indonesian-first, mobile-first, keyboard-accessible): lists
Active/Archived sections, a create form (Nama akun/Jenis akun/Saldo awal/
Tanggal saldo awal), per-Account inline rename, archive/restore buttons, and
a "Cek kelayakan hapus" action that displays eligibility text without ever
offering a delete control. The onboarding "Lanjutkan" button now routes to
`/accounts` instead of `/session`. Reuses the existing shadcn Button/Input/
Label/Card/Alert components and the existing onboarding validation regex
patterns — no new shadcn component was added. New `apps/web/lib/format.ts`
provides `formatIDR`/`formatDateOnly` via pure string manipulation (no
Number/parseFloat), avoiding precision loss above
`Number.MAX_SAFE_INTEGER` and timezone-shift risk on date-only values.

## Property evidence for INV-ACC-01–03

`apps/api/test/account.service.test.ts` (fast-check, in-memory store double
reproducing `AccountStore`'s exact version/lifecycle semantics): generates
Opening Balances across the full `BIGINT` range and every Account Type,
proving Total = Unallocated = Opening ≥ Rp0 at creation and the zero-
allocation form of INV-ACC-03 (`Total = Unallocated + 0`); generated-name
rename preserves every financial/date/type fact; duplicate names accepted;
zero-total archive succeeds and preserves facts; non-zero archive rejected
and preserves Active state; restore preserves facts; repeated invalid
(stale-version) operations preserve confirmed state; delete-eligibility never
mutates state. **(correction pass)** A further generated property test drives
sequences of up to 15 rename/archive/restore/delete-eligibility/stale-version
actions (using a schema-valid `accountNameArbitrary` built from an allowed
character set rather than sanitizing arbitrary strings that could still
contain control characters) against an Account created with an arbitrary
opening balance and Type, asserting at every step: Total ≥ Rp0, Unallocated ≥
Rp0, Total = Unallocated + 0, identity/Type/Opening Balance/Effective Date
unchanged, and that every rejected action (wrong lifecycle state or stale
version) leaves the prior confirmed state — verified via a fresh `list()`
call — completely unchanged. All property runs use `@fast-check/vitest`'s
default run count; a failure reports its shrunk counterexample and seed
automatically. **(second correction pass)** `FakeAccountStore` was corrected
to reproduce the real onboarding-dependency fact (via a `seedStarterAccount`
test-setup helper, proxied by `isStarter`) instead of hard-coding
`hasOtherDependency = false`; dedicated tests now cover a starter Account's
ineligibility, and 20 further tests (56 total in this file) cover
`ACCOUNT_NAME_INVALID` vs. `ACCOUNT_REQUEST_INVALID` classification for
malformed `expectedVersion` values and extra fields on rename/archive/
restore, each confirming the Account's state is unchanged after rejection.

## Migration evidence

`database/test/migration.integration.test.ts` (updated for the new
migration count): empty-database replay now applies all 4 migrations;
repeated migration command is a tracked no-op; a second fresh database
replays the complete 4-migration history identically.

## Migration-upgrade evidence

**(correction pass)** `database/test/account.integration.test.ts` includes a
real IAM-002→ACC-001 upgrade test, not a hand-rebuilt imitation of the old
schema: it constructs a migrations folder trimmed to journal entries with
`idx <= 2` (migrations 0000-0002 only), applies it to a fresh database via
drizzle's own `migrate()`, seeds a representative starter Account (User,
private Workspace, Account) using the exact IAM-002 column set via the admin
(RLS-bypassing) connection, records its facts, then applies migration 0003
through the ordinary `runMigrations` helper. It verifies the upgraded row has
the same Account ID, Workspace ID, name, Type, Opening Balance, Effective
Date, Total, and Unallocated Balance; lifecycle `active`; `archived_at`
`NULL`; `version = 1`; `relforcerowsecurity` still `true`; and that the
application role can list and rename the upgraded Account through the
ordinary `AccountStore` runtime path.

## PostgreSQL evidence

`database/test/account.integration.test.ts` (23 tests, Testcontainers
`postgres:17.10-alpine3.24`): starter-Account list/rename/identity
preservation; zero/positive/duplicate-name/above-safe-integer creation;
invalid-fact rejection at the DB boundary (type/negative/empty-name);
confirmation that the equality-to-opening constraints are genuinely gone;
the split INSERT policy accepting a valid creation and rejecting mismatched
total/unallocated, archived-at-creation, and wrong-version payloads
(`42501`), plus a permanent-CHECK rejection of unallocated greater than
total (`23514`); zero-total archive and non-zero rejection; restore-as-
same-row and repeated-invalid-transition rejection; **(second correction
pass)** real onboarding-dependency delete eligibility across all three
outcomes (starter/dependent Rp0 → ineligible with `DEPENDENCY_EXISTS`;
additional dependency-free Rp0 → eligible; additional non-zero → ineligible
with `OPENING_BALANCE_NOT_ZERO`), confirmed read-only; **(second correction
pass)** a dedicated restricted-role test proving the
`accounts_archived_at_consistency` CHECK itself (not just `AccountStore`)
rejects a direct own-Workspace archive of a non-zero Account (`23514`,
Active state preserved) and accepts the identical update on a zero-balance
Account; no DELETE privilege; no balance/type column UPDATE privilege;
no/empty/malformed-context read **and write** denial; Workspace A/B
isolation including guessed IDs across every operation (rename, archive,
restore, delete-eligibility) and scope-rejected pre-onboarding access;
cross-Workspace direct `UPDATE` denial for rename/archive/restore and proof
that A cannot restore B's archived Account; a dedicated `max: 1` pool
proving true single-physical-connection reuse across a rolled-back
Workspace A transaction, a committed Workspace B transaction, and a final
no-context transaction that sees zero rows and cannot write; the real
IAM-002→ACC-001 migration-upgrade test; and concurrent rename/archive/
restore/rename-vs-archive races each resolving to exactly one accepted
outcome and one deterministic rejection with no duplicate Account and no
negative value ever produced.

## API/security evidence

`apps/api/test/account.integration.test.ts` (11 tests, real NestJS/Fastify +
Testcontainers): unauthenticated/forged/Bearer-only rejection; Workspace-
scoped listing; Origin/CSRF/content-type enforcement; client-authority-field
rejection on create; immutable-field rejection on rename; safe Indonesian
non-zero-archive rejection; stale-version conflict; foreign rename/archive
denial (404, no cross-Workspace existence leak); read-only eligibility
evaluation (the onboarding-created Account correctly reports `eligible:
false` with `DEPENDENCY_EXISTS`); absence of a DELETE route; a malformed
Account ID returning `ACCOUNT_REQUEST_INVALID` (400) across all four dynamic
route categories (rename, archive, restore, delete-eligibility) with no
`22P02`/database error text in the message; **(second correction pass)** a
malformed `expectedVersion` (`0`, `01`, `1.5`, `1e3`, above-BIGINT-maximum,
and an excessively long digit string) on rename, archive, and restore each
returning `ACCOUNT_REQUEST_INVALID` — never `ACCOUNT_CONFLICT` and never a
database error — with the Account's name, version, and lifecycle status
confirmed unchanged afterward; and a comprehensive log-safety test that
creates an Account with sentinel name/balance/date, exercises every dynamic
`/accounts/:id` route, fetches User ID/Workspace ID directly (since neither
appears in any HTTP response), and asserts none of those values — nor
session/CSRF/subject material — ever appear in the captured request log,
while also asserting the redaction placeholder (`[id]`) IS present, proving
the check is not vacuously passing against an empty or excluded log.

## Frontend evidence

`apps/web/test/accounts-interaction.test.tsx` (11 tests): non-onboarded →
`/onboarding` redirect; unauthenticated → `/login` redirect; starter Account
display; create-form validation without a request; duplicate-submit
protection; rename keeping the same entry; zero-balance archive; non-zero-
archive actionable explanation; restore; delete-eligibility display with no
delete action ever rendered; and **(second correction pass)** an
onboarding-dependency ineligibility explanation confirmed to render in
Indonesian without the word "token", "invitation", "undangan", "email", or
"idempotency" appearing anywhere in the displayed text.

## CI job

`.github/workflows/foundation-ci.yml`'s `account-management` job (needs:
`foundation`, `database-foundation`, `identity-session`,
`onboarding-isolation`) runs `pnpm ci:acc1`, which chains `account:test`,
`account:test:integration`, `account:test:security`, and `account:test:web`
behind the existing `iam:prepare` build step. `pnpm ci` now includes
`ci:acc1`.

## Manual operator live validation (2026-08-06)

A dated manual operator live validation was performed on 2026-08-06, distinct
from the automated test suites recorded above and from the GitHub Actions CI
evidence recorded below. It used the repository-supported Node.js 24.18.1
runtime, the local PostgreSQL environment, the existing Clerk development
instance, the already-onboarded private Workspace, the local Next.js web
application, and the local NestJS/Fastify API. This section records manual
operator live validation outcomes only; it is not an automated test run, and
it does not replace or get counted within the automated total recorded below.

### Runtime and identity

- the web, API, PostgreSQL, and Clerk development runtime were all available
  and reachable;
- the authenticated User could open `/accounts`;
- the existing IAM-002 starter Account was listed;
- earlier missing local `.env` files and a ClerkJS loading issue observed
  while restoring the local environment were confirmed to be local
  environment restoration matters, not an ACC-001 source-code defect — no
  ACC-001 source file was changed to resolve them;
- the API and web processes ran on Node.js 24, matching the repository's
  supported runtime.

### Account management

- the starter Account could be renamed, and the renamed value persisted
  after a browser refresh;
- Account data persisted across an API process restart;
- creating an additional Account succeeded;
- a zero-opening-balance Account could be created;
- a positive-opening-balance Account could be created;
- duplicate Account names were accepted, matching DEC-NAME-01/04;
- a zero-total-balance Account could be archived;
- the archived Account could be restored as the same Account (same identity,
  not a new row);
- attempting to archive a non-zero-balance Account was blocked;
- the rejection did not offer any way to override the zero-balance archive
  rule.

### Delete eligibility

- the starter Account's deletion eligibility was blocked by its real
  onboarding dependency, matching the automated evidence above;
- a dependency-free additional Account with Opening Balance Rp0 was
  evaluated as eligible;
- a non-zero-opening-balance Account was evaluated as ineligible;
- eligibility evaluation remained read-only in every observed case — no
  Account state changed as a result of evaluating eligibility;
- no permanent-delete action was exposed anywhere in the manually exercised
  UI. Whether an Account DELETE HTTP route, RLS DELETE policy, or
  application-role DELETE grant exists is not something manual browser
  observation can prove; that is repository/schema/automated evidence — see
  "No-delete guarantee" above and the automated evidence below.

### Immutable fields and scope boundary

- Account Type was not editable in the manually exercised UI;
- Opening Balance was not editable in the manually exercised UI;
- Opening-Balance Effective Date was not editable in the manually exercised
  UI;
- no Category, Dedicated Fund, Debt Record, Financial Event, dashboard, or
  reporting behavior appeared anywhere in the manually exercised
  application;
- no `SLICE-ACC-002` or later-slice behavior was introduced or observed.

### Database aggregate validation

Database aggregate validation passed a safe, non-sensitive aggregate query
against the manual-validation database state, finding:

- exactly one starter Account existed;
- no archived Account had a non-zero Total Account Balance;
- no Account had a negative Total Account Balance or Unallocated Amount;
- no Account had Unallocated Amount greater than Total Account Balance;
- after the manually tested Account was restored, no Account remained in the
  archived lifecycle state.

The total Account count observed depends on locally created manual-test data
and is not recorded here as a permanent invariant.

No Account name, balance, personal financial amount, Account ID, User ID,
Workspace ID, Clerk subject, email, invitation token, session cookie, CSRF
token, database password, or environment-secret value is recorded by this
register.

## Automated and GitHub Actions evidence after local runtime restoration

The local container runtime used by the Testcontainers-based automated
suites was unavailable earlier in this session (`Could not find a working
container runtime strategy`). This was a transient local container-runtime
availability issue, not a source-code defect, and was resolved before final
acceptance by restoring the local container runtime. Once restored, four
distinct execution contexts each passed, and are recorded separately here
rather than as one merged claim:

- **Local command — `pnpm ci:acc1`:** run locally by the operator (not a
  GitHub Actions job itself), this command chains `account:test`,
  `account:test:integration`, `account:test:security`, and
  `account:test:web` and passed as an automated test run on the operator's
  machine, exercising the targeted Testcontainers suites
  (`account:test:integration`, `account:test:security`);
- **Local command — `pnpm run ci`:** run locally by the operator (also not a
  GitHub Actions job itself), this broader aggregate command includes
  `ci:acc1` alongside the Foundation, database, identity/session, and
  onboarding/isolation suites, and passed on the operator's machine, together
  with production web/API builds and a dependency audit reporting no high- or
  critical-severity vulnerability;
- **GitHub Actions — Pull Request:** the `.github/workflows/foundation-ci.yml`
  `account-management` job passed on the Pull Request run;
- **GitHub Actions — post-merge `dev`:** the same `account-management` job
  passed again on the post-merge `dev` run.

The reviewed automated total remains unchanged at **124 Account-specific
tests**: 23 contract, 56 API unit/property, 23 PostgreSQL/RLS/concurrency,
11 API/security integration, and 11 frontend interaction tests. The manual
operator live validation above is additional, distinct evidence layered on
top of — never merged into — this automated total.

## Explicit exclusions

Permanent Account deletion, DELETE endpoint/grant, Opening Balance
correction, Opening-Balance Effective Date correction, Impact Preview,
chronological recalculation, Account Type edit, negative balances,
credit-card/liability Accounts, Category, Dedicated Fund, Account-Backed Fund
Allocation, Debt Record, Financial Event, Income, Expense, Transfer, Fund
Allocation, Fund Release, Debt Repayment, dashboard, reporting, collaboration,
deployment, billing, `SLICE-ACC-002`, `SLICE-ACC-003`, `SLICE-CAT-001`, and
every later slice.

## Reconsideration triggers

Re-review this baseline if: a future Financial Event slice needs a different
concurrency mechanism than the current conditional-UPDATE/version-conflict
pattern; the current zero-allocation INV-ACC-03 proof needs extension once
Account-Backed Fund Allocation exists; the `ACCOUNT_DELETE_NOT_ELIGIBLE` code
needs to be surfaced once a permanent-deletion endpoint is ever implemented;
or a future live validation run surfaces a behavior this register does not
yet record. The 2026-08-06 manual operator live validation recorded above
found no such new behavior.
