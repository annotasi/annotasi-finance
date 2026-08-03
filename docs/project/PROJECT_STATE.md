# Annotasi Finance — Project State

## 1. Document Status

- **Status:** Current project navigation snapshot
- **Scope:** Annotasi Finance Private Beta MVP
- **Last completed workflow session:** Session 28
- **Completed workflow stages:** Product Definition, Domain Modeling, Architecture Baseline, Implementation Planning
- **Current workflow stage:** Implementation
- **Latest completed workflow artifact:** `docs/implementation/ONBOARDING_ISOLATION_REGISTER.md`
- **Latest completed domain artifact:** `docs/domain/EXECUTABLE_DOMAIN_SPECIFICATION.md`
- **Latest completed Architecture artifact:** `docs/architecture/ARCHITECTURE_BASELINE.md`
- **Latest completed implementation-planning artifact:** `docs/implementation/MVP_IMPLEMENTATION_PLAN.md`
- **First approved implementation slice:** `SLICE-FOUND-001`
- **Completed implementation slices:** `SLICE-FOUND-001`, `SLICE-FOUND-002`, `SLICE-IAM-001`, `SLICE-IAM-002`
- **Next approved implementation slice:** `SLICE-ACC-001`
- **Next recommended task:** Session 29 — Account Management Baseline

Session 25 — Technical Foundation Implementation is complete. `SLICE-FOUND-001` was implemented, reviewed, passed all eight Foundation Gate non-database checks locally, passed GitHub Actions on its Pull Request, passed GitHub Actions again after merge, and was merged into `dev`.

Session 26 — Technical Foundation Implementation is complete. `SLICE-FOUND-002` was implemented and reviewed; its local validation passed, Pull Request CI was green, it was merged into `dev`, and the post-merge `dev` state is green.

Session 27 — Identity and Access Implementation is complete. `SLICE-IAM-001` was implemented, reviewed, committed, pushed, and merged into `dev`. Pull Request CI and post-merge GitHub Actions are green.

Session 28 — Identity, Onboarding, and Workspace Isolation is complete. `SLICE-IAM-002` was implemented, reviewed, committed, pushed, and merged into `dev`. Pull Request CI and post-merge GitHub Actions are green. Exactly four implementation slices have completed. `main` remains production-only and has not received these implementation slices.

Session 29 — Account Management Baseline is next, and `SLICE-ACC-001` is the only next approved implementation slice. `SLICE-ACC-001` and every later slice remain not started. Product, domain, Architecture, and implementation planning may only be reopened through explicit review when a genuine conflict or blocking defect is discovered; implementation may not silently reinterpret them.

`docs/project/PROJECT_STATE.md` remains a workflow-support artifact and navigation snapshot, not a domain artifact. It summarizes completed work without replacing the authority of the product and domain source documents.

This document intentionally avoids citing a specific git commit hash as its source of truth. Commit hashes become stale as soon as new commits land; the artifact list in Section 4 is the durable indicator of project state, and should be checked against the actual repository (`git log`, `git status`) rather than against a hash frozen at the time this document was written.

---

## 2. Purpose and Non-Authority Rule

This document exists to:

- help a new AI session locate relevant context quickly;
- summarize current project state;
- reduce unnecessary repeated reading of full source documents.

This document is **not**:

- a replacement for `docs/product/ANNOTASI_FINANCE_MVP_PRD.md`, `docs/product/PRODUCT_IDENTITY.md`, or the domain documents;
- citable as the sole authority for a new product or domain decision.

**When this document disagrees with an authoritative source, the authoritative source wins.** Summaries in this document must never silently convert a Candidate or Still Open item into a Confirmed decision — if any such conversion is found, treat it as an error in this document and correct it against the source, not the other way around.

---

## 3. Current Workflow Position

Per `CLAUDE.md` §5, the confirmed workflow is:

```
Product identity
→ Product discovery
→ PRD
→ Domain model
→ Architecture
→ Milestones
→ Specifications and acceptance criteria
→ Implementation
→ Review
→ Testing
→ Release
```

Position as of this document's creation:

- Product identity: complete (`docs/product/PRODUCT_IDENTITY.md`, approved foundation).
- PRD: complete (`docs/product/ANNOTASI_FINANCE_MVP_PRD.md`, Status: Draft for review — see Section 4 for what "Draft for review" means for this artifact).
- Domain model: complete for the Private Beta v1 baseline. Ubiquitous Language, Domain Concept Model, Domain Object Candidates, Aggregate Candidate Analysis, Domain Behavior Analysis, Domain Behavior Decision Tables and Boundary Participation Analysis, Domain Decision Resolution, and Executable Domain Specification are complete. No further broad Domain Modeling artifact is recommended.
- Architecture: complete for the Private Beta v1 baseline. Session 23 — Architecture Baseline produced `docs/architecture/ARCHITECTURE_BASELINE.md`, reviewed, committed, and pushed as the working Architecture baseline. No further broad Architecture artifact is recommended; Architecture may only be reopened through explicit review when a genuine conflict or implementation-blocking defect is discovered.
- Implementation Planning: complete. Session 24 produced `docs/implementation/MVP_IMPLEMENTATION_PLAN.md`, reviewed, committed, and pushed as the final planning artifact before implementation.
- Implementation: current workflow stage. Sessions 25–28, covering `SLICE-FOUND-001`, `SLICE-FOUND-002`, `SLICE-IAM-001`, and `SLICE-IAM-002`, are complete, reviewed, and merged to `dev`; exactly four implementation slices have completed. Session 29 / `SLICE-ACC-001` is next and has not started. Every later slice remains not started.
- Review and Testing: slice-level review and testing are complete for `SLICE-FOUND-001`, `SLICE-FOUND-002`, `SLICE-IAM-001`, and `SLICE-IAM-002`; the later workflow-wide Review and Testing stages have not started. Release has not started. Managed identity, application-session persistence, Private Beta entitlement redemption, atomic onboarding, one private Workspace and starter Account per User, and the Isolation Gate now exist; broader Account management, financial behavior, and deployment have not started.

Completed workflow artifacts and implementation outcomes, in order: Product Identity; MVP PRD; Ubiquitous Language; Domain Concept Model; Domain Object Candidates; Aggregate Candidate Analysis; Domain Behavior Analysis; Domain Behavior Decision Tables and Boundary Participation Analysis; Domain Decision Resolution; Executable Domain Specification; Architecture Baseline; MVP Implementation Plan; `SLICE-FOUND-001` technical foundation and its Foundation Dependency Register; `SLICE-FOUND-002` database foundation and its Database Foundation Register; `SLICE-IAM-001` managed identity and persisted application-session implementation and its Identity and Session Evidence Register; `SLICE-IAM-002` Private Beta onboarding and Workspace-isolation implementation, its Onboarding and Isolation Register, and its IAM-002 Onboarding Testing Guide.

---

## 4. Completed and Current Baseline Artifacts

Listed in workflow order. For each: role, what it establishes, what it deliberately does not establish, and whether later sessions may silently modify it (**No** for all).

### 1. `CLAUDE.md`
- **Role:** AI working guide for this repository.
- **Establishes:** mandatory product principles, v1 scope boundaries, operating rules for AI agents, the workflow sequence, and repository status.
- **Does not establish:** detailed product or domain requirements itself. It does not replace Product Identity, the PRD, or domain documents as the authoritative source of detailed product and domain requirements — it governs how those are approached.
- **Repository-status note:** its documentation-only status statement predates Session 25. The actual repository and this navigation snapshot now record that implementation has started; its operating rules remain in force.
- **Modifiable silently by later sessions:** No.

### 2. `docs/product/PRODUCT_IDENTITY.md`
- **Role:** Approved product foundation.
- **Establishes:** product essence, why the product should exist, primary user model, core problem, product promise, MVP philosophy, emotional north star, gamification sequencing, success criteria, and what the product explicitly is not — each statement labeled Confirmed, Hypothesis, Future direction, or Excluded from v1.
- **Does not establish:** specific v1 feature requirements or acceptance criteria (deferred to the PRD) or any domain/technical detail.
- **Modifiable silently by later sessions:** No.

### 3. `docs/product/ANNOTASI_FINANCE_MVP_PRD.md`
- **Role:** The current authoritative MVP requirements baseline for the Private Beta, supporting downstream domain modeling.
- **Establishes:** the closed six-type Financial Event set, account/category/fund/debt requirements, correction and lifecycle rules, reporting-period rules, dashboard and traceability requirements, authentication/privacy requirements, mobile-first requirements, language requirements, launch criteria, and a consolidated Open Questions section (Section 28) — including the eight decisions the product owner resolved to unblock domain modeling.
- **Does not establish:** any technology, framework, database, or API decision (explicitly out of scope per its own Section 1), nor final UX copy/terminology (marked Hypothesis, pending UX terminology review).
- **Document status:** its own Section 1 status remains "Draft for review." It contains explicit open questions (Section 28) and candidate terminology (e.g., Section 13, Section 22) alongside its confirmed requirements — it is the current authoritative requirements baseline, not a final frozen specification.
- **Modifiable silently by later sessions:** No.

### 4. `docs/domain/UBIQUITOUS_LANGUAGE.md`
- **Role:** Canonical shared domain vocabulary.
- **Establishes:** the precise internal name and definition for every confirmed domain concept, distinctions between similar-sounding terms (e.g., the different "balance" terms), preferred vs. ambiguous/prohibited terms, and a list of still-open terminology questions.
- **Does not establish:** It does not serve as the authoritative relationship/cardinality model (`docs/domain/DOMAIN_CONCEPT_MODEL.md` holds that role) and does not classify entities, value objects, aggregates, bounded contexts, or implementation structures — purely vocabulary.
- **Modifiable silently by later sessions:** No.

### 5. `docs/domain/DOMAIN_CONCEPT_MODEL.md`
- **Role:** Plain-language domain concept relationship map.
- **Establishes:** which concepts relate to which, confirmed cardinalities (only where the PRD confirms them), confirmed lifecycle constraints, derived-vs-directly-edited distinctions, the confirmed Financial Invariants restated relationally, scenario-based relationship tests, and a list of still-open relationship questions.
- **Does not establish:** any Entity/Value Object/Aggregate/Bounded Context classification, nor any implementation, persistence, or API concept.
- **Modifiable silently by later sessions:** No.

### 6. `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`
- **Role:** Candidate product-level classification of every canonical concept.
- **Establishes:** for 54 concepts, a candidate classification (Candidate Entity, Candidate Value Object, Derived Value, Classification/Enumeration Candidate, Configuration/Policy Candidate, Lifecycle State Candidate, Relationship Concept Candidate, Not a Domain Object, or Still Open), with reasoning, identity/equality analysis, lifecycle-continuity tests, and stress-test scenarios.
- **Does not establish:** any Aggregate, Aggregate Root, Domain Service, Repository, Command, Domain Event, Bounded Context, database identifier, key type, persistence mechanism, API contract, or framework choice.
- **Modifiable silently by later sessions:** No.

### 7. `docs/domain/AGGREGATE_CANDIDATES.md`
- **Role:** Candidate product-domain consistency-boundary analysis.
- **Establishes:** provisional Candidate Aggregate boundaries and Candidate Aggregate Roots; local and cross-boundary invariants; coordination requirements; aggregate alternatives; oversized- and undersized-boundary risks; stress-test scenarios; and a recommended hybrid candidate baseline.
- **Does not establish:** final Aggregate boundaries or roots, persistence transactions, repositories, APIs, commands, domain events, services, Architecture, frameworks, or any implementation decision.
- **Modifiable silently by later sessions:** No.

### 8. `docs/domain/DOMAIN_BEHAVIOR_CATALOG.md`
- **Role:** Current product-domain behavior baseline.
- **Establishes:** 55 documented product-domain behaviors; business intent; separated preconditions, accepted effects, and rejection conditions; affected candidate boundaries; local and cross-boundary invariants; recalculation scope; lifecycle and correction interactions; traceability requirements; and protected open questions.
- **Does not establish:** APIs, commands, handlers, services, domain events, repositories, persistence, database schemas, final Aggregate boundaries, Architecture, frameworks, or implementation decisions.
- **Modifiable silently by later sessions:** No.

### 9. `docs/domain/DOMAIN_BEHAVIOR_DECISION_TABLES.md`
- **Role:** Reviewed product-domain decision-table baseline and candidate-boundary participation analysis.
- **Establishes:** reviewable decision logic for all 55 reviewed product-domain behaviors; a provisional Candidate Domain Evaluation Sequence; behavior-specific candidate fact providers; accepted, blocked, and open branches; all-or-nothing meaning for cross-boundary behaviors; chronological recalculation and traceability consequences; and rejection/blocking, ambiguity, participation, and stress-test analysis.
- **Does not establish:** final Aggregate boundaries, final Aggregate Roots, final coordination ownership, APIs, commands, handlers, services, domain events, repositories, transactions, persistence, database schemas, Architecture, frameworks, or implementation decisions.
- **Modifiable silently by later sessions:** No. Later sessions may not silently rewrite its reviewed conclusions.

### 10. `docs/domain/DOMAIN_DECISION_REGISTER.md`
- **Role:** Reviewed domain-decision baseline resolving or classifying the remaining product-domain decisions required before normative specification and Architecture.
- **Establishes:** classification of 41 product-domain decisions; resolution of all 18 decisions required before Executable Domain Specification; closure of the previously acceptance-blocking behavior gaps (Dedicated Fund rename/restore, complete Debt Record deletion eligibility, manual Trash permanent deletion); deterministic same-date ordering; Transfer source/destination equality; Ordinary-versus-Fund-Linked Expense correction classification; allocation and candidate-boundary responsibility; Dedicated Fund, Debt Record, Trash, Reporting Period, historical-totals, and Restoration rules; and an explicit distinction between immediate domain decisions, Architecture deferrals, Implementation deferrals, post-MVP deferrals, and v1 exclusions, plus constraints future Architecture may not redefine.
- **Does not establish:** APIs, commands, handlers, services, domain events, repositories, transactions, persistence, database schemas, framework modules, Architecture, or implementation of any kind.
- **Modifiable silently by later sessions:** No. Every decision inside it carries its own Approval State (`Pending Review` throughout); this document does not edit or reinterpret those internal labels.

### 11. `docs/domain/EXECUTABLE_DOMAIN_SPECIFICATION.md`
- **Role:** Final reviewed Domain Modeling consolidation and normative Private Beta v1 product-domain baseline.
- **Establishes:** all 41 Session 21 decisions; all 55 documented domain behaviors; exactly six Financial Event types; domain identities and reference semantics; money, date, timezone, and reporting policies; lifecycle states; global and concept-local invariants; deterministic Event Date plus Workspace confirmation-order chronology; correction, replacement, deletion, Trash, and Restoration; formulas and derived values; chronological recalculation; blocking outcomes; numeric acceptance examples; property-oriented test specifications; and constraints future Architecture must preserve.
- **Does not establish:** technology stack, API contracts, database schemas, repository interfaces, transaction technology, deployment topology, framework modules, or implementation classes.
- **Modifiable silently by later sessions:** No. A genuine conflict or missing product rule requires an explicit return to domain review.

### 12. `docs/architecture/ARCHITECTURE_BASELINE.md`
- **Role:** Reviewed Private Beta v1 technical Architecture baseline.
- **Establishes:** a web application plus separate modular-monolith API in one monorepo; strict TypeScript, Next.js, NestJS/Fastify, PostgreSQL, Drizzle, and Zod technology categories; PostgreSQL as the authoritative store; server-derived Workspace scope plus PostgreSQL RLS; one PostgreSQL transaction for complete cross-boundary financial acceptance; Event Date plus Workspace confirmation-order position for chronology; targeted affected-history recalculation; a hybrid strategy of current projections and calculated reads; current-name display plus complete immutable Same-Type Edit version history; exact whole-Rupiah representation across PostgreSQL, backend, REST/JSON, and browser; atomic and idempotent Private Beta entitlement redemption; a prohibition on browser import of the authoritative domain package; explicit rejection of microservices, event sourcing, eventual consistency, floating-point money, timestamp chronology, last-write-wins, general-purpose queue infrastructure, and Kubernetes for v1; and bounded Implementation-Time Selections for Session 24.
- **Does not establish:** detailed API contracts, table-by-table schemas, migration SQL, package manifests, implementation tickets, estimates, or application code.
- **Modifiable silently by later sessions:** No.

### 13. `docs/implementation/MVP_IMPLEMENTATION_PLAN.md`
- **Role:** Reviewed Private Beta v1 implementation plan and final planning artifact before implementation.
- **Establishes:** bounded Architecture implementation-time selections; technology-version baselines and verification requirements; implementation provider candidates; operational and performance budgets; repository initialization order; dependency and package boundaries; delivery plans for authentication, opaque application sessions, onboarding, Workspace isolation, RLS, exact money, chronology, transactions, idempotency, recalculation, traceability, reporting, security, observability, deployment, backup, and recovery; 14 implementation milestones; 30 review-sized vertical slices; the dependency graph and 25-slice critical path; 9 quality gates; mappings for all 21 Architecture risks; Definition of Ready and Definition of Done; and `SLICE-FOUND-001` as the only first implementation slice.
- **Readiness result:** Ready with Pre-Implementation Verification.
- **Does not establish or contain:** application code, framework initialization, package manifests, migrations, table-by-table schemas, detailed endpoint contracts, GitHub issues, or external tickets.
- **Modifiable silently by later sessions:** No.

### 14. `docs/implementation/FOUNDATION_DEPENDENCY_REGISTER.md`
- **Role:** Reviewed dependency, compatibility, security-advisory, CI-action, and clean-type-generation evidence for `SLICE-FOUND-001`.
- **Establishes:** the exact delivered foundation pins and their verification evidence; narrow transitive security overrides; the selected Architecture-boundary mechanism; GitHub Actions versions; and the clean-CI-safe Next.js route-type generation correction.
- **Does not establish:** product or domain behavior, a replacement Architecture baseline, database design, authentication/provider integration, deployment, or a guarantee that recorded versions remain current indefinitely.
- **Modifiable silently by later sessions:** No.

### 15. `docs/implementation/DATABASE_FOUNDATION_REGISTER.md`
- **Role:** Reviewed evidence register for the PostgreSQL, migration, database-role, RLS, exact-BIGINT, Testcontainers, Compose, and database-CI baseline delivered by Session 26 / `SLICE-FOUND-002`.
- **Establishes:** the exact delivered database-foundation pins and image; reviewed migration evidence; role and least-privilege evidence; forced-RLS and transaction-local Workspace-context evidence; exact-BIGINT round-trip evidence; Testcontainers and Compose lifecycle evidence; database-specific CI coverage; and reconsideration triggers.
- **Does not establish:** product or domain behavior, product tables, authentication or session persistence, provider configuration, deployment, or a guarantee that recorded versions and capabilities remain current indefinitely.
- **Modifiable silently by later sessions:** No.

### 16. `docs/implementation/IDENTITY_SESSION_REGISTER.md`
- **Role:** Reviewed evidence register for the managed Clerk identity and persisted opaque application-session baseline delivered by Session 27 / `SLICE-IAM-001`.
- **Establishes:** the exact delivered identity/session pins; Clerk Core 3 signup, email-code verification, login, recovery, and live development-instance smoke evidence; provider-token exchange boundaries; PostgreSQL-backed opaque application-session issuance, lookup, expiry, revocation, recovery consequences, and restart survival; recovery preservation of the fresh provider session; cookie, Origin/CORS/CSRF/content-type controls; safe Indonesian authentication errors; safe structured API lifecycle logging; frontend flows; selective shadcn/ui baseline; IAM-specific CI and test evidence; and reconsideration triggers.
- **Does not establish:** a local User mapping, Workspace, starter Account, Private Beta entitlement or consumption, onboarding, Workspace-scoped product RLS, financial behavior, production provider configuration, deployment, or a guarantee that recorded versions and provider capabilities remain current indefinitely.
- **Modifiable silently by later sessions:** No.

### 17. `docs/implementation/ONBOARDING_ISOLATION_REGISTER.md`
- **Role:** Reviewed evidence register for the Private Beta onboarding, local User mapping, private Workspace, starter Account, entitlement, atomicity, idempotency, and Workspace-isolation baseline delivered by Session 28 / `SLICE-IAM-002`.
- **Establishes:** the delivered invitation lifecycle and least-privilege role model; verified-email resolution; one-transaction User–Workspace–starter-Account onboarding; deterministic concurrency and replay behavior; transactional rollback evidence; server-derived User/Workspace scope; forced-RLS evidence; complete automated Isolation Gate; live Clerk development-instance onboarding validation; Indonesian onboarding UI; operator invitation CLI; IAM-002 CI; and reconsideration triggers.
- **Does not establish:** shared Workspace membership, collaboration invitations, Workspace roles, broader Account management, Account opening-state correction, Category, Dedicated Fund, Debt Record, Financial Event, financial behavior, reporting, production deployment, or a later implementation slice.
- **Modifiable silently by later sessions:** No.

### 18. `docs/implementation/IAM_002_ONBOARDING_TESTING_GUIDE.md`
- **Role:** Reviewed operational guide for repeatable IAM-002 live validation and the delivered starter Account field semantics.
- **Establishes:** safe local onboarding steps; operator invitation issue/revocation usage; field explanations; live postcondition checks; restart and persistence checks; and the boundary between current IAM-002 behavior and later Account slices.
- **Does not establish:** product/domain authority, new Account behavior, a replacement implementation plan, production operations, or implementation beyond `SLICE-IAM-002`.
- **Modifiable silently by later sessions:** No.

The project-local skill artifacts (`.agents/`, `.claude/`, `skills-lock.json`) are tooling configuration, not approved product or domain artifacts, and are not listed above.

---

## 5. Current Domain Baseline

This section summarizes `docs/domain/DOMAIN_OBJECT_CANDIDATES.md` §5–§13. **All items below remain candidate classifications, not implementation classes or final aggregate decisions.**

### Candidate Entities
- User
- Workspace
- Account
- Financial Event
- Category
- Dedicated Fund
- Debt Record

### Candidate Value Objects
- Opening Balance
- Opening-Balance Effective Date
- Event Date
- Created Timestamp
- Updated Timestamp
- Target Amount
- Opening Outstanding Principal

`DOMAIN_OBJECT_CANDIDATES.md` itself did not select exact implementation types for money, dates, time, or identifiers. Later Architecture and Implementation Plan artifacts now establish the applicable representation baselines; the original candidate classifications remain unchanged.

### Derived Values
- Total Account Balance
- Unallocated Amount
- Workspace Total Balance
- Fund Balance
- Outstanding Principal
- Current Account-Backed Fund Allocation amount

### Relationship Concept Candidate
- Account-Backed Fund Allocation — the earlier candidate artifact left independent identity open; Session 22 now normatively specifies no independent lot identity and identifies the relationship by the Account–Dedicated Fund pair (`EXECUTABLE_DOMAIN_SPECIFICATION.md` §§6, 8, 16).

### Classification and Policy Areas

Summarized without reproducing full detail (see `DOMAIN_OBJECT_CANDIDATES.md` §9–§11 for reasoning):

- **Event Type** — the closed six-member classification of a Financial Event (Income, Expense, Transfer, Fund Allocation, Fund Release, Debt Repayment).
- **Account Type** — the fixed four-member classification of an Account (Cash, Bank Account, E-Wallet, Other).
- **Income/Expense Category kinds** — Income Category and Expense Category are non-overlapping kinds; the actual category names within each kind are user-extensible, not a fixed enumeration.
- **Reporting Period** — a Workspace-owned configuration choice (Calendar Month or one Custom Monthly Cycle) with exactly one active configuration. The candidate artifact deferred technical representation to Architecture; Architecture has since assigned the technical responsibility, while exact schema and code shape remain slice-level implementation details.
- **Calendar Month** — the fixed default Reporting Period.
- **Custom Monthly Cycle** — an optional Reporting Period with a single start-day parameter (days 1–28).
- **Asia/Jakarta Workspace Timezone** — a fixed, non-configurable v1 policy.
- **Deterministic Same-Date Ordering** — Event Date is primary and immutable Workspace confirmation-order position resolves every same-date tie; Architecture chooses representation without changing that meaning.
- **Financial Invariants** — the fixed rule set constraining all financial state at every historical point (see Section 6 below).
- **Lifecycle states** such as Trash and Archive — named states resulting from confirmed processes (Soft Deletion, Archiving); exact implementation shape is undecided.

No candidate above has been converted into a final implementation type by this document.

### Aggregate Candidate Baseline

Session 18 reviewed the following candidate baseline. **Every Aggregate classification and recommendation remains provisional; none is a final domain or implementation decision** (`docs/domain/AGGREGATE_CANDIDATES.md` §§1, 5, 23).

**Strong Candidate Aggregates:**
- Account
- Debt Record

**Plausible Candidate Aggregates:**
- Workspace for ownership plus selected configuration
- Financial Event
- Category
- Dedicated Fund

**Weak independent candidate:**
- Reporting configuration — Session 22 places domain responsibility inside Workspace; Architecture translates that approved responsibility into a technical form

**Rejected candidate baseline:**
- One Workspace Aggregate containing all financial history and configuration

### Candidate Coordination Hotspots

- **Transfer:** one Financial Event plus two Accounts.
- **Fund Allocation, Fund Release, and Fund-Linked Expense:** one Financial Event plus one Account plus one Dedicated Fund.
- **Debt Repayment:** one Financial Event plus one Account plus one Debt Record.
- **Correction and Restoration:** every old and new chronologically affected candidate boundary.

These hotspots state which provisional domain boundaries participate in one logical result. They do not select a persistence transaction, repository, service, command, domain event, message, or any other implementation mechanism (`AGGREGATE_CANDIDATES.md` §§15–16, 23).

### Reviewed Domain Behavior Baseline

Session 19 established the following reviewed behavior baseline (`docs/domain/DOMAIN_BEHAVIOR_CATALOG.md` §§1, 5, 23–29):

- 55 product-domain behaviors are documented; their documentation identifiers do not imply APIs, commands, methods, services, or implementation structures.
- The six Financial Event forms remain distinct: Income, Expense, Transfer, Fund Allocation, Fund Release, and Debt Repayment. Fund-Linked Expense remains an Expense form rather than a seventh Event Type.
- A rejected behavior preserves the previously confirmed state.
- Effects involving multiple candidate boundaries are accepted all-or-nothing at the product-domain level.
- Complete effective-date validation is cross-boundary because Event Date belongs to Financial Event while Account or Debt Record provides the applicable effective-date constraint.
- Correction evaluates both old and proposed histories from the earliest affected point.
- Existing Financial Events are never silently removed or excluded by opening-state correction or reporting regrouping.
- Chronological Recalculation validates every later affected point, not only the final result.
- Reporting regrouping changes membership and derived reporting totals only; it does not change Financial Event facts, Event Dates, Account balances, Fund allocations, Dedicated Fund Balance, or Outstanding Principal.
- Every important derived value and multi-sided Financial Event effect remains traceable to Supporting Records.

At Session 19, the behavior baseline kept Dedicated Fund rename, Dedicated Fund restoration, permanent deletion from Trash, and complete Debt Record deletion eligibility open. Session 21 resolved/classified those questions and Session 22 incorporated the results; this historical note does not reopen them.

### Reviewed Domain Behavior Decision-Table Baseline

Session 20 established the following reviewed decision-table baseline (`docs/domain/DOMAIN_BEHAVIOR_DECISION_TABLES.md` §§1–7, 20–31):

- Blocked proposals preserve previously confirmed state.
- Accepted outcomes involving multiple candidate boundaries are all-or-nothing at the product-domain level.
- Candidate fact providers are behavior-specific and remain provisional; they do not imply repository, persistence, or final Aggregate Root ownership.
- Complete effective-date validity remains cross-boundary because Event Date belongs to Financial Event while Account or Debt Record supplies the applicable effective-date constraint.
- Historical correction evaluates every later affected point from the earliest old or proposed affected point.
- No existing Financial Event is silently excluded from history during correction, restoration, effective-date change, or reporting regrouping.
- Reporting regrouping changes period membership and derived reporting totals only; it does not change financial facts.
- Dedicated Fund archival itself changes lifecycle eligibility only and does not recalculate financial history.
- Open decisions have three distinct meanings: **Acceptance-Blocking Open Decision**, **Conditional Open Branch**, and **Non-Blocking Deferred Detail**. A non-blocking deferred detail does not prevent a confirmed behavior from reaching its accepted outcome.
- The Candidate Domain Evaluation Sequence is provisional domain reasoning. It is not an API validation order, user-facing error-priority contract, transaction sequence, or implementation design.

The decision tables preserve every candidate Aggregate and Candidate Aggregate Root status as provisional. They do not finalize cross-boundary coordination responsibility or resolve any protected open question.

### Reviewed Domain Decision Register Baseline (Session 21)

Session 21 reviewed and closed the decision-closure focus items Session 20 identified, producing `docs/domain/DOMAIN_DECISION_REGISTER.md` (`docs/domain/DOMAIN_DECISION_REGISTER.md` §§1, 6, 26). Every one of its 41 decisions carries an Approval State of `Pending Review`, preserved exactly as recorded in that artifact.

**Decision Status distribution (41 total):**
- Recommended for Approval: 30
- Preserve Open: 0
- Defer to Architecture: 2
- Defer to Implementation Detail: 1
- Defer Post-MVP: 3
- Excluded from v1: 3
- No Additional Decision Required: 2

**Decision Readiness distribution (41 total):**
- Must Resolve Before Executable Domain Specification: 18
- Should Resolve Before Architecture: 13
- Safe to Resolve During Architecture: 2
- Safe to Resolve During Implementation: 3
- Safe to Defer Post-MVP: 3
- No Resolution Needed: 2

All 18 decisions classified Must Resolve Before Executable Domain Specification now have concrete, reviewed resolutions (`DOMAIN_DECISION_REGISTER.md` §7, §27). Zero decisions remain Preserve Open.

### Named Non-Blocking Deferrals (Session 21)

These did not block Session 22 and remain carried forward where stated (`DOMAIN_DECISION_REGISTER.md` §§20–23, 26–27; `EXECUTABLE_DOMAIN_SPECIFICATION.md` §31):

**Architecture:**
- current-name-only versus optional historical-name storage (DEC-TRACE-01);
- prior edited field-value storage depth (DEC-TRACE-02).

**Implementation Detail:**
- replaced-event list placement (DEC-LIFE-04).

The following presentation details remain for Implementation without forming separate Decision Status entries of their own: correction-reason field presentation; blocker-message presentation order; Impact Preview presentation; validation/error wording.

**Post-MVP:**
- Dedicated Fund Target Date (DEC-FUND-05);
- one-off reporting ranges (DEC-REPORT-06);
- Trash expiry/retention design (DEC-LIFE-02).

**v1 Exclusions:**
- manual Permanent Deletion from Trash (DEC-LIFE-03);
- user-controlled Account exclusion from totals (DEC-REPORT-05);
- Debt Record archive/restore (DEC-DEBT-04).

### Reviewed Executable Domain Specification Baseline (Session 22)

Session 22 produced `docs/domain/EXECUTABLE_DOMAIN_SPECIFICATION.md`, the final reviewed Domain Modeling consolidation for the Private Beta v1 baseline. It incorporates all 41 Session 21 decisions, accounts for all 55 documented domain behaviors, and defines exactly six Financial Event types. It normatively consolidates domain identities and references; money, date, timezone, and reporting policies; lifecycle states; global and concept-local invariants; deterministic Event Date plus Workspace confirmation-order chronology; correction, replacement, deletion, Trash, and Restoration; formulas and derived values; chronological recalculation; blocking outcomes; acceptance examples; property-oriented test specifications; and the constraints future Architecture must preserve.

**Domain Modeling completion counts:**

| Navigation measure | Count |
|---|---:|
| Top-level specification sections | 35 |
| Session 21 decisions incorporated | 41 |
| Behavior IDs covered | 55 |
| Financial Event types | Exactly 6 |
| Global invariant rows | 26 |
| Formula rows | 6 |
| State-transition rows | 21 |
| Blocking-condition rows | 26 |
| Numeric acceptance examples | 37 |
| Property-oriented specifications | 32 |

These counts are navigation metadata, not substitutes for reading the executable specification. The artifact does not establish a technology stack, API contracts, database schemas, repository interfaces, transaction technology, deployment topology, framework modules, or implementation classes.

### Reviewed Architecture Baseline (Session 23)

Session 23 produced `docs/architecture/ARCHITECTURE_BASELINE.md`, the reviewed Private Beta v1 technical Architecture baseline, translating the Executable Domain Specification into a concrete, implementation-ready technical shape without weakening or reopening domain meaning. It has been reviewed, committed, and pushed.

**Architecture Baseline navigation metadata:**

| Navigation measure | Count |
|---|---:|
| Top-level Architecture sections | 41 |
| Architecture decisions | 66 |
| Adopted Candidate Baseline | 35 |
| Architecture Constraint | 4 |
| Implementation-Time Selection | 6 |
| Deferred Post-MVP | 3 |
| Rejected for v1 | 18 |
| Explicit rejected-alternative records | 20 |
| Architecture risk records | 21 |

These counts are navigation metadata, not substitutes for reading `docs/architecture/ARCHITECTURE_BASELINE.md` directly.

**Adopted Technical Baseline (minimum record):** monorepo with `apps/web` and `apps/api`; framework-independent `packages/domain`; `packages/contracts`; strict TypeScript; pnpm workspaces and Turborepo; Next.js and React; NestJS with Fastify; PostgreSQL; Drizzle and reviewed SQL migrations; Zod at transport/configuration boundaries; managed identity category; secure opaque HttpOnly cookie sessions; server-derived Workspace authority; PostgreSQL RLS; PostgreSQL BIGINT-equivalent whole-Rupiah storage; backend `bigint`/exact-integer representation; base-10 integer strings for REST/JSON money; browser exact-integer handling; Event Date plus Workspace monotonic confirmation position; one database transaction per confirmed financial behavior; Workspace write serialization plus entity versions; Workspace-scoped idempotency; targeted chronological recalculation; complete immutable Same-Type Edit versions; current-name historical display; REST/JSON preview-and-confirm interaction; no authoritative browser financial calculation; no general-purpose queue or worker fleet; managed web/API/PostgreSQL single-region deployment category; automated backups/PITR and restore drills. This list is not a reinterpretation or extension of the baseline — see `docs/architecture/ARCHITECTURE_BASELINE.md` directly for full reasoning and the complete decision set.

### Reviewed MVP Implementation Plan Baseline (Session 24)

Session 24 produced `docs/implementation/MVP_IMPLEMENTATION_PLAN.md`, the reviewed Private Beta v1 implementation plan and final planning artifact before implementation. It resolves the bounded Architecture implementation-time selections; defines version baselines and their verification requirements; selects provider candidates; sets operational and performance budgets; orders repository initialization; defines package boundaries; and plans authentication, Annotasi-Finance-owned opaque application sessions, onboarding, Workspace isolation, RLS, exact money, chronology, transactions, idempotency, recalculation, traceability, reporting, security, observability, deployment, backup, and recovery delivery. It contains no application code, framework initialization, package manifest, migration, table-by-table schema, detailed endpoint contract, GitHub issue, or external ticket.

**Implementation Plan navigation metadata:**

| Navigation measure | Count / Result |
|---|---:|
| Top-level sections | 45 |
| Implementation selections | 16 |
| Selected for Initial Implementation | 9 |
| Selected with Pre-Implementation Verification | 5 |
| Conditional Selection | 1 |
| Deferred Until Pre-Beta | 1 |
| Not Selected for v1 | 0 |
| Official research-source rows | 23 |
| Implementation milestones | 14 |
| Vertical slices | 30 |
| Quality gates | 9 |
| Architecture risks mapped | 21 |
| Critical-path slices | 25 |
| First implementation slice | `SLICE-FOUND-001` |
| Session 25 readiness | Ready with Pre-Implementation Verification |

These counts are navigation metadata only and never replace reading the complete plan.

**Selected implementation baseline:** Node.js 24.x Active LTS category; latest compatible TypeScript 6.x stable patch for initial implementation; pnpm 11.x; Turborepo 2.10.x; Next.js 16.x; React 19.x; NestJS 11.x; `@nestjs/platform-fastify` >=11.1.24; Drizzle ORM and Drizzle Kit; Zod 4.x; PostgreSQL 17 candidate with PostgreSQL 16 fallback; Vitest; fast-check and `@fast-check/vitest`; Testcontainers PostgreSQL; Playwright with axe integration; Clerk for managed identity verification; Annotasi-Finance-owned opaque server-side application sessions; Neon Singapore as the selected managed PostgreSQL candidate with Supabase as fallback; Vercel Singapore for web; Fly.io Singapore as the API-hosting candidate; Sentry for telemetry; GitHub Actions for CI; Singapore as the production-region baseline; a single-use invitation token bound to invited email; auditable manual export for the first beta wave; and an auditable manual owner-account-deletion request for the first beta wave.

All exact versions and provider capabilities require the bounded pre-implementation verification named in the plan. `PROJECT_STATE.md` does not independently guarantee current versions, prices, regions, quotas, or provider capabilities.

**Deferred and conditional selections:**

- the exact owner-account-deletion retention window is Deferred Until Pre-Beta, must be resolved before the first beta invitation, does not block `SLICE-FOUND-001`, and is separate from Financial Event Trash;
- Financial Event Trash has no expiry or permanent deletion in v1;
- Clerk email delivery is conditional on observed deliverability;
- Render is an unverified contingency candidate, not a selected fallback;
- Session 25 does not select or implement asynchronous owner-account-deletion orchestration, a queue, a worker, or a job mechanism;
- no queue or worker technology is selected;
- no self-service export or deletion is selected for the first beta wave.

### Completed Technical Foundation Baseline (Session 25 / `SLICE-FOUND-001`)

Session 25 implemented the reviewed `SLICE-FOUND-001` boundary. The slice passed review, all eight local Foundation Gate non-database checks, GitHub Actions on its Pull Request, and GitHub Actions again after merge to `dev`. It is now merged into `dev`; `main` remains production-only and has not received this implementation.

**Delivered repository structure:**

- `apps/web`;
- `apps/api`;
- `packages/domain`;
- `packages/contracts`;
- `packages/config`;
- `packages/test-support`.

**Delivered technical capabilities:**

- pnpm/Turborepo monorepo;
- strict shared TypeScript;
- Next.js web foundation shell;
- NestJS/Fastify API-readiness shell;
- framework-independent domain package boundary;
- contracts, configuration, and test-support package skeletons;
- formatting and lint baseline;
- five negative Architecture-boundary fixtures;
- initial non-database GitHub Actions workflow;
- non-secret environment examples;
- deterministic lockfile;
- Foundation dependency and advisory register.

**Exact delivered version metadata:**

| Component | Delivered version |
|---|---:|
| Node.js | 24.18.0 |
| pnpm | 11.19.0 |
| TypeScript | 6.0.3 |
| Turborepo | 2.10.8 |
| ESLint | 10.8.0 |
| typescript-eslint | 8.65.0 |
| Prettier | 3.9.6 |
| Vitest | 4.1.10 |
| Next.js | 16.2.12 |
| React and React DOM | 19.2.8 |
| NestJS | 11.1.28 |
| Fastify | 5.10.0 |
| Zod | 4.4.3 |

These versions are navigation metadata derived from the delivered manifests, lockfile, and `docs/implementation/FOUNDATION_DEPENDENCY_REGISTER.md`. `PROJECT_STATE.md` does not independently guarantee that they remain current.

**Historical Foundation Gate status after Session 25:** the non-database half was complete. Install, format check, lint, typecheck, smoke unit tests, Architecture-boundary checks, web build, and API build were green, and all five deliberate Architecture violations delivered by `SLICE-FOUND-001` were rejected. Session 26 has since completed the database half; the current full-gate status appears below.

### Completed Database Foundation Baseline (Session 26 / `SLICE-FOUND-002`)

Session 26 implemented and reviewed the approved `SLICE-FOUND-002` boundary. Its local validation passed, Pull Request CI was green, it was merged into `dev`, and the post-merge `dev` state is green. Those two foundation slices were the completed implementation set at the end of Session 26; Sessions 27 and 28 have since completed `SLICE-IAM-001` and `SLICE-IAM-002`, bringing the current total to four. `main` remains production-only and has received none of the four slices.

**Delivered repository structure:**

- `database/`;
- `infra/local/`;
- `docs/implementation/DATABASE_FOUNDATION_REGISTER.md`.

**Delivered technical capabilities:**

- PostgreSQL 17.10 local and integration-test baseline using the exact `postgres:17.10-alpine3.24` image;
- private `@annotasi/database` workspace;
- Drizzle ORM with a reviewed SQL migration workflow and Drizzle Kit migration metadata;
- `pg` / node-postgres as the single database driver;
- Testcontainers PostgreSQL integration harness;
- explicit container-administrator, migration, and application roles;
- restricted application role that is a non-owner, non-superuser, and lacks `BYPASSRLS`;
- minimal technical Workspace-scope RLS probe table, not a product Workspace or financial table;
- forced RLS with both `USING` and `WITH CHECK`;
- transaction-local `app.workspace_id` context;
- empty-database migration and second-fresh-database replay evidence;
- repeated migration-command tracked no-op proof;
- Workspace A/B denial and isolation proof, including context cleanup on pooled-connection reuse;
- exact BIGINT round-trip above JavaScript's safe-integer range;
- local Compose lifecycle;
- database-specific GitHub Actions job;
- nine total negative Architecture-boundary fixtures across the completed foundation.

**Exact delivered database dependency metadata:**

| Component | Delivered version |
|---|---:|
| PostgreSQL | 17.10 |
| PostgreSQL image | `postgres:17.10-alpine3.24` |
| `drizzle-orm` | 0.45.2 |
| `drizzle-kit` | 0.31.10 |
| `pg` | 8.22.0 |
| `testcontainers` | 12.0.4 |
| `@testcontainers/postgresql` | 12.0.4 |

These versions are navigation metadata derived from the delivered repository and `docs/implementation/DATABASE_FOUNDATION_REGISTER.md`. `PROJECT_STATE.md` does not independently guarantee that they remain current.

**Current gate status:** the full Foundation Gate is complete; the `SLICE-IAM-001` identity/session baseline and acceptance evidence are complete; and the Isolation Gate is complete. The First Financial Write Gate, Cross-Boundary Consistency Gate, Correction/Recalculation Gate, Reporting Consistency Gate, Pre-Beta Security Gate, Recovery Gate, and Private Beta Acceptance Gate remain not started. Milestone 3 Account and Category work is dependency-unblocked, but only `SLICE-ACC-001` is selected as the next slice. Financial-write readiness is not complete.

### Completed Identity and Application-Session Baseline (Session 27 / `SLICE-IAM-001`)

`SLICE-IAM-001` is implemented, reviewed, committed, pushed, and merged to `dev`. Its pull-request checks and the post-merge `dev` Foundation CI run are green. The authoritative evidence and limitations are recorded in `docs/implementation/IDENTITY_SESSION_REGISTER.md`.

The delivered baseline includes:

- managed Clerk email/password signup, email-code verification, login, and password-recovery flows;
- live manual validation against a Clerk development instance for signup, verification, token exchange, protected application-session use, login, recovery, process-restart survival, current-session logout, and all-session logout;
- Clerk used only to verify managed identity during the provider-token-to-Annotasi-Finance-session exchange;
- persisted opaque Annotasi Finance application sessions, with only a SHA-256 hash stored and no raw application-session token persisted;
- PostgreSQL-backed server-side session lookup, expiry enforcement, current-session revocation, all-session revocation, recovery-triggered revocation, and preservation of the fresh post-recovery provider session needed to complete the exchange;
- ordinary protected browser-to-API authorization through the secure `HttpOnly` application-session cookie, never through a Clerk token or Clerk session;
- valid application sessions surviving an API-process restart;
- Origin/CORS, CSRF, and content-type enforcement around the session boundary;
- safe Indonesian user-facing authentication errors and safe structured application-session lifecycle logging that excludes secrets and identifiers prohibited by the register;
- signup, verification, login, recovery, and protected-session frontend flows;
- selective shadcn/ui usage plus the required Clerk CSP and CAPTCHA integration constraints;
- a dedicated Identity and session CI check, with the final IAM-relevant suite totaling 133 tests: 59 API, 16 database, 8 config, and 50 web tests.

This slice persists only the technical application-session record and directly required metadata. It does **not** establish a local product User, Workspace, Account, entitlement, onboarding result, or financial product table.

### Completed Identity, Onboarding, and Workspace-Isolation Baseline (Session 28 / `SLICE-IAM-002`)

`SLICE-IAM-002` was implemented, reviewed, committed, pushed, and merged into `dev`. All four Pull Request CI jobs passed, and the post-merge `dev` GitHub Actions run is green. The reviewed evidence and repeatable live-validation guidance are recorded in `docs/implementation/ONBOARDING_ISOLATION_REGISTER.md` and `docs/implementation/IAM_002_ONBOARDING_TESTING_GUIDE.md`.

The delivered baseline includes:

- backend Clerk verified-email resolution;
- deterministic local User mapping keyed by managed-identity subject;
- operator-issued Private Beta invitations with cryptographically random invitation tokens and only token hashes stored;
- invitation expiry, revocation, verified-email binding, and single-use consumption;
- safe stdin-based invitation revocation and an operator invitation CLI;
- atomic User → private Workspace → starter Account onboarding;
- persistent onboarding idempotency and deterministic concurrency handling;
- rollback guarantees proven through transactional failpoints;
- exactly one private Single-Owner Workspace per User, fixed to IDR and Asia/Jakarta;
- server-derived Workspace authority;
- restricted application and operator database roles;
- forced PostgreSQL RLS with transaction-local `app.user_id` and `app.workspace_id` context;
- malformed, absent, and cross-Workspace context denial;
- the complete automated Isolation Gate;
- live Clerk development-instance onboarding validation;
- an Indonesian onboarding UI and a minimal already-onboarded Workspace-ready state; and
- a dedicated IAM-002 CI job.

A Private Beta invitation grants product access; it is not a Workspace collaboration invitation. No shared Workspace, member role, or multi-owner behavior exists. Opening Balance is Account starting state, not Income or a Financial Event. `SLICE-IAM-002` created no Category, Dedicated Fund, Debt Record, or Financial Event.

### Next Approved Account Management Slice (Session 29 / `SLICE-ACC-001`)

`SLICE-ACC-001` is the only next approved implementation slice and remains not started. Its entry conditions are satisfied: `SLICE-IAM-002` is merged and the Isolation Gate is green.

Its bounded navigation scope is:

- create additional Accounts;
- list Accounts within the authenticated private Workspace;
- rename an Account while preserving identity and history;
- archive an eligible Account;
- restore an archived Account;
- evaluate Account deletion eligibility without performing destructive deletion;
- deliver Account management frontend behavior;
- extend Workspace-scoped Account persistence and RLS for the approved lifecycle; and
- provide unit, property-oriented, PostgreSQL integration, API/security, frontend, and isolation-regression tests.

Exit requires INV-ACC-01–03 to be proven through property tests, Workspace isolation to remain green, soft Account lifecycle states to work correctly, and no destructive permanent deletion to be implemented.

The starter Account created by onboarding becomes an ordinary Account managed by `SLICE-ACC-001`, and additional Accounts may then be created. Account name may be renamed, while Account identity must remain unchanged across rename, archive, and restore. Account Type remains fixed because no approved edit behavior currently exists. Opening Balance and Opening-Balance Effective Date remain fixed until `SLICE-ACC-002`. Archived Accounts remain part of history and, once Financial Event slices exist, must not be available for new financial activity. No Financial Event exists yet. No Account-Type migration behavior is implied.

`SLICE-ACC-001` explicitly does not implement Opening Balance correction; Opening-Balance Effective Date correction; Impact Preview; recalculation; Account Type change; negative balances; credit cards; overdraft; liability Accounts; Category; Dedicated Fund; Debt Record; Financial Event; Income; Expense; Transfer; Fund Allocation; Fund Release; Debt Repayment; dashboard; reporting; permanent Account deletion; `SLICE-ACC-002`; `SLICE-CAT-001`; or any later slice. Delete eligibility means evaluating whether deletion would be allowed by the approved rules; it does not authorize physical or permanent deletion in this slice.

**Frontend-tool navigation:** shadcn/ui is the approved component baseline and was adopted selectively in `SLICE-IAM-001`; Annotasi Finance owns and reviews the resulting component source. UI UX Pro Max remains optional and is not installed by this synchronization. 21st.dev remains an optional manual reference/component source; no 21st.dev subscription, MCP, API key, or automatic installation is approved. None of these tools may change product, domain, Architecture, identity, authorization, session, onboarding, or isolation rules.

---

## 6. Non-Negotiable Product and Domain Rules

1. Annotasi Finance v1 is multi-user, but each User owns exactly one private Single-Owner Workspace. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §6; `docs/domain/UBIQUITOUS_LANGUAGE.md` §5.*

2. Shared-Workspace invitations, household invitations, shared editing, household collaboration, and Workspace roles are excluded from v1. Private Beta access invitations are permitted as access-entitlement mechanics, not collaboration invitations; they still establish exactly one private Single-Owner Workspace. Their implementation was delivered by `SLICE-IAM-002`, not `SLICE-FOUND-001`. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §6, §8; `docs/product/PRODUCT_IDENTITY.md` §3; `docs/implementation/MVP_IMPLEMENTATION_PLAN.md` §§11, 34.*

3. There are exactly six closed v1 Financial Event types: Income, Expense, Transfer, Fund Allocation, Fund Release, Debt Repayment. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §11; `docs/domain/UBIQUITOUS_LANGUAGE.md` §6.*

4. Opening Balance is starting state, not a Financial Event and not Income. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §9, §11; `docs/domain/UBIQUITOUS_LANGUAGE.md` §7.*

5. Category describes purpose only and applies only to Income and Expense. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §13; `docs/domain/UBIQUITOUS_LANGUAGE.md` §5.*

6. Dedicated Fund is not an Account and holds no money independently. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §9, §14; `docs/domain/UBIQUITOUS_LANGUAGE.md` §8.*

7. Named purposes such as Qurban are Dedicated Fund instances, not Event Types or Categories. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §9, §13; `CLAUDE.md` §4.*

8. The Account balance equation always holds: Total Account Balance = Unallocated Amount + the sum of all current Account-Backed Fund Allocations backed by that Account. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §9; `docs/domain/UBIQUITOUS_LANGUAGE.md` §12.*

9. Total Account Balance, Unallocated Amount, Account-Backed Fund Allocation, and Outstanding Principal must never fall below Rp0. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §9, §12, §16; `docs/domain/UBIQUITOUS_LANGUAGE.md` §12.*

10. Fund Allocation and Fund Release do not change Total Account Balance. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §11, §14.*

11. Fund-Linked Expense draws only from the selected Dedicated Fund allocation backed by the same payment Account. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §11, §14.*

12. No FIFO, LIFO, or allocation-lot relationship exists in v1. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §14, §16; `docs/domain/UBIQUITOUS_LANGUAGE.md` §7.*

13. Transfer is one linked Financial Event, not an Income plus an Expense. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §11; `docs/domain/UBIQUITOUS_LANGUAGE.md` §6.*

14. Debt Repayment principal is not counted as Expense; interest, penalties, and fees are separate Expense events. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §11, §15.*

15. Event Date determines reporting placement; Created Timestamp and Updated Timestamp do not. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §16, §17; `docs/domain/UBIQUITOUS_LANGUAGE.md` §5, §10.*

16. Asia/Jakarta is fixed for all v1 workspace date and reporting boundaries. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §17, §21.*

17. Chronological Recalculation validates every affected historical point, not only the final state. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §16; `docs/domain/UBIQUITOUS_LANGUAGE.md` §11.*

18. Chronology uses Event Date first and immutable Workspace confirmation-order position to resolve every same-date tie. Same-Type Edit preserves position, Restoration reuses the original position, and Event Replacement receives a new position. — *`docs/domain/EXECUTABLE_DOMAIN_SPECIFICATION.md` §§8, 12.*

19. Every important number must be traceable to the records that produced it. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §19; `docs/domain/UBIQUITOUS_LANGUAGE.md` §5.*

20. Predictable pre-confirmation summary/detail disagreement blocks the proposal and preserves prior confirmed state. Post-hoc disagreement leaves accepted Financial Events and domain state unchanged but blocks release readiness until resolved. — *`docs/domain/EXECUTABLE_DOMAIN_SPECIFICATION.md` §§11, 24.*

### Normative Domain Baseline (Session 22)

The 20 rules above remain the non-negotiable baseline. Session 22 incorporated the reviewed Session 21 decisions below into the normative executable product-domain baseline. Their complete meaning and precedence live in `docs/domain/EXECUTABLE_DOMAIN_SPECIFICATION.md`, not in this summary:

- Account, Category, and Dedicated Fund names are not unique in v1 (DEC-NAME-01, DEC-NAME-02, DEC-NAME-03).
- Account rename is supported after onboarding (DEC-NAME-04).
- Dedicated Fund rename is supported (DEC-NAME-05).
- Same-date ordering uses Event Date plus each Financial Event's own immutable confirmation-order position (DEC-ORDER-01). Same-Type Edit preserves that position; Restoration reuses the original position; Event Replacement creates a new identity with a new position.
- Transfer requires distinct source and destination Accounts (DEC-TRANSFER-01).
- Adding or removing a Dedicated Fund reference on an Expense is a Same-Type Edit, not an Event Replacement (DEC-EXPENSE-01).
- Account-Backed Fund Allocation has no independent lot identity and is identified by the Account–Dedicated Fund pair (DEC-ALLOC-02). Account and Dedicated Fund share responsibility for allocation invariants (DEC-ALLOC-01).
- Workspace is a narrow ownership/configuration boundary, not one giant financial consistency boundary (DEC-AGG-01).
- Financial Event protects its identity, form, references, Event Date, and lifecycle, but cannot independently protect monetary invariants (DEC-AGG-02).
- Category is an independent small domain concept (DEC-AGG-03).
- Reporting Period configuration belongs to Workspace's responsibility (DEC-AGG-04, DEC-REPORT-02).
- Dedicated Fund archive requires Fund Balance = Rp0 (DEC-FUND-01). Dedicated Fund restoration is supported (DEC-FUND-02).
- Target Amount may be added, changed, or removed after history exists (DEC-FUND-03). Goal completion is derived from Fund Balance versus Target Amount, never explicitly writable (DEC-FUND-04).
- Target Date is deferred post-MVP (DEC-FUND-05).
- Debt Record permanent deletion requires current confirmed Opening Outstanding Principal = Rp0, no repayment history, and no other dependency (DEC-DEBT-01). Debt status is derived from Outstanding Principal (DEC-DEBT-02). Debt Record archive/restore is excluded from v1 (DEC-DEBT-04).
- Archived-reference Restoration is concept-specific: an archived Category never blocks Restoration; an archived Account or Dedicated Fund blocks Restoration only if reapplying the event would leave it archived with a non-zero balance (DEC-LIFE-01).
- Trash has no expiry and no permanent deletion (automatic or manual) in v1. A Trashed Financial Event remains retained, traceable, and eligible for a Restoration attempt indefinitely, but every attempt remains subject to current and later affected invariants (DEC-LIFE-01, DEC-LIFE-02, DEC-LIFE-03).
- Impact Preview triggers are fixed at the domain level (always for AC-06/07, DB-02/03, RP-03; conditionally for CR-01/02, LC-01/02 whenever recalculation reaches beyond the directly-changed event); Implementation controls presentation only (DEC-LIFE-05).
- Reporting Period changes regroup all history retroactively, never prospectively or from a split effective period (DEC-REPORT-01).
- Historical totals retain a later-archived Account's history (DEC-REPORT-03). Current Workspace Total sums all existing Accounts, including archived Accounts, which contribute Rp0 (DEC-REPORT-04). User-controlled Account exclusion from totals is excluded from v1 (DEC-REPORT-05).
- Dashboard/detail disagreement is acceptance-blocking when predictable pre-confirmation and a release-readiness defect (not a retroactive un-acceptance) when found post-hoc (DEC-TRACE-03).
- User-facing rejection presentation order remains an Implementation choice while every confirmed blocker remains enforced (DEC-REJECT-01).

Additional navigation reminders from the completed specification:

- Full Workspace isolation applies to every identity, reference, effect, derived view, report, Trash item, and export.
- Currency is IDR with whole-Rupiah precision only; timezone is fixed to Asia/Jakarta.
- Ordinary Expense and Fund-Linked Expense are forms of Expense, not additional Event Types.
- Opening Balance and Opening Outstanding Principal are starting state, not Financial Events.
- Every cross-boundary accepted effect is all-or-nothing; every blocked proposal preserves prior confirmed state.
- Every later affected chronological point must remain valid, and existing Financial Events are never silently excluded.
- Account, Dedicated Fund, Debt, Workspace, and reporting values remain reconcilable to their supporting records.

No additional domain decision is introduced by this summary.

### Current Architecture Constraints (Session 23)

`docs/architecture/ARCHITECTURE_BASELINE.md` establishes these Architecture-level constraints in addition to the domain rules above; implementation must preserve them, not resolve or reinterpret them:

- exactly six Financial Event Types;
- no partial cross-boundary acceptance;
- no floating-point money;
- no timestamp-based same-date chronology;
- no browser-authored Workspace authority;
- no browser execution of the authoritative domain engine;
- no `apps/web` import of `packages/domain`;
- no client-authoritative financial result;
- no last-write-wins financial writes;
- no silent exclusion of historical events;
- no permanent Financial Event deletion or Trash expiry;
- no general-purpose queue dependency for financial correctness;
- no event sourcing;
- no microservices;
- no unscoped authoritative rows;
- no entitlement consumption outside the atomic onboarding outcome;
- no duplicate User, Workspace, starter Account, or entitlement-consumption result under concurrent onboarding;
- no owner-account deletion treated as ordinary non-authoritative cleanup.

### Current Implementation Constraints (Session 24)

- exactly six Financial Event Types; the completed foundation, identity/session, and onboarding/isolation slices implement no financial behavior, and `SLICE-ACC-001` is not authorized to introduce financial behavior;
- `packages/domain` has no framework dependency; `apps/web` cannot import `packages/domain` or API application modules;
- `packages/contracts` cannot implement domain formulas, and `packages/test-support` cannot become a production dependency;
- no floating-point money or native JSON number for authoritative money;
- no browser-authored Workspace authority and no Clerk token as the ordinary browser-to-API authorization credential;
- no timestamp-based Financial Event chronology, partial cross-boundary acceptance, last-write-wins financial state, or silent historical-event exclusion;
- no permanent Financial Event deletion or Trash expiry;
- no general-purpose queue, microservices, event sourcing, or Kubernetes;
- no slice may bypass dependency order without explicit review;
- no implementing agent may stage, commit, or push.

---

## 7. Candidate Domain Classifications

This section points to, rather than repeats, `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`. See Section 5 above for the current baseline list. Key candidate-status caveats to preserve:

- **Every classification in the source document is explicitly a candidate**, not a final Entity/Value Object/Aggregate decision (`DOMAIN_OBJECT_CANDIDATES.md` §1, §3).
- **Account-Backed Fund Allocation** was undecided in the candidate artifact; the executable specification now fixes no independent lot identity and Account–Dedicated Fund pair identity.
- **Reporting Period** was structurally open in the candidate artifact; the executable specification fixes Workspace domain responsibility, Architecture has since assigned technical responsibility, and exact schema/code shape remains slice-level implementation detail.
- **Financial Goal** is classified as Not a Domain Object — it shares Dedicated Fund's identity entirely, not a separate concept (`DOMAIN_OBJECT_CANDIDATES.md` §6, §13).
- **Income/Expense/Transfer/Fund Allocation/Fund Release/Debt Repayment** each have a dual nature: an Event Type classifier member, and an informal name for a Financial Event instance of that type — no third, independently identified concept exists (`DOMAIN_OBJECT_CANDIDATES.md` §9).
- `DOMAIN_OBJECT_CANDIDATES.md` itself assigns no Aggregate, Aggregate Root, Domain Service, Repository, Command, Domain Event, or Bounded Context (`DOMAIN_OBJECT_CANDIDATES.md` §1, §18). The later `AGGREGATE_CANDIDATES.md` adds only provisional Aggregate and root candidates; it does not finalize them or introduce the other concepts in this list (`AGGREGATE_CANDIDATES.md` §§1, 21, 23).

For full reasoning, identity/equality analysis, and stress-test scenarios behind any classification, read `docs/domain/DOMAIN_OBJECT_CANDIDATES.md` directly — do not rely on this section alone for a classification decision.

---

## 8. Active Open Questions

No active unresolved product or domain question is currently identified as blocking `SLICE-ACC-001`. The managed-provider and onboarding/isolation verification required by the completed IAM slices is recorded in `docs/implementation/IDENTITY_SESSION_REGISTER.md`, `docs/implementation/ONBOARDING_ISOLATION_REGISTER.md`, and `docs/implementation/IAM_002_ONBOARDING_TESTING_GUIDE.md`; this does not silently resolve any future provider change or product-domain decision. The Identity and Naming, Funds and Goals, Debt, Event Lifecycle, Reporting and Totals, and Aggregate Boundaries lists below are retained only as a historical pre-Session-21 question index; Session 21 resolved/classified them and Session 22 incorporated those resolutions into the executable specification. They must not be reopened or treated as Still Open without an explicit domain review triggered by a genuine conflict or missing product rule. The UX Terminology items remain product/UX questions outside the completed normative domain baseline. The two Architecture-carried decisions were resolved by Session 23, and Session 24 resolved or bounded every Implementation-Time Selection needed for the approved slices.

**Current-question boundary:** only the **UX Terminology** subsection contains currently unresolved questions. Every other subsection in Section 8 is a historical pre-Session-21 question index, superseded by `docs/domain/DOMAIN_DECISION_REGISTER.md` and `docs/domain/EXECUTABLE_DOMAIN_SPECIFICATION.md`, and must not be treated as an active open-question backlog.

### Identity and Naming
- Whether Account names must be unique inside one Workspace. — *`docs/domain/DOMAIN_OBJECT_CANDIDATES.md` §15, §19.*
- Whether Category names must be unique within their Income/Expense kind. — *`docs/domain/DOMAIN_OBJECT_CANDIDATES.md` §15, §19.*
- Whether Dedicated Fund names must be unique. — *`docs/domain/DOMAIN_OBJECT_CANDIDATES.md` §15, §19.*
- Whether Account renaming is available after onboarding / after historical events exist (confirmed only at onboarding). — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §10; `docs/domain/DOMAIN_OBJECT_CANDIDATES.md` §14, §16, §19.*
- Whether Dedicated Fund renaming is supported at all. — *`docs/domain/DOMAIN_OBJECT_CANDIDATES.md` §14, §19.*

### Funds and Goals
- Whether Account-Backed Fund Allocation requires independent identity. — *`docs/domain/DOMAIN_OBJECT_CANDIDATES.md` §12, §19.*
- Whether an archived Dedicated Fund can be restored to active use. — *`docs/domain/DOMAIN_CONCEPT_MODEL.md` §9, §18; `docs/domain/DOMAIN_OBJECT_CANDIDATES.md` §19.*
- Whether non-zero Dedicated Fund archival is ever blocked outright vs. always allowed with confirmation. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §14, §28.*
- Whether a Target Amount can be changed or removed after allocation history exists. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §14, §28.*
- Whether a Financial Goal "completed" state is explicit or purely derived. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §14, §28.*
- Whether changing between ordinary and fund-linked Expense form is always a Same-Type Edit or requires Event Replacement in some cases. — *`docs/domain/DOMAIN_BEHAVIOR_CATALOG.md` §27.*

### Debt
- Whether debt status (Active/Paid Off) is explicit or purely derived from Outstanding Principal. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §15, §28.*
- Whether creditor/lender name is a separate Debt Record field or folded into the debt name. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §15, §28.*
- Complete eligibility for permanent Debt Record deletion beyond the confirmed repayment-reference blocker. — *`docs/domain/DOMAIN_BEHAVIOR_CATALOG.md` §§16, 27.*

### Event Lifecycle
- Whether a replaced event appears in ordinary history or only in its own detail/audit context. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §16, §28.*
- Historical question — superseded by DEC-LIFE-02 and DEC-LIFE-03: Financial Event Trash has no expiry, retention day-count, or permanent deletion in v1.
- Whether manual Permanent Deletion from Trash is available in v1. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §16, §28.*
- The exact threshold for requiring an Impact Preview confirmation. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §16, §28.*
- Whether high-impact correction requires a stated reason, together with the final Impact Preview threshold. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §16, §28; `docs/domain/DOMAIN_BEHAVIOR_CATALOG.md` §27.*
- The deterministic same-date ordering mechanism (the requirement itself is confirmed). — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §16; `docs/domain/UBIQUITOUS_LANGUAGE.md` §11.*
- Whether a Transfer's source and destination Accounts are explicitly required to differ. — *`docs/domain/DOMAIN_CONCEPT_MODEL.md` §8, §18.*
- The precedence among competing rejection and blocking conditions during correction or restoration. — *`docs/domain/DOMAIN_BEHAVIOR_CATALOG.md` §§24, 27.*
- Which archived references, if any, remain eligible when restoring a Financial Event. — *`docs/domain/DOMAIN_BEHAVIOR_CATALOG.md` §§19, 27.*

### Reporting and Totals
- Whether archived Accounts remain in historical Workspace Total Balance. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §12, §28.*
- Whether user-controlled exclusion of an Account from totals is allowed. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §12, §28.*
- Final Reporting Period modeling form (value/configuration pair vs. another form). — *`docs/domain/DOMAIN_OBJECT_CANDIDATES.md` §10, §19.*
- Whether a Reporting Period configuration change applies immediately or at the next session start. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §17, §28; `docs/domain/DOMAIN_BEHAVIOR_CATALOG.md` §27.*

### Aggregate Boundaries and Coordination
- Whether Workspace is an Aggregate Root or an ownership/scope boundary only. — *`docs/domain/AGGREGATE_CANDIDATES.md` §22.*
- Whether Financial Event is an Aggregate Root. — *`docs/domain/AGGREGATE_CANDIDATES.md` §22.*
- Whether Account owns current Account-Backed Fund Allocation state. — *`docs/domain/AGGREGATE_CANDIDATES.md` §22.*
- Whether Dedicated Fund owns its cross-account allocation breakdown. — *`docs/domain/AGGREGATE_CANDIDATES.md` §22.*
- Whether Category is an independent Aggregate or Workspace-owned configuration. — *`docs/domain/AGGREGATE_CANDIDATES.md` §22.*
- Whether Reporting Period configuration belongs inside Workspace's consistency boundary. — *`docs/domain/AGGREGATE_CANDIDATES.md` §22.*
- How cross-boundary Transfer, Fund Allocation, Fund Release, Fund-Linked Expense, and Debt Repayment preserve one logical result. — *`docs/domain/AGGREGATE_CANDIDATES.md` §§15, 16, 22.*
- How correction and Restoration preserve one logical result across every old and new chronologically affected candidate boundary. — *`docs/domain/AGGREGATE_CANDIDATES.md` §§13, 15, 16, 22.*
- Whether full historical recalculation belongs to one boundary or is a cross-boundary domain process. — *`docs/domain/AGGREGATE_CANDIDATES.md` §22.*
- How Traceability relates to candidate boundaries without creating one giant audit Aggregate. — *`docs/domain/AGGREGATE_CANDIDATES.md` §§12, 22.*
- Exact candidate-root participation for each cross-boundary behavior. — *`docs/domain/DOMAIN_BEHAVIOR_CATALOG.md` §§23, 27.*
- Whether Account or Dedicated Fund is responsible for current Account-Backed Fund Allocation state and its cross-account breakdown. — *`docs/domain/AGGREGATE_CANDIDATES.md` §22; `docs/domain/DOMAIN_BEHAVIOR_CATALOG.md` §27.*
- Which candidate boundary carries cross-boundary correction responsibility while preserving one all-or-nothing domain result. — *`docs/domain/DOMAIN_BEHAVIOR_CATALOG.md` §§23, 27.*

### Session 21 Decision-Closure Focus — Resolved

Session 21 is complete. Every question this focus list named received a reviewed, Pending-Review resolution in `docs/domain/DOMAIN_DECISION_REGISTER.md` (see Section 5's "Reviewed Domain Decision Register Baseline" and Section 6's "Current Approved Working Domain Rules" above for the resolutions themselves, and `DOMAIN_DECISION_REGISTER.md` directly for full reasoning): deterministic same-date ordering; Transfer source and destination equality; Ordinary Expense versus Fund-Linked Expense correction classification; Account-Backed Fund Allocation identity and domain responsibility; candidate Aggregate and Aggregate Root participation; Dedicated Fund rename, archive, and restoration; Target Amount change or removal after history; Financial Goal completion representation; complete Debt Record deletion eligibility; Debt status representation; creditor/lender structure; archived-reference restoration eligibility; replaced-event ordinary-history visibility; Trash retention and manual permanent deletion; Reporting Period application timing and modeling form; Account, Category, and Dedicated Fund name uniqueness; post-onboarding Account rename; archived Account inclusion in historical totals; user-controlled Account exclusion from totals; Impact Preview threshold; correction-reason requirement; rejection and blocking precedence; and cross-boundary coordination responsibility.

These items have reviewed resolutions in the Session 21 register and normative incorporation in `docs/domain/EXECUTABLE_DOMAIN_SPECIFICATION.md`. The register’s historical internal `Pending Review` labels remain untouched; the committed Session 22 artifact is now the approved product-domain source for downstream work.

### UX Terminology
- Final Bahasa Indonesia labels for the six Financial Event types. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §22.*
- Final Account Type labels (Tunai, Rekening Bank, Dompet Digital, Lainnya are candidates). — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §22.*
- Final Dedicated Fund UI terminology (ruling out only "Dompet" as a universal term). — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §9, §22.*
- Exact starter Category wording, count, and default set. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §13, §28.*
- Whether a Refund/Reimbursement default Income Category belongs in the starter set. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §13, §28.*

---

## 9. Deferred and Excluded Scope

### Deferred Product Direction
- Household collaboration (spouse invitations, shared/personal accounts, roles, audit trail). — *`docs/product/PRODUCT_IDENTITY.md` §3, §10; `docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §6, §29.*
- Learning Mode (teacher/student simulation). — *`docs/product/PRODUCT_IDENTITY.md` §10; `docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §6, §29.*
- Multi-owner or shared Workspace. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §6, §29.*
- Broader financial education and responsible-gamification expansion (gentle milestones, optional challenges), sequenced after trust and reflection are validated. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §29.*
- Later reporting sophistication beyond the four confirmed initial "noticing" items, where documented as future iteration. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §23, §26.*

### Excluded From v1
Confirmed exclusions, per `docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §8:
- Banking services, or holding/transferring user funds.
- Investment or trading functionality, projections, or credit/financial-health scores.
- Household collaboration and Learning Mode (see Deferred, above).
- Split transactions.
- Recurring or scheduled transactions.
- New debt borrowing/issuance as its own event (only repayment against an existing opening-balance debt).
- Merchant refunds and linked reversal mechanics.
- Multi-currency, foreign-currency accounts, and exchange-rate conversion (v1 is IDR-only).
- Transfers involving accounts not owned by the same user.
- Broad gamification (points, badges, levels, streaks, leaderboards, competitive comparison).
- Forecasting, predictive spending, AI-generated financial advice, automated budget recommendations.
- A routine admin/support interface for browsing raw user financial data.
- Full offline-first synchronization.

### Session 24 Resolved and Bounded Implementation Selections

Session 24 resolved the Architecture's implementation-time selection categories within the reviewed constraints. The selected baseline and navigation counts are recorded in Section 5; the implementation plan remains the authority for complete reasoning, evidence, costs, and reconsideration triggers.

One selection remains **Deferred Until Pre-Beta**: the exact owner-account-deletion retention window. It must be resolved before the first beta invitation, does not block `SLICE-FOUND-001`, and is distinct from Financial Event Trash. Financial Event Trash remains indefinitely recoverable in v1 with no expiry or permanent deletion.

Conditional or deliberately unselected details: Clerk email delivery remains conditional on observed deliverability; Render remains an unverified contingency candidate rather than a selected fallback; no asynchronous owner-account-deletion orchestration is selected by Session 25; no queue or worker technology is selected; and self-service export/deletion is not selected for the first beta wave.

---

## 10. Context Loading Strategy

### Level 1 — Always Read
For every new Claude Code session:
- `CLAUDE.md`
- `docs/project/PROJECT_STATE.md` (this document)

### Level 2 — Read by Task
Only read documents directly relevant to the task at hand.

- **Terminology task:** `docs/domain/UBIQUITOUS_LANGUAGE.md`
- **Relationship / domain-map task:** `docs/domain/UBIQUITOUS_LANGUAGE.md`, `docs/domain/DOMAIN_CONCEPT_MODEL.md`
- **Entity / value-object task:** `docs/domain/UBIQUITOUS_LANGUAGE.md`, `docs/domain/DOMAIN_CONCEPT_MODEL.md`, `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`
- **Aggregate candidate analysis:** `docs/domain/UBIQUITOUS_LANGUAGE.md`, `docs/domain/DOMAIN_CONCEPT_MODEL.md`, `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`, plus direct verification of PRD §9, §11, §12, §13, §14, §15, §16, §19. Read the full PRD only if those targeted sections reveal an inconsistency, a missing dependency, an affected open question, or an ambiguity that cannot be resolved selectively (see Level 3 below).
- **Domain Behavior Analysis (Session 19):** `docs/domain/UBIQUITOUS_LANGUAGE.md`, `docs/domain/DOMAIN_CONCEPT_MODEL.md`, `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`, `docs/domain/AGGREGATE_CANDIDATES.md`, plus direct verification of PRD §9, §11, §12, §13, §14, §15, §16, §17, §19. Read the full PRD only if targeted reading reveals an inconsistency, a missing dependency, an affected open question, or an unresolved ambiguity.
- **Domain Behavior Decision Tables and Boundary Participation Analysis (Session 20):** `docs/domain/UBIQUITOUS_LANGUAGE.md`, `docs/domain/DOMAIN_CONCEPT_MODEL.md`, `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`, `docs/domain/AGGREGATE_CANDIDATES.md`, `docs/domain/DOMAIN_BEHAVIOR_CATALOG.md`, plus direct verification of PRD §9, §11, §12, §13, §14, §15, §16, §17, §19, §28. Read the full PRD only if targeted reading exposes an inconsistency, a missing dependency, an affected open question, or an unresolved ambiguity. Session 20 is complete; this entry records its source-loading baseline.
- **Domain Decision Resolution (Session 21):** Read `CLAUDE.md`, `docs/project/PROJECT_STATE.md`, `docs/domain/UBIQUITOUS_LANGUAGE.md`, `docs/domain/DOMAIN_CONCEPT_MODEL.md`, `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`, `docs/domain/AGGREGATE_CANDIDATES.md`, `docs/domain/DOMAIN_BEHAVIOR_CATALOG.md`, and `docs/domain/DOMAIN_BEHAVIOR_DECISION_TABLES.md` completely. Directly verify PRD §9, §11, §12, §13, §14, §15, §16, §17, §19, and §28. Read `docs/product/PRODUCT_IDENTITY.md` only when ownership, trust, privacy, simplicity, or MVP product direction affects a recommendation. Read additional PRD sections only when a targeted rule depends on them or a source conflict appears. Session 21 is complete; this entry records its source-loading baseline.
- **Executable Domain Specification (Session 22):** Read completely: `CLAUDE.md`, `docs/project/PROJECT_STATE.md`, `docs/product/PRODUCT_IDENTITY.md`, `docs/product/ANNOTASI_FINANCE_MVP_PRD.md`, `docs/domain/UBIQUITOUS_LANGUAGE.md`, `docs/domain/DOMAIN_CONCEPT_MODEL.md`, `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`, `docs/domain/AGGREGATE_CANDIDATES.md`, `docs/domain/DOMAIN_BEHAVIOR_CATALOG.md`, `docs/domain/DOMAIN_BEHAVIOR_DECISION_TABLES.md`, and `docs/domain/DOMAIN_DECISION_REGISTER.md`. Session 22 is complete; this entry records its full-read baseline.
- **Architecture Baseline (Session 23):** Required full reads: `CLAUDE.md`, `docs/project/PROJECT_STATE.md`, `docs/product/PRODUCT_IDENTITY.md`, `docs/product/ANNOTASI_FINANCE_MVP_PRD.md`, `docs/domain/EXECUTABLE_DOMAIN_SPECIFICATION.md`, `docs/domain/DOMAIN_DECISION_REGISTER.md`, and `docs/domain/AGGREGATE_CANDIDATES.md`. Read `docs/domain/UBIQUITOUS_LANGUAGE.md`, `docs/domain/DOMAIN_CONCEPT_MODEL.md`, `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`, `docs/domain/DOMAIN_BEHAVIOR_CATALOG.md`, and `docs/domain/DOMAIN_BEHAVIOR_DECISION_TABLES.md` only when the executable specification points to missing supporting detail or a potential contradiction. Session 23 may inspect repository-root technical files to determine whether a technical baseline already exists. It must not read unrelated files and begins only through explicit Session 23 instruction. Session 23 is complete; this entry records its full-read baseline.
- **MVP Implementation Plan (Session 24):** Required full reads were `CLAUDE.md`, `docs/project/PROJECT_STATE.md`, `docs/product/PRODUCT_IDENTITY.md`, `docs/product/ANNOTASI_FINANCE_MVP_PRD.md`, `docs/domain/EXECUTABLE_DOMAIN_SPECIFICATION.md`, and `docs/architecture/ARCHITECTURE_BASELINE.md`, with targeted domain-decision and aggregate reads where referenced plus official technical/provider sources. Session 24 is complete; this entry records its source-loading baseline.
- **Technical Foundation Implementation (Session 25 / `SLICE-FOUND-001`):** Session 25 is complete. Its required full reads were `CLAUDE.md`, `docs/project/PROJECT_STATE.md`, `docs/implementation/MVP_IMPLEMENTATION_PLAN.md`, and `docs/architecture/ARCHITECTURE_BASELINE.md`, supplemented by targeted product/domain constraints and current official technical sources where required. The delivered evidence is recorded in `docs/implementation/FOUNDATION_DEPENDENCY_REGISTER.md`, the repository manifests, and the Foundation CI workflow. This entry preserves the completed session's source-loading baseline; it does not guarantee that external versions or capabilities remain current.
- **Technical Foundation Implementation (Session 26 / `SLICE-FOUND-002`):** Session 26 is complete. Its required full reads were `CLAUDE.md`, `docs/project/PROJECT_STATE.md`, `docs/implementation/MVP_IMPLEMENTATION_PLAN.md`, `docs/implementation/FOUNDATION_DEPENDENCY_REGISTER.md`, and `docs/architecture/ARCHITECTURE_BASELINE.md`, supplemented by targeted executable-specification/PRD constraints and current official PostgreSQL, Drizzle, Testcontainers, image, advisory, and CI/runtime sources. The delivered evidence is recorded in `docs/implementation/DATABASE_FOUNDATION_REGISTER.md`, the database/Compose files, repository manifests, and the Foundation CI workflow. This entry preserves the completed session's source-loading baseline; it does not guarantee that external versions or capabilities remain current.
- **Identity and Access Implementation (Session 27 / `SLICE-IAM-001`):** Session 27 is complete. Its required full reads were `CLAUDE.md`, `docs/project/PROJECT_STATE.md`, `docs/implementation/MVP_IMPLEMENTATION_PLAN.md`, `docs/architecture/ARCHITECTURE_BASELINE.md`, `docs/implementation/FOUNDATION_DEPENDENCY_REGISTER.md`, and `docs/implementation/DATABASE_FOUNDATION_REGISTER.md`, supplemented by targeted product/domain constraints and current official provider sources. The delivered and live-smoke evidence is recorded in `docs/implementation/IDENTITY_SESSION_REGISTER.md`. This entry preserves the completed session's source-loading baseline; it does not guarantee that external provider versions or capabilities remain current.
- **Identity, Onboarding, and Workspace Isolation (Session 28 / `SLICE-IAM-002`):** Session 28 is complete. Its required pre-implementation full reads were `CLAUDE.md`, `docs/project/PROJECT_STATE.md`, `docs/implementation/MVP_IMPLEMENTATION_PLAN.md`, `docs/architecture/ARCHITECTURE_BASELINE.md`, `docs/implementation/FOUNDATION_DEPENDENCY_REGISTER.md`, `docs/implementation/DATABASE_FOUNDATION_REGISTER.md`, and `docs/implementation/IDENTITY_SESSION_REGISTER.md`, supplemented by targeted product/domain constraints and current official provider/database sources. The evidence produced and finalized by Session 28 is recorded in `docs/implementation/ONBOARDING_ISOLATION_REGISTER.md` and `docs/implementation/IAM_002_ONBOARDING_TESTING_GUIDE.md`, together with the onboarding migration/runtime/API/web implementation and the onboarding/isolation CI job. This entry preserves the completed session's source-loading baseline and separately identifies its outputs; it does not replace those sources.
- **Account Management Baseline (Session 29 / `SLICE-ACC-001`):** Read completely: `CLAUDE.md`, `docs/project/PROJECT_STATE.md`, `docs/implementation/MVP_IMPLEMENTATION_PLAN.md`, `docs/architecture/ARCHITECTURE_BASELINE.md`, `docs/implementation/DATABASE_FOUNDATION_REGISTER.md`, `docs/implementation/IDENTITY_SESSION_REGISTER.md`, and `docs/implementation/ONBOARDING_ISOLATION_REGISTER.md`. Read targeted authoritative product/domain sections for Account definition, Account Types, Account lifecycle, non-negative balance, archive eligibility, restore behavior, deletion eligibility, duplicate Account names, Workspace isolation, Opening Balance as starting state, and exclusions belonging to `SLICE-ACC-002`. Inspect the Account schema delivered by `SLICE-IAM-002` before planning any migration. Session 29 and `SLICE-ACC-001` begin only through explicit instruction and remain not started.
- **Product-scope or requirement question:** the relevant `docs/product/ANNOTASI_FINANCE_MVP_PRD.md` section, plus `docs/product/PRODUCT_IDENTITY.md` when product direction matters
- **Other Architecture task:** `docs/domain/EXECUTABLE_DOMAIN_SPECIFICATION.md` plus the sources it identifies for the affected constraint; load no unrelated files

### Level 3 — Read Authoritative Source on Demand
Read the full PRD or another full source document only when:
- a summary statement in this document is ambiguous;
- a cited requirement must be verified;
- two documents appear inconsistent;
- a proposed decision could alter confirmed behavior;
- an open question may be affected;
- the task explicitly requires a whole-document review;
- the source section cannot be located confidently through selective reading.

**Token saving must never override correctness.** Financial invariants and destructive lifecycle behavior (deletion, archival, chronological recalculation) require source verification, not reliance on this document's summary alone. Claude must not rely only on `PROJECT_STATE.md` for high-impact decisions.

---

## 11. Task-to-Source Reading Matrix

| Task Type | Always Read | Additional Required Sources | Read PRD Fully? | Notes |
|---|---|---|---|---|
| Terminology refinement | `CLAUDE.md`, `PROJECT_STATE.md` | `UBIQUITOUS_LANGUAGE.md` | No — relevant sections only | Verify against PRD section cited by the term entry if ambiguous |
| Product requirement clarification | `CLAUDE.md`, `PROJECT_STATE.md` | Relevant PRD section(s); `PRODUCT_IDENTITY.md` if product direction is in question | No — targeted sections | Escalate to full read if the summary here conflicts with the section |
| Domain Concept Model update | `CLAUDE.md`, `PROJECT_STATE.md` | `UBIQUITOUS_LANGUAGE.md`, `DOMAIN_CONCEPT_MODEL.md` | No | This artifact is already complete; changes require explicit instruction |
| Entity/Value Object refinement | `CLAUDE.md`, `PROJECT_STATE.md` | `UBIQUITOUS_LANGUAGE.md`, `DOMAIN_CONCEPT_MODEL.md`, `DOMAIN_OBJECT_CANDIDATES.md` | No | This artifact is already complete; changes require explicit instruction |
| Aggregate Candidate Analysis | `CLAUDE.md`, `PROJECT_STATE.md` | `UBIQUITOUS_LANGUAGE.md`, `DOMAIN_CONCEPT_MODEL.md`, `DOMAIN_OBJECT_CANDIDATES.md`; targeted verification of PRD §9, §11, §12, §13, §14, §15, §16, §19 | Targeted sections only — full PRD only if those sections reveal an inconsistency, a missing dependency, an affected open question, or an unresolved ambiguity | Completed in Session 18; its artifact remains provisional and requires explicit instruction to refine |
| Domain Behavior Analysis | `CLAUDE.md`, `PROJECT_STATE.md` | `UBIQUITOUS_LANGUAGE.md`, `DOMAIN_CONCEPT_MODEL.md`, `DOMAIN_OBJECT_CANDIDATES.md`, `AGGREGATE_CANDIDATES.md`; targeted verification of PRD §9, §11, §12, §13, §14, §15, §16, §17, §19 | Targeted sections only — full PRD only if targeted reading reveals an inconsistency, a missing dependency, an affected open question, or an unresolved ambiguity | Completed in Session 19; `DOMAIN_BEHAVIOR_CATALOG.md` is the current behavior baseline and may be refined only through explicit instruction |
| Domain Behavior Decision Tables and Boundary Participation Analysis | `CLAUDE.md`, `PROJECT_STATE.md` | `UBIQUITOUS_LANGUAGE.md`, `DOMAIN_CONCEPT_MODEL.md`, `DOMAIN_OBJECT_CANDIDATES.md`, `AGGREGATE_CANDIDATES.md`, `DOMAIN_BEHAVIOR_CATALOG.md`; targeted verification of PRD §9, §11, §12, §13, §14, §15, §16, §17, §19, §28 | Targeted sections only — full PRD only if targeted reading exposes an inconsistency, a missing dependency, an affected open question, or an unresolved ambiguity | Completed in Session 20; `DOMAIN_BEHAVIOR_DECISION_TABLES.md` is the reviewed decision-table and candidate-boundary participation baseline and may be refined only through explicit instruction |
| Domain Decision Resolution | `CLAUDE.md`, `PROJECT_STATE.md` | Full reads of `UBIQUITOUS_LANGUAGE.md`, `DOMAIN_CONCEPT_MODEL.md`, `DOMAIN_OBJECT_CANDIDATES.md`, `AGGREGATE_CANDIDATES.md`, `DOMAIN_BEHAVIOR_CATALOG.md`, `DOMAIN_BEHAVIOR_DECISION_TABLES.md`; targeted verification of PRD §9, §11, §12, §13, §14, §15, §16, §17, §19, §28; `PRODUCT_IDENTITY.md` only when product direction matters | Targeted PRD sections — additional sections only for dependencies or source conflicts | Completed in Session 21; `DOMAIN_DECISION_REGISTER.md` is the reviewed decision baseline and may be refined only through explicit instruction |
| Executable Domain Specification | `CLAUDE.md`, `PROJECT_STATE.md` | Full reads of `PRODUCT_IDENTITY.md`, `ANNOTASI_FINANCE_MVP_PRD.md`, `UBIQUITOUS_LANGUAGE.md`, `DOMAIN_CONCEPT_MODEL.md`, `DOMAIN_OBJECT_CANDIDATES.md`, `AGGREGATE_CANDIDATES.md`, `DOMAIN_BEHAVIOR_CATALOG.md`, `DOMAIN_BEHAVIOR_DECISION_TABLES.md`, `DOMAIN_DECISION_REGISTER.md` | Yes — the complete PRD, not only targeted sections | **Completed in Session 22.** Final Domain Modeling consolidation defining identities, value rules, lifecycle states, formulas, invariants, behavior acceptance, blocking outcomes, deterministic chronology, correction, recalculation, reporting, and traceability without defining Architecture or implementation. |
| Lifecycle/correction analysis | `CLAUDE.md`, `PROJECT_STATE.md` | `DOMAIN_CONCEPT_MODEL.md` §13, `DOMAIN_OBJECT_CANDIDATES.md` §11; PRD §16 | Targeted (§16) | Chronological Recalculation and Financial Invariants are high-impact — verify against PRD §16 directly |
| Reporting/time analysis | `CLAUDE.md`, `PROJECT_STATE.md` | `UBIQUITOUS_LANGUAGE.md` §10, `DOMAIN_CONCEPT_MODEL.md` §12; PRD §17 | Targeted (§17) | Asia/Jakarta fixed-timezone rule is non-negotiable — verify directly |
| Architecture Baseline | `CLAUDE.md`, `PROJECT_STATE.md` | Full reads of `PRODUCT_IDENTITY.md`, `ANNOTASI_FINANCE_MVP_PRD.md`, `EXECUTABLE_DOMAIN_SPECIFICATION.md`, `DOMAIN_DECISION_REGISTER.md`, `AGGREGATE_CANDIDATES.md`; conditional reads of the five earlier domain artifacts only for missing detail or contradiction | Yes — complete PRD | **Completed in Session 23.** Converts approved domain constraints into the smallest reliable v1 technical baseline; resolves the named Architecture decisions; defines technology, modules, persistence, consistency, security, testing, operations, and deployment boundaries. It does not write application code, define detailed endpoint contracts, or produce the implementation ticket plan, and must not weaken or silently reinterpret the executable specification. |
| MVP Implementation Plan | `CLAUDE.md`, `PROJECT_STATE.md` | Full reads of `PRODUCT_IDENTITY.md`, `ANNOTASI_FINANCE_MVP_PRD.md`, `EXECUTABLE_DOMAIN_SPECIFICATION.md`, `ARCHITECTURE_BASELINE.md`; targeted reads of `DOMAIN_DECISION_REGISTER.md` and `AGGREGATE_CANDIDATES.md` where referenced; current official primary sources for versions, providers, regions, pricing, and provider capabilities | Yes — complete PRD | **Completed in Session 24.** Reviewed final planning artifact defining selections, milestones, 30 vertical slices, dependencies, gates, evidence, readiness/done criteria, and `SLICE-FOUND-001` as the first coding slice. It contains no application code, framework initialization, migration, detailed endpoint contract, GitHub issue, or external ticket. |
| Technical Foundation Implementation — `SLICE-FOUND-001` | `CLAUDE.md`, `PROJECT_STATE.md`, `MVP_IMPLEMENTATION_PLAN.md`, `ARCHITECTURE_BASELINE.md` | Targeted executable-specification and PRD constraints as needed; current official technical sources; delivered manifests, CI workflow, and `FOUNDATION_DEPENDENCY_REGISTER.md` as evidence | No — targeted only | **Completed in Session 25.** Established the reviewed non-database technical foundation only; passed review, all eight local checks, Pull Request CI, and post-merge CI; and was merged into `dev`. This is historical implementation evidence, not authority to expand the slice. |
| Technical Foundation Implementation — `SLICE-FOUND-002` | `CLAUDE.md`, `PROJECT_STATE.md`, `MVP_IMPLEMENTATION_PLAN.md`, `FOUNDATION_DEPENDENCY_REGISTER.md`, `ARCHITECTURE_BASELINE.md` | Delivered `SLICE-FOUND-001` manifests/workflow as evidence; targeted executable-specification and PRD constraints; current official PostgreSQL, Drizzle, Testcontainers, image, advisory, and CI/runtime sources | No — targeted only | **Completed in Session 26.** Established the reviewed local PostgreSQL, migration, role/RLS-proof, exact-BIGINT, Testcontainers, Compose, boundary, and database-CI half of the Foundation Gate; passed local validation, Pull Request CI, and post-merge CI; and was merged into `dev`. `DATABASE_FOUNDATION_REGISTER.md` is the reviewed evidence source. |
| Identity and Access Implementation — `SLICE-IAM-001` | `CLAUDE.md`, `PROJECT_STATE.md`, `MVP_IMPLEMENTATION_PLAN.md`, `ARCHITECTURE_BASELINE.md`, `FOUNDATION_DEPENDENCY_REGISTER.md`, `DATABASE_FOUNDATION_REGISTER.md` | Targeted PRD and Executable Domain Specification sections for identity verification, privacy, Single-Owner Workspace boundaries, no Workspace creation before onboarding, and managed identity versus local application-session authority; current official provider sources; `IDENTITY_SESSION_REGISTER.md` as delivered evidence | No — targeted only | **Completed in Session 27.** Established managed Clerk identity flows and live validation plus persisted, opaque, restart-safe Annotasi Finance application sessions, secure browser/API boundaries, frontend identity flows, recovery revocation, lifecycle logging, and dedicated CI. It created no local User, Workspace, Account, entitlement, onboarding result, or financial table. |
| Identity, Onboarding, and Workspace Isolation — `SLICE-IAM-002` | `CLAUDE.md`, `PROJECT_STATE.md`, `MVP_IMPLEMENTATION_PLAN.md`, `ARCHITECTURE_BASELINE.md`, `DATABASE_FOUNDATION_REGISTER.md`, `IDENTITY_SESSION_REGISTER.md` | Targeted PRD and Executable Domain Specification sections for one User owning exactly one private Single-Owner Workspace, Private Beta entitlement versus collaboration invitation, onboarding behavior WB-01, starter Account requirements, atomic/idempotent entitlement redemption, server-derived Workspace scope, forced RLS, adversarial isolation, and no product/financial behavior beyond the starter Account; `ONBOARDING_ISOLATION_REGISTER.md` and `IAM_002_ONBOARDING_TESTING_GUIDE.md` as delivered evidence | No — targeted only | **Completed in Session 28.** Established local User mapping, operator-issued single-use entitlement redemption, exactly one private Workspace and starter Account, atomic/idempotent/concurrency-safe onboarding, server-authoritative scope, forced RLS, adversarial isolation, live onboarding evidence, and the complete Isolation Gate. It introduced no collaboration or financial behavior. |
| Account Management Baseline — `SLICE-ACC-001` | `CLAUDE.md`, `PROJECT_STATE.md`, `MVP_IMPLEMENTATION_PLAN.md`, `ARCHITECTURE_BASELINE.md`, `DATABASE_FOUNDATION_REGISTER.md`, `IDENTITY_SESSION_REGISTER.md`, `ONBOARDING_ISOLATION_REGISTER.md` | Targeted authoritative Account sections covering definition, Types, lifecycle, non-negative balance, archive/restore/delete eligibility, duplicate names, Workspace isolation, Opening Balance as state, and ACC-002 exclusions; inspect the IAM-002 Account schema before migration planning | No — targeted only | **Next approved slice; not started.** Creates/lists/renames/archives/restores Accounts and evaluates deletion eligibility with Account management UI, Workspace-scoped persistence/RLS, and required unit/property/PostgreSQL/API-security/frontend/isolation evidence. It excludes opening-state correction, Impact Preview, recalculation, permanent deletion, every financial behavior, `SLICE-ACC-002`, `SLICE-CAT-001`, and later slices. |
| Implementation specification | `CLAUDE.md`, `PROJECT_STATE.md`, `MVP_IMPLEMENTATION_PLAN.md` | Relevant approved source sections for the selected slice | Sections as needed | Current-stage slice detail may be produced only inside the reviewed slice boundary; it may not reopen source decisions silently. |
| Coding | `CLAUDE.md`, `PROJECT_STATE.md`, `MVP_IMPLEMENTATION_PLAN.md`, `ARCHITECTURE_BASELINE.md` | Sources required by the selected slice | N/A | **Current workflow stage.** Exactly four slices, `SLICE-FOUND-001`, `SLICE-FOUND-002`, `SLICE-IAM-001`, and `SLICE-IAM-002`, are complete. `SLICE-ACC-001` is the only next approved slice and remains not started; no later slice is authorized. |
| Code review | `CLAUDE.md`, `PROJECT_STATE.md` | Relevant specification, plan, Architecture, and implementation evidence | N/A | Slice-level implementation review is complete for `SLICE-FOUND-001`, `SLICE-FOUND-002`, `SLICE-IAM-001`, and `SLICE-IAM-002`; later reviews occur only for explicitly started slices. |
| Bug investigation | `CLAUDE.md`, `PROJECT_STATE.md` | Relevant implementation evidence plus authoritative sources for the affected behavior | Targeted | Available only for an explicitly reported implementation defect; it is not the current next task. |
| Release validation | `CLAUDE.md`, `PROJECT_STATE.md` | PRD §24 (Launch Criteria) in full | Yes — §24 | **Future workflow stage — do not begin yet.** No release candidate exists |

---

## 12. New Session Startup Protocol

A new Claude Code session working on Annotasi Finance should:

1. Read `CLAUDE.md`.
2. Read `docs/project/PROJECT_STATE.md`.
3. Inspect `git status --short`, `git branch --show-current`, and `git log -1 --oneline`.
4. Identify the current requested task.
5. Load only the Level 2 documents relevant to that task (Section 10, Section 11).
6. Consult specific PRD sections on demand (Level 3, Section 10) when a summary is ambiguous or the task is high-impact.
7. Report which sources were loaded before proceeding.
8. Identify only currently unresolved UX Terminology questions in Section 8 that the task touches; do not treat the historical pre-Session-21 index as an active backlog or resolve UX questions silently.
9. Stop and report if git status shows unrelated changes beyond what the task expects.
10. Not begin a later workflow stage (Section 3) without explicit instruction, even if this document names it as the "next recommended step."

### Ready-to-Copy Prompt Template

```
Begin Session <SESSION_NUMBER> for Annotasi Finance.

Session goal: <SESSION_GOAL>

Target artifact: <TARGET_ARTIFACT>

Read CLAUDE.md and docs/project/PROJECT_STATE.md first.
Then read only: <TASK-SPECIFIC_SOURCES>

Do not begin a workflow stage beyond the one named above without
explicit instruction. Do not silently resolve any currently unresolved
UX Terminology item in Section 8 or deferred/conditional item in Section 9. Report the sources loaded
before making any change.
```

This template does not assume the next task is always Aggregate Candidate Analysis — `<SESSION_GOAL>` and `<TARGET_ARTIFACT>` must be filled in per the actual request.

---

## 13. Mid-Session Continuation Protocol

### Continue in the same session when
- the session is still responsive;
- context was only temporarily rate-limited;
- edits already exist in-session and only validation/reporting remains.

### Use a handoff/save-session mechanism when
- work is unfinished;
- many intermediate decisions exist only in conversation, not yet written to a stable artifact;
- context is nearly exhausted;
- another agent/session must continue before a stable artifact is complete.

### Start a clean new session when
- the prior artifact is complete, reviewed, committed, and pushed;
- the next task is a new workflow step;
- `PROJECT_STATE.md` and the repository already contain the stable state needed to resume.

A handoff is not required after every completed session — only when one of the "handoff/save-session" conditions above applies.

---

## 14. Source Verification Rules

- Summaries in this document do not override sources.
- Direct source citation is required for any new domain assertion.
- Only the UX Terminology subsection of Section 8 contains currently unresolved questions; those questions remain open unless explicitly decided in their authoritative source. Every other Section 8 subsection is a superseded historical index, not an active backlog.
- Candidate status (Section 5, Section 7) does not become Confirmed merely because a term is repeated in this or another summary document.
- If this document becomes stale relative to the repository, update it (Section 15) before relying on it for a new task.
- High-impact finance rules (Section 6, and any Financial Invariant) must be verified against the PRD or domain source directly before being relied upon for implementation or specification work.
- No external knowledge should be used to silently fill a product gap that the PRD leaves open.
- No generic finance-app convention may override Annotasi Finance's approved model (e.g., FIFO/LIFO allocation behavior, negative balances, generic "wallet" terminology).

---

## 15. Update Rules for This Document

### Must trigger an update
- a new workflow artifact is reviewed and pushed;
- a currently unresolved UX Terminology question in Section 8 is explicitly resolved by its authoritative source;
- a confirmed rule (Section 6) changes through an approved PRD revision;
- the current workflow stage (Section 1, Section 3) changes;
- a new authoritative document is added to the repository;
- the context-loading matrix (Section 11) changes materially.

### Must not trigger an update
- temporary local work;
- an unreviewed draft;
- conversation-only speculation;
- uncommitted experimental changes;
- assumptions not yet confirmed by a source;
- tool installation alone.

Updates to this document should be small and traceable — reflecting one specific change in the underlying repository state, not a general rewrite. This document is not required to be updated automatically during every coding change.

---

## 16. Current Next Step

- Session 28 is the last completed workflow session; `SLICE-FOUND-001`, `SLICE-FOUND-002`, `SLICE-IAM-001`, and `SLICE-IAM-002` are reviewed, complete, and merged into `dev`.
- Implementation is the current workflow stage, and exactly four implementation slices have completed.
- The full Foundation Gate and Isolation Gate are complete; the IAM-001 identity/session baseline and acceptance evidence are also complete.
- The managed identity, persisted opaque application sessions, operator-issued Private Beta access entitlement, atomic onboarding, one private Workspace and starter Account per User, server-derived authority, forced-RLS isolation, live onboarding validation, and dedicated IAM-002 CI baseline are complete.
- `main` remains production-only and has received none of the four implementation slices.
- The next recommended task is **Session 29 — Account Management Baseline**.
- `SLICE-ACC-001` is the only next approved slice and remains not started. It is bounded to Account create/list/rename/archive/restore/delete-eligibility behavior, Account management frontend, Workspace-scoped Account persistence/RLS, and the evidence named in Section 5.
- `SLICE-CAT-001` is dependency-unblocked but is not selected. `SLICE-ACC-002` and every later slice remain not started.
- The First Financial Write Gate, Cross-Boundary Consistency Gate, Correction/Recalculation Gate, Reporting Consistency Gate, Pre-Beta Security Gate, Recovery Gate, and Private Beta Acceptance Gate remain not started; financial-write readiness is not complete.
- Session 29 begins only through explicit instruction. This synchronization does not begin it or any implementation work.

This document summarizes navigation state only. It replaces neither the product/domain/Architecture baselines nor the implementation plan and independently guarantees no version, provider, price, region, quota, or capability.

---

## 17. Source Index

### `CLAUDE.md`
- **Authority role:** Repository-wide AI working guide; governs how all other sources are used.
- **When to read:** Every session (Level 1).
- **Must not be replaced by:** This document, or any summary of it.

### `docs/product/PRODUCT_IDENTITY.md`
- **Authority role:** Approved product foundation — the highest-level statement of why the product exists and what it is/is not.
- **When to read:** Product-direction questions; whenever a Hypothesis/Future-direction/Excluded distinction matters.
- **Must not be replaced by:** The PRD (which derives from it), or this document.

### `docs/product/ANNOTASI_FINANCE_MVP_PRD.md`
- **Authority role:** Current authoritative v1 requirements baseline, containing confirmed requirements, hypotheses, candidate terminology, and explicit open questions — the primary source for financial behavior, invariants, and launch criteria.
- **When to read:** Any product-requirement question; any question involving a Financial Invariant, account/category/fund/debt rule, or launch criterion.
- **Must not be replaced by:** This document, or any domain document that restates it.

### `docs/domain/UBIQUITOUS_LANGUAGE.md`
- **Authority role:** Canonical internal domain vocabulary.
- **When to read:** Terminology tasks; whenever precise term usage matters (e.g., distinguishing "balance" terms).
- **Must not be replaced by:** Casual or conversational term usage, or this document's abbreviated term lists.

### `docs/domain/DOMAIN_CONCEPT_MODEL.md`
- **Authority role:** Confirmed relationships and cardinalities between domain concepts, one level above the flat glossary.
- **When to read:** Relationship, cardinality, or invariant questions; before any entity/value-object classification work.
- **Must not be replaced by:** This document's domain-baseline summary (Section 5), which omits full relationship detail.

### `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`
- **Authority role:** Candidate product-level classification of every canonical domain concept (Entity/Value Object/Derived Value/etc.), with reasoning and stress-test scenarios.
- **When to read:** Any entity/value-object question; before Aggregate Candidate Analysis begins.
- **Must not be replaced by:** This document's classification summary (Section 7), which omits full reasoning.

### `docs/domain/AGGREGATE_CANDIDATES.md`
- **Authority role:** Candidate domain consistency-boundary analysis covering provisional Aggregates, roots, invariants, coordination hotspots, alternatives, and stress tests.
- **When to read:** Before Domain Behavior Analysis and before any later aggregate-boundary refinement.
- **Must not be replaced by:** This document's summaries or generic DDD assumptions.

### `docs/domain/DOMAIN_BEHAVIOR_CATALOG.md`
- **Authority role:** Current product-domain behavior baseline covering intent, preconditions, effects, rejection, candidate-boundary participation, recalculation, lifecycle, and Traceability.
- **When to read:** Before behavior decision-table analysis, detailed domain specification, or later correction/lifecycle refinement.
- **Must not be replaced by:** `PROJECT_STATE.md` summaries, generic finance conventions, or technical use-case assumptions.

### `docs/domain/DOMAIN_BEHAVIOR_DECISION_TABLES.md`
- **Authority role:** Reviewed product-domain decision-table baseline covering behavior conditions, candidate fact providers, accepted and blocked outcomes, candidate boundary participation, recalculation, Traceability, and protected ambiguities.
- **When to read:** Before domain decision closure, detailed domain specification, Architecture, and implementation planning.
- **Must not be replaced by:** `PROJECT_STATE.md` summaries, generic finance assumptions, or technical validation conventions.

### `docs/domain/DOMAIN_DECISION_REGISTER.md`
- **Authority role:** Reviewed domain-decision baseline that resolves or classifies the remaining product-domain decisions required before normative specification and Architecture.
- **When to read:** Before Executable Domain Specification, Architecture, and implementation planning.
- **Must not be replaced by:** `PROJECT_STATE.md` summaries, generic finance assumptions, or technical convenience.

### `docs/domain/EXECUTABLE_DOMAIN_SPECIFICATION.md`
- **Authority role:** Normative Private Beta v1 product-domain baseline defining policies, identity, lifecycle, formulas, invariants, chronology, accepted and blocked behavior, recalculation, reporting, and traceability.
- **When to read:** Before Architecture, implementation planning, testing, and code changes.
- **Must not be replaced by:** `PROJECT_STATE.md` summaries, generic finance conventions, framework defaults, database convenience, or implementation assumptions.

### `docs/architecture/ARCHITECTURE_BASELINE.md`
- **Authority role:** Reviewed Private Beta v1 technical Architecture baseline defining system shape, stack categories, runtime boundaries, modules, persistence, consistency, chronology, recalculation, security, testing, deployment, recovery, and implementation constraints.
- **When to read:** Before implementation planning, technical initialization, schema design, API design, implementation tickets, testing, and code changes.
- **Must not be replaced by:** `PROJECT_STATE.md` summaries, framework defaults, remembered vendor capabilities, generic startup Architecture, or implementation convenience.

### `docs/implementation/MVP_IMPLEMENTATION_PLAN.md`
- **Authority role:** Reviewed Private Beta v1 implementation-planning baseline defining current technical/provider selections, operational budgets, initialization order, milestones, slices, dependencies, gates, evidence, readiness and done criteria, and the approved first coding slice.
- **When to read:** Before any framework initialization, package selection, repository-structure creation, provider setup, migration, implementation slice, testing, or deployment work.
- **Must not be replaced by:** `PROJECT_STATE.md` summaries, remembered package versions, copied boilerplate, framework defaults, generic monorepo templates, provider marketing assumptions, or implementation convenience.

### `docs/implementation/FOUNDATION_DEPENDENCY_REGISTER.md`
- **Authority role:** Reviewed evidence register for the dependency selections, compatibility verification, advisories, and delivered technical baseline of Session 25 / `SLICE-FOUND-001`.
- **When to read:** Before a subsequent technical-foundation slice, dependency upgrade, or claim about the versions and advisories delivered by `SLICE-FOUND-001`.
- **Must not be replaced by:** `PROJECT_STATE.md` navigation metadata, remembered versions, package-manager output taken out of context, or an assumption that the recorded versions remain current.

### `docs/implementation/DATABASE_FOUNDATION_REGISTER.md`
- **Authority role:** Reviewed evidence register for the PostgreSQL, migration, database-role, RLS, exact-BIGINT, Testcontainers, Compose, and database-CI baseline delivered by Session 26 / `SLICE-FOUND-002`.
- **When to read:** Before authentication or application-session persistence; before product table migrations; before RLS implementation; before database dependency upgrades; and before claims about the versions or behavior delivered by `SLICE-FOUND-002`.
- **Must not be replaced by:** `PROJECT_STATE.md` navigation metadata, remembered versions, package-manager or database output taken out of context, or an assumption that the recorded versions and behavior remain current indefinitely.

### `docs/implementation/IDENTITY_SESSION_REGISTER.md`
- **Authority role:** Reviewed evidence register for the managed Clerk identity flows, provider-to-application exchange, persisted opaque application sessions, recovery/revocation behavior, frontend integration, security boundaries, live development-instance smoke validation, and identity/session CI baseline delivered by Session 27 / `SLICE-IAM-001`.
- **When to read:** Before local User mapping or onboarding; before changing identity, recovery, session persistence, session cookies, authorization boundaries, CSP/CAPTCHA integration, or identity/session dependencies; and before claims about the behavior delivered by `SLICE-IAM-001`.
- **Must not be replaced by:** `PROJECT_STATE.md` navigation metadata, remembered provider behavior, test output taken out of context, or an assumption that recorded provider versions and capabilities remain current indefinitely.

### `docs/implementation/ONBOARDING_ISOLATION_REGISTER.md`
- **Authority role:** Reviewed evidence register for Private Beta invitation lifecycle, local User mapping, atomic onboarding, one private Workspace and starter Account, deterministic idempotency/concurrency/rollback, server-derived scope, forced RLS, the automated Isolation Gate, live onboarding validation, and IAM-002 CI delivered by Session 28 / `SLICE-IAM-002`.
- **When to read:** Before broader Account persistence or lifecycle work; before changing onboarding, entitlement, User/Workspace ownership, application/operator roles, RLS context, or Workspace isolation; and before claims about the behavior delivered by `SLICE-IAM-002`.
- **Must not be replaced by:** `PROJECT_STATE.md` navigation metadata, remembered implementation details, test output taken out of context, or an assumption that recorded provider/database behavior remains current indefinitely.

### `docs/implementation/IAM_002_ONBOARDING_TESTING_GUIDE.md`
- **Authority role:** Reviewed operational evidence guide for IAM-002 live onboarding, safe invitation handling, starter Account field meaning, persistence checks, and later-editability boundaries.
- **When to read:** Before repeating the live IAM-002 flow, operating the invitation CLI, interpreting the starter Account fields delivered by onboarding, or planning Account changes that depend on those existing fields.
- **Must not be replaced by:** Product/domain authority, `ONBOARDING_ISOLATION_REGISTER.md` implementation evidence, the implementation plan's slice boundary, or assumptions inferred from the current UI.
