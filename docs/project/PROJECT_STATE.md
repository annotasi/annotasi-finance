# Annotasi Finance — Project State

## 1. Document Status

- **Status:** Current project navigation snapshot
- **Scope:** Annotasi Finance Private Beta MVP
- **Last completed workflow session:** Session 19
- **Current stage:** Domain Modeling
- **Latest completed workflow artifact:** `docs/domain/DOMAIN_BEHAVIOR_CATALOG.md`
- **Latest completed domain artifact:** `docs/domain/DOMAIN_BEHAVIOR_CATALOG.md`
- **Next recommended task:** Session 20 — Domain Behavior Decision Tables and Boundary Participation Analysis

Session 19 Domain Behavior Analysis is complete. Session 20 Domain Behavior Decision Tables and Boundary Participation Analysis has **not** started; it is only the next recommended task in the current Domain Modeling stage.

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
- Domain model: in progress. Ubiquitous Language, Domain Concept Model, Domain Object Candidates, Aggregate Candidate Analysis, and Domain Behavior Analysis are complete. Domain Behavior Decision Tables and Boundary Participation Analysis has not started.
- Architecture, Milestones, Specifications, Implementation, Review, Testing, Release: not started. No technology, framework, database, or API decision has been made (`CLAUDE.md` §6).

---

## 4. Completed and Current Baseline Artifacts

Listed in workflow order. For each: role, what it establishes, what it deliberately does not establish, and whether later sessions may silently modify it (**No** for all).

### 1. `CLAUDE.md`
- **Role:** AI working guide for this repository.
- **Establishes:** mandatory product principles, v1 scope boundaries, operating rules for AI agents, the workflow sequence, and repository status.
- **Does not establish:** detailed product or domain requirements itself. It does not replace Product Identity, the PRD, or domain documents as the authoritative source of detailed product and domain requirements — it governs how those are approached.
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

Exact implementation types (e.g., money type, date type) remain undecided.

### Derived Values
- Total Account Balance
- Unallocated Amount
- Workspace Total Balance
- Fund Balance
- Outstanding Principal
- Current Account-Backed Fund Allocation amount

### Relationship Concept Candidate
- Account-Backed Fund Allocation — whether it requires independent identity, separate from its current derived amount, remains open (`DOMAIN_OBJECT_CANDIDATES.md` §12, §19).

### Classification and Policy Areas

Summarized without reproducing full detail (see `DOMAIN_OBJECT_CANDIDATES.md` §9–§11 for reasoning):

- **Event Type** — the closed six-member classification of a Financial Event (Income, Expense, Transfer, Fund Allocation, Fund Release, Debt Repayment).
- **Account Type** — the fixed four-member classification of an Account (Cash, Bank Account, E-Wallet, Other).
- **Income/Expense Category kinds** — Income Category and Expense Category are non-overlapping kinds; the actual category names within each kind are user-extensible, not a fixed enumeration.
- **Reporting Period** — a workspace-level configuration choice (Calendar Month or one Custom Monthly Cycle); whether best modeled as a value/configuration pair remains open.
- **Calendar Month** — the fixed default Reporting Period.
- **Custom Monthly Cycle** — an optional Reporting Period with a single start-day parameter (days 1–28).
- **Asia/Jakarta Workspace Timezone** — a fixed, non-configurable v1 policy.
- **Deterministic Same-Date Ordering requirement** — confirmed as a requirement; the exact ordering mechanism is deferred.
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
- Reporting configuration — more plausibly inside the Workspace candidate boundary, while its final modeling form remains open

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

The behavior baseline keeps Dedicated Fund rename, Dedicated Fund restoration, and permanent deletion from Trash as **Still Open**. Complete Debt Record permanent-deletion eligibility remains a **Candidate Behavior** with open detail. None is converted into a confirmed behavior by this summary.

---

## 6. Non-Negotiable Product and Domain Rules

1. Annotasi Finance v1 is multi-user, but each User owns exactly one private Single-Owner Workspace. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §6; `docs/domain/UBIQUITOUS_LANGUAGE.md` §5.*

2. Shared editing, invitations, household collaboration, and roles are excluded from v1. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §6, §8; `docs/product/PRODUCT_IDENTITY.md` §3.*

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

18. Same-date ordering must be deterministic, but the exact mechanism remains open. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §16; `docs/domain/UBIQUITOUS_LANGUAGE.md` §11.*

19. Every important number must be traceable to the records that produced it. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §19; `docs/domain/UBIQUITOUS_LANGUAGE.md` §5.*

20. Dashboard/detail disagreement is release-blocking. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §19, §24.*

---

## 7. Candidate Domain Classifications

This section points to, rather than repeats, `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`. See Section 5 above for the current baseline list. Key candidate-status caveats to preserve:

- **Every classification in the source document is explicitly a candidate**, not a final Entity/Value Object/Aggregate decision (`DOMAIN_OBJECT_CANDIDATES.md` §1, §3).
- **Account-Backed Fund Allocation**'s need for independent identity is undecided (`DOMAIN_OBJECT_CANDIDATES.md` §12, §19).
- **Reporting Period**'s eventual modeling form (value/configuration pair vs. another form) is undecided (`DOMAIN_OBJECT_CANDIDATES.md` §10, §19).
- **Financial Goal** is classified as Not a Domain Object — it shares Dedicated Fund's identity entirely, not a separate concept (`DOMAIN_OBJECT_CANDIDATES.md` §6, §13).
- **Income/Expense/Transfer/Fund Allocation/Fund Release/Debt Repayment** each have a dual nature: an Event Type classifier member, and an informal name for a Financial Event instance of that type — no third, independently identified concept exists (`DOMAIN_OBJECT_CANDIDATES.md` §9).
- `DOMAIN_OBJECT_CANDIDATES.md` itself assigns no Aggregate, Aggregate Root, Domain Service, Repository, Command, Domain Event, or Bounded Context (`DOMAIN_OBJECT_CANDIDATES.md` §1, §18). The later `AGGREGATE_CANDIDATES.md` adds only provisional Aggregate and root candidates; it does not finalize them or introduce the other concepts in this list (`AGGREGATE_CANDIDATES.md` §§1, 21, 23).

For full reasoning, identity/equality analysis, and stress-test scenarios behind any classification, read `docs/domain/DOMAIN_OBJECT_CANDIDATES.md` directly — do not rely on this section alone for a classification decision.

---

## 8. Active Open Questions

All items below are **Still open**. Do not resolve any of them silently in future work — resolving one requires an explicit product-owner or domain-modeling decision recorded in its authoritative source document, not in this file.

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
- Final Dedicated Fund UI terminology (ruling out only "Dompet" as a universal term). — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §9, §22.*
- Whether changing between ordinary and fund-linked Expense form is always a Same-Type Edit or requires Event Replacement in some cases. — *`docs/domain/DOMAIN_BEHAVIOR_CATALOG.md` §27.*

### Debt
- Whether debt status (Active/Paid Off) is explicit or purely derived from Outstanding Principal. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §15, §28.*
- Whether creditor/lender name is a separate Debt Record field or folded into the debt name. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §15, §28.*
- Complete eligibility for permanent Debt Record deletion beyond the confirmed repayment-reference blocker. — *`docs/domain/DOMAIN_BEHAVIOR_CATALOG.md` §§16, 27.*

### Event Lifecycle
- Whether a replaced event appears in ordinary history or only in its own detail/audit context. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §16, §28.*
- Exact Trash retention period (30 days is the current preference, not final). — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §16, §28.*
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

### UX Terminology
- Final Bahasa Indonesia labels for the six Financial Event types. — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §22.*
- Final Account Type labels (Tunai, Rekening Bank, Dompet Digital, Lainnya are candidates). — *`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §22.*
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

### Candidate Domain Decisions Not Yet Finalized
The workflow has now analyzed candidate Aggregate boundaries, Candidate Aggregate Roots, candidate consistency boundaries, and product-domain behaviors, but Sessions 18 and 19 keep every boundary classification provisional. Final domain approval still requires detailed behavior decision tables and candidate-boundary participation analysis (`AGGREGATE_CANDIDATES.md` §§1, 21–23; `DOMAIN_BEHAVIOR_CATALOG.md` §§23, 27–28).

### Not Yet Decided Because Workflow Has Not Reached It
The following are **not excluded from the product** — they are simply not yet modeled, because the workflow (`CLAUDE.md` §5) has not reached that stage:
- bounded contexts
- commands
- domain events
- repositories
- architecture
- database
- API
- framework
- identifier strategy
- deployment

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
- **Domain Behavior Decision Tables and Boundary Participation Analysis (Session 20):** `docs/domain/UBIQUITOUS_LANGUAGE.md`, `docs/domain/DOMAIN_CONCEPT_MODEL.md`, `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`, `docs/domain/AGGREGATE_CANDIDATES.md`, `docs/domain/DOMAIN_BEHAVIOR_CATALOG.md`, plus direct verification of PRD §9, §11, §12, §13, §14, §15, §16, §17, §19, §28. Read the full PRD only if targeted reading exposes an inconsistency, a missing dependency, an affected open question, or an unresolved ambiguity. Session 20 begins only through explicit instruction.
- **Product-scope or requirement question:** the relevant `docs/product/ANNOTASI_FINANCE_MVP_PRD.md` section, plus `docs/product/PRODUCT_IDENTITY.md` when product direction matters
- **Architecture task (later workflow stage):** all approved domain artifacts, plus only the relevant PRD sections

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
| Domain Behavior Decision Tables and Boundary Participation Analysis | `CLAUDE.md`, `PROJECT_STATE.md` | `UBIQUITOUS_LANGUAGE.md`, `DOMAIN_CONCEPT_MODEL.md`, `DOMAIN_OBJECT_CANDIDATES.md`, `AGGREGATE_CANDIDATES.md`, `DOMAIN_BEHAVIOR_CATALOG.md`; targeted verification of PRD §9, §11, §12, §13, §14, §15, §16, §17, §19, §28 | Targeted sections only — full PRD only if targeted reading exposes an inconsistency, a missing dependency, an affected open question, or an unresolved ambiguity | **Next Domain Modeling task — begin only through explicit Session 20 instruction.** Turn confirmed behavior rules into reviewable domain decision tables covering condition evaluation, blocking outcomes, all-or-nothing effects, candidate-boundary participation, recalculation scope, and Traceability. Do not define APIs, commands, services, repositories, domain events, transactions, persistence, or Architecture |
| Lifecycle/correction analysis | `CLAUDE.md`, `PROJECT_STATE.md` | `DOMAIN_CONCEPT_MODEL.md` §13, `DOMAIN_OBJECT_CANDIDATES.md` §11; PRD §16 | Targeted (§16) | Chronological Recalculation and Financial Invariants are high-impact — verify against PRD §16 directly |
| Reporting/time analysis | `CLAUDE.md`, `PROJECT_STATE.md` | `UBIQUITOUS_LANGUAGE.md` §10, `DOMAIN_CONCEPT_MODEL.md` §12; PRD §17 | Targeted (§17) | Asia/Jakarta fixed-timezone rule is non-negotiable — verify directly |
| Architecture | `CLAUDE.md`, `PROJECT_STATE.md` | All completed domain artifacts, plus relevant PRD sections | Sections as needed | **Future workflow stage — do not begin yet.** No architecture artifact exists |
| Implementation specification | `CLAUDE.md`, `PROJECT_STATE.md` | All completed domain artifacts, relevant PRD sections | Sections as needed | **Future workflow stage — do not begin yet.** Domain modeling and architecture are prerequisites |
| Coding | `CLAUDE.md`, `PROJECT_STATE.md` | Depends on implementation specification | N/A | **Future workflow stage — do not begin yet.** No framework or architecture has been selected |
| Code review | `CLAUDE.md`, `PROJECT_STATE.md` | Relevant specification and domain artifacts | N/A | **Future workflow stage — do not begin yet.** No code exists in this repository |
| Bug investigation | `CLAUDE.md`, `PROJECT_STATE.md` | Relevant domain artifacts and PRD sections | Targeted | **Future workflow stage — do not begin yet.** No implementation exists to investigate |
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
8. Identify any protected open questions (Section 8) that the task touches, and avoid resolving them silently.
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
explicit instruction. Do not silently resolve any item listed as
Still Open in PROJECT_STATE.md Section 8. Report the sources loaded
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
- Open questions (Section 8) remain open unless explicitly decided in their authoritative source — never resolved by being repeated confidently in a summary.
- Candidate status (Section 5, Section 7) does not become Confirmed merely because a term is repeated in this or another summary document.
- If this document becomes stale relative to the repository, update it (Section 15) before relying on it for a new task.
- High-impact finance rules (Section 6, and any Financial Invariant) must be verified against the PRD or domain source directly before being relied upon for implementation or specification work.
- No external knowledge should be used to silently fill a product gap that the PRD leaves open.
- No generic finance-app convention may override Annotasi Finance's approved model (e.g., FIFO/LIFO allocation behavior, negative balances, generic "wallet" terminology).

---

## 15. Update Rules for This Document

### Must trigger an update
- a new workflow artifact is reviewed and pushed;
- an open question (Section 8) is explicitly resolved by its authoritative source;
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

- Session 19 established `docs/domain/DOMAIN_BEHAVIOR_CATALOG.md` as the latest completed domain artifact, covering product-domain intent, preconditions, accepted effects, rejection, candidate-boundary participation, recalculation, lifecycle, correction, and Traceability.
- The next recommended task is **Session 20 — Domain Behavior Decision Tables and Boundary Participation Analysis**.
- Session 20 has **not** started.
- Session 20 remains part of the current Domain Modeling stage (see Section 3, Section 11) and begins only through explicit Session 20 instruction.
- Architecture remains downstream from a sufficiently approved domain model and has not begun.

This document only summarizes candidate conclusions from the domain artifact; it does not turn them into final Aggregate, Aggregate Root, or consistency-boundary decisions.

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
