# Annotasi Finance — Architecture Baseline

## 1. Document Status

- **Status:** Candidate Architecture baseline pending review.
- **Session:** Session 23 — Architecture Baseline.
- **Workflow stage:** Architecture.
- **Domain Modeling status:** Complete for the Private Beta v1 baseline.
- **Implementation status:** Not started.
- **Target:** Annotasi Finance Private Beta v1.
- **Activation boundary:** This baseline becomes the working Architecture baseline only after review, commit, and push.
- **Change boundary:** This session creates this document only. It does not create application code, package manifests, migrations, detailed endpoint contracts, framework initialization, implementation tasks, or changes to an existing source document.

The architecture decisions below are candidates, not approved decisions. Their formal status uses only the vocabulary defined in Section 4.

## 2. Purpose

This document translates the sufficiently approved product-domain model into a concrete, reviewable technical baseline. It selects a v1 system shape, stack categories, runtime responsibilities, module boundaries, persistence and consistency strategy, operational baseline, and implementation constraints without weakening or reopening the domain model.

It exists to make Session 24 implementation planning possible. It does not provide detailed API payloads, database schemas, migration scripts, framework classes, repository interfaces, tickets, estimates, or code.

## 3. Source Authority and Domain Contract

The sources used for this baseline, in authority order, are:

1. `docs/domain/EXECUTABLE_DOMAIN_SPECIFICATION.md` for normative domain behavior, invariants, examples, and properties.
2. `docs/product/ANNOTASI_FINANCE_MVP_PRD.md` for the Private Beta v1 requirements baseline.
3. `docs/product/PRODUCT_IDENTITY.md` for approved product direction.
4. `CLAUDE.md` for repository workflow and operating constraints.
5. `docs/domain/DOMAIN_DECISION_REGISTER.md` for the 41 decision resolutions and the two Architecture-deferred traceability choices.
6. `docs/domain/AGGREGATE_CANDIDATES.md` for candidate responsibility and consistency-boundary analysis.
7. `docs/project/PROJECT_STATE.md` for navigation only; it is not an authority for product or domain meaning.

No conflict was found among these sources. When this document and an authoritative product or domain source disagree, the authoritative source wins and the discrepancy requires explicit Architecture review. Architecture may translate domain meaning into technical structures; it may not silently redefine aggregate responsibilities, event semantics, invariants, or acceptance outcomes for persistence, framework, deployment, or operational convenience.

The following are fixed domain constraints, not Architecture options:

- exactly six Financial Event Types exist: Income, Expense, Transfer, Fund Allocation, Fund Release, and Debt Repayment;
- Ordinary Expense and Fund-Linked Expense are forms of Expense, not additional Event Types;
- cross-boundary financial behavior has one all-or-nothing accepted or blocked outcome;
- Event Date plus immutable Workspace confirmation-order position determines chronology;
- Same-Type Edit preserves Financial Event identity and confirmation-order position; Replacement creates a new identity and position while retaining the old-to-new link; Restoration reuses the original position;
- current and historical financial invariants must hold at every affected chronological point;
- accepted history is never silently removed, excluded, or retroactively unaccepted;
- Workspace isolation, traceability, correction, Trash, and restoration semantics remain as specified by the domain baseline;
- v1 has no permanent Financial Event deletion and no Trash expiry;
- Architecture does not add Event Types, currencies, collaboration, debt borrowing events, allocation lots, or other excluded behavior.

## 4. Architecture Decision Method

Each major decision is evaluated against the same criteria, in order:

1. preserve normative domain behavior and all-or-nothing consistency;
2. protect Workspace privacy and financial correctness;
3. make chronology, recalculation, correction, and traceability deterministic;
4. keep the Private Beta system operationally small and recoverable;
5. make incorrect states difficult to represent or commit;
6. keep framework and vendor coupling replaceable at module boundaries;
7. defer details that do not change the architecture baseline.

Formal Architecture status vocabulary:

- **Adopted Candidate Baseline** — selected for this candidate baseline, pending review.
- **Architecture Constraint** — required by product/domain authority and not open to technical weakening.
- **Implementation-Time Selection** — the architectural category and constraints are fixed, but the exact product, provider, version, or threshold is selected during implementation planning.
- **Deferred Post-MVP** — intentionally outside Private Beta v1 Architecture.
- **Rejected for v1** — evaluated and not selected for Private Beta v1.

A decision is reconsidered only when evidence changes a stated assumption, a selected mechanism cannot preserve the domain contract, or measured operational behavior crosses its stated trigger. Convenience alone is not a reconsideration trigger.

## 5. Repository Technical Baseline

The repository is documentation-only and greenfield at the start of Session 23. It contains product, domain, project-state, and AI-tooling documents, but no application source tree, package manifest, application dependency lockfile, TypeScript configuration, database configuration, migration, Docker or Compose file, CI workflow, or deployable runtime.

Consequences:

- no legacy runtime, framework, schema, or integration constrains the selection;
- the initial repository structure can reflect the domain and runtime boundaries directly;
- exact dependency versions must be verified at implementation time rather than inferred from absent configuration;
- no compatibility migration or incremental rewrite is required;
- the first implementation slice must establish the quality gates and isolation controls, not postpone them.

## 6. Architecture Principles

1. Preserve every approved domain invariant.
2. Prefer a modular monolith for Private Beta unless evidence requires distributed services.
3. Prefer one logical authoritative write path.
4. Prefer database-backed atomic consistency for accepted cross-boundary financial outcomes.
5. Avoid eventual consistency for authoritative Account, Fund, Debt, and Financial Event state.
6. Keep Workspace ownership and isolation explicit at every persistence and access boundary.
7. Prefer the smallest operational footprint that remains testable and recoverable.
8. Separate domain meaning from framework and persistence concerns.
9. Keep derived values traceable to authoritative facts.
10. Do not introduce event sourcing merely because chronological recalculation exists.
11. Do not introduce queues or background jobs for correctness-critical confirmation paths unless necessary.
12. Use background processing only for non-authoritative or retryable work.
13. Prefer explicit constraints and deterministic behavior over hidden automation.
14. Architecture may optimize computation but must preserve explanation and invariant semantics.
15. Treat security, privacy, backup, and restore as baseline concerns, not post-launch additions.

## 7. Quality Attribute Priorities

| Priority | Quality Attribute | Why It Matters | Measurable or Reviewable Architecture Consequence | Trade-off It May Override |
|---:|---|---|---|---|
| 1 | Financial correctness | Users must be able to trust every confirmed amount and state | All 26 invariant rows and financial behaviors receive automated domain, transaction, and property coverage; no partial commit is possible | Throughput, convenience, and delivery speed |
| 2 | Traceability | Users must explain accepted effects and corrections | Stable identities, replacement links, immutable versions, lifecycle evidence, and formula contribution views are retained | Minimal storage and presentation simplicity |
| 3 | Workspace privacy and isolation | One owner's financial data must never reach another Workspace | Server-derived scope, RLS, composite scope constraints, and adversarial isolation tests | Query convenience and privileged operational access |
| 4 | Deterministic behavior | The same facts must always produce the same financial history | Event Date/position ordering and pure recalculation properties are tested across concurrency and backdating | Timestamp shortcuts and unconstrained parallel writes |
| 5 | Recoverability | A beta must survive mistakes, failed releases, and provider incidents | Automated backup/PITR, pre-beta restore drill, rollback runbooks, and portable exports | Cheapest infrastructure and fastest schema change |
| 6 | Testability | Complex correction and chronology need evidence before release | Framework-free domain core, real PostgreSQL integration, deterministic fixtures, and CI gates | Framework coupling and manual-only acceptance |
| 7 | Maintainability | Small-team changes must preserve boundaries and intent | Inward dependencies, module ownership, architecture checks, and reviewed migrations | Premature abstraction and short-term cross-module imports |
| 8 | Security | Authentication and financial data create an attractive failure surface | Managed credentials, secure sessions, least privilege, supply-chain checks, and redacted telemetry | Frictionless but unsafe access and debug logging |
| 9 | Operational simplicity | Private Beta cannot justify a distributed operations burden | One API, one database, managed providers, no queue/Kubernetes, and concise runbooks | Independent service scaling and infrastructure flexibility |
| 10 | Performance appropriate for Private Beta | Core workflows should feel responsive without invented scale targets | Implementation-time latency budgets, indexed affected slices, and measurement before new projections/caches | Premature scale machinery; never correctness or traceability |
| 11 | Accessibility and responsive usability | The product must work clearly on mobile and desktop for its intended users | Keyboard, focus, contrast, semantic, responsive, and browser tests gate release | Visual novelty and desktop-only optimization |
| 12 | Cost control | A private beta must remain economical to operate and change | Managed entry tiers, bounded telemetry, single-region deployment, and cost review before optional infrastructure | Redundant scale capacity not justified by recovery needs |

The ordering is intentional. A lower-priority optimization cannot weaken a higher-priority quality attribute.

## 8. Architecture Decision Summary

The register contains 66 unique Architecture decisions: 35 Adopted Candidate Baseline, 4 Architecture Constraint, 6 Implementation-Time Selection, 3 Deferred Post-MVP, and 18 Rejected for v1.

| Architecture Decision ID | Topic | Status | Selected Baseline | Alternatives Considered | Main Reason | Domain Constraints Preserved | Implementation-Time Detail | Reconsideration Trigger | Source References |
|---|---|---|---|---|---|---|---|---|---|
| ARCH-SHAPE-01 | System shape | Adopted Candidate Baseline | Web plus separate modular-monolith API in one monorepo | Full-stack only; distributed services | Clear server authority with small operations | Atomic financial outcomes; domain/module separation | Physical provider layout | Separation proves needless or scale requires distribution | PI §§3–7; PRD §§21–24; EDS §§31–35 |
| ARCH-STACK-01 | Language | Adopted Candidate Baseline | Strict TypeScript across web/API/contracts | Mixed-language backend | Low delivery and contract friction | Framework-independent domain meaning | Exact supported versions | Workload or staffing evidence | PRD §24; EDS §§31–35 |
| ARCH-STACK-02 | Workspace tooling | Adopted Candidate Baseline | pnpm workspaces plus Turborepo | npm workspaces; Nx | Small explicit task graph | Enforce inward dependencies | Exact versions and cache config | Boundary/CI needs exceed tools | CLAUDE §5; EDS §§31–35 |
| ARCH-REPO-01 | Repository structure | Adopted Candidate Baseline | `apps`, limited `packages`, `database`, `infra`, `scripts`, `docs` | Single app tree; package per concept | Clear reuse and ownership without package sprawl | Domain source remains separate; modules not services | Exact subdirectories | Real reuse boundaries differ | AGG §§6–16,23; EDS §§31–35 |
| ARCH-WEB-01 | Web framework | Adopted Candidate Baseline | Next.js with React | React SPA; server templates | Responsive ecosystem and server-assisted auth | Browser is non-authoritative | Exact versions/rendering tuning | Complexity outweighs benefit | PI §§5–7; PRD §§21–24 |
| ARCH-API-01 | API runtime | Adopted Candidate Baseline | Node.js, NestJS, Fastify adapter | Fastify alone; Express adapter | Explicit modular seams | One authoritative write path; domain outside framework | Exact versions/adapter setup | Framework distorts domain modules | EDS §§26–35; AGG §§16,20,23 |
| ARCH-MODULE-01 | Backend modules | Adopted Candidate Baseline | Identity/Workspace, Account, Category, Fund, Debt, Event, Reporting, Traceability | One Finance module; service per concept | Align responsibility without distribution | Candidate participation and cross-boundary rules | Import-boundary tooling | Domain review changes responsibility | AGG §§6–16,20,23; DDR DEC-AGG-01…05 |
| ARCH-DATA-01 | Database | Adopted Candidate Baseline | PostgreSQL primary | Document or embedded database | Transactions, references, locks, RLS, recovery | Atomicity and Workspace scope | Supported major version/provider | Relational model disproven | PRD §§9–20; EDS §§7–30 |
| ARCH-DATA-02 | Data access/migrations | Adopted Candidate Baseline | Drizzle plus reviewed SQL migrations | Prisma; SQL only | Typed access without hiding SQL | Constraints remain explicit | Exact versions/migration commands | Lock/RLS/query support falls short | EDS §§31–35; DDR §26 |
| ARCH-VALID-01 | Validation | Adopted Candidate Baseline | Zod at transport/config boundaries | Decorator or duplicate validators | Composable validated contracts | API validation cannot replace domain evaluation | Schema organization/messages | Integration becomes unsafe | EDS §§26–30 |
| ARCH-AUTH-01 | Identity category | Adopted Candidate Baseline | Managed email/password identity | Self-hosted library; custom credentials | Secure verification/recovery with small operations | One verified User and Workspace | Provider selection | Privacy/cost/availability failure | PRD §§6,20; EDS §§5,13 |
| ARCH-AUTH-02 | Session | Adopted Candidate Baseline | Opaque secure HttpOnly cookie session | Browser bearer token; long JWT | Limits token exposure and permits revocation | Server-side authorization | Provider-specific revocation/cookie integration | Provider cannot satisfy constraints | PRD §20; EDS §§5,13 |
| ARCH-ISO-01 | Workspace isolation | Adopted Candidate Baseline | Server scoping plus PostgreSQL RLS | Application only; RLS only | Defense in depth | Every read/write/reference is Workspace-scoped | Transaction-context mechanics | Pool/provider cannot make context safe | PRD §§6,20; EDS §§5,11,13 |
| ARCH-ACCESS-01 | Private Beta access gate | Adopted Candidate Baseline | Server-authoritative Private Beta access entitlement, consumed atomically together with local User mapping, Workspace establishment, and starter Account creation as one onboarding outcome, required before first Workspace creation | Email verification alone as authorization; client-declared eligibility flag; entitlement consumption as a separate non-atomic step | Prevents uninvited identities from establishing a financial Workspace and prevents a failed onboarding attempt from silently consuming an entitlement without creating a Workspace | Client never authors access eligibility; every accepted invitation still creates exactly one private, single-owner Workspace; one external identity subject maps to at most one local User who owns exactly one Workspace; an entitlement produces at most one successful onboarding outcome; concurrent or retried redemption cannot create duplicate outcomes | Exact token/allowlist/entitlement representation, issuance mechanism, and single-use consumption record shape | Beta admission policy changes (e.g., open signup) | PRD §§6,20; EDS §§5,13 |
| ARCH-PERSIST-01 | Persistence | Adopted Candidate Baseline | Normalized facts plus limited transactional projections | Event sourcing; all-derived; denormalized | Explainable facts with predictable critical reads | Formulas, lifecycle, stable references | Physical schema/indexes | Projection/query evidence changes balance | EDS §§7–25; DDR §26 |
| ARCH-REP-01 | Primitive representation | Adopted Candidate Baseline | UUID identifiers; PostgreSQL BIGINT-equivalent whole-Rupiah integer storage; backend domain/application `bigint` (or equivalent exact-integer abstraction); base-10 integer-string amounts at REST/JSON boundaries; exact-integer handling in the frontend; local dates; UTC instants | Sequential IDs; floating-point money; native JSON `number` for amounts; local timestamps | Exact money end to end and explicit time semantics; JavaScript floating-point `number` is forbidden for authoritative monetary arithmetic in any layer | IDR, Asia/Jakarta, stable identity, whole-Rupiah exactness across PostgreSQL/backend/transport/web | Library/database bigint mapping and string-serialization helpers | Currency/offline rules change | PRD §§9,16–18; EDS §§7–9,11 |
| ARCH-ORDER-01 | Chronology | Adopted Candidate Baseline | Workspace monotonic confirmation position | Timestamp; global sortable ID; user order | Exact deterministic tie-break | Edit/restore preserve; replacement renews | Counter/lock physical schema | Domain ordering changes | DDR DEC-ORDER-01; EDS §§9,12,20 |
| ARCH-TXN-01 | Consistency | Adopted Candidate Baseline | One PostgreSQL transaction per confirmed behavior | Saga; eventual; multi-step commit | Required all-or-nothing result | All local/cross-boundary invariants | Transaction adapter/lock queries | Authority deliberately splits after review | EDS §§10–11,20–22,26–30 |
| ARCH-RECALC-01 | Recalculation | Adopted Candidate Baseline | Targeted affected-history recalculation | Full replay; event sourcing; ad hoc mutation | Domain-aligned bounded work | Every affected point validated; no exclusion | Query plan/performance budget | Full replay measures safer and bounded | EDS §§22,27–30; DDR DEC-LIFE-05 |
| ARCH-DERIVED-01 | Derived values | Adopted Candidate Baseline | Hybrid materialized current state and calculated reads | Cache all; calculate all | Fast validation with traceable cheap totals | Six formulas and cross-view agreement | Index/projection tuning | Measured query/contention threshold | EDS §§23,25,29–30 |
| ARCH-LIFE-01 | Lifecycle/correction | Adopted Candidate Baseline | Explicit state and immutable change evidence | Hard delete; hidden mutation; workflow engine | Preserves correction and recovery | Trash indefinite; restoration revalidates | Physical status/action representation | Domain lifecycle changes | PRD §16; EDS §§10,20–21,24 |
| ARCH-TRACE-01 | Historical names | Adopted Candidate Baseline | Stable reference with current-name display | Event snapshot; full label history | Smallest truthful v1 choice | Identity survives rename/archive | Rename-audit presentation | Beta trust/regulation needs old labels | DDR DEC-TRACE-01; EDS §§24,31 |
| ARCH-TRACE-02 | Prior edit values | Adopted Candidate Baseline | Complete immutable event versions | Metadata only; previous only | Strong correction explanation at beta volume | Replacement remains linked identities | Version storage/retention details | Privacy/storage cost outweighs benefit | DDR DEC-TRACE-02; PRD §16 |
| ARCH-INTERACT-01 | Interaction style | Adopted Candidate Baseline | Versioned REST/JSON with preview then confirm | RPC; GraphQL; server actions only | Inspectable behavior/error boundary | Workspace derived server-side; blockers preserved | Routes/payloads/version policy | Client diversity/query needs change | PRD §§16,21; EDS §§26–30 |
| ARCH-FRONT-01 | Frontend state | Adopted Candidate Baseline | TanStack Query remote state and React Hook Form local state | Global ledger; custom fetching | Avoids browser financial authority | Only confirmed server outcomes displayed | Component/query design | Interaction complexity proves need | PRD §§21–24; EDS §§28–30 |
| ARCH-ASYNC-01 | Background work | Adopted Candidate Baseline | No general-purpose queue or worker fleet. Financial Event acceptance, confirmation-position assignment, recalculation, and financial projection maintenance remain synchronous. Narrowly scoped export processing and authoritative owner-account deletion orchestration may be introduced only when selected through ARCH-PRIV-01 | Queue/worker at launch | Correctness is synchronous; volume is small; owner-account deletion is authoritative privacy/account lifecycle, not Financial Event acceptance, and its possible asynchronous orchestration does not make financial confirmation asynchronous | Acceptance/position/state commit synchronously | Export threshold/scheduler facility and owner-account-deletion orchestration mechanism, both selected via ARCH-PRIV-01; no queue or worker technology is selected here | Durable backlog or timeout evidence | EDS §§20–24,31–35 |
| ARCH-CONC-01 | Concurrency | Adopted Candidate Baseline | Workspace write serialization plus entity versions | Optimistic only; serializable only; last-write-wins | Deterministic chronology and stale-write safety | Invariants revalidated under lock | Lock primitive and retry limit | Lock contention exceeds budget | EDS §§9,20,27–30 |
| ARCH-IDEMP-01 | Idempotency | Adopted Candidate Baseline | Workspace-scoped confirm idempotency | Client deduplication only | Prevents retry duplicates | One accepted event/effect | Token transport/retention | Equivalent stronger protocol | EDS §§20–21,27–30 |
| ARCH-SEC-01 | Security/privacy | Adopted Candidate Baseline | Layered web, app, database, and operational controls | Perimeter only | Financial privacy requires depth | Isolation, least privilege, redaction | Provider controls/rate budgets | Threat model/topology changes | PI §§5–7; PRD §§20,24 |
| ARCH-OBS-01 | Observability | Adopted Candidate Baseline | Redacted logs, metrics, traces, readiness signals | Raw payload logs; logs only | Diagnosis without sensitive ledger | Post-hoc mismatch never changes state | Provider/dashboards/alerts | Incidents expose missing safe signals | PRD §§19,24; EDS §§6,11,24,28 |
| ARCH-TEST-01 | Testing | Adopted Candidate Baseline | Domain-heavy pyramid plus real PostgreSQL and browser tests | Unit only; E2E only | Broad invariant evidence and real transaction proof | 55 behaviors, 26 invariants, 37 examples, 32 properties | Suite partition/CI parallelism | Defect evidence changes balance | EDS §§11,26,28–30 |
| ARCH-DEV-01 | Local development | Adopted Candidate Baseline | Deterministic monorepo commands and Compose PostgreSQL | Native services; local Kubernetes | Reproducible with small overhead | Real database semantics | Dev scripts/seeds | Team environment differs | CLAUDE §§3–5; EDS §35 |
| ARCH-CI-01 | Continuous integration | Adopted Candidate Baseline | Hosted PR checks across quality/security/migration gates | Manual; deploy-first | Stops regression before merge | Domain/Architecture checks must pass | Exact CI product/workflow | Hosting/compliance needs differ | CLAUDE §§3–5; EDS §35 |
| ARCH-DEPLOY-01 | Deployment | Adopted Candidate Baseline | Managed web, API container, PostgreSQL in one region | Single host; serverless-only; Kubernetes | Small operations and database locality | One authoritative database/transaction | Vendors/region/scaling | Availability or scale evidence | PRD §§23–24; EDS §§34–35 |
| ARCH-BACKUP-01 | Recovery/portability | Adopted Candidate Baseline | Automated backup/PITR, restore drills, portable export | Backup only; app-level copies | Recoverability and provider exit | Facts, versions, Trash, audit retained | Provider RPO/RTO capability | Risk target/provider changes | PI §§5,13; PRD §§19,24 |
| ARCH-CONTRACT-01 | Closed behavior set | Architecture Constraint | Exactly six Event Types and normative outcomes | Technical subtype expansion | Fixed domain baseline | No seventh Event Type or new domain behavior | None | Explicit domain review | EDS §§6,18,26 |
| ARCH-CONTRACT-02 | Atomic acceptance | Architecture Constraint | Synchronous complete cross-boundary outcome | Partial/compensating acceptance | Fixed financial invariants | No partial Account/Fund/Debt/Event state | None | Explicit domain review | EDS §§10–11,20–22 |
| ARCH-CONTRACT-03 | Accepted history | Architecture Constraint | Never silently remove or retroactively unaccept | Hide/rollback on disagreement | Fixed traceability semantics | Post-hoc mismatch blocks readiness only | None | Explicit domain review | EDS §§6,11,24,28 |
| ARCH-CONTRACT-04 | v1 policy | Architecture Constraint | IDR and Asia/Jakarta only | Multi-currency/timezone | Fixed v1 scope | Exact money/date/report semantics | None | Explicit product/domain review | PRD §§8–9,17–18 |
| ARCH-IMPL-01 | Version pins | Implementation-Time Selection | Verify supported compatible releases | Unverified pins | No technical baseline exists | Cannot change selected categories | Exact versions | Session 24 verification | Repository baseline; EDS §§31–35 |
| ARCH-IMPL-02 | Vendors | Implementation-Time Selection | Select identity/hosting/database/email/telemetry vendors | Premature named vendors | Procurement evidence absent | Must meet security, export, recovery criteria | Vendor contracts | Session 24 evaluation | PRD §§20,23–24 |
| ARCH-IMPL-03 | Region | Implementation-Time Selection | Nearest mutually supported production region | Premature region promise | Provider set absent | Asia/Jakarta business policy unchanged | Residency/latency verification | Provider selection | PRD §§17–18,24 |
| ARCH-IMPL-04 | Budgets/thresholds | Implementation-Time Selection | Define latency/load/export thresholds before code | Invented scale targets | No observed beta load | Correctness outranks performance | Numeric budgets | Implementation planning | PI §13; PRD §§23–24 |
| ARCH-IMPL-05 | CI/deploy product | Implementation-Time Selection | Choose hosted automation product | Self-hosted by default | Remote hosting unverified | Required gates and rollback remain | Product/workflow syntax | Session 24 context | CLAUDE §§3–5 |
| ARCH-PRIV-01 | Export and owner-account deletion delivery | Implementation-Time Selection | Architecture supports complete, auditable handling across identity mapping, Workspace, authoritative financial facts, derived projections, immutable versions, audit/lifecycle evidence, generated exports, provider mappings, and backups subject to documented retention limitations. Owner-account deletion is an authoritative privacy and account-lifecycle operation, separate from Financial Event acceptance | Immediate self-service at launch; deferred entirely post-beta; treating deletion cleanup as non-authoritative background work | No procurement/legal timeline exists at Architecture time | Accepted history, versions, and audit evidence remain intact until an explicit deletion decision executes; deletion never reinterprets, corrects, or independently accepts a Financial Event | Self-service vs. auditable manual request; exact retention period; cleanup orchestration; backup erasure timing | Session 24 selects delivery mode and timeline explicitly | PRD §§16,20,24; EDS §24 |
| ARCH-POST-01 | Queue/workers | Deferred Post-MVP | No durable queue/fleet in v1 | Launch with workers | No correctness need | Async cannot author financial state | Future platform | Durable backlog/timeout evidence | EDS §§31–35 |
| ARCH-POST-02 | Search/warehouse | Deferred Post-MVP | PostgreSQL reporting in v1 | Search engine/warehouse | Private Beta scope | Reports remain traceable to facts | Future analytical platform | Query/scale evidence | PRD §§17–19; EDS §23 |
| ARCH-POST-03 | Historical labels | Deferred Post-MVP | Current-name display in v1 | Snapshot/full history now | Domain does not require old labels | Stable identity always resolves | Future retention/presentation | User/regulatory evidence | DDR DEC-TRACE-01 |
| ARCH-REJ-01 | Microservices | Rejected for v1 | Modular monolith | Distributed stores/services | Avoid distributed consistency/ops | One atomic outcome | None | Independent teams/scaling | EDS §§31–35; AGG §23 |
| ARCH-REJ-02 | Event sourcing | Rejected for v1 | Facts plus projections/versions | Event log as primary store | Replay architecture not required | Recalculation is not event sourcing | None | Stronger temporal requirement | EDS §§22,31; DDR §23 |
| ARCH-REJ-03 | Client authority | Rejected for v1 | Server/database authority | Browser/local ledger | Protect isolation/recovery | Browser cannot accept financial state | None | Explicit offline-first review | PRD §§20–24 |
| ARCH-REJ-04 | Timestamp chronology | Rejected for v1 | Workspace confirmation position | Timestamp/sortable ID | Cannot guarantee tie semantics | Immutable Workspace order | None | Domain ordering changes | DDR DEC-ORDER-01; EDS §§9,12 |
| ARCH-REJ-05 | Eventual consistency | Rejected for v1 | One database transaction | Saga/compensation | Would expose partial state | All-or-nothing cross-boundary acceptance | None | Authority splits after review | EDS §§10–11,20–22 |
| ARCH-REJ-06 | Full replay | Rejected for v1 | Targeted recalculation | Replay all Workspace history | Unneeded lock/work | Only affected history reevaluated | None | Measurements prove safer | EDS §§22,27–30 |
| ARCH-REJ-07 | Financial cache | Rejected for v1 | Direct reads/projections | Redis/generic cache | Adds mismatch modes | Dashboard/detail agreement | None | Query/index tuning fails | PRD §19; EDS §§24,28 |
| ARCH-REJ-08 | Self-hosted passwords | Rejected for v1 | Managed identity | Local credential store | Avoid security operations | Recovery/verification/session security | None | Provider requirements fail | PRD §20 |
| ARCH-REJ-09 | Kubernetes/multi-region | Rejected for v1 | Managed single region | Cluster/active-active | Unjustified complexity | Transactional locality | None | Availability/scale need | PRD §§23–24 |
| ARCH-REJ-10 | Permanent Trash deletion | Rejected for v1 | Indefinite recoverable Trash | Hard delete/expiry | Contradicts lifecycle | No v1 permanent deletion/expiry | None | Post-MVP domain decision | DDR DEC-LIFE-02/03; EDS §10 |
| ARCH-REJ-11 | Floating-point money | Rejected for v1 | Integer whole Rupiah | Binary floating point | Inexact financial arithmetic | Whole-Rupiah exactness | None | Currency policy changes representation need | PRD §9; EDS §§7,11 |
| ARCH-REJ-12 | Last-write-wins | Rejected for v1 | Locks, versions, idempotency | Unrestricted overwrite | Loses confirmed/correction intent | Stale proposals block | None | No acceptable v1 trigger | EDS §§20–22,27–30 |
| ARCH-REJ-13 | Allocation lots/FIFO/LIFO | Rejected for v1 | Account–Fund pair current amount | Lots/consumption ordering | Explicitly excluded domain model | No allocation identity/cross-account consumption | None | Explicit domain review | DDR DEC-ALLOC-02; EDS §§16,26 |
| ARCH-REJ-14 | Redis/Kafka mandatory | Rejected for v1 | PostgreSQL and synchronous API | Cache/broker infrastructure | No demonstrated v1 need | One authoritative path | None | Proven queue/cache need | EDS §§31–35 |
| ARCH-REJ-15 | Elasticsearch/warehouse | Rejected for v1 | PostgreSQL reporting | Search/analytics platform | Excess Private Beta surface | Reporting traces to authoritative facts | None | Reporting scale requires | PRD §§17–19 |
| ARCH-REJ-16 | One giant Workspace object | Rejected for v1 | Narrow modules/participants | Workspace owns all history | Oversized lock/model boundary | Candidate responsibilities remain narrow | None | Explicit domain review | AGG §§17,23; DDR DEC-AGG-01 |
| ARCH-REJ-17 | Unscoped schema | Rejected for v1 | Workspace-owned authoritative rows/relationships | Implicit ownership only | Enables cross-owner leakage | Workspace isolation everywhere | None | No acceptable trigger | PRD §§6,20; EDS §§5,13 |
| ARCH-REJ-18 | Desktop/local-first authority | Rejected for v1 | Managed web/server authority | Embedded local database/sync | Offline sync not required | Recovery and isolation remain server-backed | None | Explicit offline-first product decision | PI §§3–7; PRD §§21–24 |

## 9. System Context

The Private Beta system has one primary human actor: an authenticated individual owner of exactly one Workspace. Before that Workspace can be created, the API also resolves and consumes a server-authoritative Private Beta access entitlement (ARCH-ACCESS-01); email verification alone does not authorize Workspace establishment. External runtime dependencies are limited to a managed identity service, transactional email delivery, managed hosting, managed PostgreSQL, and redacted telemetry. No bank, payment network, accounting platform, or third-party financial-data feed is integrated in v1.

```text
User browser
    |
    v
Responsive web application ---- Managed identity/email
    |
    v
Modular-monolith API ----------- Redacted telemetry
    |
    v
Managed PostgreSQL
```

The API is the only authoritative financial-write entry point. The web application is not an accounting authority, and external providers never decide domain acceptance.

## 10. Selected System Shape

Three realistic shapes were evaluated:

| Option | Shape | Strength | Primary Cost | Result |
|---|---|---|---|---|
| A | Full-stack web runtime with domain logic and web rendering in one deployable | Smallest deployment count | Web framework becomes the financial application boundary; worker/API separation is harder later | Rejected for v1 |
| B | Responsive web application plus separate API in one monorepo; API is one modular monolith | Clear server authority, testable domain boundary, small operations | Two deployables and explicit contracts | Adopted Candidate Baseline |
| C | Distributed backend services with independently deployed financial modules | Independent scaling and ownership | Distributed transactions, eventual-state pressure, and high operational cost | Rejected for v1 |

Option B is selected. It gives strong financial logic an explicit backend home, supports independent browser/API testing, and keeps all financial modules inside one modular-monolith deployment boundary with one database transaction capability. Logical browser, web, API, module, and database boundaries are distinct even when a provider co-locates physical runtimes. Compared with Option A, the extra contract and deployable cost is accepted for clearer authority and future mobile-client compatibility. Compared with Option C, it retains extensibility through modules without distributed consistency or operations.

## 11. Technology Stack Baseline

| Area | Selected Baseline | Why | At Least One Alternative |
|---|---|---|---|
| Language | TypeScript, strict mode | Shared language, strong tooling, controlled contracts | Mixed-language backend |
| Runtime | Supported Node.js active LTS | Mature web runtime; exact release verified later | Alternative server runtime |
| Workspace | pnpm workspaces + Turborepo | Explicit packages and cached task graph | npm workspaces, Nx |
| Web | Next.js + React | Responsive routing, server-assisted auth, accessibility ecosystem | SPA-only React |
| API | NestJS with Fastify adapter | Modular structure and transport separation | Fastify alone |
| Database | PostgreSQL | Transactions, constraints, row locks, RLS, recovery | Document database |
| Data access | Drizzle ORM/query layer + SQL migrations | Typed but SQL-visible relational control | Prisma, handwritten SQL |
| Schema migration | Drizzle Kit-generated/reviewed SQL migration history | Versioned SQL remains inspectable and CI-testable | Application-startup schema synchronization |
| Boundary validation | Zod | Composable request/config schemas | Decorator validation |
| Authentication/session | Managed identity plus opaque server-verified cookie session | Secure recovery/verification with small operational burden | Self-hosted auth library |
| Domain tests | Vitest + fast-check | Fast examples and properties | Jest without property framework |
| Database integration | Testcontainers with PostgreSQL | Exercises actual transaction/policy behavior | In-memory substitute |
| Browser testing | Playwright with accessibility checks | Cross-browser responsive workflows | Manual browser-only testing |
| Local services | Docker Compose for PostgreSQL and optional mail catcher | Reproducible infrastructure without local orchestration | Local Kubernetes |
| CI category | Hosted pull-request CI | Enforce deterministic gates without self-managed runners | Manual/local-only checks |
| Production hosting | Managed web hosting + managed API container + managed PostgreSQL | Small operational footprint with transactional locality | Single VM, Kubernetes |
| Object storage | Not required by the initial v1 baseline | Small exports can stream; avoids unused infrastructure | Mandatory object storage from launch |

Domain logic remains framework-independent TypeScript. Framework decorators, HTTP request types, ORM row types, and provider SDK objects do not cross into the domain core.

Monetary amounts are whole-Rupiah exact integers end to end: PostgreSQL stores a BIGINT-equivalent column, the backend domain/application layer represents amounts as `bigint` (or an equivalent exact-integer abstraction), and REST/JSON transport serializes amounts as base-10 integer strings rather than a native JSON `number`. JavaScript's floating-point `number` type is prohibited for authoritative monetary arithmetic anywhere in this path; `parseFloat` or any floating-point conversion of an amount is forbidden in financial paths. Display formatting (e.g., `Intl.NumberFormat`) is a presentation concern only and is never the arithmetic source of truth.

## 12. Repository and Workspace Structure

The Session 24 implementation plan should establish this logical structure without treating it as a detailed file inventory:

```text
apps/
  web/                 responsive Next.js application
  api/                 NestJS/Fastify modular-monolith runtime
packages/
  domain/              framework-independent rules, calculations, and types
  contracts/           versioned transport schemas and generated/shared types
  config/              validated build/runtime configuration
  test-support/        cross-package fixtures and invariant helpers
database/
  migrations/          reviewed SQL migration history
  seeds/               non-production development/test seed support
docs/
  architecture/        Architecture baselines and later explicit decisions
  domain/              authoritative domain artifacts
  product/             authoritative product artifacts
  project/             workflow navigation
infra/
  local/               local Compose and service configuration
scripts/               repository-level deterministic development and CI helpers
```

Dependency direction is inward and one-directional: runtime adapters depend on application coordination and domain code; domain code depends on neither framework nor persistence. `apps/web` MUST NOT import `packages/domain` or any backend application-coordination module; authoritative domain evaluation — recalculation, balance formulas, and acceptance/blocking logic — runs only inside the API/backend boundary. `apps/web` may import `packages/contracts` (versioned transport schemas and shared types), presentation-safe types, and formatting utilities only; `contracts` shares transport syntax and validation shape and must never become a second implementation of domain rules. Workspace tooling must prevent accidental import of API internals or `packages/domain` into the web application, and this boundary is verified by an automated architecture-boundary check (Section 33).

## 13. Runtime Container Responsibilities

| Runtime | Responsibility and Authoritative Data | Inbound / Outbound Interactions | Trust Boundary | Failure Impact | v1 |
|---|---|---|---|---|---|
| Browser/Web UI | Render responsive interaction and hold only transient form/query state; no authoritative financial data | Human input and HTTPS responses / authenticated HTTPS proposals and reads | Untrusted client; may never decide acceptance or Workspace scope | Current interaction unavailable or stale; confirmed server state remains safe | Yes |
| Web runtime | Route/render the product shell and mediate secure session use; no authoritative financial data | Browser HTTPS / API and identity calls | Internet-facing presentation boundary; cannot write PostgreSQL | UI unavailable; API/database state remains intact | Yes |
| Backend/API | Authenticate, authorize, coordinate domain evaluation, transactions, recalculation, audit, and reads; authoritative application decision path | Web HTTPS / PostgreSQL, identity, redacted telemetry | Trusted application boundary after verified identity; never trusts client financial results | Confirmations and reads unavailable; no partial commit may escape | Yes |
| PostgreSQL | Persist authoritative facts, constraints, projections, immutable versions, and RLS policy state | API/migration/backup connections / transactional results and backups | Highest-value data boundary with separate least-privilege roles | Product unavailable; recovery follows backup/PITR runbook | Yes |
| Managed identity/email | Hold credential/session primitives and deliver authentication mail; no financial data | Browser/API auth flows / verified subject/session and email | External provider boundary; local application remains authorization authority | New/recovered sessions may fail; existing handling follows provider semantics | Yes |
| Local support services | Development PostgreSQL and optional mail catcher; disposable non-production data only | Developer/test processes / local equivalents | Developer machine only; never connected to production | Local workflow affected only | Local only |
| Telemetry provider | Hold redacted operational events and alerts; no authoritative audit or financial payload | Web/API allowlisted signals / dashboards and alerts | External observability boundary | Diagnosis degrades; domain state remains unaffected | Yes |

## 14. Module Boundary Baseline

The backend remains one deployable but has explicit modules:

| Module | Owned Responsibility / Public Capabilities | May Authoritatively Change | May Read / Cross-Module Interaction | Protected Invariants | Prohibited Responsibility |
|---|---|---|---|---|---|
| Identity and Workspace | Resolve verified User, atomically consume the Private Beta access entitlement together with establishing the single Workspace and starter onboarding baseline as one onboarding outcome, authorize Workspace-scoped application capabilities | User-subject mapping, access-entitlement consumption, Workspace ownership/configuration through one coordinated atomic onboarding behavior | Identity provider; onboarding Account participation; Reporting configuration | Exactly one owner/Workspace mapping, verified scope, configuration validity, no Workspace created without a valid unconsumed access entitlement, no entitlement consumed without a resulting Workspace, at most one successful onboarding outcome per entitlement and per subject | Financial-event acceptance, trusting browser Workspace input, trusting client-declared beta eligibility, or consuming an entitlement independently of Workspace establishment |
| Account | Create/rename/archive/restore/delete eligible Accounts; propose opening-state changes | Account identity, lifecycle, opening baseline, Account projections inside coordination | Financial Event chronology; Fund pair facts; Workspace configuration | Effective-date constraint, nonnegative Total/Unallocated, allocation equation | Confirming cross-boundary events alone |
| Category | Manage Income/Expense Category identity, stable kind, lifecycle, and eligible references | Category definition and lifecycle | Referencing Financial Events for eligibility/deletion | Kind immutability and historical reference resolvability | Monetary balance or event-type ownership |
| Dedicated Fund | Manage fund identity/lifecycle/goal and participate in allocation/release/linked-expense behavior | Fund definition/lifecycle and its side of pair allocations inside coordination | Account pair state and Financial Event history | Fund breakdown, nonnegative Fund Balance, Rp0 archive rule | Cross-Account automatic consumption or allocation lots |
| Debt | Manage Debt Record opening baseline/deletion and participate in repayment | Debt definition and Outstanding Principal projection inside coordination | Account and Debt Repayment history | Effective-date/principal rules, nonnegative Outstanding Principal, deletion eligibility | New borrowing events or Debt archive lifecycle |
| Financial Event | Propose/confirm/read the closed six types; edit, replace, Trash, and restore | Event identity/form/references/lifecycle/position and immutable event versions inside coordination | Account, Category, Fund, Debt facts and Reporting grouping | Closed type set, reference/form/lifecycle/chronology semantics | Confirming participant monetary state independently |
| Reporting | Read dashboards/reports; manage Reporting Period through preview/confirmation | Reporting Period configuration through coordinated behavior; no financial facts | Active events, Account/Fund/Debt projections, historical ranges | Period rules, retroactive regrouping, dashboard/detail agreement | Changing financial history to make reports agree |
| Traceability/Audit | Explain current/historical effects and correction/lifecycle actions; expose release readiness | Immutable change/action evidence and technical release-readiness status | Every module's stable references and contributions | No lost accepted history; pre-confirmation/post-hoc disagreement semantics | Treating logs as financial history or retroactively unaccepting events |

These are code/module boundaries, not permission to redefine candidate aggregate roots. Cross-module behaviors are coordinated by an application layer inside the API and commit through one database transaction.

## 15. Domain-to-Architecture Mapping

| Domain Concept | Logical Module | Authoritative Persistence Responsibility | Domain / Coordination Role | Read-Model and Lifecycle Role | Constraints Preserved |
|---|---|---|---|---|---|
| Workspace | Identity and Workspace | Ownership, onboarding, configuration, write guard/counter | Isolation and narrow coordination context | Scopes every read; no archive lifecycle | One User/one Workspace; not a giant financial object |
| Account | Account | Identity, opening baseline/effective date, lifecycle, current projections | Monetary participant in event and correction transactions | Account detail/history; archive/restore/delete eligibility | Account equations, Rp0 archive, date constraint provider |
| Category | Category | Identity, immutable kind, lifecycle | Reference participant for Income/Expense | Category-filtered history; archive/restore/delete | Kind stability and historical resolvability |
| Dedicated Fund | Dedicated Fund | Identity, lifecycle, target facts | Shares allocation responsibility with Account | Fund detail/breakdown/goal; archive/restore/delete | Pair breakdown, Fund Balance, Rp0 archive |
| Account-Backed Fund Allocation | Account and Dedicated Fund | One current relationship per Account–Fund pair; no lot identity | Both modules participate in allocation/release/linked expense | Breakdown and Fund Balance contribution | No FIFO/LIFO/lots; no cross-Account consumption |
| Debt Record | Debt | Identity, effective date, opening principal, current projection | Participant in Debt Repayment and corrections | Debt detail/status/delete eligibility | Principal/date rules; derived Paid Off; no archive |
| Financial Event | Financial Event | Identity, type/form, references, lifecycle, position, versions, links | Coordinates with all monetary fact providers | Chronological history, Trash/replaced/current views | Six types, stable identity, deterministic chronology |
| Reporting Period | Identity and Workspace; Reporting | One active Workspace configuration | Regrouping change participates in preview/confirmation | Reporting-range grouping only | Retroactive regrouping without financial fact changes |
| Derived values | Account, Dedicated Fund, Debt, Reporting | Only named current projections persist; other values calculate on read | Recalculation and confirmation consume/produce them atomically | Dashboards, reports, goal, explanations | Formula sources agree; never independently editable |
| Traceability records | Traceability/Audit | Immutable event versions, action/lifecycle evidence, replacement links | Written in the same authoritative transaction | History/detail/change explanation and release readiness | Accepted history preserved; logs are non-authoritative |

No module is allowed to confirm its local portion while another participant rejects. The narrow Workspace responsibility remains narrow; Workspace is not turned into one oversized object containing all financial history.

## 16. Authentication and Session Architecture

The baseline uses a managed identity provider supporting email/password signup, email verification, password recovery, revocation, and secure session management. Annotasi Finance stores a stable external-subject mapping and local User/Workspace authorization facts; it does not store password hashes or recovery secrets.

Browser authentication uses an opaque `HttpOnly`, `Secure`, appropriately `SameSite` session cookie. Tokens are not stored in browser local storage. State-changing requests require origin/CSRF protection appropriate to the final same-site topology. The API verifies the session on every protected interaction and resolves the local User and Workspace server-side. Session revocation and password-reset consequences are enforced through the provider integration, with no financial data placed in identity-provider profile metadata.

The provider is an Implementation-Time Selection. Selection criteria are supported region, exportability of user identifiers, session revocation, verification/recovery behavior, security posture, availability, cost, and a documented provider-exit path.

After verification, the first successful onboarding transaction creates the local User-to-Workspace mapping and required starter Account baseline atomically. Later sessions resolve the existing mapping; they never create or select another Workspace from client input.

Email verification alone does not authorize local User/Workspace establishment. Before the onboarding transaction may create the local User-to-Workspace mapping and starter Account baseline, the API must resolve and consume a server-authoritative Private Beta access entitlement tied to the verified identity (ARCH-ACCESS-01). An invalid, absent, or already-consumed entitlement blocks Workspace creation regardless of verification status; the client never declares or asserts its own eligibility. Beta access invitation is a per-identity admission control only — it is not shared-Workspace or household invitation, and every accepted invitation still results in exactly one private, single-owner Workspace. The exact entitlement representation (signed token, allowlist row, invitation-code record, or equivalent) is an Implementation-Time Selection evaluated in Session 24.

Entitlement redemption, local User mapping creation, Workspace establishment, starter Account establishment, and entitlement consumption form one atomic onboarding outcome: either all parts succeed and commit together, or none becomes confirmed and the entitlement remains unconsumed. One external identity subject maps to at most one local User, and one local User owns exactly one Workspace. An entitlement can produce at most one successful onboarding outcome. A failed onboarding attempt must not consume the entitlement while leaving no Workspace created. Concurrent redemption attempts against the same entitlement or the same subject cannot create duplicate Users, Workspaces, starter Accounts, or consumption records; repeated identical onboarding requests are idempotent and return the same confirmed outcome. When the entitlement originates as a signed or externally issued value, the application persists its single-use local redemption as part of the same authoritative onboarding transaction, not as a separate step. The exact table, schema, constraint naming, and token format remain Session 24 selections.

## 17. Workspace Isolation and Authorization

Workspace isolation is enforced twice:

1. the API derives `workspace_id` from the verified User mapping and never accepts an authoritative Workspace identifier from the client for ordinary owner actions;
2. PostgreSQL row-level security restricts Workspace-scoped records using transaction-local identity context.

Every Workspace-owned authoritative record carries Workspace scope directly or participates in a database-enforced relationship that includes that scope. Cross-Workspace references are prevented with composite relationship constraints where applicable. Each database transaction sets and verifies the Workspace context before any scoped query. Connection-pool reuse must clear context through transaction scoping; no session-global tenant state is permitted.

Privileged migration, backup, and break-glass roles are separate from the application role, never used for normal requests, audited, and tested. Authorization tests must attempt cross-Workspace reads, writes, references, idempotency-key reuse, previews, exports, history access, telemetry correlation, and Private Beta access-entitlement misuse (uninvited, reused, or mismatched-subject entitlement attempts).

## 18. Persistence Architecture

PostgreSQL is the single source of persisted truth. The model is normalized around stable Workspace-scoped identities and explicit relationships. The persistence baseline has three categories:

- **Authoritative facts:** User/Workspace mapping, Private Beta entitlement consumption record, opening baselines and effective dates, Account/Category/Fund/Debt definitions and lifecycle, Reporting Period configuration, accepted Financial Events and references, immutable confirmation position, correction/replacement links, and lifecycle/change evidence.
- **Transactionally maintained current projections:** Total Account Balance, Account Unallocated Amount, current Account–Fund pair allocation, Debt Outstanding Principal, and the Workspace confirmation-position counter. These values are recomputable from authoritative facts and are never edited independently.
- **Calculated reads:** Workspace Total Balance, Fund Balance as the sum of current pair allocations, Goal completion, reporting-period totals, and traceability explanations unless measurements justify an additional reviewed projection.

Database constraints protect representational truths such as required references, uniqueness of stable identities, nonnegative stored projections, closed classifier values, Workspace relationship scope, and chronology-position uniqueness. Domain rules that require chronological context remain in framework-independent domain logic and are revalidated inside the same transaction; they are not approximated by isolated row constraints.

Event sourcing is not selected. Immutable Financial Event versions and lifecycle evidence provide auditability without making replay the primary persistence or runtime model.

Domain rules that evaluate this persisted state execute exclusively inside the API/backend boundary; the browser never reads PostgreSQL directly and never reimplements these formulas. Impact Preview results are always produced by the same authoritative calculation path (Section 22), never a client-side approximation.

Onboarding persistence follows the same one-transaction rule as any other confirmed behavior (Section 21): the User-subject mapping, Workspace creation, starter Account creation, and entitlement-consumption record are written and committed together, or none are. A uniqueness constraint prevents an entitlement or a subject from producing more than one committed onboarding outcome.

## 19. Identifier, Money, Date, and Time Representation

- **Identifiers:** UUIDs generated in the trusted server boundary. They are opaque; UI labels never become identity.
- **Money:** whole-Rupiah exact integers end to end. PostgreSQL stores amounts as a BIGINT-equivalent column; the backend domain/application layer represents amounts as `bigint` (or an equivalent exact-integer abstraction), never as a floating-point `number`; REST/JSON transport boundaries serialize amounts as base-10 integer strings, not native JSON numbers, so serialization and deserialization round-trip without precision loss; the frontend parses and holds these values as exact integers and never applies `parseFloat` or a floating-point conversion to an authoritative amount. No implicit maximum below the JavaScript safe-integer range is introduced by any layer. Display formatting (e.g., `Intl.NumberFormat`) is presentation only and is never the source of authoritative arithmetic. Bounds are validated before arithmetic and persistence.
- **Business dates:** ISO-8601 calendar dates represented without a time or UTC conversion. Event Date and effective dates are interpreted in the fixed Asia/Jakarta policy.
- **Instants:** UTC timestamps for created/updated/audit/session/operational timing, rendered in Asia/Jakarta for users where applicable.
- **Reporting boundaries:** computed as local calendar dates in Asia/Jakarta; UTC instants never decide reporting membership.
- **Ordering:** Event Date is primary and Workspace confirmation position is the immutable tie-breaker. Created/Updated timestamps are evidence only.

## 20. Financial Event Chronology Architecture

Each Workspace has a monotonically increasing confirmation-position counter. A new Financial Event obtains the next position in the same transaction that confirms the event. A uniqueness constraint over Workspace and position prevents duplicates. Per-Workspace financial-write serialization makes allocation deterministic even under concurrent requests.

Chronological queries order by Event Date, then confirmation position. Same-Type Edit preserves event identity and position even when Event Date changes. Replacement marks the old event replaced, creates a linked new identity, and allocates a new position. Soft Deletion retains the position with the Trashed event; Restoration reuses it. Neither timestamps nor database row order are a fallback ordering mechanism.

## 21. Transaction and Cross-Boundary Consistency

Every behavior that can change confirmed financial state executes as one PostgreSQL transaction:

1. authenticate and resolve Workspace;
2. acquire the Workspace financial-write guard and relevant entity rows;
3. load authoritative facts and the affected chronological slice;
4. validate references, lifecycle, dates, local invariants, and cross-boundary invariants;
5. perform targeted recalculation in memory using deterministic domain logic;
6. revalidate all affected chronological points;
7. write the Financial Event/lifecycle/configuration fact, projections, immutable version/audit evidence, idempotency outcome, and confirmation position as applicable;
8. commit once, then return the confirmed representation.

Any failure rolls back the entire proposed change. No participant commits early, no queue completes a financial effect, and no compensating action turns an invalid partial commit into a nominal success.

## 22. Chronological Recalculation Architecture

Recalculation is a deterministic domain calculation over the smallest complete affected history, not a maintenance script. The starting point is the earliest date/position whose accepted effect may change. The API loads later affected state in Event Date/position order, removes the old proposed contribution in the calculation model, applies the proposed new contribution, and validates every intermediate Account, allocation, Fund, and Debt state.

Impact Preview invokes the same calculation path without writes and returns the affected scope and old/new consequences required by the domain specification. Preview does not reserve acceptance. Confirmation reruns the calculation under the Workspace write lock and current entity versions; stale previews are rejected or refreshed rather than trusted.

If a proposed effective-date or event change would make an existing Financial Event invalid, or would violate a financial invariant at any affected point, confirmation is blocked and prior confirmed state remains intact. Existing Financial Events are never silently excluded from history. Recalculation output is deterministic for identical facts, lifecycle state, and ordering.

## 23. Derived Values and Reporting Architecture

The baseline uses a deliberate hybrid:

| Value | Strategy | Reason |
|---|---|---|
| Total Account Balance | Transactionally maintained projection | Central to most validations and reads |
| Account Unallocated Amount | Transactionally maintained projection | Required for allocation acceptance |
| Account–Fund current allocation | Transactionally maintained per pair | Required for release/expense checks and breakdown |
| Debt Outstanding Principal | Transactionally maintained projection | Required for repayment acceptance |
| Fund Balance | Calculate on read as pair-allocation sum | Cheap, preserves single breakdown source |
| Workspace Total Balance | Calculate on read as Account-total sum | Small owner-only set; avoids duplicate membership state |
| Goal completion | Calculate on read from Fund Balance and Target Amount | Pure derived state |
| Reporting totals | Query authoritative active event facts by Reporting Period | Preserves traceability and retroactive regrouping |

Indexes support Workspace/date/position, lifecycle, references, and reporting-range access. Additional projections require measured evidence, a rebuild procedure, invariant comparison, and explicit Architecture review. A post-hoc disagreement never changes accepted events or domain state; it marks release readiness blocked until resolved. Rebuilding a projection is repair of a technical derivative, not replay that re-decides domain acceptance.

## 24. Correction, Replacement, Trash, and Restoration Architecture

- **Same-Type Edit:** updates the current Financial Event representation, preserves identity and position, writes an immutable prior version, and recalculates atomically.
- **Replacement:** retains the old event as replaced, creates a linked event with a new identity and position, and applies one atomic old-effect removal/new-effect application.
- **Soft Deletion:** moves the event to Trash, retains its identity, references, position, and versions, and atomically removes its active effect through recalculation.
- **Restoration:** reuses the same event and position, revalidates current references/lifecycle/date/financial invariants, and atomically reapplies its effect when valid.
- **Archive/restore of references:** changes eligibility for new use without breaking historical resolution. It never silently removes old history.

There is no physical Financial Event deletion path, Trash expiry, automatic rollback, hidden-history cleanup, or asynchronous correction in v1.

## 25. Traceability, Change History, and Audit Architecture

Traceability is domain-facing evidence, not merely logs. The authoritative database retains:

- stable Financial Event identity and closed type/form;
- immutable original confirmation position;
- current lifecycle state and the transitions that produced it;
- linked old/new identities for Replacement;
- complete immutable versions for Same-Type Edit, including prior financial fields and references;
- actor User, Workspace, created/changed instants, and optional correction reason;
- the facts necessary to explain formulas and affected participant values.

Operational logs may point to opaque correlation, Workspace, event, and audit identifiers, but never replace this evidence. Sensitive values are omitted or redacted from telemetry.

Created Timestamp and Last Updated Timestamp remain explicit traceability metadata. Last Updated Timestamp and edited indication describe change timing; neither participates in financial chronology. Security/operational audit records capture access and runtime actions, while domain traceability records capture authoritative financial and lifecycle meaning.

## 26. Historical Name and Prior-Value Decisions

### ARCH-TRACE-01 — Historical names

**Decision:** Standard v1 history and detail views resolve Account, Category, Dedicated Fund, and Debt Record references by stable identity and display the current name. Event-time name snapshots and full entity-name history are not stored for display in v1.

**Rationale:** The domain contract requires references to survive rename/archive, not labels frozen at event time. Current-name display is the smallest truthful option and avoids duplicating names across every event. Rename audit metadata still records that a rename occurred, but does not promise event-time labeling.

**Trade-off:** A user viewing an old event sees today's name. Reconsider if Private Beta users cannot explain history after renames, if audit obligations require event-time labels, or if rename frequency is materially higher than assumed.

### ARCH-TRACE-02 — Prior same-type values

**Decision:** Retain complete immutable Financial Event version history for Same-Type Edit. Each accepted edit stores the full prior event representation plus change metadata; the current event representation remains the operational record. This is versioned-record persistence, not event sourcing.

**Rationale:** Corrections are trust-sensitive and expected data volume is small. Complete versions give deterministic before/after explanation and avoid an arbitrary one-version cutoff.

**Trade-off:** Storage and privacy-erasure procedures must cover versions. Reconsider if measured volume, retention obligations, or privacy burden materially exceed the traceability benefit. Event Replacement remains governed by linked identities rather than being collapsed into versions.

## 27. API and Interaction Architecture

The interaction boundary is versioned REST over JSON. Resources and workflow interactions express the domain vocabulary, but this baseline intentionally does not define routes, payload fields, handler names, or an OpenAPI contract.

Interaction categories are:

- authenticated resource reads and ordinary nonfinancial configuration changes;
- validation and Impact Preview for recalculation-bearing proposals;
- confirmation with an idempotency key and current version/preview evidence;
- history, traceability, reporting, export, and release-readiness reads.

Validation failures use stable machine-readable categories plus Indonesian user-facing messages. A blocked proposal is not an exceptional server failure. Responses include confirmed server state and versions needed for conflict handling. Pagination is cursor-based where histories can grow, ordered by domain chronology rather than database timestamps.

Wherever a request or response carries a monetary amount, the transport representation is a base-10 integer string in whole Rupiah, never a native JSON `number`; this is a representation rule (ARCH-REP-01), not a field-name or payload definition. Serialization and deserialization must round-trip without precision loss, and no implicit maximum below the JavaScript safe-integer range may be introduced by request/response handling.

Impact Preview is always computed by the API using the authoritative recalculation path (Section 22); the browser never computes, approximates, or caches a preview outcome independently.

Export and owner-account deletion requests are supported as auditable interactions, but this baseline does not guarantee self-service delivery in the first beta wave; the delivery mode, retention period, and cleanup orchestration are Implementation-Time Selections (ARCH-PRIV-01, Section 31).

## 28. Frontend Architecture

The Next.js application is Indonesian-first, responsive, keyboard accessible, and usable from small mobile widths through desktop. Server rendering may establish the authenticated shell and initial reads; interactive financial forms and previews run as client components.

TanStack Query owns remote server state and invalidation. React Hook Form with Zod owns transient form state. No browser-wide balance ledger or duplicate recalculation engine exists. Shared contract schemas may validate shape, but authoritative domain acceptance remains on the API. The web application does not import `packages/domain` or any backend application-coordination module; it depends only on `packages/contracts` for transport shape and on its own presentation/formatting code. Impact Preview, balance/formula values, and acceptance/blocking outcomes are always fetched from the API — never computed, duplicated, or approximated in the browser. Monetary amounts received from the API are parsed and held as exact integers (`bigint` or an equivalent exact-integer abstraction), never as JavaScript floating-point `number`; the frontend never applies `parseFloat` or a floating-point conversion to an authoritative amount.

Financial mutations use a pending state, show Impact Preview when required, submit idempotently, and replace local views only with the confirmed response/refetch. Optimistic insertion or optimistic balance changes are not used for financial effects. `Intl` formatting renders IDR and Asia/Jakarta dates; semantic HTML, focus management, contrast, error association, and reduced-motion support are release gates.

Blocked outcomes are presented as structured, actionable results without erasing the user's proposal. Impact Preview presentation may vary by responsive context, but its required content and trigger remain domain-controlled. Dashboard and detail views are read from the same authoritative/projection sources; the frontend never hides a detected mismatch to appear consistent.

## 29. Background Processing and Scheduling

Core financial correctness has no background dependency. Confirmation, recalculation, projection maintenance, and audit evidence complete synchronously in the request transaction.

By default, v1 has no general-purpose background worker or queue. Provider-managed authentication email, scheduled backup operations, redacted telemetry delivery, and optional non-authoritative consistency verification may operate asynchronously.

Additional narrowly scoped export processing or owner-account deletion orchestration may exist only when explicitly selected under ARCH-PRIV-01. Export delivery mode is an explicit Session 24 selection (ARCH-PRIV-01), not decided by this document: if Session 24 selects self-service export for the first beta wave, a small export may be generated synchronously and streamed within an approved size and latency threshold; if Session 24 selects an auditable manual or staged process instead, this Architecture does not require a browser-facing synchronous export flow. Export data completeness, authorization, auditability, and temporary artifact cleanup are required regardless of delivery mode. If measured export size crosses the Implementation-Time Selection threshold, a narrowly scoped durable export job and temporary object storage may be added through explicit review; it must not become a financial acceptance mechanism. Financial Event acceptance and financial correctness remain synchronous regardless of any narrowly scoped asynchronous export or deletion orchestration; no queue or worker technology is selected in this document.

Reporting materialization, when part of a confirmed projection, is updated in the confirmation transaction rather than by a lagging job. Product analytics is limited to privacy-safe operational/product signals and never receives a financial ledger. No general-purpose queue, independent worker fleet, retry-driven financial mutation, automatic Trash cleanup, scheduled domain correction, search indexing, or warehouse pipeline exists in v1.

Owner-account deletion is a separate, authoritative privacy and account-lifecycle operation, distinct from Financial Event acceptance; it does not reinterpret, correct, or independently accept a Financial Event, and it never runs as a mechanism that could itself decide financial acceptance. Where Session 24 selects asynchronous orchestration for deletion or de-identification steps, each step must be access-controlled, idempotent, auditable, resumable or safely retryable, explicit about partial progress, and unable to leave a partially active or partially accessible Workspace. Its delivery mode, retention period, and orchestration mechanism remain Implementation-Time Selections (ARCH-PRIV-01); backup erasure is not claimed to be instantaneous.

## 30. Concurrency, Idempotency, and Conflict Handling

All correctness-changing financial writes for a Workspace serialize on a dedicated Workspace financial-write guard/counter row. Relevant Account, Fund-pair, Debt, configuration, and event records are locked as needed within that transaction. This keeps confirmation-position allocation, recalculation, and projection updates deterministic.

The evaluated choices were unrestricted last-write-wins, optimistic versions alone, pessimistic entity locks, serializable isolation alone, database advisory locks, and the selected scoped combination. Last-write-wins is rejected because it loses user intent. Optimistic versions remain useful for stale proposals but do not alone serialize position allocation. The selected persisted Workspace guard is inspectable and portable compared with an advisory-lock-only design; targeted entity locks protect the rows participating in the calculation. Serializable isolation may be reconsidered as an additional defense after driver/provider behavior and contention are measured, not used as a substitute for explicit ordering.

Editable records carry an optimistic version. A request based on stale state is blocked with current state for review; last-write-wins is forbidden. Confirm interactions require a client-generated idempotency key scoped to Workspace and operation category. The server stores the request fingerprint and outcome in the same transaction. An identical retry returns the prior result; reuse with different input is rejected.

Deadlocks or transient database failures may receive bounded infrastructure-level retries only when the complete transaction is safe under idempotency. Such retries never change a domain rejection into acceptance and are not visible as duplicate history.

Onboarding follows the same concurrency and idempotency discipline as ordinary financial writes. Entitlement redemption is serialized per entitlement and per subject through uniqueness enforcement on the consumption record and on the subject-to-User mapping, so concurrent redemption attempts for the same entitlement or the same subject cannot create duplicate Users, Workspaces, starter Accounts, or consumption records; a losing concurrent attempt is rejected, never silently discarded or partially applied. The onboarding request itself carries an idempotency key; an identical retry returns the previously confirmed outcome rather than attempting a second redemption, and a retry following a failed (rolled-back) onboarding transaction finds the entitlement still unconsumed and may attempt redemption again.

## 31. Security and Privacy Baseline

- TLS is required for every production connection; provider-managed encryption at rest is required.
- Secrets live in managed secret storage and validated runtime configuration, never source control or browser bundles.
- Application and migration database roles are separate and least-privileged.
- Secure headers include a restrictive Content Security Policy, clickjacking protection, MIME protection, and a deliberate referrer policy.
- State-changing browser requests enforce session, origin/CSRF, authorization, version, and rate-limit checks.
- Input is boundary-validated; output rendering relies on safe React escaping and prohibits unreviewed HTML injection.
- Authentication, recovery, confirmation, preview, export, and high-volume history interactions receive layered rate limits.
- Logs, error reports, traces, support exports, and analytics exclude credentials, session material, raw request bodies, and unnecessary financial values.
- Dependency, container, and secret scanning run in CI; high-severity findings block release until assessed.
- Private Beta access entitlement is resolved and consumed server-side before Workspace creation; the client cannot declare or forge eligibility (ARCH-ACCESS-01).
- User-data export and owner-account deletion are architecturally supported through an explicit, auditable process (ARCH-PRIV-01) that covers identity mapping, Workspace, authoritative financial facts, derived projections, immutable versions, audit/lifecycle evidence, generated exports, provider mappings, and backups subject to documented retention limitations, without pretending that backup erasure is instantaneous. Owner-account deletion is an authoritative privacy and account-lifecycle operation — separate from, and never a reinterpretation, correction, or independent acceptance of, a Financial Event. Whether export ships before the first beta invitation wave, whether deletion begins as self-service or an auditable manual request, the exact retention period, and cleanup orchestration are Implementation-Time Selections made explicitly in Session 24 — this baseline does not assume self-service delivery in the first beta wave.

This baseline makes no regulatory certification or compliance claim.

## 32. Observability and Operational Readiness

The API emits structured, redacted logs with request correlation ID, opaque User/Workspace identifiers, operation category, outcome class, latency, and error category. It does not emit financial descriptions, raw amounts, auth tokens, cookies, or full payloads.

Metrics cover request rate/latency/error, database pool and lock wait, transaction retry/deadlock, recalculation scope/duration, idempotency reuse, authentication failure, backup status, and consistency-verification result. Distributed tracing is limited to web/API/database/provider boundaries with sensitive attributes omitted.

Liveness proves the process runs; readiness proves required dependencies and safe configuration are available. A release-readiness signal records post-hoc dashboard/detail or projection/source disagreement without altering accepted domain state. Alerts target sustained failures, isolation-policy errors, backup failure, elevated conflict/lock time, and release-readiness blockers. Runbooks cover provider outage, failed deployment, database saturation, suspected Workspace leakage, projection disagreement, and restore.

## 33. Testing Architecture

| Layer | Scope |
|---|---|
| Domain unit tests | Every formula, invariant, behavior acceptance/block, lifecycle rule, and chronology rule |
| Property tests | The 32 normative properties plus generated amounts, dates, positions, corrections, and recalculation sequences |
| Module/application tests | Coordination, preview/confirm parity, idempotency, stale-state handling, and blocked outcomes |
| PostgreSQL integration tests | Transactions, constraints, row locks, RLS, migrations, projection consistency, and rollback |
| API contract tests | Authentication, validation categories, versioning, pagination, and error stability |
| Browser end-to-end tests | The 37 acceptance examples where user-visible, onboarding, all six Event Types, correction, Trash/restoration, and reporting; self-service export receives Browser E2E coverage only if Session 24 selects that delivery mode |
| Accessibility/responsive tests | Keyboard, focus, labels, errors, contrast, reduced motion, mobile/desktop layouts |
| Operational tests | Build artifact, health/readiness, backup restore, deployment rollback, and redaction |
| Access-gate and isolation tests | Verified-but-uninvited identity, invited-but-unverified identity, valid invited-and-verified identity, reused entitlement, entitlement issued for another email/subject, and attempted client-side Workspace selection |
| Onboarding atomicity and idempotency tests | Concurrent redemption of the same entitlement, retry after a failed onboarding transaction, identical onboarding retry, one subject attempting to create a second Workspace, and one entitlement attempting to establish more than one User or Workspace |
| Export and owner-account deletion tests | Self-service export receives Browser E2E coverage only if selected; manual or staged export receives application/operational coverage instead; every selected export mode verifies authorization, complete Workspace data coverage, exact money serialization, audit evidence, and artifact cleanup; owner-account deletion tests follow the Session 24 delivery mode and verify authorization, idempotency, auditable progress, access termination, and backup-retention communication |
| Monetary representation tests | Values above the JavaScript safe-integer range, JSON round-trip without precision loss, addition/subtraction exactness, and PostgreSQL/backend/web representation parity |
| Architecture boundary tests | Automated import-graph checks that `apps/web` never imports `packages/domain` or backend application-coordination code, and that `packages/domain` never imports framework, ORM, web, or provider modules |

Tests use real PostgreSQL for database semantics; SQLite or mocks cannot certify transaction, lock, type, or RLS behavior. Architecture boundary checks prevent domain packages from importing framework, ORM, web, or provider modules, and prevent `apps/web` from importing `packages/domain` or backend application-coordination modules. Concurrency tests deliberately race same-Workspace confirmations and cross-Workspace access.

The normative executable baseline maps explicitly as follows: all **55 behaviors** receive domain/application behavior coverage; all **26 invariant rows** receive example and property coverage; all **37 acceptance examples** become unit, integration, or browser scenarios according to their boundary; and all **32 property specifications** become generated domain tests, with database integration added where transaction, chronology, or isolation semantics are involved.

## 34. Local Development and Continuous Integration

Local development uses pinned package-manager metadata, validated non-secret environment templates, deterministic monorepo commands, and Docker Compose for PostgreSQL plus an optional mail catcher. The web and API run with user-level Node.js development processes; local Kubernetes or administrator access is not required. Deterministic seed data is explicitly non-production and Workspace-scoped. Each integration-test worker receives an isolated database/schema lifecycle, and migrations establish its state rather than ad hoc table creation.

CI executes, in dependency order where useful:

1. dependency integrity and secret scan;
2. formatting and lint checks;
3. TypeScript type checking and architecture-boundary checks, including that `apps/web` cannot import `packages/domain` or backend application-coordination code;
4. domain unit and property tests;
5. PostgreSQL integration and migration checks from an empty database and the prior released schema;
6. API contract tests;
7. production builds;
8. selected Playwright responsive/accessibility/end-to-end tests;
9. container and dependency vulnerability checks.

The exact CI product and version pins are Implementation-Time Selections. CI must not need production secrets or production financial data.

## 35. Deployment Topology

Private Beta v1 uses one production region and separate production/staging environments:

```text
Managed web edge/runtime
          |
          v
Managed stateless API container(s)
          |
          v
Managed PostgreSQL primary + provider backup/PITR

External: managed identity/email and redacted telemetry
```

| Deployment Category | Transaction/Connectivity Fit | Operations and Cost | Recovery/Portability | Result |
|---|---|---|---|---|
| Managed frontend + managed API/database | Direct regional PostgreSQL connectivity; normal long transaction support | Small managed footprint and entry-tier scaling | Managed backup/PITR and portable container/database | Adopted Candidate Baseline |
| Containerized single host | Strong local connectivity | Low service count but self-managed patching, failover, and backup | Portable but larger operator burden | Rejected for v1 |
| Serverless full-stack only | Platform-dependent connection/transaction limits | Low idle cost but tighter runtime coupling | Provider-specific execution behavior | Rejected for v1 |
| Kubernetes/multi-service | Flexible connectivity and workers | Highest operations and baseline cost | Portable containers but complex state recovery | Rejected for v1 |

The web and API share a controlled same-site origin strategy even when hosted separately. The API may run more than one stateless replica, but Workspace financial-write serialization remains database-backed. PostgreSQL and API are placed in the same provider region/private network where supported. Schema migrations run as a distinct release step with a separate role; application startup does not perform uncontrolled production migrations.

Deployments use immutable artifacts, health-gated rollout, and code rollback. Database changes follow expand/migrate/contract discipline; destructive contraction occurs only after compatibility and backup verification. Kubernetes, multiple authoritative regions, and self-managed database operations are not selected.

## 36. Backup, Recovery, and Data Portability

The managed PostgreSQL service must provide encrypted automated backups and point-in-time recovery. The recovery-point category is **daily-or-better with point-in-time recovery**, and the recovery-time category is **same-business-day operator recovery**. Candidate Private Beta objectives are an RPO of no more than 24 hours and an RTO of no more than 8 hours; the selected provider should improve on them where economical. Final provider-backed objectives are recorded during implementation planning.

A restore drill into an isolated non-production environment is required before the first beta invitation and at least quarterly during the beta. The drill verifies schema, authoritative facts, immutable versions, projections, isolation policies, and a sample of domain formulas. Projection rebuild tooling may reconstruct derived current state from authoritative facts but may not alter accepted event history.

Data portability includes an owner-requested, user-readable export in documented, non-proprietary tabular/JSON form with stable IDs, dates, event types, relationships, lifecycle state, and financial values. Whether this export is delivered as an immediate self-service action or an auditable manual/staged process in the first beta wave is an Implementation-Time Selection (ARCH-PRIV-01, Section 31), not a guarantee of this Architecture baseline. Production, staging, test, and restore-drill environments use separate databases, credentials, and provider projects where supported. Accidental application deletion is recoverable through indefinite Trash where the domain permits it; broader corruption uses PITR/restore. Provider exit plans cover identity subject mapping, PostgreSQL logical export, encryption keys/secrets, and deletion of temporary export artifacts. Backups include audit/change versions but are not treated as user-facing history or as a substitute for traceability.

Owner-account deletion is distinct from Financial Event Trash: Trash provides indefinite, domain-governed recoverability for individual events, while owner-account deletion is a separate, auditable, whole-account lifecycle action governed by ARCH-PRIV-01 and is not implied by, or a substitute for, Trash retention policy.

Schema release strategy favors backward-compatible expand/migrate/contract and forward repair. A code rollback must remain compatible with the expanded schema. Destructive down-migrations are not the default recovery method; a failed destructive migration uses a verified pre-change backup/PITR plan.

## 37. Rejected Architecture Alternatives

Each rejected alternative below states its own reasoning and protected constraint; this table does not rely solely on the Section 8 Decision Summary.

| Alternative | Why Considered | Why Rejected for v1 | Protected Domain/Architecture Constraint | Future Reconsideration Trigger |
|---|---|---|---|---|
| Microservices | Independent scaling/ownership boundaries mirror candidate module lines | Creates distributed consistency and operations without team/scale need | One atomic all-or-nothing cross-boundary outcome | Independent ownership and scaling evidence |
| Event sourcing | Chronological recalculation and full history resemble event-sourced replay | Adds replay/migration complexity beyond confirmed traceability needs | Recalculation is targeted, not full replay; normalized facts remain the primary store | Stronger temporal/audit requirements |
| Local-first desktop authority | Offline resilience and instant local interaction | Synchronization conflicts and device recovery are not v1 needs | Server/database remains the sole financial authority | Explicit offline-first product decision |
| Timestamp/global chronology | Simpler than a dedicated counter; timestamps are already stored | Does not represent Workspace confirmation order; cannot guarantee deterministic tie-break | Event Date plus immutable Workspace confirmation position determines chronology | Explicit domain-order change |
| Eventual financial consistency/sagas | Reduces lock scope and cross-module coupling | Allows forbidden partial states | All-or-nothing cross-boundary acceptance | Authoritative stores must separate after domain review |
| Full replay on every change | Simplest possible recalculation guarantee | Excessive locking/work for targeted affected history | Every affected point validated without unneeded full-history recomputation | Bounded-history measurements prove full replay simpler/safer |
| Generic financial cache | Could reduce read latency for totals | Adds source/detail disagreement modes | Dashboard/detail agreement from the same authoritative source | Proven query/index insufficiency |
| Self-hosted passwords | Avoids third-party identity dependency | Avoidable security and recovery operations burden | Secure recovery/verification/session handling | Managed provider failure against requirements |
| Kubernetes/multi-region active-active | Maximum availability and independent scaling | Operational and consistency complexity unjustified at beta scale | Transactional locality and small operations footprint | Measured availability/scale requirement |
| Hard delete/automatic Trash expiry | Reduces storage and simplifies lifecycle | Contradicts indefinite recoverable v1 Trash | No v1 permanent Financial Event deletion or Trash expiry | Explicit post-MVP domain decision |
| GraphQL-first API | Flexible client-driven queries | More boundary complexity than the current single web client requires | Inspectable versioned REST contract with preview-then-confirm | Diverse clients or query-shape evidence |
| Document database | Schema flexibility for evolving event forms | Weaker fit for relational references and multi-record constraints | Referential integrity, transactions, RLS-based Workspace isolation | Domain relationship model changes materially |
| Browser optimistic financial state | Perceived responsiveness for financial mutations | Can display unconfirmed balances and outcomes | Browser is never financial authority; only confirmed server state displays | No reconsideration without a new truthful-confirmation design |
| Floating-point money | Native JavaScript/JSON numeric type; simplest arithmetic | Inexact financial arithmetic and rounding drift | Whole-Rupiah exactness across PostgreSQL, backend, and transport (ARCH-REP-01) | Currency policy changes representation need |
| Last-write-wins financial writes | Simplest concurrency model, no locking | Loses user intent and confirmed/correction outcomes silently | Stale proposals block; deterministic Workspace-serialized writes | No acceptable v1 trigger identified |
| Allocation lots/FIFO/LIFO | Common pattern for tracking fund consumption order | Explicitly excluded domain model; no allocation-lot relationship | Account–Fund pair current amount only; no cross-Account consumption | Explicit domain review |
| Redis or Kafka as mandatory v1 infrastructure | Common caching/broker infrastructure for scale | No demonstrated v1 need; adds operational surface without evidence | One authoritative synchronous write/read path through PostgreSQL | Proven queue/cache need from measured load |
| Elasticsearch or analytics warehouse | Faster/flexible reporting and search at scale | Excess Private Beta operational surface | Reporting traces directly to authoritative PostgreSQL facts | Reporting scale requires a dedicated engine |
| One giant Workspace domain object | Single consistency boundary would simplify transaction reasoning | Oversized lock/model boundary; contradicts narrow candidate responsibilities | Workspace responsibility stays ownership/configuration only, not all financial history | Explicit domain review |
| Schema without explicit Workspace ownership | Fewer columns/constraints if scope is only inferred through joins | Enables cross-owner leakage | Every Workspace-owned record carries or inherits explicit Workspace scope | No acceptable trigger; isolation is a fixed constraint |

## 38. Architecture Risks and Mitigations

Likelihood, Impact, and Residual Risk use qualitative ratings only (Low/Medium/High); no numerical probability is asserted.

| Risk ID | Risk | Likelihood | Impact | Mitigation | Detection | Residual Risk | Latest Responsible Stage |
|---|---|---|---|---|---|---|---|
| RISK-01 | Workspace RLS context mistake causes cross-owner leakage | Low | High | Transaction-local context, composite scope constraints, adversarial isolation tests | Isolation test suite failure; policy-denial anomaly in logs | Low | Session 24 Implementation Planning |
| RISK-02 | Concurrent financial writes / per-Workspace lock contention slows confirmations | Medium | Medium | Short transactions, indexed affected slices, lock-wait metrics, bounded transaction scope | Lock-wait time exceeds implementation budget | Low | Session 24 Implementation Planning |
| RISK-03 | Large historical recalculation causes timeout or poor UX | Low | Medium | Targeted affected-slice recalculation, preview/confirm parity, scope measurement, reviewed async preview only if needed | P95 recalculation scope/duration threshold exceeded | Low | Post-Beta Measurement |
| RISK-04 | Projection/derived-value drift causes dashboard/detail disagreement | Low | High | Same-transaction writes, periodic verification, rebuild runbook, release-readiness blocker on mismatch | Any projection/authoritative-fact mismatch detected | Low | Ongoing Operations |
| RISK-05 | Managed identity vendor outage or lock-in | Low | High | Exportable subject mapping, adapter boundary isolating provider SDK, documented recovery/provider-exit runbook | Provider status/SLA breach; failed authentication rate spike | Medium | Session 24 Vendor Selection |
| RISK-06 | ORM hides unsafe query behavior (incorrect locks or scope) | Low | High | SQL review of generated queries, PostgreSQL integration tests, explicit transaction/lock APIs | Integration test failure; unsupported lock/RLS behavior discovered | Low | Session 24 Implementation Planning |
| RISK-07 | Immutable versions retain sensitive data beyond retention/privacy expectations | Medium | Medium | Access controls on version history, export/deletion coverage (ARCH-PRIV-01), data minimization | Beta or legal review identifies excess retained data | Medium | Session 24 / Pre-Beta Review |
| RISK-08 | Reporting queries grow expensive as history grows | Low | Medium | Reporting-range indexes, query measurement, reviewed projection threshold before materialization | Reporting query budget exceeded | Low | Post-Beta Measurement |
| RISK-09 | Migration mistake causes downtime or data loss | Low | High | Expand/migrate/contract discipline, staging restore verification, pre-migration backup, migration CI | Non-backward-compatible change detected in CI or staging restore | Low | Ongoing Operations |
| RISK-10 | Telemetry leaks financial detail or credentials | Low | High | Default redaction, schema allowlist for telemetry fields, automated tests, restricted raw-log access | Sensitive-field detection in telemetry review or automated scan | Low | Session 24 Implementation Planning |
| RISK-11 | Hidden framework/domain coupling produces hard-to-test rules | Medium | Medium | Inward dependency enforcement, framework-free domain package, architecture-boundary tests | Boundary test failure; domain package imports framework/ORM/web module | Low | Ongoing Operations |
| RISK-12 | Single-region outage causes temporary unavailability | Low | High | Managed service SLAs, automated backup/PITR, documented recovery runbook | Provider status/alerting; availability target breach | Medium | Session 24 / Ongoing Operations |
| RISK-13 | Duplicate retries create duplicate Financial Events | Medium | Medium | Transactional idempotency-key fingerprint and stored outcome; identical retry returns prior result | Idempotency key collision or duplicate-effect evidence | Low | Session 24 Implementation Planning |
| RISK-14 | Stale Impact Preview causes user to confirm changed consequences | Low | Medium | Entity versions checked at confirm time; recalculation reruns under Workspace write lock; stale previews rejected/refreshed | Preview version mismatch detected at confirm time | Low | Session 24 Implementation Planning |
| RISK-15 | Reporting Period regrouping recomputation is expensive at large history volume | Low | Medium | Query-time regrouping over indexed reporting-range fields; measure before adding materialized regrouped projections | Regrouping confirmation latency exceeds implementation budget | Low | Post-Beta Measurement |
| RISK-16 | Traceability gaps prevent a confirmed effect or correction from being fully explained | Low | High | Mandatory traceability evidence written in the same transaction as every confirmed change; traceability test coverage per behavior | Traceability/explanation test failure; unresolved support inquiry | Low | Session 24 Implementation Planning |
| RISK-17 | Insufficient audit/change history for lifecycle actions | Low | Medium | Explicit lifecycle-transition evidence (ARCH-LIFE-01); audit coverage included in domain/module test scope | Lifecycle audit review finds unexplained state transitions | Low | Session 24 Implementation Planning |
| RISK-18 | Backup/PITR failure to meet recovery objectives | Low | High | Mandatory pre-beta restore drill, quarterly drills during beta, documented RPO/RTO objectives, provider-backed PITR | Restore drill failure or RPO/RTO breach | Medium | Pre-Beta Release / Ongoing Operations |
| RISK-19 | Over-engineering introduces infrastructure not justified by Private Beta scale | Medium | Medium | Architecture principles require measured evidence and explicit review before adding deferred infrastructure | Architecture review of proposed additions against stated triggers | Low | Ongoing Architecture Review |
| RISK-20 | Under-tested correction and Restoration paths | Low | High | Explicit domain/property/integration/browser test mapping for correction and lifecycle behaviors; CI gate blocks merge without coverage | Coverage gap identified in CI or test-mapping review | Low | Session 24 Implementation Planning |
| RISK-21 | Frontend/dashboard disagreement from a caching or invalidation defect | Low | Medium | Shared query cache keyed from the same authoritative reads; frontend never hides a detected mismatch; release-readiness signal on backend-detected disagreement | Automated cross-view consistency test; user-reported mismatch | Low | Session 24 Implementation Planning |

## 39. Implementation Constraints

Session 24 and later implementation must preserve these constraints:

- do not add or reinterpret domain behavior, Event Types, lifecycle states, or financial formulas;
- do not let framework modules or database tables become a new aggregate decision by convenience;
- do not persist, transport, or hold money as a floating-point value anywhere in the path (PostgreSQL, backend, REST/JSON, or web), and do not derive business dates from UTC conversion;
- do not serialize monetary amounts as a native JSON `number`; use base-10 integer strings at REST/JSON boundaries;
- do not expose Workspace selection as an authorization input for the single-owner v1 model;
- do not let email verification alone authorize Workspace creation; a valid, unconsumed Private Beta access entitlement is required (ARCH-ACCESS-01);
- do not consume a Private Beta access entitlement without also completing Workspace establishment in the same atomic onboarding outcome, and do not create a Workspace without a valid entitlement-consumption record in that same outcome;
- do not allow concurrent or retried onboarding requests to create duplicate Users, Workspaces, starter Accounts, or entitlement-consumption records;
- do not confirm any financial effect outside one database transaction;
- do not use timestamps as the same-date tie-breaker;
- do not make the browser, cache, queue, log stream, or telemetry service authoritative;
- do not let `apps/web` import `packages/domain` or backend application-coordination modules, and do not let the browser duplicate recalculation, balance formulas, or acceptance logic;
- do not optimistically display unconfirmed financial effects;
- do not add hard deletion, Trash expiry, hidden history removal, or automatic correction;
- do not make derived values independently editable;
- do not assume export ships before the first beta invitation wave, or that owner-account deletion is self-service, without an explicit Session 24 selection (ARCH-PRIV-01);
- do not conflate Financial Event Trash with full owner-account deletion;
- do not treat owner-account deletion as non-authoritative background work; if Session 24 orchestrates it asynchronously, every deletion or de-identification step must be access-controlled, idempotent, auditable, resumable or safely retryable, explicit about partial progress, and unable to leave a partially active or partially accessible Workspace;
- do not ship a migration without forward compatibility, backup consideration, and test evidence;
- do not claim Architecture completion until the candidate baseline is reviewed, committed, and pushed.

Exact versions and providers require current primary-source verification in Session 24. Detailed routes, payloads, schema columns, indexes, classes, repositories, tickets, and estimates remain downstream implementation-planning work.

## 40. Session 24 Readiness

**Result:** Ready with Named Implementation-Time Selections, pending review of this candidate baseline.

Session 24 may begin only after this document is reviewed, accepted, committed, and pushed. The planning session should:

1. verify and pin compatible versions for Node.js, TypeScript, pnpm, Turborepo, Next.js, NestJS/Fastify, Drizzle, Zod, PostgreSQL, and the selected test tools;
2. select providers and region against the criteria in Sections 16, 31, 35, and 36;
3. define measurable performance budgets and the export threshold;
4. translate this module/repository baseline into milestones and vertical implementation slices;
5. make the first slice prove authentication, Workspace isolation, migrations, one atomic ordered Financial Event path, idempotency, traceability, and CI rather than building broad UI surface first;
6. identify any genuine architecture/domain conflict and return it to explicit review instead of silently resolving it in a task or schema;
7. select the Private Beta access-entitlement representation (ARCH-ACCESS-01) and the export/owner-account-deletion delivery mode, retention period, and cleanup orchestration (ARCH-PRIV-01).

No Architecture decision remains open in a way that prevents planning. The named Implementation-Time Selections are bounded procurement/version/threshold choices, not unresolved domain behavior.

## 41. Traceability to Domain and Product Sources

| Architecture Area | Primary Source Grounding |
|---|---|
| Workflow, status, no silent source changes | `CLAUDE.md` §§3–5; `PROJECT_STATE.md` §§1–4 |
| Product trust, simplicity, privacy, responsive experience | `PRODUCT_IDENTITY.md` §§3–7, 13; PRD §§2–8, 21–24 |
| Authentication and single-owner Workspace | PRD §§6, 20; Executable Domain Specification §§5, 7, 13 |
| Private Beta access gate | PRD §§6, 20; Executable Domain Specification §§5, 13 |
| Closed Event Types and event forms | PRD §§11, 16; Executable Domain Specification §§6, 18, 26 |
| Candidate responsibility/module mapping | `AGGREGATE_CANDIDATES.md` §§6–16, 20, 23; Domain Decision Register DEC-AGG-01…05 and DEC-ALLOC-01…03 |
| Money, date, timezone, identifiers | PRD §§9, 16–18; Executable Domain Specification §§7–9, 11 |
| Chronology and confirmation position | Domain Decision Register DEC-ORDER-01; Executable Domain Specification §§6, 9, 12, 20, 22, 27–30 |
| Cross-boundary transactions | PRD §§9, 11, 14–16; Executable Domain Specification §§10–11, 20–21, 26–30 |
| Recalculation and Impact Preview | PRD §16; Domain Decision Register DEC-LIFE-05; Executable Domain Specification §§22, 27–30 |
| Derived values and reporting | PRD §§9, 12, 14–19; Domain Decision Register DEC-REPORT-01…05; Executable Domain Specification §§23, 25, 29–30 |
| Correction, replacement, Trash, restoration | PRD §16; Domain Decision Register DEC-LIFE-01…06; Executable Domain Specification §§10, 20–21, 24, 27–30 |
| Historical names and prior values | Domain Decision Register DEC-TRACE-01 and DEC-TRACE-02; Executable Domain Specification §§24, 31 |
| Cross-view disagreement | Domain Decision Register DEC-TRACE-03; Executable Domain Specification §§6, 11, 24, 28 |
| Invariant and acceptance test baseline | Executable Domain Specification §§11, 26, 28–30 |
| Architecture boundaries and readiness | `AGGREGATE_CANDIDATES.md` §§22–23; Domain Decision Register §§20, 26–27; Executable Domain Specification §§31–35 |

This traceability table records translation, not a new source hierarchy. No Architecture choice in this document reopens a domain decision. A future implementation discovery may trigger an explicit return to Architecture or domain review, but implementation does not silently finalize, replace, or weaken either baseline.
