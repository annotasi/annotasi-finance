# Annotasi Finance Executable Domain Specification

## 1. Document Status

| Field | Value |
|---|---|
| Session | Session 22 — Executable Domain Specification |
| Workflow stage | Domain Modeling |
| Status | Candidate normative domain baseline pending review |
| Architecture | Not started |
| Implementation | Not started |
| Relationship to Session 21 | The committed Session 21 decisions are treated as the approved working decision baseline for this specification. |

This specification becomes normative only after user review, commit, and push. Until then it is a candidate consolidation of the reviewed domain baseline. [DDR §1; PROJECT_STATE, Session 21]

## 2. Purpose

This document converts the approved working product-domain model into an evaluable specification: fixed policies, identities, invariants, state transitions, behavior outcomes, formulas, examples, and properties. It defines what valid Annotasi Finance v1 behavior means without selecting Architecture, persistence, APIs, commands, domain events, messaging, frameworks, or implementation mechanisms. [PRD §§1–2, 29; DDR §§1–3]

## 3. Source Authority and Approval Interpretation

Authority is applied in this order: the complete MVP PRD; Product Identity for product direction; reviewed Session 21 decisions for questions the PRD left open; then the Ubiquitous Language, Concept Model, Object Candidates, Aggregate Candidates, Behavior Catalog, and Behavior Decision Tables as mutually checked domain analysis. `PROJECT_STATE.md` supplies workflow status only and is never the sole authority for a domain rule. [PRD complete; PI; DDR §§2–3, 28]

The committed Decision Register is treated as reviewed and accepted for this specification even though its internal entries retain their creation-time “Pending Review” wording. All 41 decisions are incorporated once in §6; none is reopened. No conflict was found among the authoritative sources. [DDR §§1, 24, 26–27; PROJECT_STATE, Session 21]

## 4. Normative Language

- **MUST** and **MUST NOT** state required or prohibited product-domain behavior. Each such rule is traceable to a source or accepted Session 21 decision.
- **SHOULD** and **SHOULD NOT** state non-invariant recommendations; an exception requires explicit review.
- **MAY** states permitted, optional domain behavior and does not create an obligation.

These keywords describe domain meaning only. They do not prescribe a technical mechanism. [DDR §2; this specification §35]

## 5. Private Beta v1 Scope and Exclusions

Private Beta v1 covers one owner’s private Workspace; Accounts with opening state; Categories; Dedicated Funds and optional Target Amounts; opening-balance Debt Records; exactly six Financial Event types; correction, replacement, Trash, restoration, reporting, recalculation, and traceability. [PRD §§6, 9–19]

The following are outside v1: shared ownership, invitations, roles, household collaboration, non-IDR currencies, selectable timezones, new debt borrowing/issuance events, automatic cross-Account fund consumption, multi-Account Fund-Linked Expense, allocation lots/FIFO/LIFO, Fund Target Date, one-off reporting ranges, Trash expiry, any permanent deletion from Trash, Account exclusion from totals, and Debt Record archive/restore. These exclusions MUST NOT be reintroduced as implicit v1 behavior. A Trashed Financial Event MUST remain retained, traceable, and eligible for a Restoration attempt indefinitely; eligibility for an attempt does not guarantee that Restoration will be accepted. [PRD §§8, 14–16, 28; DDR DEC-ALLOC-02, DEC-FUND-05, DEC-LIFE-01–03, DEC-REPORT-05/06, DEC-DEBT-04]

## 6. Session 21 Decision Incorporation Matrix

| Decision ID | Session 21 Classification | v1 Normative Result | Specification Sections Affected | Behavior IDs Affected | Deferred Detail | Architecture Constraint | Source Reference |
|---|---|---|---|---|---|---|---|
| DEC-NAME-01 | Recommended for Approval | Duplicate Account names allowed | §§8, 14 | AC-01/02 | None | Identity cannot depend on name | DDR DEC-NAME-01 |
| DEC-NAME-02 | Recommended for Approval | Duplicate Category names allowed | §§8, 15 | CT-01/02 | None | Identity cannot depend on name | DDR DEC-NAME-02 |
| DEC-NAME-03 | Recommended for Approval | Duplicate Fund names allowed | §§8, 16 | DF-01/02 | None | Identity cannot depend on name | DDR DEC-NAME-03 |
| DEC-NAME-04 | Recommended for Approval | Account rename allowed after onboarding | §14 | AC-02 | None | Preserve identity/history | DDR DEC-NAME-04 |
| DEC-NAME-05 | Recommended for Approval | Fund rename supported | §16 | DF-02 | None | Preserve identity/history | DDR DEC-NAME-05 |
| DEC-ORDER-01 | Recommended for Approval | Event Date then immutable confirmation position | §§8, 12, 18, 20, 23 | RC-01; all chronological behaviors | Representation | Meaning and lifecycle semantics fixed | DDR DEC-ORDER-01 |
| DEC-TRANSFER-01 | Recommended for Approval | Same-Account Transfer blocked | §§11, 19, 28 | TR-01/02 | None | Constraint cannot be weakened | DDR DEC-TRANSFER-01 |
| DEC-EXPENSE-01 | Recommended for Approval | Ordinary/fund-linked transition is Same-Type Edit | §§19–20 | FX-02, CR-01/02 | None | Expense identity continuity fixed | DDR DEC-EXPENSE-01 |
| DEC-ALLOC-01 | Recommended for Approval | Account/Fund share allocation responsibility | §§11, 16, 19 | FA/FR/FX | Structural translation | Both sides evaluated indivisibly | DDR DEC-ALLOC-01 |
| DEC-ALLOC-02 | Recommended for Approval | Pair identity; no allocation lot | §§8, 16, 25 | FA/FR/FX | None | No independent lot identity | DDR DEC-ALLOC-02 |
| DEC-ALLOC-03 | No Additional Decision Required | Fund Balance remains derived | §§16, 25 | FA/FR/FX, TC-02 | None | Direct writing prohibited | DDR DEC-ALLOC-03; PRD §14 |
| DEC-AGG-01 | Recommended for Approval | Workspace is narrow ownership/configuration scope | §13 | WB-01/02 | Structural translation | Not one giant financial boundary | DDR DEC-AGG-01 |
| DEC-AGG-02 | Recommended for Approval | Event owns identity/form/lifecycle, not all monetary rules | §18 | IN through LC | Structural translation | Referenced concepts retain rules | DDR DEC-AGG-02 |
| DEC-AGG-03 | Recommended for Approval | Category is independent identity/lifecycle concept | §15 | CT-01–05 | Structural translation | Do not reduce to label list | DDR DEC-AGG-03 |
| DEC-AGG-04 | Recommended for Approval | Reporting configuration is Workspace responsibility | §§13, 22 | WB-02, RP-01–03 | Structural translation | One active configuration | DDR DEC-AGG-04 |
| DEC-AGG-05 | No Additional Decision Required | Cross-boundary acceptance is all-or-nothing | §§11, 18, 20, 23 | All cross-boundary behaviors | None | No partial/effectively eventual acceptance | DDR DEC-AGG-05; PRD §§16, 19 |
| DEC-FUND-01 | Recommended for Approval | Nonzero Fund archive blocked | §§16, 21 | DF-04, LC-04 | None | No automatic money movement | DDR DEC-FUND-01 |
| DEC-FUND-02 | Recommended for Approval | Fund restoration supported | §§16, 21 | DF-05, LC-05 | None | Preserve identity/history | DDR DEC-FUND-02 |
| DEC-FUND-03 | Recommended for Approval | Target may change/remove anytime | §16 | DF-03 | None | Target never caps funds | DDR DEC-FUND-03 |
| DEC-FUND-04 | Recommended for Approval | Goal completion is derived | §§16, 25 | DF-01/03 | None | No writable completion state | DDR DEC-FUND-04 |
| DEC-FUND-05 | Defer Post-MVP | No Target Date in v1 | §§16, 31 | DF-01/03 | Complete Target Date behavior | Do not invent v1 field | DDR DEC-FUND-05 |
| DEC-DEBT-01 | Recommended for Approval | Exact current-state deletion eligibility | §§17, 21 | DB-04 | None | Use current confirmed opening value | DDR DEC-DEBT-01 |
| DEC-DEBT-02 | Recommended for Approval | Debt status is derived | §§10, 17, 25 | DB-01–04, DR-01–03 | None | No writable status | DDR DEC-DEBT-02 |
| DEC-DEBT-03 | Recommended for Approval | No separate Creditor field | §17 | DB-01 | None | Do not add separate fact | DDR DEC-DEBT-03 |
| DEC-DEBT-04 | Excluded from v1 | No Debt archive/restore | §§10, 17, 21 | DB family | Future lifecycle | Do not introduce states | DDR DEC-DEBT-04 |
| DEC-LIFE-01 | Recommended for Approval | Archived-reference restoration is concept-specific | §§20–21 | LC-02/05 | Presentation | Never implicitly restore reference | DDR DEC-LIFE-01 |
| DEC-LIFE-02 | Defer Post-MVP | Trashed Events remain retained, traceable, and eligible for Restoration attempts indefinitely; acceptance remains conditional | §§10, 21, 31 | LC-01–03 | Expiry and consequence together | No v1 expiry | DDR DEC-LIFE-01/02 |
| DEC-LIFE-03 | Excluded from v1 | No manual or automatic Trash deletion | §§10, 21 | LC-03 | None in v1 | Preserve recoverability | DDR DEC-LIFE-03 |
| DEC-LIFE-04 | Defer to Implementation Detail | Replaced-event list placement unspecified | §§20, 31 | CR-02 | List presentation | Replacement link remains visible somewhere | DDR DEC-LIFE-04 |
| DEC-LIFE-05 | Recommended for Approval | Impact Preview triggers fixed | §§20, 23 | AC-06/07, DB-02/03, RP-03, CR-01/02, LC-01/02 | Presentation only | Trigger cannot be narrowed | DDR DEC-LIFE-05 |
| DEC-LIFE-06 | Recommended for Approval | Correction reason optional, never blocking | §20 | CR-03 | Presentation | Absence cannot reject | DDR DEC-LIFE-06 |
| DEC-REPORT-01 | Recommended for Approval | Reporting changes apply fully retroactively | §22 | RP-03 | None | No split historical policies | DDR DEC-REPORT-01 |
| DEC-REPORT-02 | Recommended for Approval | One Workspace-owned configuration | §§13, 22 | WB-02, RP-01–03 | Structural translation | Domain cardinality fixed | DDR DEC-REPORT-02 |
| DEC-REPORT-03 | Recommended for Approval | Archived-Account history stays in historical totals | §§22, 24 | AC-03, TC-04 | None | Historical membership stable | DDR DEC-REPORT-03 |
| DEC-REPORT-04 | Recommended for Approval | Workspace Total includes all existing Accounts | §§22, 25 | AC-03, TC-01/04 | None | No archived filtering | DDR DEC-REPORT-04 |
| DEC-REPORT-05 | Excluded from v1 | No user Account-exclusion control | §§22, 31 | TC-01/04 | None in v1 | One membership meaning | DDR DEC-REPORT-05 |
| DEC-REPORT-06 | Defer Post-MVP | No one-off custom ranges | §§22, 31 | RP-02 | Full future behavior | Do not infer arbitrary ranges | DDR DEC-REPORT-06 |
| DEC-TRACE-01 | Defer to Architecture | Stable identity resolution mandatory; event-time name retention is not a v1 domain requirement; Architecture decides current-name-only display versus optional historical-name storage | §§24, 31 | TC-01–05 | Historical-name storage | Identity resolution mandatory; no snapshot mandate | DDR DEC-TRACE-01 |
| DEC-TRACE-02 | Defer to Architecture | Minimal change metadata required | §§20, 24, 31 | CR-01/02, TC-05 | Prior-value history depth | Replacement link mandatory | DDR DEC-TRACE-02 |
| DEC-TRACE-03 | Recommended for Approval | Predictable pre-confirmation disagreement blocks the proposed confirmation and preserves prior confirmed state. Post-hoc disagreement does not alter accepted Financial Events or domain state; it blocks release readiness until resolved. | §§24, 28 | TC-01–05 | Presentation | Agreement cannot be relaxed | DDR DEC-TRACE-03 |
| DEC-REJECT-01 | Recommended for Approval | Evaluate every relevant blocker; priority not fixed | §§23, 28 | All | Message order | No blocker may be skipped | DDR DEC-REJECT-01 |

The matrix contains 30 Recommended for Approval, 2 No Additional Decision Required, 2 Architecture deferrals, 1 implementation-detail deferral, 3 post-MVP deferrals, and 3 v1 exclusions: 41 decisions total. All 18 formerly blocking decisions are therefore treated as resolved for specification purposes. [DDR §§7, 26–27]

## 7. Fixed Domain Policies

| Policy | Normative rule | Source |
|---|---|---|
| Ownership | One User MUST own exactly one private Workspace in v1; shared ownership, invitations, roles, and household collaboration MUST NOT exist. | PRD §§6, 8, 20; DDR DEC-AGG-01 |
| Isolation | Every domain identity, reference, effect, derived view, Trash item, report, and export MUST remain inside its owner’s Workspace. | PRD §§6, 20; DDT AM-18 |
| Currency | Currency MUST be IDR only and monetary precision MUST be whole Rupiah. | PRD §§9, 28 |
| Timezone | Domain dates MUST be interpreted in fixed timezone Asia/Jakarta; Workspace timezone selection MUST NOT exist. | PRD §§9, 28 |
| Reporting | Calendar Month MUST be the default; at most one Custom Monthly Cycle MAY replace it, with start day 1–28; exactly one configuration MUST be active. | PRD §17; DDR DEC-REPORT-02 |
| Placement | Event Date MUST determine reporting placement; Created and Updated timestamps MUST NOT determine it. | PRD §§11, 17; UL §11 |
| Opening Account state | Opening Balance MUST be starting state and MUST NOT be Income or a Financial Event. | PRD §§9, 12 |
| Opening debt state | Opening Outstanding Principal MUST be starting state and MUST NOT be a borrowing event. New borrowing/issuance MUST NOT exist in v1. | PRD §§8, 15 |

## 8. Identity and Reference Semantics

Workspace, Account, Category, Dedicated Fund, Debt Record, and Financial Event MUST retain stable identity throughout every supported lifecycle in which they continue to exist. Names MUST be mutable labels rather than identities; duplicate Account, Category, and Dedicated Fund names MUST be accepted. Rename MUST NOT change identity, references, effects, dates, or chronology position. [PRD §§10, 12–16; DDR DEC-NAME-01–05]

Archived references MUST remain historically resolvable. An Account-Backed Fund Allocation MUST have no independent lot identity: one allocation is identified by its Account–Dedicated Fund pair and its current amount is derived from active confirmed history. [PRD §§13–14, 16, 19; DDR DEC-ALLOC-02]

Financial Event identity MUST persist through Same-Type Edit, Soft Deletion, Trash, and Restoration. Event Replacement MUST create a distinct new identity and an explicit old-to-new relationship. [PRD §16; DDR DEC-AGG-02, DEC-TRACE-02]

Immutable confirmation-order position MUST belong to one Workspace confirmation order. Every newly confirmed Financial Event MUST receive a position that uniquely orders it after every event confirmed earlier in that Workspace, and the position MUST be sufficient to resolve every same-date tie. Event Date remains primary; position MUST be used only when Event Dates are equal. Same-Type Edit MUST preserve it; Restoration MUST reuse it; Replacement’s new event MUST receive a new position after every event already confirmed in the Workspace when replacement is accepted. No identifier or position representation is selected here. [DDR DEC-ORDER-01]

## 9. Money, Amount, Date, and Time Rules

| Rule | Normative requirement | Source |
|---|---|---|
| Event Amount | Every Financial Event Amount MUST be positive whole Rupiah. | PRD §§9, 11; DDT AM-01–03 |
| Opening Balance | MUST be non-negative whole Rupiah. | PRD §§9, 12 |
| Opening Principal | MUST be non-negative whole Rupiah. | PRD §§9, 15 |
| Target Amount | When present, MUST be non-negative whole Rupiah and MUST NOT cap allocation or spending. | PRD §14; DDR DEC-FUND-03 |
| Effective dates | A Financial Event Event Date MUST satisfy every referenced effective-date constraint. The complete rule is cross-boundary because Event Date belongs to Financial Event. | PRD §§12, 15–16; AGG §§7, 11, 14 |
| Date interpretation | Event Date and effective dates MUST use Asia/Jakarta. | PRD §9 |
| Period boundaries | Calendar Month and Custom Monthly Cycle ranges MUST have deterministic inclusive boundaries under the active configuration. | PRD §17; DDT RP-01/02 |
| Timestamps | Created/Updated timestamps MAY provide traceability metadata but MUST NOT determine reporting membership or chronology. | PRD §§11, 17; DDR DEC-ORDER-01 |

Fractional-Rupiah and decimal-rounding behavior is outside the domain because fractional inputs are invalid. [PRD §9]

## 10. Lifecycle State Definitions

| Concept | State | Normative meaning | Source |
|---|---|---|---|
| Account | Active | Selectable for eligible new Financial Events. | PRD §12 |
| Account | Archived | Total Account Balance MUST equal Rp0; identity/history MUST remain resolvable; it MUST NOT be selectable for new events; it MAY be explicitly restored. | PRD §12; DDR DEC-LIFE-01 |
| Account | Permanently Deleted | Exists only after eligible dependency-free deletion; identity is no longer an available domain reference. | PRD §12 |
| Category | Active | Selectable for new matching-kind Income/Expense. | PRD §13 |
| Category | Archived/Hidden | Identity/history MUST remain resolvable; it MUST NOT be selectable for new events; it MAY be restored. | PRD §13; DDR DEC-LIFE-01 |
| Category | Permanently Deleted | Allowed only when unused and dependency-free. | PRD §13 |
| Dedicated Fund | Active | Selectable for eligible Fund operations and Fund-Linked Expense. | PRD §14 |
| Dedicated Fund | Archived | Fund Balance MUST equal Rp0; identity/history MUST remain resolvable; it MUST NOT be selectable for new Fund use; it MAY be restored. | PRD §14; DDR DEC-FUND-01/02 |
| Dedicated Fund | Permanently Deleted | Allowed only at Rp0 with no event history or dependency. | PRD §14 |
| Financial Event | Active | Its complete effect contributes to confirmed state. | PRD §§11, 16 |
| Financial Event | Trashed | Its complete effect is absent. It MUST remain retained, traceable, and eligible for a Restoration attempt indefinitely in v1; an attempt is accepted only when every current and later affected invariant passes. | PRD §16; DDR DEC-LIFE-01–03 |
| Financial Event | Replaced | Old identity/effects remain traceable but do not contribute; the distinct replacement may contribute. | PRD §16; DDR DEC-LIFE-04 |
| Debt Record | Derived Active | Outstanding Principal is greater than Rp0. | DDR DEC-DEBT-02 |
| Debt Record | Derived Paid Off | Outstanding Principal equals Rp0. | DDR DEC-DEBT-02 |

Financial Event manual or automatic permanent deletion MUST NOT exist in v1. Debt status MUST NOT be writable, and Debt Record archive/restore states MUST NOT be introduced. [DDR DEC-LIFE-02/03, DEC-DEBT-02/04]

## 11. Global Invariant Registry

| Invariant ID | Normative Rule | Domain Scope | Local/Cross | State Required | Behaviors | Blocked Outcome | Traceability | Source |
|---|---|---|---|---|---|---|---|---|
| INV-WS-01 | References/effects MUST remain in one Workspace. | Workspace/all | Cross | Owner and references | All | Prior state preserved | Identify foreign reference | PRD §§6, 20 |
| INV-WS-02 | One User MUST own exactly one Workspace. | Workspace | Local | Owner cardinality | WB-01 | No second Workspace | Show cardinality failure | PRD §6 |
| INV-ACC-01 | Total Account Balance MUST remain ≥ Rp0. | Account | Local | Opening state + active effects | AC, IN, EX, TR, FX, DR, CR, LC, RC | No effect confirmed | Show failing point/value | PRD §§9, 11–12 |
| INV-ACC-02 | Unallocated Amount MUST remain ≥ Rp0. | Account | Local | Total + allocations | AC, EX, TR, FA, FR, DR, CR, LC, RC | No effect confirmed | Show shortage | PRD §§9, 11, 14 |
| INV-ACC-03 | Total MUST equal Unallocated plus all backed allocations. | Account | Local | Current pair allocations | AC, FA, FR, FX, CR, LC, RC | No effect confirmed | Reconcile components | PRD §§9, 14 |
| INV-ALLOC-01 | Each Account–Fund allocation MUST remain ≥ Rp0. | Pair | Cross | Pair history | FA, FR, FX, CR, LC, RC | No effect confirmed | Show pair and amount | PRD §14; DDR DEC-ALLOC-01 |
| INV-FUND-01 | Fund Balance MUST equal the sum of all its pair allocations. | Fund/pairs | Cross | All backing pairs | FA, FR, FX, CR, LC, RC, TC-02 | Pre-confirmation: block the proposal and preserve prior confirmed state. Post-hoc: do not retroactively unaccept, reverse, delete, or alter accepted Financial Events or domain state; mark release readiness blocked until resolved. | Show per-Account sum and disagreement case | PRD §14; DDR DEC-ALLOC-03, DEC-TRACE-03 |
| INV-FUND-02 | Fund effects MUST NOT consume another Account’s allocation automatically. | Account/Fund | Cross | Selected pair | FR, FX | No effect confirmed | Name selected/insufficient pair | PRD §14 |
| INV-DEBT-01 | Outstanding Principal MUST remain ≥ Rp0. | Debt | Local | Opening principal + repayments | DB, DR, CR, LC, RC | No effect confirmed | Show remaining principal | PRD §15 |
| INV-DEBT-02 | Repayment principal MUST NOT exceed current Outstanding Principal. | Debt/Event | Cross | Debt before event | DR-01/02, LC-02, RC | No effect confirmed | Show requested/available | PRD §15 |
| INV-DATE-01 | Event Date MUST NOT precede any referenced Account effective date. | Event/Account | Cross | Event Date + Account dates | All Account-referencing events/corrections | No effect confirmed | Show both dates | PRD §§12, 16; AGG §14 |
| INV-DATE-02 | Debt Repayment Event Date MUST NOT precede Debt effective date. | Event/Debt | Cross | Both dates | DR, DB-03, CR, LC, RC | No effect confirmed | Show both dates | PRD §§15–16; AGG §14 |
| INV-TR-01 | Transfer source and destination MUST differ. | Transfer | Local form rule | Two references | TR-01/02 | No event/effect | Identify duplicate reference | DDR DEC-TRANSFER-01 |
| INV-TR-02 | Transfer MUST produce one complete two-sided result. | Event/two Accounts | Cross | Both Account histories | TR, CR, LC, RC | Neither side changes | Reconcile both sides | PRD §11; DDR DEC-AGG-05 |
| INV-FX-01 | Each Fund operation MUST keep Account and Fund meanings reconciled. | Event/Account/Fund | Cross | Pair, Account, Fund | FA, FR, FX, CR, LC, RC | No participant changes | Reconcile all views | PRD §14; DDR DEC-ALLOC-01 |
| INV-DR-01 | Repayment MUST keep Account and Debt meanings reconciled. | Event/Account/Debt | Cross | Both histories | DR, CR, LC, RC | Neither participant changes | Reconcile payment/principal | PRD §§15, 19 |
| INV-XB-01 | Cross-boundary accepted outcomes MUST be all-or-nothing. | All participants | Cross | Complete proposed outcome | All cross-boundary | Prior state preserved | Explain every participant | DDR DEC-AGG-05 |
| INV-BLOCK-01 | A blocked proposal MUST preserve all prior confirmed state. | All | Cross | State snapshot | All | No confirmed mutation | Explain blocker | PRD §16; DDT §5 |
| INV-ORDER-01 | Within one Workspace, every confirmed Event MUST be uniquely ordered after all earlier confirmations; Event Date MUST be primary and immutable position MUST resolve every equal-date tie reproducibly. | Event histories | Cross | Workspace, dates, positions | All chronological; RC-01 | Proposal blocked if a same-date tie remains unresolved | Display Workspace ordering facts | DDR DEC-ORDER-01 |
| INV-HIST-01 | Correction MUST NOT silently remove or exclude an existing event from history. | Event histories | Cross | Existing events + proposal | AC-06/07, DB-02/03, CR, LC, RC | Proposal blocked if validity cannot remain | Identify events becoming valid/invalid | PRD §16; DDR DEC-LIFE-05 |
| INV-ARCH-01 | Archived Account MUST remain at Rp0. | Account | Local/cross on restoration | Account state/effects | AC-03, LC-02 | Archive/restore-event blocked | Show resulting total | PRD §12; DDR DEC-LIFE-01 |
| INV-ARCH-02 | Archived Fund MUST remain at Rp0. | Fund | Local/cross on restoration | Fund state/effects | DF-04, LC-02 | Archive/restore-event blocked | Show resulting balance | PRD §14; DDR DEC-FUND-01, DEC-LIFE-01 |
| INV-REPORT-01 | Workspace Total MUST sum all existing Accounts. | Workspace/Accounts | Cross | All Account totals | AC, TC-01/04, RC | Pre-confirmation: block the proposal and preserve prior confirmed state. Post-hoc: do not retroactively unaccept, reverse, delete, or alter accepted Financial Events or domain state; mark release readiness blocked until resolved. | Reconcile membership and disagreement case | DDR DEC-REPORT-04/05, DEC-TRACE-03 |
| INV-REPORT-02 | Historical totals MUST retain history from Accounts archived later. | Reporting | Cross | Events + lifecycle | AC-03, RP, TC-04 | Pre-confirmation: block the proposal and preserve prior confirmed state. Post-hoc: do not retroactively unaccept, reverse, delete, or alter accepted Financial Events or domain state; mark release readiness blocked until resolved. | Identify included events and disagreement case | DDR DEC-REPORT-03, DEC-TRACE-03 |
| INV-TRACE-01 | If a proposal would predictably make a derived summary disagree with supporting detail, confirmation MUST be blocked and prior confirmed state preserved. If disagreement is discovered post-hoc, accepted Events/state MUST NOT be retroactively unaccepted, reversed, deleted, or altered; release readiness MUST remain blocked until resolved. | Derived views | Cross | Proposed or accepted state, source detail, summary | All, TC-01–05 | Pre-confirmation: proposal blocked; post-hoc: release-readiness blocked with state unchanged | Identify case, sources, and mismatch | PRD §19; DDR DEC-TRACE-03 |
| INV-TRACE-02 | Every important displayed number MUST trace to opening state and active confirmed events. | Derived views | Cross | Sources/effects | TC-01–05 | Pre-confirmation: block the proposal and preserve prior confirmed state. Post-hoc: do not retroactively unaccept, reverse, delete, or alter accepted Financial Events or domain state; mark release readiness blocked until resolved. | Full contribution trail and disagreement case | PRD §19; PI §5; DDR DEC-TRACE-03 |

## 12. Deterministic Chronology Specification

The total chronological order within one Workspace MUST use: (1) Event Date, then (2) immutable confirmation-order position for ties. Every newly confirmed Financial Event MUST receive a position that uniquely orders it after every event confirmed earlier in that Workspace. The position MUST be sufficient to resolve every same-date tie, MUST be assigned when the event first receives confirmed identity, and MUST never change afterward. [DDR DEC-ORDER-01]

Same-Type Edit MUST preserve position even when Event Date changes; the event moves under the proposed date and its unchanged position compares only with events on that date. A newly confirmed backdated event MUST receive a new position after every event already confirmed in the Workspace, even though its earlier Event Date places it earlier chronologically. Restoration MUST reuse the original position. When Replacement is accepted, its new event MUST receive a new position after every event already confirmed in the Workspace. Updated Timestamp MUST NOT participate. Identical confirmed facts MUST always yield one reproducible order with no unresolved same-date tie. [DDR DEC-ORDER-01; PRD §§11, 16]

Architecture may later choose representation; this specification selects no counter, sequence, UUID, column, index, locking, or concurrency mechanism. [DDR DEC-ORDER-01]

## 13. Workspace Specification

### Domain Concept

Workspace is the private owner scope and narrow configuration responsibility for one User. It is not one giant financial Aggregate and does not directly own Account, Fund, Debt, or Event monetary invariants. [PRD §§6, 20; AGG §§6, 23; DDR DEC-AGG-01]

### Normative Identity Rule

One User MUST own exactly one stable Workspace identity; no fact from another Workspace may participate. [PRD §§6, 20]

### Facts, states, and rules

| Template element | Specification |
|---|---|
| Required Facts | Owner; fixed IDR currency; fixed Asia/Jakarta timezone; exactly one active Reporting Period configuration. |
| Optional Facts | Custom Monthly Cycle start day instead of the default Calendar Month. |
| Derived Facts | Workspace Total Balance and reporting totals; neither is directly writable. |
| Lifecycle States | One private owner-scoped existence; no shared/role lifecycle in v1. |
| Local Invariants | One owner; one active reporting configuration. |
| Cross-Boundary Invariants | Full isolation; Workspace Total and reports agree with contributing concepts. |
| Permitted Behaviors | WB-01/02; RP-01–03; TC-04. |
| Blocked Behaviors | Second owner/Workspace, cross-Workspace reference, invalid reporting configuration. |
| Correction Rules | Reporting configuration change regroups history only; it changes no financial fact. |
| Traceability Requirements | Totals expose contributing Accounts/events and exact period ranges. |
| v1 Exclusions | Sharing, invitations, roles, household collaboration, Account total exclusions. |
| Deferred Details | Historical-name/value storage choices do not change Workspace meaning. |
| Source References | PRD §§6, 9, 17, 19–20; DDR DEC-AGG-01/04, DEC-REPORT-02/04/05. |

## 14. Account Specification

### Domain Concept

Account is an identity-bearing money-holding concept with starting state and derived total, unallocated, and Fund-allocation values. Account Type is descriptive and is drawn only from the source-defined product choices; this document adds no values. [PRD §§9, 12; UL §7]

### Normative identity and facts

| Template element | Specification |
|---|---|
| Normative Identity Rule | Identity MUST remain stable through rename, opening-state correction, archive, and restore; Account Name MUST NOT act as identity. [PRD §12; DDR DEC-NAME-01/04] |
| Required Facts | Account Name, Account Type, Opening Balance, Opening-Balance Effective Date. |
| Optional Facts | None added by this specification. |
| Derived Facts | Total Account Balance, Unallocated Amount, current Account–Fund allocation per Fund. |
| Lifecycle States | Active; Archived; eligible Permanent Deletion. |
| Local Invariants | Total and Unallocated MUST remain non-negative; Total MUST equal Unallocated plus allocations. [PRD §§9, 12, 14] |
| Cross-Boundary Invariants | Account provides its Opening-Balance Effective Date against which every referencing Event MUST be validated; the complete date invariant is cross-boundary because Event Date belongs to Financial Event. Allocation and Workspace totals MUST reconcile. [PRD §§12, 16; AGG §§7, 14] |
| Permitted Behaviors | AC-01–07; post-onboarding rename; archive at Rp0; explicit restore; eligible deletion; opening amount/date correction. |
| Blocked Behaviors | Invalid money/date/name; archive above Rp0; deletion after nonzero opening/history/dependency; correction that invalidates any affected point. |
| Correction Rules | Impact Preview is always required for AC-06/07. Effective-date recalculation identifies existing Events that would become valid or invalid; it MUST NOT silently exclude them and MUST block if confirmed date/financial invariants cannot remain valid. [PRD §§12, 16; DDR DEC-LIFE-05] |
| Traceability Requirements | Opening state, all active effects, pair allocations, and derived values remain reconcilable. |
| v1 Exclusions | User-controlled exclusion from Workspace Total. |
| Deferred Details | Identity representation; historical label/value storage. |
| Source References | PRD §§9, 12, 16, 19; DDR DEC-NAME-01/04, DEC-LIFE-05, DEC-REPORT-04/05. |

## 15. Category Specification

### Domain Concept

Category is an independent identity/lifecycle concept classifying Income or Expense. [PRD §13; AGG §9; DDR DEC-AGG-03]

| Template element | Specification |
|---|---|
| Normative Identity Rule | Category identity MUST remain stable through rename, archive/hide, and restore; duplicate labels MUST be accepted. [PRD §13; DDR DEC-NAME-02] |
| Required Facts | Category Name and exactly one Category Kind: Income or Expense. |
| Optional Facts | None added. |
| Derived Facts | Usage/dependency evidence. |
| Lifecycle States | Active; Archived/Hidden; eligible Permanent Deletion. |
| Local Invariants | Kind MUST NOT change after creation; rename MUST NOT reclassify history. [PRD §13] |
| Cross-Boundary Invariants | Income MUST reference Income kind; Expense MUST reference Expense kind; old references remain resolvable. [PRD §§11, 13] |
| Permitted Behaviors | CT-01–05: create, rename, archive/hide, restore, unused deletion. |
| Blocked Behaviors | Invalid kind/name, kind change, deletion with any event history/dependency. Duplicate label MUST NOT block. [PRD §13; DDR DEC-NAME-02] |
| Correction Rules | Event reference change revalidates Category Kind; Category rename changes no Event. |
| Traceability Requirements | Historical events resolve the same Category identity using its current label unless Architecture later elects optional snapshots. |
| v1 Exclusions | No extra Category kinds or uniqueness constraint. |
| Deferred Details | Starter-category presentation/content; optional historical names. |
| Source References | PRD §§11, 13, 19; DDR DEC-NAME-02, DEC-AGG-03, DEC-TRACE-01. |

## 16. Dedicated Fund and Financial Goal Specification

### Domain Concept

Dedicated Fund is a virtual purpose, not an Account: it holds no money independently. Its balance is derived from Account-backed allocations. A Financial Goal is the optional Target Amount plus derived progress/completion and has no independent identity. [PRD §14; UL §8; DDR DEC-FUND-04]

| Template element | Specification |
|---|---|
| Normative Identity Rule | Fund identity MUST remain stable through rename, archive, and restore; duplicate names MUST be accepted. Account–Fund pair identifies an allocation; no lot identity exists. [DDR DEC-NAME-03/05, DEC-ALLOC-02] |
| Required Facts | Fund Name. |
| Optional Facts | Non-negative Target Amount; no Target Date in v1. |
| Derived Facts | Fund Balance and per-Account breakdown. When Target Amount is absent, Goal Progress and Goal Completion are undefined. When Target Amount > Rp0, Goal Progress is Fund Balance / Target Amount and completion is Fund Balance ≥ Target Amount. At Target Amount = Rp0, the ratio is undefined and MUST NOT be calculated, while completion is true because non-negative Fund Balance ≥ Rp0. [PRD §14; DDR DEC-FUND-03/04] |
| Lifecycle States | Active; Archived at Rp0; eligible Permanent Deletion. |
| Local Invariants | Fund Balance MUST equal all pair allocations; Target Amount MUST NOT cap allocation/spending or create writable completion. Target Amount = Rp0 MUST NOT cause a Goal Progress division; Goal Completion remains the approved derived comparison. [PRD §14; DDR DEC-ALLOC-03, DEC-FUND-03/04] |
| Cross-Boundary Invariants | Account protects its pair non-negativity/equation; Fund protects total breakdown/provenance; every Fund operation MUST keep both reconciled as one outcome. [DDR DEC-ALLOC-01, DEC-AGG-05] |
| Permitted Behaviors | DF-01–06; FA/FR/FX; rename; Target change/removal anytime; archive at Rp0; restore; eligible deletion. |
| Blocked Behaviors | Negative target, insufficient pair/unallocated value, nonzero archive, deletion with history/dependency. |
| Correction Rules | Recalculate affected pairs, Accounts, Fund, and later history; accept all or none. |
| Traceability Requirements | Fund Balance MUST expose its per-Account breakdown and contributing active events. [PRD §§14, 19] |
| v1 Exclusions | Target Date, lots/FIFO/LIFO, cross-Account auto-consumption, independent Goal identity. |
| Deferred Details | Target Date is post-MVP; identity/storage representation is not selected. |
| Source References | PRD §§9, 14, 16, 19; DDR DEC-NAME-03/05, DEC-ALLOC-01–03, DEC-FUND-01–05. |

## 17. Debt Record Specification

### Domain Concept

Debt Record represents an opening obligation and its repayment-derived principal, not a borrowing flow. [PRD §15; UL §9]

| Template element | Specification |
|---|---|
| Normative Identity Rule | Debt identity MUST remain stable through opening-state corrections and repayment history. Name is a label; no separate Creditor fact exists. [DDR DEC-DEBT-03] |
| Required Facts | Name, Opening Outstanding Principal, Effective Date. |
| Optional Facts | Note. |
| Derived Facts | Outstanding Principal; status Paid Off at Rp0, Active otherwise. |
| Lifecycle States | No writable Active/Archived lifecycle; status is derived; eligible Permanent Deletion only. |
| Local Invariants | Opening and Outstanding Principal MUST remain non-negative; status MUST NOT be directly edited. [PRD §15; DDR DEC-DEBT-02] |
| Cross-Boundary Invariants | Debt provides its Effective Date; Debt Repayment Event Date belongs to Financial Event, so complete validity is cross-boundary. Repayment MUST also reconcile Account payment and Debt reduction. [PRD §§15–16; AGG §§11, 14] |
| Permitted Behaviors | DB-01–04; DR-01–03; opening principal/date correction; eligible deletion. |
| Blocked Behaviors | Invalid amount/date; repayment beyond principal or Account Unallocated; correction invalidating later state; ineligible deletion. |
| Correction Rules | DB-02/03 always require Impact Preview. Date recalculation identifies existing Debt Repayment Events becoming valid or invalid; none is silently excluded, and the proposal MUST be blocked if confirmed date/financial invariants cannot remain valid. [PRD §§15–16; DDR DEC-LIFE-05] |
| Traceability Requirements | Outstanding Principal reconciles current confirmed opening value and all active repayments. |
| v1 Exclusions | Borrowing/issuance event; separate Creditor field; archive/restore. |
| Deferred Details | Identity and derived-value representation only. |
| Source References | PRD §§8, 15–16, 19; DDR DEC-DEBT-01–04, DEC-LIFE-05. |

Permanent deletion MUST require: current confirmed Opening Outstanding Principal = Rp0; no Debt Repayment has ever referenced the Debt Record; and no other confirmed dependency. It MUST use the current confirmed opening value, not a pre-correction value. [DDR DEC-DEBT-01]

## 18. Financial Event Common Specification

The closed v1 Event Type set is exactly: **Income, Expense, Transfer, Fund Allocation, Fund Release, Debt Repayment**. Any Event Type outside this closed set MUST NOT be accepted. Ordinary Expense and Fund-Linked Expense are forms of Expense, not separate types. [PRD §11; DDR DEC-EXPENSE-01]

Every Financial Event MUST have stable identity, one Event Type, positive whole-Rupiah Amount, Event Date, form-required references, immutable Workspace confirmation-order position, and minimal traceability metadata. That metadata MUST retain at least Created Timestamp, Last Updated Timestamp, current lifecycle/change meaning sufficient to explain edited, Trashed, and Replaced status, and an explicit old-to-new relationship when Event Replacement occurs. Timestamps are traceability metadata: they MUST NOT determine Event Date, reporting membership, or chronological order. [PRD §§9, 11, 16–17, 19; DDR DEC-ORDER-01, DEC-TRACE-02]

Category MUST occur only on Income and Expense. Transfer, Fund Allocation, Fund Release, and Debt Repayment MUST NOT have Category. Every accepted event MUST produce one complete logical result; every blocked proposal MUST produce no confirmed effect. [PRD §11; DDR DEC-AGG-05]

Financial Event owns its identity, form, references, date, and lifecycle facts. Referenced Account, Fund, Category, and Debt concepts provide the facts needed for monetary and reference invariants; no Event alone can validate those cross-boundary rules. [AGG §8; DDR DEC-AGG-02]

## 19. Financial Event Form Specifications

| Form | Event Type | Required References | Forbidden References | Preconditions | Account Total Effect | Account Unallocated Effect | Allocation Effect | Fund Balance Effect | Outstanding Principal Effect | Workspace Total Effect | Reporting Effect | Recalc? | Blocking Conditions | Traceability Outcome | Source |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Income | Income | Destination Account; exactly one Income Category | Fund; Debt; second Account | Positive amount; valid dates/scope/active refs/kind | +Amount | +Amount | None | None | None | +Amount | Income once by Event Date | Potentially — from Event Date onward when later affected state exists | Invalid amount/date/ref/kind/scope | Event→Account/Category/report | PRD §11; DDT IN-01 |
| Ordinary Expense | Expense | Payment Account; exactly one Expense Category | Fund; Debt; second Account | Sufficient Total and Unallocated; valid date/scope/refs | −Amount | −Amount | None | None | None | −Amount | Expense once by Event Date | Potentially — from Event Date onward when later affected state exists | Insufficient total/unallocated; invalid facts | Event→Account/Category/report | PRD §11; DDT EX-01 |
| Transfer | Transfer | Distinct source and destination Accounts | Category; Fund; Debt | Sufficient source Total/Unallocated; both dates/scope valid | Source −; destination + | Source −; destination + | None | None | None | Unchanged | Not Income/Expense | Potentially — from Event Date onward when later affected state exists | Same Account; insufficiency; invalid facts | One event→both sides | PRD §11; DDR DEC-TRANSFER-01 |
| Fund Allocation | Fund Allocation | Account; Dedicated Fund | Category; Debt; second Account | Sufficient Unallocated; valid date/scope/refs | Unchanged | −Amount | Matching pair +Amount | +Amount | None | Unchanged | Allocation effect only | Potentially — from Event Date onward when later affected state exists | Insufficient unallocated; invalid facts | Event→pair/Account/Fund | PRD §14; DDT FA-01 |
| Fund Release | Fund Release | Exact Account–Fund pair | Category; Debt; substitute Account | Sufficient matching pair; valid date/scope/refs | Unchanged | +Amount | Matching pair −Amount | −Amount | None | Unchanged | Release effect only | Potentially — from Event Date onward when later affected state exists | Pair insufficiency even if Fund total suffices | Event→same pair/Account/Fund | PRD §14; DDT FR-01 |
| Fund-Linked Expense | Expense | Payment Account; Expense Category; Dedicated Fund | Debt; second Account | Sufficient Total and matching pair; valid facts | −Amount | Unchanged | Matching pair −Amount | −Amount | None | −Amount | Expense counted once | Potentially — from Event Date onward when later affected state exists | Pair/total insufficiency; cross-Account attempt | Event→Account/Category/Fund/report | PRD §§11, 14; DDT FX-01 |
| Debt Repayment | Debt Repayment | Payment Account; Debt Record | Category; Fund; second Account | Sufficient Total/Unallocated/principal; both effective dates valid | −Amount | −Amount | None | None | −Amount | −Amount | Principal is not Expense | Potentially — from Event Date onward when later affected state exists | Account/principal insufficiency; invalid facts | Event→Account/Debt/report | PRD §§11, 15; DDT DR-01 |

Interest, fees, and penalties MUST be represented by separate Expense events; repayment principal MUST NOT be counted as Expense. Fund Release and Fund-Linked Expense MUST NOT substitute another Account’s allocation, and Fund-Linked Expense MUST NOT consume multiple Accounts. [PRD §§14–15]

## 20. Correction and Event Replacement Specification

### Same-Type Edit

A Same-Type Edit MUST preserve event identity and confirmation position; reverse the old complete effect; validate the permitted proposed fields and old/proposed references; apply the proposed complete effect provisionally; recalculate from the earliest old/new affected point; and accept every effect or none. If blocked, prior confirmed state MUST remain intact. [PRD §16; DDR DEC-ORDER-01, DEC-AGG-05]

For Expense, adding/removing a Fund reference, changing one Fund to another, or changing Account, Category, Amount, or Event Date MUST remain Same-Type Edit because the Event Type remains Expense. [DDR DEC-EXPENSE-01]

### Event Replacement

An Event Type change MUST use Event Replacement. The old identity MUST remain identifiable and marked replaced; the new event MUST receive distinct identity and a new confirmation position; and an explicit old→new relationship MUST exist. Old effects MUST be reversed and new effects applied as one all-or-nothing result, with no double counting. [PRD §16; DDR DEC-ORDER-01, DEC-TRACE-02]

### Impact Preview

Impact Preview MUST always occur for AC-06, AC-07, DB-02, DB-03, and RP-03. It MUST occur for CR-01, CR-02, LC-01, and LC-02 whenever recalculation affects state beyond the directly changed Financial Event. The trigger is a fixed domain rule; presentation is deferred. [DDR DEC-LIFE-05]

### Correction Reason

Correction Reason MAY be captured as descriptive information. Its absence MUST NOT block any behavior. Presentation is not specified. [DDR DEC-LIFE-06]

## 21. Archive, Soft Deletion, Trash, Restoration, and Permanent Deletion Specification

### Financial Event Soft Deletion

Soft Deletion MUST transition Active→Trashed, reverse the complete event effect, recalculate later affected history, and preserve identity and position. It MUST be blocked when reversal would make later confirmed history invalid. [PRD §16; DDR DEC-ORDER-01]

### Financial Event Restoration

Restoration MUST transition Trashed→Active only after current-state revalidation; it MUST reuse identity/position and reapply the complete effect. A blocked Restoration MUST leave the event Trashed and all confirmed state unchanged. [PRD §16; DDR DEC-LIFE-01]

An archived Category alone MUST NOT block Restoration. Restoration against an archived Account is permitted only if the resulting Account remains validly archived at Rp0; against an archived Fund only if the resulting Fund remains archived at Rp0. Otherwise the Account/Fund MUST be explicitly restored first. Event Restoration MUST NOT implicitly restore any referenced concept. [DDR DEC-LIFE-01]

### Trash

Trash MUST have no automatic expiry, automatic permanent deletion, or manual permanent deletion in v1. A Trashed Financial Event MUST remain retained, traceable, and eligible for a Restoration attempt indefinitely. This does not guarantee acceptance: every attempt MUST satisfy current reference existence, lifecycle eligibility, effective-date validity, monetary invariants, archived-state invariants, and every later affected chronological point. A blocked attempt MUST leave the event Trashed. [DDR DEC-LIFE-01–03]

### Reference-concept deletion

| Concept | Permanent-deletion eligibility | Source |
|---|---|---|
| Account | Opening Balance MUST equal Rp0 and no financial history or other dependency may exist. | PRD §12 |
| Category | It MUST be unused and dependency-free. | PRD §13 |
| Dedicated Fund | Fund Balance MUST equal Rp0 and no Financial Event history or dependency may exist. | PRD §14 |
| Debt Record | Current confirmed Opening Outstanding Principal MUST equal Rp0; no Debt Repayment may ever have referenced it; no other confirmed dependency may exist. | DDR DEC-DEBT-01 |

## 22. Reporting Period and Derived Reporting Specification

Calendar Month MUST be default. A Custom Monthly Cycle MAY be active with start day 1–28, but exactly one Workspace-owned Reporting Period configuration MUST be active. [PRD §17; DDR DEC-AGG-04, DEC-REPORT-02]

A configuration change MUST apply retroactively to all historical Event Dates and MUST require Impact Preview. It MUST NOT alter Event Dates, event financial effects, Account balances, allocations, Fund Balance, or Outstanding Principal; only period membership and derived reporting totals change. Exact period ranges and source-required Incomplete Period state MUST be exposed deterministically. [PRD §17; DDR DEC-REPORT-01, DEC-LIFE-05]

Workspace Total Balance MUST equal all existing Accounts’ Total Account Balances, including archived Accounts as members; archived Accounts contribute Rp0. No user-controlled exclusion MUST exist. Historical totals MUST continue to include events from Accounts archived later. [DDR DEC-REPORT-03/04/05]

One-off arbitrary reporting ranges MUST NOT exist in v1 and remain post-MVP. [DDR DEC-REPORT-06]

## 23. Chronological Recalculation Specification

The following is a normative domain evaluation sequence, not implementation pseudocode. [PRD §§16, 19; DDT RC-01]

1. Identify the proposed behavior and current confirmed state.
2. Identify old and proposed affected references.
3. Determine the earliest affected chronological point.
4. Build affected ordering within the Workspace from Event Date plus the immutable position that uniquely resolves every same-date tie.
5. Reverse old effects when correction, deletion, or replacement requires it.
6. Apply proposed effects provisionally.
7. Reevaluate only affected Account, Account–Fund, Fund, Debt, and reporting histories.
8. At every chronological point, validate all applicable local invariants.
9. At every relevant point, validate all cross-boundary invariants.
10. Validate archived-state invariants.
11. Validate reporting/detail consistency.
12. Accept the complete result only if every point passes.
13. Otherwise block the proposal and preserve all previously confirmed state.
14. Produce traceability facts explaining affected state and applicable blockers without fixing presentation priority.

This procedure MUST apply to backdated creation, Same-Type Edit, Event Replacement, Soft Deletion, Restoration, Opening Balance correction, Account effective-date correction, Opening Principal correction, and Debt effective-date correction. The final state alone MUST NOT substitute for validating every affected historical point. Existing Financial Events MUST NOT be silently excluded; proposed effective-date changes identify events that become valid or invalid and are blocked if confirmed invariants cannot remain valid. [PRD §16; AGG §13; DDR DEC-LIFE-05]

No event-sourcing, replay, transaction, or coordination Architecture is selected. [PRD §16; AGG §21]

## 24. Traceability and Cross-View Consistency Specification

Every important displayed number MUST reconcile to opening state and active confirmed Financial Events. Account, Fund, Debt, Workspace, reporting, Dashboard, and detail views MUST use the same domain meaning and membership. Exactly two disagreement cases apply. If accepting a proposal would predictably produce disagreement, confirmation MUST be blocked and all prior confirmed state preserved. If disagreement is discovered after state was accepted, the accepted Financial Event and domain state MUST NOT be retroactively unaccepted, reversed, deleted, or altered; the disagreement MUST instead be classified as release-readiness blocking until resolved. This rule introduces no automatic rollback, runtime output suppression, automatic display hiding, retry, or monitoring behavior. [PRD §19; PI §5; DDR DEC-TRACE-03]

Traceability MUST retain stable identities, current resolvable names, Event Date, Workspace confirmation position, event effects, Created Timestamp, Last Updated Timestamp, current lifecycle/change meaning sufficient to explain edited, Trashed, and Replaced status, and an explicit old-to-new replacement relationship when Replacement occurs. Timestamps MUST remain traceability metadata and MUST NOT determine Event Date, report membership, or chronology. Prior Same-Type Edit field-value history and event-time historical-name storage beyond this minimum remain Architecture choices; historical-name snapshots are not a v1 domain requirement. [PRD §§16, 19; DDR DEC-TRACE-01/02]

All applicable blockers MUST be evaluated. The order or phrasing in which blockers are presented is not a domain decision. [DDR DEC-REJECT-01]

## 25. Formula and Derived-Value Registry

| Formula ID | Name | Expression | Inputs | Excluded Inputs | Recalculation Triggers | Non-Negativity | Traceability | Source |
|---|---|---|---|---|---|---|---|---|
| FORM-ACC-01 | Account Balance Equation | Total Account Balance = Unallocated Amount + Σ current Account-Backed Fund Allocations backed by that Account | Opening Balance; active Account effects; pair allocations | Target Amount; timestamps | Any Account/FA/FR/FX correction/lifecycle change | Every component MUST be ≥ Rp0 | Reconcile opening, events, pairs | PRD §§9, 12, 14 |
| FORM-FUND-01 | Dedicated Fund Balance | Fund Balance = Σ current Account-Backed Fund Allocations for the Fund across all Accounts | Active FA/FR/FX effects by pair | Target Amount; allocation lots | Any FA/FR/FX correction/lifecycle change | Fund and each pair MUST be ≥ Rp0 | Per-Account breakdown to events | PRD §14; DDR DEC-ALLOC-03 |
| FORM-DEBT-01 | Outstanding Principal | Outstanding Principal = current confirmed Opening Outstanding Principal − Σ active Debt Repayment principal effects | Current opening value; active repayments | Replaced/Trashed effects; Expense totals | DB-02/03; DR correction/lifecycle | Result MUST be ≥ Rp0 | Opening value and every repayment | PRD §15; DDR DEC-DEBT-01/02 |
| FORM-WS-01 | Workspace Total Balance | Workspace Total = Σ Total Account Balance across all existing Workspace Accounts | Every existing active/archived Account | Deleted Accounts; exclusion toggles | Any Account-total or membership change | Sum is non-negative | Full Account membership | DDR DEC-REPORT-04/05 |
| FORM-GOAL-01 | Goal Progress and Completion | Target absent: Progress and Completion undefined. Target > Rp0: Progress = Fund Balance / Target Amount; Completion = (Fund Balance ≥ Target Amount). Target = Rp0: ratio MUST NOT be calculated; Completion = true because Fund Balance ≥ Rp0. | Fund Balance; optional Target Amount | Target Date; writable completion; ratio at Target Rp0 | Fund Balance or Target change | Inputs MUST be non-negative | Show target presence/value, balance, and comparison | PRD §14; DDR DEC-FUND-03/04 |
| FORM-REPORT-01 | Reporting Totals | Totals = active Financial Event effects grouped by Event Date under the one active Reporting Period configuration | Active events; dates; current configuration | Created/Updated timestamps; Trashed/replaced-old effects | Event lifecycle/correction; RP-03 | Component domain invariants apply | Exact range and contributing events | PRD §17; DDR DEC-REPORT-01 |

These formulas specify domain equivalence only and do not prescribe stored versus computed representation. [DDR DEC-ALLOC-03; AGG §23]

## 26. Behavior Conformance Matrix

“Block; preserve” means reject the proposal and preserve all prior confirmed state. “Affected history” means §23’s deterministic scope. [PRD §16; DDR DEC-AGG-05]

| Behavior ID | Domain Behavior | v1 Status | Section | Required Preconditions | Accepted Outcome | Blocked Outcome | Recalculation Scope | Traceability | Session 21 Decision | Deferred Detail | Source |
|---|---|---|---|---|---|---|---|---|---|---|---|
| WB-01 | Establish Single-Owner Workspace | Supported | §§7,13 | Verified owner; none exists | One isolated Workspace | Block; preserve | None | Owner/cardinality | DEC-AGG-01 | Identity mechanics | DBC WB-01; PRD §6 |
| WB-02 | Establish Initial Workspace Configuration | Supported | §§7,13,22 | Valid fixed defaults | One active configuration | Block; preserve | None | Config facts | DEC-AGG-04, REPORT-02 | Presentation | DBC WB-02; PRD §§9,17 |
| AC-01 | Establish Account Opening State | Supported | §§9,14 | Valid name/type/amount/date/scope | Account and derived values | Block; preserve | None — establishes the Account opening baseline. Derived Workspace Total is updated, but no existing financial history is chronologically recalculated. | Opening derivation | DEC-NAME-01 | Identity representation | DBC AC-01; PRD §12 |
| AC-02 | Rename Account | Supported | §§8,14 | Existing Account; valid label | Same identity, new label | Block; preserve | None | Identity continuity | DEC-NAME-01/04 | Historical names | DBC AC-02; DDR |
| AC-03 | Archive Account | Supported | §§10,14,21 | Active; Total Rp0 | Archived, history intact | Block if nonzero | None | Lifecycle/history | DEC-REPORT-03/04 | Presentation | DBC AC-03; PRD §12 |
| AC-04 | Restore Archived Account | Supported | §§10,14,21 | Archived; valid scope | Active, no money change | Block; preserve | None | Same identity | DEC-LIFE-01 | Presentation | DBC AC-04; PRD §12 |
| AC-05 | Permanently Delete Account | Supported | §§14,21 | Opening Rp0; no history/dependency | Deleted | Block; preserve | Membership only | Eligibility evidence | — | Metadata retention | DBC AC-05; PRD §12 |
| AC-06 | Correct Opening Balance | Supported | §§14,20,23 | Preview; every affected point valid | New opening; recalculated history | Block; preserve | All later affected state | Before/after impact | DEC-LIFE-05 | Preview presentation | DBC AC-06; PRD §§12,16 |
| AC-07 | Correct Opening-Balance Effective Date | Supported | §§14,20,23 | Preview; all event dates/invariants valid | New date; history retained | Block; preserve | Referencing/later history | Valid/invalid events | DEC-LIFE-05 | Coordination mechanism | DBC AC-07; PRD §§12,16 |
| IN-01 | Record Income | Supported | §§18–19 | Valid Account/date/Income Category/amount | Complete Income effect | Block; preserve | Later Account/reporting | Event effects | DEC-ORDER-01 | Presentation | DBC IN-01; PRD §11 |
| EX-01 | Record Ordinary Expense | Supported | §§18–19 | Sufficient Total/Unallocated; valid facts | Complete Expense effect | Block; preserve | Later Account/reporting | Event effects | DEC-EXPENSE-01 | Presentation | DBC EX-01; PRD §11 |
| TR-01 | Record Transfer | Supported | §§18–19 | Distinct Accounts; source sufficient | Complete two-sided transfer | Block; preserve | Both Account histories | Both sides | DEC-TRANSFER-01 | Presentation | DBC TR-01; PRD §11 |
| TR-02 | Correct Transfer | Supported | §§19–20,23 | Proposed facts and later histories valid | Same identity; complete new effect | Block; preserve | Old/new Accounts | Old/new effects | DEC-ORDER-01 | Preview presentation if triggered | DBC TR-02; PRD §16 |
| TR-03 | Delete or Restore Transfer | Supported | §§21,23 | Complete reversal/reapply remains valid | Trashed/Active transition | Block; preserve | Both Account histories | Lifecycle/both sides | DEC-LIFE-01/02 | Trash presentation | DBC TR-03; PRD §16 |
| FA-01 | Allocate Account Money | Supported | §19 | Sufficient Unallocated; valid pair | Unallocated−, pair/Fund+ | Block; preserve | Account/pair/Fund | Reconcile all | DEC-ALLOC-01/02 | Structural representation | DBC FA-01; PRD §14 |
| FA-02 | Correct Fund Allocation | Supported | §§19–20,23 | Old/new pairs and history valid | Same identity; corrected effects | Block; preserve | Old/new Account/Fund histories | Pair provenance | DEC-ALLOC-01 | Preview presentation if triggered | DBC FA-02; PRD §16 |
| FR-01 | Release Fund Allocation | Supported | §19 | Exact pair sufficient | Pair/Fund−, Unallocated+ | Block; preserve | Account/pair/Fund | Exact pair | DEC-ALLOC-01/02 | Presentation | DBC FR-01; PRD §14 |
| FR-02 | Correct Fund Release | Supported | §§19–20,23 | Proposed pair/history valid | Same identity; corrected release | Block; preserve | Old/new Account/Fund histories | Pair provenance | DEC-ALLOC-01 | Preview presentation if triggered | DBC FR-02; PRD §16 |
| FX-01 | Record Fund-Linked Expense | Supported | §19 | Matching pair/Total sufficient; valid Expense facts | Total/pair/Fund−; Unallocated unchanged | Block; preserve | Account/pair/Fund/report | Single Expense/provenance | DEC-ALLOC-01 | Presentation | DBC FX-01; PRD §14 |
| FX-02 | Correct Fund-Linked Expense | Supported | §§19–20,23 | Proposed Expense form/history valid | Same Expense identity/form effects | Block; preserve | Old/new references/histories | Old/new form | DEC-EXPENSE-01 | Prior values | DBC FX-02; DDR |
| CT-01 | Establish Category | Supported | §15 | Valid name and kind | Active Category | Block; preserve | None | Identity/kind | DEC-NAME-02, AGG-03 | Starter content | DBC CT-01; PRD §13 |
| CT-02 | Rename Category | Supported | §§8,15 | Existing; valid label | Same identity/kind | Block; preserve | None | Identity continuity | DEC-NAME-02 | Historical names | DBC CT-02; PRD §13 |
| CT-03 | Archive/Hide Category | Supported | §§10,15,21 | Active | Archived; history intact | Block; preserve | None | Reference continuity | DEC-LIFE-01 | Terminology | DBC CT-03; PRD §13 |
| CT-04 | Restore Category | Supported | §§10,15,21 | Archived | Active; no money change | Block; preserve | None | Same identity | DEC-LIFE-01 | Presentation | DBC CT-04; PRD §13 |
| CT-05 | Permanently Delete Category | Supported | §§15,21 | Unused; dependency-free | Deleted | Block; preserve | None | Eligibility evidence | DEC-AGG-03 | Metadata retention | DBC CT-05; PRD §13 |
| DF-01 | Establish Dedicated Fund | Supported | §16 | Valid name/optional target | Active Fund at Rp0 | Block; preserve | None | Identity/target | DEC-NAME-03, FUND-04/05 | Target Date post-MVP | DBC DF-01; PRD §14 |
| DF-02 | Rename Dedicated Fund | Supported | §§8,16 | Existing; valid label | Same identity/history | Block; preserve | None | Identity continuity | DEC-NAME-03/05 | Historical names | DBC DF-02; DDR |
| DF-03 | Set/Change Target Amount | Supported | §16 | Valid optional target | Target changed; money unchanged | Block; preserve | Goal derivation | Balance/target | DEC-FUND-03/04 | Target Date post-MVP | DBC DF-03; DDR |
| DF-04 | Archive Dedicated Fund | Supported | §§10,16,21 | Active; Fund Balance Rp0 | Archived, history intact | Block if nonzero | None | Balance/breakdown | DEC-FUND-01 | Presentation | DBC DF-04; DDR |
| DF-05 | Restore Dedicated Fund | Supported | §§10,16,21 | Archived; valid scope | Active, no money change | Block; preserve | None | Same identity | DEC-FUND-02 | Presentation | DBC DF-05; DDR |
| DF-06 | Permanently Delete Dedicated Fund | Supported | §§16,21 | Rp0; no event/dependency | Deleted | Block; preserve | None | Eligibility evidence | DEC-FUND-01 | Metadata retention | DBC DF-06; PRD §14 |
| DB-01 | Establish Opening Debt Record | Supported | §§9,17 | Valid name/principal/date | Debt with derived status | Block; preserve | None | Opening derivation | DEC-DEBT-02/03 | Identity representation | DBC DB-01; PRD §15 |
| DB-02 | Correct Opening Principal | Supported | §§17,20,23 | Preview; every affected point valid | New opening; repayment history retained | Block; preserve | Later Debt/reporting | Before/after impact | DEC-LIFE-05 | Preview presentation | DBC DB-02; PRD §§15,16 |
| DB-03 | Correct Debt Effective Date | Supported | §§17,20,23 | Preview; all repayment dates/invariants valid | New date; history retained | Block; preserve | Repayment/later history | Valid/invalid events | DEC-LIFE-05 | Coordination mechanism | DBC DB-03; PRD §§15,16 |
| DB-04 | Permanently Delete Debt Record | Supported | §§17,21 | Current opening Rp0; never repaid; no dependency | Deleted | Block; preserve | None | Three eligibility facts | DEC-DEBT-01 | Metadata retention | DBC DB-04; DDR |
| DR-01 | Record Debt Repayment | Supported | §19 | Account and principal sufficient; dates valid | Account/Unallocated/principal− | Block; preserve | Account/Debt/reporting | Payment/principal | DEC-AGG-05 | Presentation | DBC DR-01; PRD §15 |
| DR-02 | Correct Debt Repayment | Supported | §§19–20,23 | Proposed references/history valid | Same identity; corrected effects | Block; preserve | Old/new Account/Debt | Old/new effects | DEC-ORDER-01 | Prior values | DBC DR-02; PRD §16 |
| DR-03 | Delete/Restore Debt Repayment | Supported | §§21,23 | Complete reversal/reapply valid | Trashed/Active transition | Block; preserve | Account/Debt histories | Lifecycle/effects | DEC-LIFE-01/02 | Trash presentation | DBC DR-03; PRD §16 |
| CR-01 | Same-Type Edit Event | Supported | §§20,23 | Allowed fields; old/new histories valid; preview if triggered | Same identity/position; corrected result | Block; preserve | Earliest old/new point | Old/new effects | DEC-EXPENSE-01, ORDER-01, LIFE-05 | Prior-value depth | DBC CR-01; DDR |
| CR-02 | Replace Event Type | Supported | §§20,23 | New form and all histories valid; preview if triggered | Old replaced; distinct new event | Block; preserve | Earliest old/new point | Replacement link | DEC-LIFE-04/05, TRACE-02 | List placement | DBC CR-02; PRD §16 |
| CR-03 | Preview Correction Impact | Supported | §20 | Proposed correction facts | Affected facts exposed before confirmation | No confirmation | Evaluation scope | Affected records/blockers | DEC-LIFE-05/06 | Presentation | DBC CR-03; DDR |
| LC-01 | Soft Delete Event | Supported | §§21,23 | Reversal keeps later history valid; preview if triggered | Active→Trashed; effects reversed | Block; preserve | Later affected history | Lifecycle/reversal | DEC-LIFE-02/05 | Presentation | DBC LC-01; PRD §16 |
| LC-02 | Restore Event | Supported | §§21,23 | Current refs/date/sufficiency/later state valid; preview if triggered | Trashed→Active; complete effect | Remains Trashed | Later affected history | Reapplication/blocker | DEC-LIFE-01/02/05 | Presentation | DBC LC-02; DDR |
| LC-03 | Permanently Delete Trashed Event | Excluded from v1 | §§10,21,31 | None | No accept path | Behavior not offered | None | Indefinite retention, traceability, and Restoration-attempt eligibility | DEC-LIFE-02/03 | Post-MVP retention | DBC LC-03; DDR |
| LC-04 | Archive Domain Reference | Supported | §§10,21,27 | Concept-specific eligibility | Archived/Hidden | Block; preserve | None | Eligibility/history | DEC-FUND-01 | Presentation | DBC LC-04; PRD §§12–14 |
| LC-05 | Restore Archived Domain Reference | Supported | §§10,21,27 | Concept archived; scope valid | Active; no direct financial effect | Block; preserve | None | Identity continuity | DEC-FUND-02, LIFE-01 | Presentation | DBC LC-05; DDR |
| RP-01 | Use Calendar Month | Supported | §22 | Valid Workspace | Default active ranges | Block; preserve | Defines reporting membership only; no financial Chronological Recalculation. A change between established configurations is RP-03. | Exact ranges | DEC-REPORT-02 | Presentation | DBC RP-01; PRD §17 |
| RP-02 | Use Custom Monthly Cycle | Supported | §22 | Start day 1–28 | One active monthly cycle | Block; preserve | Defines reporting membership only; no financial Chronological Recalculation. A change between established configurations is RP-03. | Exact ranges | DEC-REPORT-02 | One-off ranges post-MVP | DBC RP-02; PRD §17 |
| RP-03 | Change Reporting Configuration | Supported | §§20,22–23 | Valid config; Impact Preview | Full retroactive regrouping | Block; preserve | All historical reporting | Old/new ranges/membership | DEC-REPORT-01/02, LIFE-05 | Preview presentation | DBC RP-03; DDR |
| RC-01 | Recalculate Affected State | Supported | §23 | Deterministic ordering; complete affected facts | Every point/invariant valid | Block; preserve | Earliest point onward | Recalculation explanation | DEC-ORDER-01, AGG-05 | Coordination mechanism | DBC RC-01; PRD §16 |
| TC-01 | Explain Account Values | Supported | §§24–25 | Confirmed source facts | Reconciled total/unallocated | Pre-confirmation mismatch: proposed confirmation blocked and prior state preserved. Post-hoc mismatch: release-readiness blocked; accepted state unchanged. | None | Opening/events/pairs and disagreement case | DEC-REPORT-04/05, TRACE-03 | Presentation | DBC TC-01; PRD §19 |
| TC-02 | Explain Fund Balance | Supported | §§24–25 | Confirmed pair/event facts | Reconciled balance/breakdown | Pre-confirmation mismatch: proposed confirmation blocked and prior state preserved. Post-hoc mismatch: release-readiness blocked; accepted state unchanged. | None | Per-Account provenance and disagreement case | DEC-ALLOC-03, TRACE-03 | Presentation | DBC TC-02; PRD §§14,19 |
| TC-03 | Explain Outstanding Principal | Supported | §§24–25 | Opening and repayment facts | Reconciled principal | Pre-confirmation mismatch: proposed confirmation blocked and prior state preserved. Post-hoc mismatch: release-readiness blocked; accepted state unchanged. | None | Opening/repayments and disagreement case | DEC-DEBT-02, TRACE-03 | Presentation | DBC TC-03; PRD §19 |
| TC-04 | Explain Workspace/Reports | Supported | §§22,24–25 | Complete Account/event membership | Reconciled totals/ranges | Pre-confirmation mismatch: proposed confirmation blocked and prior state preserved. Post-hoc mismatch: release-readiness blocked; accepted state unchanged. | None | Contributors/ranges and disagreement case | DEC-REPORT-03–05, TRACE-03 | Presentation | DBC TC-04; PRD §§17,19 |
| TC-05 | Explain Event Effects | Supported | §§18–20,24 | Event/form/reference facts | Complete effect explanation | Pre-confirmation mismatch: proposed confirmation blocked and prior state preserved. Post-hoc mismatch: release-readiness blocked; accepted state unchanged. | None | Identity/lifecycle/effects and disagreement case | DEC-TRACE-01–03 | Historical storage/display | DBC TC-05; PRD §19 |

## 27. State Transition Matrix

| Concept | Current State | Behavior | Preconditions | Next State | Financial Effect | Recalculation | Blocked Outcome | Identity Preserved? | Source |
|---|---|---|---|---|---|---|---|---|---|
| Account | None | AC-01 create | Valid opening facts/scope | Active | Establish opening state | None — establishes the Account opening baseline. Derived Workspace Total is updated, but no existing financial history is chronologically recalculated. | No Account | New identity | PRD §12 |
| Account | Active | AC-03 archive | Total = Rp0 | Archived | None | None | Remains Active | Yes | PRD §12 |
| Account | Archived | AC-04 restore | Valid scope | Active | None | None | Remains Archived | Yes | PRD §12 |
| Account | Active/Archived | AC-05 delete | Opening Rp0; no history/dependency | Deleted | None | None — Account membership changes, but no financial history is chronologically recalculated. | Unchanged | No continuing identity | PRD §12 |
| Category | None | CT-01 create | Valid name/kind | Active | None | None | No Category | New identity | PRD §13 |
| Category | Active | CT-03 archive/hide | Valid lifecycle | Archived/Hidden | None | None | Remains Active | Yes | PRD §13 |
| Category | Archived/Hidden | CT-04 restore | Valid scope | Active | None | None | Remains Archived | Yes | PRD §13 |
| Category | Active/Archived | CT-05 delete | Unused/dependency-free | Deleted | None | None | Unchanged | No continuing identity | PRD §13 |
| Dedicated Fund | None | DF-01 create | Valid name/target | Active | Balance starts Rp0 | None | No Fund | New identity | PRD §14 |
| Dedicated Fund | Active | DF-04 archive | Fund Balance = Rp0 | Archived | None | None | Remains Active | Yes | DDR DEC-FUND-01 |
| Dedicated Fund | Archived | DF-05 restore | Valid scope | Active | None | None | Remains Archived | Yes | DDR DEC-FUND-02 |
| Dedicated Fund | Active/Archived | DF-06 delete | Rp0; no history/dependency | Deleted | None | None | Unchanged | No continuing identity | PRD §14 |
| Financial Event | None | Confirm event | All form/cross-boundary rules pass | Active | Complete form effect | Potentially — from Event Date onward when later affected state exists. | No event | New identity/position | PRD §§11,16 |
| Financial Event | Active | LC-01 soft delete | Complete reversal remains valid | Trashed | Reverse complete effect | Later history | Remains Active | Yes | PRD §16 |
| Financial Event | Trashed | LC-02 restore | Reapplication remains valid | Active | Reapply complete effect | Later history | Remains Trashed | Yes | PRD §16; DDR DEC-LIFE-01 |
| Financial Event | Active | CR-02 replacement | Complete old/new result valid | Old: Replaced; new: Active | Reverse old/apply new | Old/new history | Old remains Active; no new event | Old yes; new distinct | PRD §16 |
| Financial Event | Trashed | LC-03 permanent delete | No v1 precondition exists | No transition | None | None | Remains Trashed | Yes | DDR DEC-LIFE-03 |
| Debt Record | None | DB-01 create | Valid opening facts | Derived Active or Paid Off | Establish principal | None | No Debt | New identity | PRD §15 |
| Debt Record | Any derived status | DB/DR behavior | Confirmed principal determines status | Re-derived Active/Paid Off | Per accepted behavior | Affected Debt history | Prior status/value | Yes | DDR DEC-DEBT-02 |
| Debt Record | Any | Archive/restore | Excluded | No transition | None | None | Unchanged | Yes | DDR DEC-DEBT-04 |
| Debt Record | Derived Paid Off | DB-04 delete | Current opening Rp0; never repaid; no dependency | Deleted | None | None | Unchanged | No continuing identity | DDR DEC-DEBT-01 |

## 28. Blocking Condition Registry

Every relevant condition below MUST be evaluated; presentation priority is not fixed. A blocked outcome MUST preserve prior confirmed state. [DDR DEC-REJECT-01; DDT §5]

| Blocking ID | Domain Condition | Behaviors | Required Facts | Invariant | Blocked Outcome | Recalculation Consequence | Traceability Explanation | Priority Fixed? | Source |
|---|---|---|---|---|---|---|---|---|---|
| BLK-01 | Wrong Workspace scope | All cross-boundary | Owner/reference scope | INV-WS-01 | No effect | Stop acceptance | Identify foreign scope | No | PRD §20 |
| BLK-02 | Missing reference | All reference behaviors | Required refs | Form/reference validity | No effect | Cannot build history | Name missing role | No | PRD §11 |
| BLK-03 | Archived/deleted reference ineligible | New events/restoration | Lifecycle states | Lifecycle rules | No effect | Current event unchanged | Identify reference/state | No | PRD §§12–14; DDR LIFE-01 |
| BLK-04 | Invalid Event Type shape | IN/EX/TR/FA/FR/FX/DR, CR | Type/form facts | Closed form set | No event/effect | None | Name forbidden/missing fact | No | PRD §11 |
| BLK-05 | Wrong Category Kind | IN/EX/FX, CR/LC | Category kind | Kind match | No effect | None | Expected/actual kind | No | PRD §§11,13 |
| BLK-06 | Event Date before Account effective date | Account-ref events/corrections | Both dates | INV-DATE-01 | No effect | Proposed date blocked | Show dates/Account | No | PRD §§12,16 |
| BLK-07 | Repayment Date before Debt effective date | DR, DB-03, CR/LC | Both dates | INV-DATE-02 | No effect | Proposed date blocked | Show dates/Debt | No | PRD §§15,16 |
| BLK-08 | Non-positive Event Amount | All events/corrections | Amount | Money rule | No effect | None | Show invalid amount | No | PRD §§9,11 |
| BLK-09 | Fractional Rupiah | All money behaviors | Amount | Whole-Rupiah rule | No effect | None | Show fraction | No | PRD §9 |
| BLK-10 | Insufficient Total Account Balance | EX/TR/FX/DR, corrections | Total before effect | INV-ACC-01 | No effect | Failing point blocks | Required/available | No | PRD §§11–12 |
| BLK-11 | Insufficient Unallocated Amount | EX/TR/FA/DR, corrections | Unallocated before effect | INV-ACC-02 | No effect | Failing point blocks | Required/available | No | PRD §§11,14–15 |
| BLK-12 | Insufficient matching pair allocation | FR/FX, corrections | Selected pair | INV-ALLOC-01/02 | No effect | Failing point blocks | Pair and shortage | No | PRD §14 |
| BLK-13 | Insufficient Outstanding Principal | DR, corrections | Principal before effect | INV-DEBT-01/02 | No effect | Failing point blocks | Requested/remaining | No | PRD §15 |
| BLK-14 | Same source/destination Transfer | TR-01/02 | Both Accounts | INV-TR-01 | No event/effect | None | Identify same Account | No | DDR DEC-TRANSFER-01 |
| BLK-15 | Archive nonzero Account | AC-03, LC-04 | Current Total | INV-ARCH-01 | Remains Active | None | Show Total | No | PRD §12 |
| BLK-16 | Archive nonzero Fund | DF-04, LC-04 | Current Fund Balance | INV-ARCH-02 | Remains Active | None | Show Fund/breakdown | No | DDR DEC-FUND-01 |
| BLK-17 | Delete with history/dependency | AC/CT/DF/DB deletion | Opening/current/dependencies | Deletion eligibility | Remains present | None | Failed eligibility fact | No | PRD §§12–15; DDR DEBT-01 |
| BLK-18 | Restoration violates archived Account/Fund Rp0 | LC-02 | Archived state + provisional effect | INV-ARCH-01/02 | Event remains Trashed | No accepted recalculation | Resulting balance | No | DDR DEC-LIFE-01 |
| BLK-19 | Correction invalidates later state | AC/DB/CR/LC/RC | Ordered affected history | All invariants | Prior state preserved | Whole proposal rejected | Failing event/point | No | PRD §16 |
| BLK-20 | Chronology not deterministic | All chronological/RC | Workspace, Event Dates, confirmation positions | INV-ORDER-01 | No effect; proposal blocked if any same-date tie is unresolved | No accepted recalculation | Identify events and missing/non-unique ordering fact | No | DDR DEC-ORDER-01 |
| BLK-21 | Derived summary/detail disagreement | All proposed confirmations; TC-01–05 | Proposal/accepted state, derived summary, supporting detail | INV-TRACE-01 | Pre-confirmation: block proposal and preserve prior state. Post-hoc: keep accepted state unchanged and mark release readiness blocked until resolved. | No automatic reversal or accepted-state alteration | Identify pre-confirmation or post-hoc case, mismatch, and sources | No | PRD §19; DDR DEC-TRACE-03 |
| BLK-22 | Negative Opening Balance | AC-01, AC-06 | Proposed Opening Balance | Opening Balance ≥ Rp0 | Block Account establishment/correction; preserve prior state | No existing history recalculated for blocked proposal | Show proposed negative value | No | PRD §§9, 12 |
| BLK-23 | Negative Opening Outstanding Principal | DB-01, DB-02 | Proposed opening principal | Opening Outstanding Principal ≥ Rp0 | Block Debt establishment/correction; preserve prior state | No accepted Debt recalculation | Show proposed negative value | No | PRD §§9, 15 |
| BLK-24 | Negative Target Amount | DF-01, DF-03 | Proposed optional Target Amount | Target Amount absent or ≥ Rp0 | Block Fund establishment/target change; preserve prior state | No accepted goal re-derivation | Show proposed negative target | No | PRD §14; DDR DEC-FUND-03 |
| BLK-25 | Custom Monthly Cycle start day outside 1–28 | WB-02, RP-02, RP-03 | Proposed start day and configuration | Start day 1–28; one active configuration | Block configuration establishment/change; preserve prior state | No reporting regrouping accepted | Show invalid day and valid range | No | PRD §17; DDR DEC-REPORT-02 |
| BLK-26 | Required Impact Preview not completed | AC-06/07, DB-02/03, RP-03; conditional CR-01/02, LC-01/02 | Behavior, affected scope, preview completion | Fixed preview trigger | Block confirmation; preserve prior state | No proposed recalculation accepted | Identify trigger and incomplete preview | No | DDR DEC-LIFE-05 |

## 29. Executable Acceptance Examples

All dates are Asia/Jakarta domain dates and all amounts are whole Rupiah. `p1`, `p2`, … denote immutable confirmation positions, not a technical representation. [PRD §9; DDR DEC-ORDER-01]

| Example ID | Initial State | Proposed Behavior | Date / Order | Preconditions Evaluated | Before | Provisional Effects | Invariants | Result | After | Recalculation Scope | Traceability | Source |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| EXAMPLE-01 | No Account | AC-01 opening Rp0 | Effective 2026-01-01 | Valid IDR/name/type/date | — | Total 0; Unallocated 0 | ACC-01–03 | Accepted | T0/U0 | None — establishes the opening baseline; derived Workspace Total is updated without historical Chronological Recalculation. | Opening state, not Income | PRD §12 |
| EXAMPLE-02 | No Account | AC-01 opening Rp1,000,000 | Effective 2026-01-01 | Valid facts | — | T1,000,000/U1,000,000 | ACC-01–03 | Accepted | T1,000,000/U1,000,000 | None — establishes the opening baseline; derived Workspace Total is updated without historical Chronological Recalculation. | Opening source | PRD §12 |
| EXAMPLE-03 | No Account | AC-01 opening −Rp1 | Effective 2026-01-01 | Non-negative opening | — | Invalid opening | ACC-01 | Blocked | No Account | None | Negative amount blocker | PRD §12 |
| EXAMPLE-04 | Account T/U Rp0 effective Jan 1 | IN-01 Rp250,000 | Jan 1, p1 | Date equal; Income Category | T0/U0 | T/U +250,000 | DATE-01, ACC | Accepted | T/U250,000 | Account/report | Event/account/category | PRD §11 |
| EXAMPLE-05 | Same Account | IN-01 Rp250,000 | Dec 31, p1 | Date before Jan 1 | T0/U0 | Would add 250,000 | DATE-01 | Blocked | T0/U0 | None accepted | Both dates | PRD §§12,16 |
| EXAMPLE-06 | Account T/U Rp500,000 | EX-01 Rp200,000 | Jan 2, p1 | Expense Category; sufficient U | T/U500,000 | T/U −200,000 | ACC-01/02 | Accepted | T/U300,000 | Later Account/report | Expense contribution | PRD §11 |
| EXAMPLE-07 | Account T/U Rp100,000 | EX-01 Rp120,000 | Jan 2, p1 | U insufficient | T/U100,000 | Would reach −20,000 | ACC-01/02 | Blocked | T/U100,000 | None accepted | Shortage Rp20,000 | PRD §11 |
| EXAMPLE-08 | A T/U500,000; B T/U100,000 | TR-01 Rp200,000 A→B | Jan 3, p1 | Distinct; A sufficient | Workspace 600,000 | A −200,000; B +200,000 | TR-01/02, ACC | Accepted | A300,000; B300,000; WS600,000 | Both Accounts | Two sides/one event | PRD §11 |
| EXAMPLE-09 | A T/U500,000 | TR-01 Rp50,000 A→A | Jan 3, p1 | Accounts not distinct | T/U500,000 | No meaningful movement | TR-01 | Blocked | T/U500,000 | None | Same reference | DDR TRANSFER-01 |
| EXAMPLE-10 | A T/U40,000; B0 | TR-01 Rp50,000 | Jan 3, p1 | Source insufficient | WS40,000 | A would −10,000 | ACC-01/02 | Blocked | A40,000; B0 | None accepted | Shortage Rp10,000 | PRD §11 |
| EXAMPLE-11 | A T/U500,000; Fund F0 | FA-01 Rp150,000 | Jan 4, p1 | U sufficient; valid pair | A T500/U500/F0 | U−150; pair/F+150 | ACC-03, ALLOC/FUND | Accepted | A T500/U350/pair150; F150 | A/pair/F | Reconciled effects | PRD §14 |
| EXAMPLE-12 | A T/U100,000; F0 | FA-01 Rp150,000 | Jan 4, p1 | U insufficient | T/U100,000 | U would −50,000 | ACC-02 | Blocked | Unchanged | None | Shortage Rp50,000 | PRD §14 |
| EXAMPLE-13 | A pair F120,000; U80,000; T200,000 | FR-01 Rp50,000 | Jan 5, p1 | Exact pair sufficient | U80/pair120/F120 | U+50; pair/F−50 | ACC-03, FUND-01 | Accepted | U130/pair70/F70/T200 | A/pair/F | Exact provenance | PRD §14 |
| EXAMPLE-14 | A pair F20,000; B pair F100,000 | FR-01 Rp30,000 from A/F | Jan 5, p1 | A pair insufficient despite F total120 | F120 | A pair would −10 | ALLOC-01/FUND-02 | Blocked | A20/B100/F120 | None accepted | Selected-pair shortage | PRD §14 |
| EXAMPLE-15 | A T300/U100/pair F200; F200 | FX-01 Rp80,000 | Jan 6, p1 | Matching pair/Total sufficient | T300/U100/pair200/F200 | T/pair/F−80; U unchanged | ACC/FUND | Accepted | T220/U100/pair120/F120 | A/pair/F/report | One Expense | PRD §14 |
| EXAMPLE-16 | A pair F0; B pair F200,000 | FX-01 Rp50,000 paid by A | Jan 6, p1 | A pair insufficient | F200,000 | Would use B backing | FUND-02 | Blocked | Unchanged | None | A/F pair shortage | PRD §14 |
| EXAMPLE-17 | A T/U500,000; Debt P300,000 | DR-01 Rp100,000 | Jan 7, p1; dates valid | Both limits sufficient | A500; P300 | A T/U−100; P−100 | ACC, DEBT, DR-01 | Accepted | A400; P200 | A/Debt/report | Principal not Expense | PRD §15 |
| EXAMPLE-18 | A T/U500,000; Debt P80,000 | DR-01 Rp100,000 | Jan 7, p1 | Principal insufficient | P80,000 | P would −20,000 | DEBT-01/02 | Blocked | Unchanged | None | Principal shortage | PRD §15 |
| EXAMPLE-19 | A T/U60,000; Debt P200,000 | DR-01 Rp100,000 | Jan 7, p1 | Account insufficient | A60; P200 | A would −40,000 | ACC-01/02 | Blocked | Unchanged | None | Account shortage | PRD §15 |
| EXAMPLE-20 | A opening500,000; Expense300,000 p1; Income200,000 p2 | Two Jan 8 events | Same date p1 before p2 | Immutable positions present | Start500 | After p1=200; after p2=400 | ORDER, ACC | Accepted | T/U400,000 | Jan 8 onward | Date then p1/p2 | DDR ORDER-01 |
| EXAMPLE-21 | A opening500,000; existing Jan10 p1 | New Income Rp100,000 backdated Jan5 | Jan 5, new p2 | Valid date/facts | T after existing known | Add at Jan5 with p2 | ORDER, ACC | Accepted | All later totals +100,000 | Jan5 onward | Backdated date/new position | DDR ORDER-01 |
| EXAMPLE-22 | Expense Rp100,000 Jan10 p1; Account sufficient | CR-01 move to Jan5 | New date, same p1 | Every Jan5+ point valid | Confirmed history | Reverse Jan10/apply Jan5 | ORDER, ACC | Accepted | Net final same; timeline changed | Jan5 onward | Same identity/position | DDR ORDER-01 |
| EXAMPLE-23 | Ordinary Expense Rp60,000; A U100/pairF80/T180 | Add Fund F reference | Same date/position | Matching pair/Total sufficient | U40 after ordinary; pair80 | Reverse ordinary; apply fund form | ACC/FUND | Accepted | T120/U100/pair20/F20 | Earliest event onward | Same Expense identity | DDR EXPENSE-01 |
| EXAMPLE-24 | Expense Rp50,000 active p1; proposed Income Rp70,000 | CR-02 | Same date; new p2 | New Income Category/Account valid | Expense contributes −50 | Reverse −50; apply +70 | XB, ORDER | Accepted | Net change from before +120 | Old/new histories | Old→new, no double count | PRD §16 |
| EXAMPLE-25 | Jan 1 openings: A T/U Rp500,000; B T/U Rp100,000. Jan 5 Transfer Rp100,000 A→B at p1 yields A Rp400,000 and B Rp200,000. Jan 10 ordinary Expense Rp350,000 from A at p2 yields A Rp50,000; B has no later event. | LC-01 soft-delete the Jan 5 Transfer | Reverse p1; reevaluate Jan 10 p2 | Transfer complete; Jan 10 Expense remains affordable after reversal | A T/U50,000; B T/U200,000; Workspace250,000 | Reverse Transfer: Jan 5 A+100,000 and B−100,000; then retain Jan 10 A Expense−350,000 | A/B never negative; two-sided effect complete; Workspace Total preserved | Accepted | A T/U150,000; B T/U100,000; Workspace250,000; Transfer Trashed | Both Account histories from Jan 5 through Jan 10 | A: opening500, Transfer reversal to500, Expense to150. B: opening100, Transfer reversal to100. One Transfer identity remains Trashed. | PRD §16 |
| EXAMPLE-26 | Trashed Income Rp100,000 references archived Income Category; Account active | LC-02 | Original date/position | Category resolvable; Account valid | Event absent | Reapply Income | DATE/ACC; Category archive okay | Accepted | Account +100,000 | Original date onward | Archived Category retained | DDR LIFE-01 |
| EXAMPLE-27 | Trashed Income Rp100,000 references archived Account at Rp0 | LC-02 | Original date/position | Reapply would make archived Account Rp100,000 | Account0 | Would add100,000 | ARCH-01 | Blocked | Event Trashed; Account0 | None accepted | Restore Account first | DDR LIFE-01 |
| EXAMPLE-28 | Opening500,000; later Expense400,000 | AC-06 propose opening300,000 | Effective date then p1 | Preview; later point would −100,000 | Final100,000 | Recalculate with −200,000 opening change | ACC-01/02 | Blocked | Opening500; final100 | Entire Account history evaluated | Failing later Expense | PRD §§12,16 |
| EXAMPLE-29 | Debt current opening100,000, never repaid | DB-02 set opening Rp0 then DB-04 | Effective date valid | Preview; no repayment/dependency | P100,000 | P→0, then deletion eligibility | DEBT; deletion rule | Accepted | Debt deleted | Debt history | Current confirmed value Rp0 | DDR DEBT-01 |
| EXAMPLE-30 | Calendar Month; Jan 31 Income Rp100 at p1 and Feb 1 Expense Rp40 at p2 | RP-03 change to Custom Monthly Cycle start day 2 | Event Dates and financial effects unchanged | Impact Preview complete; start day 2 valid | Calendar Month places Jan 31 in Jan 1–Jan 31 and Feb 1 in Feb 1–Feb 28 | Regroup both events into Jan 2–Feb 1 | REPORT/TRACE | Accepted | Both events belong to Jan 2–Feb 1; dates, Income +100, and Expense −40 unchanged | All historical reporting membership; no financial recalculation | Exact old/new ranges and same event identities/effects | DDR DEC-REPORT-01 |
| EXAMPLE-31 | Active Account T/U Rp0 | AC-03 | Current Total0 | Archive eligibility | T0 | No money effect | ARCH-01 | Accepted | Archived T0 | None | History/identity intact | PRD §12 |
| EXAMPLE-32 | Active Fund with A/F Rp25,000 | DF-04 | Fund Balance25,000 | Archive requires Rp0 | F25,000 | No allowed auto-release | ARCH-02 | Blocked | Fund Active25,000 | None | Balance/breakdown | DDR FUND-01 |
| EXAMPLE-33 | Archived Fund F0 | DF-05 | Valid scope | Restoration supported | F0 | No financial effect | FUND-01 | Accepted | Active F0 | None | Same identity | DDR FUND-02 |
| EXAMPLE-34 | Active A T100,000; archived B T0 | Compute Workspace Total | Current state | Both existing Accounts included | A100/B0 | Sum both | REPORT-01 | Accepted derived result | WS100,000 | None | Membership shows A+B | DDR REPORT-04 |
| EXAMPLE-35 | Confirmed Account detail and summary both Rp99,000 | Proposed Income Rp1,000 would provisionally yield supporting detail Rp100,000 but derived summary Rp101,000 | Proposed Event Date valid; new Workspace position follows prior confirmations | Amount/references valid; predictable summary/detail agreement evaluated | Confirmed detail/summary Rp99,000 | Provisional detail100,000 versus summary101,000 | TRACE-01 pre-confirmation case | Blocked | Prior confirmed detail/summary remain Rp99,000; no Income confirmed | No accepted recalculation | Predictable Rp1,000 mismatch blocks proposal | DDR DEC-TRACE-03 |
| EXAMPLE-36 | Accepted event history currently derives Account detail Rp99,000; a summary is later found to show Rp100,000 | Detect post-hoc disagreement | State was already accepted; no new confirmation | Supporting detail and summary compared | Accepted events/state remain the source of Rp99,000 detail | Classify Rp1,000 mismatch; do not reverse, delete, or alter state | TRACE-01 post-hoc case | Accepted domain state retained; release-readiness blocked until resolved | Every accepted Financial Event and domain value remains accepted and unchanged | No retroactive recalculation or rollback | Post-hoc case and both values recorded for resolution | DDR DEC-TRACE-03 |
| EXAMPLE-37 | Active Fund Balance Rp25,000; Target Amount absent | DF-03 set Target Amount Rp0 | No Event Date or ordering change | Target is non-negative whole Rupiah | Progress and Completion undefined | Derive no ratio; compare Fund Balance25,000 ≥ Target0 | GOAL formula; no division by zero | Accepted | Target0; Goal Progress undefined; Goal Completion true; Fund Balance25,000 unchanged | Goal derivation only | Show Target0, Balance25,000, comparison true, ratio undefined | PRD §14; DDR DEC-FUND-03/04 |

## 30. Property and Invariant Test Catalog

| Property ID | Property Statement | Generated / Variable Inputs | Preconditions | Expected Invariant | Counterexample Shape | Behaviors | Source |
|---|---|---|---|---|---|---|---|
| PROP-ACC-01 | Every accepted state satisfies Account equation. | Opening and active Account/FA/FR/FX effects | Valid confirmed history | INV-ACC-03 | Total ≠ U + Σpairs | AC, FA, FR, FX, CR, LC | PRD §§9,14 |
| PROP-ACC-02 | No accepted behavior creates negative Account values. | Amounts/dates/references | Proposed acceptance | INV-ACC-01/02 | T<0 or U<0 | All Account-affecting | PRD §§9,11–12 |
| PROP-FUND-01 | No accepted Fund behavior creates negative pair allocation. | Pair histories/amounts | Valid pair reference | INV-ALLOC-01 | Pair<0 | FA/FR/FX | PRD §14 |
| PROP-FUND-02 | Fund Balance equals all pair allocations. | Any number of Accounts/pairs | Same Workspace | INV-FUND-01 | F ≠ Σpairs | FA/FR/FX, TC-02 | PRD §14 |
| PROP-DEBT-01 | Outstanding Principal never becomes negative. | Opening principal/repayments | Ordered valid dates | INV-DEBT-01 | P<0 | DB/DR/CR/LC | PRD §15 |
| PROP-TR-01 | Accepted Transfer preserves Workspace Total. | Distinct Accounts/positive amount | Source sufficient | INV-TR-02, FORM-WS-01 | WS before ≠ after | TR-01/02/03 | PRD §11 |
| PROP-FUND-03 | Allocation and Release preserve Account Total. | U/pair/amount | Sufficient source component | FORM-ACC-01 | Total changes | FA/FR | PRD §14 |
| PROP-FX-01 | Fund-Linked Expense leaves Unallocated unchanged. | Account/pair/amount | Pair/Total sufficient | Form specification | U before ≠ after | FX-01/02 | PRD §14 |
| PROP-EX-01 | Ordinary Expense leaves every allocation unchanged. | Account pairs/amount | U/Total sufficient | Form specification | Any pair changes | EX-01, CR-01 | PRD §11 |
| PROP-BLOCK-01 | Rejected proposals preserve prior confirmed state. | Any invalid proposal/state | At least one blocker | INV-BLOCK-01 | Any confirmed fact changes | All | PRD §16; DDR AGG-05 |
| PROP-CORR-01 | Correction reverses old effect before applying proposed effect. | Any editable event | Old event active | Correction specification | Both old/new counted | CR-01 | PRD §16 |
| PROP-CORR-02 | Replacement never double counts. | Old/new distinct types | Replacement accepted | Explicit old→new; old effect absent | Both contribute | CR-02 | PRD §16 |
| PROP-ORDER-01 | Restoration reuses original position. | Trashed events/order peers | Restoration accepted | INV-ORDER-01 | Position changes | LC-02 | DDR ORDER-01 |
| PROP-ORDER-02 | Identical confirmed Workspace facts always produce one total same-date order with no unresolved tie. | Any same-date events and their Workspace confirmation positions | Every new confirmation is uniquely after all earlier Workspace confirmations | INV-ORDER-01 | Two confirmed same-date events compare equal or order varies | All chronological | DDR DEC-ORDER-01 |
| PROP-ORDER-03 | Updated Timestamp never changes chronology. | Same events; varied Updated values | Dates/positions fixed | INV-ORDER-01 | Order changes with timestamp | CR/RC | DDR ORDER-01 |
| PROP-ARCH-01 | Archived Account remains Rp0. | Archived Account/restoration proposals | Account archived | INV-ARCH-01 | Accepted nonzero archived state | AC-03, LC-02 | PRD §12; DDR LIFE-01 |
| PROP-ARCH-02 | Archived Fund remains Rp0. | Archived Fund/restoration proposals | Fund archived | INV-ARCH-02 | Accepted nonzero archived Fund | DF-04, LC-02 | DDR FUND-01, LIFE-01 |
| PROP-REPORT-01 | Historical totals survive later Account archive. | Event history/archive time | Archive eligible at current Rp0 | INV-REPORT-02 | Prior event disappears | AC-03, RP, TC-04 | DDR REPORT-03 |
| PROP-REPORT-02 | Workspace Total membership is all existing Accounts. | Active/archived Account set | Same Workspace | INV-REPORT-01 | Existing Account omitted | TC-01/04 | DDR REPORT-04/05 |
| PROP-GOAL-01 | Target Amount never blocks allocation. | Valid target/fund amount/allocation | Account U sufficient | Target is not cap | Allocation rejected only for exceeding target | DF-03, FA-01 | PRD §14; DDR FUND-03 |
| PROP-GOAL-02 | Goal completion is never independently writable. | Balance/target/proposed completion | Target optional | FORM-GOAL-01 | Stored flag disagrees | DF-01/03, TC-02 | DDR FUND-04 |
| PROP-GOAL-03 | Target Amount Rp0 yields undefined Goal Progress and true Goal Completion without division. | Any non-negative Fund Balance; Target Rp0 | Valid Target Amount | FORM-GOAL-01 | Ratio calculated, division by zero, or completion false | DF-01/03, TC-02 | PRD §14; DDR DEC-FUND-03/04 |
| PROP-DEBT-02 | Repayment principal is not Expense. | Repayments/report ranges | Accepted DR event | Reporting classification | Expense total includes principal | DR/RP/TC | PRD §15 |
| PROP-REPORT-03 | Event Date controls report membership. | Event Date/timestamps/config | Active event | FORM-REPORT-01 | Timestamp changes membership | All events/RP | PRD §17 |
| PROP-REPORT-04 | Reporting change never changes financial facts. | Valid old/new configurations | RP-03 accepted | Account/Fund/Debt values equal | Any financial value differs | RP-03 | DDR REPORT-01 |
| PROP-TRACE-01 | A proposal predictably producing summary/detail disagreement is never confirmed. | Proposed effects and provisional summary/detail | Pre-confirmation evaluation | INV-TRACE-01; prior state preserved | Mismatching proposal accepted or prior state changed | All confirmations; TC-01–05 | PRD §19; DDR DEC-TRACE-03 |
| PROP-TRACE-02 | Post-hoc disagreement blocks release readiness without retroactively changing accepted state. | Accepted events/state and mismatching summary/detail | Disagreement discovered after acceptance | INV-TRACE-01 | Event unaccepted/reversed/deleted, state altered, or release readiness not blocked | TC-01–05 | PRD §19; DDR DEC-TRACE-03 |
| PROP-LIFE-01 | A Trashed Event remains retained, traceable, and eligible for an indefinite sequence of Restoration attempts, but each attempt is accepted only if current and every later affected rule passes. | Any Trashed event, time, current references/lifecycle/history | Event Trashed | No expiry/deletion; blocked attempt leaves it Trashed | Identity/history lost or invalid Restoration accepted | LC-02/03 | DDR DEC-LIFE-01–03 |
| PROP-DATE-01 | Accepted Account-referencing Event Date satisfies Account date. | Effective/Event dates | Valid refs | INV-DATE-01 | Event date earlier | IN/EX/TR/FA/FR/FX/DR | PRD §§12,16 |
| PROP-DATE-02 | Accepted repayment date satisfies Debt date. | Debt/Event dates | Valid Debt ref | INV-DATE-02 | Event date earlier | DR/DB-03 | PRD §§15–16 |
| PROP-HIST-01 | Effective-date corrections never silently exclude events. | Proposed date/existing events | AC-07 or DB-03 | INV-HIST-01 | Accepted result omits an event | AC-07, DB-03 | PRD §16; DDR LIFE-05 |
| PROP-XB-01 | Cross-boundary outcomes are indivisible. | Any participating concepts | Proposal evaluated | INV-XB-01 | Only some participants change | All cross-boundary | DDR AGG-05 |

## 31. Deferred Decisions and Architecture-Bound Choices

### Architecture

Exactly two choices remain: current-name-only display versus optional historical-name storage; and prior Same-Type Edit value-history storage depth. Identity resolution, Event Replacement link, and minimal change metadata MUST be preserved; the domain does not require historical-name snapshots. [DDR DEC-TRACE-01/02]

### Implementation Detail

Replaced-event list placement remains deferred. Correction-reason presentation, Impact Preview presentation, blocker-message order, and validation wording are presentation-only freedoms. None may change an eligibility rule or hide required traceability. [DDR DEC-LIFE-04–06, DEC-REJECT-01]

### Post-MVP

Dedicated Fund Target Date, one-off reporting ranges, and the complete Trash expiry/retention policy remain post-MVP. This deferral MUST NOT weaken v1’s indefinite retention, traceability, or eligibility for a Restoration attempt, and it does not guarantee that any attempt passes current validation. No v1 behavior may infer the future policy’s design. [DDR DEC-FUND-05, DEC-REPORT-06, DEC-LIFE-01/02]

### Excluded from v1

Manual or automatic permanent deletion from Trash, user-controlled Account exclusion from totals, and Debt Record archive/restore MUST NOT exist in v1. [DDR DEC-LIFE-03, DEC-REPORT-05, DEC-DEBT-04]

## 32. Architecture Handoff Constraints

Architecture follows a sufficiently approved domain model and translates it into implementation structures. It MUST preserve, without redefining: all-or-nothing cross-boundary acceptance; blocked-state preservation; Event Date as primary chronology key; one Workspace confirmation order in which every newly confirmed Event is uniquely after all prior confirmations and position resolves every same-date tie; Same-Type Edit/Restoration/Replacement position semantics; shared Account–Fund responsibility; no allocation-lot identity; narrow Workspace responsibility; Financial Event identity/lifecycle responsibility; independent Category identity/lifecycle; Workspace-owned reporting configuration; current Workspace Total membership; historical-total stability; every-point recalculation; no silent event exclusion; both pre-confirmation and post-hoc cross-view disagreement modes; lifecycle exclusions; indefinite Trash retention with Restoration acceptance still conditional; current confirmed Debt opening value for deletion; and the fixed Impact Preview trigger. [AGG §23; DDR DEC-ORDER-01, DEC-ALLOC-01/02, DEC-AGG-01–05, DEC-DEBT-01, DEC-LIFE-01–03/05, DEC-REPORT-02–05, DEC-TRACE-03]

Architecture may choose persistence technology, transaction mechanism, repository boundaries, application coordination, caching, derived-value materialization, concurrency control, identifier representation, API style, and module structure only if every approved constraint remains true. This permission names future choice categories; it makes no choice or recommendation. [AGG §23; DDR §§20, 26]

Architecture MUST NOT redefine aggregate boundaries for persistence, framework, or deployment convenience. A genuine later architectural discovery may trigger an explicit return to domain review; Architecture MUST NOT silently finalize, replace, or weaken domain decisions. [AGG §23]

## 33. Recommended Executable Domain Baseline

The candidate v1 baseline is: one isolated IDR/Asia-Jakarta Workspace; Accounts, Categories, Dedicated Funds, Debt Records, and stable Financial Events; exactly six Event Types; Account/Fund/Debt/Workspace/reporting formulas in §25; non-negative and reconciled values; deterministic Event Date plus Workspace confirmation-position chronology; identity-preserving Same-Type Edit and Restoration attempts; distinct-identity Replacement; indefinitely retained and traceable Trash without deletion; one retroactive Workspace reporting configuration; and source-to-view traceability. Cross-boundary results MUST be indivisible and blocked proposals MUST preserve confirmed state. [PRD §§6, 9–20; DDR DEC-ORDER-01, DEC-AGG-05, DEC-LIFE-01–03]

The v1 exclusions and the two Architecture, one implementation-detail, and three post-MVP deferrals remain exactly those in §31. No additional decision is introduced. [DDR §26]

## 34. Session 23 Readiness

**Result: Ready with Named Architecture Decisions.**

After this artifact is reviewed and approved, Domain Modeling is complete for the Private Beta v1 baseline and Session 23 — Architecture Baseline may begin. Its two named Architecture decisions are: (1) current-name-only display versus optional historical-name storage, and (2) prior Same-Type Edit value-history storage depth. [DDR DEC-TRACE-01/02]

Architecture must preserve all constraints in §32, especially invariant locality/shared participation, deterministic chronology, all-or-nothing acceptance, every-point recalculation, lifecycle exclusions, and traceability. No further broad Domain Modeling artifact is recommended. This readiness statement does not begin Session 23. [DDR §27; AGG §23]

## 35. PRD Traceability

Abbreviations used throughout: PI = `PRODUCT_IDENTITY.md`; PRD = `ANNOTASI_FINANCE_MVP_PRD.md`; UL = `UBIQUITOUS_LANGUAGE.md`; DCM = `DOMAIN_CONCEPT_MODEL.md`; DOC = `DOMAIN_OBJECT_CANDIDATES.md`; AGG = `AGGREGATE_CANDIDATES.md`; DBC = `DOMAIN_BEHAVIOR_CATALOG.md`; DDT = `DOMAIN_BEHAVIOR_DECISION_TABLES.md`; DDR = `DOMAIN_DECISION_REGISTER.md`.

| Specification group | PRD | PI | UL | DCM | DOC | AGG | DBC | DDT | DDR |
|---|---|---|---|---|---|---|---|---|---|
| Status, purpose, authority (§§1–4) | §§1–2,29 | §§3–5 | §§1–3 | §§1–3 | §§1–4 | §§1–4 | §§1–4 | §§1–4 | §§1–3,26–27 |
| Scope/fixed policies (§§5,7,9) | §§6,8–9,17,20,28 | §§3–7 | §§5,10–11 | §§6,12 | §§5,14 | §§6,12 | WB/RP | AM-17/18 | AGG-01/04; REPORT-02 |
| Decision incorporation (§6) | §§9–19,28 | §§3–7 | §§5–14 | §§6–15 | §§5–19 | §§6–23 | all 55 | all tables | all 41 decisions; §26 |
| Identity/references/chronology (§§8,12) | §§10–16,19 | §§5,7 | §§5–11 | §§7–15 | §§6–19 | §§7–14 | CR/LC/RC/TC | AM-19; BL-18 | NAME-01–05; ORDER-01; TRACE-01/02 |
| Lifecycle states (§§10,21,27) | §§12–16 | §7 | §§7–11 | §§7–13 | §§6–16 | §§7–13 | AC/CT/DF/DB/LC | AM-07–16,20–21 | FUND-01/02; DEBT-01/02/04; LIFE-01–04 |
| Invariants/blockers (§§11,28) | §§9,11–20 | §§5,13 | §§7–14 | §§7–15 | §§6–19 | §§7–16 | all | §5; AM/BL registries | AGG-05; REJECT-01; TRACE-03 |
| Workspace/Account (§§13–14) | §§6,9,12,20 | §§3,5 | §§5,7 | §§6–7,11 | §§6,19 | §§6–7 | WB/AC/TC | Account tables | NAME-01/04; AGG-01; REPORT-04/05 |
| Category (§15) | §§11,13 | §5 | §§5–6 | §§7–8 | §§6,15 | §9 | CT | Category tables | NAME-02; AGG-03 |
| Fund/Goal (§16) | §§9,14,19 | §§5,13 | §§8,12,14 | §§7,9,15 | §§6,12–13,19 | §§7,10 | DF/FA/FR/FX/TC-02 | Fund tables | NAME-03/05; ALLOC-01–03; FUND-01–05 |
| Debt (§17) | §§8,15–16,19 | §5 | §§9,12 | §§8,10 | §§6,8 | §11 | DB/DR/TC-03 | Debt tables | DEBT-01–04 |
| Events/forms/correction (§§18–20) | §§11,14–16 | §§5,7 | §§6,11 | §§8,13,15 | §§6,9,11,16 | §§8,13 | IN–DR; CR | Event/correction tables | ORDER-01; EXPENSE-01; AGG-02/05; LIFE-04–06 |
| Reporting/recalculation (§§22–23) | §§16–17,19 | §§5,13 | §§10–11 | §§12–15 | §§7,10,14,19 | §§12–14 | RP/RC | RP/RC tables | REPORT-01–06; LIFE-05 |
| Traceability/formulas (§§24–25) | §§9,14–15,17,19 | §§5,13 | §§7–12 | §§7–15 | §§7–19 | §§7–14 | TC-01–05 | TC tables; BL-20 | ALLOC-03; REPORT-03/04; TRACE-01–03 |
| Examples/properties (§§29–30) | §§9–19 | §§5,13 | §§6–14 | §§7–15 | §§6–19 | §§7–16 | all applicable | all applicable | all applicable decisions |
| Deferrals/handoff/readiness (§§31–34) | §28 | §§3–7 | §§1–3 | §§1–3 | §§1–4 | §§21,23 | open-detail fields | OQ register | §§20–27 |

Every normative `MUST` or `MUST NOT` rule is accompanied in its paragraph or table row by one or more of these authoritative source references. No rule relies on `PROJECT_STATE.md` alone. The source review found no contradiction with the complete PRD and silently resolved no conflict. [DDR §1; complete PRD review]
