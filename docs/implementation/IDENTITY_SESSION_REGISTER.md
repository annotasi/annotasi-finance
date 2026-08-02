# SLICE-IAM-001 Identity and Session Evidence Register

Verified on 2026-08-02 for Session 27. This register records implementation
evidence for the managed identity and persisted opaque application-session
slice only. It does not define a local User, Workspace, Account, entitlement,
onboarding, financial table, or production provider configuration.

## Selected Baseline

| Selection                     | Exact pin | Official evidence                                                | Decision                                                                                                                                                |
| ----------------------------- | --------: | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@clerk/nextjs`               |     7.6.4 | npm registry (`registry.npmjs.org/@clerk/nextjs/latest`)         | Peer ranges satisfy installed Next.js 16.2.12 (`^16.0.10`) and React 19.2.8 (`~19.2.3`). Requires Node ≥20.9.0.                                         |
| `@clerk/backend`              |    3.15.0 | npm registry                                                     | No hard peer dependencies; used only by the API for `verifyToken` and best-effort provider-session revocation.                                          |
| `shadcn` (CLI)                |    4.16.1 | npm registry                                                     | Resolved and pinned exactly rather than left as `@latest`; devDependency of `apps/web` for reproducible future component additions.                     |
| `tailwindcss`                 |     4.3.3 | npm registry                                                     | CSS-first configuration (`@import "tailwindcss"`, `@theme` in `app/styles.css`), no `tailwind.config.js`.                                               |
| `@tailwindcss/postcss`        |     4.3.3 | npm registry                                                     | Versioned in lockstep with `tailwindcss`; registered in `apps/web/postcss.config.mjs`.                                                                  |
| `react-hook-form`             |    7.84.0 | npm registry                                                     | Peer `react: ^16.8.0\|\|^17\|\|^18\|\|^19` satisfies installed React 19.2.8.                                                                            |
| `@hookform/resolvers`         |     5.6.0 | npm registry                                                     | Optional peer `zod: ^3.25.0\|\|^4.0.0` satisfies installed Zod 4.4.3.                                                                                   |
| `@fastify/cookie`             |    11.1.2 | npm registry                                                     | Tested against `fastify ^5.0.0`; installed Fastify is 5.10.0.                                                                                           |
| `@fastify/cors`               |    11.3.0 | npm registry                                                     | Explicit allow-listed origin array, `credentials: true`; no wildcard credentialed CORS.                                                                 |
| `@fastify/csrf-protection`    |     8.0.0 | npm registry                                                     | Registered with `sessionPlugin: "@fastify/cookie"`; double-submit design (see CSRF/origin policy below).                                                |
| `fastify`                     |    5.10.0 | npm registry (transitive via `@nestjs/platform-fastify@11.1.28`) | Added as an explicit `apps/api` dependency; pnpm's isolated `node_modules` otherwise blocks importing its types from a phantom dependency.              |
| `fast-check`                  |     4.9.0 | npm registry                                                     | Property-oriented test engine for `apps/api`.                                                                                                           |
| `@fast-check/vitest`          |     0.4.1 | npm registry                                                     | Vitest integration for `fast-check`.                                                                                                                    |
| `jsdom`                       |    30.0.1 | npm registry                                                     | Session 27 correction: DOM environment for `apps/web` Vitest interaction tests (was `"node"`).                                                          |
| `@testing-library/react`      |    16.3.2 | npm registry                                                     | Session 27 correction: peers `react`/`react-dom: ^18\|\|^19` (installed 19.2.8) and `@testing-library/dom: ^10.0.0` (installed 10.4.1), both satisfied. |
| `@testing-library/user-event` |    14.6.1 | npm registry                                                     | Session 27 correction: real typing/clicking simulation for interaction tests.                                                                           |
| `@testing-library/dom`        |    10.4.1 | npm registry                                                     | Session 27 correction: explicit peer of `@testing-library/react`, added directly (pnpm's isolated `node_modules` does not auto-hoist peers).            |

All packages verified against Node.js 24.18.0, TypeScript 6.0.3, pnpm 11.19.0,
Next.js 16.2.12, React 19.2.8, NestJS 11.1.28, Fastify 5.10.0.

## Clerk API Generation

Clerk shipped **Core 3** (the "Future"/Signal API) on 2026-03-03. The current
official custom-flow documentation
(`clerk.com/docs/custom-flows/email-password`,
`clerk.com/docs/guides/development/custom-flows/authentication/sign-in-or-up`)
defaults to this generation. This slice uses it exclusively:

- `useSignUp()` / `useSignIn()` from `@clerk/nextjs` return `{ signUp, errors,
fetchStatus }` / `{ signIn, errors, fetchStatus }` — the `SignUpFuture` /
  `SignInFuture` resources, confirmed directly from the installed
  `@clerk/shared` type declarations (`signUpFuture.d.ts`, `signInFuture.d.ts`).
- Action-specific methods are used throughout: `signUp.password()`,
  `signUp.verifications.sendEmailCode()` /
  `signUp.verifications.verifyEmailCode()`, `signUp.finalize()`;
  `signIn.password()`, `signIn.resetPasswordEmailCode.sendCode()` /
  `.verifyCode()` / `.submitPassword()`, `signIn.finalize()`.
- **No legacy `SignUp`/`SignIn` object, `.create()` + `setActive()` pattern,
  or `/legacy` import path is used anywhere in this slice.**
- All Core 3 methods resolve `{ error: ClerkError | null }` rather than
  throwing; `apps/web/lib/clerk-errors.ts` maps `error.code` (a machine-stable
  string) to a safe, generic Indonesian message — Clerk's own
  `message`/`longMessage` (developer-facing English) is never shown to users.

## Provider Identity Boundary

Enforced exactly as required:

1. Clerk performs identity verification (signup, email verification, login,
   password recovery) client-side via the Core 3 hooks.
2. The browser calls `getToken()` (from `useAuth()`) to obtain a short-lived
   Clerk session token immediately after `finalize()` succeeds.
3. That token is sent only as an `Authorization: Bearer` header to the
   narrowly scoped `POST /identity/exchange` or `POST /identity/recovery/complete`
   routes.
4. The API verifies it via `@clerk/backend`'s `verifyToken()` (see below).
5. The API establishes its own opaque `application_sessions` row and returns
   it as an `HttpOnly` cookie.
6. Every ordinary protected route (`GET /identity/session`, `POST
/identity/session/logout`, `POST /identity/session/logout-all`) accepts
   **only** that cookie — proven by `apps/api/test/identity-session.integration.test.ts`'s
   "rejects an ordinary protected route when only a Clerk Bearer token is
   presented" case.
7. No Clerk JWT is ever stored in PostgreSQL, `localStorage`, `sessionStorage`,
   or the Annotasi Finance session cookie. No Clerk middleware is used as an
   authorization guard.

## Provider-Token Verification

`verifyToken(token, { secretKey, authorizedParties })` from `@clerk/backend`
— the documented lower-level method for non-Next.js backends (NestJS/Fastify
has no Clerk-compatible `Request` object for `authenticateRequest()`).
`authorizedParties` is set to `[WEB_ORIGIN]` to reject cross-origin token
replay. Confirmed the exact signature and `JwtPayload` shape (`sub`, `sid`)
directly from the installed `@clerk/backend`/`@clerk/shared` `.d.ts` files
before implementation.

- **Verified identity** → `{ externalSubject: payload.sub, providerSessionId:
payload.sid }`.
- **Unverified/invalid/expired token** → `UnverifiedIdentityError`, mapped to
  a generic 401 (`VERIFICATION_REQUIRED`) at the controller layer — no Clerk
  error object reaches the browser.

## Provider Session-Revocation Capability

### Session 27 correction (post-implementation review)

Two gaps were found and fixed after the initial SLICE-IAM-001 implementation:

1. **Current logout did not revoke the Clerk provider session.** Only the
   Annotasi Finance `application_sessions` row was revoked; the associated
   Clerk session stayed active, so the browser could still obtain another
   provider token and immediately re-exchange it. `SessionService.revokeCurrent`
   now takes the persisted `providerSessionId` (read from the authenticated
   `ApplicationSessionRecord` in `SessionController.logout()`) and, after the
   application-session revocation has already committed, best-effort calls
   `IdentityProvider.revokeProviderSession()`. The provider call is wrapped in
   its own `.catch()` inside `SessionService` itself (not just relied upon at
   the adapter level), so a provider failure can never propagate up and
   prevent the cookie from being cleared or the "revoked" response from being
   returned. If `providerSessionId` is `null`, the provider is never called.
2. **`revokeAllProviderSessions` only processed the first page.** Clerk's
   `getSessionList` is paginated (`limit`/`offset`, default `limit: 10`, max
   `500`, `totalCount` in the response). The original implementation called
   it once with no pagination params, silently leaving any sessions beyond
   the first page active. This was first fixed with an offset:0 "drain"
   helper — see the Round 2 correction below for why that first fix was
   itself replaced.

### Session 27 correction, round 2: collect-then-revoke pagination

The round-1 offset:0 "drain" strategy (re-fetch at `offset: 0`, filtered by
a per-call `attempted` `Set<string>`) could terminate **prematurely**: if an
entire fetched page consisted only of session ids already in `attempted`
(e.g. because every one of them had already failed to revoke once), the
loop's termination condition (`toRevoke.length === 0`) was satisfied even
though further, never-yet-seen pages still existed beyond what an
`offset: 0` fetch currently returned. A saturated first page of revoke
failures could therefore silently strand every later page's sessions
active.

`revokeAllActiveProviderSessions`
(`apps/api/src/identity-session/revoke-all-provider-sessions.ts`) is now a
strict two-phase **collect-then-revoke**:

1. **Collect**: page through `getSessionList` with a properly incrementing
   `offset` (not `offset: 0`), deduping ids into a `Map`, stopping only when
   a page returns zero rows or the running offset reaches the provider's
   own `totalCount` — i.e. termination is driven by the provider's own
   count of the listing, never by anything revocation-related. A listing
   call that itself fails (rejects) stops collection immediately without
   throwing; whatever was already collected before the failure is still
   carried into the revoke phase.
2. **Revoke**: only after collection is fully finished, every collected
   unique id is revoked concurrently (`Promise.all`), each wrapped in its
   own `.catch(() => undefined)` — one id's failure (or an entire page's
   worth of failures) cannot affect any other id, including ones from pages
   fetched later than the failing ones.

Because collection happens entirely before any revocation call is made, a
revoke failure can no longer influence what the next `getSessionList` call
returns — the class of bug above is structurally impossible now, not just
harder to trigger. A `MAX_PAGES = 1000` safety cap remains as a hard stop
regardless of provider behavior. New tests in `apps/api/test/pagination.test.ts`
prove: a duplicate id reappearing across two pages is revoked exactly once;
an **entire first page of revoke failures still allows every id from later
pages to be attempted** (the round-1 regression, now closed); a listing
failure mid-collection terminates safely and still revokes whatever was
already collected; and a provider that never stops reporting more pages
cannot cause an infinite loop.

### Session 27 correction, round 2: SessionService best-effort hardening

`revokeCurrent` (current-session logout) already wrapped its provider call
in its own `.catch(() => undefined)`. The other two call sites did not:
`revokeAllForSubject` (logout-all) and `establishSessionAfterRecovery`
(recovery) called `this.identityProvider.revokeAllProviderSessions(...)`
directly. In production this was masked because `ClerkIdentityProvider`
itself also catches internally — but `FakeIdentityProvider` (the test
double) deliberately does **not** catch when `failRevocation = true`,
so production and the fake adapter disagreed on the contract, and any
future `IdentityProvider` implementation that didn't independently catch
would have propagated a provider failure straight into an unrelated 500 —
even though the important, already-committed application-session work had
already succeeded. Both call sites in `apps/api/src/identity-session/session.service.ts`
now wrap the provider call in their own `.catch(() => undefined)`,
matching `revokeCurrent` exactly, so the guarantee holds independently of
which `IdentityProvider` implementation is wired in.

**Recovery contract, explicit:** `establishSessionAfterRecovery` still
establishes the fresh application session even when provider-side
revocation fails — a Clerk-side error must never lock a user out of their
own just-completed password recovery. Proven by
`apps/api/test/session.service.test.ts`'s "still establishes a fresh
session on recovery even when provider revocation fails" (using
`FakeIdentityProvider.failRevocation = true`) and its logout-all
counterpart, "keeps every application session revoked (logout-all) even
when provider revocation fails".

### Session 27 correction, round 3: preserve the fresh recovery session

Clerk's `submitPassword({ password, signOutOfOtherSessions: true })` keeps
the newly finalized recovery session active while signing out the user's
other provider sessions. The browser then obtains a token from that fresh
session and sends it to `POST /identity/recovery/complete`. The previous
backend flow verified that token and then called
`revokeAllProviderSessions(externalSubject)` without an exclusion, which
could revoke the fresh Clerk session it had just verified.

The provider port now accepts one narrow optional
`excludeProviderSessionId`. Recovery passes the verified fresh `sid`; the
collect-then-revoke helper still collects all pages and deduplicates all ids
first, then removes only that id from the final revocation set. The excluded
id is never passed to Clerk's `revokeSession()`, including when it appeared
more than once in provider listing results. Old provider sessions remain
best-effort revocation targets. The new Annotasi Finance
`application_sessions` row retains the fresh, non-revoked
`provider_session_id`.

Logout-all continues to call `revokeAllProviderSessions(externalSubject)`
with no options, so every collected provider session remains a revocation
target. If a recovery token has no `providerSessionId`, the backend first
revokes every prior Annotasi Finance application session, skips unsafe
provider bulk revocation, and still creates the fresh application session.
Provider failure cannot restore those authoritative application-session
revocations or prevent the fresh application session from being created.

### Capability summary

- Single session: `clerkClient.sessions.revokeSession(sessionId)` — wraps
  `POST /sessions/{id}/revoke`. Called from both `SessionService.revokeCurrent`
  (current logout) and internally by the pagination helper (all-session
  revocation).
- All sessions for a subject: no single bulk-revoke endpoint exists; collected
  page-by-page and then revoked, as described above. Recovery can remove one
  fresh `providerSessionId` from the final revocation set; logout-all supplies
  no exclusion and revokes every collected id.
- All three `SessionService` call sites (`revokeCurrent`, `revokeAllForSubject`,
  `establishSessionAfterRecovery`) independently wrap their provider call in
  `.catch(() => undefined)` — the best-effort guarantee lives at the service
  layer, not just the adapter layer, and is proven for all three by
  `apps/api/test/session.service.test.ts` using `FakeIdentityProvider.failRevocation`.
- A provider-side failure never blocks, reverses, or is reported as
  reversing Annotasi Finance's own `application_sessions` revocation
  (architecture §14's "partial provider failure is handled safely... without
  restoring already-revoked application sessions"). Within the collected set
  of ids to revoke, one failed revocation (or an entire page's worth) never
  stops any other id — from the same page or a later one — from being
  attempted.
- Annotasi Finance's own `application_sessions` table is the sole source of
  truth for whether a session is active — provider-side revocation is
  defense-in-depth, not the authorization mechanism.
- No provider error detail is logged or returned to the browser in either
  path.

## Recovery Strategy

No webhook is used (per instruction, since a generic `user.updated` event does
not deterministically prove password-reset completion). Instead:

1. Browser drives `signIn.resetPasswordEmailCode.sendCode()` →
   `.verifyCode()` → `.submitPassword({ password, signOutOfOtherSessions: true
})` → `signIn.finalize()`.
2. Browser immediately calls `POST /identity/recovery/complete` with the fresh
   Clerk token.
3. `SessionService.establishSessionAfterRecovery()` verifies the token,
   revokes **every** prior Annotasi Finance `application_sessions` row for
   that subject, best-effort revokes old provider sessions while excluding
   the fresh verified `providerSessionId`, and only then persists one new
   application session associated with that still-active provider session.
   A null `providerSessionId` skips provider bulk revocation but does not skip
   authoritative application-session revocation or fresh-session creation.
4. The forgot-password request stage always returns the same generic
   Indonesian notice regardless of whether the email exists, avoiding account
   enumeration (PRD §20 / architecture §16).

### Session 27 correction: forgot-password request error handling

The original request-stage handler ignored the `{ error }` results of
`signIn.create()` and `signIn.resetPasswordEmailCode.sendCode()` and had no
`try`/`catch`, so a thrown exception (network/provider failure) became an
unhandled promise rejection and the UI silently advanced to the reset-code
stage even though no reset attempt had been prepared. `onSubmitRequest`
(`apps/web/app/forgot-password/page.tsx`) now:

- Wraps both calls in `try`/`catch`.
- Checks each `{ error }` result. If `error.code` is one of
  `ACCOUNT_LOOKUP_ERROR_CODES` (`form_identifier_not_found`,
  `resource_not_found`) — an account-lookup-style outcome — it is treated
  identically to success: same generic notice, same transition to the
  reset-code stage, preserving the non-enumeration guarantee.
- Any other `{ error }` result, or a thrown exception, is treated as an
  operational failure: `setErrorMessage(safeClerkErrorMessage(...))` shows a
  retry-safe generic message (never the raw Clerk code or a caught
  exception's message), the stage does **not** advance, and — because RHF's
  `isSubmitting` clears once the handler's promise settles — the submit
  button returns to its enabled state, allowing an immediate retry.

### Session 27 correction, round 2: thrown-exception handling across every auth screen

Round 1 fixed `{ error }`-shaped failures throughout, and thrown exceptions
specifically for the forgot-password request stage (above). It missed that
Clerk's Core 3 methods, despite resolving `{ error }` on an _expected_
failure, can still **reject** the underlying promise on an unexpected one
(network failure, provider outage, an unexpected thrown error from
`getToken()`). Before this round, only the forgot-password request stage
guarded against that; every other call — `signUp.password`,
`sendEmailCode`, `verifyEmailCode`, `signUp.finalize`, `getToken`,
`exchangeProviderToken` in signup; `signIn.password`, `signIn.finalize`,
`getToken`, `exchangeProviderToken` in login; `verifyCode`,
`submitPassword`, `signIn.finalize`, `getToken`, `completeRecovery` in the
recovery reset stage — was unguarded, so a thrown exception from any of
them became an unhandled promise rejection, could leave `stage` stuck at
`"finishing"` with the submit button permanently disabled, and never
rendered any user-facing message.

Every handler body in `apps/web/app/signup/page.tsx`,
`apps/web/app/login/page.tsx`, and `apps/web/app/forgot-password/page.tsx`
is now wrapped in its own `try`/`catch`. The `catch` block always: shows a
single safe, generic Indonesian message (never the caught exception's
`message` or a raw Clerk error); returns any `"finishing"` stage back to
its retryable predecessor stage (`"verifying"` for signup, `"reset"` for
recovery — login has no intermediate stage); never navigates
(`router.push`); and relies on the form library's own `isSubmitting`
clearing once the handler's promise settles (the `catch` block itself never
re-throws), so the submit control is always re-enabled.

13 new interaction tests (`apps/web/test/*-interaction.test.tsx`) each
force one specific call to reject with `mockRejectedValueOnce` and assert:
a safe alert appears, the exception's own message text is never present,
`router.push` was never called, and the relevant submit button is enabled
again. Covered exactly: signup's `password`, `sendEmailCode`,
`verifyEmailCode`, and `finalize`/`getToken` (chained, since a
`finalize`-throw prevents `getToken` from ever running); login's
`password`, `finalize`, `getToken`, and the `exchangeProviderToken` call
itself; recovery's `verifyCode`, `submitPassword`, `finalize`, `getToken`,
and `completeRecovery`. No Playwright was introduced for this — the
existing `jsdom`/Testing Library stack (added Round 1) was sufficient.

**Test-isolation defect found and fixed while adding this coverage:** each
interaction test file's `beforeEach` only called `mockClear()` on its
Clerk-hook mocks, which resets call history but **not** a mock's
`mockImplementation`/queued `mockRejectedValueOnce`. One existing test
("shows a disabled/loading state while the verification submit is
pending") permanently overrode `verifyEmailCodeMock` with a
never-resolves-until-manually-triggered implementation and never restored
it, which leaked into every later test in the file and caused a new
thrown-exception test to hang indefinitely (the failure was a stuck
`isSubmitting`, not a production bug). All three interaction test files'
`beforeEach` blocks now call `mockReset()` and re-establish an explicit
default resolved value for every mock, so no test's local override can
ever leak into another test regardless of execution order.

## Frontend Request Shape and Local Environment Loading (Session 27, round 2)

### Browser request Content-Type/body correction

`apps/web/lib/api-client.ts` previously sent `Content-Type: application/json`
on **every** request, including ones with no body (`GET /identity/session`,
and the Bearer-only `POST /identity/exchange` and
`POST /identity/recovery/complete` calls). Fastify rejects a request that
declares a JSON `Content-Type` but has an empty body — this was live
against the real Fastify HTTP stack, not merely a client-side annoyance,
and would have broken exchange/recovery/status in the manual Clerk sandbox
flow. The client now only ever sets `Content-Type: application/json` when a
JSON `body` is actually being sent:

| Call                    | Method | Headers                        | Body   |
| ----------------------- | ------ | ------------------------------ | ------ |
| `exchangeProviderToken` | `POST` | `Authorization` only           | none   |
| `completeRecovery`      | `POST` | `Authorization` only           | none   |
| `fetchSessionStatus`    | `GET`  | none                           | none   |
| `logoutCurrentSession`  | `POST` | `Content-Type`, `x-csrf-token` | `"{}"` |
| `logoutAllSessions`     | `POST` | `Content-Type`, `x-csrf-token` | `"{}"` |

`credentials: "include"` is always applied regardless. `OriginCsrfGuard` on
the API side is unchanged — it still requires `Content-Type: application/json`
on every state-changing (logout/logout-all) route; this correction only
stops the client from sending that header where the API never expected a
body in the first place.

Evidence: 5 focused unit tests in `apps/web/test/api-client.test.ts` assert
the exact `fetch` call shape (method/headers/body/credentials) for each of
the five calls above. Four new integration tests in
`apps/api/test/identity-session.integration.test.ts`
("frontend request-shape regression evidence") prove this against the real
Fastify app: exchange and recovery-completion succeed with
Authorization-only, no JSON header or body; logout succeeds with
`Content-Type: application/json` and an explicit `"{}"` body; and — the
regression proof — logout is **rejected** with `Content-Type:
application/json` and an empty body, demonstrating the bug this client
change fixes was real and would otherwise still be live.

### Local `.env.local` loading

`apps/api`'s `dev` script never actually loaded `apps/api/.env.local`
despite `README.md` instructing users to populate it — Clerk credentials
and other local overrides silently had no effect. Fixed using Node 24's
native `--env-file` flag (no `dotenv` dependency added):

```json
"dev": "tsc -p tsconfig.build.json && node --env-file=.env.local --enable-source-maps dist/main.js"
```

The production `start` script is deliberately unchanged — it does not load
`.env.local`; a real deployment supplies its environment another way.
`README.md` now documents the three `cp .env.example .env.local`/`.env`
setup commands, which exact values need a real Clerk credential, and a
smoke-check snippet that starts the dev server on a throwaway port and
curls `/health` to prove the file was actually read (Node's `--env-file`
fails fast with a clear error if the file is missing, rather than silently
starting with defaults).

## Identifier Portability

Clerk user IDs are stable, non-reassignable, prefixed strings (`user_...`),
exposed as the JWT `sub` claim — directly confirmed from `@clerk/shared`'s
type declarations and Clerk's JWT reference documentation. Stored as
`external_subject` in `application_sessions`; never used as a display value.

## Privacy / Data-Processing Result

Clerk is a global SaaS provider with a standard DPA (`clerk.com/legal/dpa`)
and published subprocessor list. No Indonesia-specific restriction was found.
This matches the trade-off already accepted at Session 24 (`MVP_IMPLEMENTATION_PLAN.md`
§10): neither Clerk nor Auth0 offers a direct Indonesia region; both were
evaluated on verification/session/export capability, not physical region.
Nothing discovered during this slice's research contradicts that acceptance.

## Sandbox Constraints

Clerk development instances: test mode by default, capped at 100 users,
`+clerk_test` email addresses skip real delivery (fixed code `424242`), emails
sent from `@accounts.dev`. Adequate for CI (which uses a deterministic fake
provider and never touches Clerk) and for the manual smoke flow documented in
`README.md`; not adequate for judging real-world deliverability.

## Email Deliverability

Production instances require a custom sending domain with SPF + DKIM (set up
at production-instance initialization); DMARC is recommended. Development
instances cannot achieve production-grade deliverability by design. This is a
pre-beta concern per the Session 24 "Conditional Selection" on email
delivery, not a SLICE-IAM-001 blocker.

## Security Advisories

**CVE-2026-42349** (authorization-bypass in combined `has()`/`auth.protect()`
checks) affects `@clerk/backend` ≤3.2.13 and `@clerk/nextjs` ≤7.2.3. The
versions selected here (3.15.0 / 7.6.4) are well past the patched threshold —
**not affected**. This slice also does not use `has()`/`auth.protect()` or
`clerkMiddleware` as an authorization mechanism at all (prohibited by
architecture §16), further reducing exposure. `pnpm audit` reports only the
pre-existing, already-documented `esbuild` development-server finding
(GHSA-67mh-4wv8-2f99, transitive via Drizzle Kit's local config loader) — no
new advisory was introduced by any SLICE-IAM-001 dependency.

## shadcn / Tailwind Baseline

- CLI: `shadcn@4.16.1`, invoked via `pnpm exec shadcn init -y -t next -b base
-p nova` (exact resolved version recorded here, not left as `@latest`).
- Primitive baseline: **Base UI** (`-b base`) — shadcn made Base UI the
  default for new projects in July 2026; Radix remains supported but is no
  longer the default, per the official shadcn changelog.
- Preset: `nova` (Lucide icons, Geist font) — shadcn's own default preset; no
  custom design system was built for this slice.
- Tailwind: v4.3.3, CSS-first. `apps/web/app/styles.css` now begins with
  `@import "tailwindcss"; @import "tw-animate-css"; @import
"shadcn/tailwind.css";`, followed by the Nova preset's neutral OKLCH color
  tokens (light + `.dark`), a `@theme inline` block, and the pre-existing
  FOUND-001 custom styles (preserved, not replaced).
- `apps/web/tsconfig.json` gained `"paths": { "@/*": ["./*"] }` (previously
  absent) and `"skipLibCheck": true` (see Known Deviations below).
- Generated dependencies (all exact-pinned): `@base-ui/react@1.6.0`,
  `class-variance-authority@0.7.1`, `clsx@2.1.1`, `lucide-react@1.28.0`,
  `tailwind-merge@3.6.0`, `tw-animate-css@1.4.0` — shadcn's CLI initially
  wrote these with caret ranges, which were manually pinned to the exact
  resolved versions to satisfy the repository's `save-exact=true` policy.
- Components added (exactly these, no catalog-wide install): `button`,
  `input`, `label`, `card`, `alert` — matching the brief's "Button, Input,
  Label or Field, Card, Alert, form-error/status presentation" list. No
  `form` wrapper component was added; React Hook Form is wired directly.
- No 21st.dev code, no UI UX Pro Max, no marketplace template, no decorative
  animation library was added.

## Application-Session Schema

`database/schema/application-sessions.ts` (Drizzle) →
`database/migrations/0001_application_sessions.sql`:

| Column                | Type                                    | Notes                                                                                                         |
| --------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `id`                  | `uuid`, PK, `DEFAULT gen_random_uuid()` | Stable session-row identifier                                                                                 |
| `token_hash`          | `text`, `NOT NULL`, unique index        | SHA-256 hex digest; raw token never persisted                                                                 |
| `external_subject`    | `text`, `NOT NULL`, indexed             | Clerk `sub` claim                                                                                             |
| `provider_session_id` | `text`, nullable, indexed               | Clerk `sid` claim, for correlation                                                                            |
| `created_at`          | `timestamptz`, `NOT NULL DEFAULT now()` | UTC                                                                                                           |
| `last_used_at`        | `timestamptz`, `NOT NULL DEFAULT now()` | UTC; updated in a bounded manner (throttled to once per 5 minutes)                                            |
| `expires_at`          | `timestamptz`, `NOT NULL`               | UTC                                                                                                           |
| `revoked_at`          | `timestamptz`, nullable                 | UTC                                                                                                           |
| `revoked_reason`      | `text`, nullable                        | Tied to `revoked_at` by a `CHECK` constraint (`application_sessions_revocation_state`): both null or both set |

Not Workspace-scoped (pre-Workspace); no Row-Level Security policy was
invented for it, per instruction. `REVOKE ALL ... FROM PUBLIC` plus `GRANT
SELECT, INSERT, UPDATE` (no `DELETE`) to `annotasi_application` — revocation
is the normal lifecycle operation, not physical deletion. The migration role
(`annotasi_migration`) owns the table. Verified against real PostgreSQL that
the application role holds exactly `{INSERT, SELECT, UPDATE}` and that
`DELETE`/`ALTER`/`DROP` are all rejected with SQLSTATE `42501`.

## Token Generation and Hashing

- `crypto.randomBytes(32)` (256 bits), base64url-encoded → the raw opaque
  token, returned to the browser only via the `Set-Cookie` response.
- SHA-256 hex digest (`crypto.createHash("sha256")`) of the raw token is the
  only value persisted, as `token_hash`.
- Constant-time comparison: session lookup uses a PostgreSQL indexed equality
  match on the hash (not an in-process string comparison of secret material);
  CSRF token verification is delegated entirely to `@fastify/csrf`'s own
  internal implementation. No additional manual constant-time comparison was
  required in this slice's own code.

## Cookie Policy

`SessionCookiePolicy` (`apps/api/src/identity-session/cookie.service.ts`):

- Name: `af_session` in local development; `__Host-af_session` in production
  (requires Secure + Path=/ + no Domain attribute — all satisfied).
- `HttpOnly: true` always. `Secure: true` always in production; in
  development, `false` by default with a documented `SECURE_COOKIES=true`
  override, and the reverse (`SECURE_COOKIES=false` while
  `APP_ENV=production`) is rejected at config-parse time (fail-fast).
- `SameSite: "lax"`, `Path: "/"`.
- Cleared on logout with **exactly** the same attributes used to set it
  (proven in `apps/api/test/cookie.test.ts`).

## CSRF / Origin Policy

Double-submit design via `@fastify/csrf-protection`, registered with
`sessionPlugin: "@fastify/cookie"` and an HMAC key from `CSRF_SECRET`
(≥32 characters, validated). `GET /identity/session` calls
`reply.generateCsrf()` and returns the token in its JSON body (not just a
readable cookie), which the frontend echoes back as an `x-csrf-token` header
on state-changing requests. `OriginCsrfGuard` additionally checks the
`Origin` header against the exact `WEB_ORIGIN` allowlist and the
`Content-Type: application/json` header before running the CSRF check. A CSRF
token is never treated as an authentication credential — it only
supplements, never replaces, the application-session cookie. `@fastify/cors`
uses an explicit origin array (`[WEB_ORIGIN]`) with `credentials: true`; no
wildcard credentialed CORS.

## Migration and Privilege Strategy

`0001_application_sessions.sql` follows the exact FOUND-002
(`0000_foundation_probe.sql`) pattern: generated `CREATE TABLE`/index
statements from `drizzle-kit generate`, followed by hand-reviewed
`COMMENT ON TABLE`, `REVOKE ALL FROM PUBLIC`, and a scoped `GRANT`. No RLS
statements (not Workspace-scoped). Verified against real PostgreSQL:
empty-database migration applies both migrations (`before: 0, after: 2`), a
repeated migration command is a tracked no-op (`before: 2, after: 2, applied:
0`), and a second fresh database replays the complete two-migration history
identically.

## Runtime Database Boundary

`database/src/runtime/` (`client.ts`, `session-store.ts`, `index.ts`) is a new
reviewed export subpath, `@annotasi/database/runtime`, added to
`database/package.json`'s `exports` map (the package still has no `"."`
export, so a bare `import ... from "@annotasi/database"` fails at the
TypeScript/Node module-resolution level, not just at lint time).
`eslint.config.mjs`'s `apiProductionFiles` rule was narrowed from a blanket
`@annotasi/database` ban to explicitly ban only `@annotasi/database/scripts`
and `**/database/migrations/**`, leaving `/runtime` importable — empirically
verified against the `ignore` package's actual matching semantics (a bare
directory-style ban cannot be selectively re-included via negation, so the
fix removes the blanket entry rather than trying to negate it). A new
boundary fixture, `tests/architecture/fixtures/apps/web/src/imports-clerk-backend.ts`,
proves the web app cannot import `@clerk/backend` (server-only, holds the
secret key) — registered in `scripts/check-boundaries.mjs`'s
`fixtureExpectations` map, bringing the total to 10 deliberately rejected
boundary violations (9 inherited from FOUND-001/002, 1 new).

## API Surface

| Route                          | Method | Boundary                                                 | Purpose                                           |
| ------------------------------ | ------ | -------------------------------------------------------- | ------------------------------------------------- |
| `/identity/exchange`           | `POST` | Bearer only                                              | Provider-session-to-application-session exchange  |
| `/identity/recovery/complete`  | `POST` | Bearer only                                              | Revoke-all-then-establish after password recovery |
| `/identity/session`            | `GET`  | Cookie only (`SessionGuard`)                             | Protected probe; also issues the CSRF token       |
| `/identity/session/logout`     | `POST` | Cookie + Origin/CSRF (`SessionGuard`, `OriginCsrfGuard`) | Current-session revocation                        |
| `/identity/session/logout-all` | `POST` | Cookie + Origin/CSRF (`SessionGuard`, `OriginCsrfGuard`) | All-session revocation for the subject            |

`IdentitySessionModule` wires all providers via factory functions keyed on
DI tokens (`IDENTITY_SESSION_CONFIG`, `SESSION_STORE_CONNECTION`,
`SESSION_STORE`, `IDENTITY_PROVIDER`) and closes the PostgreSQL pool on
`onModuleDestroy`.

## Test Evidence

| Category                                                                             | File(s)                                                                                                                                           | Count |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----: |
| Unit (token generation/hashing)                                                      | `apps/api/test/token.test.ts`                                                                                                                     |     4 |
| Property (`fast-check`)                                                              | `apps/api/test/token.test.ts`                                                                                                                     |     2 |
| Unit (cookie policy)                                                                 | `apps/api/test/cookie.test.ts`                                                                                                                    |     5 |
| Unit (session lifecycle, incl. provider-revocation best-effort at all 3 call sites)  | `apps/api/test/session.service.test.ts`                                                                                                           |    14 |
| Unit (guards)                                                                        | `apps/api/test/guards.test.ts`                                                                                                                    |     8 |
| Unit (collect-then-revoke pagination, incl. saturated-failure evidence)              | `apps/api/test/pagination.test.ts`                                                                                                                |    12 |
| Unit (config validation)                                                             | `packages/config/test/identity-session-config.test.ts`                                                                                            |     6 |
| PostgreSQL integration (real Testcontainers Postgres)                                | `database/test/session-store.integration.test.ts`                                                                                                 |     8 |
| API/security integration (`app.inject`, fake provider, incl. request-shape evidence) | `apps/api/test/identity-session.integration.test.ts`                                                                                              |    14 |
| Frontend unit (exact request shape per API call)                                     | `apps/web/test/api-client.test.ts`                                                                                                                |     5 |
| Frontend static-render (labels, copy, no-leakage smoke)                              | `apps/web/test/validation.test.ts`, `clerk-errors.test.ts`, `auth-screens.test.tsx`                                                               |    12 |
| Frontend DOM interaction, incl. thrown-exception coverage                            | `apps/web/test/signup-interaction.test.tsx`, `login-interaction.test.tsx`, `forgot-password-interaction.test.tsx`, `session-interaction.test.tsx` |    33 |

Total: 59 API tests, 16 database tests, 8 config tests, 50 web tests (133
identity-session-relevant tests overall, plus the pre-existing FOUND-001/002
suites — `apps/api/test/health.test.ts` and `apps/web/test/page.test.tsx` —
all still passing). All PostgreSQL integration evidence runs against
the exact `postgres:17.10-alpine3.24` image via Testcontainers. All API/security
and unit tests use the deterministic `FakeIdentityProvider`/`FakeSessionStore`
test doubles (`apps/api/test/support/`) — CI never calls a live Clerk service
and never receives a real Clerk credential.

### Known deviation: `skipLibCheck`

`database`, `apps/api`, and `apps/web` all now set `skipLibCheck: true`.
FOUND-002 already established this for `database` (Drizzle 0.45.2's own
multi-dialect declaration files fail this repository's strict
`exactOptionalPropertyTypes`). SLICE-IAM-001 extends the same, narrowly
scoped, third-party-only workaround to `apps/api` (triggered by importing
`@annotasi/database/runtime`, which pulls in the same Drizzle declarations)
and to `apps/web` (triggered by `@clerk/shared`'s own declaration files
hitting the same strictness issue). All project TypeScript remains strict;
only third-party `.d.ts` resolution is relaxed.

### Known deviation: `consistent-type-imports` vs. NestJS DI

`@typescript-eslint/consistent-type-imports` cannot see that
`emitDecoratorMetadata` needs a real (non-`type`) import for any class used
only as a constructor-parameter type in a NestJS-injectable class. Four files
(`session.guard.ts`, `exchange.controller.ts`, `recovery.controller.ts`,
`session.controller.ts`) carry a targeted
`// eslint-disable-next-line @typescript-eslint/consistent-type-imports`
comment on the two affected import lines each, with an explanatory comment.
This was caught empirically: an earlier `eslint --fix` pass silently
converted these to `import type`, which compiled and typechecked cleanly but
broke NestJS dependency injection at runtime (`Test.createTestingModule`
failed with "Nest can't resolve dependencies... argument at index [0]").

### Closed: frontend dynamic-interaction coverage (Session 27 correction)

The prior register recorded this as a known gap — the frontend suite only
used `renderToStaticMarkup` and never exercised real user interaction. This
is now closed with the smallest additional stack needed:

- `jsdom@30.0.1`, `@testing-library/react@16.3.2` (peers: React `^18||^19`,
  `@testing-library/dom@^10.0.0` — both satisfied), `@testing-library/user-event@14.6.1`,
  `@testing-library/dom@10.4.1` (explicit peer). No `@jest-dom` matcher
  library was added — assertions use plain DOM properties
  (`element.textContent`, `element.tagName`, `.disabled`) to keep the
  dependency footprint minimal, per instruction.
- `apps/web/vitest.config.ts`: `test.environment` changed from `"node"` to
  `"jsdom"`, and `test.setupFiles: ["./test/setup.ts"]` was added — the setup
  file registers `afterEach(cleanup)` from `@testing-library/react` (Vitest
  does not inject the `afterEach` global RTL's own auto-cleanup detection
  relies on unless `test.globals: true` is set, which this repository does
  not use). No other package's Vitest config was touched.
- The existing `renderToStaticMarkup` tests (`auth-screens.test.tsx`) were
  kept unchanged as structural/copy/label smoke evidence; the new
  `*-interaction.test.tsx` files are the primary dynamic-behavior evidence.
- 20 new interaction tests across four files prove, using real
  `@testing-library/user-event` typing/clicking against the actual page
  components (only `@clerk/nextjs`, `next/navigation`, and `@/lib/api-client`
  are mocked): signup password/verification submission and its Clerk
  Future-API calls, the verification-code state transition, a disabled/
  loading state during the pending verification submit, and safe
  accessible-alert error announcement; login credential submission,
  duplicate-submit blocking, the post-finalize application-session exchange
  call, and safe failure messaging; the full forgot-password flow (valid
  request, non-enumerating unknown-account outcome, retryable operational
  error, retryable thrown exception, no-duplicate-submit on reset, and the
  recovery-completion endpoint call); and the session-status page's loading
  representation, logout/logout-all invocation, Clerk-sign-out-failure
  resilience, error announcement, and native `<button>` keyboard-operability.
- No Playwright was introduced. No broad snapshot tests were added. No
  IAM-002 UI was implemented.
- Round 2 added 13 more interaction tests to this same stack — the
  thrown-exception matrix documented above under "thrown-exception handling
  across every auth screen" — bringing the four interaction files to 33
  tests total (see the Test Evidence table). No new testing dependency was
  added for round 2; still no Playwright.

## Provider Sandbox Evidence

**Pending.** No live Clerk credentials were available in this session. The
manual smoke flow is fully documented in `README.md` § "Identity and
sessions" but has not been executed against a real Clerk development-instance
tenant. SLICE-IAM-001 is not considered fully complete until the user (or a
follow-up session with real credentials) performs and confirms that flow.

## Explicit Exclusions

No local User table, Workspace table, starter Account, beta invitation or
entitlement, entitlement redemption, onboarding, Workspace RLS product table,
Account/Category/Dedicated Fund/Debt Record/Financial Event, financial
behavior, dashboard, reporting, profile-management UI, organization or
multi-user collaboration, Clerk Organizations, social login, passkeys, MFA
(beyond an unavoidable provider default — none was encountered), production
deployment, Neon production configuration, billing/subscription integration,
UI UX Pro Max, or 21st.dev. SLICE-IAM-002 and every later slice remain not
started.

## Reconsideration Triggers

Re-review this baseline if: Clerk deprecates the Core 3 Signal API or ships a
breaking change to `SignUpFuture`/`SignInFuture`; a new high/critical
advisory affects `@clerk/backend`, `@clerk/nextjs`, or any pinned Fastify
plugin; Clerk changes its session-list/revocation Backend API surface; Drizzle
ships a stable release that removes the need for `skipLibCheck`; or the
`consistent-type-imports`/NestJS-DI conflict is resolved upstream (removing
the need for the four targeted disable comments).

## Live Clerk Development-Instance Smoke Evidence

Validated manually on 2026-08-02 with local Node.js 24.18.1 and a Clerk
development instance. No key, email address, password, verification code,
token, cookie, token hash, external subject, or provider session identifier
is recorded here.

- Signup and email-code verification completed successfully.
- Provider-token exchange returned a successful application-session response,
  and the protected session endpoint returned an active session.
- Login completed successfully.
- Password recovery completed successfully; prior Annotasi Finance sessions
  were recorded with `password_recovery`.
- The same application session remained valid after stopping and restarting
  the API process, proving PostgreSQL-backed lookup rather than process memory.
- Current logout rejected later use of the old session and recorded
  `user_logout`.
- Logout-all rejected the tested sessions and recorded `user_logout_all`.
- Database evidence contained only the technical foundation/session tables;
  no local User, Workspace, entitlement, onboarding, or financial table was
  introduced.
- Final supported-runtime validation passed under Node.js 24.18.1 and pnpm
  11.19.0. The complete `pnpm ci` gate passed; the audit retained only the
  previously documented moderate development-only advisory and no high or
  critical finding.

## Human-readable Authentication Errors and Safe Trace Logging

The live Clerk development-instance smoke exposed two presentation and
traceability details that were not covered by the original deterministic
adapter tests:

- Clerk Future APIs may surface a credential failure as a root error array,
  a direct `{ code }` object, an `{ errors: [...] }` wrapper, or the official
  `useSignIn().errors.fields.password` / `errors.fields.identifier` state.
  `apps/web/lib/clerk-errors.ts` performs a bounded traversal across these
  known containers, and the login screen observes Clerk's hook-level field
  errors as the authoritative render source. Provider messages, metadata,
  email addresses, trace data, and authentication material are discarded.
- `form_password_incorrect` and `form_identifier_not_found` intentionally map
  to the same actionable Indonesian message: "Email atau kata sandi tidak
  cocok. Periksa kembali keduanya, atau gunakan opsi lupa kata sandi." This
  avoids disclosing whether an email is registered while still telling the
  user what to check. Both credential fields are marked `aria-invalid` for
  the rejected attempt.

Credential validation is performed directly between the browser and Clerk,
so a wrong-password response never reaches the Annotasi Finance API. Backend
logs therefore must not claim to record the password failure itself. Clerk's
Development Dashboard Logs remain the provider-side trace source for that
step.

The API now emits structured, non-sensitive identity-session lifecycle events
through Fastify's request logger for the boundaries it actually owns:
provider-token exchange acceptance/rejection, recovery completion,
application-session rejection, Origin/content-type/CSRF rejection, current
logout, and logout-all. The event payload is limited to stable event/reason
codes plus Fastify's existing request context. It never includes email,
password, provider token, application-session cookie, token hash, CSRF token,
provider error text, external subject, or provider session id.
