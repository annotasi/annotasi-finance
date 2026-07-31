# Annotasi Finance — Domain Concept Model

## 1. Document Status

- **Status:** Draft for domain-modeling review
- **Scope:** Annotasi Finance Private Beta MVP
- This document is a **plain-language domain concept model**. It describes which concepts exist, what they relate to, confirmed cardinalities, confirmed lifecycle states, and what must remain true across relationships — it does **not** classify anything as an Entity, Value Object, Aggregate, Aggregate Root, Domain Service, Repository, Command, Domain Event, or Bounded Context, and it contains no tables, columns, foreign keys, IDs, ORM models, API endpoints, JSON, classes, interfaces, modules, services, persistence, event sourcing, messaging, or framework language.
- This document builds directly on `docs/domain/UBIQUITOUS_LANGUAGE.md` and **does not rename** any canonical internal term defined there.
- **Unresolved PRD and Ubiquitous Language questions remain unresolved.** Nothing here silently resolves an open product, UX, or relationship question. Where a relationship is not explicitly confirmed by the PRD, this document says so and defers it — it does not infer a plausible-sounding answer from how generic finance apps are usually built.

---

## 2. Purpose

This document exists to describe, in plain product language, how Annotasi Finance's confirmed domain concepts relate to one another — before any entity, value-object, aggregate, or bounded-context decision is made. It is the next step in CLAUDE.md §5's workflow (Ubiquitous Language → Domain Concept Model → later domain modeling → Architecture), and its job is to:

- State which concepts exist and what each one relates to.
- State confirmed cardinalities ("exactly one," "zero or more," etc.) only where the PRD actually confirms them.
- State confirmed lifecycle states and relationship constraints (e.g., Archive preconditions, Chronological Recalculation).
- Distinguish values that are **derived** (computed from other records) from values that are **directly edited**.
- State what must remain true across these relationships (the Financial Invariants), in relational terms.
- Provide scenario-based tests that exercise these relationships against confirmed PRD behavior.
- Leave every relationship the PRD has not yet confirmed genuinely open, for later domain modeling or specification.

This document does **not** decide how any of this is implemented, stored, or exposed. It is one abstraction level below entities/aggregates and one level above the flat glossary — a map of relationships, not a data model.

---

## 3. Source of Truth and Decision Rules

**Priority order for this document:**

1. Confirmed requirements in `docs/product/ANNOTASI_FINANCE_MVP_PRD.md`
2. Approved principles in `docs/product/PRODUCT_IDENTITY.md`
3. Working rules in `CLAUDE.md`
4. Canonical terminology in `docs/domain/UBIQUITOUS_LANGUAGE.md`
5. This Session 15 specification
6. Generic procedural guidance from the project-local `domain-modeling` skill

Higher-priority sources always override the skill.

**How the `domain-modeling` skill is used, and how it is not:**

- **Adopted, as procedural technique only:** challenging terminology against the approved glossary (`UBIQUITOUS_LANGUAGE.md`, not the skill's own `CONTEXT.md`), sharpening relationship language, stress-testing relationships with concrete scenarios (§16), and detecting contradictions or missing relationship rules.
- **Not adopted:** the skill's default output artifacts (`CONTEXT.md`, `CONTEXT-MAP.md`, `docs/adr/`) — this document is the only output, at the path fixed by the Session 15 specification. The skill's "be opinionated, pick a winner" default is suspended for anything marked Candidate terminology, Still open, Hypothesis, Future only, or Excluded from v1 in the source documents — this document only asserts a relationship as settled where a higher-priority source already confirms it. The skill's own example relationships (`OrderPlaced`, `ShipmentDispatched`) are not followed — no domain-event, event-sourcing, or event-driven-architecture language appears anywhere in this document, merely because the skill's examples use that style. The skill is not invoked automatically or applied beyond this session's explicit scope.
- Where a relationship term needed for this document has no verbatim PRD phrase but the underlying relationship is fully and unambiguously confirmed by the PRD, this document reuses (never renames) the canonical term already coined in `UBIQUITOUS_LANGUAGE.md` and explicitly notes that the term describes existing confirmed behavior, not a new product decision.

---

## 4. Modeling Boundaries

This document stays strictly at the **domain concept / relationship** level. It explicitly does **not**:

- Classify any concept as an Entity, Value Object, Aggregate, Aggregate Root, Domain Service, Repository, Command, Domain Event, or Bounded Context.
- Describe tables, columns, foreign keys, IDs, ORM models, API endpoints, JSON shapes, classes, interfaces, modules, services, persistence mechanisms, event sourcing, messaging, or framework choices.
- Use technical implementation relationship language such as `hasMany`, `belongsTo`, "foreign key," "parent table," or "child entity."

Relationships are described only in plain product language: "A Workspace contains...," "A Financial Event references...," "A Dedicated Fund may be backed by...," "A balance is derived from...." Where the PRD has not confirmed a cardinality or rule, this document states only the confirmed part and marks the rest **Still open** — it never assumes a cardinality because it is common in other finance applications.

---

## 5. Domain Concept Overview

The concepts below are fully defined in `docs/domain/UBIQUITOUS_LANGUAGE.md`; this section only restates them briefly, grouped by area, as an index into the relationship sections that follow.

**Identity and workspace:** Annotasi Finance, User, Workspace, Single-Owner Workspace.

**Accounts and balances:** Account, Account Type, Opening Balance, Opening-Balance Effective Date, Total Account Balance, Unallocated Amount, Workspace Total Balance.

**Financial Events:** Financial Event, Event Type, Event Date, Created Timestamp, Updated Timestamp, Income, Expense, Ordinary Expense, Fund-Linked Expense, Transfer, Fund Allocation, Fund Release, Debt Repayment.

**Categories:** Category, Income Category, Expense Category.

**Dedicated Funds and goals:** Dedicated Fund, Financial Goal, Target Amount, Account-Backed Fund Allocation, Fund Balance.

**Debt:** Debt Record, Opening Outstanding Principal, Outstanding Principal.

**Reporting and time:** Reporting Period, Calendar Month, Custom Monthly Cycle, Asia/Jakarta Workspace Timezone, Incomplete Period.

**Correction and lifecycle:** Correction, Same-Type Edit, Event Replacement, Soft Deletion, Trash, Restoration, Archive, Permanent Deletion, Chronological Recalculation, Deterministic Same-Date Ordering, Impact Preview.

**Traceability:** Traceability, Supporting Record, Financial Invariant.

### Concept Relationship Summary Table

This table is a **product-language summary**, not a schema. "Confirmed Cardinality" states only what the PRD confirms; where it does not, the cell says "Not confirmed — Still open" and the detail is repeated in §18.

| Source Concept | Relationship | Target Concept | Confirmed Cardinality | Important Constraint | PRD Reference | Status |
|---|---|---|---|---|---|---|
| User | owns | Workspace | exactly one : exactly one | Single-owner in v1; no shared editing | PRD §6 | Confirmed |
| Workspace | contains | Account | zero or more (day-one: one or more once onboarding completes) | Multiple accounts needed for Transfer to be meaningful | PRD §12 | Confirmed |
| Workspace | contains | Category | zero or more | Income/Expense sets are separate and non-overlapping | PRD §13 | Confirmed |
| Workspace | contains | Dedicated Fund | zero or more | Optional at the workspace level | PRD §14 | Confirmed |
| Workspace | contains | Debt Record | zero or more | Optional at the workspace level | PRD §15 | Confirmed |
| Workspace | contains | Financial Event | zero or more | Every event belongs to exactly one Workspace | PRD §9, §11 | Confirmed |
| Workspace | has | Reporting Period configuration | exactly one active | Calendar Month by default, or one Custom Monthly Cycle | PRD §17 | Confirmed |
| Account | has | Account Type | exactly one | Fixed four-type list; descriptive only | PRD §12 | Confirmed |
| Account | has | Opening Balance | exactly one | Never negative; sets Total Account Balance and Unallocated Amount equal at creation | PRD §9, §12 | Confirmed |
| Account | has | Opening-Balance Effective Date | exactly one | Earliest valid Event Date boundary for that account | PRD §12 | Confirmed |
| Account | backs | Account-Backed Fund Allocation | zero or more | May back allocations for more than one Dedicated Fund | PRD §9 ("sum of all current fund allocations backed by that account") | Confirmed |
| Dedicated Fund | is backed by | Account-Backed Fund Allocation | zero or more (one per backing Account) | May span multiple Accounts | PRD §14 | Confirmed |
| Account-Backed Fund Allocation | relates | one Account to one Dedicated Fund | exactly one Account : exactly one Dedicated Fund, per allocation | No allocation-lot, FIFO, or LIFO relationship | PRD §14 | Confirmed (relationship restatement of already-confirmed behavior) |
| Dedicated Fund | may have | Target Amount | zero or one | Not a hard cap | PRD §14 | Confirmed |
| Financial Event | has | Event Type | exactly one, of six closed types | Income, Expense, Transfer, Fund Allocation, Fund Release, Debt Repayment | PRD §9, §11 | Confirmed |
| Income | references | Account | exactly one | | PRD §11 | Confirmed |
| Income | references | Income Category | exactly one | | PRD §11, §13 | Confirmed |
| Expense | references | Account (payment) | exactly one | | PRD §11 | Confirmed |
| Expense | references | Expense Category | exactly one | | PRD §11, §13 | Confirmed |
| Expense | may reference | Dedicated Fund | zero or one | Presence determines Ordinary vs. Fund-Linked Expense | PRD §11 | Confirmed |
| Transfer | references | source Account | exactly one | Same Workspace/User as destination | PRD §11 | Confirmed |
| Transfer | references | destination Account | exactly one | Same Workspace/User as source | PRD §11 | Confirmed |
| Transfer | source and destination | distinctness | Not confirmed — Still open | PRD implies "two accounts" but states no explicit blocking rule | PRD §11 | Still open (§18) |
| Fund Allocation | references | Dedicated Fund | exactly one | | PRD §11 | Confirmed |
| Fund Allocation | references | source Account | exactly one | | PRD §11 | Confirmed |
| Fund Release | references | Dedicated Fund | exactly one | | PRD §11 | Confirmed |
| Fund Release | references | source Account | exactly one | Draws from current allocation, never a historical Fund Allocation event | PRD §11, §14 | Confirmed |
| Debt Repayment | references | Debt Record | exactly one | Cannot exist without one | PRD §11, §15 | Confirmed |
| Debt Repayment | references | payment Account | exactly one | | PRD §11, §15 | Confirmed |
| Debt Record | has | Opening Outstanding Principal | exactly one, with one effective date | Analogous to Account Opening Balance | PRD §15 | Confirmed |
| Category | belongs to | Income kind or Expense kind | exactly one kind | Non-overlapping sets | PRD §13 | Confirmed |
| Event Replacement | links | replaced Financial Event to new Financial Event | exactly one : exactly one | Both remain linked for Traceability | PRD §16 | Confirmed |
| Financial Event | may undergo | Soft Deletion → Trash → Restoration | zero or one active Trash state at a time | Reversible; exact retention period Still open | PRD §16 | Confirmed (mechanism); retention period Still open |
| Workspace Total Balance | derived from | Total Account Balance (active Accounts) | sum over active Accounts | Archived-account inclusion Still open | PRD §12, §18 | Confirmed (mechanism); Still open (archived inclusion) |

---

## 6. Workspace and Ownership Relationships

- **One User owns exactly one Workspace in v1.** One Workspace has exactly one owning User in v1. This is not shared or joint ownership in v1 (PRD §6, PRODUCT_IDENTITY.md §3).
- **The Workspace is private.** No shared links, guests, household, teacher, or spouse access; isolation applies to accounts, balances, events, categories, funds, debts, reports, dashboard data, Trash, onboarding state, and exports (PRD §20).
- **Shared ownership, invitations, roles, and collaboration are excluded from v1.** They are future direction only (PRODUCT_IDENTITY.md §3, §10, §14; PRD §6, §8, §29; CLAUDE.md §3). This document does not describe any authentication or authorization mechanism — it only states the confirmed ownership cardinality.

### Workspace Contents

A Workspace is the complete financial context belonging to its one owning User. A Workspace contains:

- its Accounts,
- its Categories,
- its Dedicated Funds,
- its Debt Records,
- its Financial Events,
- and its Reporting Period configuration (Calendar Month, or one optional Custom Monthly Cycle).

This document does not describe how containment is stored or what happens to contained concepts if a Workspace itself were ever removed — no storage mechanism or deletion cascade is invented here; the PRD does not address Workspace-level deletion at all.

---

## 7. Account and Balance Relationships

**The confirmed balance equation, preserved exactly:**

> Total Account Balance = Unallocated Amount + the sum of all current Account-Backed Fund Allocations backed by that Account.

- **One Account has one Account Type**, from the fixed four-type list (Cash, Bank Account, E-Wallet, Other); the type is descriptive only and never changes financial semantics (PRD §12).
- **Opening Balance initializes Total Account Balance and Unallocated Amount to the same amount.** At the moment an Account is created, both start equal to the Opening Balance (PRD §9, §12).
- **Initial Account-Backed Fund Allocations are Rp0.** At Account creation, the sum of current Account-Backed Fund Allocations is Rp0. Any later non-zero allocation must result from an explicit Fund Allocation event (PRD §9, §12).
- **Opening Balance is starting state, not a Financial Event** — it is never Income and never counted among the six Financial Event types (PRD §9, §11, §28).
- **An Account may back allocations for multiple Dedicated Funds.** The balance equation's "sum of all current fund allocations backed by that account" confirms one Account can simultaneously back allocations for more than one Dedicated Fund (PRD §9).
- **One Dedicated Fund may have allocations backed by multiple Accounts.** The PRD confirms directly that "a fund may hold allocations from multiple accounts" (PRD §14).
- **Each Account-Backed Fund Allocation relates exactly one Account to exactly one Dedicated Fund.** Every individual allocation is backed by exactly one source Account (PRD §14); this document restates that as a one-Account-to-one-Fund relationship per allocation — this is vocabulary for already-confirmed behavior, not a new product decision.
- **No allocation-lot, FIFO, or LIFO relationship exists in v1.** Fund Release and Fund-Linked Expense always draw from an Account's *current* allocation balance for a Fund, never from a specific historical Fund Allocation event, and never automatically from a different Account's allocation (PRD §14, §16).
- **Workspace Total Balance is derived from active Accounts**, as the sum of their Total Account Balances, and must be traceable to those individual account balances (PRD §12, §18).
- **Preserved as open:** whether archived Accounts still factor into historical Workspace Total Balance, and whether user-controlled exclusion from totals is allowed (PRD §12, §28) — not resolved here.

---

## 8. Financial Event Relationships

Every Financial Event:

- **belongs to exactly one Workspace**,
- **has exactly one of the six closed v1 Event Types** (Income, Expense, Transfer, Fund Allocation, Fund Release, Debt Repayment) (PRD §9, §11),
- **has exactly one Event Date**, used for reporting placement and validity checks (PRD §12, §17),
- **has a Created Timestamp and an Updated Timestamp** as change metadata, neither of which ever determines reporting placement (PRD §16, §17),
- **participates in Chronological Recalculation** — any change to it (edit, deletion, restoration, replacement) recalculates affected history from the earliest affected point forward (PRD §16).

### Income

- References exactly one Account.
- References exactly one Income Category.
- Increases the Account's Total Account Balance and Unallocated Amount; increases the Income total for the relevant Reporting Period; does not affect the Expense total or any Account-Backed Fund Allocation (PRD §11).

### Expense

- References exactly one payment Account.
- References exactly one Expense Category.
- May reference zero or one Dedicated Fund.
- **When no fund is referenced, it is an Ordinary Expense** — it draws only from the Account's Unallocated Amount, decreasing both Total Account Balance and Unallocated Amount (PRD §11). ("Ordinary Expense" is this document's canonical label, carried from `UBIQUITOUS_LANGUAGE.md`, for "an Expense without a fund reference" — vocabulary for already-confirmed behavior, not a new decision.)
- **When one fund is referenced, it is a Fund-Linked Expense** — its single payment Account must be the same Account backing the selected Dedicated Fund's allocation being drawn down. It decreases Total Account Balance and the matching Account-Backed Fund Allocation, leaving Unallocated Amount unchanged; it does not require sufficient Unallocated Amount (PRD §11, §14). **A Fund-Linked Expense draws only from the selected fund allocation backed by the same payment Account** — never from an allocation backed by a different Account (PRD §14).
- Increases the Expense total for the relevant Reporting Period exactly once, regardless of form; never affects the Income total (PRD §11).

### Transfer

- References exactly one source Account.
- References exactly one destination Account.
- Both Accounts belong to the same Workspace and User (PRD §11).
- **Whether the source and destination are required to be distinct Accounts is not explicitly confirmed by the PRD** — see §18; this document does not invent that constraint.
- It is **one linked Financial Event, not an Income plus an Expense** — both sides are edited, deleted, and restored together (PRD §11, §16).
- It **never automatically moves or recreates a Dedicated Fund allocation** on either the source or destination Account; carrying fund purpose to moved money requires an explicit Fund Release followed by a new Fund Allocation on the destination Account (PRD §11, §14).
- Decreases the source Account's Total Account Balance and Unallocated Amount; increases the destination Account's Total Account Balance and Unallocated Amount by the same amount; never affects Income or Expense totals or any Account-Backed Fund Allocation (PRD §11).

### Fund Allocation

- References exactly one Dedicated Fund.
- References exactly one source Account.
- **Increases only the allocation relationship between that Account and that Dedicated Fund** (the Account-Backed Fund Allocation) — it does not change Total Account Balance, and it decreases the source Account's Unallocated Amount by the same amount (PRD §11, §14).

### Fund Release

- References exactly one Dedicated Fund.
- References exactly one source Account.
- **Draws from the current Account-Backed Fund Allocation** for that Account and Fund — it does not change Total Account Balance, and it increases the source Account's Unallocated Amount by the same amount it decreases the allocation (PRD §11, §14).
- **Never references or consumes a particular historical Fund Allocation event** (PRD §11, §14).

### Debt Repayment

- References exactly one Debt Record.
- References exactly one payment Account.
- **Never consumes a Dedicated Fund allocation** — it draws only from the payment Account's Unallocated Amount (PRD §11, §15).
- **Reduces Outstanding Principal**; cannot reduce it below Rp0 (PRD §11, §15).
- **Principal does not increase Expense totals.**
- **Interest, fees, and penalties are recorded as separate Expense events**, referencing an Expense Category, never mixed into the Debt Repayment (PRD §15).

**No Category is added to Transfer, Fund Allocation, Fund Release, or Debt Repayment** — their required references (Accounts, Dedicated Fund, Debt Record) already provide sufficient context, and the PRD confirms Category applies only to Income and Expense (PRD §9, §13).

---

## 9. Dedicated Fund and Goal Relationships

- **Dedicated Fund is not an Account.** It holds no money independently of the Accounts backing its allocations, and it never moves or transfers real money (PRD §9, §14).
- **Fund Balance is derived from current Account-Backed Fund Allocations** — the sum of that Dedicated Fund's allocations across every Account backing it, always breakable down per originating Account (PRD §14).
- **A Dedicated Fund may have zero or one Target Amount.** When a Target Amount is present, that Dedicated Fund behaves as a Financial Goal. Financial Goal remains the same underlying concept as Dedicated Fund, not a separate structure (PRD §14).
- **Target Amount is not a hard cap.** Allocations may exceed it, shown as "target exceeded," without being blocked for that reason alone (PRD §14).
- **Named purposes such as Qurban are individual Dedicated Funds, not Event Types or Categories** (PRD §13, §14; CLAUDE.md §4).

**Preserved as open (not resolved here):**

- Final Dedicated Fund UI terminology (PRD §9, §22, §28).
- Whether a Financial Goal "completed" state is explicit or purely derived (PRD §14, §28).
- Whether a Target Amount can be changed or removed after allocation history exists (PRD §14, §28).
- Restore behavior for archived Dedicated Funds beyond "archiving preserves history" — not explicitly confirmed the way Account and Category restoration are (`UBIQUITOUS_LANGUAGE.md` §11 "Archive"; PRD §14, §28).
- Non-zero Dedicated Fund archival behavior — whether it is ever blocked outright vs. always allowed with confirmation (PRD §14, §28).

---

## 10. Debt Relationships

- **Debt Record is not an Account** (PRD §15).
- **One Debt Record begins with one Opening Outstanding Principal and one effective date** (PRD §15).
- **A Debt Repayment cannot exist without a Debt Record** — no free-text debt labels (PRD §15).
- **Outstanding Principal is derived from the Opening Outstanding Principal and all valid Debt Repayments to date** — never directly editable (PRD §15).
- **Original borrowing/issuance is not represented as a v1 Financial Event** — only repayment against an existing opening-balance debt is in scope (PRD §8, §15).

**Preserved as open (not resolved here):**

- Whether creditor/lender name is a separate Debt Record field or folded into the debt name (PRD §15, §28).
- Whether debt status ("Active"/"Paid Off") is an explicit named state or purely derived from Outstanding Principal (PRD §15, §28).

---

## 11. Category Relationships

- **Income uses only Income Categories; Expense uses only Expense Categories.**
- **Income and Expense category sets do not overlap** — a Category belongs to exactly one kind (PRD §13).
- **Exactly one Category applies to each Income or Expense event** — no multi-category or split events (PRD §13).
- **Categories describe purpose and do not determine Event Type or financial effect** — the event's type is decided first (PRD §9, §13).
- **Transfer, Fund Allocation, Fund Release, and Debt Repayment have no Category** — their own required references already provide context (PRD §13).
- **Category is not a Dedicated Fund** — default category sets must never use names that actually represent Event Types or fund purposes (e.g., Transfer, Tabungan, Pembayaran Utang, Qurban, Tabungan Istri, Rumah Impian) (PRD §13).

**Preserved as open:** exact starter-category wording, count, and default sets remain Candidate terminology, pending UX terminology review (PRD §13, §28; `UBIQUITOUS_LANGUAGE.md` §5).

---

## 12. Reporting and Time Relationships

- **Each Workspace has one active Reporting Period configuration** — only one active cycle definition per workspace (PRD §17).
- **Calendar Month is the default**, requiring no setup.
- **Custom Monthly Cycle is optional**, configured once at the workspace level, with a single recurring start day supported for days 1 through 28 (PRD §17).
- **Event Date determines reporting placement.**
- **Created Timestamp and Updated Timestamp never determine reporting placement** (PRD §16, §17).
- **Asia/Jakarta is fixed for all v1 workspaces** — not user-configurable, unaffected by device timezone or physical location; reporting cycles change over at 00:00 Asia/Jakarta (PRD §17, §21, §28).
- **Device location and device timezone do not change workspace reporting boundaries** — the user may still manually pick a different Event Date (PRD §17, §21).
- **Incomplete Period flags a Reporting Period with incomplete tracking history** so comparisons are not presented as misleadingly complete (PRD §17).

No configuration storage mechanism is described here — only the confirmed relationship that exactly one Reporting Period configuration is active per Workspace at a time.

---

## 13. Correction and Lifecycle Relationships

- **Same-Type Edit relates to the Financial Event it changes** by modifying its fields (amount, date, account, category/fund/debt reference, note) without changing its Event Type; every valid edit recalculates all affected balances, funds, debts, summaries, reports, dashboard, and history immediately (PRD §16).
- **Event Replacement relates the replaced (old) Financial Event and the new linked Financial Event** — the old event is marked replaced, the new event carries the required fields for its Event Type, and both remain linked for Traceability (PRD §16).
- **Soft Deletion, Trash, and Restoration relate to a Financial Event's lifecycle**: a deleted event moves to a recoverable Trash state with its effect reversed immediately, remains recoverable for a defined retention period, and Restoration reapplies its effect only after revalidating current dependencies against every confirmed Financial Invariant (PRD §16).
- **Archive relates to Account, Category, and Dedicated Fund lifecycle, but not by one universal rule:**
  - An Account may be archived only when its Total Account Balance is exactly Rp0; archiving preserves all financial history, excludes the Account from selectors for new events, and **restoration to active use is confirmed** (PRD §12).
  - A Category may be archived/hidden, and **restoration is confirmed** (PRD §13).
  - A Dedicated Fund's archiving **preserves all history**; the PRD does not state a restore-to-active-use rule for Dedicated Funds the way it does for Accounts and Categories — this document does not infer one (see §9, §18).
- **Permanent Deletion relates to the absence of history/dependencies** — allowed only for an Account, Category, or Dedicated Fund that was never used and carries no financial history or dependencies (PRD §12, §13, §14).
- **Impact Preview relates to material historical changes** — a before/after view shown before confirming a change such as moving an Opening-Balance Effective Date or changing a Reporting Period cycle (PRD §12, §15, §17).
- **Every Correction (Same-Type Edit, Event Replacement, Soft Deletion, Restoration, or an Opening Balance change) participates in Chronological Recalculation** — the affected history is recalculated from the earliest affected point forward, and every confirmed Financial Invariant must remain valid at every point in that recalculated history, not only in the final state (PRD §16).

**No universal restore rule is inferred for every archived concept** — Account and Category restoration are confirmed; Dedicated Fund restoration beyond history-preservation is not, and remains open (§9, §18).

---

## 14. Derived Values and Traceability

- **Every important number must relate to the Supporting Records that produced it** — this is the second of Traceability's three confirmed levels (Summary, Supporting Record, individual event explanation) (PRD §19).
- **Derived balances and totals must trace to Financial Events and starting state:** Total Account Balance, Unallocated Amount, Account-Backed Fund Allocation, Fund Balance, Outstanding Principal, and Workspace Total Balance are all derived values — none is directly editable; each traces back to Opening Balance/Opening Outstanding Principal plus the Financial Events that followed (PRD §9, §14, §15, §18, §19).
- **Opening Balance must remain distinguishable from Financial Events** — it initializes starting state and is never itself part of the derivation chain of "events that happened" (PRD §9, §11, §12).
- **Event Replacement must preserve the link between the old and new records** so the replaced event remains traceable alongside its replacement (PRD §16, §19).
- **Summary/detail disagreement is release-blocking** — a dashboard or report number that disagrees with its own Supporting Records is a release-blocking defect, not a cosmetic one (PRD §19, §24).

No navigation design, API response shape, or database audit-table structure is described here — only the confirmed relationship that every derived number must be traceable to the records that produced it.

---

## 15. Relationship Rules and Invariants

**The confirmed v1 Financial Invariants, carried forward from `UBIQUITOUS_LANGUAGE.md` §12:**

1. Total Account Balance is never below Rp0.
2. Unallocated Amount is never below Rp0.
3. Account-Backed Fund Allocation is never below Rp0.
4. The Account balance equation always holds: Total Account Balance = Unallocated Amount + the sum of all current Account-Backed Fund Allocations for that Account.
5. Outstanding Principal is never below Rp0.
6. Event Date never precedes the effective date of every referenced Account or Debt Record; same-date is allowed.
7. Same-date recalculation is deterministic, while the exact ordering mechanism remains deferred (Deterministic Same-Date Ordering).

**Relational consequences, only where the PRD supports them:**

- **A new Financial Event cannot select a concept that is unavailable for new use under its confirmed lifecycle rules** — e.g., an archived Account, Category, or Dedicated Fund is excluded from selectors for new events (PRD §12, §13, §14).
- **A Same-Type Edit cannot change a reference to an unavailable concept** — editing an Account, Category, Dedicated Fund, or Debt Record reference to one that is not currently available for new use is blocked the same way a new Financial Event would be (PRD §12, §13, §14, §16).
- **An existing historical Financial Event remains historically valid when its referenced Account, Category, or Dedicated Fund is later archived** — archiving does not retroactively invalidate events that already reference the archived concept; historical references remain preserved (PRD §12, §13, §14).
- **Restoration and Correction still revalidate current dependencies and every Financial Invariant** at the time they are performed, regardless of whether a referenced concept has since been archived (PRD §16). This does not imply any confirmed Dedicated Fund restoration behavior beyond what §9 and §18 already state.
- **A correction is blocked if any historical point would violate an invariant** — an edit, deletion, restoration, replacement, or Opening Balance/Opening-Balance Effective Date change is blocked if it would make any invariant false at any point in the recalculated history, not only the final state (PRD §16).
- **A Fund-Linked Expense cannot draw from an allocation backed by another Account** — allocations belonging to a different Account are never automatically consumed (PRD §11, §14).
- **A Fund Release cannot exceed the chosen Account's current allocation to the selected Fund** — not the Fund's total balance across all Accounts (PRD §11, §14).
- **A Debt Repayment cannot exceed the current Outstanding Principal** — an overpayment attempt is blocked or requires correction before saving (PRD §11, §15).

---

## 16. Scenario-Based Relationship Tests

Using the domain-modeling skill's concrete-scenario technique — testing relationships against specific situations, not inventing new product behavior.

**1. Income into BCA**
- Concepts: Account (BCA), Income, Income Category.
- Relationship tested: Income → Account, Income → Income Category.
- Expected result: Valid. BCA's Total Account Balance and Unallocated Amount both increase by the amount; the Income total for the period increases; the Expense total is unchanged.
- Rule: Income effects (PRD §11); no invariant is threatened by an increase.
- PRD reference: §11 (Income), §24 (scenario 1).

**2. Ordinary Expense from BCA**
- Concepts: Account (BCA), Expense (no fund), Expense Category.
- Relationship tested: Expense → Account, Expense → Expense Category, no Dedicated Fund reference.
- Expected result: Valid only if the amount does not exceed BCA's current Unallocated Amount; otherwise blocked with a clear explanation. BCA's Total Account Balance and Unallocated Amount both decrease by the amount.
- Rule: Unallocated Amount ≥ Rp0; Total Account Balance ≥ Rp0.
- PRD reference: §11 (Expense), §12, §24 (scenario 2).

**3. Transfer from BCA to GoPay**
- Concepts: Account (BCA, source), Account (GoPay, destination), Transfer.
- Relationship tested: Transfer → source Account, Transfer → destination Account.
- Expected result: Valid only if the amount does not exceed BCA's current Unallocated Amount. BCA's Total Account Balance and Unallocated Amount decrease; GoPay's increase by the same amount; Workspace Total Balance is unchanged; no Account-Backed Fund Allocation is touched on either side.
- Rule: Unallocated Amount ≥ Rp0 on the source; the balance equation holds on both Accounts; a Transfer never moves fund allocation.
- PRD reference: §11 (Transfer), §24 (scenario 3).

**4. Fund Allocation from BCA to Qurban**
- Concepts: Account (BCA), Dedicated Fund (Qurban), Fund Allocation.
- Relationship tested: Fund Allocation → Dedicated Fund, Fund Allocation → source Account; increases the BCA-backed Qurban allocation.
- Expected result: Valid only if the amount does not exceed BCA's current Unallocated Amount. BCA's Unallocated Amount decreases; the BCA-backed Qurban allocation increases by the same amount; BCA's Total Account Balance is unchanged.
- Rule: Unallocated Amount ≥ Rp0; the balance equation holds; Account-Backed Fund Allocation ≥ Rp0.
- PRD reference: §11 (Fund Allocation), §14, §24 (scenario 4).

**5. Fund Allocation to Qurban from two different Accounts**
- Concepts: Account (BCA), Account (GoPay), Dedicated Fund (Qurban), two Fund Allocation events.
- Relationship tested: one Dedicated Fund holding Account-Backed Fund Allocations from two different Accounts at once.
- Expected result: Valid. Qurban's Fund Balance equals the BCA-backed allocation plus the GoPay-backed allocation, each independently traceable to its own source Account.
- Rule: Fund Balance is derived as the sum across all backing Accounts; each allocation independently satisfies Account-Backed Fund Allocation ≥ Rp0.
- PRD reference: §14 ("a fund may hold allocations from multiple accounts").

**6. Fund-Linked Expense using the matching BCA-backed Qurban allocation**
- Concepts: Account (BCA), Dedicated Fund (Qurban), Expense (fund-linked), Expense Category.
- Relationship tested: Expense → Account (payment), Expense → Expense Category, Expense → Dedicated Fund, drawing specifically from the BCA-backed Qurban allocation.
- Expected result: Valid only if the amount does not exceed the BCA-backed Qurban allocation and does not make BCA's Total Account Balance negative. BCA's Total Account Balance decreases; the BCA-backed Qurban allocation decreases by the same amount; BCA's Unallocated Amount is unchanged; the Expense total increases exactly once.
- Rule: Account-Backed Fund Allocation ≥ Rp0; Total Account Balance ≥ Rp0; sufficient Unallocated Amount is not required.
- PRD reference: §11, §14, §24 (scenario 6).

**7. Attempted Fund-Linked Expense from an Account that does not back enough allocation**
- Concepts: Account (GoPay), Dedicated Fund (Qurban), Expense (fund-linked).
- Relationship tested: an Expense attempts to draw more than GoPay's current Qurban allocation, even though Qurban's fund balance from BCA might be sufficient.
- Expected result: Blocked with a clear explanation — a Fund-Linked Expense may only draw from the payment Account's own backed allocation; a different Account's allocation for the same Fund is never automatically consumed.
- Rule: Account-Backed Fund Allocation ≥ Rp0; no automatic cross-account consumption.
- PRD reference: §11, §14 ("Allocations belonging to another account are never automatically consumed").

**8. Fund Release from one selected Account's Qurban allocation**
- Concepts: Account (BCA), Dedicated Fund (Qurban), Fund Release.
- Relationship tested: Fund Release → Dedicated Fund, Fund Release → source Account, drawing from BCA's current Qurban allocation only.
- Expected result: Valid only if the amount does not exceed BCA's current Qurban allocation. The BCA-backed Qurban allocation decreases; BCA's Unallocated Amount increases by the same amount; Total Account Balance is unchanged; no other Account's allocation or any historical Fund Allocation event is touched.
- Rule: Account-Backed Fund Allocation ≥ Rp0; the balance equation holds; no reference to a historical Fund Allocation event.
- PRD reference: §11 (Fund Release), §14, §24 (scenario 5).

**9. Debt Repayment from BCA**
- Concepts: Account (BCA), Debt Record, Debt Repayment.
- Relationship tested: Debt Repayment → Debt Record, Debt Repayment → payment Account.
- Expected result: Valid only if the amount does not exceed both BCA's current Unallocated Amount and the Debt Record's current Outstanding Principal. BCA's Total Account Balance and Unallocated Amount decrease; Outstanding Principal decreases; principal is not counted as Expense.
- Rule: Unallocated Amount ≥ Rp0; Outstanding Principal ≥ Rp0.
- PRD reference: §11 (Debt Repayment), §15, §24 (scenario 7).

**10. Debt interest recorded separately as Expense**
- Concepts: Account (BCA), Expense Category, Expense (ordinary), Debt Record (referenced only conversationally, not by the Expense).
- Relationship tested: an interest amount is recorded as a separate Expense referencing an Expense Category, not as a Debt Repayment against the Debt Record.
- Expected result: Valid. The Expense total increases by the interest amount; the Debt Record's Outstanding Principal is unaffected by this Expense.
- Rule: interest, penalties, and fees are always separate Expense events, never mixed into Debt Repayment principal.
- PRD reference: §15 ("Interest, penalties, and service fees are recorded as separate Expense events").

**11. Backdated event triggering Chronological Recalculation**
- Concepts: Financial Event (any type), Account, Chronological Recalculation.
- Relationship tested: recording or editing a Financial Event to an Event Date earlier than other already-recorded events on the same Account.
- Expected result: Valid only if the new Event Date is not earlier than the Account's (or Debt Record's) Opening-Balance Effective Date, and only if every confirmed Financial Invariant remains valid at every point in the recalculated history from that earlier date forward; otherwise blocked with a clear explanation.
- Rule: Chronological Recalculation must hold all Financial Invariants at every historical point, not only the final state; Event Date ≥ Opening-Balance Effective Date.
- PRD reference: §12, §16, §24 (scenario 9).

**12. Restoration blocked because it would invalidate historical state**
- Concepts: Financial Event (Trashed), Restoration, Financial Invariant.
- Relationship tested: Restoration → Trashed Financial Event, triggering Chronological Recalculation.
- Expected result: Blocked if reapplying the event's effect would make any Financial Invariant false at any point in the recalculated history (for example, a later event already relies on money or allocation the restored event would need); the product explains the dependency rather than silently applying an inconsistent restoration.
- Rule: all Financial Invariants must hold at every point after Restoration; dependency-aware blocking.
- PRD reference: §16, §24 (scenario 11).

**13. Event type correction using Event Replacement**
- Concepts: Financial Event (old, e.g., Expense), Financial Event (new, e.g., Income), Event Replacement.
- Relationship tested: Event Replacement linking the old (now-replaced) Financial Event to the new one.
- Expected result: Valid. The old event is marked replaced and its effect reversed; a new event of the correct Event Type is created with the required references; both remain linked for Traceability; no double-counting or unexplained intermediate state results.
- Rule: Traceability (old ↔ new link preserved); Financial Invariants must hold after the replacement.
- PRD reference: §16, §24 (scenario 10).

**14. Account archival at non-zero Total Account Balance**
- Concepts: Account, Archive.
- Relationship tested: Archive → Account, where Total Account Balance is not exactly Rp0.
- Expected result: Blocked. Confirmation alone cannot bypass the Rp0 precondition. The product explains the remaining Total Account Balance and offers next steps (e.g., Fund Release, then Transfer, or otherwise correctly recording its disposition); no automatic transfer, spend, zeroing, or deletion occurs. Once Total Account Balance reaches exactly Rp0, the Account may be archived.
- Rule: Archive precondition for an Account — Total Account Balance = Rp0 exactly.
- PRD reference: §12, §28 (item 3).

**15. Category archival while preserving historical events**
- Concepts: Category, Archive, Financial Event (historical).
- Relationship tested: Archive → Category, while historical Income/Expense events retain their Category reference.
- Expected result: Valid. A Category with transaction history is archived (hidden from selection for new events), not permanently deleted; historical events continue to reference it; the Category can be restored to active use.
- Rule: Permanent Deletion is allowed only for Categories with no transaction history; Archive excludes a Category from new-event selection while preserving history.
- PRD reference: §13.

---

## 17. Explicit Non-Relationships

- **Category does not determine Event Type** — the event's type is decided first; the category only describes purpose (PRD §9, §13).
- **Dedicated Fund is not an Account** — it holds no money independently and never moves real money (PRD §9, §14).
- **Debt Record is not an Account** (PRD §15).
- **Opening Balance is not a Financial Event** — it is starting state, never Income (PRD §9, §11).
- **Transfer is not an Income plus an Expense** — it is one linked event (PRD §11).
- **Debt Repayment principal is not an Expense** — only interest/fees/penalties are recorded as Expense (PRD §11, §15).
- **Named funds such as Qurban are not Categories or Event Types** — they are Dedicated Fund instances (PRD §13, §14; CLAUDE.md §4).
- **Fund Release does not reference a historical Fund Allocation event** — it draws from the current allocation balance (PRD §11, §14).
- **Account-Backed Fund Allocation is not an allocation lot** — no FIFO/LIFO/per-allocation consumption relationship exists (PRD §14, §16).
- **Created Timestamp does not determine Reporting Period** — only Event Date does (PRD §16, §17).
- **Device timezone does not determine workspace date boundaries** — Asia/Jakarta is fixed regardless of device or location (PRD §17, §21).

---

## 18. Still-Open Relationship Questions

Preserved from the PRD and `UBIQUITOUS_LANGUAGE.md`, not answered here:

- Whether archived Accounts remain in historical Workspace Total Balance (PRD §12, §28).
- Whether user-controlled exclusion of an Account from totals is allowed (PRD §12, §28).
- Dedicated Fund restoration — whether a Dedicated Fund can be restored to active use after archiving, beyond "archiving preserves history" (PRD §14, §28).
- Non-zero Dedicated Fund archival — whether it is ever blocked outright vs. always allowed with confirmation (PRD §14, §28).
- Target Amount change or removal after allocation history exists (PRD §14, §28).
- Whether a Financial Goal "completed" state is explicit or purely derived (PRD §14, §28).
- Whether debt status ("Active"/"Paid Off") is an explicit named state or purely derived from Outstanding Principal (PRD §15, §28).
- Replaced-event visibility — whether a replaced event appears in ordinary history or only in its own detail/audit context (PRD §16, §28).
- Trash retention period, and whether manual Permanent Deletion from Trash is available in v1 (PRD §16, §28).
- The exact threshold for requiring an Impact Preview confirmation (PRD §16, §28).
- The deterministic same-date ordering mechanism — the requirement for determinism is confirmed; the exact ordering rule is deferred to domain modeling or detailed specification (PRD §16).
- **Whether the source and destination of a Transfer are explicitly required to differ** — the PRD describes a Transfer as moving money "between two accounts" but states no explicit rule blocking source = destination; this document does not infer one.

---

## 19. PRD Traceability

| Section (this document) | Primary PRD Sections |
|---|---|
| Workspace and Ownership Relationships (§6) | PRD §6, §20 |
| Account and Balance Relationships (§7) | PRD §9, §12, §14, §16, §18, §28 |
| Financial Event Relationships (§8) | PRD §9, §11, §14, §16, §24 |
| Dedicated Fund and Goal Relationships (§9) | PRD §9, §13, §14, §22, §28 |
| Debt Relationships (§10) | PRD §8, §11, §15, §28 |
| Category Relationships (§11) | PRD §9, §13, §28 |
| Reporting and Time Relationships (§12) | PRD §16, §17, §21, §28 |
| Correction and Lifecycle Relationships (§13) | PRD §12, §13, §14, §16 |
| Derived Values and Traceability (§14) | PRD §9, §14, §15, §18, §19, §24 |
| Relationship Rules and Invariants (§15) | PRD §9, §11, §12, §14, §15, §16 |
| Scenario-Based Relationship Tests (§16) | PRD §11, §12, §14, §15, §16, §24, §28 |
| Explicit Non-Relationships (§17) | PRD §9, §11, §13, §14, §15, §16, §17 |
| Still-Open Relationship Questions (§18) | PRD §12, §14, §15, §16, §28 |

Every relationship assertion in this document traces to the sections cited above, or to `docs/domain/UBIQUITOUS_LANGUAGE.md` for the underlying canonical term. Where this document uses a term coined for already-confirmed behavior (e.g., "Ordinary Expense," "Same-Type Edit," or the one-Account-to-one-Dedicated-Fund relationship of an Account-Backed Fund Allocation), that is explicitly noted at point of use as vocabulary for existing confirmed behavior, not a new product decision.
