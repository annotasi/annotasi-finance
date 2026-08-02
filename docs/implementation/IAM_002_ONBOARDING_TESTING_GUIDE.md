# IAM-002 Private Beta Onboarding: Live Testing and Field Guide

## 1. Purpose

This guide explains how to validate `SLICE-IAM-002` locally and how to choose
the starter Account values shown on `/onboarding`.

IAM-002 does not create a dashboard or financial events. Its purpose is to
establish the minimum trusted product boundary for one verified and entitled
person:

1. map the verified Clerk subject to one local User;
2. consume one Private Beta invitation;
3. create exactly one private Single-Owner Workspace;
4. create exactly one starter Account;
5. persist one idempotent onboarding outcome; and
6. activate server-derived Workspace scope protected by forced PostgreSQL RLS.

The accepted result is atomic: either all of these records become confirmed or
none of them does.

## 2. What onboarding is not

Onboarding is not:

- a shared-Workspace invitation;
- a household or collaboration feature;
- an Income, Expense, Transfer, Fund Allocation, Fund Release, or Debt
  Repayment;
- a Category, Dedicated Fund, Debt Record, or Financial Event creation flow;
- a dashboard setup wizard; or
- a mechanism for the browser to choose its own User or Workspace authority.

The Private Beta invitation grants access to create one private Workspace. It
does not add the invited person to another person's Workspace.

## 3. Prerequisites

Use the repository-supported runtime:

```bash
export PATH="$(brew --prefix node@24)/bin:$PATH"
hash -r

node --version
pnpm --version
```

Expected major/tooling versions:

```text
Node.js 24.x
pnpm 11.19.0
```

The following ignored local files must already exist and contain the local
Clerk and PostgreSQL configuration:

```text
apps/web/.env.local
apps/api/.env.local
infra/local/.env
```

Never print, paste into chat, commit, or screenshot:

- Clerk secret keys;
- invitation tokens;
- application-session cookies;
- CSRF tokens;
- verification codes;
- full database URLs; or
- full Clerk User/session identifiers.

## 4. Start the local runtime

Use three terminals.

### Terminal 1 — PostgreSQL

```bash
cd /Users/farahananda/Documents/project/ai-annotasi/annotasi-finance
export PATH="$(brew --prefix node@24)/bin:$PATH"

pnpm db:up
pnpm db:migrate
pnpm db:verify
```

### Terminal 2 — API

```bash
cd /Users/farahananda/Documents/project/ai-annotasi/annotasi-finance
export PATH="$(brew --prefix node@24)/bin:$PATH"

pnpm --filter @annotasi/api dev
```

The health endpoint must return `200`:

```bash
curl -i http://localhost:3001/health
```

### Terminal 3 — Web

```bash
cd /Users/farahananda/Documents/project/ai-annotasi/annotasi-finance
export PATH="$(brew --prefix node@24)/bin:$PATH"

rm -rf apps/web/.next
pnpm --filter @annotasi/web dev
```

Open:

```text
http://localhost:3000/login
```

After login, an identity without a completed Workspace should reach:

```text
http://localhost:3000/onboarding
```

## 5. Issue a Private Beta invitation

Load only the ignored local operator environment:

```bash
cd /Users/farahananda/Documents/project/ai-annotasi/annotasi-finance
export PATH="$(brew --prefix node@24)/bin:$PATH"

set -a
source infra/local/.env
set +a

test -n "$DATABASE_OPERATOR_URL" \
  && echo "DATABASE_OPERATOR_URL tersedia" \
  || echo "DATABASE_OPERATOR_URL belum tersedia"
```

Read the verified Clerk email through a shell prompt so it does not need to be
hard-coded into repository files:

```bash
read -r "INVITED_EMAIL?Masukkan email Clerk yang sudah terverifikasi: "
pnpm invite:issue -- --email "$INVITED_EMAIL"
unset INVITED_EMAIL
```

Optional explicit expiry:

```bash
read -r "INVITED_EMAIL?Masukkan email Clerk yang sudah terverifikasi: "
pnpm invite:issue -- \
  --email "$INVITED_EMAIL" \
  --expires-at 2026-08-31T17:00:00Z
unset INVITED_EMAIL
```

The command prints the raw invitation token once. Copy it directly to the
onboarding form. Only its SHA-256 hash is stored.

For safe revocation, pass the token through standard input rather than a
command-line argument:

```bash
read -rs "INVITATION_TOKEN?Invitation token: "
printf '\n'
print -r -- "$INVITATION_TOKEN" | pnpm invite:revoke
unset INVITATION_TOKEN
```

## 6. Onboarding form fields

### 6.1 Kode undangan beta

**Purpose:** proves that the verified email is entitled to enter the Private
Beta.

The API hashes the submitted token, locks the invitation row, validates its
email binding, expiry, revocation, and consumption state, then consumes it in
the same transaction that creates the User, Workspace, and starter Account.

**After success:** the token is permanently consumed and cannot be edited or
reused. It must not be stored in `localStorage`, `sessionStorage`, analytics,
logs, screenshots, or documentation.

### 6.2 Nama akun awal

**Purpose:** a human-readable label for the place where the user's money
actually or operationally resides.

Examples:

| Real situation | Suggested name |
|---|---|
| Cash carried daily | `Uang Tunai` |
| Main payroll bank account | `BCA Gaji` |
| Daily spending bank account | `Jago Harian` |
| GoPay balance | `GoPay` |
| Other asset-like money holding | `Saldo Kartu Prabayar` |

The name is a label, not the Account identity. Duplicate Account names are
allowed by the domain baseline. Account rename is planned in `SLICE-ACC-001`;
it must preserve Account identity and financial history.

### 6.3 Jenis akun

**Purpose:** describes where the money resides. Account Type is descriptive
only and does not change financial semantics.

| UI choice | Use when | Real example | Do not use for |
|---|---|---|---|
| **Tunai** (`cash`) | Physical cash is held directly | Cash in wallet, cash box | Bank or e-wallet balance |
| **Rekening Bank** (`bank_account`) | Money is held in a bank account | BCA, Mandiri, BRI, Jago | Credit-card debt |
| **Dompet Digital** (`e_wallet`) | Money is held in an e-wallet | GoPay, OVO, DANA, ShopeePay | A Dedicated Fund or savings purpose |
| **Lainnya** (`other`) | Another asset-like, money-holding balance that is not one of the three above | Prepaid balance or uncategorized cash-equivalent holding | Debt, credit-card liability, investment account |

The v1 list is fixed to these four values. IAM-002 does not provide Account
editing. The approved Account-management plan does not currently define an
Account-Type change behavior, so the selected type should be treated as bound
to the Account at creation unless a later reviewed requirement explicitly adds
such a change.

### 6.4 Saldo awal (Rupiah)

**Purpose:** records the Account's starting state at the chosen effective date.
It is not Income and does not create a Financial Event.

Rules:

- whole Rupiah only;
- zero or a positive value;
- no decimal fraction;
- no exponent notation;
- stored exactly as PostgreSQL `BIGINT`-equivalent data;
- initializes Total Account Balance and Unallocated Amount to the same value.

Examples:

| Situation | Value |
|---|---:|
| Start tracking an empty cash account today | `0` |
| Physical cash currently held is Rp350.000 | `350000` |
| Bank statement balance is Rp4.275.500 | `4275500` |
| GoPay balance is Rp82.750 | `82750` |

Do not enter separators such as `4.275.500`, currency text, or decimals. Enter
`4275500`.

IAM-002 does not allow editing this value after onboarding. A reviewed
correction flow is planned later:

- `SLICE-ACC-002`: correction when no dependent Financial Event history exists;
- `SLICE-ACC-003`: correction after later Income/Expense history exists.

Those corrections require Impact Preview, invariant validation, atomic
recalculation, and preservation of the prior confirmed state when a proposal is
invalid.

### 6.5 Tanggal saldo awal

**Purpose:** defines the date from which the Opening Balance is true. It is a
business date in the fixed Workspace timezone `Asia/Jakarta`, not a timestamp.

Examples:

| Situation | Date to use |
|---|---|
| The value entered is the balance observed today | Today's Jakarta date |
| Starting records from the beginning of the month using the balance as of that day | The first day of that month |
| Starting from zero on the day a new account was opened | The account-opening date |

Later Financial Events must not precede the relevant Account effective date.
Choose the date carefully; it is part of the Account's historical starting
point.

IAM-002 does not allow editing the date. Correction follows the same later
`SLICE-ACC-002` and `SLICE-ACC-003` rules as Opening Balance and must use Impact
Preview and full affected-history validation.

## 7. Complete the live onboarding smoke test

Use one consistent example:

```text
Kode undangan beta : token from invite:issue
Nama akun awal      : BCA Gaji
Jenis akun          : Rekening Bank
Saldo awal          : 4275500
Tanggal saldo awal  : the Jakarta date represented by that balance
```

Click **Buka Workspace pribadi**.

Expected result:

```text
Workspace pribadi dan akun awal Anda sudah siap.
```

The resulting state must contain exactly:

- one local User mapping for the Clerk subject;
- one private Workspace owned by that User;
- one starter Account;
- one consumed invitation; and
- one confirmed onboarding idempotency result.

No Category, Dedicated Fund, Debt Record, or Financial Event is created.

## 8. Persistence and duplicate-prevention checks

Refresh `/onboarding`. It must remain in the minimal Workspace-ready state and
must not ask for the invitation again.

Restart only the API:

```text
Ctrl+C
```

Then:

```bash
pnpm --filter @annotasi/api dev
```

Refresh `/onboarding` again. The Workspace-ready state must persist and no
second Workspace or starter Account may be created.

Idempotency, same-token races, same-subject races, rollback retry, and
cross-Workspace isolation are certified by the Testcontainers-backed
`pnpm ci:iam2` suite. Do not repeatedly expose a real invitation token merely
to recreate concurrency tests manually.

## 9. Safe database verification

For a clean local database with one completed onboarding:

```bash
docker compose \
  --env-file infra/local/.env \
  -f infra/local/compose.yml \
  exec -T postgres \
  psql \
  -U annotasi_admin \
  -d annotasi_finance_local \
  -c "
    SELECT
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT COUNT(*) FROM workspaces) AS workspaces,
      (SELECT COUNT(*) FROM accounts) AS accounts,
      (
        SELECT COUNT(*)
        FROM accounts
        WHERE is_starter = true
      ) AS starter_accounts,
      (
        SELECT COUNT(*)
        FROM private_beta_invitations
        WHERE consumed_at IS NOT NULL
      ) AS consumed_invitations,
      (
        SELECT COUNT(*)
        FROM onboarding_idempotency
      ) AS idempotency_results;
  "
```

Expected:

```text
users                 1
workspaces            1
accounts              1
starter_accounts      1
consumed_invitations  1
idempotency_results   1
```

Confirm that later-slice tables do not exist:

```bash
docker compose \
  --env-file infra/local/.env \
  -f infra/local/compose.yml \
  exec -T postgres \
  psql \
  -U annotasi_admin \
  -d annotasi_finance_local \
  -c "
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename IN (
        'categories',
        'dedicated_funds',
        'debt_records',
        'financial_events'
      )
    ORDER BY tablename;
  "
```

Expected: `0 rows`.

Do not query or copy raw token hashes, complete external subjects, complete
provider identifiers, session cookies, or invited email values into shared
evidence.

## 10. Final automated gate

After any documentation or CLI correction, run the entire supported gate again
under Node 24:

```bash
export PATH="$(brew --prefix node@24)/bin:$PATH"
hash -r

pnpm install --frozen-lockfile
pnpm run ci
pnpm audit --audit-level high
git diff --check
git status --short
git diff --cached --name-only
```

Expected:

- Foundation, database, IAM-001, and IAM-002 jobs pass;
- no high or critical production dependency advisory;
- nothing is staged until the user explicitly stages the reviewed slice;
- only approved IAM-002 files and documentation are modified/deleted; and
- `SLICE-ACC-001` or later behavior is absent.

## 11. What can be changed later?

| Item | Current IAM-002 behavior | Planned or approved later behavior |
|---|---|---|
| Invitation token | Single-use; permanently consumed | Not editable or reusable |
| Local User mapping | Keyed by Clerk subject | Not user-selectable |
| Workspace | Exactly one private Workspace per User; IDR and Asia/Jakarta fixed | No second/shared Workspace in v1 |
| Starter Account name | Fixed during IAM-002 after creation | Rename is planned in `SLICE-ACC-001` |
| Account Type | Selected at creation from four fixed values | No approved Account-Type edit behavior currently exists |
| Opening Balance | Fixed during IAM-002 | Correctable through `SLICE-ACC-002`; history-aware correction through `SLICE-ACC-003` |
| Opening-Balance Effective Date | Fixed during IAM-002 | Correctable through `SLICE-ACC-002`; history-aware correction through `SLICE-ACC-003` |
| Account active/archive state | Starter Account begins active | Archive/restore and deletion eligibility are planned in `SLICE-ACC-001` |
| Additional Accounts | Not created by onboarding | Account creation is planned in `SLICE-ACC-001` |

The fact that a later behavior is planned does not mean it is already available
in the current UI or API.
