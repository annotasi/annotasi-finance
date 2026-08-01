# Annotasi Finance — Domain Decision Register

## 1. Document Status

- **Status:** Candidate domain-decision baseline for detailed review.
- **Session:** Session 21 — Domain Decision Resolution.
- **Workflow stage:** Domain Modeling; Sessions 18–20 (Aggregate Candidates, Behavior Catalog, Behavior Decision Tables) are complete. Architecture has not started.
- **Target scope:** Resolve or narrow the product-domain decisions exposed by the reviewed domain artifacts so Session 22 can produce a precise Executable Domain Specification.
- **Source conflict result:** No conflict was found among the targeted authoritative sources during this session's independent verification.
- **Change boundary:** This document introduces no Architecture, persistence, API, command, domain-event, repository, or implementation decision. It modifies no existing artifact.
- **Approval boundary:** Every recommendation in this document remains **Pending Review**. Nothing here is an approved decision until the user reviews it.

## 2. Purpose

This register closes the loop opened by `DOMAIN_BEHAVIOR_DECISION_TABLES.md` §27/§30/§31: it takes every acceptance-blocking open decision, conditional open branch, and non-blocking deferred detail that document identified, plus the still-open Aggregate questions from `AGGREGATE_CANDIDATES.md` §22, and gives each one a concrete, sourced, Pending-Review recommendation (or explicitly leaves it open where no source grounds a recommendation). It also classifies each decision's urgency — whether Session 22 needs it resolved to write deterministic accept/blocked logic, or whether it can safely wait for Architecture, Implementation, or a post-MVP iteration.

This document does not reopen the product or domain model. It does not redefine any already-Confirmed PRD rule, rename any canonical term, or alter any relationship already confirmed in `DOMAIN_CONCEPT_MODEL.md`. It closes decisions; it does not remodel.

## 3. Source of Truth and Resolution Rules

Priority order for this document:

1. Confirmed requirements in `docs/product/ANNOTASI_FINANCE_MVP_PRD.md`.
2. Approved product direction in `docs/product/PRODUCT_IDENTITY.md`.
3. Repository workflow constraints in `CLAUDE.md`.
4. Canonical terminology in `docs/domain/UBIQUITOUS_LANGUAGE.md`.
5. Confirmed relationships in `docs/domain/DOMAIN_CONCEPT_MODEL.md`.
6. Candidate classifications in `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`.
7. Candidate consistency-boundary analysis in `docs/domain/AGGREGATE_CANDIDATES.md`.
8. Reviewed behavior baseline in `docs/domain/DOMAIN_BEHAVIOR_CATALOG.md`.
9. Reviewed decision-table baseline in `docs/domain/DOMAIN_BEHAVIOR_DECISION_TABLES.md`.
10. Navigation and handoff guidance in `docs/project/PROJECT_STATE.md` (never authoritative — navigation only).
11. This Session 21 specification.

Source abbreviations used below: **[PRD]** the MVP PRD; **[PI]** Product Identity; **[UL]** Ubiquitous Language; **[DCM]** Domain Concept Model; **[DOC]** Domain Object Candidates; **[AGG]** Aggregate Candidates; **[DBC]** Domain Behavior Catalog; **[DDT]** Domain Behavior Decision Tables (its Ambiguity Register entries are cited as **AM-nn**, its Rejection/Blocking Matrix entries as **BL-nn**).

**Resolution rules applied throughout:**

- Where a higher-priority source already settles a question, this document restates it (Recommended Status: **No Additional Decision Required**) rather than re-deciding it.
- Where no source settles a question but a confirmed precedent for a sibling concept exists (e.g., Account rename → Fund rename), the precedent grounds the recommendation.
- Where no precedent exists but a Recommendation Principle (§5) clearly favors one option, that principle grounds the recommendation.
- Where neither a precedent nor a principle clearly favors one option, the decision is marked **Preserve Open**, not resolved by default or by convenience.
- No recommendation converts an already-open PRD product decision into a silently Confirmed rule — every recommendation stays Pending Review, cites its grounding, and is reversible by explicit user direction.

## 4. Decision Status and Readiness Vocabulary

**Decision Status** (used for every entry — exactly one per decision):

- Recommended for Approval
- Preserve Open
- Defer to Architecture
- Defer to Implementation Detail
- Defer Post-MVP
- Excluded from v1
- No Additional Decision Required

**Decision Readiness** (used for every entry — exactly one per decision):

- Must Resolve Before Executable Domain Specification
- Should Resolve Before Architecture
- Safe to Resolve During Architecture
- Safe to Resolve During Implementation
- Safe to Defer Post-MVP
- No Resolution Needed

Every recommendation remains pending user review until this artifact is approved; no status above equals "approved."

## 5. Resolution Principles

Applied in order for every recommendation below:

1. Confirmed PRD behavior wins.
2. Preserve financial correctness and traceability.
3. Preserve deterministic historical recalculation.
4. Preserve one logical outcome for cross-boundary behaviors.
5. Prefer the smallest rule sufficient for Private Beta v1.
6. Avoid hidden automation that moves or consumes money unexpectedly.
7. Avoid silent loss or exclusion of history.
8. Prefer derived state over duplicated writable state when domain meaning remains clear.
9. Avoid adding new Event Types, Categories, or account-like concepts.
10. Defer presentation and technical choices that do not alter domain meaning.
11. Exclude optional behavior when supporting it would introduce disproportionate ambiguity before Private Beta.
12. Architecture may translate approved domain meaning but must not redefine it for persistence or framework convenience.

## 6. Decision Register Summary

| Decision ID | Decision Topic | Affected Behavior IDs | Current State | Decision Readiness | Recommended Status | Recommended Resolution | Domain Reason | Main Trade-Off | Existing Rules Preserved | Required Follow-Up | Source References |
|---|---|---|---|---|---|---|---|---|---|---|---|
| DEC-NAME-01 | Account name uniqueness | AC-01, AC-02 | Conditional Open Branch (AM-01) | Must Resolve Before Executable Domain Specification | Recommended for Approval | Not enforced in v1 | Identity never depends on name (DOC §15) | Simplicity vs. potential user confusion from duplicates | Identity/history resolution unaffected | None — closes AM-01 | [PRD-12]; [PRD-28]; [DOC-15]; AM-01 |
| DEC-NAME-02 | Category name uniqueness | CT-01, CT-02 | Conditional Open Branch (AM-02) | Must Resolve Before Executable Domain Specification | Recommended for Approval | Not enforced (neither within nor across kinds) | Kind separation already protects meaning; PRD never confirms uniqueness | Simplicity vs. duplicate-label confusion | Income/Expense kind separation unaffected | None — closes AM-02 | [PRD-13]; [PRD-28]; AM-02 |
| DEC-NAME-03 | Dedicated Fund name uniqueness | DF-01, DF-02 | Conditional Open Branch (AM-03) | Must Resolve Before Executable Domain Specification | Recommended for Approval | Not enforced in v1 | Fund identity is not its name (DOC §15) | Simplicity vs. duplicate "Qurban"-style names | Fund identity/history unaffected | None — closes AM-03 | [PRD-14]; [PRD-28]; AM-03 |
| DEC-NAME-04 | Post-onboarding Account rename | AC-02 | Confirmed Rule with Open Detail | Must Resolve Before Executable Domain Specification | Recommended for Approval | Supported at any time, not only onboarding | AC-02's own invariants already permit it unconditionally | None identified | Rename never changes balances/dates/identity | None | [PRD-10]; [PRD-12]; [PRD-28]; AM-01 |
| DEC-NAME-05 | Dedicated Fund rename | DF-02 | Still Open / no accepted outcome | Must Resolve Before Executable Domain Specification | Recommended for Approval | Supported, same shape as Account/Category rename | Consistency with confirmed sibling rename rules | None identified | Balance/identity/history untouched by rename | None — resolves DF-02 to Confirmed | [PRD-14]; [PRD-28]; AM-06 |
| DEC-ORDER-01 | Deterministic same-date ordering | All chronological behaviors; RC-01 | Confirmed requirement / open mechanism (AM-19, BL-18) | Must Resolve Before Executable Domain Specification | Recommended for Approval | Event Date + each event's own immutable confirmation-order position; Restoration reuses its original position; Replacement's new identity gets a new position | Must be deterministic, stable, and never rely on mutable Updated Timestamp | Simplicity vs. rejecting explicit user-controlled sequencing | Chronological Recalculation determinism | None — closes AM-19/BL-18 mechanism gap | [PRD-16]; [UL-11]; AM-19; BL-18 |
| DEC-TRANSFER-01 | Same source = destination Account | TR-01, TR-02 | Conditional Open Branch (AM-04) | Must Resolve Before Executable Domain Specification | Recommended for Approval | Rejected — not a valid Transfer | Avoids meaningless zero-effect history | None identified | Transfer stays one linked event; no partial effect | None — closes AM-04 | [PRD-11]; AM-04 |
| DEC-EXPENSE-01 | Ordinary ↔ Fund-Linked Expense transition | FX-02, CR-01, CR-02 | Conditional Open Branch (AM-05) | Must Resolve Before Executable Domain Specification | Recommended for Approval | Same-Type Edit (Event Type stays Expense) | Ordinary/Fund-Linked are secondary classifiers, not separate types (DOC §9) | None identified | Event identity preserved; no double counting | None — closes AM-05 | [PRD-16]; [PRD-28]; AM-05 |
| DEC-ALLOC-01 | Allocation domain responsibility | FA-01/02, FR-01/02, FX-01/02 | Non-Blocking Deferred Detail (AM-22) | Should Resolve Before Architecture | Recommended for Approval | Shared: Account protects own allocation+equation; Fund protects breakdown+Fund Balance | AGG §7/§10 already reach this conclusion | Shared responsibility vs. single-owner simplicity | Balance equation; no cross-Account consumption | Architecture translates without picking a persistence owner | [PRD-9]; [PRD-14]; AM-22 |
| DEC-ALLOC-02 | Allocation independent identity | FA, FR, FX family | Still Open (independent identity undecided) | Should Resolve Before Architecture | Recommended for Approval | Not needed; identified by the (Account, Fund) pair only | No-lot/no-FIFO/LIFO rule makes independent identity purposeless | None identified | No allocation-lot relationship | None | [PRD-14]; [PRD-16]; [DOC-12]; [DOC-19] |
| DEC-ALLOC-03 | Source of derived Fund Balance | FA, FR, FX, TC-02 | Already Confirmed | No Resolution Needed | No Additional Decision Required | Derived only — sum of current per-Account allocations | Restated for register completeness | None | Fund Balance never directly writable | None | [PRD-9]; [PRD-14]; [DOC-8] |
| DEC-AGG-01 | Workspace responsibility | WB-01, WB-02 | Still Open (root question) | Should Resolve Before Architecture | Recommended for Approval | Narrow ownership/configuration boundary only | AGG §23 Recommended Baseline | Narrow boundary vs. simpler "one big Aggregate" temptation | Single-owner cardinality; isolation | None | [PRD-6]; [PRD-20]; AGG-23 |
| DEC-AGG-02 | Financial Event responsibility | All event behaviors | Still Open (root question) | Should Resolve Before Architecture | Recommended for Approval | Root for identity/form/references/lifecycle only, not monetary invariants alone | AGG §8 hybrid conclusion | None identified | Identity through Same-Type Edit/Replacement | None | [PRD-11]; [PRD-16]; [PRD-19]; AGG-8 |
| DEC-AGG-03 | Category responsibility | CT-01…05 | Still Open (root question) | Should Resolve Before Architecture | Recommended for Approval | Independent small domain concept, not mere Workspace configuration | AGG §9; DEC-NAME-02 removes AGG's stated blocker | None identified | Kind stability; reference resolvability | None | [PRD-13]; AGG-9 |
| DEC-AGG-04 | Reporting configuration responsibility | WB-02, RP-01…03 | Weak Candidate (AGG §12/§23) | Should Resolve Before Architecture | Recommended for Approval | Inside Workspace's responsibility; no independent identity | AGG's own "Weak independent candidate" conclusion | None identified | One active configuration at a time | Cross-reference DEC-REPORT-02 | [PRD-17]; AGG-12; AGG-23 |
| DEC-AGG-05 | Cross-boundary financial responsibility | TR, FA, FR, FX, DR, corrections | Already Confirmed | No Resolution Needed | No Additional Decision Required | All-or-nothing participation across every listed participant | Restated for register completeness | None | No confirmed partial outcome | None | [PRD-11]; [PRD-16]; DBC-25 |
| DEC-FUND-01 | Archive at non-zero Fund Balance | DF-04, LC-04 | Conditional Open Branch (AM-08) | Must Resolve Before Executable Domain Specification | Recommended for Approval | Block until Fund Balance = Rp0 | Mirrors confirmed Account archive precondition | Consistency vs. added friction for partially-used funds | No silent release/zeroing | None — closes AM-08 | [PRD-14]; [PRD-28]; AM-08 |
| DEC-FUND-02 | Dedicated Fund restoration | DF-05, LC-05 | Still Open / no accepted outcome (AM-07) | Must Resolve Before Executable Domain Specification | Recommended for Approval | Supported, mirrors Account/Category restoration | Consistency with confirmed sibling restoration rules | None identified | Allocations/history untouched by restore | None — resolves DF-05 to Confirmed | [PRD-14]; [PRD-28]; AM-07 |
| DEC-FUND-03 | Target Amount change/removal after history | DF-03 | Conditional Open Branch (AM-09) | Must Resolve Before Executable Domain Specification | Recommended for Approval | Freely changeable/removable at any time | Target Amount already confirmed non-cap, zero invariant impact | None identified | Target never caps allocation/spending | None — closes AM-09 | [PRD-14]; [PRD-28]; AM-09 |
| DEC-FUND-04 | Goal completion representation | DF-01, DF-03 | Non-Blocking Deferred Detail (AM-10) | Must Resolve Before Executable Domain Specification | Recommended for Approval | Derived only (Fund Balance ≥ Target Amount) | Consistent with Target Amount's non-cap nature; avoids duplicated state | None identified | Fund/Goal share one identity | None — closes AM-10 | [PRD-14]; [PRD-28]; AM-10 |
| DEC-FUND-05 | Target Date | DF-01 | Still undecided (PRD §28) | Safe to Defer Post-MVP | Defer Post-MVP | Does not ship in v1 | Smallest-rule; PRD frames it as a scheduling question, not a v1 need | Feature completeness vs. scope discipline | None affected | Revisit post-MVP if requested | [PRD-14]; [PRD-28] |
| DEC-DEBT-01 | Complete Debt Record deletion eligibility | DB-04 | Still Open / no accepted outcome (AM-11) | Must Resolve Before Executable Domain Specification | Recommended for Approval | Delete only if never repaid AND current confirmed Opening Outstanding Principal is Rp0 (including any accepted DB-02 correction) AND no other dependency | Mirrors confirmed AC-05/CT-05/DF-06 pattern | Strictness vs. convenience for mistaken entries | Repayment history never silently erased; no prior-value storage required | None — resolves DB-04 to Confirmed | [PRD-15]; [PRD-28]; AM-11 |
| DEC-DEBT-02 | Debt status (Active/Paid Off) | DB-01, DR-01 | Non-Blocking Deferred Detail (AM-12) | Should Resolve Before Architecture | Recommended for Approval | Derived only from Outstanding Principal | Avoids duplicated writable state (principle 8) | None identified | Outstanding Principal remains sole source of truth | None | [PRD-15]; [PRD-28]; AM-12 |
| DEC-DEBT-03 | Creditor/lender structure | DB-01, DR-01 | Non-Blocking Deferred Detail (AM-13) | Should Resolve Before Architecture | Recommended for Approval | No separate field in v1; Debt Record name suffices | Smallest-rule; avoid new concepts | Simplicity vs. richer debt metadata | Minimal Debt Record structure preserved | Revisit if beta users request it | [PRD-15]; [PRD-28]; AM-13 |
| DEC-DEBT-04 | Debt Record archive/restore | — (no behavior currently proposes this) | Not addressed by any source | Should Resolve Before Architecture | Excluded from v1 | Intentionally absent from v1 | No source proposes it; avoid inventing a lifecycle state | None identified | Only deletion eligibility (DEC-DEBT-01) governs lifecycle | None | [PRD-15]; DOC-6 |
| DEC-LIFE-01 | Archived reference during Restoration | LC-02, LC-05 | Conditional Open Branch (AM-14) | Must Resolve Before Executable Domain Specification | Recommended for Approval | Historical resolvability always holds; archived status alone never blocks Category-referencing Restoration; Account/Fund-referencing Restoration additionally requires the referenced concept's own archived-state balance invariant (Rp0) to still hold | DCM §15 confirms references survive archive; PRD §12 ties Account archive to Total Account Balance = Rp0 | None identified | Restoration still revalidates current invariants; archived Account/Fund balance invariant never silently violated | None — closes AM-14 with a concept-specific rule | [PRD-12]; [PRD-16]; [PRD-28]; AM-14 |
| DEC-LIFE-02 | v1 Trash retention and expiry rule | LC-01, LC-02, LC-03 | Non-Blocking Deferred Detail (prior draft) | Safe to Defer Post-MVP | Defer Post-MVP | Trashed events remain recoverable indefinitely in v1; no automatic expiry; no automatic or manual permanent deletion; the 30-day preference is deferred post-MVP in full | Asserting a "window" without a defined post-expiry consequence is an unresolved contradiction, not a domain rule | None identified | Soft Deletion/Restoration reversibility strengthened, never time-limited in v1 | Full retention/expiry design deferred to a future post-MVP session | [PRD-16]; [PRD-28]; DEC-LIFE-03 |
| DEC-LIFE-03 | Manual Permanent Deletion from Trash | LC-03 | Still Open / no accepted outcome (AM-16) | Must Resolve Before Executable Domain Specification | Excluded from v1 | Excluded from v1 — no manual or automatic permanent deletion of any kind in v1 (see DEC-LIFE-02) | Soft Deletion/Trash/Restoration already satisfy non-destructive correction | Flexibility vs. irreversible history loss | Trash remains a holding state only | None — resolves LC-03 by exclusion | [PRD-16]; [PRD-28]; AM-16 |
| DEC-LIFE-04 | Replaced-event visibility | CR-02 | Non-Blocking Deferred Detail (AM-15) | Safe to Resolve During Implementation | Defer to Implementation Detail | Traceability guaranteed regardless of list placement | Separates domain traceability from UI presentation | None identified | Replacement link always preserved | List-placement UX chosen later | [PRD-16]; [PRD-28]; AM-15 |
| DEC-LIFE-05 | Impact Preview requirement | AC-06/07, DB-02/03, RP-03, CR-01/02, LC-01/02 | Confirmed rule / open threshold (AM-20) | Should Resolve Before Architecture | Recommended for Approval | Always required for AC-06/07, DB-02/03, RP-03; required for CR-01/02, LC-01/02 whenever recalculation reaches beyond the directly-changed event — this trigger is fixed at domain level, not Implementation-adjustable | Derived from which behaviors sources consistently name as preview-bearing | None identified | Preview never replaces invariant enforcement; trigger condition is a domain rule, not a tunable parameter | Only presentation (modal/inline, wording, layout) deferred | [PRD-16]; [PRD-28]; AM-20 |
| DEC-LIFE-06 | Correction reason | CR-01, CR-02, CR-03 | Non-Blocking Deferred Detail (AM-21) | Safe to Resolve During Implementation | Recommended for Approval | Optional descriptive fact, never required | Avoids friction not demanded by any invariant | None identified | Correction mechanism unaffected | Field UI chosen later | [PRD-16]; [PRD-28]; AM-21 |
| DEC-REPORT-01 | Reporting Period application timing | RP-03 | Conditional Open Branch (AM-17) | Must Resolve Before Executable Domain Specification | Recommended for Approval | Fully retroactive regrouping of all history | Forced by "only one active cycle" cardinality | None identified | Event Dates/balances never change | None — closes AM-17 | [PRD-17]; [PRD-28]; AM-17 |
| DEC-REPORT-02 | Reporting configuration form | WB-02, RP-01…03 | Weak Candidate (AM-18) | Should Resolve Before Architecture | Recommended for Approval | Workspace configuration (same as DEC-AGG-04) | Cross-referenced with DEC-AGG-04 | None identified | One active configuration at a time | None | [PRD-17]; AM-18 |
| DEC-REPORT-03 | Archived Accounts in historical totals | AC-03, TC-04 | Conditional Open Branch (AM-25) | Must Resolve Before Executable Domain Specification | Recommended for Approval | Included — archiving never rewrites past totals | Avoids silent history exclusion (principle 7) | None identified | Historical totals remain traceable | None — closes AM-25 (historical case) | [PRD-12]; [PRD-28]; AM-25 |
| DEC-REPORT-04 | Archived Accounts in current Workspace Total | AC-03, TC-01, TC-04 | Conditional Open Branch (AM-25) | Should Resolve Before Architecture | Recommended for Approval | One rule with DEC-REPORT-05: current Workspace Total sums Total Account Balance over all existing Accounts, including archived (which contribute Rp0 by the AC-03 precondition) | Stating one membership rule avoids implying a filtering step Architecture might diverge from | None identified | Archive precondition (Total = Rp0) unaffected | None | [PRD-12]; [PRD-28]; AM-25; DEC-REPORT-05 |
| DEC-REPORT-05 | User-controlled Account exclusion from totals | TC-01, TC-04 | Still undecided (AM-26) | Must Resolve Before Executable Domain Specification | Excluded from v1 | No user-controlled exclusion mechanism exists; Workspace Total always sums all existing Accounts per DEC-REPORT-04 | Avoids risking dashboard/detail disagreement (release-blocking) | Flexibility vs. traceability risk | Workspace Total always traceable to one unambiguous set of all existing Accounts | None — closes AM-26 | [PRD-12]; [PRD-28]; AM-26; DEC-REPORT-04 |
| DEC-REPORT-06 | One-off custom reporting ranges | RP-02 | Still undecided (PRD §28) | Safe to Defer Post-MVP | Defer Post-MVP | Not part of v1 | RP-02 already excludes it from its own confirmed scope | Feature completeness vs. scope discipline | Calendar Month / Custom Monthly Cycle remain the only v1 options | Revisit post-MVP if requested | [PRD-17]; [PRD-28] |
| DEC-TRACE-01 | Historical names (display) | TC-05 | Non-Blocking Deferred Detail | Safe to Resolve During Architecture | Defer to Architecture | Stable identity resolution mandatory either way; Architecture must decide before persistence design is finalized whether v1 uses current-name-only display or optional historical-name storage | Option 2 (event-time name) is persistence-affecting, so the choice belongs in Architecture's remit, not late Implementation | None identified | Reference resolution never breaks on rename/archive under either option | Architecture records its current-name-only vs. snapshot decision | [PRD-19]; [DCM-15] |
| DEC-TRACE-02 | Prior edited values | CR-01, TC-05 | Still undecided (PRD §16) | Safe to Resolve During Architecture | Defer to Architecture | Only the Event Replacement link is a confirmed domain requirement | PRD's minimal-metadata rule does not require full prior-value history | Auditability vs. minimal confirmed metadata | Replacement link always preserved | Architecture chooses storage depth | [PRD-16] |
| DEC-TRACE-03 | Dashboard/detail disagreement precedence | TC-04 and all accepted financial/reporting behaviors | Confirmed release-blocking rule, precedence open | Should Resolve Before Architecture | Recommended for Approval | Blocks acceptance when predictable pre-confirmation; a release-readiness defect (not retroactive un-acceptance) when discovered post-hoc | Gives Session 22 two concrete evaluation moments | None identified | Release-blocking status of disagreement unaffected | None | [PRD-19]; [PRD-24]; BL-20 |
| DEC-REJECT-01 | User-facing rejection precedence | All behaviors with BL-01…BL-20 | Confirmed blockers / precedence open | Safe to Resolve During Implementation | Recommended for Approval | Every confirmed blocker still evaluated; presentation order among simultaneous blockers is free | Blocked-outcome guarantee identical regardless of which blocker is surfaced first | None identified | No confirmed blocker may be silently skipped | Presentation order chosen later | [PRD-16]; DBC-5 |

## 7. Decisions Required Before Executable Domain Specification

The following decisions are classified **Must Resolve Before Executable Domain Specification**. Each receives a recommendation in §8–§18 below; none is left as a genuine blocker after this session's recommendations are reviewed and approved.

1. DEC-NAME-01 — Account name uniqueness
2. DEC-NAME-02 — Category name uniqueness
3. DEC-NAME-03 — Dedicated Fund name uniqueness
4. DEC-NAME-04 — Post-onboarding Account rename
5. DEC-NAME-05 — Dedicated Fund rename
6. DEC-ORDER-01 — Deterministic same-date ordering
7. DEC-TRANSFER-01 — Same source = destination Account
8. DEC-EXPENSE-01 — Ordinary ↔ Fund-Linked Expense transition
9. DEC-FUND-01 — Archive at non-zero Fund Balance
10. DEC-FUND-02 — Dedicated Fund restoration
11. DEC-FUND-03 — Target Amount change/removal after history
12. DEC-FUND-04 — Goal completion representation
13. DEC-DEBT-01 — Complete Debt Record deletion eligibility
14. DEC-LIFE-01 — Archived reference during Financial Event Restoration
15. DEC-LIFE-03 — Manual Permanent Deletion from Trash
16. DEC-REPORT-01 — Reporting Period application timing
17. DEC-REPORT-03 — Archived Accounts in historical totals
18. DEC-REPORT-05 — User-controlled Account exclusion from totals

Every item above has a concrete Pending-Review resolution below; some are Recommended for Approval and some are resolved through an explicit v1 exclusion. None remains a genuine, unaddressed blocker.

## 8. Naming and Identity Decisions

### DEC-NAME-01 — Account Name Uniqueness

- **Decision ID:** DEC-NAME-01
- **Decision Topic:** Account Name Uniqueness
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Account; Account Name.
- **Affected Behavior IDs:** AC-01 (Establish Account Opening State); AC-02 (Rename Account).
- **Current Confirmed Facts:** An Account requires a user-defined name (PRD §12). Account identity is never determined by name — historical Financial Event references resolve through Account identity, not the current name value (DOC §6, §15; AGG §7). The PRD lists uniqueness as unresolved (PRD §28, "Product Decisions Before Detailed Specification").
- **Current Ambiguity:** Whether two Accounts in one Workspace may carry an identical visible name.
- **Options Considered:** (1) Required uniqueness within the Workspace, rejecting a duplicate at AC-01/AC-02. (2) Recommended but not enforced. (3) Not enforced — duplicates permitted.
- **Recommended Resolution:** Not enforced in v1. Duplicate Account names are permitted; AC-01 and AC-02 carry no name-uniqueness rejection condition.
- **Domain Rationale:** Account identity never depends on name — every confirmed invariant, balance, and historical reference already resolves correctly regardless of name collisions (DOC §6/§15). Introducing an enforcement rule no source confirms would add a rejection condition beyond what any invariant requires (Principle 5, Principle 9).
- **Consequences of Recommendation:** AC-01/AC-02 close their previously conditional naming branch (AM-01) and become fully deterministic. Users may create two identically named Accounts; distinguishing them relies on other attributes, a UX concern outside this register.
- **Rules and Invariants Preserved:** Account identity persistence through rename/archive (DOC §6); balance equation and non-negativity invariants, entirely unaffected.
- **Rules Explicitly Not Introduced:** No name-uniqueness constraint; no case-insensitive collision rule; no duplicate-name warning mechanism.
- **Impact on Correction and Recalculation:** None — name is not part of any recalculated financial state.
- **Impact on Traceability:** None — traceability already resolves through identity, not name.
- **Impact on Private Beta Scope:** Simplifies onboarding/account creation; removes a rejection path that would otherwise need product-level duplicate-name wording.
- **Architecture Boundary:** Architecture may store names however it wishes; it must not introduce a uniqueness constraint that rejects an otherwise-valid Account establishment, since no domain rule requires one.
- **Remaining Detail:** If beta feedback shows real confusion from duplicate names, a future session may introduce a uniqueness or warning rule; this recommendation does not foreclose that.
- **Source References:** [PRD-12]; [PRD-28]; [DOC-6]; [DOC-15]; [DOC-19]; [AGG-7]; AM-01.
- **Approval State:** Pending Review

### DEC-NAME-02 — Category Name Uniqueness

- **Decision ID:** DEC-NAME-02
- **Decision Topic:** Category Name Uniqueness
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Category; Category Name; Category Kind (Income/Expense).
- **Affected Behavior IDs:** CT-01 (Establish Category); CT-02 (Rename Category).
- **Current Confirmed Facts:** Category has exactly one immutable kind (Income or Expense), non-overlapping (PRD §13). Category name is user-extensible and required. The PRD lists name uniqueness as unresolved (PRD §28).
- **Current Ambiguity:** Whether Category names must be unique within one Workspace, within one kind, or neither. This decision does not merge Income and Expense kinds.
- **Options Considered:** (1) Unique within the whole Workspace. (2) Unique within kind only (an Income Category and an Expense Category could share a label). (3) Not enforced anywhere.
- **Recommended Resolution:** Not enforced — neither within a kind nor across the Workspace. Kind separation is unaffected; only the label-collision question is resolved.
- **Domain Rationale:** Category identity, like Account identity, is never confirmed to depend on its label (DOC §6). No invariant requires distinct labels; PRD's non-overlapping-kind rule already prevents the one collision that would matter (a name meaning two different things), since a Category's kind is fixed at creation and never inferred from its name.
- **Consequences of Recommendation:** CT-01/CT-02 close their conditional naming branch (AM-02). Two Categories — even within the same kind — may share a label; historical Income/Expense references remain resolvable through Category identity regardless.
- **Rules and Invariants Preserved:** Kind immutability (rename never reclassifies); historical reference resolvability after rename/archive.
- **Rules Explicitly Not Introduced:** No uniqueness constraint of any scope; no cross-kind collision rule.
- **Impact on Correction and Recalculation:** None.
- **Impact on Traceability:** None — resolution is by identity, not label.
- **Impact on Private Beta Scope:** Keeps starter-category seeding and later user-created categories simple, with no duplicate-rejection UX to design.
- **Architecture Boundary:** Architecture must not add a uniqueness constraint on Category names; it may still choose internal representations for label storage.
- **Remaining Detail:** Exact starter-category wording/count (PRD §13) remains a separate, still-open UX/product question not resolved here.
- **Source References:** [PRD-13]; [PRD-28]; AM-02.
- **Approval State:** Pending Review

### DEC-NAME-03 — Dedicated Fund Name Uniqueness

- **Decision ID:** DEC-NAME-03
- **Decision Topic:** Dedicated Fund Name Uniqueness
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Dedicated Fund; Fund Name.
- **Affected Behavior IDs:** DF-01 (Establish Dedicated Fund); DF-02 (Rename Dedicated Fund).
- **Current Confirmed Facts:** A Dedicated Fund requires a user-defined name (PRD §14). Fund identity is not its name (DOC §6/§15). PRD lists uniqueness as unresolved (PRD §28).
- **Current Ambiguity:** Whether two Dedicated Funds in one Workspace may carry an identical name (e.g., two Funds both named "Qurban").
- **Options Considered:** (1) Required uniqueness within the Workspace. (2) Recommended but not enforced. (3) Not enforced.
- **Recommended Resolution:** Not enforced in v1.
- **Domain Rationale:** Same reasoning as DEC-NAME-01/02 — Fund identity never depends on name; Fund Balance, Account-backed allocations, and every confirmed invariant already resolve through identity (Principle 5, Principle 9).
- **Consequences of Recommendation:** DF-01/DF-02 close their conditional naming branch (AM-03). Two identically named Funds may coexist; each remains independently traceable to its own Account-backed allocations.
- **Rules and Invariants Preserved:** Fund identity persistence; Fund Balance = sum of current per-Account allocations, unaffected by naming.
- **Rules Explicitly Not Introduced:** No uniqueness constraint.
- **Impact on Correction and Recalculation:** None.
- **Impact on Traceability:** None — resolution is by identity, not label.
- **Impact on Private Beta Scope:** Removes a rejection path for a common real-world pattern (multiple purpose funds with overlapping natural names).
- **Architecture Boundary:** Architecture must not add a uniqueness constraint on Fund names.
- **Remaining Detail:** None beyond this decision's own scope.
- **Source References:** [PRD-14]; [PRD-28]; [DOC-15]; AM-03.
- **Approval State:** Pending Review

### DEC-NAME-04 — Post-Onboarding Account Rename

- **Decision ID:** DEC-NAME-04
- **Decision Topic:** Post-Onboarding Account Rename Availability
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Account; Account Name.
- **Affected Behavior IDs:** AC-02 (Rename Account).
- **Current Confirmed Facts:** PRD confirms rename during onboarding (choosing/renaming the suggested default name, PRD §10). AC-02's own local invariants already state rename never changes amounts, dates, references, or event identity — nothing in those invariants is scoped to "onboarding only." Availability after onboarding is listed as unresolved (PRD §28).
- **Current Ambiguity:** Whether AC-02 is available only during onboarding or at any later time.
- **Options Considered:** (1) Supported at any time. (2) Restricted to onboarding only. (3) Deferred post-MVP.
- **Recommended Resolution:** Supported at any time after onboarding, not restricted to the onboarding window.
- **Domain Rationale:** AC-02's confirmed invariants (rename never touches balances/dates/identity/history) already make rename safe regardless of when it happens; restricting it to onboarding would be an arbitrary special case unsupported by any invariant (Principle 5).
- **Consequences of Recommendation:** AC-02 becomes a Confirmed Behavior with a precondition of "Account exists and is not deleted" only — no lifecycle-stage restriction.
- **Rules and Invariants Preserved:** Rename never changes amounts, dates, references, or event identity (already Confirmed).
- **Rules Explicitly Not Introduced:** No onboarding-only gate; no rename-frequency limit.
- **Impact on Correction and Recalculation:** None — rename is not part of Chronological Recalculation.
- **Impact on Traceability:** None — the Account remains traceable as the same Account across any rename.
- **Impact on Private Beta Scope:** Improves usability — a beta user who accepted a default name during onboarding can later personalize it.
- **Architecture Boundary:** None specific — a pure domain-availability question, already resolved at the domain level.
- **Remaining Detail:** None.
- **Source References:** [PRD-10]; [PRD-12]; [PRD-28]; AM-01.
- **Approval State:** Pending Review

### DEC-NAME-05 — Dedicated Fund Rename

- **Decision ID:** DEC-NAME-05
- **Decision Topic:** Dedicated Fund Rename Availability
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Dedicated Fund; Fund Name.
- **Affected Behavior IDs:** DF-02 (Rename Dedicated Fund).
- **Current Confirmed Facts:** DF-02 is currently classified "Still Open" with no confirmed accepted outcome (DBC §5; AM-06) — the PRD never states whether Fund rename is supported at all.
- **Current Ambiguity:** Whether a Dedicated Fund may be renamed, and if so, under what constraints.
- **Options Considered:** (1) Supported, mirroring confirmed Account/Category rename. (2) Not supported in v1. (3) Deferred post-MVP.
- **Recommended Resolution:** Supported, in the same shape as confirmed Account and Category rename: the name changes; Fund Balance, per-Account allocation breakdown, Target Amount, and every historical Financial Event reference remain untouched.
- **Domain Rationale:** No invariant is threatened by a Fund name change (Fund Balance/allocations are derived from events, never from name). Leaving this "Still Open" indefinitely would leave a basic, low-risk correction capability entirely undefined for v1, inconsistent with the confirmed rename capability already given to Account and Category (Principle 5).
- **Consequences of Recommendation:** DF-02 moves from "Still Open / no confirmed accepted outcome" to Confirmed Behavior, removing one of the four acceptance-blocking items DBC §30 named.
- **Rules and Invariants Preserved:** Fund identity, Fund Balance, and Account-backed allocation breakdown are all unaffected by rename.
- **Rules Explicitly Not Introduced:** No uniqueness constraint (see DEC-NAME-03); no rename-frequency limit.
- **Impact on Correction and Recalculation:** None — rename is not part of Chronological Recalculation.
- **Impact on Traceability:** None — the Fund remains traceable as the same Fund across any rename.
- **Impact on Private Beta Scope:** Gives beta users a basic correction capability for Fund names consistent with what they already have for Accounts and Categories.
- **Architecture Boundary:** None specific.
- **Remaining Detail:** None.
- **Source References:** [PRD-14]; [PRD-28]; AM-06.
- **Approval State:** Pending Review

## 9. Deterministic Event Ordering Decision

### DEC-ORDER-01 — Same-Date Ordering

- **Decision ID:** DEC-ORDER-01
- **Decision Topic:** Deterministic Ordering of Financial Events Sharing One Event Date
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Financial Event; Event Date; Created Timestamp; Updated Timestamp; Chronological Recalculation.
- **Affected Behavior IDs:** IN-01, EX-01, TR-01/02, FA-01/02, FR-01/02, FX-01/02, DR-01/02/03, CR-01/02, LC-01/02, RC-01 — every behavior whose Chronological Recalculation could involve two or more events sharing one Event Date.
- **Current Confirmed Facts:** PRD confirms determinism itself is required — "when multiple Financial Events share the same user-selected event date, chronological recalculation must apply a deterministic, stable ordering... reproducible" — but explicitly defers the exact mechanism to domain modeling (PRD §16). PRD also confirms Created/Updated Timestamp never determine reporting period, and Updated Timestamp changes on every edit (PRD §16–17). The Session 21 specification itself additionally names this decision as an explicit required resolution for this session, independent of the general urgency already established by the confirmed determinism requirement.
- **Current Ambiguity:** What concrete rule breaks ties among same-date events, and how that rule behaves across backdated creation, Same-Type Edit, Event Replacement, Soft Deletion, and Restoration.
- **Options Considered:** (1) Event Date + immutable creation sequence. (2) Event Date + explicit user-controlled sequence. (3) Event Date + event timestamp (i.e., Updated Timestamp). (4) Event Date + stable Financial Event identity. (5) Reject all outcome-relevant same-date ambiguity (i.e., decline to define a rule and instead block any proposal whose outcome would depend on ordering among same-date events).
- **Recommended Resolution:** Event Date, plus each Financial Event's own immutable position in the workspace's chronological confirmation order, used only as a tiebreaker among events sharing one Event Date. This position is fixed at the moment the event first receives confirmed identity and is never altered by a Same-Type Edit (including an Event Date change that keeps the event on the same date). A Restoration reuses the trashed event's original confirmation position rather than being assigned a new one, so replaying history after a Restore reproduces the same order as before the deletion. An Event Replacement's new Financial Event — being a distinct identity — receives its own new confirmation position at the moment of replacement, ordered after every event that already existed at that moment and shares its date.
- **Domain Rationale:** Determinism requires a value that (a) never changes after assignment (ruling out option 3, Updated Timestamp, which the PRD explicitly separates from any ordering/reporting role and which mutates on every edit) and (b) does not require new user burden for every single event (ruling out option 2, which contradicts "simple by default" and would make ordinary recording slower for a case — same-date events — that is common and should stay invisible to the user). Option 5 (reject all outcome-relevant ambiguity) would leave Chronological Recalculation undecidable whenever two same-date events exist, which is itself a common, unavoidable case (e.g., recording several transactions in one sitting for the same day) — leaving it open contradicts Principle 3 (preserve deterministic historical recalculation) more directly than any of the other options. Options 1 and 4 converge: an event's "immutable position in the confirmation order" is precisely a stable identity-linked ordering fact, satisfying both framings at once without picking a specific technical mechanism (no sequence column, UUID, or database index is named).
- **Consequences of Recommendation:** Every behavior with Chronological Recalculation (§ above) becomes fully deterministic even when multiple events share an Event Date. Restoration and Replacement both have a defined, non-ambiguous position-assignment rule, closing AM-19 and BL-18's "exact mechanism open" gap.
- **Rules and Invariants Preserved:** Reproducibility of recalculated history (PRD §16); Updated Timestamp continues to never determine ordering or reporting period (PRD §16–17); Event Replacement continues to create a distinct new identity (PRD §16).
- **Rules Explicitly Not Introduced:** No sequence-column, auto-increment ID, UUID, or database-index design; no user-facing manual-ordering UI; no locking or concurrency-control mechanism.
- **Impact on Correction and Recalculation:** This decision is itself the mechanism Chronological Recalculation was missing — it is now fully specifiable: recalculation walks events in (Event Date, confirmation position) order from the earliest affected point forward.
- **Impact on Traceability:** Improves it — a same-date ordering explanation can now be given precisely ("this event was confirmed before/after that one on the same date") rather than left as an unexplained tie.
- **Impact on Private Beta Scope:** No UX change is required — ordinary users never see or set this value; it only matters for internal recalculation determinism.
- **Architecture Boundary:** Architecture chooses how "immutable confirmation position" is physically represented (e.g., an internal counter, a monotonic identifier, or another mechanism) — it must preserve immutability-after-assignment, must never let Updated Timestamp substitute for it, and must implement the stated Restoration/Replacement position rules exactly.
- **Remaining Detail:** None — this closes the mechanism gap completely at the domain level; only its physical representation is Architecture's to choose.
- **Source References:** [PRD-16]; [UL-Deterministic Same-Date Ordering]; AM-19; BL-18.
- **Approval State:** Pending Review

## 10. Transfer Decision

### DEC-TRANSFER-01 — Same Source and Destination Account

- **Decision ID:** DEC-TRANSFER-01
- **Decision Topic:** Transfer Whose Source and Destination Account Are the Same Account
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Transfer; Account.
- **Affected Behavior IDs:** TR-01 (Record Transfer); TR-02 (Correct Transfer).
- **Current Confirmed Facts:** A Transfer requires one source Account and one destination Account, both owner-scoped (PRD §11). The PRD describes Transfer as moving money "between two accounts" but states no explicit rule requiring them to differ (DCM §8, §18; AM-04).
- **Current Ambiguity:** Whether source = destination is accepted (as a no-op), converted into some other behavior, rejected outright, or excluded from v1 entirely.
- **Options Considered:** (1) Rejected before acceptance. (2) Accepted as a no-op (zero net effect, but still recorded as a Financial Event). (3) Converted into another behavior (e.g., silently treated as not a Transfer). (4) Transfer itself excluded from v1 pending this question (not seriously considered — Transfer is core v1 scope).
- **Recommended Resolution:** Rejected. A proposed Transfer whose source and destination Account are the same Account is not accepted; the source/destination requirement is read as source ≠ destination.
- **Domain Rationale:** A same-Account Transfer would produce no meaningful financial movement while still creating a Financial Event that Traceability (PRD §19) would need to explain — "money moved from BCA to BCA" is not a real financial event and would misrepresent history, directly contradicting the product's trust promise ("represent what actually happened," PRODUCT_IDENTITY.md §5). Accepting it as a no-op (option 2) still creates a spurious, explainable-only-as-a-non-event record; converting it (option 3) would silently reinterpret the user's stated intent, which the product principles reject (no silent reinterpretation of a user's recorded event). Rejection is the smallest rule that avoids both problems (Principle 5, Principle 7 read as "avoid misleading history").
- **Consequences of Recommendation:** TR-01/TR-02 close their conditional branch (AM-04) and become fully deterministic — any proposal with source = destination is blocked before any balance check, alongside the existing BL-02/BL-06-style reference validation.
- **Rules and Invariants Preserved:** Transfer remains one linked Financial Event; Workspace Total Balance remains unchanged by any accepted Transfer; no partial effect is ever created.
- **Rules Explicitly Not Introduced:** No new Event Type or Transfer sub-form for the same-Account case; no silent auto-conversion to a different behavior.
- **Impact on Correction and Recalculation:** A Same-Type Edit to TR-02 that would change either reference to equal the other is blocked the same way, under the same rule.
- **Impact on Traceability:** Prevents a class of unexplainable, zero-meaning history entries from ever being created.
- **Impact on Private Beta Scope:** A simple, well-understood validation message ("pilih dua akun yang berbeda") — a UX detail outside this register, but the underlying domain rule is now fixed.
- **Architecture Boundary:** None specific — pure domain rejection rule, already fully specified.
- **Remaining Detail:** None.
- **Source References:** [PRD-11]; [DCM-Transfer]; AM-04.
- **Approval State:** Pending Review

## 11. Expense Form and Correction Decision

### DEC-EXPENSE-01 — Ordinary versus Fund-Linked Expense Transition

- **Decision ID:** DEC-EXPENSE-01
- **Decision Topic:** Whether Adding/Removing a Dedicated Fund Reference on an Expense Is a Same-Type Edit or an Event Replacement
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Expense; Ordinary Expense; Fund-Linked Expense; Dedicated Fund; Account-Backed Fund Allocation; Same-Type Edit; Event Replacement.
- **Affected Behavior IDs:** FX-02 (Correct Fund-Linked Expense); CR-01 (Same-Type Edit Financial Event); CR-02 (Replace Financial Event with Different Event Type).
- **Current Confirmed Facts:** Ordinary Expense and Fund-Linked Expense are both confirmed to be the same Event Type (Expense) — "secondary classifiers of Expense, based on whether a Dedicated Fund reference is present — not members of the six-item Event Type set, and not separately identified concepts from Expense" (DOC §9; DBC §9). PRD confirms adding a Dedicated Fund reference changes which balance (Unallocated Amount vs. the matching allocation) the Expense draws from, but never changes the Event Type (PRD §11, §14). Whether this reference change is Same-Type Edit or Event Replacement is explicitly listed as unresolved (PRD §28; AM-05).
- **Current Ambiguity:** Whether adding or removing a Dedicated Fund reference on an existing Expense requires the guided Event Replacement flow (old event marked replaced, new event created) or is an ordinary Same-Type Edit (same event identity, fields updated).
- **Options Considered:** (1) Same-Type Edit — Event Type stays Expense throughout. (2) Event Replacement — treat the funding-source change as consequential enough to warrant a new linked identity. (3) Excluded from v1 (Expense's Fund reference becomes fixed at creation, never editable).
- **Recommended Resolution:** Same-Type Edit. Adding or removing a Dedicated Fund reference on an Expense — like changing its Account, Category, amount, or Event Date — remains a Same-Type Edit; the Financial Event's identity is preserved throughout. Explicitly: changing only the Account, only the Category, only the amount, only the Event Date, or changing one Dedicated Fund reference to a different Dedicated Fund, are all likewise Same-Type Edit.
- **Domain Rationale:** Event Replacement is reserved for a change in Event Type (e.g., Expense → Income) — a case where the confirmed required-reference shape itself changes to a different closed Event Type (PRD §16). Ordinary Expense and Fund-Linked Expense are not separate Event Types; they are the same Expense with an optional secondary reference present or absent (DOC §9). Treating this as Event Replacement would be disproportionate to what actually changed and inconsistent with DOC's own conclusion that these are "not separately identified concepts." The correction must still satisfy both the old form's reversal and the new form's forward validation as one atomic Chronological Recalculation step — exactly like any other Same-Type Edit reference change (e.g., changing the payment Account) — no special-case correction flow is needed.
- **Consequences of Recommendation:** FX-02, CR-01, and CR-02 close their conditional branch (AM-05) and become fully deterministic. A single, uniform Same-Type Edit rule now governs every field/reference change on Expense, Income, Transfer, and every other Event Type, with no Expense-specific carve-out.
- **Rules and Invariants Preserved:** Event Type remains Expense throughout; Expense is counted once regardless of form; no double counting; the matching allocation/Unallocated Amount invariants for both the reversed old form and the newly applied form must hold at every recalculated point.
- **Rules Explicitly Not Introduced:** No new "Fund-reference-change" correction flow separate from ordinary Same-Type Edit; no forced Event Replacement for this case.
- **Impact on Correction and Recalculation:** The edit reverses the old form's effect (Ordinary: restore Unallocated Amount; Fund-Linked: restore the matching allocation) and applies the new form's effect, both validated as part of one Chronological Recalculation pass from the earliest affected point — identical machinery to any other Same-Type Edit.
- **Impact on Traceability:** The single Financial Event's detail view continues to explain its current form and effect; no artificial old/new replacement link is created for what is, domain-wise, one continuous event.
- **Impact on Private Beta Scope:** Simplifies the correction UI — no separate guided flow is needed for this specific transition, reducing implementation and UX surface for v1.
- **Architecture Boundary:** None specific — a pure domain classification question, now fully resolved.
- **Remaining Detail:** None.
- **Source References:** [PRD-11]; [PRD-14]; [PRD-16]; [PRD-28]; [DOC-9]; AM-05.
- **Approval State:** Pending Review

## 12. Account-Backed Fund Allocation Decision

### DEC-ALLOC-01 — Allocation Domain Responsibility

- **Decision ID:** DEC-ALLOC-01
- **Decision Topic:** Which Candidate Domain Concept Is Responsible for Protecting Account-Backed Fund Allocation Rules
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Should Resolve Before Architecture
- **Affected Domain Concepts:** Account; Dedicated Fund; Account-Backed Fund Allocation.
- **Affected Behavior IDs:** FA-01/02 (Fund Allocation); FR-01/02 (Fund Release); FX-01/02 (Fund-Linked Expense).
- **Current Confirmed Facts:** Confirmed invariants require: (a) each Account-backed allocation amount ≥ Rp0; (b) the Account balance equation always holds; (c) no automatic cross-Account consumption; (d) Dedicated Fund's Fund Balance always breaks down per originating Account (PRD §9, §14). `AGGREGATE_CANDIDATES.md` §7/§10 already concludes this is shared, not single-owner, responsibility.
- **Current Ambiguity:** Which candidate concept (Account or Dedicated Fund) is domain-responsible for protecting which specific rule (AM-22; DOC §12/§19).
- **Options Considered:** (1) Account alone owns it. (2) Dedicated Fund alone owns it. (3) Shared responsibility, split by which rule each concept can evaluate from its own local facts.
- **Recommended Resolution:** Shared. Account is responsible for protecting its own current per-Fund allocation amount (never below Rp0) and its balance equation (Total = Unallocated + all current allocations it backs). Dedicated Fund is responsible for protecting that its Fund Balance always equals the traceable sum of its per-Account allocation amounts, and that no allocation is ever automatically drawn from a different Account than the one specified. Neither concept alone owns the relationship; a Fund Allocation, Fund Release, or Fund-Linked Expense must keep both sides reconciled as one indivisible accepted outcome (see DEC-AGG-05).
- **Domain Rationale:** `AGGREGATE_CANDIDATES.md` §7 already establishes Account can locally evaluate its own allocation non-negativity and equation, while §10 establishes Dedicated Fund can locally evaluate its cross-Account breakdown/Fund Balance — neither can locally evaluate the other's rule. Assigning single ownership to either concept would force it to reach into the other's local facts, contradicting the "invariant locality" test AGG itself applies (AGG §4).
- **Consequences of Recommendation:** Session 22 can write FA/FR/FX accept/reject logic by explicitly checking both the Account-local condition and the Fund-local condition, rather than searching for one owning concept that doesn't exist.
- **Rules and Invariants Preserved:** Balance equation; non-negative allocation; no cross-Account consumption; per-Account Fund Balance traceability.
- **Rules Explicitly Not Introduced:** No repository, transaction, or persistence ownership assignment; no single "Allocation Aggregate."
- **Impact on Correction and Recalculation:** FA-02/FR-02/FX-02 corrections must revalidate both the Account-local and Fund-local conditions at every point in the affected recalculated history.
- **Impact on Traceability:** Confirms both an Account's allocation history and a Fund's per-Account breakdown must independently reconcile to the same underlying Fund Allocation/Release/Fund-Linked Expense events.
- **Impact on Private Beta Scope:** None — this is a structural clarification with no user-facing effect.
- **Architecture Boundary:** Architecture is free to choose any persistence/module structure that keeps both the Account-local and Fund-local rules evaluated together on every accepted change; it must not silently pick one single "owner" that lets the other rule go unchecked.
- **Remaining Detail:** Final structural form (how this shared responsibility is embodied) is Architecture's translation, not a further domain decision.
- **Source References:** [PRD-9]; [PRD-14]; AGG-7; AGG-10; AM-22.
- **Approval State:** Pending Review

### DEC-ALLOC-02 — Allocation Identity

- **Decision ID:** DEC-ALLOC-02
- **Decision Topic:** Whether Account-Backed Fund Allocation Requires Independent Domain Identity
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Should Resolve Before Architecture
- **Affected Domain Concepts:** Account-Backed Fund Allocation.
- **Affected Behavior IDs:** FA-01/02, FR-01/02, FX-01/02.
- **Current Confirmed Facts:** No FIFO, LIFO, or allocation-lot relationship exists in v1; Fund Release and Fund-Linked Expense always draw from the current allocation amount for one Account–Fund pair, never from a specific historical Fund Allocation event (PRD §14, §16). DOC §12/§19 leaves independent identity explicitly "Still Open."
- **Current Ambiguity:** Whether the Account-Backed Fund Allocation relationship needs its own persistent identity, separate from being fully described by the (Account, Dedicated Fund) pair and its current derived amount.
- **Options Considered:** (1) Independent identity (each allocation "event contribution" tracked as its own record). (2) No independent identity — fully identified by the (Account, Fund) pair, value always current/derived.
- **Recommended Resolution:** No independent identity is needed in v1. The relationship is fully identified by the (Account, Dedicated Fund) pair; its value is always the current amount derived from that pair's Fund Allocation/Fund Release/Fund-Linked Expense history.
- **Domain Rationale:** The confirmed no-lot rule means no confirmed behavior ever needs to reference a specific historical allocation "instance" — every rule operates on the current aggregate amount for the pair. Introducing independent identity would create a concept with no confirmed behavior that uses it, contrary to Principle 9 (avoid adding concepts not required).
- **Consequences of Recommendation:** Confirms the (Account, Fund) pair is the correct and sufficient granularity for every FA/FR/FX rule; Architecture need not design an "allocation record" entity.
- **Rules and Invariants Preserved:** No-lot, no-FIFO/LIFO relationship (already Confirmed); per-Account, per-Fund current-amount evaluation.
- **Rules Explicitly Not Introduced:** No allocation-lot identity, no historical-allocation-event selection mechanism.
- **Impact on Correction and Recalculation:** Simplifies it — a correction to any FA/FR/FX event only ever needs to recompute the current amount for the affected (Account, Fund) pair(s), never resolve or re-link to a specific prior allocation instance.
- **Impact on Traceability:** The pair's current amount must still trace to its full Fund Allocation/Release/Fund-Linked Expense event history (already Confirmed) — this decision doesn't change that, only confirms no additional identity layer sits between the events and the derived amount.
- **Impact on Private Beta Scope:** None.
- **Architecture Boundary:** Architecture may still choose to store a derived/cached current amount per (Account, Fund) pair for performance, as long as it remains recomputable from the event history and is never treated as an independently editable or lot-selectable record.
- **Remaining Detail:** None.
- **Source References:** [PRD-14]; [PRD-16]; [DOC-12]; [DOC-19].
- **Approval State:** Pending Review

### DEC-ALLOC-03 — Source of Derived Fund Balance

- **Decision ID:** DEC-ALLOC-03
- **Decision Topic:** Whether Dedicated Fund Balance Is Directly Writable, Derived, or an Independently Protected Duplicate
- **Decision Status:** No Additional Decision Required
- **Decision Readiness:** No Resolution Needed
- **Affected Domain Concepts:** Dedicated Fund; Fund Balance; Account-Backed Fund Allocation.
- **Affected Behavior IDs:** FA-01/02, FR-01/02, FX-01/02, TC-02 (Explain Dedicated Fund Balance and Account Breakdown).
- **Current Confirmed Facts:** Fund Balance is already confirmed as "always derived from its events (Fund Allocation, Fund Release, linked Expenses, and their corrections/deletions/restorations) — never a directly editable number" (PRD §14; DOC §8), equal to the sum of current per-Account allocation amounts.
- **Current Ambiguity:** None remaining — this entry restates an already-settled question so it appears in the register alongside its siblings (DEC-ALLOC-01/02), rather than leaving a gap.
- **Options Considered:** Not applicable — already Confirmed by PRD.
- **Recommended Resolution:** Confirmed already: Fund Balance is derived only, equal to the sum of current Account-Backed Fund Allocation amounts across all backing Accounts. It is never directly writable and never an independently protected duplicate value.
- **Domain Rationale:** Restated for register completeness and to give Session 22 one place that cross-references all three allocation-family decisions (DEC-ALLOC-01/02/03) together.
- **Consequences of Recommendation:** None beyond documentation — no behavior changes.
- **Rules and Invariants Preserved:** Fund Balance = sum of current per-Account allocations (already Confirmed).
- **Rules Explicitly Not Introduced:** No separate writable Fund Balance field.
- **Impact on Correction and Recalculation:** Every FA/FR/FX correction recomputes Fund Balance as a pure function of its contributing events — never edited directly.
- **Impact on Traceability:** TC-02 must show the full per-Account breakdown that sums to the displayed Fund Balance.
- **Impact on Private Beta Scope:** None.
- **Architecture Boundary:** Architecture may cache Fund Balance for performance but must keep it recomputable from source events and never accept a direct edit to it.
- **Remaining Detail:** None.
- **Source References:** [PRD-9]; [PRD-14]; [DOC-8].
- **Approval State:** Pending Review

## 13. Candidate Aggregate Responsibility Decisions

### DEC-AGG-01 — Workspace Responsibility

- **Decision ID:** DEC-AGG-01
- **Decision Topic:** Whether Workspace Is a Full Financial Consistency Boundary, a Narrow Ownership/Configuration Boundary, or Ownership Scope Only
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Should Resolve Before Architecture
- **Affected Domain Concepts:** Workspace; User; Reporting Period configuration.
- **Affected Behavior IDs:** WB-01 (Establish Single-Owner Workspace); WB-02 (Establish Initial Workspace Configuration); every behavior that reads Workspace scope/isolation.
- **Current Confirmed Facts:** Exactly one User owns exactly one private Workspace in v1, with full isolation across accounts, balances, events, categories, funds, debts, reports, dashboard data, Trash, onboarding state, and exports (PRD §6, §20). `AGGREGATE_CANDIDATES.md` §6/§23 already evaluated three alternatives and recommended the "ownership plus selected configuration" framing as its Plausible-Candidate baseline, explicitly rejecting "Workspace as one large financial Aggregate."
- **Current Ambiguity:** Whether Workspace itself is domain-responsible for financial invariants (Rejected already by AGG), for ownership/isolation plus the single active Reporting Period configuration (AGG's Plausible baseline), or for ownership/isolation only, leaving Reporting Period configuration homeless (AGG's Alternative B).
- **Options Considered:** (1) Full financial consistency boundary (AGG's Rejected Candidate). (2) Narrow ownership/configuration boundary — owns single-owner cardinality, isolation, and exactly-one-active-Reporting-Period-configuration. (3) Ownership/scope only, with Reporting Period configuration placed elsewhere.
- **Recommended Resolution:** Option 2 — Workspace is a narrow ownership/configuration boundary: it protects exactly-one-owner/one-private-Workspace cardinality, full Workspace isolation, and the confirmed rule that exactly one Reporting Period configuration is active at a time. It is not a full financial consistency boundary and does not itself protect Account, Fund, Debt, or Financial Event monetary invariants.
- **Domain Rationale:** Adopts `AGGREGATE_CANDIDATES.md` §23's own Recommended Candidate Baseline directly — it already tested and rejected the oversized alternative (§6 Alternative A) as conflating containment with consistency, and it already tested and preferred this framing (§6 Alternative C) over ownership-only (§6 Alternative B) because ownership-only would leave Reporting Period's "exactly one active configuration" rule with no clear home.
- **Consequences of Recommendation:** WB-01/WB-02 are confirmed as scoped to ownership, isolation, and Reporting Period configuration selection only; Account/Fund/Debt/Financial Event invariants remain the responsibility of their own candidates plus the cross-boundary participation rules in DEC-AGG-05.
- **Rules and Invariants Preserved:** Single-owner cardinality; full Workspace isolation; exactly-one-active-Reporting-Period-configuration.
- **Rules Explicitly Not Introduced:** No "Workspace owns all financial state" rule; no Workspace-level financial invariant enforcement beyond configuration.
- **Impact on Correction and Recalculation:** None directly — Workspace itself is not chronologically recalculated; it only supplies the isolation scope and active configuration that other recalculations run within.
- **Impact on Traceability:** Confirms Workspace Total Balance is a derived, traceable aggregate over the Workspace's Accounts (already stated in DOC/DCM), not a Workspace-owned writable value.
- **Impact on Private Beta Scope:** None — purely structural.
- **Architecture Boundary:** Architecture may implement Workspace scoping/isolation however it wishes but must not fold Account/Fund/Debt/Event invariant enforcement into a "Workspace-owns-everything" persistence design merely for convenience.
- **Remaining Detail:** Final structural form is Architecture's translation of this narrow-boundary domain constraint.
- **Source References:** [PRD-6]; [PRD-20]; AGG-6; AGG-23.
- **Approval State:** Pending Review

### DEC-AGG-02 — Financial Event Responsibility

- **Decision ID:** DEC-AGG-02
- **Decision Topic:** Whether Financial Event Is a Domain Consistency Root, and for What
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Should Resolve Before Architecture
- **Affected Domain Concepts:** Financial Event; Event Type; Event Date; Same-Type Edit; Event Replacement; Soft Deletion; Restoration.
- **Affected Behavior IDs:** All Financial Event behaviors (IN, EX, TR, FA, FR, FX, DR, CR, LC).
- **Current Confirmed Facts:** A Financial Event's identity persists through Same-Type Edit, Soft Deletion, Trash, and Restoration; Event Replacement creates a distinct new identity linked to the old (PRD §11, §16). `AGGREGATE_CANDIDATES.md` §8 concludes Financial Event is a Plausible Candidate root for identity/form/lifecycle but "cannot independently validate the monetary effects it claims."
- **Current Ambiguity:** Whether Financial Event should be treated as a domain consistency root for its identity/lifecycle only, or also credited with independently protecting Account/Fund/Debt monetary invariants.
- **Options Considered:** (1) Root for identity, form, references, Event Date, and correction/lifecycle links only. (2) Root for identity plus full monetary-invariant protection. (3) Not a root at all — a pure identity-bearing concept governed entirely by referenced candidates.
- **Recommended Resolution:** Option 1. Financial Event is the domain consistency root for its own identity, Event Type/form, required references, Event Date, and correction/lifecycle links (Same-Type Edit, Event Replacement, Soft Deletion, Restoration). It must not be treated as independently able to protect Account, Dedicated Fund, or Debt Record monetary invariants — those remain the responsibility of the referenced candidates, evaluated jointly with Financial Event as one indivisible cross-boundary outcome (DEC-AGG-05).
- **Domain Rationale:** AGG §8 already tested this directly: Financial Event can plausibly protect its own identity/form/lifecycle from its own facts, but cannot alone prove sufficient Unallocated Amount, sufficient fund allocation, or non-overpaid debt — those checks need facts Financial Event does not itself own. Crediting it with more than identity/lifecycle would misstate what it can actually evaluate (AGG §4's "invariant locality" test).
- **Consequences of Recommendation:** Confirms every accept/reject rule that touches a monetary invariant (Unallocated Amount, allocation, Outstanding Principal) must be evaluated jointly by Financial Event plus its referenced Account/Fund/Debt Record, never by Financial Event in isolation.
- **Rules and Invariants Preserved:** Event identity through the correction lifecycle (already Confirmed); Event Replacement's distinct-new-identity rule.
- **Rules Explicitly Not Introduced:** No claim that Financial Event alone can validate balances/allocations/principal.
- **Impact on Correction and Recalculation:** Every Same-Type Edit/Event Replacement/Soft Deletion/Restoration must still jointly revalidate every referenced candidate, not just the event's own shape.
- **Impact on Traceability:** Confirms TC-05 (explain one event's effects) must draw on both the event's own identity/form and its referenced candidates' derived state.
- **Impact on Private Beta Scope:** None.
- **Architecture Boundary:** Architecture may structure Financial Event's identity/lifecycle representation as it sees fit but must not let it silently become the sole validator of monetary invariants it cannot locally evaluate.
- **Remaining Detail:** None beyond Architecture's structural translation.
- **Source References:** [PRD-11]; [PRD-16]; [PRD-19]; AGG-8.
- **Approval State:** Pending Review

### DEC-AGG-03 — Category Responsibility

- **Decision ID:** DEC-AGG-03
- **Decision Topic:** Whether Category Is an Independent Small Domain Boundary or Workspace-Owned Configuration
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Should Resolve Before Architecture
- **Affected Domain Concepts:** Category; Category Kind; Workspace.
- **Affected Behavior IDs:** CT-01…05.
- **Current Confirmed Facts:** Category has independent identity/lifecycle (create, rename, archive/hide, restore, permanently delete only if unused) with continuity that must survive rename/archive for historical Income/Expense references (PRD §13). `AGGREGATE_CANDIDATES.md` §9 identified the only reason it left this "Plausible" rather than resolved was the then-unconfirmed name-uniqueness question.
- **Current Ambiguity:** Whether Category is best modeled as its own small independent domain concept, or as data owned/configured by Workspace.
- **Options Considered:** (1) Independent Category candidate with its own identity/lifecycle. (2) Workspace-owned configuration (a list Workspace manages, with no independent identity of its own).
- **Recommended Resolution:** Option 1 — independent small domain concept. Category has its own identity and lifecycle (kind, name, archive/restore/delete) distinct from Workspace's ownership/scope role.
- **Domain Rationale:** DEC-NAME-02 (this register) resolves the exact blocker AGG §9 named ("sources do not confirm Category-name uniqueness... so no set-level uniqueness invariant can justify either model yet") by confirming no uniqueness is enforced — removing the one open fact that was keeping AGG from a firmer conclusion. With that resolved, Category's continuity requirement (surviving rename/archive for historical references, PRD §13) is a concept-level responsibility, not a mere configuration-list property, consistent with how DOC §6 already classifies Category as a Candidate Entity.
- **Consequences of Recommendation:** Category's identity/lifecycle rules (CT-01…05) are confirmed as belonging to Category itself, not routed through Workspace as a configuration container.
- **Rules and Invariants Preserved:** Kind immutability; reference resolvability after rename/archive; no-history-required-for-deletion rule.
- **Rules Explicitly Not Introduced:** No Workspace-level Category "ownership" mechanism beyond scope/isolation.
- **Impact on Correction and Recalculation:** None directly — Category lifecycle changes (archive/restore) are not chronologically recalculated financial state.
- **Impact on Traceability:** Historical Income/Expense events continue to resolve their Category reference through Category's own identity.
- **Impact on Private Beta Scope:** None.
- **Architecture Boundary:** Architecture chooses Category's persistence shape but must preserve its independent identity/lifecycle rather than flattening it into Workspace configuration data.
- **Remaining Detail:** None.
- **Source References:** [PRD-13]; AGG-9; DEC-NAME-02 (this register).
- **Approval State:** Pending Review

### DEC-AGG-04 — Reporting Configuration Responsibility

- **Decision ID:** DEC-AGG-04
- **Decision Topic:** Whether Reporting Period Configuration Belongs Within Workspace's Domain Responsibility or Remains a Separate Weak Candidate
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Should Resolve Before Architecture
- **Affected Domain Concepts:** Reporting Period; Calendar Month; Custom Monthly Cycle; Workspace.
- **Affected Behavior IDs:** WB-02; RP-01/02/03.
- **Current Confirmed Facts:** Exactly one Reporting Period configuration is active per Workspace at a time; a cycle change never modifies transaction dates, balances, or financial effects (PRD §17). `AGGREGATE_CANDIDATES.md` §6/§12/§23 classifies a separate "Reporting Configuration Aggregate" as a Weak Candidate with "no confirmed independent identity or lifecycle."
- **Current Ambiguity:** Whether Reporting Period configuration is an independent domain object or belongs inside Workspace's responsibility (AM-18).
- **Options Considered:** (1) Independent domain object with its own identity. (2) Inside Workspace's responsibility, with no independent identity beyond the configuration choice itself.
- **Recommended Resolution:** Option 2 — Reporting Period configuration belongs within Workspace's domain responsibility. Workspace is responsible for ensuring exactly one active configuration (Calendar Month or one Custom Monthly Cycle) at any time; Reporting Period itself has no independent identity or lifecycle beyond that Workspace-scoped choice.
- **Domain Rationale:** Directly adopts AGG's own conclusion (§12: "This supports configuration inside the Plausible Workspace candidate boundary... A separate Reporting Configuration Aggregate is a Weak Candidate") and DEC-AGG-01's confirmation that Workspace's narrow responsibility explicitly includes "the single active Reporting Period configuration."
- **Consequences of Recommendation:** WB-02/RP-01/02/03 are confirmed as governed by Workspace's own configuration responsibility rather than by an independent Reporting Period concept; closes the AGG-flagged gap about where configuration "lives."
- **Rules and Invariants Preserved:** One active configuration at a time; regrouping-only effect of a configuration change.
- **Rules Explicitly Not Introduced:** No independent Reporting Period identity, entity, or lifecycle.
- **Impact on Correction and Recalculation:** RP-03's regrouping remains scoped to Workspace configuration and derived reports only — underlying financial state is untouched (already Confirmed).
- **Impact on Traceability:** Report/dashboard views must reflect exactly one configuration's membership at any time, consistent with Workspace's single-active-configuration responsibility.
- **Impact on Private Beta Scope:** None.
- **Architecture Boundary:** Architecture may implement Reporting Period configuration as a value nested in Workspace or as a separate persisted record, as long as exactly-one-active-configuration and Workspace-scoped ownership are preserved.
- **Remaining Detail:** None — cross-reference DEC-REPORT-02 for the reporting-decisions group's parallel entry.
- **Source References:** [PRD-17]; AGG-6; AGG-12; AGG-23; AM-18.
- **Approval State:** Pending Review

### DEC-AGG-05 — Cross-Boundary Financial Responsibility

- **Decision ID:** DEC-AGG-05
- **Decision Topic:** The Domain Requirement That Transfer, Fund Operations, Debt Repayment, Correction, and Restoration Produce One Indivisible Outcome
- **Decision Status:** No Additional Decision Required
- **Decision Readiness:** No Resolution Needed
- **Affected Domain Concepts:** Financial Event; Account; Dedicated Fund; Debt Record; every cross-boundary behavior.
- **Affected Behavior IDs:** TR-01/02/03; FA-01/02; FR-01/02; FX-01/02; DR-01/02/03; CR-01/02; LC-01/02.
- **Current Confirmed Facts:** Already confirmed and restated on every row of `DOMAIN_BEHAVIOR_DECISION_TABLES.md` §25 (Cross-Boundary Participation Matrix): "Complete accepted meaning across all listed participants; no partial effect." PRD confirms this at the behavior level throughout §11, §14–16 (e.g., a Transfer never appears one-sided; a blocked correction leaves prior state unchanged).
- **Current Ambiguity:** None remaining — this entry restates an already-settled cross-cutting rule so it appears in the register for Session 22's direct use.
- **Options Considered:** Not applicable — already Confirmed.
- **Recommended Resolution:** Confirmed already: for every participating candidate concept in a cross-boundary behavior (Financial Event plus every referenced Account/Dedicated Fund/Debt Record), the domain requirement is that all participants accept the complete confirmed outcome together, or none of them may show any confirmed change. No participant may expose a confirmed partial outcome, and a blocked proposal leaves every participant's previously confirmed state completely unchanged.
- **Domain Rationale:** Restated for register completeness — it is the single rule underlying every "Blocked Outcome" row in the Rejection and Blocking Matrix and every "Complete accepted meaning... no partial effect" row in the Participation Matrix.
- **Consequences of Recommendation:** None beyond documentation — no behavior changes; Session 22 can cite this entry directly instead of re-deriving it from two other documents.
- **Rules and Invariants Preserved:** All-or-nothing acceptance; blocked-state preservation.
- **Rules Explicitly Not Introduced:** No coordinator, transaction manager, saga, or event-bus concept — this remains a domain outcome requirement, not a technical mechanism.
- **Impact on Correction and Recalculation:** Every correction/restoration must reverse/reapply its full multi-boundary effect atomically at the domain level.
- **Impact on Traceability:** Confirms every cross-boundary event's detail view (TC-05) must show all participants' effects together, never a partial one.
- **Impact on Private Beta Scope:** None.
- **Architecture Boundary:** Architecture chooses the concurrency/transaction mechanism that achieves this all-or-nothing outcome; it must not weaken it to eventual consistency or partial-then-reconciled acceptance.
- **Remaining Detail:** None.
- **Source References:** [PRD-11]; [PRD-14]; [PRD-15]; [PRD-16]; DBC-25.
- **Approval State:** Pending Review

## 14. Dedicated Fund Lifecycle and Goal Decisions

### DEC-FUND-01 — Archive with Non-Zero Fund Balance

- **Decision ID:** DEC-FUND-01
- **Decision Topic:** v1 Rule for Archiving a Dedicated Fund Whose Fund Balance Is Not Rp0
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Dedicated Fund; Fund Balance; Account-Backed Fund Allocation; Archive.
- **Affected Behavior IDs:** DF-04 (Archive Dedicated Fund); LC-04 (Archive Domain Reference).
- **Current Confirmed Facts:** Archiving a Dedicated Fund never silently releases, spends, deletes, or zeroes allocations (PRD §14). Account archival is already confirmed to require Total Account Balance exactly Rp0 (PRD §12).
- **Current Ambiguity:** Whether Fund archival is blocked until Fund Balance = Rp0, allowed with a warning, allowed unconditionally as lifecycle-only, or excluded from v1 (AM-08).
- **Options Considered:** (1) Block archive until Fund Balance = Rp0. (2) Allow with a warning regardless of balance. (3) Allow as lifecycle-only regardless of balance. (4) Exclude archive from v1 entirely.
- **Recommended Resolution:** Block archive until Fund Balance is exactly Rp0, mirroring the confirmed Account archive precondition. The owner must first use Fund Release to move each Account-backed allocation into that Account's Unallocated Amount (Fund Release alone never zeroes the Fund's *purpose*, only moves the money) before the Fund can be archived. No automatic release, spend, or zeroing ever occurs.
- **Domain Rationale:** Mirrors the already-confirmed Account precondition, giving the product one consistent "archive means zero first" mental model across Account and Dedicated Fund (Principle 4). It also avoids hidden automation (Principle 6) — an "allow with warning" or "allow unconditionally" rule would let an archived-but-still-allocated Fund's money sit in a now-hidden-from-new-events state, which is confusing and not required by any confirmed rule.
- **Consequences of Recommendation:** DF-04/LC-04 close their conditional branch (AM-08) for the Fund case and become fully deterministic: archive is blocked with an explanation whenever Fund Balance ≠ Rp0, exactly as Account archival already works.
- **Rules and Invariants Preserved:** No silent release/spend/zeroing (already Confirmed); Fund history preserved regardless.
- **Rules Explicitly Not Introduced:** No automatic Fund Release triggered by an archive attempt.
- **Impact on Correction and Recalculation:** None directly — archive eligibility is evaluated against current state, not recalculated history.
- **Impact on Traceability:** The blocked-archive explanation must show the current non-zero Fund Balance and its per-Account breakdown, consistent with TC-02.
- **Impact on Private Beta Scope:** Adds one explicit precondition message ("release Fund allocations first") — a UX detail outside this register; the underlying rule is now fixed.
- **Architecture Boundary:** None specific — a pure domain precondition, fully specified.
- **Remaining Detail:** None.
- **Source References:** [PRD-12]; [PRD-14]; [PRD-28]; AM-08.
- **Approval State:** Pending Review

### DEC-FUND-02 — Dedicated Fund Restoration

- **Decision ID:** DEC-FUND-02
- **Decision Topic:** Whether an Archived Dedicated Fund May Be Restored to Active Use
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Dedicated Fund; Archive; Restoration.
- **Affected Behavior IDs:** DF-05 (Restore Dedicated Fund); LC-05 (Restore Archived Domain Reference).
- **Current Confirmed Facts:** DF-05 is currently "Still Open" with no confirmed accepted outcome (DBC §5; AM-07). Account and Category restoration are both already confirmed (PRD §12, §13; UL-Restore).
- **Current Ambiguity:** Whether a Dedicated Fund can be restored to active (new-event-eligible) use after archiving, beyond "archiving preserves history."
- **Options Considered:** (1) Supported, mirroring confirmed Account/Category restoration. (2) Not supported in v1. (3) Deferred post-MVP.
- **Recommended Resolution:** Supported. An archived Dedicated Fund may be restored to active use, mirroring confirmed Account and Category restoration. Restoration changes no allocation amount, Fund Balance, or historical Financial Event reference — it only returns the Fund to eligibility for new Fund Allocation/Fund Release/Fund-Linked Expense references.
- **Domain Rationale:** Consistency with the already-confirmed sibling restoration rules for Account and Category (Principle 4); no invariant is threatened, since restoration is defined as a pure eligibility change with zero financial effect, exactly like Account/Category restoration already are.
- **Consequences of Recommendation:** DF-05 moves from "Still Open / no confirmed accepted outcome" to Confirmed Behavior, removing another of DBC §30's four acceptance-blocking items; LC-05's Fund-specific conditional branch (AM-07) also closes.
- **Rules and Invariants Preserved:** History/allocation preservation through archive and restore; Fund Balance unaffected by lifecycle state changes.
- **Rules Explicitly Not Introduced:** No automatic re-allocation or Fund Balance change on restore.
- **Impact on Correction and Recalculation:** None — restoration is a pure lifecycle-eligibility change, not a recalculated financial state change.
- **Impact on Traceability:** A restored Fund's full prior history (including from before it was archived) remains attached and explainable.
- **Impact on Private Beta Scope:** Gives beta users the ability to "un-retire" a purpose fund (e.g., resuming Qurban saving after a pause) without recreating it and losing history.
- **Architecture Boundary:** None specific.
- **Remaining Detail:** None.
- **Source References:** [PRD-14]; [PRD-28]; AM-07.
- **Approval State:** Pending Review

### DEC-FUND-03 — Target Amount Change or Removal

- **Decision ID:** DEC-FUND-03
- **Decision Topic:** Whether Target Amount May Be Added, Changed, or Removed After Allocation/Event History Exists
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Dedicated Fund; Target Amount; Financial Goal.
- **Affected Behavior IDs:** DF-03 (Set or Change Target Amount).
- **Current Confirmed Facts:** Target Amount is confirmed to be a planning marker only, never a hard cap — allocations may exceed it without being blocked (PRD §14). Whether it can be changed/removed after history exists is listed as unresolved (PRD §28; AM-09).
- **Current Ambiguity:** Whether adding, changing, or removing a Target Amount is restricted once Fund Allocation/Release/Fund-Linked Expense history exists against the Fund.
- **Options Considered:** (1) Freely changeable/removable at any time. (2) Restricted or blocked once history exists. (3) One-directional (can add/increase, cannot decrease/remove) once history exists.
- **Recommended Resolution:** Freely changeable or removable at any time, with no history-based restriction. Target Amount never affects Fund Balance, any Financial Event, or any confirmed invariant, so no invariant is ever threatened by changing or removing it, regardless of how much allocation history exists.
- **Domain Rationale:** Since Target Amount provably has zero effect on any protected invariant (it is explicitly non-cap, PRD §14), restricting its editability would be an arbitrary added rule unsupported by any source (Principle 9, Principle 11 — avoid disproportionate ambiguity/restriction not required by the domain).
- **Consequences of Recommendation:** DF-03 closes its conditional branch (AM-09) and becomes fully deterministic — Target Amount edits are accepted whenever the proposed value is a valid non-negative monetary amount (or removed), with no history-dependent check.
- **Rules and Invariants Preserved:** Target Amount remains a non-binding planning marker, never a cap, at every point in its history.
- **Rules Explicitly Not Introduced:** No lock on Target Amount after history exists; no minimum-value-relative-to-current-Fund-Balance rule.
- **Impact on Correction and Recalculation:** None — Target Amount is not part of Chronological Recalculation since it never affects a balance.
- **Impact on Traceability:** None beyond showing the current Target Amount value in Fund detail views.
- **Impact on Private Beta Scope:** Simplifies the Fund/goal editing UI — no special-case "locked after history" logic needed.
- **Architecture Boundary:** None specific.
- **Remaining Detail:** None.
- **Source References:** [PRD-14]; [PRD-28]; AM-09.
- **Approval State:** Pending Review

### DEC-FUND-04 — Goal Completion Representation

- **Decision ID:** DEC-FUND-04
- **Decision Topic:** Whether a Dedicated Fund/Financial Goal's "Completed" State Is Derived or Explicitly Writable
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Dedicated Fund; Financial Goal; Target Amount; Fund Balance.
- **Affected Behavior IDs:** DF-01 (Establish Dedicated Fund); DF-03 (Set or Change Target Amount); TC-02 (Explain Dedicated Fund Balance and Account Breakdown).
- **Current Confirmed Facts:** Financial Goal shares Dedicated Fund's identity entirely — it is not a separate concept (PRD §14; DOC §6). Target Amount is confirmed non-cap; allocations may exceed it, shown as "target exceeded" (PRD §14). PRD §23 already confirms a launch-time "noticing" item showing goal progress as a percentage (e.g., "Dana Qurban telah mencapai 60% dari target").
- **Current Ambiguity:** Whether "completed" (Fund Balance has reached or exceeded Target Amount) is an explicit writable domain state or a derived presentation (AM-10).
- **Options Considered:** (1) Derived only, computed at display time from Fund Balance vs. Target Amount. (2) Explicit writable state, set/cleared by some rule. (3) Excluded from v1 messaging.
- **Recommended Resolution:** Derived only. Completion is computed as Fund Balance ≥ Target Amount whenever a Target Amount is present; it is never an explicitly writable domain state.
- **Domain Rationale:** An explicit writable state would duplicate information already fully determined by two existing derived/confirmed values (Fund Balance and Target Amount), contrary to Principle 8 (prefer derived state over duplicated writable state). It is also consistent with Target Amount's confirmed non-cap nature — "completion" is not a gate on anything, just a factual comparison.
- **Consequences of Recommendation:** DF-01/DF-03 close their non-blocking-deferred completion-representation question (AM-10); TC-02/PRD §23's confirmed progress-percentage "noticing" item can be implemented as a pure computation with no additional stored state.
- **Rules and Invariants Preserved:** Target Amount remains non-cap; Fund/Goal share one identity.
- **Rules Explicitly Not Introduced:** No explicit "Goal Completed" flag or lifecycle state.
- **Impact on Correction and Recalculation:** None — completion is recomputed fresh from current Fund Balance and Target Amount whenever displayed; it is never a stored value that could go stale.
- **Impact on Traceability:** Completion status is always traceable to the same Fund Balance and Target Amount already shown in the Fund's detail view — no separate unexplained flag.
- **Impact on Private Beta Scope:** Supports the already-confirmed PRD §23 progress-percentage "noticing" item without adding new domain state.
- **Architecture Boundary:** None specific — a pure computed-value rule.
- **Remaining Detail:** None.
- **Source References:** [PRD-14]; [PRD-23]; [PRD-28]; [DOC-6]; AM-10.
- **Approval State:** Pending Review

### DEC-FUND-05 — Target Date

- **Decision ID:** DEC-FUND-05
- **Decision Topic:** Whether Dedicated Fund's Optional Target Date Ships in v1
- **Decision Status:** Defer Post-MVP
- **Decision Readiness:** Safe to Defer Post-MVP
- **Affected Domain Concepts:** Dedicated Fund; Target Date.
- **Affected Behavior IDs:** DF-01 (Establish Dedicated Fund).
- **Current Confirmed Facts:** PRD §14 lists an "optional target date" as part of the Dedicated Fund's minimum structure candidate list but explicitly marks "whether target date ships in v1's form" as unresolved (PRD §28).
- **Current Ambiguity:** Whether Target Date is included in the v1 Fund/goal form.
- **Options Considered:** (1) Included in v1. (2) Deferred post-MVP. (3) Excluded permanently.
- **Recommended Resolution:** Defer Post-MVP — Target Date does not ship in v1's Dedicated Fund form.
- **Domain Rationale:** Target Date adds no protected invariant (unlike Target Amount, it has no confirmed behavioral effect at all in the PRD beyond being listed as a possible field). Excluding it now is the smallest-rule choice (Principle 5) and matches the PRD's own framing as a "whether it ships" scheduling question rather than a confirmed v1 requirement. This is "Defer," not "Excluded from v1," because nothing in Product Identity or the PRD rules it out permanently — it may return in a near-future iteration once reminder/notification-adjacent behavior (explicitly not designed here) is considered.
- **Consequences of Recommendation:** DF-01's minimum structure for v1 is: name, optional Target Amount, current allocated balance (derived), active/archived state, optional note — without Target Date.
- **Rules and Invariants Preserved:** None affected — Target Date was never load-bearing for any invariant.
- **Rules Explicitly Not Introduced:** No reminder, notification, or deadline-tracking behavior of any kind.
- **Impact on Correction and Recalculation:** None.
- **Impact on Traceability:** None.
- **Impact on Private Beta Scope:** Reduces v1 Fund-creation form surface by one optional field.
- **Architecture Boundary:** None specific.
- **Remaining Detail:** A future session may reconsider Target Date once the product decides whether/how goal deadlines should be surfaced (e.g., as part of a later reflection/insight iteration, PRD §23's "post-launch iteration" sequencing).
- **Source References:** [PRD-14]; [PRD-28].
- **Approval State:** Pending Review

## 15. Debt Record Decisions

### DEC-DEBT-01 — Complete Permanent-Deletion Eligibility

- **Decision ID:** DEC-DEBT-01
- **Decision Topic:** Exact Domain Eligibility for Permanently Deleting a Debt Record
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Debt Record; Opening Outstanding Principal; Outstanding Principal; Debt Repayment.
- **Affected Behavior IDs:** DB-04 (Permanently Delete Debt Record).
- **Current Confirmed Facts:** Deleting a Debt Record is blocked while Debt Repayment events reference it — this much is confirmed (PRD §15). Beyond that single blocking condition, DB-04 is classified "Candidate Behavior" with "No confirmed accepted outcome" (DBC §5; AM-11) — the complete eligibility rule is undefined. Opening Outstanding Principal is itself correctable through DB-02, subject to Impact Preview and Chronological Recalculation (PRD §15–16, already Confirmed).
- **Current Ambiguity:** Whether a Debt Record with zero Debt Repayments but a non-zero current confirmed Opening Outstanding Principal (i.e., it represents a real liability that was simply never repaid via the app) is eligible for permanent deletion, and whether any other dependency besides Debt Repayment references matters.
- **Options Considered:** (1) Eligible whenever no Debt Repayment references it (ignoring Opening Outstanding Principal). (2) Eligible only if never repaid AND current confirmed Opening Outstanding Principal is Rp0 (mirrors the Account/Category/Fund "never carried real value/history" pattern). (3) Never eligible — Debt Records are permanent once created.
- **Recommended Resolution:** A Debt Record may be permanently deleted only when: (1) its current confirmed Opening Outstanding Principal is Rp0 — meaning the value as it stands after any accepted DB-02 correction, not necessarily the value entered at original establishment; (2) no Debt Repayment Financial Event has ever referenced it (already confirmed); (3) no other confirmed dependency references it. Current Outstanding Principal is consequently Rp0 as well, since it is derived from Opening Outstanding Principal plus zero repayments. A Debt Record whose current Outstanding Principal reached Rp0 only through actual repayments remains ineligible for permanent deletion, since real repayment history exists and must be preserved.
- **Domain Rationale:** Directly mirrors the already-confirmed pattern for every other "never used" deletion rule in the domain: Account permanent deletion requires Rp0 Opening Balance and no history (PRD §12); Category requires no transaction history (PRD §13); Dedicated Fund requires zero balance and zero event history (PRD §14). Applying the same "never carried real financial meaning" test to Debt Record (Principle 4 — one logical outcome across similar lifecycle decisions) is the natural completion of a pattern the PRD already establishes three times. Option 1 would incorrectly allow deleting a genuine, still-outstanding liability that simply hasn't been repaid yet — a clear loss of financial meaning (Principle 7). The eligibility test uses the *current confirmed* Opening Outstanding Principal, not the value as originally entered, because DB-02 already permits correcting a mistaken opening amount (e.g., an owner who enters Rp500.000 in error and corrects it to Rp0 has, at that point, a Debt Record whose confirmed starting state is Rp0); requiring knowledge of a since-superseded pre-correction value would demand data this register does not otherwise require the domain to retain, and DB-02's correction is itself already a confirmed, invariant-checked domain action — its result is simply the debt's current truth, not a fact requiring separate historical bookkeeping for this eligibility test.
- **Consequences of Recommendation:** DB-04 moves from "Candidate Behavior / no confirmed accepted outcome" to Confirmed Behavior — the last of DBC §30's four acceptance-blocking items closes. Eligibility depends only on the Debt Record's present confirmed state (current Opening Outstanding Principal, repayment history, other dependencies), never on a value it may have held before a correction.
- **Rules and Invariants Preserved:** Deletion never erases real repayment history (already Confirmed); Opening Outstanding Principal remains the domain's "did this ever represent a real liability" signal, mirroring Opening Balance's equivalent role for Account; DB-02's confirmed correction mechanism is unaffected and remains the only way to change Opening Outstanding Principal.
- **Rules Explicitly Not Introduced:** No time-based or current-principal-only eligibility rule beyond what is stated; no override for user-requested deletion of a real liability; no mandatory prior-value storage requirement — this decision does not require retaining or consulting any pre-correction Opening Outstanding Principal value.
- **Impact on Correction and Recalculation:** None directly — deletion eligibility is evaluated against current confirmed state and full repayment history, not a recalculated chronology. A DB-02 correction that changes Opening Outstanding Principal to or from Rp0 changes DB-04's eligibility going forward, evaluated fresh each time DB-04 is proposed.
- **Impact on Traceability:** A blocked-deletion explanation must state which specific condition failed (repayment history exists, or current confirmed Opening Outstanding Principal is non-zero), consistent with the "explain every blocking reason" requirement (PRD §19, §22).
- **Impact on Private Beta Scope:** Lets a user cleanly remove a Debt Record created by mistake (e.g., Rp0 opening principal, never used) while protecting every genuine liability's history.
- **Architecture Boundary:** None specific — a pure domain eligibility rule, fully specified.
- **Remaining Detail:** None.
- **Source References:** [PRD-15]; [PRD-28]; AM-11.
- **Approval State:** Pending Review

### DEC-DEBT-02 — Debt Status

- **Decision ID:** DEC-DEBT-02
- **Decision Topic:** Whether Debt Status (e.g., "Active"/"Paid Off") Is Derived, Explicitly Writable, or Excluded
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Should Resolve Before Architecture
- **Affected Domain Concepts:** Debt Record; Outstanding Principal.
- **Affected Behavior IDs:** DB-01 (Establish Opening Debt Record); DR-01 (Record Debt Repayment).
- **Current Confirmed Facts:** Outstanding Principal is already a confirmed derived value (PRD §15; DOC §8). Whether an explicit Active/Paid-Off status exists separately is listed as unresolved (PRD §28; AM-12).
- **Current Ambiguity:** Whether debt status is an explicit writable domain state or purely computed from Outstanding Principal.
- **Options Considered:** (1) Derived only (Paid Off when Outstanding Principal = Rp0, Active otherwise). (2) Explicitly writable state. (3) Excluded from v1 (no status concept surfaced at all).
- **Recommended Resolution:** Derived only — Debt status is computed from Outstanding Principal (Paid Off when Outstanding Principal = Rp0, Active otherwise); it is never an explicitly writable domain state.
- **Domain Rationale:** Outstanding Principal already fully and unambiguously determines status; a separate writable field would duplicate information the domain already derives, risking disagreement between the two (Principle 8: prefer derived state over duplicated writable state).
- **Consequences of Recommendation:** DB-01/DR-01 close their non-blocking-deferred status-representation question (AM-12); TC-03 (Explain Outstanding Principal) can present status as a pure computed label alongside the principal value.
- **Rules and Invariants Preserved:** Outstanding Principal remains the sole source of truth for a debt's remaining liability.
- **Rules Explicitly Not Introduced:** No explicit Active/Paid-Off state transitions or writable status field.
- **Impact on Correction and Recalculation:** None additional — status recomputes automatically whenever Outstanding Principal is recalculated.
- **Impact on Traceability:** Status is always traceable to the same Outstanding Principal value already shown in the Debt Record's detail view.
- **Impact on Private Beta Scope:** Supports a simple "Lunas" (Paid Off) label on the dashboard debt summary (PRD §18) without adding new domain state.
- **Architecture Boundary:** None specific — a pure computed-value rule.
- **Remaining Detail:** None.
- **Source References:** [PRD-15]; [PRD-18]; [PRD-28]; AM-12.
- **Approval State:** Pending Review

### DEC-DEBT-03 — Creditor/Lender Structure

- **Decision ID:** DEC-DEBT-03
- **Decision Topic:** Smallest v1 Representation for Creditor/Lender Information on a Debt Record
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Should Resolve Before Architecture
- **Affected Domain Concepts:** Debt Record.
- **Affected Behavior IDs:** DB-01 (Establish Opening Debt Record); DR-01 (Record Debt Repayment).
- **Current Confirmed Facts:** Debt Record's minimum confirmed structure is: debt name, opening outstanding principal, effective date, optional note (PRD §15). Whether creditor/lender is a separate field or folded into the name is listed as unresolved (PRD §28; AM-13).
- **Current Ambiguity:** Whether a distinct Creditor/lender concept or field is needed.
- **Options Considered:** (1) No separate field — the confirmed Debt Record name is sufficient (e.g., "Utang ke Bank XYZ" as the name itself). (2) A structured, independent Creditor concept. (3) A deferred optional field, added later. (4) Excluded permanently.
- **Recommended Resolution:** No separate field in v1. The confirmed Debt Record name (a single required text field) is sufficient to identify a debt, including who it's owed to if the user chooses to phrase the name that way; a distinct Creditor concept is not introduced.
- **Domain Rationale:** Smallest-rule principle (Principle 5) plus avoid-new-concepts principle (Principle 9): the confirmed minimum structure already accommodates creditor identification via the name field, and no confirmed behavior requires structured creditor data (e.g., no confirmed feature groups or filters debts by creditor).
- **Consequences of Recommendation:** DB-01/DR-01 close their non-blocking-deferred creditor-structure question (AM-13); Debt Record's v1 structure is confirmed as exactly the four fields PRD §15 already lists, with nothing added.
- **Rules and Invariants Preserved:** Minimal Debt Record structure (already Confirmed).
- **Rules Explicitly Not Introduced:** No separate Creditor entity, field, or relationship.
- **Impact on Correction and Recalculation:** None.
- **Impact on Traceability:** None beyond the existing name field's role in identifying the debt.
- **Impact on Private Beta Scope:** Keeps the inline debt-creation flow (PRD §15, "created inline without leaving the repayment recording flow") minimal.
- **Architecture Boundary:** None specific.
- **Remaining Detail:** Revisit if beta users request structured creditor tracking (e.g., for multiple debts to the same lender) — a future product decision, not foreclosed by this recommendation.
- **Source References:** [PRD-15]; [PRD-28]; AM-13.
- **Approval State:** Pending Review

### DEC-DEBT-04 — Debt Archive and Restore

- **Decision ID:** DEC-DEBT-04
- **Decision Topic:** Whether Debt Record Has an Archive/Restore Lifecycle in v1
- **Decision Status:** Excluded from v1
- **Decision Readiness:** Should Resolve Before Architecture
- **Affected Domain Concepts:** Debt Record.
- **Affected Behavior IDs:** None currently — no source behavior proposes Debt Record archive/restore.
- **Current Confirmed Facts:** LC-04 (Archive Domain Reference) and LC-05 (Restore Archived Domain Reference) name only Account, Category, and Dedicated Fund as archivable/restorable references (DBC §21) — Debt Record is never included. Debt tracking itself is confirmed optional at the workspace level (PRD §15): a user who no longer wants to track a debt can simply stop recording repayments against it.
- **Current Ambiguity:** Whether Debt Record should gain an archive/restore lifecycle analogous to Account/Category/Fund, since it was never explicitly addressed either way.
- **Options Considered:** (1) Supported, added for symmetry with Account/Category/Fund. (2) Intentionally absent — no archive/restore lifecycle for Debt Record in v1. (3) Deferred post-MVP.
- **Recommended Resolution:** Intentionally absent. Debt Record archive/restore is not part of v1; only deletion eligibility (DEC-DEBT-01) governs its lifecycle beyond ordinary use.
- **Domain Rationale:** No source ever proposes Debt Record archive/restore — inferring it purely from symmetry with Account/Category/Fund would invent a lifecycle state the domain never asked for (Principle 9). A paid-off or no-longer-tracked debt already has a working answer without needing "archive": its status is derived as Paid Off (DEC-DEBT-02) once Outstanding Principal reaches Rp0, and a debt that was never real is eligible for permanent deletion (DEC-DEBT-01) — together these cover the practical need without adding a new state.
- **Consequences of Recommendation:** Session 22 does not need to design DB-level archive/restore behaviors; Debt Record's confirmed lifecycle remains: establish, correct opening principal/date, accumulate repayments, optionally delete (if eligible per DEC-DEBT-01).
- **Rules and Invariants Preserved:** Debt tracking's optional, opt-in nature at the workspace level (already Confirmed).
- **Rules Explicitly Not Introduced:** No Debt Record archive/restore lifecycle, no new "excluded from new repayments" state beyond what derived status (Paid Off) already communicates.
- **Impact on Correction and Recalculation:** None.
- **Impact on Traceability:** None — a fully repaid Debt Record remains visible and explainable with its derived Paid Off status.
- **Impact on Private Beta Scope:** Avoids adding archive/restore UX for a fourth concept when the practical need is already met.
- **Architecture Boundary:** None specific.
- **Remaining Detail:** If beta feedback shows users want to explicitly hide fully paid-off debts from active views without deleting them, a future session may reconsider this as a presentation-level (not domain-level) filter, or introduce an archive rule then.
- **Source References:** [PRD-15]; [DOC-6]; DBC-21.
- **Approval State:** Pending Review

## 16. Correction, Trash, and Restoration Decisions

### DEC-LIFE-01 — Archived Reference during Financial Event Restoration

- **Decision ID:** DEC-LIFE-01
- **Decision Topic:** Whether Restoration May Use an Archived Account, Category, or Dedicated Fund Reference
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Financial Event; Restoration; Account; Category; Dedicated Fund; Archive; Total Account Balance; Fund Balance.
- **Affected Behavior IDs:** LC-02 (Restore Financial Event); LC-05 (Restore Archived Domain Reference).
- **Current Confirmed Facts:** Archiving does not retroactively invalidate events that already reference the archived concept — historical references remain preserved (DCM §15, already Confirmed). Restoration must revalidate current dependencies and every Financial Invariant (PRD §16). Account archival requires Total Account Balance = Rp0 as its precondition and its ongoing archived-state invariant (PRD §12). Whether an archived reference specifically blocks restoration is listed as unresolved (AM-14).
- **Current Ambiguity:** Whether a Trashed Financial Event that references an Account, Category, or Dedicated Fund now archived can still be Restored, whether that differs by which kind of concept is archived, and whether Restoration would make the referenced concept "active" again.
- **Options Considered:** (1) Restoration is blocked whenever any referenced concept is archived, uniformly across Account/Category/Fund. (2) Restoration is never blocked by archived status — historical resolvability alone suffices, uniformly across all three. (3) Restoration is allowed but never reactivates the archived concept, with concept-specific treatment of whether reapplying the trashed event's monetary effect would itself violate that concept's own archived-state invariant.
- **Recommended Resolution:** Option 3, applied per concept:
  - Historical references remain resolvable after archive for all three concepts (already Confirmed, DCM §15); this alone never blocks Restoration.
  - Restoring a Financial Event never implicitly restores (reactivates) an Account, Category, or Dedicated Fund; every monetary, date, lifecycle, and chronological invariant is still fully reevaluated at Restoration time.
  - For a referenced **Category**: an archived Category does not by itself block Restoration when all other invariants pass — Category has no monetary balance, so reapplying the event's effect cannot conflict with any archived-state invariant of the Category itself.
  - For a referenced **Account**: Restoration is accepted only if the resulting Account state continues to satisfy the archived-state invariant, including Total Account Balance = Rp0. Reapplying a trashed event's monetary effect against an archived Account would necessarily move that Account's Total Account Balance away from Rp0 (e.g., a trashed Income or Expense affecting that Account), which would leave the Account simultaneously archived and non-zero-balance — a contradiction of its own confirmed archival precondition. In that case, Restoration is blocked until the Account is explicitly restored through AC-04 first.
  - For a referenced **Dedicated Fund**: Restoration is accepted only if the resulting Fund state continues to satisfy the archived-state invariant, including Fund Balance = Rp0, by the same reasoning as Account. If reapplying the trashed event (a Fund Allocation, Fund Release, or Fund-Linked Expense) would move Fund Balance away from Rp0 while the Fund remains archived, Restoration is blocked until the Fund is explicitly restored through DF-05 first.
  - In every blocked case, the explanation names the specific archived Account or Dedicated Fund and directs the user to restore it explicitly through its own lifecycle behavior (AC-04 or DF-05) before retrying.
- **Domain Rationale:** This separates three genuinely different questions the prior draft of this decision conflated into one uniform answer: "can this old reference still be resolved" (already Confirmed: always yes, for all three concepts); "does restoring this event implicitly reactivate the concept it references" (never, for any of the three — reactivation is governed entirely by each concept's own AC-04/CT-04/DF-05 lifecycle behavior); and "can reapplying this event's effect coexist with the referenced concept's own archived-state invariant while it remains archived" (concept-specific — irrelevant for Category, which carries no balance; a genuine potential conflict for Account and Dedicated Fund, whose archival preconditions are balance-based and would otherwise be silently violated by a Restoration that ignores them).
- **Consequences of Recommendation:** LC-02's conditional branch (AM-14) closes with a concept-specific rule rather than one blanket answer. Category-referencing Restorations are never blocked on archived-status grounds. Account- or Dedicated-Fund-referencing Restorations are blocked exactly when reapplying the trashed event's effect would leave that Account/Fund both archived and non-zero — otherwise they proceed normally.
- **Rules and Invariants Preserved:** Historical reference resolvability after archive (already Confirmed) for all three concepts; the Account archival invariant (Total Account Balance = Rp0 while archived, PRD §12) and the equivalent Fund Balance = Rp0 archived-state invariant (DEC-FUND-01, this register) are never silently violated by a Restoration.
- **Rules Explicitly Not Introduced:** No implicit reactivation of an archived Account, Category, or Dedicated Fund as a side effect of restoring an unrelated Financial Event, under any circumstance.
- **Impact on Correction and Recalculation:** Restoration proceeds through its normal Chronological Recalculation revalidation; for Account/Fund references, that revalidation now explicitly includes the referenced concept's own archived-state balance invariant, not only the general non-negativity invariants.
- **Impact on Traceability:** A restored event's detail view continues to correctly identify its (possibly archived) referenced Account/Category/Fund by identity; a blocked Restoration's explanation names the specific archived concept and the invariant it would violate.
- **Impact on Private Beta Scope:** Prevents two failure modes: (a) a confusing block on a Category-only Restoration that has nothing to do with financial validity, and (b) a silent, invariant-violating Restoration that would leave an archived Account or Fund with a non-zero balance.
- **Architecture Boundary:** None specific — a pure domain eligibility clarification.
- **Remaining Detail:** None.
- **Source References:** [PRD-12]; [PRD-16]; [PRD-28]; [DCM-15]; AM-14; DEC-FUND-01 (this register).
- **Approval State:** Pending Review

### DEC-LIFE-02 — Trash Retention

- **Decision ID:** DEC-LIFE-02
- **Decision Topic:** v1 Trash Retention and Expiry Rule
- **Decision Status:** Defer Post-MVP
- **Decision Readiness:** Safe to Defer Post-MVP
- **Affected Domain Concepts:** Trash; Soft Deletion; Restoration; Permanent Deletion.
- **Affected Behavior IDs:** LC-01 (Soft Delete Financial Event); LC-02 (Restore Financial Event); LC-03 (Permanently Delete Trashed Financial Event).
- **Current Confirmed Facts:** Soft Deletion moves a Financial Event to a recoverable Trash state; PRD names "a defined retention period (30 days is the current preference)" but the exact day-count is explicitly listed as unresolved (PRD §16, §28). DEC-LIFE-03 (this register) excludes manual Permanent Deletion from v1 entirely.
- **Current Ambiguity:** Whether v1 has any time-based Trash expiry at all, and if so what happens once it elapses.
- **Options Considered:** (1) Fix a 30-day retention window now, with an undefined consequence once it elapses. (2) Leave retention length as a parameter while asserting *some* window and expiry consequence exists, deferring only the exact day-count. (3) v1 has no automatic expiry and no automatic or manual permanent deletion at all — a Trashed Financial Event remains recoverable indefinitely; the 30-day retention/expiry preference is deferred post-MVP as a complete, undesigned feature.
- **Recommended Resolution:** Option 3. In v1: a Trashed Financial Event remains recoverable indefinitely; v1 has no automatic Trash expiry; v1 has no automatic permanent deletion; v1 has no manual permanent deletion (DEC-LIFE-03). The 30-day retention/expiry preference named in PRD §16 is deferred post-MVP in its entirety — not merely its exact day-count — since v1 does not yet define what would occur once any such window elapsed.
- **Domain Rationale:** The prior draft of this decision asserted that "some defined recoverable window" exists in v1 while deferring only its day-count — but no source defines what happens when that window elapses (no automatic deletion is confirmed, and manual deletion is excluded by DEC-LIFE-03), so asserting a "window" without a consequence is an unresolved contradiction, not a domain rule. Stating plainly that v1 has no expiry at all removes that contradiction and is consistent with Principle 7 (avoid silent loss of history): with no expiry and no deletion path of any kind, a Trashed event's history can never be lost in v1. This is a scope decision about whether time-based Trash expiry ships at all, not merely an implementation parameter, so it is classified as Defer Post-MVP rather than Defer to Implementation Detail.
- **Consequences of Recommendation:** LC-01/LC-02 remain Confirmed exactly as already specified (Soft Deletion moves an event to a recoverable Trash state; Restoration reapplies it after revalidation) — with no time-based eligibility condition of any kind attached to either. LC-03 has no accepted outcome in v1 for either an automatic or a manual trigger (see DEC-LIFE-03).
- **Rules and Invariants Preserved:** Soft Deletion's reversibility and recoverability (already Confirmed) — strengthened, since v1 now guarantees that reversibility is never time-limited.
- **Rules Explicitly Not Introduced:** No specific day-count; no automatic expiry mechanism; no automatic permanent deletion triggered by elapsed time.
- **Impact on Correction and Recalculation:** None.
- **Impact on Traceability:** Strengthened — a Trashed event's supporting records remain permanently available in v1, with no risk of an undefined post-expiry state.
- **Impact on Private Beta Scope:** Removes an undesigned "what happens after 30 days" gap from v1's launch scope entirely, rather than carrying an ambiguous partial rule into Implementation.
- **Architecture Boundary:** None specific for v1, since no expiry or deletion mechanism exists to implement. A future post-MVP session must define both the retention length and its consequence together, as one complete decision, before Architecture designs any expiry mechanism.
- **Remaining Detail:** Full retention/expiry design (day-count and consequence) deferred to a future post-MVP session.
- **Source References:** [PRD-16]; [PRD-28]; DEC-LIFE-03 (this register).
- **Approval State:** Pending Review

### DEC-LIFE-03 — Manual Permanent Deletion from Trash

- **Decision ID:** DEC-LIFE-03
- **Decision Topic:** Whether Manual Permanent Deletion of a Trashed Financial Event Is Available in v1
- **Decision Status:** Excluded from v1
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Financial Event; Trash; Permanent Deletion.
- **Affected Behavior IDs:** LC-03 (Permanently Delete Trashed Financial Event).
- **Current Confirmed Facts:** LC-03 is currently "Still Open" with "No confirmed accepted outcome" (DBC §5; AM-16) — one of the four explicit acceptance-blocking items. Soft Deletion/Trash/Restoration (LC-01/LC-02) are fully Confirmed and already satisfy "deletion is not the default irreversible action" (PRD §16).
- **Current Ambiguity:** Whether a user may manually and permanently delete a Financial Event that is already in Trash, and if so, under what conditions.
- **Options Considered:** (1) Available, with some eligibility rule. (2) Excluded from v1 entirely. (3) Deferred post-MVP pending a decision.
- **Recommended Resolution:** Excluded from v1. Manual Permanent Deletion of a Trashed Financial Event is not available in Private Beta v1.
- **Domain Rationale:** Soft Deletion, Trash, and Restoration already fully satisfy the confirmed "non-destructive correction" and "deletion is not the default irreversible action" requirements (PRD §16) — nothing in the confirmed product scope requires an additional irreversible action. Adding manual permanent deletion would introduce a traceability-destroying, irreversible action (Principle 7: avoid silent loss of history) without a confirmed product need, and PRD explicitly treats it as a "Still undecided" question rather than a stated v1 commitment (PRD §28) — the burden of proof for adding an irreversible capability should fall on an explicit future decision, not a default inference.
- **Consequences of Recommendation:** LC-03 resolves from "Still Open / no confirmed accepted outcome" directly to "Excluded from v1" — Session 22 need not write any accept-path logic for it at all; a Trashed event simply has no permanent-deletion behavior to specify in v1. This is the fourth and last of DBC §30's acceptance-blocking items to close.
- **Rules and Invariants Preserved:** Trash remains a holding state, not a final state (already Confirmed); Soft Deletion's reversibility is total and unconditional in v1.
- **Rules Explicitly Not Introduced:** No manual permanent-deletion eligibility rule, retention-expiry trigger, or irreversible-action confirmation flow.
- **Impact on Correction and Recalculation:** None — this decision removes a behavior rather than adding recalculation scope.
- **Impact on Traceability:** Every Trashed event remains permanently traceable and restorable in v1 (subject only to LC-02's own current-state revalidation) — no traceability gap is ever created by manual deletion, because manual deletion does not exist.
- **Impact on Private Beta Scope:** Simplifies the Trash UI for v1 — no "permanently delete" action needs to be designed, reducing both implementation surface and the risk of accidental irreversible data loss during a private beta.
- **Architecture Boundary:** None specific — the behavior simply does not exist in v1.
- **Remaining Detail:** A future post-MVP session may introduce manual permanent deletion with an explicit eligibility rule (e.g., retention-expiry-based) once real usage patterns are observed.
- **Source References:** [PRD-16]; [PRD-28]; AM-16.
- **Approval State:** Pending Review

### DEC-LIFE-04 — Replaced-Event Visibility

- **Decision ID:** DEC-LIFE-04
- **Decision Topic:** Whether a Replaced Financial Event Appears in Ordinary History
- **Decision Status:** Defer to Implementation Detail
- **Decision Readiness:** Safe to Resolve During Implementation
- **Affected Domain Concepts:** Financial Event; Event Replacement.
- **Affected Behavior IDs:** CR-02 (Replace Financial Event with Different Event Type).
- **Current Confirmed Facts:** Event Replacement's old event is marked replaced, a new event is created, and both remain linked for Traceability — this is fully Confirmed (PRD §16). Whether the replaced (old) event appears in the ordinary history list, or only in its own detail/audit context, is listed as unresolved (PRD §28; AM-15).
- **Current Ambiguity:** List-placement/visibility of a replaced event in ordinary transaction history views.
- **Options Considered:** (1) Remains visible in ordinary history (marked as replaced). (2) Appears only through correction/history detail (hidden from the default list). (3) Hidden entirely (rejected — contradicts confirmed Traceability). (4) Left open for presentation while traceability is guaranteed regardless.
- **Recommended Resolution:** Option 4. Domain traceability (the old↔new link and full explainability via TC-05) is guaranteed regardless of presentation, whether or not the replaced event is shown in the default "ordinary" history list. This is classified as a UI/presentation choice, not a domain rule — Session 22 does not need to fix list-visibility to write deterministic accept/reject logic for CR-02.
- **Domain Rationale:** The domain guarantee (link preserved, fully explainable, no double-counting) is already completely specified and does not change based on where the replaced event appears in a list — visibility placement is purely how the information is presented, not what financial meaning is preserved (Principle 10).
- **Consequences of Recommendation:** CR-02 remains a fully Confirmed Behavior at the domain level; its non-blocking-deferred visibility question (AM-15) is explicitly separated out as a presentation choice for later UX work, not a blocker for Session 22.
- **Rules and Invariants Preserved:** The old→new replacement link is always preserved and always traceable (already Confirmed), regardless of list placement.
- **Rules Explicitly Not Introduced:** No specific list-visibility rule is fixed here.
- **Impact on Correction and Recalculation:** None — visibility is orthogonal to the recalculation that CR-02 already triggers.
- **Impact on Traceability:** Unaffected — traceability is guaranteed at the domain level independent of presentation.
- **Impact on Private Beta Scope:** None — this is deferred entirely to UX/Implementation.
- **Architecture Boundary:** None specific.
- **Remaining Detail:** List-placement UX chosen later, by product/UX work, not by this register.
- **Source References:** [PRD-16]; [PRD-28]; AM-15.
- **Approval State:** Pending Review

### DEC-LIFE-05 — Impact Preview Requirement

- **Decision ID:** DEC-LIFE-05
- **Decision Topic:** Domain-Level Rule for When Impact Preview Is Required
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Should Resolve Before Architecture
- **Affected Domain Concepts:** Impact Preview; Chronological Recalculation.
- **Affected Behavior IDs:** AC-06, AC-07, DB-02, DB-03, RP-03, CR-01, CR-02, LC-01, LC-02.
- **Current Confirmed Facts:** Impact Preview is confirmed as a required domain step for material historical changes (PRD §12, §15, §17), but the exact threshold for which changes require it is explicitly listed as unresolved across every behavior that touches it (PRD §28; AM-20). Every source consistently and unconditionally names AC-06/AC-07 (Account opening-state corrections), DB-02/DB-03 (Debt opening-state corrections), and RP-03 (Reporting Period changes) as Impact-Preview-bearing.
- **Current Ambiguity:** Whether ordinary Same-Type Edit (CR-01), Event Replacement (CR-02), Soft Deletion (LC-01), and Restoration (LC-02) always require Impact Preview, never require it, or require it only sometimes — and if sometimes, under what domain-level rule.
- **Options Considered:** (1) Always required for every correction of any kind. (2) Never required except the three unconditionally-named behaviors. (3) Conditionally required — triggered whenever the proposed change would cause Chronological Recalculation to reach beyond the single directly-edited record, with the trigger itself fixed at the domain level rather than left to Implementation.
- **Recommended Resolution:** Impact Preview is always required for AC-06, AC-07, DB-02, DB-03, and RP-03 (matching every source's consistent, unconditional naming of these five). For Same-Type Edit (CR-01), Event Replacement (CR-02), Soft Deletion (LC-01), and Restoration (LC-02), Impact Preview is required whenever the proposed change's Chronological Recalculation would reach state beyond the single directly-changed Financial Event — i.e., when a later event's validity or a later derived value depends on the outcome. A same-day, non-backdating field correction with no later dependent state does not require preview. **This trigger condition — which qualifying proposals require preview — is fully determined at the domain level by this decision; it is not a threshold Implementation may adjust.** What Implementation retains freedom over is presentation only: modal versus inline presentation, wording, layout, and confirmation wording. Implementation must not choose a different record-count or other threshold that would cause a qualifying behavior (one whose recalculation genuinely reaches beyond the directly-changed event) to skip Impact Preview.
- **Domain Rationale:** This derives a domain-level rule from the pattern already visible across every source: the behaviors that are *always* preview-bearing are exactly the ones whose earliest-affected point is a starting-state value (Opening Balance, Opening Outstanding Principal, their effective dates) or a workspace-wide reporting reconfiguration — both of which structurally always have the potential to reach far into history or across every report. Ordinary event-level corrections, by contrast, often affect nothing beyond the single record (e.g., correcting a typo in today's still-only Expense) — requiring Impact Preview universally for those would add friction disproportionate to their actual risk (Principle 11), while never requiring it would leave genuinely far-reaching edits unpreviewed, contrary to Principle 3 (preserve deterministic historical recalculation transparently). The trigger condition itself is fixed here, at the domain level, rather than described as an open "threshold" for Implementation to set, because a threshold that Implementation could freely narrow would risk silently skipping preview for a proposal that genuinely does reach beyond its own record — that would weaken Principle 3, not merely be a presentation choice.
- **Consequences of Recommendation:** Session 22 can now write a concrete, complete precondition clause for AM-20's affected behaviors: preview is required exactly when recalculation reaches beyond the directly-changed event (for CR-01/CR-02/LC-01/LC-02) or unconditionally (for AC-06/07, DB-02/03, RP-03) — no further domain input is needed to determine *whether* preview is required for any given proposal.
- **Rules and Invariants Preserved:** Impact Preview never replaces invariant enforcement — a previewed change can still be blocked at confirmation if any invariant would fail (already Confirmed). The trigger condition determining whether preview is required is a domain rule, not a tunable parameter.
- **Rules Explicitly Not Introduced:** No specific screen design or wording is fixed by this decision — those remain Implementation's to design, within the fixed trigger.
- **Impact on Correction and Recalculation:** Directly shapes how Session 22 sequences the "preview" step relative to Chronological Recalculation validation for each behavior, with the sequencing condition itself now fully specified.
- **Impact on Traceability:** Ensures a user is shown the actual affected records whenever a correction reaches beyond its own record, consistent with "explain every important number" (PRD §19).
- **Impact on Private Beta Scope:** Reduces unnecessary preview friction for low-risk, single-record corrections while preserving it, unconditionally at the domain level, for genuinely history-spanning changes.
- **Architecture Boundary:** Architecture/Implementation designs the actual preview presentation (modal vs. inline, wording, layout, confirmation wording); it must implement the fixed domain trigger exactly as stated above and must not substitute a different record-count or other threshold that could cause a qualifying proposal to skip preview.
- **Remaining Detail:** Presentation format and wording remain deferred to Implementation; the correction-reason requirement (DEC-LIFE-06) is a separate, already-resolved question.
- **Source References:** [PRD-12]; [PRD-15]; [PRD-16]; [PRD-17]; [PRD-28]; AM-20.
- **Approval State:** Pending Review

### DEC-LIFE-06 — Correction Reason

- **Decision ID:** DEC-LIFE-06
- **Decision Topic:** Whether a Correction Reason Is Required
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Safe to Resolve During Implementation
- **Affected Domain Concepts:** Correction; Same-Type Edit; Event Replacement; Impact Preview.
- **Affected Behavior IDs:** CR-01, CR-02, CR-03.
- **Current Confirmed Facts:** Whether high-impact corrections require a stated reason is listed as unresolved (PRD §16, §28; AM-21). No confirmed invariant depends on a correction reason existing.
- **Current Ambiguity:** Whether supplying a reason is required, optional, or unsupported for a correction.
- **Options Considered:** (1) Required domain fact for every correction. (2) Required only for "high-impact" corrections (whatever that threshold turns out to be). (3) Optional descriptive fact, never required. (4) Not captured at all.
- **Recommended Resolution:** Optional descriptive fact. A correction reason, when supplied, may be stored as part of the event's change metadata for later traceability/explanation, but is never required to accept a correction of any kind.
- **Domain Rationale:** No confirmed invariant is validated by, or depends on, a correction reason — requiring one would add friction not demanded by any accepted/blocked outcome (Principle 5, Principle 11). Making it optional (rather than "not captured at all") preserves the ability for a user or future feature to use it for explanation without forcing every correction through an extra required step, consistent with "simple by default, flexible when needed" (PRODUCT_IDENTITY.md §7).
- **Consequences of Recommendation:** CR-01/CR-02/CR-03 close their non-blocking-deferred reason-requirement question (AM-21) — no correction is ever blocked for lacking a reason.
- **Rules and Invariants Preserved:** The correction mechanism itself (Same-Type Edit identity preservation, Event Replacement's linked new identity) is entirely unaffected.
- **Rules Explicitly Not Introduced:** No mandatory-reason rule, even for high-impact corrections.
- **Impact on Correction and Recalculation:** None — reason is metadata, not a validated invariant.
- **Impact on Traceability:** When supplied, a reason adds to the explanation available for TC-05 (explain one event's effects); when absent, TC-05's explanation still fully satisfies traceability from the confirmed change metadata alone.
- **Impact on Private Beta Scope:** Keeps the correction flow fast for common, low-stakes edits.
- **Architecture Boundary:** Implementation designs the actual field/UI for capturing an optional reason.
- **Remaining Detail:** Field UI/placement chosen during Implementation.
- **Source References:** [PRD-16]; [PRD-28]; AM-21.
- **Approval State:** Pending Review

## 17. Reporting and Historical-Totals Decisions

### DEC-REPORT-01 — Reporting Period Application Timing

- **Decision ID:** DEC-REPORT-01
- **Decision Topic:** Whether a Changed Reporting Period Configuration Applies Retroactively, Prospectively, or from a Selected Effective Period
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Reporting Period; Calendar Month; Custom Monthly Cycle; Workspace.
- **Affected Behavior IDs:** RP-03 (Change Reporting Period Configuration).
- **Current Confirmed Facts:** Exactly one Reporting Period configuration is active per Workspace at a time (PRD §17). A cycle change "never modifies transaction dates, account balances, or the financial effect of any event — it only regroups historical summaries" (PRD §17). Application timing (immediate vs. next-session) is listed as unresolved (PRD §28; AM-17).
- **Current Ambiguity:** Whether a changed configuration regroups all historical Event Dates retroactively, applies only prospectively (new events only), or applies from some other selected effective period forward.
- **Options Considered:** (1) Fully retroactive — regroups all historical Event Dates under the new configuration. (2) Prospective only — old reports keep their old grouping, new events use the new configuration. (3) From a separately selected effective period forward — a hybrid split point.
- **Recommended Resolution:** Fully retroactive. A changed Reporting Period configuration regroups ALL historical report membership (every past Event Date) under the new configuration; it is never applied prospectively-only and never split at a separately selected effective period.
- **Domain Rationale:** This is a direct, near-forced consequence of two already-confirmed facts: (a) only one active configuration exists per Workspace at a time (PRD §17) — a prospective-only or split-effective-period model would require two silently coexisting grouping rules (an "old" rule for past periods and a "new" rule for future ones), which directly contradicts "one active cycle"; and (b) PRD's own wording says a change "regroups historical summaries" (not "future summaries"), which only makes sense under full retroactive regrouping.
- **Consequences of Recommendation:** RP-03 closes its conditional application-timing branch (AM-17) and becomes fully deterministic: on confirmation, every report/dashboard view immediately reflects the new configuration's grouping for all history, with no transaction, balance, or financial effect ever touched.
- **Rules and Invariants Preserved:** Event Dates, account balances, and every financial effect remain completely unchanged by a configuration change (already Confirmed); exactly one active configuration at a time.
- **Rules Explicitly Not Introduced:** No dual-grouping model, no per-period configuration history, no split-effective-date mechanism.
- **Impact on Correction and Recalculation:** RP-03 is confirmed to have Chronological Recalculation relevance — but only for derived reporting membership/totals, never for the underlying Financial Events or balances themselves.
- **Impact on Traceability:** Every displayed period must continue to show its exact start/end date range under the new configuration (already Confirmed); Incomplete Period flagging applies to any newly-formed period whose tracking history predates full coverage.
- **Impact on Private Beta Scope:** Simplifies both the domain model and the Impact Preview shown before confirming a cycle change (DEC-LIFE-05) — the preview only needs to show old-vs-new range membership, not a timeline of when each rule applied.
- **Architecture Boundary:** Architecture chooses how regrouped totals are computed/cached but must always compute them from the single currently-active configuration applied across all history — never a stored "which configuration was active on date X" history.
- **Remaining Detail:** Impact Preview presentation for RP-03 — including modal versus inline presentation, wording, layout, and confirmation wording — remains deferred to Implementation. Whether Impact Preview is required is already fixed: RP-03 always requires it.
- **Source References:** [PRD-17]; [PRD-28]; AM-17.
- **Approval State:** Pending Review

### DEC-REPORT-02 — Reporting Configuration Form

- **Decision ID:** DEC-REPORT-02
- **Decision Topic:** Whether Reporting Period Configuration Is Workspace Configuration, an Independent Domain Object, or a Derived Policy
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Should Resolve Before Architecture
- **Affected Domain Concepts:** Reporting Period; Workspace.
- **Affected Behavior IDs:** WB-02, RP-01, RP-02, RP-03.
- **Current Confirmed Facts:** Same as DEC-AGG-04 — exactly one active configuration per Workspace; AGG classifies a standalone Reporting Configuration Aggregate as Weak (AM-18).
- **Current Ambiguity:** Whether Reporting Period is best modeled as Workspace configuration, an independent domain object, or a derived policy.
- **Options Considered:** Same three options analyzed in DEC-AGG-04.
- **Recommended Resolution:** Workspace configuration — identical resolution to DEC-AGG-04, restated here for the reporting-decisions group's completeness. Reporting Period configuration is a value Workspace is responsible for keeping singular and valid; it is not an independent object with its own identity or lifecycle.
- **Domain Rationale:** Cross-referenced with DEC-AGG-04 — no separate reasoning is needed since this is the same underlying question viewed from the reporting-behaviors angle rather than the aggregate-candidates angle.
- **Consequences of Recommendation:** WB-02/RP-01/02/03 are confirmed as governed by one Workspace-scoped configuration value, closing AM-18.
- **Rules and Invariants Preserved:** One active configuration at a time; Calendar Month default; Custom Monthly Cycle's 1–28 start-day constraint.
- **Rules Explicitly Not Introduced:** No independent Reporting Period entity/identity.
- **Impact on Correction and Recalculation:** None beyond what DEC-REPORT-01 already specifies.
- **Impact on Traceability:** None additional.
- **Impact on Private Beta Scope:** None.
- **Architecture Boundary:** Same as DEC-AGG-04.
- **Remaining Detail:** None.
- **Source References:** [PRD-17]; AM-18; DEC-AGG-04 (this register).
- **Approval State:** Pending Review

### DEC-REPORT-03 — Archived Accounts in Historical Workspace/Reporting Totals

- **Decision ID:** DEC-REPORT-03
- **Decision Topic:** Whether Historical Period Totals Continue to Include Events from a Later-Archived Account
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Account; Archive; Reporting Period; Workspace Total Balance.
- **Affected Behavior IDs:** AC-03 (Archive Account); TC-04 (Explain Workspace and Reporting Totals).
- **Current Confirmed Facts:** Archiving preserves all financial history and only excludes the Account from selectors for new events (PRD §12, already Confirmed). Whether archived Accounts remain in historical Workspace/reporting-period totals is listed as unresolved (PRD §28; AM-25).
- **Current Ambiguity:** Whether a past-period total (e.g., "August's total Expense") continues to include events recorded against an Account that has since been archived.
- **Options Considered:** (1) Included — historical totals are unaffected by an Account's later archival. (2) Excluded — archived Accounts drop out of historical totals too.
- **Recommended Resolution:** Included. Historical period totals continue to include every event recorded against an Account that was later archived. Archiving only affects eligibility for NEW events; it never rewrites or excludes prior financial history from past-period totals.
- **Domain Rationale:** Excluding archived-Account history from past totals would silently change an already-reported number after the fact — a direct violation of Principle 7 (avoid silent loss/exclusion of history) and Principle 3 (preserve deterministic historical recalculation, which must remain stable regardless of an Account's later lifecycle state). A user who reported "August spending: Rp2,000,000" should never see that historical figure silently shrink because they later archived one of the Accounts involved.
- **Consequences of Recommendation:** AC-03/TC-04 close their conditional branch (AM-25, historical case) — historical Workspace/reporting totals are confirmed stable across an Account's later archival.
- **Rules and Invariants Preserved:** Archive never changes financial history (already Confirmed); Workspace Total Balance traceability to underlying records.
- **Rules Explicitly Not Introduced:** No retroactive total-recalculation triggered by archiving.
- **Impact on Correction and Recalculation:** None additional — archiving itself is not a Chronological Recalculation trigger (already Confirmed: "None" for AC-03's recalculation point).
- **Impact on Traceability:** Historical totals remain fully traceable and stable, satisfying "explain every important number" without an asterisk for archived Accounts.
- **Impact on Private Beta Scope:** Prevents a confusing, trust-damaging experience where archiving an Account retroactively changes a previously-reported number.
- **Architecture Boundary:** None specific — a pure domain-membership rule for historical aggregation.
- **Remaining Detail:** None.
- **Source References:** [PRD-12]; [PRD-28]; AM-25.
- **Approval State:** Pending Review

### DEC-REPORT-04 — Archived Accounts in Current Workspace Total Balance

- **Decision ID:** DEC-REPORT-04
- **Decision Topic:** Whether the Current Workspace Total Balance Includes an Archived Account
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Should Resolve Before Architecture
- **Affected Domain Concepts:** Account; Archive; Workspace Total Balance.
- **Affected Behavior IDs:** AC-03; TC-01 (Explain Derived Account Values); TC-04.
- **Current Confirmed Facts:** An Account can only be archived when its Total Account Balance is exactly Rp0 (PRD §12, already Confirmed, AC-03's precondition). Whether archived Accounts remain in the CURRENT Workspace Total is listed as unresolved (PRD §28; AM-25/AM-26).
- **Current Ambiguity:** Whether to sum an archived Account's (always-Rp0) Total Account Balance into the current Workspace Total, or explicitly exclude archived Accounts from the summed set.
- **Options Considered:** (1) Include archived Accounts in the summed set. (2) Explicitly exclude archived Accounts from the summed set.
- **Recommended Resolution:** One semantic rule, shared with DEC-REPORT-05: current Workspace Total Balance equals the sum of Total Account Balance across ALL existing Accounts in the Workspace, including archived Accounts. An archived Account contributes exactly Rp0 to this sum, because Account archival requires Total Account Balance = Rp0 as a precondition (AC-03, already Confirmed). This is stated as a single membership rule — "all existing Accounts" — not as an "include vs. exclude" choice with two equally valid readings.
- **Domain Rationale:** Because an archived Account is guaranteed to contribute Rp0 (the confirmed AC-03 precondition), stating the rule as "sum over all existing Accounts" is not merely the simpler of two numerically-equivalent options — it is the one rule that avoids ever implying a filtering step exists at all, which matters because DEC-REPORT-05 separately confirms no Account-exclusion mechanism of any kind exists in v1. Stating membership once, as "all existing Accounts," keeps DEC-REPORT-04 and DEC-REPORT-05 as a single consistent domain rule rather than two independently-justified but coincidentally-compatible answers. This is distinct from DEC-REPORT-03's historical-totals question, where inclusion and exclusion are NOT numerically equivalent (a past period can have non-zero contributions from an Account that is archived today).
- **Consequences of Recommendation:** TC-01/TC-04's current Workspace Total computation sums Total Account Balance across every existing Account in the Workspace, with no Account-lifecycle-state filtering step of any kind — archived Accounts are not a special case to be included or excluded, they are simply members of "all existing Accounts" whose contribution happens to be Rp0.
- **Rules and Invariants Preserved:** AC-03's Rp0-precondition for archival (already Confirmed) is what makes this rule behaviorally exact, not merely convenient.
- **Rules Explicitly Not Introduced:** No archived-Account exclusion filter, and no implication that Architecture may choose either "include" or "exclude" semantics — only one membership rule exists.
- **Impact on Correction and Recalculation:** None.
- **Impact on Traceability:** Workspace Total Balance remains traceable to the sum of all Account balances, with no unexplained filtering step and no ambiguity about which Accounts are "in."
- **Impact on Private Beta Scope:** None — behaviorally invisible to the user, since an archived Account never changes the displayed total.
- **Architecture Boundary:** Architecture may optimize the computation (e.g., caching, incremental sums) internally only if the resulting value and its traceability explanation preserve this same domain membership — summing Total Account Balance across all existing Accounts, with no separate include/exclude semantic. Architecture may not implement archived-Account exclusion as an internal optimization, even though it would be numerically silent today, because it would diverge from the single stated membership rule and could mislead a future reader of the implementation about what the domain actually requires.
- **Remaining Detail:** None.
- **Source References:** [PRD-12]; [PRD-28]; AM-25; AM-26; DEC-REPORT-05 (this register).
- **Approval State:** Pending Review

### DEC-REPORT-05 — User-Controlled Account Exclusion from Totals

- **Decision ID:** DEC-REPORT-05
- **Decision Topic:** Whether Users May Selectively Exclude an Account from Workspace/Dashboard Totals
- **Decision Status:** Excluded from v1
- **Decision Readiness:** Must Resolve Before Executable Domain Specification
- **Affected Domain Concepts:** Account; Workspace Total Balance; Dashboard.
- **Affected Behavior IDs:** TC-01; TC-04.
- **Current Confirmed Facts:** Workspace Total Balance must always be traceable to the individual account balances it includes (PRD §12, §18, already Confirmed). Whether user-controlled exclusion is allowed is listed as unresolved (PRD §28; AM-26).
- **Current Ambiguity:** Whether a user may mark a specific Account as excluded from the Workspace Total / dashboard summary while keeping it active (or archived) for other purposes.
- **Options Considered:** (1) Allowed — users can toggle Account inclusion in totals. (2) Excluded from v1 — no user-controlled exclusion mechanism exists; Workspace Total always sums all existing Accounts (DEC-REPORT-04).
- **Recommended Resolution:** Excluded from v1, applying the single membership rule stated in DEC-REPORT-04: current Workspace Total Balance equals the sum of Total Account Balance across all existing Accounts in the Workspace, including archived Accounts (which contribute Rp0 by their own archival precondition). No user-controlled Account exclusion of any kind is available in v1 — there is no toggle, flag, or setting that removes an Account from this sum while the Account continues to exist.
- **Domain Rationale:** Introducing per-Account user exclusion would directly risk PRD §19/§24's "dashboard/detail disagreement is release-blocking" rule — a user-hidden Account would create two different meanings of "the total" (with-exclusions vs. without) that would need careful, separate specification and labeling everywhere the total appears, which is a larger feature than v1's trust-first, traceability-first scope needs (Principle 11: exclude optional behavior introducing disproportionate ambiguity before Private Beta). Archiving (which already exists, requires Rp0 balance, and — per DEC-REPORT-04 — still contributes to the total, just at Rp0) remains the confirmed mechanism for removing an Account from active use; it is not repurposed here as a totals-exclusion mechanism, since it already has its own confirmed meaning.
- **Consequences of Recommendation:** TC-01/TC-04 close their non-blocking-deferred exclusion question (AM-26) and become fully deterministic: Workspace Total membership is simply "every existing Account," with no per-Account toggle to account for, and no distinction in principle between how active and archived Accounts contribute (both are summed; archived Accounts contribute Rp0 by precondition).
- **Rules and Invariants Preserved:** Workspace Total Balance traceability to a single, unambiguous set of contributing Accounts (already Confirmed) — reinforced by removing any possible second, exclusion-adjusted meaning of "the total."
- **Rules Explicitly Not Introduced:** No per-Account "exclude from totals" flag or toggle; no repurposing of Archive as a totals-exclusion mechanism.
- **Impact on Correction and Recalculation:** None.
- **Impact on Traceability:** Simplifies it — there is only ever one meaning of "the total," eliminating any risk of a with/without-exclusions disagreement.
- **Impact on Private Beta Scope:** A user who genuinely wants an Account out of new-event use uses Archive (which already requires Rp0 balance, ensuring no silent money-hiding, and which still contributes Rp0 to the total per DEC-REPORT-04); v1 does not need a second, weaker exclusion mechanism.
- **Architecture Boundary:** None specific — a pure domain-scope decision. Architecture must not introduce an exclusion mechanism as an implementation convenience, since none is confirmed to exist.
- **Remaining Detail:** A future session may reconsider this if beta users request it (e.g., for genuinely external/non-financial "accounts" they don't want counted) — not foreclosed by this recommendation.
- **Source References:** [PRD-12]; [PRD-18]; [PRD-19]; [PRD-24]; [PRD-28]; AM-26; DEC-REPORT-04 (this register).
- **Approval State:** Pending Review

### DEC-REPORT-06 — One-Off Reporting Ranges

- **Decision ID:** DEC-REPORT-06
- **Decision Topic:** Whether an Arbitrary One-Off Custom Date-Range Filter Is Needed
- **Decision Status:** Defer Post-MVP
- **Decision Readiness:** Safe to Defer Post-MVP
- **Affected Domain Concepts:** Reporting Period.
- **Affected Behavior IDs:** RP-02 (Use Custom Monthly Cycle) — RP-02 already excludes this from its own confirmed scope.
- **Current Confirmed Facts:** v1 supports Calendar Month and one optional Custom Monthly Cycle only (PRD §17, already Confirmed). Whether a fully custom one-off date-range filter is needed is listed as unresolved (PRD §17, §28).
- **Current Ambiguity:** Whether users can additionally filter/report over an arbitrary, non-recurring date range beyond the two confirmed recurring cycle types.
- **Options Considered:** (1) Included in v1 as an additional reporting mode. (2) Deferred post-MVP. (3) Excluded permanently.
- **Recommended Resolution:** Defer Post-MVP. Arbitrary one-off date-range reporting is not part of v1.
- **Domain Rationale:** v1's two confirmed reporting modes (Calendar Month default; one optional Custom Monthly Cycle) already fully satisfy the confirmed reporting requirements (period comparison, exact range display, traceability). Ad-hoc one-off ranges add scope not required for MVP trust/traceability goals (Principle 5, Principle 11) — and RP-02 itself, as already catalogued, already states "one-off ranges are open and not part of this behavior," so this decision formalizes an exclusion the behavior catalog already implicitly assumed.
- **Consequences of Recommendation:** Session 22 does not need to design one-off range-selection logic; RP-01/RP-02/RP-03 remain the complete v1 reporting-period behavior set.
- **Rules and Invariants Preserved:** One active configuration per Workspace at a time (unaffected — one-off ranges would have been an additive filter, not a configuration change, but are excluded regardless).
- **Rules Explicitly Not Introduced:** No ad-hoc date-range picker or filter behavior.
- **Impact on Correction and Recalculation:** None.
- **Impact on Traceability:** None — the two confirmed reporting modes remain fully traceable on their own.
- **Impact on Private Beta Scope:** Keeps v1's reporting surface to exactly the two confirmed modes.
- **Architecture Boundary:** None specific.
- **Remaining Detail:** Revisit post-MVP if beta users request ad-hoc range reporting.
- **Source References:** [PRD-17]; [PRD-28].
- **Approval State:** Pending Review

## 18. Traceability and Historical-Visibility Decisions

### DEC-TRACE-01 — Historical Names

- **Decision ID:** DEC-TRACE-01
- **Decision Topic:** Whether Reports Display an Account/Category/Fund/Debt's Current Name or Its Name at Event Time
- **Decision Status:** Defer to Architecture
- **Decision Readiness:** Safe to Resolve During Architecture
- **Affected Domain Concepts:** Account; Category; Dedicated Fund; Debt Record; Traceability.
- **Affected Behavior IDs:** TC-05 (Explain One Financial Event's Effects).
- **Current Confirmed Facts:** References remain resolvable after rename/archive — already Confirmed (DCM §15). Exact display presentation (current name vs. name-at-event-time) is listed as unresolved (TC-05's own "presentation... open" note).
- **Current Ambiguity:** When displaying a historical event or report, whether the referenced concept's CURRENT name or its name AT THE TIME of the event is shown, and whether that choice requires persisted historical-name data.
- **Options Considered:** (1) Always show the current name (looked up live, no snapshot needed). (2) Show the name as it was at event time (requiring a stored snapshot). (3) Leave the choice, including whether persistence is needed, to late Implementation work without an Architecture-level decision.
- **Recommended Resolution:** Neither option 1 nor option 2 is fixed by this decision — both remain domain-valid, since stable identity resolution (never event-time name) is what traceability actually requires. What this decision fixes is *when* the choice must be made: because option 2 is persistence-affecting (it requires storing a historical name value that option 1 does not), Architecture must decide, before finalizing persistence design, whether v1 uses current-name display only or optional historical-name storage. This is classified Defer to Architecture rather than Defer to Implementation Detail specifically because leaving it to late Implementation risks a persistence-model decision being made informally, without the deliberate review Architecture-level decisions receive.
- **Domain Rationale:** Stable identity resolution is mandatory and already Confirmed (a reference never breaks on rename/archive, DCM §15); event-time name retention is explicitly NOT a required v1 domain capability — nothing in the PRD or this register's traceability requirements demands it. No name-snapshot requirement is introduced by this document. The reason this decision graduates from "pure presentation, Implementation's to choose" to "Architecture must decide" is narrow and specific: option 2 has a persistence consequence (a new stored field/history) that option 1 does not, and persistence-affecting choices belong in Architecture's remit (Principle 12), not in unreviewed Implementation-time judgment calls, even though the underlying domain meaning is unaffected either way.
- **Consequences of Recommendation:** TC-05 remains Confirmed with "explanation matches event-form invariant" as its accepted effect regardless of which display option is chosen; Architecture must explicitly record its current-name-only vs. historical-name-storage choice as part of its persistence design, rather than letting it fall out implicitly from whatever an implementer happens to build.
- **Rules and Invariants Preserved:** Reference resolution never breaks on rename/archive (already Confirmed) under either display option.
- **Rules Explicitly Not Introduced:** No name-snapshot storage requirement is mandated by this document — Architecture may still choose current-name-only display, which requires no snapshot at all.
- **Impact on Correction and Recalculation:** None under either option.
- **Impact on Traceability:** None — traceability is satisfied by identity resolution under either option, independent of which name text is shown.
- **Impact on Private Beta Scope:** None directly, though the choice affects what data model Architecture commits to for v1.
- **Architecture Boundary:** Architecture must decide, before persistence design is finalized, whether v1 uses current-name display only or optional historical-name storage; it may choose either, since both satisfy the domain model, but it may not leave this undecided into Implementation as an incidental side effect of other choices.
- **Remaining Detail:** None beyond Architecture's decision.
- **Source References:** [PRD-19]; [DCM-15].
- **Approval State:** Pending Review

### DEC-TRACE-02 — Prior Values

- **Decision ID:** DEC-TRACE-02
- **Decision Topic:** Whether Prior Edited Field Values Must Be Retained for Same-Type Edits
- **Decision Status:** Defer to Architecture
- **Decision Readiness:** Safe to Resolve During Architecture
- **Affected Domain Concepts:** Financial Event; Same-Type Edit; Event Replacement; Traceability.
- **Affected Behavior IDs:** CR-01 (Same-Type Edit Financial Event); TC-05.
- **Current Confirmed Facts:** v1 requires only minimal change metadata: created timestamp, last-updated timestamp, edited/deleted/replaced flags, and a replacement link where applicable (PRD §16, already Confirmed). "Whether previous field values are stored internally even without a UI history view" is listed as unresolved (PRD §16, §28).
- **Current Ambiguity:** Whether every Same-Type Edit must retain the field's pre-edit value(s) internally, beyond the confirmed minimal metadata.
- **Options Considered:** (1) Required domain traceability — full prior-value history must be retained for every edit. (2) Required only for the Event Replacement old↔new link (already Confirmed regardless). (3) Deferred — Architecture chooses storage depth as long as the confirmed minimal metadata and Replacement link are intact.
- **Recommended Resolution:** Option 3. Only the Event Replacement old→new link is a confirmed domain requirement (already Confirmed, unaffected by this decision). Retaining full prior-field-value history for ordinary Same-Type Edits is NOT a confirmed v1 domain requirement — PRD's minimal-metadata list does not include a full value history. Architecture may choose to store or not store intermediate prior values for Same-Type Edit as a persistence/audit-design choice, as long as the currently confirmed minimal metadata (timestamps, flags, replacement link) remains intact.
- **Domain Rationale:** PRD explicitly scopes v1's required change metadata to a short, named list that does not include field-level history (PRD §16) — extending that list would be inventing a requirement beyond what's confirmed (Principle 5, Principle 9). Since this is purely a storage-depth question with no accept/reject or invariant consequence, it is safe to leave to Architecture rather than fix at the domain level.
- **Consequences of Recommendation:** CR-01 remains Confirmed at the domain level exactly as already specified; Architecture gains explicit permission to choose a lighter-weight metadata model for v1 without waiting on a further domain decision.
- **Rules and Invariants Preserved:** The confirmed minimal metadata list; the Event Replacement link (always required, unaffected).
- **Rules Explicitly Not Introduced:** No mandatory full-field-history requirement.
- **Impact on Correction and Recalculation:** None — recalculation operates on current/proposed values, not stored history.
- **Impact on Traceability:** TC-05's explanation continues to satisfy Traceability using only the confirmed minimal metadata plus current state; deeper history, if Architecture chooses to add it, is a bonus, not a requirement.
- **Impact on Private Beta Scope:** Keeps v1's metadata footprint minimal, consistent with "simple by default."
- **Architecture Boundary:** Architecture chooses storage depth for prior values; it must preserve the confirmed minimal metadata and the Replacement link regardless of what it chooses.
- **Remaining Detail:** None beyond Architecture's choice.
- **Source References:** [PRD-16].
- **Approval State:** Pending Review

### DEC-TRACE-03 — Dashboard/Detail Disagreement Precedence

- **Decision ID:** DEC-TRACE-03
- **Decision Topic:** When Dashboard/Detail Disagreement Blocks Acceptance vs. Blocks Release Only
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Should Resolve Before Architecture
- **Affected Domain Concepts:** Traceability; Dashboard; every accepted financial/reporting behavior.
- **Affected Behavior IDs:** TC-04 and, in principle, every behavior that produces a displayed summary number (all behaviors with an accepted outcome).
- **Current Confirmed Facts:** "A dashboard number that disagrees with its source detail is a release-blocking defect" (PRD §19, §24, already Confirmed). BL-20 records this as a confirmed blocker but leaves "when exactly" open.
- **Current Ambiguity:** Whether dashboard/detail disagreement blocks acceptance of the specific domain change that would cause it, blocks only overall release readiness, or both — and how these two apply depending on when the disagreement is detected.
- **Options Considered:** (1) Blocks acceptance only (pre-confirmation). (2) Blocks release readiness only (a QA/launch gate, never blocks an individual accepted change). (3) Both, with the applicable one depending on when the disagreement is detected.
- **Recommended Resolution:** Option 3 — both, depending on when detected. (a) If a disagreement would be the PREDICTABLE, DIRECT result of accepting a specific proposed domain change — i.e., detectable before confirmation, at the same evaluation step as any other invariant (matching BL-20's placement in the Candidate Evaluation Sequence, DDT §5 step 11) — acceptance of that specific change is blocked at the domain level, exactly like any other invariant violation. (b) If a disagreement is discovered AFTER the fact (e.g., an already-accepted historical state now displays inconsistently due to a bug or an unresolved edge case), it is a release-readiness defect, not a retroactive un-acceptance of the historical event — the already-confirmed state is never silently reversed, but release is blocked until the underlying defect is resolved.
- **Domain Rationale:** This preserves "release-blocking" exactly as PRD states it while giving Session 22 two concrete, distinct evaluation moments to encode, rather than one ambiguous rule that could be read as either "block every accept" (too strong — most accepts can't predict every downstream disagreement) or "never block an accept, only release" (too weak — contradicts treating it as an evaluated invariant at all, per BL-20's placement in the evaluation sequence).
- **Consequences of Recommendation:** TC-04 and every other behavior gain a concrete two-mode disagreement rule; Session 22 can encode pre-confirmation disagreement detection as an ordinary blocking condition, and post-hoc disagreement as a separate release-gate concern (already covered operationally by PRD §24.C, "Cross-View Consistency Is a Hard Launch Gate").
- **Rules and Invariants Preserved:** Release-blocking status of dashboard/detail disagreement (already Confirmed, unweakened).
- **Rules Explicitly Not Introduced:** No automatic retroactive un-acceptance of a historical event upon discovering a post-hoc disagreement.
- **Impact on Correction and Recalculation:** A correction that would predictably create a disagreement is blocked the same way any other invariant-violating correction is blocked.
- **Impact on Traceability:** Directly operationalizes "explain every important number" (PRD §19) as an evaluated condition, not just an aspirational principle.
- **Impact on Private Beta Scope:** Reinforces PRD §24's confirmed launch gate (Section C) with a concrete domain-level mechanism for the pre-confirmation half of it.
- **Architecture Boundary:** Architecture designs the actual detection/monitoring mechanism for post-hoc disagreement (e.g., consistency checks, tests); it must not weaken the release-blocking consequence when a disagreement is found.
- **Remaining Detail:** None at the domain level; monitoring/retry mechanisms are explicitly out of scope for this register (per Session 21 spec §25).
- **Source References:** [PRD-19]; [PRD-24]; BL-20.
- **Approval State:** Pending Review

## 19. Rejection and Blocking Precedence

### DEC-REJECT-01 — User-Facing Rejection Priority

- **Decision ID:** DEC-REJECT-01
- **Decision Topic:** Whether Exact Precedence Among Simultaneously-Triggered Blockers Is a Domain Decision
- **Decision Status:** Recommended for Approval
- **Decision Readiness:** Safe to Resolve During Implementation
- **Affected Domain Concepts:** Every confirmed blocking condition (BL-01 through BL-20).
- **Affected Behavior IDs:** All behaviors with any confirmed rejection condition.
- **Current Confirmed Facts:** Every one of the 20 confirmed blockers in `DOMAIN_BEHAVIOR_DECISION_TABLES.md` §26 is marked "User-Facing Priority Decided? No." The Candidate Domain Evaluation Sequence (DDT §5) is explicitly a reasoning order, not an error-priority contract, and states "another ordering can satisfy the product rules if it protects the same invariants, leaves rejected state unchanged, and never permits partial acceptance."
- **Current Ambiguity:** When a proposal simultaneously violates more than one confirmed blocking condition, which one is shown to the user first (or whether all are shown together).
- **Options Considered:** (1) A required domain decision fixing one canonical precedence order. (2) Safe for Application/UX specification — any presentation order is acceptable as long as every applicable blocker is still correctly evaluated. (3) Safe for implementation only, with no domain-level statement at all.
- **Recommended Resolution:** Option 2, stated as an explicit domain-level constraint plus an Implementation-level freedom: every confirmed blocker (BL-01 through BL-20) must still be evaluated wherever it is relevant to a proposal — no confirmed invariant may be silently skipped because a different blocker was found "first" for presentation purposes. Whichever blocker is chosen to be shown to the user first, the domain's underlying blocked-outcome guarantee (previously confirmed state remains completely unchanged) is identical regardless of which blocker is surfaced. Architecture/Application layers may choose any user-facing precedence order among simultaneously-triggered blockers, provided every one of them would still independently and correctly reject the proposal on its own.
- **Domain Rationale:** DDT §5 already establishes that the evaluation sequence itself is a reasoning aid, not a fixed contract — precedence among simultaneous blockers is exactly the kind of "another ordering is fine as long as invariants are protected" flexibility that document anticipates. Fixing one canonical order at the domain level would add a presentation-layer decision this register has no basis to make (no source ever ranks the 20 blockers relative to each other), while the domain-level constraint (every blocker must still be evaluated; the outcome guarantee never varies) is the part that genuinely matters and IS confirmed.
- **Consequences of Recommendation:** Session 22 can write independent accept/reject logic for every one of the 20 blocking conditions without needing to also define a master precedence table; the presentation layer (which single message a user sees when several problems exist at once) is explicitly left to later Implementation/UX work.
- **Rules and Invariants Preserved:** Every confirmed blocking rule (BL-01...BL-20) remains fully enforced regardless of presentation order; blocked-outcome state preservation is identical no matter which blocker is shown.
- **Rules Explicitly Not Introduced:** No canonical blocker-precedence ranking; no error-code or HTTP-status-adjacent priority scheme.
- **Impact on Correction and Recalculation:** None — this concerns presentation of an already-determined blocked outcome, not the outcome itself.
- **Impact on Traceability:** A blocked proposal's explanation may show one or several triggered reasons; traceability is satisfied as long as at least the applicable reasons are explainable, consistent with "clear explanation and next steps" (PRD §12 and throughout).
- **Impact on Private Beta Scope:** Gives Implementation freedom to choose the clearest single message for a first release without being locked into a domain-mandated ranking.
- **Architecture Boundary:** Application/UX layers choose presentation order; they must not let choosing an order cause any applicable blocker to go unevaluated.
- **Remaining Detail:** Presentation order chosen later, by Implementation/UX work.
- **Source References:** [PRD-16]; DDT-5; DDT-26 (Rejection and Blocking Matrix).
- **Approval State:** Pending Review

## 20. Decisions Deferred to Architecture

These decisions may be resolved during Architecture without changing any approved domain meaning. For each, the domain constraint Architecture must preserve is stated.

| Item | Domain Constraint Architecture Must Preserve |
|---|---|
| DEC-TRACE-02 — prior-field-value storage depth | Confirmed minimal change metadata (timestamps, flags) and the Event Replacement link must remain intact regardless of storage depth chosen. |
| DEC-TRACE-01 — current-name-only vs. optional historical-name storage | Stable identity resolution (never event-time name) must hold under either choice; Architecture must record its choice explicitly before finalizing persistence design, since option 2 (historical-name storage) is persistence-affecting and must not be decided informally during later Implementation. |
| Persistence form (tables, documents, key-value, event log, etc.) | Every confirmed invariant must remain evaluable and enforceable exactly as stated in this register and its source artifacts. |
| Transaction mechanism | All-or-nothing acceptance (DEC-AGG-05) must be preserved — no confirmed partial outcome may ever be exposed. |
| Repository/module boundaries | Must not silently redefine candidate-root responsibility (DEC-AGG-01…04, DEC-ALLOC-01) for persistence convenience. |
| Application coordination mechanism | Cross-boundary participation rules (DEC-AGG-05, DEC-ALLOC-01) must produce one indivisible logical outcome regardless of coordination technology chosen. |
| Derived-value storage vs. recomputation (e.g., Fund Balance, Outstanding Principal, Total Account Balance) | The derived value must always remain traceable to and consistent with its source events (DEC-ALLOC-03, DEC-DEBT-02); caching must never let a stored value silently diverge from its recomputed source. |
| Concurrency-control mechanism | Chronological Recalculation determinism (DEC-ORDER-01) must hold under concurrent access — no race condition may produce a non-deterministic same-date ordering result. |
| Identifier technology (e.g., how Financial Event's "immutable confirmation position," DEC-ORDER-01, is physically represented) | Must be immutable once assigned, and must implement the stated Restoration/Replacement position rules exactly. |
| API style | Must not leak internal candidate-boundary structure into contracts in a way that breaks the domain's all-or-nothing acceptance guarantee. |
| Caching | Any cached derived value (totals, Fund Balance, Outstanding Principal) must never be shown if it disagrees with its source detail (DEC-TRACE-03). |

Architecture must not redefine a genuine domain-semantic decision (any item classified Recommended for Approval in §8–§19 above) merely because implementing it is difficult — a real contradiction must return explicitly to domain review, not be silently resolved during Architecture.

## 21. Decisions Deferred to Implementation Detail

These do not alter domain meaning and require no Architecture-level approval.

| Item | Why It Is Implementation Detail |
|---|---|
| DEC-LIFE-04 — replaced-event list placement | Presentation only; the domain traceability guarantee (link + explainability) is unaffected either way. |
| DEC-LIFE-06 — correction-reason field UI | The domain rule (optional, never required) is fixed; only the capture UI is Implementation's to design. |
| DEC-REJECT-01 — blocker presentation order among simultaneous blockers | Presentation only; every blocker's independent evaluation is unaffected. |
| Impact Preview presentation (DEC-LIFE-05's remaining detail) | The domain rule for *when* preview is required is fully fixed at the domain level and is not Implementation-adjustable; only presentation — modal vs. inline, wording, layout, confirmation wording — is Implementation's to design. |
| Validation/error-message wording | Never resolved as a domain rule anywhere in this register; every blocked outcome's underlying rule is fixed, only its user-facing phrasing is Implementation's. |

## 22. Decisions Deferred Post-MVP

| Item | Why Not a v1 Blocker | Current Rule Applied Instead | What Might Require Revisiting |
|---|---|---|---|
| DEC-FUND-05 — Dedicated Fund Target Date | Adds no protected invariant; PRD frames it as a scheduling question, not a confirmed v1 requirement. | Dedicated Fund's v1 structure omits Target Date entirely. | A future reflection/insight iteration (PRD §23) that wants to surface goal deadlines. |
| DEC-REPORT-06 — one-off custom reporting ranges | v1's two confirmed reporting modes (Calendar Month, one Custom Monthly Cycle) already satisfy confirmed reporting requirements. | Only Calendar Month / Custom Monthly Cycle exist as reporting modes. | Beta feedback requesting ad-hoc range reporting. |
| DEC-LIFE-02 — Trash retention length and post-expiry consequence | With no automatic or manual permanent deletion in v1 (DEC-LIFE-03), a retention/expiry design has no behavior to attach to yet; asserting a window without a defined consequence would be an unresolved contradiction, not a domain rule. | Trashed Financial Events remain recoverable indefinitely; no automatic expiry. | A future post-MVP session that designs both the retention length and its post-expiry consequence together, before any expiry mechanism is built. |

## 23. v1 Exclusions

Confirmed exclusions from this session's own decisions:

- **DEC-LIFE-03 — Manual Permanent Deletion from Trash.** Soft Deletion/Trash/Restoration already satisfy non-destructive correction; adding manual permanent deletion would introduce unnecessary irreversible history loss. Per DEC-LIFE-02, v1 also has no automatic Trash expiry or automatic permanent deletion — a Trashed Financial Event remains recoverable indefinitely in v1.
- **DEC-REPORT-05 — User-controlled Account exclusion from Workspace/dashboard totals.** Would risk dashboard/detail disagreement without a confirmed product need; Archive already serves the "remove from new use" need, and (per DEC-REPORT-04) an archived Account still contributes to the total at Rp0 rather than being filtered out.
- **DEC-DEBT-04 — Debt Record archive/restore lifecycle.** No source proposes this lifecycle for Debt Record; derived debt status (DEC-DEBT-02) and the confirmed deletion-eligibility rule (DEC-DEBT-01) already cover the practical need without inventing a new lifecycle state.

Preserved from prior sessions (`docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §8, §28; `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`; `docs/domain/AGGREGATE_CANDIDATES.md` §21; `docs/domain/DOMAIN_BEHAVIOR_DECISION_TABLES.md` §29), not reopened or re-decided here:

- Shared Workspace editing, invitations, and household collaboration.
- Multiple owners per Workspace.
- Currencies other than Indonesian Rupiah (IDR).
- Workspace timezone selection (fixed to Asia/Jakarta).
- New debt borrowing/issuance as its own event (only repayment against an existing opening-balance debt is in scope).
- Automatic fund consumption across Accounts (no cross-Account auto-consumption).
- Multi-Account Fund-Linked Expense (one payment Account only).
- FIFO/LIFO allocation-lot consumption.
- Allocation lots as a domain concept (Account-Backed Fund Allocation has no lot identity — see DEC-ALLOC-02).
- Debt Repayment principal counted as Expense (only interest/penalties/fees are separate Expense events).
- Automatic money movement during archive (no auto-release/spend/zeroing — see DEC-FUND-01).
- Event sourcing or replay as a domain requirement.

No item above is invented as an exclusion merely because it is technically difficult — every exclusion is grounded in an already-confirmed PRD boundary or a recommendation made and justified in §8–§19 of this register.

## 24. Remaining Open Decisions

**None.** Every decision this session was scoped to analyze (§8–§19, 41 decisions total) received a grounded, sourced, Pending-Review recommendation. No decision in this register carries the status **Preserve Open**.

This does not mean every underlying question is finally settled — every recommendation above remains explicitly Pending Review, and several (e.g., DEC-NAME-01/02/03, DEC-DEBT-03, DEC-FUND-05) touch questions the PRD itself still lists under "Product Decisions Before Detailed Specification" (PRD §28). This register proposes a resolution for each; it does not claim product-owner authority to finalize them. If, upon review, any recommendation above should instead be held open pending further input, that recommendation's Decision Status should be changed to **Preserve Open** before this register is approved — no such change is made unilaterally here.

## 25. Impact on Domain Behavior

This section maps every decision that changes a catalogued behavior's accepted/blocked outcome — whether its status is **Recommended for Approval** or **Excluded from v1** — to the Behavior IDs it affects, the Decision Table it touches, and what specifically changes once the recommendation is reviewed and approved. Decisions deferred to Architecture, Implementation Detail, or Post-MVP without changing any behavior's current accepted/blocked shape are not listed here; they appear in §20–§22 instead. No content of `DOMAIN_BEHAVIOR_CATALOG.md` or `DOMAIN_BEHAVIOR_DECISION_TABLES.md` is rewritten by this session — this table only states the *effect* an approval would have on those already-written documents, for Session 22 to incorporate.

| Decision ID | Affected Behavior IDs | Affected Decision Table(s) | Accepted-Outcome Change | Blocked-Outcome Change | Recalculation Impact | Traceability Impact |
|---|---|---|---|---|---|---|
| DEC-NAME-01 | AC-01, AC-02 | DT-AC-01; shared AC-02 | No duplicate-name rejection branch remains | Removes a previously conditional rejection path | None | None |
| DEC-NAME-02 | CT-01, CT-02 | Shared CT tables | No duplicate-name rejection branch remains | Removes a previously conditional rejection path | None | None |
| DEC-NAME-03 | DF-01, DF-02 | Shared DF records | No duplicate-name rejection branch remains | Removes a previously conditional rejection path | None | None |
| DEC-NAME-04 | AC-02 | Shared AC-02 | Rename accepted at any post-onboarding time, not only during onboarding | None new | None | None |
| DEC-NAME-05 | DF-02 | Shared DF record | DF-02 becomes Confirmed; rename accepted, mirroring AC-02/CT-02 | None (was previously "no accepted outcome") | None | None |
| DEC-ORDER-01 | All chronological behaviors; RC-01 | DT-RC-01 and every recalculation-relevant table | Same-date tiebreak now fully specified for every accept path | Same-date ambiguity no longer blocks BL-18 | Recalculation walks (Event Date, confirmation position) deterministically | Same-date position is now explainable |
| DEC-TRANSFER-01 | TR-01, TR-02 | DT-TR-01; DT-TR-02 | N/A (this is a new rejection, not an acceptance) | Same-Account Transfer now has a defined, unconditional Blocked Outcome | None | Prevents meaningless zero-effect history from ever being created |
| DEC-EXPENSE-01 | FX-02, CR-01, CR-02 | DT-FX-02; DT-CR-01; DT-CR-02 | Fund-reference add/remove confirmed as Same-Type Edit acceptance path | Removes ambiguity about whether Replacement is required | Single Chronological Recalculation pass covers old-form reversal + new-form application | Single continuous event identity remains explainable |
| DEC-ALLOC-01 | FA-01/02, FR-01/02, FX-01/02 | Fund decision tables | Clarifies which candidate evaluates which condition (no new accept path) | None new | None | Clarifies which participant's facts ground each explanation |
| DEC-ALLOC-02 | FA, FR, FX family | Fund decision tables | Confirms no allocation-lot selection is ever needed (already the confirmed behavior) | None new | None | None |
| DEC-FUND-01 | DF-04, LC-04 | DT-DF-04; DT-LC-04 | None new | Non-zero-balance archive attempt now has a defined, unconditional Blocked Outcome | None | Blocked-archive explanation now shows current Fund Balance/breakdown |
| DEC-FUND-02 | DF-05, LC-05 | DT-LC-05; formerly still-open record | DF-05 becomes Confirmed; restoration accepted, mirroring AC-04/CT-04 | None (was previously "no accepted outcome") | None | None |
| DEC-FUND-03 | DF-03 | Shared DF table | Target Amount change/removal accepted at any time, no history-based restriction | Removes a previously conditional rejection path | None | None |
| DEC-FUND-04 | DF-01, DF-03 | Shared DF tables | Goal-completion display becomes a pure computed value, no new stored state | None new | None | Completion is now explainable as Fund Balance vs. Target Amount |
| DEC-DEBT-01 | DB-04 | DT-DB-04 | DB-04 becomes Confirmed with a full eligibility rule, mirroring AC-05/CT-05/DF-06 | Adds a defined rejection when the current confirmed Opening Outstanding Principal is non-zero, even at Rp0 current Outstanding Principal | None | Blocked-deletion explanation can now cite the specific failed condition, using present state only (no prior-value lookup) |
| DEC-LIFE-01 | LC-02, LC-05 | DT-LC-02; DT-LC-05 | Category-referencing Restoration accepted regardless of archived status; Account/Fund-referencing Restoration accepted only if the archived-state balance invariant (Rp0) still holds afterward | Adds a concept-specific rejection when reapplying the event would leave an archived Account/Fund with a non-zero balance | None new | Blocked-Restoration explanation now names the specific archived Account/Fund and the invariant it would violate |
| DEC-LIFE-02 | LC-01, LC-02, LC-03 | DT-LC-01; DT-LC-02; DT-LC-03 | LC-01/LC-02 confirmed with no time-based eligibility condition of any kind | LC-03 remains without an accepted outcome in v1 for any trigger, automatic or manual | None | Trashed events remain permanently available in v1, with no undefined post-expiry state |
| DEC-LIFE-03 | LC-03 | DT-LC-03 | N/A — behavior excluded entirely | LC-03 has no accept path in v1; effectively always "not offered" rather than evaluated | None | Every Trashed event remains fully traceable/restorable, since manual deletion never removes it |
| DEC-LIFE-05 | AC-06/07, DB-02/03, RP-03, CR-01/02, LC-01/02 | DT-AC-06; DT-AC-07; DT-DB-02; DT-DB-03; DT-RP-03; DT-CR-01; DT-CR-02; DT-LC-01; DT-LC-02 | Preview-required precondition now fully specified for every listed behavior, with no residual "threshold" left open to Implementation | N/A — this decision governs a pre-confirmation exposure step, not an accept/reject outcome itself | None additional | Ensures a user is shown affected records whenever recalculation genuinely reaches beyond the directly-changed event, with no risk of Implementation narrowing the trigger |
| DEC-REPORT-01 | RP-03 | DT-RP-03 | Full retroactive regrouping confirmed as the single accepted effect | Removes prospective/split-timing ambiguity | Recalculation scope is now "earliest changed reporting boundary" across all history | Old/new range display now unambiguous |
| DEC-REPORT-03 | AC-03, TC-04 | DT-AC-03; DT-TC-04 | Historical totals confirmed to always include archived-Account history | None new | None | Historical totals remain stable/traceable across an Account's later archival |
| DEC-REPORT-04 | AC-03, TC-01, TC-04 | DT-AC-03; DT-TC-01; DT-TC-04 | Current Workspace Total confirmed to sum all existing Accounts, including archived, as one membership rule | None new | None | Removes any implied filtering step from the total's explanation |
| DEC-REPORT-05 | TC-01, TC-04 | DT-TC-01; DT-TC-04 | Workspace Total membership confirmed as "all existing Accounts" (DEC-REPORT-04), no exclusion toggle of any kind | Removes a previously open feature-scope question | None | Eliminates any risk of a with/without-exclusion disagreement |

Behaviors not listed above (e.g., IN-01, EX-01, DR-01, and every behavior already Confirmed with no open branch this session touched) are unaffected by this register and remain exactly as `DOMAIN_BEHAVIOR_DECISION_TABLES.md` already specifies them.

Approved decisions from this register are intended to be incorporated into the next Executable Domain Specification (Session 22); this session does not itself modify `DOMAIN_BEHAVIOR_CATALOG.md` or `DOMAIN_BEHAVIOR_DECISION_TABLES.md`.

## 26. Recommended Domain Baseline

Every one of the 41 decisions in this register is listed under exactly one Decision Status category below.

**Recommended for Approval (30 decisions):** DEC-NAME-01, DEC-NAME-02, DEC-NAME-03, DEC-NAME-04, DEC-NAME-05; DEC-ORDER-01; DEC-TRANSFER-01; DEC-EXPENSE-01; DEC-ALLOC-01, DEC-ALLOC-02; DEC-AGG-01, DEC-AGG-02, DEC-AGG-03, DEC-AGG-04; DEC-FUND-01, DEC-FUND-02, DEC-FUND-03, DEC-FUND-04; DEC-DEBT-01, DEC-DEBT-02, DEC-DEBT-03; DEC-LIFE-01, DEC-LIFE-05, DEC-LIFE-06; DEC-REPORT-01, DEC-REPORT-02, DEC-REPORT-03, DEC-REPORT-04; DEC-TRACE-03; DEC-REJECT-01.

**No Additional Decision Required (2 decisions):** DEC-ALLOC-03; DEC-AGG-05. Both restate an already-Confirmed PRD/domain fact for register completeness rather than resolve a live ambiguity.

**Preserve Open (0 decisions):** None (see §24) — every decision this session analyzed received a grounded recommendation of some kind.

**Defer to Architecture (2 decisions):** DEC-TRACE-01 (Architecture must decide, before persistence design is finalized, between current-name-only display and optional historical-name storage); DEC-TRACE-02 (Architecture chooses prior-field-value storage depth beyond the confirmed minimal metadata).

**Defer to Implementation Detail (1 decision):** DEC-LIFE-04 (replaced-event list-placement presentation).

**Defer Post-MVP (3 decisions):** DEC-FUND-05 (Target Date); DEC-REPORT-06 (one-off custom reporting ranges); DEC-LIFE-02 (Trash retention length and post-expiry consequence, deferred as one complete undesigned feature, not merely a day-count parameter).

**Excluded from v1 (3 decisions):** DEC-LIFE-03 (manual Permanent Deletion from Trash); DEC-REPORT-05 (user-controlled Account exclusion from totals); DEC-DEBT-04 (Debt Record archive/restore lifecycle).

**Total: 30 + 2 + 0 + 2 + 1 + 3 + 3 = 41.**

**Domain constraints Architecture may not redefine**, extending `AGGREGATE_CANDIDATES.md` §23's own list with this session's new recommendations:

- The deterministic same-date ordering rule (DEC-ORDER-01) — Architecture may choose its physical representation but not its behavior (immutable position, Restoration reuses original position, Replacement gets a new position).
- Shared Account/Dedicated-Fund allocation responsibility (DEC-ALLOC-01) — Architecture may not silently assign single ownership that lets the other side's rule go unchecked.
- The narrow Workspace boundary, Financial-Event identity-only root, independent Category concept, and Workspace-scoped Reporting configuration (DEC-AGG-01…04) — Architecture may structure these however it wishes but must not fold them back into one oversized "Workspace owns everything" design.
- All-or-nothing cross-boundary acceptance (DEC-AGG-05) — never weakened to eventual consistency or partial acceptance.
- Every exclusion in §23 — Architecture must not reintroduce excluded behavior (e.g., manual Trash deletion, user-controlled total exclusion, Debt Record archive/restore) as an implementation convenience.
- v1's indefinite Trash retention (DEC-LIFE-02) — Architecture must not silently introduce an expiry mechanism; none is confirmed for v1.
- The unified Workspace Total membership rule (DEC-REPORT-04/DEC-REPORT-05) — sum over all existing Accounts, including archived; Architecture must not implement archived-Account exclusion as an internal optimization, even though it is numerically silent today.
- The Impact Preview trigger condition (DEC-LIFE-05) — fully fixed at the domain level for AC-06/07, DB-02/03, RP-03 (always) and CR-01/02, LC-01/02 (whenever recalculation reaches beyond the directly-changed event); Architecture/Implementation may design presentation only, never a different triggering threshold.
- Concept-specific archived-reference Restoration (DEC-LIFE-01) — Category-referencing Restoration is never blocked by archived status; Account/Fund-referencing Restoration is blocked when it would leave the referenced concept archived with a non-zero balance. Architecture must not collapse this into one uniform rule.
- Debt Record deletion eligibility uses only current confirmed state (DEC-DEBT-01) — Architecture must not require retaining or consulting a pre-correction Opening Outstanding Principal value.
- Fund/Debt lifecycle symmetry (DEC-FUND-01/02, DEC-DEBT-01) — the Rp0-precondition-for-archive and never-carried-real-value-for-deletion patterns must be preserved exactly as stated, not loosened for storage convenience.

This document does not begin Architecture; the constraints above are boundaries for that future work, not its content.

## 27. Session 22 Readiness

**Result: Ready with Named Non-Blocking Deferrals.**

All eighteen decisions classified **Must Resolve Before Executable Domain Specification** (§7) receive a concrete, sourced recommendation in §8–§19 above. Once reviewed and approved, none remains a genuine blocker to writing deterministic accept/blocked logic for all 55 catalogued behaviors in `DOMAIN_BEHAVIOR_CATALOG.md`. The four previously acceptance-blocking behaviors with no confirmed outcome at all (DF-02, DF-05, DB-04, LC-03) each now have a definite resolution (rename supported; restoration supported; deletion eligibility defined; manual deletion excluded).

**Named non-blocking deferrals** (do not block Session 22, but should be tracked): the Architecture-deferred items in §20 (prior-field-value storage depth; the current-name-only vs. historical-name-storage persistence decision; and the standard generic list); the Implementation-deferred items in §21 (replaced-event list placement, correction-reason UI, blocker presentation order, Impact Preview presentation/wording, validation-message wording); the Post-MVP-deferred items in §22 (Target Date; one-off reporting ranges; Trash retention length and its post-expiry consequence, deferred as one complete undesigned feature).

**No further broad domain-modeling analysis artifact is recommended.** This register, together with `AGGREGATE_CANDIDATES.md`, `DOMAIN_BEHAVIOR_CATALOG.md`, and `DOMAIN_BEHAVIOR_DECISION_TABLES.md`, is intended to be a sufficient domain baseline for Session 22 to draft the Executable Domain Specification directly.

## 28. PRD Traceability

| Decision Group (this document) | PRD Sections | PRODUCT_IDENTITY.md | UBIQUITOUS_LANGUAGE.md | DOMAIN_CONCEPT_MODEL.md | DOMAIN_OBJECT_CANDIDATES.md | AGGREGATE_CANDIDATES.md | DOMAIN_BEHAVIOR_CATALOG.md | DOMAIN_BEHAVIOR_DECISION_TABLES.md |
|---|---|---|---|---|---|---|---|---|
| Naming and Identity (§8) | §10, §12, §13, §14, §28 | — | §5, §7 (Account), §8 (Fund) | §7, §11 | §6, §15, §19 | §7, §9, §10 | AC-01/02; CT-01/02; DF-01/02 | AM-01, AM-02, AM-03, AM-06 |
| Event Ordering (§9) | §16 | — | §11 (Deterministic Same-Date Ordering) | §13, §15 | §19 | §13, §14, §22 | RC-01 | AM-19; BL-18 |
| Transfer (§10) | §11 | §5 (trust/represent-what-happened) | §6 (Transfer) | §8, §18 | — | §20 | TR-01/02 | AM-04 |
| Expense Form/Correction (§11) | §11, §14, §16, §28 | — | §6 (Expense forms) | §8 | §6, §9 | §7 | EX-01; FX-02; CR-01/02 | AM-05 |
| Allocation (§12) | §9, §14, §16 | — | §7, §8, §12, §14 | §7, §9, §15 | §12, §19 | §7, §10 | FA/FR/FX family | AM-22 |
| Aggregate Responsibility (§13) | §6, §9, §13, §17, §20 | §3 | §5 | §6, §11, §12 | §6 | §6, §8, §9, §12, §16, §23 | WB-01/02; CT family; RP family | AM-18 |
| Fund Lifecycle/Goal (§14) | §14, §23, §28 | §13 (traceable progress) | §8 | §7, §9 | §6, §12, §13 | §10 | DF-01…06 | AM-07, AM-08, AM-09, AM-10 |
| Debt (§15) | §15, §18, §28 | — | §9, §12 | §8, §10 | §6, §8 | §11 | DB-01…04; DR-01 | AM-11, AM-12, AM-13 |
| Correction/Trash/Restoration (§16) | §12, §13, §14, §16, §28 | §7 (correctable mistakes) | §11 | §13, §15 | §6, §11, §16 | §13 | CR-01…03; LC-01…05 | AM-14, AM-15, AM-16, AM-20, AM-21 |
| Reporting/Historical Totals (§17) | §12, §17, §18, §28 | — | §10 | §12 | §7, §10, §14, §19 | §6, §12 | WB-02; RP-01…03; TC-04 | AM-17, AM-18, AM-25, AM-26 |
| Traceability/Historical Visibility (§18) | §16, §19, §24 | §5, §13 | §5, §11 | §14, §15 | — | §14 | TC-01…05 | BL-20 |
| Rejection/Blocking Precedence (§19) | §12, §16 | — | — | §15 | — | §16 | All | §5, §26 (Rejection and Blocking Matrix) |

Every **Recommended for Approval** resolution in §8–§19 cites its supporting source facts directly in its own "Source References" field. Throughout this document, a **confirmed source fact** is stated as such and attributed to a specific PRD/domain section; a **domain inference** (e.g., DEC-REPORT-01's retroactive-timing conclusion, drawn from the "only one active cycle" cardinality) is explicitly marked as reasoning built on a confirmed fact, not the fact itself; and a **recommendation** is always labeled Recommended for Approval / Pending Review, never presented as already-confirmed. `docs/project/PROJECT_STATE.md` is never cited as the sole authority for any resolution in this document.
