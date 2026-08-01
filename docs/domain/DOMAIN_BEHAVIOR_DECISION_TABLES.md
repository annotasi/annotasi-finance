# Annotasi Finance Domain Behavior Decision Tables

## 1. Document Status

- **Status:** Candidate domain decision-table baseline for detailed review.
- **Session:** Session 20 — Domain Behavior Decision Tables and Candidate Boundary Participation Analysis.
- **Workflow stage:** Domain Modeling; Session 19 is complete and Architecture has not started.
- **Target scope:** Product-domain evaluation conditions, accepted/blocked outcomes, provisional candidate participation, recalculation, ambiguity, and traceability.
- **Source conflict result:** No conflict was found among the targeted authoritative product rules and the reviewed behavior baseline. Higher-priority sources govern if a later conflict is found.
- **Change boundary:** This document creates no implementation or Architecture decision and modifies no prior artifact.

## 2. Purpose

This artifact converts the reviewed 55-behavior catalog into explicit, reviewable product-domain decision logic. It exposes what facts are required, which provisional candidates supply them, which invariants accept or block a proposal, how correction/recalculation reaches later state, and which questions remain protected.

The tables are analysis aids. They are not program branching, error-priority contracts, workflow engines, or transaction designs.

## 3. Source of Truth and Decision Rules

- **[PRD]** `docs/product/ANNOTASI_FINANCE_MVP_PRD.md`, especially §§9, 11–17, 19, and 28.
- **[PI]** `docs/product/PRODUCT_IDENTITY.md` where ownership, privacy, trust, or product intent matters.
- **[UL]** `docs/domain/UBIQUITOUS_LANGUAGE.md`.
- **[DCM]** `docs/domain/DOMAIN_CONCEPT_MODEL.md`.
- **[DOC]** `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`.
- **[AGG]** `docs/domain/AGGREGATE_CANDIDATES.md`.
- **[DBC]** `docs/domain/DOMAIN_BEHAVIOR_CATALOG.md`.
- **[STATE]** `docs/project/PROJECT_STATE.md`, navigation only.

Confirmed PRD rules control confirmed outcomes. Candidate classifications and participation never become final merely through repetition. A blocked outcome leaves previously confirmed state unchanged. A multi-boundary accepted outcome is complete and all-or-nothing. An open branch is recorded, not resolved.

## 4. Decision-Table Vocabulary

- **Domain Decision Table:** Reviewable domain conditions, required facts, candidate participants, outcome, invariant, recalculation, and traceability consequence.
- **Condition Group:** One of the eleven permitted groups: Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Category or Type Compatibility; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency; Protected Open Decision.
- **Candidate Fact Provider:** Provisional boundary supplying evaluation facts, without implying data-loading, repository, or database ownership.
- **Candidate Invariant Evaluator:** Provisional boundary apparently able to evaluate a local rule, without finalizing that boundary.
- **Affected Candidate Boundary:** Provisional boundary whose confirmed state or derived meaning changes on acceptance.
- **Blocked Outcome:** Proposal not accepted; previously confirmed state remains unchanged.
- **Accepted Outcome:** Complete domain meaning accepted; partial multi-boundary acceptance is prohibited.
- **Candidate Domain Evaluation Sequence:** A reasoning order, not error priority, API validation order, performance strategy, or transaction sequence.
- **Acceptance-Blocking Open Decision:** No confirmed accepted outcome exists until the unresolved domain decision is made. Evaluation stops for that behavior and previously confirmed state remains unchanged.
- **Conditional Open Branch:** The proposal actually reaches a named unresolved condition. Evaluation stops only for that proposal; proposals that do not reach the condition continue through confirmed rules.
- **Non-Blocking Deferred Detail:** An unresolved presentation, metadata, retention, participation-responsibility, or similar detail that does not alter the confirmed domain accepted/blocked outcome. It remains documented but creates no stopping decision-table row.
- **Traceability:** The accepted or blocked reasoning remains reconcilable to supporting domain records.

## 5. Candidate Evaluation Sequence

The sequence below is explicitly a **Candidate Domain Evaluation Sequence**. The PRD confirms the rules, not this exact order. Another ordering can satisfy the product rules if it protects the same invariants, leaves rejected state unchanged, and never permits partial acceptance.

| Step | Candidate reasoning step | Why meaningful | Candidate fact providers | Failure blocks immediately? | Another valid order possible? | What remains open |
|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | Prevents cross-owner meaning before financial evaluation. | Workspace | Candidate yes | Reference/shape checks could precede without changing product truth. | User-facing rejection priority |
| 2 | Reference Existence | Avoids evaluating facts from absent concepts. | Referenced candidates | Candidate yes | May be combined with lifecycle eligibility. | Exact rejection precedence |
| 3 | Lifecycle Eligibility | Ensures references are eligible for the proposed behavior. | Account; Category; Fund; Debt; Financial Event | Candidate yes | Could be evaluated with reference existence. | Archived-reference restoration |
| 4 | Behavior Shape and Required References | Confirms event form and cardinality. | Financial Event; reference candidates | Candidate yes | Type compatibility may be checked concurrently. | Expense Fund-reference correction classification |
| 5 | Type and Category Compatibility | Keeps Category descriptive and kind-correct. | Financial Event; Category | Candidate yes | Could precede lifecycle where facts are already known. | User-facing priority |
| 6 | Effective-Date Validity | Applies cross-boundary Account/Debt date constraints. | Financial Event; Account; Debt Record | Candidate yes | May be evaluated alongside monetary chronology. | Same-date mechanism |
| 7 | Monetary Sufficiency | Prevents negative Account allocation or principal state. | Account; Dedicated Fund; Debt Record | Candidate yes | Local invariants may be evaluated in the same domain pass. | Competing shortfall priority |
| 8 | Local Invariants | Protects Account equations, principal, and lifecycle-local rules. | Account; Debt Record; Category; Fund candidates | Candidate yes | Could precede some sufficiency checks if logically equivalent. | Final candidate evaluator |
| 9 | Cross-Boundary Invariants | Reconciles one indivisible meaning across participants. | All participating candidates | Candidate yes | Some reconciliation can occur alongside local checks. | Final coordination responsibility |
| 10 | Chronological Recalculation Across Later Affected State | Validates every later point after historical change. | Affected Account/Fund/Debt/Event candidates | Candidate yes | Date and monetary checks may interleave chronologically. | Same-date order and rejection precedence |
| 11 | Traceability and Cross-View Consistency | Prevents accepting an unexplained or disagreeing result. | All participants and reporting meaning | Candidate yes | Could be continuously accumulated rather than last. | Presentation and prior-value retention |
| 12 | Accept Complete Domain Outcome | Accepts only after applicable conditions pass. | All affected candidates | No failure branch | No alternative may allow partial acceptance. | Final coordination responsibility |

User-facing rejection precedence remains open. A table row marked “Candidate yes” is not an error-message or API priority contract.

## 6. Candidate Boundary Participation Roles

| Provisional role | Product-domain meaning | Explicit non-implementation meaning |
|---|---|---|
| Scope Provider | Supplies owner/Workspace scope for isolation. | Not repository or access-control ownership. |
| Behavior-Fact Provider | Supplies identity, form, amount, date, or references. | Not a command or request object. |
| Effective-Date Constraint Provider | Supplies Account or Debt opening-date constraint. | Does not own Financial Event Event Date. |
| Lifecycle Constraint Provider | Supplies current active/archived/trashed/deleted eligibility. | Does not imply a universal lifecycle engine. |
| Local-Invariant Evaluator | Appears able to evaluate a candidate-local rule. | Does not finalize Aggregate or root status. |
| Cross-Boundary Participant | Contributes facts/meaning to a multi-boundary rule. | Does not select a transaction or coordinator. |
| Affected-State Participant | Its confirmed state or derived meaning changes on acceptance. | Does not imply persistence ownership. |
| Recalculation Participant | Its ordered affected history is reevaluated. | Does not imply event sourcing or replay. |
| Traceability Participant | Contributes supporting records/effect explanation. | Does not create an audit Aggregate. |
| Derived-Meaning Consumer | Uses accepted facts for totals, reports, or explanations. | Does not imply a projection/cache design. |
| Still Open | Responsibility or behavior is unresolved. | Must not be assigned by Architecture silently. |

## 7. Decision Table Coverage Summary

| Behavior ID | Domain Behavior | Behavior Status | Decision-Table Coverage | Primary Condition Groups | Candidate Boundaries | Accepted Outcome Available | Blocked Outcome Available | Chronological Recalculation Relevant | Detailed Table Section | Protected Open Detail | Source References |
|---|---|---|---|---|---|---|---|---|---|---|---|
| WB-01 | Establish Single-Owner Workspace | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Local Invariant Validation; Traceability and Cross-View Consistency | Workspace | Yes | Yes | No | §8 — DT-WB-01 | Non-blocking deferred: Invitation mechanics and identity fields remain open. | [PRD-6]; [PRD-20]; [PI-3] |
| WB-02 | Establish Initial Workspace Configuration | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency | Workspace; Reporting | Yes | Yes | No | §8 — DT-WB-02 | Non-blocking deferred: Starter-category content and onboarding presentation remain open. | [PRD-9]; [PRD-17]; [PRD-28] |
| AC-01 | Establish Account Opening State | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Monetary Sufficiency; Local Invariant Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Account | Yes | Yes | No | §8 — DT-AC-01 | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Account-name uniqueness remains open. | [PRD-9]; [PRD-12]; [UL-Account] |
| AC-02 | Rename Account | Confirmed Rule with Open Detail | Referenced Shared Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Account; Financial Event | Yes | Yes | No | §9 — shared record | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Post-onboarding availability and name uniqueness remain open. | [PRD-12]; [PRD-28] |
| AC-03 | Archive Account | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency | Account; Financial Event; Reporting | Yes | Yes | No | §9 — DT-AC-03 | Non-blocking deferred: Archived-Account treatment in historical totals remains open. | [PRD-12]; [PRD-28] |
| AC-04 | Restore Archived Account | Confirmed Behavior | Referenced Shared Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency | Workspace; Account; Financial Event | Yes | Yes | No | §9 — shared record | No protected financial-rule question. | [PRD-12]; [UL-Restore] |
| AC-05 | Permanently Delete Account | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency | Account; Financial Event; Dedicated Fund; Debt Record | Yes | Yes | No | §9 — DT-AC-05 | Non-blocking deferred: Non-financial metadata retention remains outside this decision. | [PRD-12] |
| AC-06 | Correct Opening Balance | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency | Account; Financial Event; Dedicated Fund; Debt Record; Reporting | Yes | Yes | Yes | §9 — DT-AC-06 | Non-blocking deferred: Impact Preview threshold and correction-reason requirement remain open. | [PRD-12]; [PRD-16] |
| AC-07 | Correct Opening-Balance Effective Date | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency | Account; Financial Event; Dedicated Fund; Debt Record; Reporting | Yes | Yes | Yes | §9 — DT-AC-07 | Non-blocking deferred: Cross-boundary coordination and preview threshold remain open. | [PRD-12]; [PRD-16]; [PRD-28] |
| IN-01 | Record Income | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Category or Type Compatibility; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Financial Event; Account; Category; Reporting | Yes | Yes | Yes | §10 — DT-IN-01 | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Exact deterministic same-date mechanism remains open. | [PRD-11]; [PRD-12]; [PRD-16] |
| EX-01 | Record Ordinary Expense | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Category or Type Compatibility; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency | Workspace; Financial Event; Account; Category; Reporting | Yes | Yes | Yes | §11 — DT-EX-01 | Non-blocking deferred: Expense-form correction classification remains open. | [PRD-11]; [PRD-12]; [PRD-16] |
| TR-01 | Record Transfer | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Financial Event; Account; Reporting | Yes | Yes | Yes | §12 — DT-TR-01 | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Source/destination equality and same-date mechanism remain open. | [PRD-11]; [PRD-12]; [PRD-16] |
| TR-02 | Correct Transfer | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Financial Event; Account; Reporting | Yes | Yes | Yes | §12 — DT-TR-02 | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Preview threshold and same-date mechanism remain open. | [PRD-16] |
| TR-03 | Delete or Restore Transfer | Confirmed Behavior | Referenced Shared Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Financial Event; Account; Reporting | Yes | Yes | Yes | §12 — shared record | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Trash retention and permanent deletion remain open. | [PRD-16] |
| FA-01 | Allocate Account Money to Dedicated Fund | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency | Workspace; Financial Event; Account; Dedicated Fund; Reporting | Yes | Yes | Yes | §13 — DT-FA-01 | Non-blocking deferred: Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| FA-02 | Correct Fund Allocation | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Financial Event; Account; Dedicated Fund; Reporting | Yes | Yes | Yes | §13 — DT-FA-02 | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Preview threshold, ordering, and allocation responsibility remain open. | [PRD-14]; [PRD-16] |
| FR-01 | Release Dedicated Fund Allocation to Unallocated Amount | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency | Workspace; Financial Event; Account; Dedicated Fund; Reporting | Yes | Yes | Yes | §14 — DT-FR-01 | Non-blocking deferred: Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| FR-02 | Correct Fund Release | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Financial Event; Account; Dedicated Fund; Reporting | Yes | Yes | Yes | §14 — DT-FR-02 | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Preview threshold, same-date ordering, and allocation responsibility remain open. | [PRD-11]; [PRD-14]; [PRD-16] |
| FX-01 | Record Fund-Linked Expense | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Category or Type Compatibility; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting | Yes | Yes | Yes | §15 — DT-FX-01 | Non-blocking deferred: Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| FX-02 | Correct Fund-Linked Expense | Confirmed Rule with Open Detail | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Category or Type Compatibility; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting | Yes | Yes | Yes | §15 — DT-FX-02 | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Adding/removing a Fund reference may be Same-Type Edit or Event Replacement; unresolved. | [PRD-14]; [PRD-16]; [PRD-28] |
| CT-01 | Establish Category | Confirmed Behavior | Referenced Shared Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Category or Type Compatibility; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Category | Yes | Yes | No | §16 — shared record | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Name uniqueness within kind and starter set remain open. | [PRD-13]; [PRD-28] |
| CT-02 | Rename Category | Confirmed Behavior | Referenced Shared Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Category; Financial Event | Yes | Yes | No | §16 — shared record | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Name uniqueness remains open. | [PRD-13] |
| CT-03 | Archive or Hide Category | Confirmed Behavior | Referenced Shared Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency | Category; Financial Event; Reporting | Yes | Yes | No | §16 — shared record | Non-blocking deferred: Exact visibility terminology remains a UX decision. | [PRD-13] |
| CT-04 | Restore Category | Confirmed Behavior | Referenced Shared Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency | Workspace; Category; Financial Event | Yes | Yes | No | §16 — shared record | No protected domain question. | [PRD-13] |
| CT-05 | Permanently Delete Category | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency | Category; Financial Event | Yes | Yes | No | §16 — DT-CT-05 | Non-blocking deferred: Non-financial metadata retention remains undecided. | [PRD-13] |
| DF-01 | Establish Dedicated Fund | Confirmed Behavior | Referenced Shared Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Dedicated Fund; Reporting | Yes | Yes | No | §17 — shared record | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Name uniqueness, target date, and completion representation remain open. | [PRD-14]; [PRD-28] |
| DF-02 | Rename Dedicated Fund | Still Open | Still-Open Decision Record | Ownership and Workspace Scope; Reference Existence and Lifecycle; Protected Open Decision | Workspace; Dedicated Fund; Financial Event | No confirmed accepted outcome | Open only | No | §17 — shared record | Acceptance-blocking: Availability and uniqueness are unresolved. | [PRD-14]; [PRD-28] |
| DF-03 | Set or Change Target Amount | Confirmed Rule with Open Detail | Referenced Shared Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency; Protected Open Decision | Dedicated Fund; Reporting | Yes | Yes | No | §17 — shared record | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Change/removal after history, target date, and completion representation remain open. | [PRD-14]; [PRD-28] |
| DF-04 | Archive Dedicated Fund | Confirmed Rule with Open Detail | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency; Protected Open Decision | Dedicated Fund; Account; Financial Event; Reporting | Yes | Yes | No | §17 — DT-DF-04 | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Non-zero archival and restoration remain open. | [PRD-14]; [PRD-28] |
| DF-05 | Restore Dedicated Fund | Still Open | Still-Open Decision Record | Ownership and Workspace Scope; Reference Existence and Lifecycle; Protected Open Decision | Dedicated Fund; Account; Financial Event | No confirmed accepted outcome | Open only | No | §17 — shared record | Acceptance-blocking: Availability and eligibility are unresolved. | [PRD-14]; [PRD-28] |
| DF-06 | Permanently Delete Dedicated Fund | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency | Dedicated Fund; Account; Financial Event | Yes | Yes | No | §17 — DT-DF-06 | Non-blocking deferred: No persistence-retention decision is made. | [PRD-14] |
| DB-01 | Establish Opening Debt Record | Confirmed Behavior | Referenced Shared Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Monetary Sufficiency; Local Invariant Validation; Traceability and Cross-View Consistency | Workspace; Debt Record | Yes | Yes | No | §18 — shared record | Non-blocking deferred: Creditor structure and explicit/derived status remain open. | [PRD-15]; [PRD-28] |
| DB-02 | Correct Opening Outstanding Principal | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency | Debt Record; Financial Event; Account; Reporting | Yes | Yes | Yes | §18 — DT-DB-02 | Non-blocking deferred: Preview threshold and correction-reason requirement remain open. | [PRD-15]; [PRD-16] |
| DB-03 | Correct Debt Effective Date | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency | Debt Record; Financial Event; Account; Reporting | Yes | Yes | Yes | §18 — DT-DB-03 | Non-blocking deferred: Coordination and preview threshold remain open. | [PRD-15]; [PRD-16]; [PRD-28] |
| DB-04 | Permanently Delete Debt Record | Candidate Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Debt Record; Financial Event | No confirmed accepted outcome | Yes | No | §18 — DT-DB-04 | Acceptance-blocking: Complete deletion eligibility remains open; only repayment-reference blocking is confirmed. | [PRD-15]; [PRD-28] |
| DR-01 | Record Debt Repayment | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Financial Event; Account; Debt Record; Reporting | Yes | Yes | Yes | §19 — DT-DR-01 | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Same-date mechanism, creditor structure, and status representation remain open. | [PRD-11]; [PRD-15]; [PRD-16] |
| DR-02 | Correct Debt Repayment | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Financial Event; Account; Debt Record; Reporting | Yes | Yes | Yes | §19 — DT-DR-02 | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Preview threshold and same-date mechanism remain open. | [PRD-15]; [PRD-16] |
| DR-03 | Delete or Restore Debt Repayment | Confirmed Behavior | Referenced Shared Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Financial Event; Account; Debt Record; Reporting | Yes | Yes | Yes | §19 — shared record | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Trash retention and archived-reference eligibility remain open. | [PRD-16] |
| CR-01 | Same-Type Edit Financial Event | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Category or Type Compatibility; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Yes | Yes | Yes | §20 — DT-CR-01 | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Editable fields and Expense Fund-reference classification remain open. | [PRD-16]; [PRD-28] |
| CR-02 | Replace Financial Event with Different Event Type | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Category or Type Compatibility; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Yes | Yes | Yes | §20 — DT-CR-02 | Non-blocking deferred: Ordinary-history visibility and correction reason remain open. | [PRD-16]; [PRD-28] |
| CR-03 | Preview Correction Impact | Confirmed Rule with Open Detail | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Category or Type Compatibility; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Yes | Yes | Yes | §20 — DT-CR-03 | Non-blocking deferred: Threshold, reason, presentation, and confirmation wording remain open. | [PRD-16]; [PRD-28] |
| LC-01 | Soft Delete Financial Event | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Yes | Yes | Yes | §21 — DT-LC-01 | Non-blocking deferred: Trash retention remains open. | [PRD-16] |
| LC-02 | Restore Financial Event | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Yes | Yes | Yes | §21 — DT-LC-02 | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Archived-reference restoration eligibility remains open. | [PRD-16]; [PRD-28] |
| LC-03 | Permanently Delete Trashed Financial Event | Still Open | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Traceability and Cross-View Consistency; Protected Open Decision | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | No confirmed accepted outcome | Open only | No | §21 — DT-LC-03 | Acceptance-blocking: Availability, retention, eligibility, and traceability deletion are unresolved. | [PRD-16]; [PRD-28] |
| LC-04 | Archive Domain Reference | Confirmed Rule with Open Detail | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Account; Category; Dedicated Fund; Financial Event; Reporting | Yes | Yes | No | §21 — DT-LC-04 | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Concept-specific Fund and reporting rules remain open. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] |
| LC-05 | Restore Archived Domain Reference | Confirmed Rule with Open Detail | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Account; Category; Dedicated Fund; Financial Event | Yes | Yes | No | §21 — DT-LC-05 | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Dedicated Fund restoration remains open. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] |
| RP-01 | Use Calendar Month | Confirmed Behavior | Referenced Shared Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency | Workspace; Financial Event; Reporting | Yes | Yes | No | §22 — shared record | No protected domain question. | [PRD-17] |
| RP-02 | Use Custom Monthly Cycle | Confirmed Behavior | Referenced Shared Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Financial Event; Reporting | Yes | Yes | No | §22 — shared record | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: One-off ranges and final modeling form remain open. | [PRD-17]; [PRD-28] |
| RP-03 | Change Reporting Period Configuration | Confirmed Rule with Open Detail | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Financial Event; Account; Dedicated Fund; Debt Record; Reporting | Yes | Yes | Yes | §22 — DT-RP-03 | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Application timing, preview threshold, and final modeling form remain open. | [PRD-17]; [PRD-28] |
| RC-01 | Recalculate Chronologically Affected State | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Behavior Shape and Required References; Category or Type Compatibility; Effective-Date Validity; Monetary Sufficiency; Local Invariant Validation; Cross-Boundary Invariant Validation; Chronological Recalculation Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Yes | Yes | Yes | §23 — DT-RC-01 | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Same-date mechanism and final coordination responsibility remain open. | [PRD-9]; [PRD-16]; [PRD-19] |
| TC-01 | Explain Derived Account Values | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency | Financial Event; Account; Dedicated Fund; Reporting | Yes | Yes | No | §24 — DT-TC-01 | Non-blocking deferred: Exact presentation remains undecided. | [PRD-19] |
| TC-02 | Explain Dedicated Fund Balance and Account Breakdown | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency | Financial Event; Account; Dedicated Fund; Reporting | Yes | Yes | No | §24 — DT-TC-02 | Non-blocking deferred: Exact presentation remains undecided. | [PRD-14]; [PRD-19] |
| TC-03 | Explain Outstanding Principal | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency | Financial Event; Account; Debt Record; Reporting | Yes | Yes | No | §24 — DT-TC-03 | Non-blocking deferred: Exact presentation remains undecided. | [PRD-15]; [PRD-19] |
| TC-04 | Explain Workspace and Reporting Totals | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency; Protected Open Decision | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Yes | Yes | No | §24 — DT-TC-04 | Conditional when the proposal reaches the unresolved condition; otherwise non-blocking deferred: Archived-Account inclusion and comparison metrics remain open. | [PRD-17]; [PRD-19]; [PRD-28] |
| TC-05 | Explain One Financial Event’s Effects | Confirmed Behavior | Detailed Decision Table | Ownership and Workspace Scope; Reference Existence and Lifecycle; Local Invariant Validation; Cross-Boundary Invariant Validation; Traceability and Cross-View Consistency | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Yes | Yes | No | §24 — DT-TC-05 | Non-blocking deferred: Presentation and prior-value retention remain open. | [PRD-16]; [PRD-19]; [PRD-28] |

## 8. Workspace and Onboarding Decision Tables

### DT-WB-01 — Establish Single-Owner Workspace

#### Behavior Header

- **Behavior ID:** WB-01
- **Behavior Name:** Establish Single-Owner Workspace
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Establish one private owner-scoped Workspace without defining signup or provisioning.
- **Primary Candidate Boundaries:** Workspace.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** Invitation mechanics and identity fields remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-6]; [PRD-20]; [PI-3] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-6]; [PRD-20]; [PI-3] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Owner is verified, no Workspace already exists, and the proposed scope has exactly one owner. | identity, lifecycle, required references | Workspace candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-6]; [PRD-20]; [PI-3] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-6]; [PRD-20]; [PI-3] | Lifecycle details may remain open |
| 8 | Local Invariant Validation | Workspace has exactly one owner and no second Workspace for that owner. | candidate-local facts | Workspace candidate | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-6]; [PRD-20]; [PI-3] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-6]; [PRD-20]; [PI-3] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | All later references must remain isolated to the same owner Workspace. | cross-boundary facts and reconciled meanings | Workspace candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-6]; [PRD-20]; [PI-3] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-6]; [PRD-20]; [PI-3] | No partial acceptance |
| 11 | Traceability and Cross-View Consistency | Workspace origin and owner scope are explainable without exposing another owner. | supporting records and derived meanings | Workspace candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-6]; [PRD-20]; [PI-3] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-6]; [PRD-20]; [PI-3] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace candidates | Accept | Accept complete domain outcome: Establish one private owner-scoped Workspace without defining signup or provisioning. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-6]; [PRD-20]; [PI-3] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | None for this behavior | owner-scoped supporting set | Invitation mechanics and identity fields remain open. | [PRD-6]; [PRD-20]; [PI-3] |

#### Outcome Summary

- **Accepted complete outcome:** Establish one private owner-scoped Workspace without defining signup or provisioning.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** None.
- **Later state reevaluated:** All future domain records use this scope.
- **Unresolved behavior detail:** Invitation mechanics and identity fields remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-WB-02 — Establish Initial Workspace Configuration

#### Behavior Header

- **Behavior ID:** WB-02
- **Behavior Name:** Establish Initial Workspace Configuration
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Establish the initial fixed configuration.
- **Primary Candidate Boundaries:** Workspace; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** Starter-category content and onboarding presentation remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-9]; [PRD-17]; [PRD-28] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-9]; [PRD-17]; [PRD-28] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Workspace exists and proposed configuration is exactly IDR, fixed Asia/Jakarta, and one Calendar Month default. | identity, lifecycle, required references | Workspace; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-9]; [PRD-17]; [PRD-28] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-9]; [PRD-17]; [PRD-28] | Lifecycle details may remain open |
| 8 | Local Invariant Validation | One active configuration; no conflicting currency, timezone, or reporting default. | candidate-local facts | Workspace; Reporting candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-9]; [PRD-17]; [PRD-28] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Workspace; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-9]; [PRD-17]; [PRD-28] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | All Financial Events and reporting consumers use the same Workspace policy. | cross-boundary facts and reconciled meanings | Workspace; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-9]; [PRD-17]; [PRD-28] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-9]; [PRD-17]; [PRD-28] | No partial acceptance |
| 11 | Traceability and Cross-View Consistency | Configuration origin and active policy remain inspectable. | supporting records and derived meanings | Workspace; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-9]; [PRD-17]; [PRD-28] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-9]; [PRD-17]; [PRD-28] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Reporting candidates | Accept | Accept complete domain outcome: Establish the initial fixed configuration. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-9]; [PRD-17]; [PRD-28] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | None for this behavior | owner-scoped supporting set | Starter-category content and onboarding presentation remain open. | [PRD-9]; [PRD-17]; [PRD-28] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | None for this behavior | exact range and supporting records | Starter-category content and onboarding presentation remain open. | [PRD-9]; [PRD-17]; [PRD-28] |

#### Outcome Summary

- **Accepted complete outcome:** Establish the initial fixed configuration.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** None.
- **Later state reevaluated:** Future reporting membership derives under the configuration.
- **Unresolved behavior detail:** Starter-category content and onboarding presentation remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-AC-01 — Establish Account Opening State

#### Behavior Header

- **Behavior ID:** AC-01
- **Behavior Name:** Establish Account Opening State
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Establish the Account opening baseline without Income or Financial Event creation.
- **Primary Candidate Boundaries:** Workspace; Account.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** Account-name uniqueness remains open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-9]; [PRD-12]; [UL-Account] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-9]; [PRD-12]; [UL-Account] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Workspace-scoped Account has a present name, one valid Account Type, Opening Balance, and effective date; name uniqueness is open. | identity, lifecycle, required references | Workspace; Account candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-9]; [PRD-12]; [UL-Account] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-9]; [PRD-12]; [UL-Account] | Lifecycle details may remain open |
| 7 | Monetary Sufficiency | Opening Balance is whole Rupiah and at least Rp0. | amounts and chronological balances | Account candidate | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-9]; [PRD-12]; [UL-Account] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Account candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-9]; [PRD-12]; [UL-Account] | User-facing priority remains open |
| 8 | Local Invariant Validation | Starting Total Account Balance and Unallocated Amount both equal Opening Balance; allocations equal Rp0. | candidate-local facts | Account candidate | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-9]; [PRD-12]; [UL-Account] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-9]; [PRD-12]; [UL-Account] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Workspace scope and any future naming rule remain valid. | cross-boundary facts and reconciled meanings | Workspace; Account candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-9]; [PRD-12]; [UL-Account] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-9]; [PRD-12]; [UL-Account] | No partial acceptance |
| Open | Protected Open Decision | Another Account in the Workspace already uses the proposed Account Name. | proposed and existing Account Names | Account candidates | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Account-name uniqueness remains unresolved | Record the duplicate-name condition without accepting or rejecting it. | [PRD-12]; [PRD-28] | Proposals without a duplicate name continue. |
| 11 | Traceability and Cross-View Consistency | Opening state remains the explainable source of later Account values. | supporting records and derived meanings | Workspace; Account candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-9]; [PRD-12]; [UL-Account] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-9]; [PRD-12]; [UL-Account] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Account candidates | Accept | Accept complete domain outcome: Establish the Account opening baseline without Income or Financial Event creation. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-9]; [PRD-12]; [UL-Account] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | None for this behavior | owner-scoped supporting set | Account-name uniqueness remains open. | [PRD-9]; [PRD-12]; [UL-Account] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | None for this behavior | opening state and Account-affecting events | Account-name uniqueness remains open. | [PRD-9]; [PRD-12]; [UL-Account] |

#### Outcome Summary

- **Accepted complete outcome:** Establish the Account opening baseline without Income or Financial Event creation.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** None for establishment.
- **Later state reevaluated:** Later events derive from this baseline; AC-06/AC-07 may later recalculate.
- **Unresolved behavior detail:** Account-name uniqueness remains open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

## 9. Account Decision Tables

### DT-AC-03 — Archive Account

#### Behavior Header

- **Behavior ID:** AC-03
- **Behavior Name:** Archive Account
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Mark the same Account archived and unavailable for new events.
- **Primary Candidate Boundaries:** Account; Financial Event; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** Archived-Account treatment in historical totals remains open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-12]; [PRD-28] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-12]; [PRD-28] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Account exists, is active, and archival is requested without any automatic financial action. | identity, lifecycle, required references | Account; Financial Event; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-12]; [PRD-28] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Account; Financial Event; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-12]; [PRD-28] | Lifecycle details may remain open |
| 7 | Monetary Sufficiency | Current Total Account Balance equals exactly Rp0. | amounts and chronological balances | Account candidate | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-12]; [PRD-28] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Account candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-12]; [PRD-28] | User-facing priority remains open |
| 8 | Local Invariant Validation | Archive changes lifecycle only and preserves all history. | candidate-local facts | Account candidate | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-12]; [PRD-28] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-12]; [PRD-28] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Historical references remain resolvable; reporting treatment is open. | cross-boundary facts and reconciled meanings | Account; Financial Event; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-12]; [PRD-28] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Account; Financial Event; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-12]; [PRD-28] | No partial acceptance |
| 11 | Traceability and Cross-View Consistency | Remaining balance and preserved references are explainable. | supporting records and derived meanings | Account; Financial Event; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-12]; [PRD-28] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Account; Financial Event; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-12]; [PRD-28] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Account; Financial Event; Reporting candidates | Accept | Accept complete domain outcome: Mark the same Account archived and unavailable for new events. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-12]; [PRD-28] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | None for this behavior | opening state and Account-affecting events | Archived-Account treatment in historical totals remains open. | [PRD-12]; [PRD-28] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | None for this behavior | individual effect and correction links | Archived-Account treatment in historical totals remains open. | [PRD-12]; [PRD-28] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | None for this behavior | exact range and supporting records | Archived-Account treatment in historical totals remains open. | [PRD-12]; [PRD-28] |

#### Outcome Summary

- **Accepted complete outcome:** Mark the same Account archived and unavailable for new events.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** None.
- **Later state reevaluated:** Historical meaning remains; no financial state is recalculated.
- **Unresolved behavior detail:** Archived-Account treatment in historical totals remains open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-AC-05 — Permanently Delete Account

#### Behavior Header

- **Behavior ID:** AC-05
- **Behavior Name:** Permanently Delete Account
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Permanently remove only the never-used Account; otherwise preserve it and offer archive as the domain alternative.
- **Primary Candidate Boundaries:** Account; Financial Event; Dedicated Fund; Debt Record.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** Non-financial metadata retention remains outside this decision.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-12] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-12] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Account exists and complete history/dependency evidence is available. | identity, lifecycle, required references | Account; Financial Event; Dedicated Fund; Debt Record candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-12] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Account; Financial Event; Dedicated Fund; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-12] | Lifecycle details may remain open |
| 7 | Monetary Sufficiency | Opening Balance equals Rp0. | amounts and chronological balances | Account candidate | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-12] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Account candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-12] | User-facing priority remains open |
| 8 | Local Invariant Validation | No Financial Event, Account-backed allocation history, or dependency has ever existed. | candidate-local facts | Account; Financial Event; Dedicated Fund; Debt Record candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-12] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account; Financial Event; Dedicated Fund; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-12] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Every potential referring candidate confirms absence of dependency. | cross-boundary facts and reconciled meanings | Account; Financial Event; Dedicated Fund; Debt Record candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-12] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Account; Financial Event; Dedicated Fund; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-12] | No partial acceptance |
| 11 | Traceability and Cross-View Consistency | Eligibility and every blocking dependency are explainable. | supporting records and derived meanings | Account; Financial Event; Dedicated Fund; Debt Record candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-12] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Account; Financial Event; Dedicated Fund; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-12] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Account; Financial Event; Dedicated Fund; Debt Record candidates | Accept | Accept complete domain outcome: Permanently remove only the never-used Account; otherwise preserve it and offer archive as the domain alternative. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-12] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | None for this behavior | opening state and Account-affecting events | Non-financial metadata retention remains outside this decision. | [PRD-12] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | None for this behavior | individual effect and correction links | Non-financial metadata retention remains outside this decision. | [PRD-12] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | None for this behavior | backing Accounts and fund events | Non-financial metadata retention remains outside this decision. | [PRD-12] |
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | None for this behavior | opening source and repayments | Non-financial metadata retention remains outside this decision. | [PRD-12] |

#### Outcome Summary

- **Accepted complete outcome:** Permanently remove only the never-used Account; otherwise preserve it and offer archive as the domain alternative.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** None.
- **Later state reevaluated:** No later state after an accepted deletion.
- **Unresolved behavior detail:** Non-financial metadata retention remains outside this decision.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-AC-06 — Correct Opening Balance

#### Behavior Header

- **Behavior ID:** AC-06
- **Behavior Name:** Correct Opening Balance
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Replace the opening amount and accept all derived changes only as one complete correction.
- **Primary Candidate Boundaries:** Account; Financial Event; Dedicated Fund; Debt Record; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Impact Preview threshold and correction-reason requirement remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-12]; [PRD-16] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-12]; [PRD-16] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Account exists; proposed Opening Balance and required Impact Preview facts are available. | identity, lifecycle, required references | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-12]; [PRD-16] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-12]; [PRD-16] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Existing Account effective date anchors evaluation. | Event Date and effective dates | Financial Event; Account candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-12]; [PRD-16] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-12]; [PRD-16] | No event is silently excluded |
| 7 | Monetary Sufficiency | Proposed Opening Balance is whole Rupiah and non-negative. | amounts and chronological balances | Account candidate | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-12]; [PRD-16] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Account candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-12]; [PRD-16] | User-facing priority remains open |
| 8 | Local Invariant Validation | Every recalculated Total Account Balance, Unallocated Amount, and allocation decomposition remains valid. | candidate-local facts | Account; Dedicated Fund; Debt Record candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-12]; [PRD-16] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account; Dedicated Fund; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-12]; [PRD-16] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Later Fund, Debt-linked event effects, and reporting meanings remain reconciled. | cross-boundary facts and reconciled meanings | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-12]; [PRD-16] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-12]; [PRD-16] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Account effective date. | ordered affected histories | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-12]; [PRD-16] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-12]; [PRD-16] | No silent historical exclusion |
| 11 | Traceability and Cross-View Consistency | Preview identifies the first affected point, changed values, and any blocker; no event is removed. | supporting records and derived meanings | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-12]; [PRD-16] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-12]; [PRD-16] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Accept | Accept complete domain outcome: Replace the opening amount and accept all derived changes only as one complete correction. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-12]; [PRD-16] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Impact Preview threshold and correction-reason requirement remain open. | [PRD-12]; [PRD-16] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Impact Preview threshold and correction-reason requirement remain open. | [PRD-12]; [PRD-16] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | ordered Account–Fund history | backing Accounts and fund events | Impact Preview threshold and correction-reason requirement remain open. | [PRD-12]; [PRD-16] |
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | ordered repayment history | opening source and repayments | Impact Preview threshold and correction-reason requirement remain open. | [PRD-12]; [PRD-16] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Impact Preview threshold and correction-reason requirement remain open. | [PRD-12]; [PRD-16] |

#### Outcome Summary

- **Accepted complete outcome:** Replace the opening amount and accept all derived changes only as one complete correction.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Account effective date.
- **Later state reevaluated:** Every later affected Account/Fund/Debt event and derived value.
- **Unresolved behavior detail:** Impact Preview threshold and correction-reason requirement remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-AC-07 — Correct Opening-Balance Effective Date

#### Behavior Header

- **Behavior ID:** AC-07
- **Behavior Name:** Correct Opening-Balance Effective Date
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Change the effective date only if every existing event and later invariant stays valid; exclude no history.
- **Primary Candidate Boundaries:** Account; Financial Event; Dedicated Fund; Debt Record; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Cross-boundary coordination and preview threshold remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-12]; [PRD-16]; [PRD-28] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-12]; [PRD-16]; [PRD-28] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Account exists; proposed effective date and complete referencing-event set are available. | identity, lifecycle, required references | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-12]; [PRD-16]; [PRD-28] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-12]; [PRD-16]; [PRD-28] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Classify each existing event as remaining valid, becoming valid, or becoming invalid against the proposed date. | Event Date and effective dates | Financial Event; Account; Debt Record candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-12]; [PRD-16]; [PRD-28] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; Account; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-12]; [PRD-16]; [PRD-28] | No event is silently excluded |
| 7 | Monetary Sufficiency | All monetary invariants remain valid after the date proposal. | amounts and chronological balances | Account; Dedicated Fund; Debt Record candidates | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-12]; [PRD-16]; [PRD-28] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Account; Dedicated Fund; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-12]; [PRD-16]; [PRD-28] | User-facing priority remains open |
| 8 | Local Invariant Validation | Account supplies its date constraint and protects non-negative local history. | candidate-local facts | Account candidate | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-12]; [PRD-16]; [PRD-28] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-12]; [PRD-16]; [PRD-28] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Financial Event owns Event Date; complete date validity and later Fund/Debt/report meaning are cross-boundary. | cross-boundary facts and reconciled meanings | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-12]; [PRD-16]; [PRD-28] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-12]; [PRD-16]; [PRD-28] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Earlier of old and proposed effective dates. | ordered affected histories | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-12]; [PRD-16]; [PRD-28] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-12]; [PRD-16]; [PRD-28] | No silent historical exclusion |
| 11 | Traceability and Cross-View Consistency | Preview lists validity changes and blockers while retaining all existing events. | supporting records and derived meanings | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-12]; [PRD-16]; [PRD-28] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-12]; [PRD-16]; [PRD-28] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Account; Financial Event; Dedicated Fund; Debt Record; Reporting candidates | Accept | Accept complete domain outcome: Change the effective date only if every existing event and later invariant stays valid; exclude no history. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-12]; [PRD-16]; [PRD-28] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Cross-boundary coordination and preview threshold remain open. | [PRD-12]; [PRD-16]; [PRD-28] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Cross-boundary coordination and preview threshold remain open. | [PRD-12]; [PRD-16]; [PRD-28] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | ordered Account–Fund history | backing Accounts and fund events | Cross-boundary coordination and preview threshold remain open. | [PRD-12]; [PRD-16]; [PRD-28] |
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | ordered repayment history | opening source and repayments | Cross-boundary coordination and preview threshold remain open. | [PRD-12]; [PRD-16]; [PRD-28] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Cross-boundary coordination and preview threshold remain open. | [PRD-12]; [PRD-16]; [PRD-28] |

#### Outcome Summary

- **Accepted complete outcome:** Change the effective date only if every existing event and later invariant stays valid; exclude no history.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Earlier of old and proposed effective dates.
- **Later state reevaluated:** Every referencing Financial Event and later affected state.
- **Unresolved behavior detail:** Cross-boundary coordination and preview threshold remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### Referenced Shared and Still-Open Records

| Behavior ID | Behavior | Coverage | Shared decision logic | Protected result | Source |
|---|---|---|---|---|---|
| AC-02 | Rename Account | Referenced Shared Decision Table | Uses §5 sequence, §26 blocking rules, and concept-specific lifecycle/reference rules from the Behavior Catalog. | Post-onboarding availability and name uniqueness remain open. | [PRD-12]; [PRD-28] |
| AC-04 | Restore Archived Account | Referenced Shared Decision Table | Uses §5 sequence, §26 blocking rules, and concept-specific lifecycle/reference rules from the Behavior Catalog. | No protected financial-rule question. | [PRD-12]; [UL-Restore] |

## 10. Income Decision Table

### DT-IN-01 — Record Income

#### Behavior Header

- **Behavior ID:** IN-01
- **Behavior Name:** Record Income
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Accept one Income and its complete Account increase; Fund and Debt state do not change.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Category; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Exact deterministic same-date mechanism remains open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-11]; [PRD-12]; [PRD-16] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-11]; [PRD-12]; [PRD-16] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: One Income Financial Event has one active destination Account, one Income Category, positive whole-Rupiah amount, and Event Date. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-11]; [PRD-12]; [PRD-16] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-11]; [PRD-12]; [PRD-16] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Event Date is on/after Account effective date; same-date position must be deterministic. | Event Date and effective dates | Financial Event; Account candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-11]; [PRD-12]; [PRD-16] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-11]; [PRD-12]; [PRD-16] | No event is silently excluded |
| 7 | Monetary Sufficiency | Amount is positive whole Rupiah. | amounts and chronological balances | Financial Event candidate | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-11]; [PRD-12]; [PRD-16] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Financial Event candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-11]; [PRD-12]; [PRD-16] | User-facing priority remains open |
| 8 | Local Invariant Validation | Account Total and Unallocated Amount each increase by Amount. | candidate-local facts | Account candidate | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-11]; [PRD-12]; [PRD-16] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-11]; [PRD-12]; [PRD-16] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Workspace scope, Category kind, reporting, and cross-view totals agree. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-11]; [PRD-12]; [PRD-16] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-11]; [PRD-12]; [PRD-16] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Event Date. | ordered affected histories | Workspace; Financial Event; Account; Category; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-11]; [PRD-12]; [PRD-16] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Category; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-11]; [PRD-12]; [PRD-16] | No silent historical exclusion |
| Open | Protected Open Decision | Another affected Financial Event shares this Event Date and the relative ordering can change invariant evaluation. | affected event identities and Event Dates | Financial Event candidate | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Deterministic same-date evaluation | Record the tied events and affected Account chronology. | [PRD-11]; [PRD-12]; [PRD-16] | Proposals without an outcome-relevant same-date tie continue. |
| 11 | Traceability and Cross-View Consistency | Event explanation identifies Category, Account, date, amount, and both increases. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-11]; [PRD-12]; [PRD-16] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-11]; [PRD-12]; [PRD-16] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Category; Reporting candidates | Accept | Accept complete domain outcome: Accept one Income and its complete Account increase; Fund and Debt state do not change. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-11]; [PRD-12]; [PRD-16] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Exact deterministic same-date mechanism remains open. | [PRD-11]; [PRD-12]; [PRD-16] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Exact deterministic same-date mechanism remains open. | [PRD-11]; [PRD-12]; [PRD-16] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Exact deterministic same-date mechanism remains open. | [PRD-11]; [PRD-12]; [PRD-16] |
| Category candidate | Lifecycle Constraint Provider; Behavior-Fact Provider | kind, lifecycle, identity | Income/Expense compatibility and deletion dependency | classification meaning | reference validity in affected history | historical classification | Exact deterministic same-date mechanism remains open. | [PRD-11]; [PRD-12]; [PRD-16] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Exact deterministic same-date mechanism remains open. | [PRD-11]; [PRD-12]; [PRD-16] |

#### Outcome Summary

- **Accepted complete outcome:** Accept one Income and its complete Account increase; Fund and Debt state do not change.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Event Date.
- **Later state reevaluated:** Later destination-Account events and affected reports.
- **Unresolved behavior detail:** Exact deterministic same-date mechanism remains open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

## 11. Ordinary Expense Decision Table

### DT-EX-01 — Record Ordinary Expense

#### Behavior Header

- **Behavior ID:** EX-01
- **Behavior Name:** Record Ordinary Expense
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Accept one Expense and decrease Account Total and Unallocated Amount together.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Category; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Expense-form correction classification remains open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-11]; [PRD-12]; [PRD-16] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-11]; [PRD-12]; [PRD-16] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: One ordinary Expense has one Account, one Expense Category, no Dedicated Fund reference, positive whole-Rupiah amount, and Event Date. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-11]; [PRD-12]; [PRD-16] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-11]; [PRD-12]; [PRD-16] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Event Date is on/after Account effective date. | Event Date and effective dates | Financial Event; Account candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-11]; [PRD-12]; [PRD-16] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-11]; [PRD-12]; [PRD-16] | No event is silently excluded |
| 7 | Monetary Sufficiency | Account Total and Unallocated Amount are each sufficient. | amounts and chronological balances | Financial Event; Account candidates | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-11]; [PRD-12]; [PRD-16] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Financial Event; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-11]; [PRD-12]; [PRD-16] | User-facing priority remains open |
| 8 | Local Invariant Validation | Resulting Account Total and Unallocated Amount stay non-negative; allocations do not change. | candidate-local facts | Account candidate | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-11]; [PRD-12]; [PRD-16] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-11]; [PRD-12]; [PRD-16] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Workspace scope, Category kind, reporting, and later state agree. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-11]; [PRD-12]; [PRD-16] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-11]; [PRD-12]; [PRD-16] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Event Date. | ordered affected histories | Workspace; Financial Event; Account; Category; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-11]; [PRD-12]; [PRD-16] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Category; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-11]; [PRD-12]; [PRD-16] | No silent historical exclusion |
| 11 | Traceability and Cross-View Consistency | Event explanation shows both decreases and unchanged allocations. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-11]; [PRD-12]; [PRD-16] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-11]; [PRD-12]; [PRD-16] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Category; Reporting candidates | Accept | Accept complete domain outcome: Accept one Expense and decrease Account Total and Unallocated Amount together. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-11]; [PRD-12]; [PRD-16] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Expense-form correction classification remains open. | [PRD-11]; [PRD-12]; [PRD-16] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Expense-form correction classification remains open. | [PRD-11]; [PRD-12]; [PRD-16] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Expense-form correction classification remains open. | [PRD-11]; [PRD-12]; [PRD-16] |
| Category candidate | Lifecycle Constraint Provider; Behavior-Fact Provider | kind, lifecycle, identity | Income/Expense compatibility and deletion dependency | classification meaning | reference validity in affected history | historical classification | Expense-form correction classification remains open. | [PRD-11]; [PRD-12]; [PRD-16] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Expense-form correction classification remains open. | [PRD-11]; [PRD-12]; [PRD-16] |

#### Outcome Summary

- **Accepted complete outcome:** Accept one Expense and decrease Account Total and Unallocated Amount together.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Event Date.
- **Later state reevaluated:** Later Account events and affected reports.
- **Unresolved behavior detail:** Expense-form correction classification remains open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

## 12. Transfer Decision Tables

### DT-TR-01 — Record Transfer

#### Behavior Header

- **Behavior ID:** TR-01
- **Behavior Name:** Record Transfer
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Accept both Account effects together as one Transfer; never accept one side alone.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Source/destination equality and same-date mechanism remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-11]; [PRD-12]; [PRD-16] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-11]; [PRD-12]; [PRD-16] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: One Transfer has source and destination Accounts in one Workspace, no Category, positive whole-Rupiah amount, and one Event Date; equality remains open. | identity, lifecycle, required references | Workspace; Financial Event; Account; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-11]; [PRD-12]; [PRD-16] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-11]; [PRD-12]; [PRD-16] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Event Date is valid for both Accounts and same-date position is deterministic. | Event Date and effective dates | Financial Event; Account candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-11]; [PRD-12]; [PRD-16] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-11]; [PRD-12]; [PRD-16] | No event is silently excluded |
| 7 | Monetary Sufficiency | Source Total and Unallocated Amount are sufficient. | amounts and chronological balances | Financial Event; Account candidates | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-11]; [PRD-12]; [PRD-16] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Financial Event; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-11]; [PRD-12]; [PRD-16] | User-facing priority remains open |
| 8 | Local Invariant Validation | Source values decrease and destination values increase by the same Amount; both equations hold. | candidate-local facts | Account candidate | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-11]; [PRD-12]; [PRD-16] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-11]; [PRD-12]; [PRD-16] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | One Financial Event identity, both Account histories, and unchanged Workspace Total remain coherent. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-11]; [PRD-12]; [PRD-16] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-11]; [PRD-12]; [PRD-16] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Event Date. | ordered affected histories | Workspace; Financial Event; Account; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-11]; [PRD-12]; [PRD-16] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-11]; [PRD-12]; [PRD-16] | No silent historical exclusion |
| Open | Protected Open Decision | The proposed Transfer uses the same Account as source and destination. | source and destination Account references | Financial Event candidate | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Transfer source/destination rule remains unresolved | Record the equal references without accepting or rejecting them. | [PRD-11]; [PRD-12]; [PRD-16] | Transfers using distinct Accounts continue. |
| Open | Protected Open Decision | Another affected Financial Event shares this Event Date and the relative ordering can change invariant evaluation. | affected event identities and Event Dates | Financial Event candidate | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Deterministic same-date evaluation | Record the tied events and both Account histories. | [PRD-16] | Proposals without an outcome-relevant same-date tie continue. |
| 11 | Traceability and Cross-View Consistency | One event explanation shows both sides and zero Income/Expense effect. | supporting records and derived meanings | Workspace; Financial Event; Account; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-11]; [PRD-12]; [PRD-16] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-11]; [PRD-12]; [PRD-16] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Reporting candidates | Accept | Accept complete domain outcome: Accept both Account effects together as one Transfer; never accept one side alone. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-11]; [PRD-12]; [PRD-16] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Source/destination equality and same-date mechanism remain open. | [PRD-11]; [PRD-12]; [PRD-16] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Source/destination equality and same-date mechanism remain open. | [PRD-11]; [PRD-12]; [PRD-16] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Source/destination equality and same-date mechanism remain open. | [PRD-11]; [PRD-12]; [PRD-16] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Source/destination equality and same-date mechanism remain open. | [PRD-11]; [PRD-12]; [PRD-16] |

#### Outcome Summary

- **Accepted complete outcome:** Accept both Account effects together as one Transfer; never accept one side alone.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Event Date.
- **Later state reevaluated:** Later events on either Account and affected reports.
- **Unresolved behavior detail:** Source/destination equality and same-date mechanism remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-TR-02 — Correct Transfer

#### Behavior Header

- **Behavior ID:** TR-02
- **Behavior Name:** Correct Transfer
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Preserve Financial Event identity; reverse old effect and apply proposed effect as one complete correction.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Preview threshold and same-date mechanism remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-16] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-16] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Existing Transfer and proposed amount, Event Date, source Account, and destination Account are identifiable; the event remains Transfer. | identity, lifecycle, required references | Workspace; Financial Event; Account; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-16] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-16] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Old and proposed Event Dates satisfy every applicable effective-date constraint. | Event Date and effective dates | Financial Event; Account candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-16] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-16] | No event is silently excluded |
| 7 | Monetary Sufficiency | Every old reversal and proposed monetary effect is sufficient at its chronological position. | amounts and chronological balances | Financial Event; Account candidates | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-16] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Financial Event; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-16] | User-facing priority remains open |
| 8 | Local Invariant Validation | Old effect reverses completely and proposed form satisfies its local invariants. | candidate-local facts | Financial Event; Account candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-16] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Financial Event; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-16] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | All old/new candidate histories remain reconciled through later state. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-16] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-16] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Earliest old/new Event Date. | ordered affected histories | Workspace; Financial Event; Account; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-16] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-16] | No silent historical exclusion |
| Open | Protected Open Decision | An old or proposed affected Financial Event shares an affected Event Date and the relative ordering can change invariant evaluation. | old/proposed event identities and Event Dates | Financial Event candidate | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Deterministic same-date correction evaluation | Record tied events across both Account histories. | [PRD-16] | Corrections without an outcome-relevant same-date tie continue. |
| 11 | Traceability and Cross-View Consistency | Before/after facts, references, effects, and first blocker remain traceable. | supporting records and derived meanings | Workspace; Financial Event; Account; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-16] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-16] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Reporting candidates | Accept | Accept complete domain outcome: Preserve Financial Event identity; reverse old effect and apply proposed effect as one complete correction. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-16] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Preview threshold and same-date mechanism remain open. | [PRD-16] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Preview threshold and same-date mechanism remain open. | [PRD-16] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Preview threshold and same-date mechanism remain open. | [PRD-16] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Preview threshold and same-date mechanism remain open. | [PRD-16] |

#### Outcome Summary

- **Accepted complete outcome:** Preserve Financial Event identity; reverse old effect and apply proposed effect as one complete correction.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Earliest old/new Event Date.
- **Later state reevaluated:** Every later event and derived meaning touched by old or proposed references.
- **Unresolved behavior detail:** Preview threshold and same-date mechanism remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### Referenced Shared and Still-Open Records

| Behavior ID | Behavior | Coverage | Shared decision logic | Protected result | Source |
|---|---|---|---|---|---|
| TR-03 | Delete or Restore Transfer | Referenced Shared Decision Table | Uses §5 sequence, §26 blocking rules, and concept-specific lifecycle/reference rules from the Behavior Catalog. | Trash retention and permanent deletion remain open. | [PRD-16] |

## 13. Fund Allocation Decision Tables

### DT-FA-01 — Allocate Account Money to Dedicated Fund

#### Behavior Header

- **Behavior ID:** FA-01
- **Behavior Name:** Allocate Account Money to Dedicated Fund
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Accept the virtual reclassification across Account and Fund meaning as one result.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Dedicated Fund; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Final allocation responsibility remains open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-11]; [PRD-14]; [PRD-16] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-11]; [PRD-14]; [PRD-16] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: One Fund Allocation has Account and Dedicated Fund references, no Category, positive whole-Rupiah amount, and Event Date. | identity, lifecycle, required references | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-11]; [PRD-14]; [PRD-16] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-11]; [PRD-14]; [PRD-16] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Event Date is on/after Account effective date. | Event Date and effective dates | Financial Event; Account candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-11]; [PRD-14]; [PRD-16] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-11]; [PRD-14]; [PRD-16] | No event is silently excluded |
| 7 | Monetary Sufficiency | Account Unallocated Amount is sufficient. | amounts and chronological balances | Account candidate | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-11]; [PRD-14]; [PRD-16] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Account candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-11]; [PRD-14]; [PRD-16] | User-facing priority remains open |
| 8 | Local Invariant Validation | Account Total stays unchanged; Unallocated decreases; matching allocation increases; Account equation holds. | candidate-local facts | Account; Dedicated Fund candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-11]; [PRD-14]; [PRD-16] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account; Dedicated Fund candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-11]; [PRD-14]; [PRD-16] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Dedicated Fund Balance and per-Account breakdown reconcile with the Account-backed allocation. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-11]; [PRD-14]; [PRD-16] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-11]; [PRD-14]; [PRD-16] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Event Date. | ordered affected histories | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-11]; [PRD-14]; [PRD-16] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-11]; [PRD-14]; [PRD-16] | No silent historical exclusion |
| 11 | Traceability and Cross-View Consistency | Explanation identifies Account provenance, Fund, amount, and unchanged Total. | supporting records and derived meanings | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-11]; [PRD-14]; [PRD-16] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-11]; [PRD-14]; [PRD-16] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Accept | Accept complete domain outcome: Accept the virtual reclassification across Account and Fund meaning as one result. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-11]; [PRD-14]; [PRD-16] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | ordered Account–Fund history | backing Accounts and fund events | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |

#### Outcome Summary

- **Accepted complete outcome:** Accept the virtual reclassification across Account and Fund meaning as one result.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Event Date.
- **Later state reevaluated:** Later events for the Account–Fund pairing and reports.
- **Unresolved behavior detail:** Final allocation responsibility remains open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-FA-02 — Correct Fund Allocation

#### Behavior Header

- **Behavior ID:** FA-02
- **Behavior Name:** Correct Fund Allocation
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Preserve Financial Event identity; reverse old effect and apply proposed effect as one complete correction.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Dedicated Fund; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Preview threshold, ordering, and allocation responsibility remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-14]; [PRD-16] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-14]; [PRD-16] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Existing Fund Allocation and proposed amount, Event Date, Account, and Dedicated Fund are identifiable; no allocation lot is selected. | identity, lifecycle, required references | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-14]; [PRD-16] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-14]; [PRD-16] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Old and proposed Event Dates satisfy every applicable effective-date constraint. | Event Date and effective dates | Financial Event; Account candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-14]; [PRD-16] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-14]; [PRD-16] | No event is silently excluded |
| 7 | Monetary Sufficiency | Every old reversal and proposed monetary effect is sufficient at its chronological position. | amounts and chronological balances | Financial Event; Account; Dedicated Fund candidates | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-14]; [PRD-16] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Financial Event; Account; Dedicated Fund candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-14]; [PRD-16] | User-facing priority remains open |
| 8 | Local Invariant Validation | Old effect reverses completely and proposed form satisfies its local invariants. | candidate-local facts | Financial Event; Account; Dedicated Fund candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-14]; [PRD-16] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Financial Event; Account; Dedicated Fund candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-14]; [PRD-16] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | All old/new candidate histories remain reconciled through later state. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-14]; [PRD-16] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-14]; [PRD-16] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Earliest old/new Event Date. | ordered affected histories | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-14]; [PRD-16] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-14]; [PRD-16] | No silent historical exclusion |
| Open | Protected Open Decision | An old or proposed affected Financial Event shares an affected Event Date and the relative ordering can change allocation invariant evaluation. | old/proposed event identities and Event Dates | Financial Event candidate | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Deterministic same-date allocation evaluation | Record tied events and Account–Fund histories. | [PRD-14]; [PRD-16] | Corrections without an outcome-relevant same-date tie continue. |
| 11 | Traceability and Cross-View Consistency | Before/after facts, references, effects, and first blocker remain traceable. | supporting records and derived meanings | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-14]; [PRD-16] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-14]; [PRD-16] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Accept | Accept complete domain outcome: Preserve Financial Event identity; reverse old effect and apply proposed effect as one complete correction. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-14]; [PRD-16] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Preview threshold, ordering, and allocation responsibility remain open. | [PRD-14]; [PRD-16] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Preview threshold, ordering, and allocation responsibility remain open. | [PRD-14]; [PRD-16] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Preview threshold, ordering, and allocation responsibility remain open. | [PRD-14]; [PRD-16] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | ordered Account–Fund history | backing Accounts and fund events | Preview threshold, ordering, and allocation responsibility remain open. | [PRD-14]; [PRD-16] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Preview threshold, ordering, and allocation responsibility remain open. | [PRD-14]; [PRD-16] |

#### Outcome Summary

- **Accepted complete outcome:** Preserve Financial Event identity; reverse old effect and apply proposed effect as one complete correction.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Earliest old/new Event Date.
- **Later state reevaluated:** Every later event and derived meaning touched by old or proposed references.
- **Unresolved behavior detail:** Preview threshold, ordering, and allocation responsibility remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

## 14. Fund Release Decision Tables

### DT-FR-01 — Release Dedicated Fund Allocation to Unallocated Amount

#### Behavior Header

- **Behavior ID:** FR-01
- **Behavior Name:** Release Dedicated Fund Allocation to Unallocated Amount
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Accept the selected-pair release across Account and Fund meaning as one result.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Dedicated Fund; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Final allocation responsibility remains open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-11]; [PRD-14]; [PRD-16] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-11]; [PRD-14]; [PRD-16] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: One Fund Release selects exactly one Account–Fund pairing, no Category, positive whole-Rupiah amount, and Event Date. | identity, lifecycle, required references | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-11]; [PRD-14]; [PRD-16] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-11]; [PRD-14]; [PRD-16] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Event Date is on/after selected Account effective date. | Event Date and effective dates | Financial Event; Account candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-11]; [PRD-14]; [PRD-16] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-11]; [PRD-14]; [PRD-16] | No event is silently excluded |
| 7 | Monetary Sufficiency | Selected matching Account-backed allocation is sufficient; total Fund Balance alone is not sufficient evidence. | amounts and chronological balances | Account candidate | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-11]; [PRD-14]; [PRD-16] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Account candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-11]; [PRD-14]; [PRD-16] | User-facing priority remains open |
| 8 | Local Invariant Validation | Account Total stays unchanged; matching allocation stays non-negative; Unallocated increases equally. | candidate-local facts | Account; Dedicated Fund candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-11]; [PRD-14]; [PRD-16] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account; Dedicated Fund candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-11]; [PRD-14]; [PRD-16] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Dedicated Fund Balance and per-Account breakdown decrease coherently; no other Account allocation is consumed. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-11]; [PRD-14]; [PRD-16] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-11]; [PRD-14]; [PRD-16] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Event Date. | ordered affected histories | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-11]; [PRD-14]; [PRD-16] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-11]; [PRD-14]; [PRD-16] | No silent historical exclusion |
| 11 | Traceability and Cross-View Consistency | Explanation shows selected provenance, amount, allocation decrease, Unallocated increase, and unchanged Total. | supporting records and derived meanings | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-11]; [PRD-14]; [PRD-16] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-11]; [PRD-14]; [PRD-16] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Accept | Accept complete domain outcome: Accept the selected-pair release across Account and Fund meaning as one result. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-11]; [PRD-14]; [PRD-16] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | ordered Account–Fund history | backing Accounts and fund events | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |

#### Outcome Summary

- **Accepted complete outcome:** Accept the selected-pair release across Account and Fund meaning as one result.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Event Date.
- **Later state reevaluated:** Later events for the selected pairing and reports.
- **Unresolved behavior detail:** Final allocation responsibility remains open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-FR-02 — Correct Fund Release

#### Behavior Header

- **Behavior ID:** FR-02
- **Behavior Name:** Correct Fund Release
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Preserve Financial Event identity; reverse old effect and apply proposed effect as one complete correction.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Dedicated Fund; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Preview threshold, same-date ordering, and allocation responsibility remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-11]; [PRD-14]; [PRD-16] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-11]; [PRD-14]; [PRD-16] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Existing active Fund Release and proposed amount, Event Date, Account, and Dedicated Fund are identifiable; selected-Account provenance is preserved. | identity, lifecycle, required references | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-11]; [PRD-14]; [PRD-16] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-11]; [PRD-14]; [PRD-16] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Old and proposed Event Dates satisfy every applicable effective-date constraint. | Event Date and effective dates | Financial Event; Account candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-11]; [PRD-14]; [PRD-16] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-11]; [PRD-14]; [PRD-16] | No event is silently excluded |
| 7 | Monetary Sufficiency | Proposed release does not exceed the matching allocation at its chronological position; Total remains unchanged and values non-negative. | amounts and chronological balances | Account candidate | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-11]; [PRD-14]; [PRD-16] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Account candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-11]; [PRD-14]; [PRD-16] | User-facing priority remains open |
| 8 | Local Invariant Validation | Old effect reverses completely and proposed form satisfies its local invariants. | candidate-local facts | Financial Event; Account; Dedicated Fund candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-11]; [PRD-14]; [PRD-16] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Financial Event; Account; Dedicated Fund candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-11]; [PRD-14]; [PRD-16] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | All old/new candidate histories remain reconciled through later state. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-11]; [PRD-14]; [PRD-16] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-11]; [PRD-14]; [PRD-16] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Earliest old/new Event Date. | ordered affected histories | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-11]; [PRD-14]; [PRD-16] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-11]; [PRD-14]; [PRD-16] | No silent historical exclusion |
| Open | Protected Open Decision | An old or proposed affected Financial Event shares an affected Event Date and the relative ordering can change allocation invariant evaluation. | old/proposed event identities and Event Dates | Financial Event candidate | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Deterministic same-date release evaluation | Record tied events and Account–Fund histories. | [PRD-14]; [PRD-16] | Corrections without an outcome-relevant same-date tie continue. |
| 11 | Traceability and Cross-View Consistency | Before/after facts, references, effects, and first blocker remain traceable. | supporting records and derived meanings | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-11]; [PRD-14]; [PRD-16] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-11]; [PRD-14]; [PRD-16] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Dedicated Fund; Reporting candidates | Accept | Accept complete domain outcome: Preserve Financial Event identity; reverse old effect and apply proposed effect as one complete correction. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-11]; [PRD-14]; [PRD-16] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Preview threshold, same-date ordering, and allocation responsibility remain open. | [PRD-11]; [PRD-14]; [PRD-16] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Preview threshold, same-date ordering, and allocation responsibility remain open. | [PRD-11]; [PRD-14]; [PRD-16] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Preview threshold, same-date ordering, and allocation responsibility remain open. | [PRD-11]; [PRD-14]; [PRD-16] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | ordered Account–Fund history | backing Accounts and fund events | Preview threshold, same-date ordering, and allocation responsibility remain open. | [PRD-11]; [PRD-14]; [PRD-16] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Preview threshold, same-date ordering, and allocation responsibility remain open. | [PRD-11]; [PRD-14]; [PRD-16] |

#### Outcome Summary

- **Accepted complete outcome:** Preserve Financial Event identity; reverse old effect and apply proposed effect as one complete correction.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Earliest old/new Event Date.
- **Later state reevaluated:** Every later event and derived meaning touched by old or proposed references.
- **Unresolved behavior detail:** Preview threshold, same-date ordering, and allocation responsibility remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

## 15. Fund-Linked Expense Decision Tables

### DT-FX-01 — Record Fund-Linked Expense

#### Behavior Header

- **Behavior ID:** FX-01
- **Behavior Name:** Record Fund-Linked Expense
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Accept the complete Account/Fund Expense effect as one result; never consume another Account's allocation.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Final allocation responsibility remains open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-11]; [PRD-14]; [PRD-16] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-11]; [PRD-14]; [PRD-16] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: One Expense has one payment Account, one Expense Category, one Dedicated Fund, positive whole-Rupiah amount, and Event Date; multi-Account draw is prohibited. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-11]; [PRD-14]; [PRD-16] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-11]; [PRD-14]; [PRD-16] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Event Date is on/after payment Account effective date. | Event Date and effective dates | Financial Event; Account candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-11]; [PRD-14]; [PRD-16] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-11]; [PRD-14]; [PRD-16] | No event is silently excluded |
| 7 | Monetary Sufficiency | Payment Account Total and its matching Account-backed allocation are sufficient; Unallocated need not cover Amount. | amounts and chronological balances | Account candidate | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-11]; [PRD-14]; [PRD-16] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Account candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-11]; [PRD-14]; [PRD-16] | User-facing priority remains open |
| 8 | Local Invariant Validation | Account Total and matching allocation decrease; Unallocated remains unchanged. | candidate-local facts | Account; Dedicated Fund candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-11]; [PRD-14]; [PRD-16] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account; Dedicated Fund candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-11]; [PRD-14]; [PRD-16] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Fund Balance/breakdown reconcile and Expense reporting counts the event exactly once. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-11]; [PRD-14]; [PRD-16] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-11]; [PRD-14]; [PRD-16] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Event Date. | ordered affected histories | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-11]; [PRD-14]; [PRD-16] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-11]; [PRD-14]; [PRD-16] | No silent historical exclusion |
| 11 | Traceability and Cross-View Consistency | Explanation identifies payment Account provenance, Fund draw, unchanged Unallocated, and single Expense count. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-11]; [PRD-14]; [PRD-16] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-11]; [PRD-14]; [PRD-16] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Accept | Accept complete domain outcome: Accept the complete Account/Fund Expense effect as one result; never consume another Account's allocation. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-11]; [PRD-14]; [PRD-16] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| Category candidate | Lifecycle Constraint Provider; Behavior-Fact Provider | kind, lifecycle, identity | Income/Expense compatibility and deletion dependency | classification meaning | reference validity in affected history | historical classification | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | ordered Account–Fund history | backing Accounts and fund events | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |

#### Outcome Summary

- **Accepted complete outcome:** Accept the complete Account/Fund Expense effect as one result; never consume another Account's allocation.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Event Date.
- **Later state reevaluated:** Later payment-Account/Fund events and reports.
- **Unresolved behavior detail:** Final allocation responsibility remains open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-FX-02 — Correct Fund-Linked Expense

#### Behavior Header

- **Behavior ID:** FX-02
- **Behavior Name:** Correct Fund-Linked Expense
- **Behavior Status:** Confirmed Rule with Open Detail
- **Decision Objective:** Preserve identity for a confirmed Same-Type path and reapply the complete Expense effect; do not assume the unresolved form transition.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Adding/removing a Fund reference may be Same-Type Edit or Event Replacement; unresolved.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-14]; [PRD-16]; [PRD-28] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-14]; [PRD-16]; [PRD-28] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Existing fund-linked Expense and proposed amount, Event Date, Account, Category, and Fund facts are identifiable; adding/removing Fund reference reaches an open classification branch. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-14]; [PRD-16]; [PRD-28] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-14]; [PRD-16]; [PRD-28] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Old/proposed dates satisfy Account constraints. | Event Date and effective dates | Financial Event; Account candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-14]; [PRD-16]; [PRD-28] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; Account candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-14]; [PRD-16]; [PRD-28] | No event is silently excluded |
| 7 | Monetary Sufficiency | Proposed Account Total and matching allocation are sufficient; Unallocated remains unchanged. | amounts and chronological balances | Financial Event; Account; Dedicated Fund candidates | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-14]; [PRD-16]; [PRD-28] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Financial Event; Account; Dedicated Fund candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-14]; [PRD-16]; [PRD-28] | User-facing priority remains open |
| 8 | Local Invariant Validation | Expense kind and amount rules hold. | candidate-local facts | Financial Event; Category candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-14]; [PRD-16]; [PRD-28] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Financial Event; Category candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-14]; [PRD-16]; [PRD-28] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Old/new Category, Account, Fund, later histories, and reporting remain valid. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-14]; [PRD-16]; [PRD-28] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-14]; [PRD-16]; [PRD-28] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Earliest old/new Event Date. | ordered affected histories | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-14]; [PRD-16]; [PRD-28] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-14]; [PRD-16]; [PRD-28] | No silent historical exclusion |
| Open | Protected Open Decision | The proposed Expense correction adds or removes its Dedicated Fund reference. | old and proposed Dedicated Fund references | Financial Event candidate | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Same-Type Edit versus Event Replacement classification | Record old/proposed form facts without choosing a correction class. | [PRD-16]; [PRD-28] | Corrections retaining Fund-reference presence or absence continue. |
| 11 | Traceability and Cross-View Consistency | Explain old/proposed form, provenance, effects, and unresolved classification. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-14]; [PRD-16]; [PRD-28] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-14]; [PRD-16]; [PRD-28] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting candidates | Accept | Accept complete domain outcome: Preserve identity for a confirmed Same-Type path and reapply the complete Expense effect; do not assume the unresolved form transition. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-14]; [PRD-16]; [PRD-28] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Adding/removing a Fund reference may be Same-Type Edit or Event Replacement; unresolved. | [PRD-14]; [PRD-16]; [PRD-28] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Adding/removing a Fund reference may be Same-Type Edit or Event Replacement; unresolved. | [PRD-14]; [PRD-16]; [PRD-28] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Adding/removing a Fund reference may be Same-Type Edit or Event Replacement; unresolved. | [PRD-14]; [PRD-16]; [PRD-28] |
| Category candidate | Lifecycle Constraint Provider; Behavior-Fact Provider | kind, lifecycle, identity | Income/Expense compatibility and deletion dependency | classification meaning | reference validity in affected history | historical classification | Adding/removing a Fund reference may be Same-Type Edit or Event Replacement; unresolved. | [PRD-14]; [PRD-16]; [PRD-28] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | ordered Account–Fund history | backing Accounts and fund events | Adding/removing a Fund reference may be Same-Type Edit or Event Replacement; unresolved. | [PRD-14]; [PRD-16]; [PRD-28] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Adding/removing a Fund reference may be Same-Type Edit or Event Replacement; unresolved. | [PRD-14]; [PRD-16]; [PRD-28] |

#### Outcome Summary

- **Accepted complete outcome:** Preserve identity for a confirmed Same-Type path and reapply the complete Expense effect; do not assume the unresolved form transition.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Earliest old/new Event Date.
- **Later state reevaluated:** Every later old/new Account–Fund event and report.
- **Unresolved behavior detail:** Adding/removing a Fund reference may be Same-Type Edit or Event Replacement; unresolved.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

## 16. Category Decision Tables

### DT-CT-05 — Permanently Delete Category

#### Behavior Header

- **Behavior ID:** CT-05
- **Behavior Name:** Permanently Delete Category
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Permanently remove only an unused Category; otherwise preserve and archive it.
- **Primary Candidate Boundaries:** Category; Financial Event.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** Non-financial metadata retention remains undecided.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-13] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-13] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Category exists and complete Financial Event reference history is available. | identity, lifecycle, required references | Category; Financial Event candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-13] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Category; Financial Event candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-13] | Lifecycle details may remain open |
| 8 | Local Invariant Validation | No Financial Event has ever referenced the Category. | candidate-local facts | Category; Financial Event candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-13] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Category; Financial Event candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-13] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | All historical classification consumers confirm no dependency. | cross-boundary facts and reconciled meanings | Category; Financial Event candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-13] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Category; Financial Event candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-13] | No partial acceptance |
| 11 | Traceability and Cross-View Consistency | Explain dependency evidence and non-destructive archive alternative. | supporting records and derived meanings | Category; Financial Event candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-13] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Category; Financial Event candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-13] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Category; Financial Event candidates | Accept | Accept complete domain outcome: Permanently remove only an unused Category; otherwise preserve and archive it. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-13] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Category candidate | Lifecycle Constraint Provider; Behavior-Fact Provider | kind, lifecycle, identity | Income/Expense compatibility and deletion dependency | classification meaning | None for this behavior | historical classification | Non-financial metadata retention remains undecided. | [PRD-13] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | None for this behavior | individual effect and correction links | Non-financial metadata retention remains undecided. | [PRD-13] |

#### Outcome Summary

- **Accepted complete outcome:** Permanently remove only an unused Category; otherwise preserve and archive it.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** None.
- **Later state reevaluated:** No later state after accepted deletion.
- **Unresolved behavior detail:** Non-financial metadata retention remains undecided.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### Referenced Shared and Still-Open Records

| Behavior ID | Behavior | Coverage | Shared decision logic | Protected result | Source |
|---|---|---|---|---|---|
| CT-01 | Establish Category | Referenced Shared Decision Table | Uses §5 sequence, §26 blocking rules, and concept-specific lifecycle/reference rules from the Behavior Catalog. | Name uniqueness within kind and starter set remain open. | [PRD-13]; [PRD-28] |
| CT-02 | Rename Category | Referenced Shared Decision Table | Uses §5 sequence, §26 blocking rules, and concept-specific lifecycle/reference rules from the Behavior Catalog. | Name uniqueness remains open. | [PRD-13] |
| CT-03 | Archive or Hide Category | Referenced Shared Decision Table | Uses §5 sequence, §26 blocking rules, and concept-specific lifecycle/reference rules from the Behavior Catalog. | Exact visibility terminology remains a UX decision. | [PRD-13] |
| CT-04 | Restore Category | Referenced Shared Decision Table | Uses §5 sequence, §26 blocking rules, and concept-specific lifecycle/reference rules from the Behavior Catalog. | No protected domain question. | [PRD-13] |

## 17. Dedicated Fund and Financial Goal Decision Tables

### DT-DF-04 — Archive Dedicated Fund

#### Behavior Header

- **Behavior ID:** DF-04
- **Behavior Name:** Archive Dedicated Fund
- **Behavior Status:** Confirmed Rule with Open Detail
- **Decision Objective:** For the confirmed zero-balance branch, change Dedicated Fund lifecycle eligibility only; do not alter financial state or history.
- **Primary Candidate Boundaries:** Dedicated Fund; Account; Financial Event; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** Non-zero archival and restoration remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-14]; [PRD-28] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-14]; [PRD-28] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Dedicated Fund exists and is active; history, current Fund Balance, and per-Account breakdown are known. | identity, lifecycle, required references | Dedicated Fund; Account; Financial Event; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-14]; [PRD-28] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Dedicated Fund; Account; Financial Event; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-14]; [PRD-28] | Lifecycle details may remain open |
| 7 | Monetary Sufficiency | Fund Balance equals Rp0. | Fund Balance | Dedicated Fund candidate | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-14]; [PRD-28] | None |
| Open | Protected Open Decision | The proposed Dedicated Fund has a Fund Balance other than Rp0. | Fund Balance | Dedicated Fund candidate | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Non-zero archival remains unresolved | Retain the current active Fund and all financial state. | [PRD-14]; [PRD-28] | This branch does not release, spend, or zero money. |
| 8 | Local Invariant Validation | Archival changes lifecycle eligibility only; it does not release allocations, spend money, zero Fund Balance, change Account state, change Financial Events, or recalculate financial history. | Dedicated Fund lifecycle and unchanged financial facts | Dedicated Fund candidate | Pass | Continue candidate evaluation. | No | Lifecycle-only archival | Record the lifecycle change and unchanged financial facts. | [PRD-14]; [PRD-28] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Dedicated Fund candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-14]; [PRD-28] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Account-backed allocations, Account state, Financial Events, Fund Balance, and historical references remain unchanged and coherent. | cross-boundary facts and reconciled meanings | Dedicated Fund; Account; Financial Event; Reporting candidates | Pass | Continue candidate evaluation. | No | Lifecycle-only, all-or-nothing cross-boundary meaning | Record unchanged financial meanings. | [PRD-14]; [PRD-28] | Final coordination responsibility remains open but does not block archival |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Dedicated Fund; Account; Financial Event; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-14]; [PRD-28] | No partial acceptance |
| 11 | Traceability and Cross-View Consistency | Explain balance, breakdown, dependencies, and open non-zero branch. | supporting records and derived meanings | Dedicated Fund; Account; Financial Event; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-14]; [PRD-28] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Dedicated Fund; Account; Financial Event; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-14]; [PRD-28] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Dedicated Fund; Account; Financial Event; Reporting candidates | Accept | Accept complete domain outcome: Archive the zero-balance Dedicated Fund by changing lifecycle eligibility only; preserve Fund Balance, allocations, Account state, Financial Events, and financial history. | No | Complete domain meaning; no partial effect | Record accepted lifecycle meaning and unchanged financial facts. | [PRD-14]; [PRD-28] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | lifecycle eligibility only; financial values unchanged | None for this behavior | backing Accounts and fund events | Non-zero archival and restoration remain open. | [PRD-14]; [PRD-28] |
| Account candidate | Local-Invariant Evaluator; Traceability Participant | Total, Unallocated, Account-backed allocations | Account values remain unchanged | no Account state change | None for this behavior | opening state and Account-affecting events | Non-zero archival and restoration remain open. | [PRD-14]; [PRD-28] |
| Financial Event candidate | Behavior-Fact Provider; Traceability Participant | event identity and Dedicated Fund references | Financial Events remain unchanged | no Financial Event change | None for this behavior | individual effects and historical references | Non-zero archival and restoration remain open. | [PRD-14]; [PRD-28] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | lifecycle-sensitive derived meaning | cross-view agreement | lifecycle eligibility meaning only | None for this behavior | exact supporting records | Non-zero archival and restoration remain open. | [PRD-14]; [PRD-28] |

#### Outcome Summary

- **Accepted complete outcome:** Archive the zero-balance Dedicated Fund by changing lifecycle eligibility only; preserve Fund Balance, allocations, Account state, Financial Events, and financial history.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** None for archival itself.
- **Later state reevaluated:** None; a separate financial correction may recalculate history, but DF-04 does not.
- **Unresolved behavior detail:** Non-zero archival and restoration remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-DF-06 — Permanently Delete Dedicated Fund

#### Behavior Header

- **Behavior ID:** DF-06
- **Behavior Name:** Permanently Delete Dedicated Fund
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Permanently remove only the zero, never-used Fund; otherwise preserve it.
- **Primary Candidate Boundaries:** Dedicated Fund; Account; Financial Event.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** No persistence-retention decision is made.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-14] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-14] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Dedicated Fund exists and full allocation/event dependency history is available. | identity, lifecycle, required references | Dedicated Fund; Account; Financial Event candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-14] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Dedicated Fund; Account; Financial Event candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-14] | Lifecycle details may remain open |
| 7 | Monetary Sufficiency | Fund Balance equals Rp0. | amounts and chronological balances | Dedicated Fund candidate | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-14] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Dedicated Fund candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-14] | User-facing priority remains open |
| 8 | Local Invariant Validation | No Financial Event or Account-backed allocation history/dependency exists. | candidate-local facts | Dedicated Fund; Account; Financial Event candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-14] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Dedicated Fund; Account; Financial Event candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-14] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Every referring candidate confirms absence of dependency. | cross-boundary facts and reconciled meanings | Dedicated Fund; Account; Financial Event candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-14] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Dedicated Fund; Account; Financial Event candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-14] | No partial acceptance |
| 11 | Traceability and Cross-View Consistency | Explain zero balance and complete dependency evidence. | supporting records and derived meanings | Dedicated Fund; Account; Financial Event candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-14] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Dedicated Fund; Account; Financial Event candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-14] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Dedicated Fund; Account; Financial Event candidates | Accept | Accept complete domain outcome: Permanently remove only the zero, never-used Fund; otherwise preserve it. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-14] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | None for this behavior | backing Accounts and fund events | No persistence-retention decision is made. | [PRD-14] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | None for this behavior | opening state and Account-affecting events | No persistence-retention decision is made. | [PRD-14] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | None for this behavior | individual effect and correction links | No persistence-retention decision is made. | [PRD-14] |

#### Outcome Summary

- **Accepted complete outcome:** Permanently remove only the zero, never-used Fund; otherwise preserve it.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** None.
- **Later state reevaluated:** No later state after accepted deletion.
- **Unresolved behavior detail:** No persistence-retention decision is made.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### Referenced Shared and Still-Open Records

| Behavior ID | Behavior | Coverage | Shared decision logic | Protected result | Source |
|---|---|---|---|---|---|
| DF-01 | Establish Dedicated Fund | Referenced Shared Decision Table | Uses §5 sequence, §26 blocking rules, and concept-specific lifecycle/reference rules from the Behavior Catalog. | Name uniqueness, target date, and completion representation remain open. | [PRD-14]; [PRD-28] |
| DF-02 | Rename Dedicated Fund | Still-Open Decision Record | Uses §5 sequence, §26 blocking rules, and concept-specific lifecycle/reference rules from the Behavior Catalog. | No accepted outcome is assumed. | [PRD-14]; [PRD-28] |
| DF-03 | Set or Change Target Amount | Referenced Shared Decision Table | Uses §5 sequence, §26 blocking rules, and concept-specific lifecycle/reference rules from the Behavior Catalog. | Change/removal after history, target date, and completion representation remain open. | [PRD-14]; [PRD-28] |
| DF-05 | Restore Dedicated Fund | Still-Open Decision Record | Uses §5 sequence, §26 blocking rules, and concept-specific lifecycle/reference rules from the Behavior Catalog. | No accepted outcome is assumed. | [PRD-14]; [PRD-28] |

## 18. Debt Record Decision Tables

### DT-DB-02 — Correct Opening Outstanding Principal

#### Behavior Header

- **Behavior ID:** DB-02
- **Behavior Name:** Correct Opening Outstanding Principal
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Change opening principal only as one complete correction; remove no repayment.
- **Primary Candidate Boundaries:** Debt Record; Financial Event; Account; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Preview threshold and correction-reason requirement remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-15]; [PRD-16] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-15]; [PRD-16] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Debt Record exists; proposed Opening Outstanding Principal and Impact Preview scope are available. | identity, lifecycle, required references | Debt Record; Financial Event; Account; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-15]; [PRD-16] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Debt Record; Financial Event; Account; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-15]; [PRD-16] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Debt effective date anchors repayment evaluation. | Event Date and effective dates | Financial Event; Account; Debt Record candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-15]; [PRD-16] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; Account; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-15]; [PRD-16] | No event is silently excluded |
| 7 | Monetary Sufficiency | Proposed opening principal is positive whole Rupiah and every later principal remains non-negative. | amounts and chronological balances | Debt Record candidate | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-15]; [PRD-16] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Debt Record candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-15]; [PRD-16] | User-facing priority remains open |
| 8 | Local Invariant Validation | Debt Record protects principal at every chronological point. | candidate-local facts | Debt Record candidate | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-15]; [PRD-16] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Debt Record candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-15]; [PRD-16] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Repayment Financial Events, Account-linked meaning, and reports remain coherent. | cross-boundary facts and reconciled meanings | Debt Record; Financial Event; Account; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-15]; [PRD-16] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Debt Record; Financial Event; Account; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-15]; [PRD-16] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Debt effective date. | ordered affected histories | Debt Record; Financial Event; Account; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-15]; [PRD-16] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Debt Record; Financial Event; Account; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-15]; [PRD-16] | No silent historical exclusion |
| 11 | Traceability and Cross-View Consistency | Preview shows principal path, affected repayments, and first blocker. | supporting records and derived meanings | Debt Record; Financial Event; Account; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-15]; [PRD-16] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Debt Record; Financial Event; Account; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-15]; [PRD-16] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Debt Record; Financial Event; Account; Reporting candidates | Accept | Accept complete domain outcome: Change opening principal only as one complete correction; remove no repayment. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-15]; [PRD-16] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | ordered repayment history | opening source and repayments | Preview threshold and correction-reason requirement remain open. | [PRD-15]; [PRD-16] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Preview threshold and correction-reason requirement remain open. | [PRD-15]; [PRD-16] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Preview threshold and correction-reason requirement remain open. | [PRD-15]; [PRD-16] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Preview threshold and correction-reason requirement remain open. | [PRD-15]; [PRD-16] |

#### Outcome Summary

- **Accepted complete outcome:** Change opening principal only as one complete correction; remove no repayment.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Debt effective date.
- **Later state reevaluated:** Every later Debt Repayment and derived debt total.
- **Unresolved behavior detail:** Preview threshold and correction-reason requirement remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-DB-03 — Correct Debt Effective Date

#### Behavior Header

- **Behavior ID:** DB-03
- **Behavior Name:** Correct Debt Effective Date
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Change date only if all repayments and later invariants stay valid; exclude no repayment.
- **Primary Candidate Boundaries:** Debt Record; Financial Event; Account; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Coordination and preview threshold remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-15]; [PRD-16]; [PRD-28] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-15]; [PRD-16]; [PRD-28] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Debt Record exists; proposed effective date and all repayment events are available. | identity, lifecycle, required references | Debt Record; Financial Event; Account; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-15]; [PRD-16]; [PRD-28] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Debt Record; Financial Event; Account; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-15]; [PRD-16]; [PRD-28] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Classify repayments as remaining valid, becoming valid, or becoming invalid against proposed date. | Event Date and effective dates | Financial Event; Account; Debt Record candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-15]; [PRD-16]; [PRD-28] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; Account; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-15]; [PRD-16]; [PRD-28] | No event is silently excluded |
| 7 | Monetary Sufficiency | Every later Outstanding Principal remains non-negative. | amounts and chronological balances | Debt Record candidate | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-15]; [PRD-16]; [PRD-28] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Debt Record candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-15]; [PRD-16]; [PRD-28] | User-facing priority remains open |
| 8 | Local Invariant Validation | Debt Record supplies date constraint and protects principal locally. | candidate-local facts | Debt Record candidate | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-15]; [PRD-16]; [PRD-28] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Debt Record candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-15]; [PRD-16]; [PRD-28] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Financial Event owns repayment Event Date; Account/debt/report histories remain coherent. | cross-boundary facts and reconciled meanings | Debt Record; Financial Event; Account; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-15]; [PRD-16]; [PRD-28] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Debt Record; Financial Event; Account; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-15]; [PRD-16]; [PRD-28] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Earlier old/proposed Debt effective date. | ordered affected histories | Debt Record; Financial Event; Account; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-15]; [PRD-16]; [PRD-28] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Debt Record; Financial Event; Account; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-15]; [PRD-16]; [PRD-28] | No silent historical exclusion |
| 11 | Traceability and Cross-View Consistency | Preview lists validity changes, principal path, and blockers. | supporting records and derived meanings | Debt Record; Financial Event; Account; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-15]; [PRD-16]; [PRD-28] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Debt Record; Financial Event; Account; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-15]; [PRD-16]; [PRD-28] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Debt Record; Financial Event; Account; Reporting candidates | Accept | Accept complete domain outcome: Change date only if all repayments and later invariants stay valid; exclude no repayment. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-15]; [PRD-16]; [PRD-28] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | ordered repayment history | opening source and repayments | Coordination and preview threshold remain open. | [PRD-15]; [PRD-16]; [PRD-28] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Coordination and preview threshold remain open. | [PRD-15]; [PRD-16]; [PRD-28] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Coordination and preview threshold remain open. | [PRD-15]; [PRD-16]; [PRD-28] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Coordination and preview threshold remain open. | [PRD-15]; [PRD-16]; [PRD-28] |

#### Outcome Summary

- **Accepted complete outcome:** Change date only if all repayments and later invariants stay valid; exclude no repayment.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Earlier old/proposed Debt effective date.
- **Later state reevaluated:** Every repayment and later debt-derived state.
- **Unresolved behavior detail:** Coordination and preview threshold remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-DB-04 — Permanently Delete Debt Record

#### Behavior Header

- **Behavior ID:** DB-04
- **Behavior Name:** Permanently Delete Debt Record
- **Behavior Status:** Candidate Behavior
- **Decision Objective:** No confirmed accepted deletion outcome; preserve Debt Record until eligibility is approved.
- **Primary Candidate Boundaries:** Workspace; Debt Record; Financial Event.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** Complete deletion eligibility remains open; only repayment-reference blocking is confirmed.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-15]; [PRD-28] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-15]; [PRD-28] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Debt Record exists and complete repayment/dependency history is available; only repayment-reference blocking is confirmed. | identity, lifecycle, required references | Workspace; Debt Record; Financial Event candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-15]; [PRD-28] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Debt Record; Financial Event candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-15]; [PRD-28] | Lifecycle details may remain open |
| 8 | Local Invariant Validation | No Debt Repayment may reference the Debt Record. | candidate-local facts | Debt Record; Financial Event candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-15]; [PRD-28] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Debt Record; Financial Event candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-15]; [PRD-28] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Complete accepted deletion eligibility is a protected open decision. | cross-boundary facts and reconciled meanings | Workspace; Debt Record; Financial Event candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-15]; [PRD-28] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Debt Record; Financial Event candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-15]; [PRD-28] | No partial acceptance |
| 11 | Traceability and Cross-View Consistency | Explain confirmed repayment blocker and unresolved remaining eligibility. | supporting records and derived meanings | Workspace; Debt Record; Financial Event candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-15]; [PRD-28] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Debt Record; Financial Event candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-15]; [PRD-28] | User-facing priority remains open |
| 12 | Protected Open Decision | Complete Debt Record deletion eligibility is not established, so no confirmed accepted deletion outcome exists. | unresolved complete deletion rule | Still Open — no candidate fact provider established | Open | Acceptance blocked; no confirmed outcome exists until this decision is resolved. | Yes | Acceptance-Blocking Open Decision | Preserve the Debt Record and current confirmed state. | [PRD-15]; [PRD-28] | Repayment-reference blocking is confirmed; remaining eligibility is unresolved. |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | None for this behavior | owner-scoped supporting set | Complete deletion eligibility remains open; only repayment-reference blocking is confirmed. | [PRD-15]; [PRD-28] |
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | None for this behavior | opening source and repayments | Complete deletion eligibility remains open; only repayment-reference blocking is confirmed. | [PRD-15]; [PRD-28] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | None for this behavior | individual effect and correction links | Complete deletion eligibility remains open; only repayment-reference blocking is confirmed. | [PRD-15]; [PRD-28] |

#### Outcome Summary

- **Accepted complete outcome:** No confirmed accepted outcome; preserve the current state and status.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** None.
- **Later state reevaluated:** No later state is assumed.
- **Unresolved behavior detail:** Complete deletion eligibility remains open; only repayment-reference blocking is confirmed.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### Referenced Shared and Still-Open Records

| Behavior ID | Behavior | Coverage | Shared decision logic | Protected result | Source |
|---|---|---|---|---|---|
| DB-01 | Establish Opening Debt Record | Referenced Shared Decision Table | Uses §5 sequence, §26 blocking rules, and concept-specific lifecycle/reference rules from the Behavior Catalog. | Creditor structure and explicit/derived status remain open. | [PRD-15]; [PRD-28] |

## 19. Debt Repayment Decision Tables

### DT-DR-01 — Record Debt Repayment

#### Behavior Header

- **Behavior ID:** DR-01
- **Behavior Name:** Record Debt Repayment
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Accept Account cash decrease and Debt principal decrease together.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Debt Record; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Same-date mechanism, creditor structure, and status representation remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-11]; [PRD-15]; [PRD-16] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-11]; [PRD-15]; [PRD-16] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: One Debt Repayment has one payment Account, one Debt Record, positive whole-Rupiah amount, and Event Date. | identity, lifecycle, required references | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-11]; [PRD-15]; [PRD-16] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-11]; [PRD-15]; [PRD-16] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Event Date is on/after both Account and Debt effective dates. | Event Date and effective dates | Financial Event; Account; Debt Record candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-11]; [PRD-15]; [PRD-16] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; Account; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-11]; [PRD-15]; [PRD-16] | No event is silently excluded |
| 7 | Monetary Sufficiency | Account Total, Account Unallocated Amount, and Outstanding Principal are each sufficient. | amounts and chronological balances | Financial Event; Account; Debt Record candidates | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-11]; [PRD-15]; [PRD-16] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Financial Event; Account; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-11]; [PRD-15]; [PRD-16] | User-facing priority remains open |
| 8 | Local Invariant Validation | Account values and principal remain non-negative. | candidate-local facts | Account; Debt Record candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-11]; [PRD-15]; [PRD-16] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-11]; [PRD-15]; [PRD-16] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Cash and principal effects stay synchronized; principal is excluded from Expense while interest/fees remain separate Expense events. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-11]; [PRD-15]; [PRD-16] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-11]; [PRD-15]; [PRD-16] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Event Date. | ordered affected histories | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-11]; [PRD-15]; [PRD-16] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-11]; [PRD-15]; [PRD-16] | No silent historical exclusion |
| Open | Protected Open Decision | Another affected Debt Repayment shares this Event Date and the relative ordering can change cash or principal invariant evaluation. | repayment identities and Event Dates | Financial Event candidate | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Deterministic same-date repayment evaluation | Record tied repayments and Account/Debt histories. | [PRD-15]; [PRD-16] | Proposals without an outcome-relevant same-date tie continue. |
| 11 | Traceability and Cross-View Consistency | One event explanation shows cash and principal effects and non-Expense classification. | supporting records and derived meanings | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-11]; [PRD-15]; [PRD-16] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-11]; [PRD-15]; [PRD-16] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Accept | Accept complete domain outcome: Accept Account cash decrease and Debt principal decrease together. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-11]; [PRD-15]; [PRD-16] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Same-date mechanism, creditor structure, and status representation remain open. | [PRD-11]; [PRD-15]; [PRD-16] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Same-date mechanism, creditor structure, and status representation remain open. | [PRD-11]; [PRD-15]; [PRD-16] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Same-date mechanism, creditor structure, and status representation remain open. | [PRD-11]; [PRD-15]; [PRD-16] |
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | ordered repayment history | opening source and repayments | Same-date mechanism, creditor structure, and status representation remain open. | [PRD-11]; [PRD-15]; [PRD-16] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Same-date mechanism, creditor structure, and status representation remain open. | [PRD-11]; [PRD-15]; [PRD-16] |

#### Outcome Summary

- **Accepted complete outcome:** Accept Account cash decrease and Debt principal decrease together.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Event Date.
- **Later state reevaluated:** Later Account events, later repayments, and reports.
- **Unresolved behavior detail:** Same-date mechanism, creditor structure, and status representation remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-DR-02 — Correct Debt Repayment

#### Behavior Header

- **Behavior ID:** DR-02
- **Behavior Name:** Correct Debt Repayment
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Preserve Financial Event identity; reverse old effect and apply proposed effect as one complete correction.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Debt Record; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Preview threshold and same-date mechanism remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-15]; [PRD-16] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-15]; [PRD-16] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Existing Debt Repayment and proposed Account, Debt Record, amount, and Event Date are identifiable; event type remains Debt Repayment. | identity, lifecycle, required references | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-15]; [PRD-16] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-15]; [PRD-16] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Old and proposed Event Dates satisfy every applicable effective-date constraint. | Event Date and effective dates | Financial Event; Account; Debt Record candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-15]; [PRD-16] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; Account; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-15]; [PRD-16] | No event is silently excluded |
| 7 | Monetary Sufficiency | Every old reversal and proposed monetary effect is sufficient at its chronological position. | amounts and chronological balances | Financial Event; Account; Debt Record candidates | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-15]; [PRD-16] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Financial Event; Account; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-15]; [PRD-16] | User-facing priority remains open |
| 8 | Local Invariant Validation | Old effect reverses completely and proposed form satisfies its local invariants. | candidate-local facts | Financial Event; Account; Debt Record candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-15]; [PRD-16] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Financial Event; Account; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-15]; [PRD-16] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | All old/new candidate histories remain reconciled through later state. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-15]; [PRD-16] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-15]; [PRD-16] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Earliest old/new Event Date. | ordered affected histories | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-15]; [PRD-16] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-15]; [PRD-16] | No silent historical exclusion |
| Open | Protected Open Decision | An old or proposed affected Debt Repayment shares an affected Event Date and the relative ordering can change cash or principal invariant evaluation. | old/proposed repayment identities and Event Dates | Financial Event candidate | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Deterministic same-date repayment correction evaluation | Record tied repayments and Account/Debt histories. | [PRD-15]; [PRD-16] | Corrections without an outcome-relevant same-date tie continue. |
| 11 | Traceability and Cross-View Consistency | Before/after facts, references, effects, and first blocker remain traceable. | supporting records and derived meanings | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-15]; [PRD-16] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-15]; [PRD-16] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Debt Record; Reporting candidates | Accept | Accept complete domain outcome: Preserve Financial Event identity; reverse old effect and apply proposed effect as one complete correction. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-15]; [PRD-16] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Preview threshold and same-date mechanism remain open. | [PRD-15]; [PRD-16] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Preview threshold and same-date mechanism remain open. | [PRD-15]; [PRD-16] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Preview threshold and same-date mechanism remain open. | [PRD-15]; [PRD-16] |
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | ordered repayment history | opening source and repayments | Preview threshold and same-date mechanism remain open. | [PRD-15]; [PRD-16] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Preview threshold and same-date mechanism remain open. | [PRD-15]; [PRD-16] |

#### Outcome Summary

- **Accepted complete outcome:** Preserve Financial Event identity; reverse old effect and apply proposed effect as one complete correction.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Earliest old/new Event Date.
- **Later state reevaluated:** Every later event and derived meaning touched by old or proposed references.
- **Unresolved behavior detail:** Preview threshold and same-date mechanism remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### Referenced Shared and Still-Open Records

| Behavior ID | Behavior | Coverage | Shared decision logic | Protected result | Source |
|---|---|---|---|---|---|
| DR-03 | Delete or Restore Debt Repayment | Referenced Shared Decision Table | Uses §5 sequence, §26 blocking rules, and concept-specific lifecycle/reference rules from the Behavior Catalog. | Trash retention and archived-reference eligibility remain open. | [PRD-16] |

## 20. Correction and Replacement Decision Tables

### DT-CR-01 — Same-Type Edit Financial Event

#### Behavior Header

- **Behavior ID:** CR-01
- **Behavior Name:** Same-Type Edit Financial Event
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Reverse old effect and apply proposed same-type effect as one complete correction.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Editable fields and Expense Fund-reference classification remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-16]; [PRD-28] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-16]; [PRD-28] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Current active Financial Event and proposed same-type facts are identifiable; editability is evaluated per form and not assumed for every field. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-16]; [PRD-28] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-16]; [PRD-28] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Old/proposed dates satisfy all referenced Account/Debt constraints. | Event Date and effective dates | Financial Event; actually referenced Account and Debt Record candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-16]; [PRD-28] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; actually referenced Account and Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-16]; [PRD-28] | No event is silently excluded |
| 7 | Monetary Sufficiency | Old reversal and proposed effect are monetarily valid. | amounts and chronological balances | Financial Event; Account; Dedicated Fund; Debt Record candidates | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-16]; [PRD-28] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Financial Event; Account; Dedicated Fund; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-16]; [PRD-28] | User-facing priority remains open |
| 8 | Local Invariant Validation | Financial Event identity and Event Type remain unchanged. | candidate-local facts | Financial Event candidate | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-16]; [PRD-28] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Financial Event candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-16]; [PRD-28] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Every old/new referenced boundary and later state remains valid. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-16]; [PRD-28] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-16]; [PRD-28] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Earliest old/new Event Date. | ordered affected histories | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-16]; [PRD-28] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-16]; [PRD-28] | No silent historical exclusion |
| Open | Protected Open Decision | The proposed Same-Type Edit changes a field whose edit eligibility is unresolved, including adding or removing an Expense Dedicated Fund reference. | current and proposed Financial Event form and references | Financial Event candidate | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Same-Type Edit field eligibility | Record the exact changed field without assuming editability. | [PRD-16]; [PRD-28] | Edits limited to confirmed editable facts continue. |
| 11 | Traceability and Cross-View Consistency | Trace old/proposed facts and effects without erasing the original identity. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-16]; [PRD-28] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-16]; [PRD-28] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Accept | Accept complete domain outcome: Reverse old effect and apply proposed same-type effect as one complete correction. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-16]; [PRD-28] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Editable fields and Expense Fund-reference classification remain open. | [PRD-16]; [PRD-28] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Editable fields and Expense Fund-reference classification remain open. | [PRD-16]; [PRD-28] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Editable fields and Expense Fund-reference classification remain open. | [PRD-16]; [PRD-28] |
| Category candidate | Lifecycle Constraint Provider; Behavior-Fact Provider | kind, lifecycle, identity | Income/Expense compatibility and deletion dependency | classification meaning | reference validity in affected history | historical classification | Editable fields and Expense Fund-reference classification remain open. | [PRD-16]; [PRD-28] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | ordered Account–Fund history | backing Accounts and fund events | Editable fields and Expense Fund-reference classification remain open. | [PRD-16]; [PRD-28] |
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | ordered repayment history | opening source and repayments | Editable fields and Expense Fund-reference classification remain open. | [PRD-16]; [PRD-28] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Editable fields and Expense Fund-reference classification remain open. | [PRD-16]; [PRD-28] |

#### Outcome Summary

- **Accepted complete outcome:** Reverse old effect and apply proposed same-type effect as one complete correction.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Earliest old/new Event Date.
- **Later state reevaluated:** All later old/new affected histories and derived views.
- **Unresolved behavior detail:** Editable fields and Expense Fund-reference classification remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-CR-02 — Replace Financial Event with Different Event Type

#### Behavior Header

- **Behavior ID:** CR-02
- **Behavior Name:** Replace Financial Event with Different Event Type
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Retain original, link distinct replacement, reverse old effect, and apply new effect together.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Ordinary-history visibility and correction reason remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-16]; [PRD-28] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-16]; [PRD-28] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Original event exists; replacement has a different Event Type, distinct identity, required references, and explicit replacement relationship. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-16]; [PRD-28] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-16]; [PRD-28] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Old and replacement dates satisfy all applicable constraints. | Event Date and effective dates | Financial Event; actually referenced Account and Debt Record candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-16]; [PRD-28] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; actually referenced Account and Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-16]; [PRD-28] | No event is silently excluded |
| 7 | Monetary Sufficiency | Old reversal and replacement effect are each valid in combined chronology. | amounts and chronological balances | Financial Event; Account; Dedicated Fund; Debt Record candidates | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-16]; [PRD-28] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Financial Event; Account; Dedicated Fund; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-16]; [PRD-28] | User-facing priority remains open |
| 8 | Local Invariant Validation | Original remains retained/marked replaced; replacement is distinct; no double counting. | candidate-local facts | Financial Event candidate | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-16]; [PRD-28] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Financial Event candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-16]; [PRD-28] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | All old/new boundaries and reports reconcile after reversal and application. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-16]; [PRD-28] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-16]; [PRD-28] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Earliest original/replacement Event Date. | ordered affected histories | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-16]; [PRD-28] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-16]; [PRD-28] | No silent historical exclusion |
| 11 | Traceability and Cross-View Consistency | Explain original, replacement, relationship, and before/after effects. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-16]; [PRD-28] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-16]; [PRD-28] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Accept | Accept complete domain outcome: Retain original, link distinct replacement, reverse old effect, and apply new effect together. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-16]; [PRD-28] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Ordinary-history visibility and correction reason remain open. | [PRD-16]; [PRD-28] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Ordinary-history visibility and correction reason remain open. | [PRD-16]; [PRD-28] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Ordinary-history visibility and correction reason remain open. | [PRD-16]; [PRD-28] |
| Category candidate | Lifecycle Constraint Provider; Behavior-Fact Provider | kind, lifecycle, identity | Income/Expense compatibility and deletion dependency | classification meaning | reference validity in affected history | historical classification | Ordinary-history visibility and correction reason remain open. | [PRD-16]; [PRD-28] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | ordered Account–Fund history | backing Accounts and fund events | Ordinary-history visibility and correction reason remain open. | [PRD-16]; [PRD-28] |
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | ordered repayment history | opening source and repayments | Ordinary-history visibility and correction reason remain open. | [PRD-16]; [PRD-28] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Ordinary-history visibility and correction reason remain open. | [PRD-16]; [PRD-28] |

#### Outcome Summary

- **Accepted complete outcome:** Retain original, link distinct replacement, reverse old effect, and apply new effect together.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Earliest original/replacement Event Date.
- **Later state reevaluated:** Every later history touched by either event.
- **Unresolved behavior detail:** Ordinary-history visibility and correction reason remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-CR-03 — Preview Correction Impact

#### Behavior Header

- **Behavior ID:** CR-03
- **Behavior Name:** Preview Correction Impact
- **Behavior Status:** Confirmed Rule with Open Detail
- **Decision Objective:** Produce evaluation-only Impact Preview; confirmed state remains unchanged.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Threshold, reason, presentation, and confirmation wording remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-16]; [PRD-28] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-16]; [PRD-28] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: A correction proposal identifies old/proposed facts, affected boundaries, and requested preview scope. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-16]; [PRD-28] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-16]; [PRD-28] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Projected dates are evaluated but confirmed facts are not changed. | Event Date and effective dates | Financial Event; actually referenced Account and Debt Record candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-16]; [PRD-28] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; actually referenced Account and Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-16]; [PRD-28] | No event is silently excluded |
| 7 | Monetary Sufficiency | Projected sufficiency is evaluated at every affected point. | amounts and chronological balances | Financial Event; Account; Dedicated Fund; Debt Record candidates | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-16]; [PRD-28] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Financial Event; Account; Dedicated Fund; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-16]; [PRD-28] | User-facing priority remains open |
| 8 | Local Invariant Validation | Preview uses the same local invariants as confirmation. | candidate-local facts | Financial Event; Account; Category; Dedicated Fund; Debt Record candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-16]; [PRD-28] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Financial Event; Account; Category; Dedicated Fund; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-16]; [PRD-28] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Preview identifies cross-boundary effects, report regrouping, and potential blockers. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-16]; [PRD-28] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-16]; [PRD-28] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Proposal-specific earliest affected point. | ordered affected histories | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-16]; [PRD-28] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-16]; [PRD-28] | No silent historical exclusion |
| 11 | Traceability and Cross-View Consistency | Show projected dates, boundaries, values, validity, and blockers. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-16]; [PRD-28] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-16]; [PRD-28] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Accept | Accept complete domain outcome: Produce evaluation-only Impact Preview; confirmed state remains unchanged. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-16]; [PRD-28] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Threshold, reason, presentation, and confirmation wording remain open. | [PRD-16]; [PRD-28] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Threshold, reason, presentation, and confirmation wording remain open. | [PRD-16]; [PRD-28] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Threshold, reason, presentation, and confirmation wording remain open. | [PRD-16]; [PRD-28] |
| Category candidate | Lifecycle Constraint Provider; Behavior-Fact Provider | kind, lifecycle, identity | Income/Expense compatibility and deletion dependency | classification meaning | reference validity in affected history | historical classification | Threshold, reason, presentation, and confirmation wording remain open. | [PRD-16]; [PRD-28] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | ordered Account–Fund history | backing Accounts and fund events | Threshold, reason, presentation, and confirmation wording remain open. | [PRD-16]; [PRD-28] |
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | ordered repayment history | opening source and repayments | Threshold, reason, presentation, and confirmation wording remain open. | [PRD-16]; [PRD-28] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Threshold, reason, presentation, and confirmation wording remain open. | [PRD-16]; [PRD-28] |

#### Outcome Summary

- **Accepted complete outcome:** Produce evaluation-only Impact Preview; confirmed state remains unchanged.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Proposal-specific earliest affected point.
- **Later state reevaluated:** Every projected later affected state.
- **Unresolved behavior detail:** Threshold, reason, presentation, and confirmation wording remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

## 21. Deletion, Trash, Restoration, and Archival Decision Tables

### DT-LC-01 — Soft Delete Financial Event

#### Behavior Header

- **Behavior ID:** LC-01
- **Behavior Name:** Soft Delete Financial Event
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Soft-delete only by preserving identity and reversing the complete effect.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Trash retention remains open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-16] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-16] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Active Financial Event and complete original effect are identifiable. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-16] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-16] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Original Event Date and current effective-date constraints remain available for reversal evaluation. | Event Date and effective dates | Financial Event; actually referenced Account and Debt Record candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-16] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; actually referenced Account and Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-16] | No event is silently excluded |
| 7 | Monetary Sufficiency | Reversal must leave all affected monetary histories valid. | amounts and chronological balances | Financial Event; Account; Dedicated Fund; Debt Record candidates | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-16] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Financial Event; Account; Dedicated Fund; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-16] | User-facing priority remains open |
| 8 | Local Invariant Validation | Event identity moves to Trash and full effect is reversed. | candidate-local facts | Financial Event candidate | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-16] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Financial Event candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-16] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Every referenced boundary and report reflects the complete reversal. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-16] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-16] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Event Date. | ordered affected histories | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-16] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-16] | No silent historical exclusion |
| 11 | Traceability and Cross-View Consistency | Trash retains original facts, effect, reversal, and blocker explanation. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-16] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-16] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Accept | Accept complete domain outcome: Soft-delete only by preserving identity and reversing the complete effect. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-16] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Trash retention remains open. | [PRD-16] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Trash retention remains open. | [PRD-16] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Trash retention remains open. | [PRD-16] |
| Category candidate | Lifecycle Constraint Provider; Behavior-Fact Provider | kind, lifecycle, identity | Income/Expense compatibility and deletion dependency | classification meaning | reference validity in affected history | historical classification | Trash retention remains open. | [PRD-16] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | ordered Account–Fund history | backing Accounts and fund events | Trash retention remains open. | [PRD-16] |
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | ordered repayment history | opening source and repayments | Trash retention remains open. | [PRD-16] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Trash retention remains open. | [PRD-16] |

#### Outcome Summary

- **Accepted complete outcome:** Soft-delete only by preserving identity and reversing the complete effect.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Event Date.
- **Later state reevaluated:** Every later affected event and derived state.
- **Unresolved behavior detail:** Trash retention remains open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-LC-02 — Restore Financial Event

#### Behavior Header

- **Behavior ID:** LC-02
- **Behavior Name:** Restore Financial Event
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Restore the same event and reapply its complete effect; otherwise preserve Trash state.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Archived-reference restoration eligibility remains open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-16]; [PRD-28] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-16]; [PRD-28] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Trashed Financial Event exists and current references/lifecycle eligibility are evaluated now, not at deletion time. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-16]; [PRD-28] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-16]; [PRD-28] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Event Date remains valid against current Account/Debt effective dates. | Event Date and effective dates | Financial Event; actually referenced Account and Debt Record candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-16]; [PRD-28] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; actually referenced Account and Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-16]; [PRD-28] | No event is silently excluded |
| 7 | Monetary Sufficiency | Current monetary state can support complete reapplication. | amounts and chronological balances | Financial Event; Account; Dedicated Fund; Debt Record candidates | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-16]; [PRD-28] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Financial Event; Account; Dedicated Fund; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-16]; [PRD-28] | User-facing priority remains open |
| 8 | Local Invariant Validation | Same identity returns active only if form-specific local rules hold. | candidate-local facts | Financial Event; actually referenced Account, Category, Dedicated Fund, and Debt Record candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-16]; [PRD-28] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Financial Event; actually referenced Account, Category, Dedicated Fund, and Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-16]; [PRD-28] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | All current references and every later affected state remain valid. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-16]; [PRD-28] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-16]; [PRD-28] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Event Date. | ordered affected histories | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-16]; [PRD-28] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-16]; [PRD-28] | No silent historical exclusion |
| Open | Protected Open Decision | Complete reapplication depends on an archived referenced Account, Category, Dedicated Fund, or Debt Record whose restoration eligibility is unresolved. | current lifecycle of the actually referenced candidate | Actually referenced lifecycle candidate | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Archived-reference restoration eligibility | Record the archived reference and preserve Trash state. | [PRD-16]; [PRD-28] | Restorations with eligible active references continue. |
| 11 | Traceability and Cross-View Consistency | Explain current-state evaluation, reapplication, or first blocker. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-16]; [PRD-28] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-16]; [PRD-28] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Accept | Accept complete domain outcome: Restore the same event and reapply its complete effect; otherwise preserve Trash state. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-16]; [PRD-28] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Archived-reference restoration eligibility remains open. | [PRD-16]; [PRD-28] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Archived-reference restoration eligibility remains open. | [PRD-16]; [PRD-28] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Archived-reference restoration eligibility remains open. | [PRD-16]; [PRD-28] |
| Category candidate | Lifecycle Constraint Provider; Behavior-Fact Provider | kind, lifecycle, identity | Income/Expense compatibility and deletion dependency | classification meaning | reference validity in affected history | historical classification | Archived-reference restoration eligibility remains open. | [PRD-16]; [PRD-28] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | ordered Account–Fund history | backing Accounts and fund events | Archived-reference restoration eligibility remains open. | [PRD-16]; [PRD-28] |
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | ordered repayment history | opening source and repayments | Archived-reference restoration eligibility remains open. | [PRD-16]; [PRD-28] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Archived-reference restoration eligibility remains open. | [PRD-16]; [PRD-28] |

#### Outcome Summary

- **Accepted complete outcome:** Restore the same event and reapply its complete effect; otherwise preserve Trash state.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Event Date.
- **Later state reevaluated:** Every later affected event and derived state.
- **Unresolved behavior detail:** Archived-reference restoration eligibility remains open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-LC-03 — Permanently Delete Trashed Financial Event

#### Behavior Header

- **Behavior ID:** LC-03
- **Behavior Name:** Permanently Delete Trashed Financial Event
- **Behavior Status:** Still Open
- **Decision Objective:** No accepted outcome is defined; keep the record in its confirmed state.
- **Primary Candidate Boundaries:** Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** Availability, retention, eligibility, and traceability deletion are unresolved.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-16]; [PRD-28] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-16]; [PRD-28] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Trashed event exists, but availability, retention, eligibility, and traceability-deletion policy are unresolved. | identity, lifecycle, required references | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-16]; [PRD-28] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-16]; [PRD-28] | Lifecycle details may remain open |
| 9 | Cross-Boundary Invariant Validation | Required historical and replacement/correction traceability cannot be assumed removable. | cross-boundary facts and reconciled meanings | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-16]; [PRD-28] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-16]; [PRD-28] | No partial acceptance |
| 11 | Traceability and Cross-View Consistency | Record the unresolved decision without defining deletion mechanics. | supporting records and derived meanings | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-16]; [PRD-28] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-16]; [PRD-28] | User-facing priority remains open |
| 12 | Protected Open Decision | Permanent deletion availability, retention, eligibility, and traceability treatment are not established, so no confirmed accepted outcome exists. | unresolved permanent-deletion rule | Still Open — no candidate fact provider established | Open | Acceptance blocked; no confirmed outcome exists until this decision is resolved. | Yes | Acceptance-Blocking Open Decision | Preserve the Financial Event in Trash and retain current confirmed state. | [PRD-16]; [PRD-28] | Permanent deletion remains unresolved. |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | None for this behavior | individual effect and correction links | Availability, retention, eligibility, and traceability deletion are unresolved. | [PRD-16]; [PRD-28] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | None for this behavior | opening state and Account-affecting events | Availability, retention, eligibility, and traceability deletion are unresolved. | [PRD-16]; [PRD-28] |
| Category candidate | Lifecycle Constraint Provider; Behavior-Fact Provider | kind, lifecycle, identity | Income/Expense compatibility and deletion dependency | classification meaning | None for this behavior | historical classification | Availability, retention, eligibility, and traceability deletion are unresolved. | [PRD-16]; [PRD-28] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | None for this behavior | backing Accounts and fund events | Availability, retention, eligibility, and traceability deletion are unresolved. | [PRD-16]; [PRD-28] |
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | None for this behavior | opening source and repayments | Availability, retention, eligibility, and traceability deletion are unresolved. | [PRD-16]; [PRD-28] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | None for this behavior | exact range and supporting records | Availability, retention, eligibility, and traceability deletion are unresolved. | [PRD-16]; [PRD-28] |

#### Outcome Summary

- **Accepted complete outcome:** No confirmed accepted outcome; preserve the current state and status.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** None.
- **Later state reevaluated:** Potential linked corrections, replacements, and explanations.
- **Unresolved behavior detail:** Availability, retention, eligibility, and traceability deletion are unresolved.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-LC-04 — Archive Domain Reference

#### Behavior Header

- **Behavior ID:** LC-04
- **Behavior Name:** Archive Domain Reference
- **Behavior Status:** Confirmed Rule with Open Detail
- **Decision Objective:** Apply only the confirmed concept-specific archive outcome; do not silently resolve Fund non-zero case.
- **Primary Candidate Boundaries:** Workspace; Account; Category; Dedicated Fund; Financial Event; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** Concept-specific Fund and reporting rules remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Reference type is Account, Category, or Dedicated Fund; apply only its concept-specific lifecycle rule. | identity, lifecycle, required references | Workspace; Account; Category; Dedicated Fund; Financial Event; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Account; Category; Dedicated Fund; Financial Event; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | Lifecycle details may remain open |
| 7 | Monetary Sufficiency | For Account archival, Total Account Balance equals Rp0; Category archival has no monetary constraint. | Account Total Account Balance when the target is Account | Account candidate | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | None |
| 7 | Monetary Sufficiency | The proposed Account archival has Total Account Balance other than Rp0. | Account Total Account Balance | Account candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | User-facing priority remains open |
| 8 | Local Invariant Validation | Archival changes lifecycle only and preserves history; no universal rule is inferred. | candidate-local facts | Account; Category; Dedicated Fund candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account; Category; Dedicated Fund candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Historical Financial Event references and reporting meaning remain coherent. | cross-boundary facts and reconciled meanings | Workspace; Account; Category; Dedicated Fund; Financial Event; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Account; Category; Dedicated Fund; Financial Event; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | No partial acceptance |
| Open | Protected Open Decision | The proposed reference is a Dedicated Fund whose Fund Balance is other than Rp0. | Fund Balance | Dedicated Fund candidate | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Non-zero Dedicated Fund archival remains unresolved | Preserve active lifecycle and all financial state. | [PRD-14]; [PRD-28] | Account and Category branches continue under their own confirmed rules. |
| 11 | Traceability and Cross-View Consistency | Explain concept-specific balance/dependencies and preserve identity. | supporting records and derived meanings | Workspace; Account; Category; Dedicated Fund; Financial Event; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Account; Category; Dedicated Fund; Financial Event; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Account; Category; Dedicated Fund; Financial Event; Reporting candidates | Accept | Accept complete domain outcome: Apply only the confirmed concept-specific archive outcome; do not silently resolve Fund non-zero case. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | None for this behavior | owner-scoped supporting set | Concept-specific Fund and reporting rules remain open. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | None for this behavior | opening state and Account-affecting events | Concept-specific Fund and reporting rules remain open. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] |
| Category candidate | Lifecycle Constraint Provider; Behavior-Fact Provider | kind, lifecycle, identity | Income/Expense compatibility and deletion dependency | classification meaning | None for this behavior | historical classification | Concept-specific Fund and reporting rules remain open. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | None for this behavior | backing Accounts and fund events | Concept-specific Fund and reporting rules remain open. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | None for this behavior | individual effect and correction links | Concept-specific Fund and reporting rules remain open. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | None for this behavior | exact range and supporting records | Concept-specific Fund and reporting rules remain open. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] |

#### Outcome Summary

- **Accepted complete outcome:** Apply only the confirmed concept-specific archive outcome; do not silently resolve Fund non-zero case.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** None for archival itself.
- **Later state reevaluated:** Historical readers and restoration eligibility.
- **Unresolved behavior detail:** Concept-specific Fund and reporting rules remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-LC-05 — Restore Archived Domain Reference

#### Behavior Header

- **Behavior ID:** LC-05
- **Behavior Name:** Restore Archived Domain Reference
- **Behavior Status:** Confirmed Rule with Open Detail
- **Decision Objective:** Apply only confirmed Account/Category restoration; preserve unresolved Fund state.
- **Primary Candidate Boundaries:** Workspace; Account; Category; Dedicated Fund; Financial Event.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** Dedicated Fund restoration remains open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Reference type is Account, Category, or Dedicated Fund; Account/Category restore rules exist, Fund restore remains open. | identity, lifecycle, required references | Workspace; Account; Category; Dedicated Fund; Financial Event candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Account; Category; Dedicated Fund; Financial Event candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | Lifecycle details may remain open |
| 8 | Local Invariant Validation | Account/Category return active as the same identity; no Fund outcome is assumed. | candidate-local facts | Account; Category candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account; Category candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Workspace scope and historical references remain valid. | cross-boundary facts and reconciled meanings | Workspace; Account; Category; Dedicated Fund; Financial Event candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Account; Category; Dedicated Fund; Financial Event candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | No partial acceptance |
| Open | Protected Open Decision | The proposed reference restoration targets a Dedicated Fund. | Dedicated Fund identity, lifecycle, balance, and history | Dedicated Fund candidate | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Dedicated Fund restoration remains unresolved | Preserve archived lifecycle and existing financial state. | [PRD-14]; [PRD-28] | Account and Category restorations continue under confirmed rules. |
| 11 | Traceability and Cross-View Consistency | Explain same-identity restoration or unresolved Fund branch. | supporting records and derived meanings | Workspace; Account; Category; Dedicated Fund; Financial Event candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Account; Category; Dedicated Fund; Financial Event candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Account; Category; Dedicated Fund; Financial Event candidates | Accept | Accept complete domain outcome: Apply only confirmed Account/Category restoration; preserve unresolved Fund state. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | None for this behavior | owner-scoped supporting set | Dedicated Fund restoration remains open. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | None for this behavior | opening state and Account-affecting events | Dedicated Fund restoration remains open. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] |
| Category candidate | Lifecycle Constraint Provider; Behavior-Fact Provider | kind, lifecycle, identity | Income/Expense compatibility and deletion dependency | classification meaning | None for this behavior | historical classification | Dedicated Fund restoration remains open. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | None for this behavior | backing Accounts and fund events | Dedicated Fund restoration remains open. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | None for this behavior | individual effect and correction links | Dedicated Fund restoration remains open. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] |

#### Outcome Summary

- **Accepted complete outcome:** Apply only confirmed Account/Category restoration; preserve unresolved Fund state.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** None.
- **Later state reevaluated:** Future eligibility and historical readers.
- **Unresolved behavior detail:** Dedicated Fund restoration remains open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

## 22. Reporting Period Decision Tables

### DT-RP-03 — Change Reporting Period Configuration

#### Behavior Header

- **Behavior ID:** RP-03
- **Behavior Name:** Change Reporting Period Configuration
- **Behavior Status:** Confirmed Rule with Open Detail
- **Decision Objective:** Recalculate reporting membership and derived reporting totals only; change no financial fact.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Dedicated Fund; Debt Record; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26); Chronological Recalculation Decision Table (RC-01).
- **Protected Open Questions:** Application timing, preview threshold, and final modeling form remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-17]; [PRD-28] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-17]; [PRD-28] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Proposed mode is Calendar Month or Custom Monthly Cycle with start day 1–28; all active Event Dates are available. | identity, lifecycle, required references | Workspace; Financial Event; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-17]; [PRD-28] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-17]; [PRD-28] | Lifecycle details may remain open |
| 9 | Cross-Boundary Invariant Validation | All reporting consumers agree on old/new membership and totals, while Financial Event facts, Account balances, Account-backed allocations, Fund Balance, and Outstanding Principal remain unchanged. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Reporting-only regrouping and all-or-nothing cross-boundary meaning | Record old/new reporting meanings and the unchanged financial meanings. | [PRD-17]; [PRD-28] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Reporting consumers disagree, or the proposal would alter any Financial Event fact, Account balance, Account-backed allocation, Fund Balance, or Outstanding Principal. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Reporting-only regrouping and all-or-nothing cross-boundary meaning | Show disagreement or prohibited financial-state effect and preserve all prior state. | [PRD-17]; [PRD-28] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Earliest affected reporting-period boundary. | ordered affected histories | Workspace; Financial Event; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-17]; [PRD-28] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-17]; [PRD-28] | No silent historical exclusion |
| Open | Protected Open Decision | The proposed reporting change requires an application start or reporting-period modeling form not established by confirmed policy. | unresolved application/modeling decision | Still Open — no candidate fact provider established | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Reporting application/modeling detail remains unresolved | Preserve the confirmed reporting configuration. | [PRD-17]; [PRD-28] | Proposals fully described by confirmed modes, ranges, and membership rules continue. |
| 11 | Traceability and Cross-View Consistency | Impact Preview shows old/new ranges, membership, totals, and unchanged Financial Event facts and financial state. | supporting records and derived meanings | Workspace; Financial Event; Account; Dedicated Fund; Debt Record; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation and unchanged-state comparison. | [PRD-17]; [PRD-28] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records, derived views, or unchanged-state comparisons disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-17]; [PRD-28] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Dedicated Fund; Debt Record; Reporting candidates | Accept | Accept complete domain outcome: Recalculate reporting membership and derived reporting totals only; change no Financial Event fact, Account balance, Account-backed allocation, Fund Balance, or Outstanding Principal. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-17]; [PRD-28] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Application timing, preview threshold, and final modeling form remain open. | [PRD-17]; [PRD-28] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Application timing, preview threshold, and final modeling form remain open. | [PRD-17]; [PRD-28] |
| Account candidate | Local-Invariant Evaluator; Traceability Participant | balances and Account-backed allocations | financial values remain unchanged | unchanged Account financial meaning | comparison only; no financial recalculation | before/after financial-state comparison | Application timing, preview threshold, and final modeling form remain open. | [PRD-17]; [PRD-28] |
| Dedicated Fund candidate | Local-Invariant Evaluator; Traceability Participant | Fund Balance and per-Account breakdown | Fund values remain unchanged | unchanged Fund financial meaning | comparison only; no financial recalculation | before/after financial-state comparison | Application timing, preview threshold, and final modeling form remain open. | [PRD-17]; [PRD-28] |
| Debt Record candidate | Local-Invariant Evaluator; Traceability Participant | Outstanding Principal | principal remains unchanged | unchanged Debt financial meaning | comparison only; no financial recalculation | before/after financial-state comparison | Application timing, preview threshold, and final modeling form remain open. | [PRD-17]; [PRD-28] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Application timing, preview threshold, and final modeling form remain open. | [PRD-17]; [PRD-28] |

#### Outcome Summary

- **Accepted complete outcome:** Recalculate reporting membership and derived reporting totals only; change no Financial Event fact, Account balance, Account-backed allocation, Fund Balance, or Outstanding Principal.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Earliest affected reporting-period boundary.
- **Later state reevaluated:** Every event whose membership/comparison changes and all reporting consumers.
- **Unresolved behavior detail:** Application timing, preview threshold, and final modeling form remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### Referenced Shared and Still-Open Records

| Behavior ID | Behavior | Coverage | Shared decision logic | Protected result | Source |
|---|---|---|---|---|---|
| RP-01 | Use Calendar Month | Referenced Shared Decision Table | Uses §5 sequence, §26 blocking rules, and concept-specific lifecycle/reference rules from the Behavior Catalog. | No protected domain question. | [PRD-17] |
| RP-02 | Use Custom Monthly Cycle | Referenced Shared Decision Table | Uses §5 sequence, §26 blocking rules, and concept-specific lifecycle/reference rules from the Behavior Catalog. | One-off ranges and final modeling form remain open. | [PRD-17]; [PRD-28] |

## 23. Chronological Recalculation Decision Tables

### DT-RC-01 — Recalculate Chronologically Affected State

#### Behavior Header

- **Behavior ID:** RC-01
- **Behavior Name:** Recalculate Chronologically Affected State
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Accept the complete recalculated derived state for affected histories only.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** Same-date mechanism and final coordination responsibility remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-9]; [PRD-16]; [PRD-19] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-9]; [PRD-16]; [PRD-19] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Trigger is backdated creation, Same-Type Edit, Event Replacement, Soft Deletion, Restoration, or Account/Debt opening amount/date correction; affected scope is identifiable. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-9]; [PRD-16]; [PRD-19] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-9]; [PRD-16]; [PRD-19] | Lifecycle details may remain open |
| 6 | Effective-Date Validity | Every Event Date remains valid against all referenced effective dates and same-date ordering is deterministic. | Event Date and effective dates | Financial Event; actually referenced Account and Debt Record candidates | Pass | Continue candidate evaluation. | No | Cross-boundary Event Date validity | Show compared dates. | [PRD-9]; [PRD-16]; [PRD-19] | Same-date mechanism remains open where relevant |
| 6 | Effective-Date Validity | Any applicable Event Date precedes a referenced effective date. | Event Date and effective dates | Financial Event; actually referenced Account and Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Cross-boundary Event Date validity | Identify invalid date/reference pair. | [PRD-9]; [PRD-16]; [PRD-19] | No event is silently excluded |
| 7 | Monetary Sufficiency | Every monetary invariant holds at every affected point. | amounts and chronological balances | Financial Event; Account; Dedicated Fund; Debt Record candidates | Pass | Continue candidate evaluation. | No | Non-negative monetary state | Show compared amount and available value. | [PRD-9]; [PRD-16]; [PRD-19] | None |
| 7 | Monetary Sufficiency | Any required monetary sufficiency condition fails. | amounts and chronological balances | Financial Event; Account; Dedicated Fund; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Non-negative monetary state | Identify first shortfall without partial effect. | [PRD-9]; [PRD-16]; [PRD-19] | User-facing priority remains open |
| 8 | Local Invariant Validation | Each Account equation and Debt principal path remain valid locally. | candidate-local facts | Account; Dedicated Fund; Debt Record candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-9]; [PRD-16]; [PRD-19] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account; Dedicated Fund; Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-9]; [PRD-16]; [PRD-19] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | All Account/Fund/Debt/Event/report meanings reconcile; no existing event is omitted. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-9]; [PRD-16]; [PRD-19] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-9]; [PRD-16]; [PRD-19] | No partial acceptance |
| 10 | Chronological Recalculation Validation | Every later affected point remains valid from Earliest changed Event Date or opening effective date. | ordered affected histories | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Every-point historical validity | Record evaluated range and later participants. | [PRD-9]; [PRD-16]; [PRD-19] | Exact same-date mechanism remains open |
| 10 | Chronological Recalculation Validation | Any later affected point violates a confirmed invariant. | ordered affected histories | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Every-point historical validity | Identify first blocking point; omit no event. | [PRD-9]; [PRD-16]; [PRD-19] | No silent historical exclusion |
| Open | Protected Open Decision | Multiple affected Financial Events share one Event Date and their relative ordering can change invariant evaluation. | affected event identities and Event Dates | Financial Event candidate | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Deterministic same-date evaluation | Record tied events and affected histories. | [PRD-16] | Recalculation without an outcome-relevant same-date tie continues. |
| 11 | Traceability and Cross-View Consistency | Expose trigger, ordering requirement, each affected point, first blocker, and final reconciliation. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-9]; [PRD-16]; [PRD-19] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-9]; [PRD-16]; [PRD-19] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Accept | Accept complete domain outcome: Accept the complete recalculated derived state for affected histories only. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-9]; [PRD-16]; [PRD-19] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | as affected by reporting/configuration | owner-scoped supporting set | Same-date mechanism and final coordination responsibility remain open. | [PRD-9]; [PRD-16]; [PRD-19] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | chronological position and old/new effect | individual effect and correction links | Same-date mechanism and final coordination responsibility remain open. | [PRD-9]; [PRD-16]; [PRD-19] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | ordered Account history | opening state and Account-affecting events | Same-date mechanism and final coordination responsibility remain open. | [PRD-9]; [PRD-16]; [PRD-19] |
| Category candidate | Lifecycle Constraint Provider; Behavior-Fact Provider | kind, lifecycle, identity | Income/Expense compatibility and deletion dependency | classification meaning | reference validity in affected history | historical classification | Same-date mechanism and final coordination responsibility remain open. | [PRD-9]; [PRD-16]; [PRD-19] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | ordered Account–Fund history | backing Accounts and fund events | Same-date mechanism and final coordination responsibility remain open. | [PRD-9]; [PRD-16]; [PRD-19] |
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | ordered repayment history | opening source and repayments | Same-date mechanism and final coordination responsibility remain open. | [PRD-9]; [PRD-16]; [PRD-19] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | recomputed membership/totals only | exact range and supporting records | Same-date mechanism and final coordination responsibility remain open. | [PRD-9]; [PRD-16]; [PRD-19] |

#### Outcome Summary

- **Accepted complete outcome:** Accept the complete recalculated derived state for affected histories only.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** Earliest changed Event Date or opening effective date.
- **Later state reevaluated:** Every later state touched by old/proposed references; unaffected histories are not reevaluated.
- **Unresolved behavior detail:** Same-date mechanism and final coordination responsibility remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, event sourcing, replay, framework, or Architecture structure is selected.

## 24. Traceability and Supporting-Record Decision Tables

### DT-TC-01 — Explain Derived Account Values

#### Behavior Header

- **Behavior ID:** TC-01
- **Behavior Name:** Explain Derived Account Values
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Return one traceable explanation; change no state.
- **Primary Candidate Boundaries:** Financial Event; Account; Dedicated Fund; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** Exact presentation remains undecided.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-19] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-19] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Account and complete opening/event/allocation support set exist. | identity, lifecycle, required references | Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-19] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-19] | Lifecycle details may remain open |
| 8 | Local Invariant Validation | Explained Total, Unallocated, and allocation decomposition equal confirmed Account state. | candidate-local facts | Account candidate | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-19] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-19] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Fund and reporting explanations agree with Account values. | cross-boundary facts and reconciled meanings | Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-19] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-19] | No partial acceptance |
| 11 | Traceability and Cross-View Consistency | Identify formula, opening source, events, and allocations. | supporting records and derived meanings | Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-19] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-19] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Financial Event; Account; Dedicated Fund; Reporting candidates | Accept | Accept complete domain outcome: Return one traceable explanation; change no state. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-19] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | None for this behavior | individual effect and correction links | Exact presentation remains undecided. | [PRD-19] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | None for this behavior | opening state and Account-affecting events | Exact presentation remains undecided. | [PRD-19] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | None for this behavior | backing Accounts and fund events | Exact presentation remains undecided. | [PRD-19] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | None for this behavior | exact range and supporting records | Exact presentation remains undecided. | [PRD-19] |

#### Outcome Summary

- **Accepted complete outcome:** Return one traceable explanation; change no state.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** None.
- **Later state reevaluated:** Explanation changes when supporting facts change.
- **Unresolved behavior detail:** Exact presentation remains undecided.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-TC-02 — Explain Dedicated Fund Balance and Account Breakdown

#### Behavior Header

- **Behavior ID:** TC-02
- **Behavior Name:** Explain Dedicated Fund Balance and Account Breakdown
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Return one reconciled Fund explanation; change no state.
- **Primary Candidate Boundaries:** Financial Event; Account; Dedicated Fund; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** Exact presentation remains undecided.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-14]; [PRD-19] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-14]; [PRD-19] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Dedicated Fund, per-Account allocation breakdown, and supporting events exist. | identity, lifecycle, required references | Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-14]; [PRD-19] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-14]; [PRD-19] | Lifecycle details may remain open |
| 8 | Local Invariant Validation | Fund Balance equals sum of Account-backed allocations. | candidate-local facts | Account; Dedicated Fund candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-14]; [PRD-19] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account; Dedicated Fund candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-14]; [PRD-19] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Account, Fund, Financial Event, and reporting meanings agree. | cross-boundary facts and reconciled meanings | Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-14]; [PRD-19] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-14]; [PRD-19] | No partial acceptance |
| 11 | Traceability and Cross-View Consistency | Identify every backing Account and allocation/release/fund-linked Expense. | supporting records and derived meanings | Financial Event; Account; Dedicated Fund; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-14]; [PRD-19] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Financial Event; Account; Dedicated Fund; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-14]; [PRD-19] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Financial Event; Account; Dedicated Fund; Reporting candidates | Accept | Accept complete domain outcome: Return one reconciled Fund explanation; change no state. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-14]; [PRD-19] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | None for this behavior | individual effect and correction links | Exact presentation remains undecided. | [PRD-14]; [PRD-19] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | None for this behavior | opening state and Account-affecting events | Exact presentation remains undecided. | [PRD-14]; [PRD-19] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | None for this behavior | backing Accounts and fund events | Exact presentation remains undecided. | [PRD-14]; [PRD-19] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | None for this behavior | exact range and supporting records | Exact presentation remains undecided. | [PRD-14]; [PRD-19] |

#### Outcome Summary

- **Accepted complete outcome:** Return one reconciled Fund explanation; change no state.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** None.
- **Later state reevaluated:** Explanation changes when supporting facts change.
- **Unresolved behavior detail:** Exact presentation remains undecided.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-TC-03 — Explain Outstanding Principal

#### Behavior Header

- **Behavior ID:** TC-03
- **Behavior Name:** Explain Outstanding Principal
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Return one reconciled principal explanation; change no state.
- **Primary Candidate Boundaries:** Financial Event; Account; Debt Record; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** Exact presentation remains undecided.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-15]; [PRD-19] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-15]; [PRD-19] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Debt Record opening state and all active Debt Repayments exist. | identity, lifecycle, required references | Financial Event; Account; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-15]; [PRD-19] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Financial Event; Account; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-15]; [PRD-19] | Lifecycle details may remain open |
| 8 | Local Invariant Validation | Outstanding Principal equals opening principal minus active repayments and is non-negative. | candidate-local facts | Debt Record candidate | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-15]; [PRD-19] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Debt Record candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-15]; [PRD-19] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Account-linked repayments and reports agree with Debt Record. | cross-boundary facts and reconciled meanings | Financial Event; Account; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-15]; [PRD-19] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Financial Event; Account; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-15]; [PRD-19] | No partial acceptance |
| 11 | Traceability and Cross-View Consistency | Identify opening source and every active repayment. | supporting records and derived meanings | Financial Event; Account; Debt Record; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-15]; [PRD-19] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Financial Event; Account; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-15]; [PRD-19] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Financial Event; Account; Debt Record; Reporting candidates | Accept | Accept complete domain outcome: Return one reconciled principal explanation; change no state. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-15]; [PRD-19] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | None for this behavior | individual effect and correction links | Exact presentation remains undecided. | [PRD-15]; [PRD-19] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | None for this behavior | opening state and Account-affecting events | Exact presentation remains undecided. | [PRD-15]; [PRD-19] |
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | None for this behavior | opening source and repayments | Exact presentation remains undecided. | [PRD-15]; [PRD-19] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | None for this behavior | exact range and supporting records | Exact presentation remains undecided. | [PRD-15]; [PRD-19] |

#### Outcome Summary

- **Accepted complete outcome:** Return one reconciled principal explanation; change no state.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** None.
- **Later state reevaluated:** Explanation changes when supporting facts change.
- **Unresolved behavior detail:** Exact presentation remains undecided.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-TC-04 — Explain Workspace and Reporting Totals

#### Behavior Header

- **Behavior ID:** TC-04
- **Behavior Name:** Explain Workspace and Reporting Totals
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Return one reconciled Workspace/report explanation; change no state.
- **Primary Candidate Boundaries:** Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** Archived-Account inclusion and comparison metrics remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-17]; [PRD-19]; [PRD-28] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-17]; [PRD-19]; [PRD-28] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Workspace scope, reporting configuration, included Accounts/events, and exact period membership exist. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-17]; [PRD-19]; [PRD-28] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-17]; [PRD-19]; [PRD-28] | Lifecycle details may remain open |
| 8 | Local Invariant Validation | Each included derived value is internally valid. | candidate-local facts | Account; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-17]; [PRD-19]; [PRD-28] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Account; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-17]; [PRD-19]; [PRD-28] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Dashboard, reports, detail, and supporting records agree. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-17]; [PRD-19]; [PRD-28] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-17]; [PRD-19]; [PRD-28] | No partial acceptance |
| Open | Protected Open Decision | The requested total or comparison requires deciding whether an archived Account is included, and the applicable inclusion rule is unresolved. | Account lifecycle and reporting inclusion rule | Account; Reporting candidates | Open | Conditional open branch; no outcome is assumed for this proposal. | Yes | Historical-total inclusion remains unresolved | Identify the archived Account and affected total. | [PRD-12]; [PRD-17]; [PRD-28] | Explanations not requiring this unresolved inclusion decision continue. |
| 11 | Traceability and Cross-View Consistency | Identify exact range, inclusion set, formulas, and supporting records. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-17]; [PRD-19]; [PRD-28] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-17]; [PRD-19]; [PRD-28] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Accept | Accept complete domain outcome: Return one reconciled Workspace/report explanation; change no state. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-17]; [PRD-19]; [PRD-28] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Workspace candidate | Scope Provider; Derived-Meaning Consumer | owner scope and active configuration | workspace isolation and one active policy | scope/configuration meaning | None for this behavior | owner-scoped supporting set | Archived-Account inclusion and comparison metrics remain open. | [PRD-17]; [PRD-19]; [PRD-28] |
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | None for this behavior | individual effect and correction links | Archived-Account inclusion and comparison metrics remain open. | [PRD-17]; [PRD-19]; [PRD-28] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | None for this behavior | opening state and Account-affecting events | Archived-Account inclusion and comparison metrics remain open. | [PRD-17]; [PRD-19]; [PRD-28] |
| Category candidate | Lifecycle Constraint Provider; Behavior-Fact Provider | kind, lifecycle, identity | Income/Expense compatibility and deletion dependency | classification meaning | None for this behavior | historical classification | Archived-Account inclusion and comparison metrics remain open. | [PRD-17]; [PRD-19]; [PRD-28] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | None for this behavior | backing Accounts and fund events | Archived-Account inclusion and comparison metrics remain open. | [PRD-17]; [PRD-19]; [PRD-28] |
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | None for this behavior | opening source and repayments | Archived-Account inclusion and comparison metrics remain open. | [PRD-17]; [PRD-19]; [PRD-28] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | None for this behavior | exact range and supporting records | Archived-Account inclusion and comparison metrics remain open. | [PRD-17]; [PRD-19]; [PRD-28] |

#### Outcome Summary

- **Accepted complete outcome:** Return one reconciled Workspace/report explanation; change no state.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** None.
- **Later state reevaluated:** Explanation changes when sources or reporting membership change.
- **Unresolved behavior detail:** Archived-Account inclusion and comparison metrics remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

### DT-TC-05 — Explain One Financial Event’s Effects

#### Behavior Header

- **Behavior ID:** TC-05
- **Behavior Name:** Explain One Financial Event’s Effects
- **Behavior Status:** Confirmed Behavior
- **Decision Objective:** Return one complete event-effect explanation; change no state.
- **Primary Candidate Boundaries:** Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting.
- **Shared Decision Tables Used:** Candidate Domain Evaluation Sequence (§5); Rejection and Blocking Matrix (§26).
- **Protected Open Questions:** Presentation and prior-value retention remain open.

#### Decision Table

| Decision Step | Condition Group | Domain Condition | Required Fact | Candidate Fact Provider | Condition Result | Domain Outcome | Stop Evaluation? | Invariant or Rule Protected | Traceability Note | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Ownership and Workspace Scope | All references belong to the same owner Workspace. | owner and Workspace scope | Workspace candidate | Pass | Continue candidate evaluation. | No | Workspace isolation | Record owner-scoped participants. | [PRD-16]; [PRD-19]; [PRD-28] | None |
| 1 | Ownership and Workspace Scope | Owner/Workspace scope is wrong or cross-owner. | owner and Workspace scope | Workspace candidate | Fail | Block; preserve previously confirmed state. | Candidate yes | Workspace isolation | Explain scope failure without exposing other data. | [PRD-16]; [PRD-19]; [PRD-28] | User-facing priority remains open |
| 2–4 | Reference Existence and Lifecycle | Required shape/references/lifecycle are valid: Financial Event identity, form, references, lifecycle/correction links, and complete effect exist. | identity, lifecycle, required references | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | Behavior shape and reference integrity | Retain identities and reference facts. | [PRD-16]; [PRD-19]; [PRD-28] | None |
| 2–4 | Reference Existence and Lifecycle | Any required reference is missing/ineligible or behavior shape is invalid. | identity, lifecycle, required references | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Behavior shape and reference integrity | Identify missing/ineligible fact. | [PRD-16]; [PRD-19]; [PRD-28] | Lifecycle details may remain open |
| 8 | Local Invariant Validation | Event-form effect matches confirmed state. | candidate-local facts | Financial Event; actually referenced Account, Category, Dedicated Fund, and Debt Record candidates | Pass | Continue candidate evaluation. | No | Local invariants | Record evaluated local state. | [PRD-16]; [PRD-19]; [PRD-28] | Candidate evaluator remains provisional |
| 8 | Local Invariant Validation | A required local invariant fails. | candidate-local facts | Financial Event; actually referenced Account, Category, Dedicated Fund, and Debt Record candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Local invariants | Identify first invalid local state. | [PRD-16]; [PRD-19]; [PRD-28] | Evaluation ownership remains provisional |
| 9 | Cross-Boundary Invariant Validation | Every referenced Account/Fund/Debt/report view agrees. | cross-boundary facts and reconciled meanings | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Continue candidate evaluation. | No | All-or-nothing cross-boundary meaning | Record all participating meanings. | [PRD-16]; [PRD-19]; [PRD-28] | Final coordination responsibility remains open |
| 9 | Cross-Boundary Invariant Validation | Required participant meanings cannot reconcile. | cross-boundary facts and reconciled meanings | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | All-or-nothing cross-boundary meaning | Show disagreement and preserve all prior state. | [PRD-16]; [PRD-19]; [PRD-28] | No partial acceptance |
| 11 | Traceability and Cross-View Consistency | Show both Transfer sides, Fund provenance, or cash/principal sides as applicable. | supporting records and derived meanings | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Pass | Ready for complete outcome. | No | Traceability and cross-view agreement | Retain supporting-set explanation. | [PRD-16]; [PRD-19]; [PRD-28] | Presentation remains non-implementation |
| 11 | Traceability and Cross-View Consistency | Supporting records or derived views disagree. | supporting records and derived meanings | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Fail | Block; preserve previously confirmed state. | Candidate yes | Traceability and cross-view agreement | Expose disagreement; accept no outcome. | [PRD-16]; [PRD-19]; [PRD-28] | User-facing priority remains open |
| 12 | Cross-Boundary Invariant Validation | All applicable conditions pass. | complete evaluated fact set | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting candidates | Accept | Accept complete domain outcome: Return one complete event-effect explanation; change no state. | No | Complete domain meaning; no partial effect | Record accepted facts, effects, and sources. | [PRD-16]; [PRD-19]; [PRD-28] | Acceptance does not select implementation |

#### Boundary Participation Table

| Candidate Boundary | Provisional Participation Role | Facts Contributed | Invariants Evaluated | State or Meaning Affected | Recalculation Participation | Traceability Participation | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|
| Financial Event candidate | Behavior-Fact Provider; Affected-State Participant | event identity, form, amount, Event Date, references, lifecycle | required-reference shape and event identity continuity | event active/replaced/trashed meaning | None for this behavior | individual effect and correction links | Presentation and prior-value retention remain open. | [PRD-16]; [PRD-19]; [PRD-28] |
| Account candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, Total, Unallocated, Account-backed allocations | non-negative values and Account equation | Account financial state | None for this behavior | opening state and Account-affecting events | Presentation and prior-value retention remain open. | [PRD-16]; [PRD-19]; [PRD-28] |
| Category candidate | Lifecycle Constraint Provider; Behavior-Fact Provider | kind, lifecycle, identity | Income/Expense compatibility and deletion dependency | classification meaning | None for this behavior | historical classification | Presentation and prior-value retention remain open. | [PRD-16]; [PRD-19]; [PRD-28] |
| Dedicated Fund candidate | Lifecycle Constraint Provider; Cross-Boundary Participant | identity, lifecycle, Fund Balance, per-Account breakdown | Fund reconciliation and concept-specific lifecycle | Fund balance/breakdown meaning | None for this behavior | backing Accounts and fund events | Presentation and prior-value retention remain open. | [PRD-16]; [PRD-19]; [PRD-28] |
| Debt Record candidate | Effective-Date Constraint Provider; Local-Invariant Evaluator | effective date, opening/current principal, lifecycle | non-negative Outstanding Principal | debt state | None for this behavior | opening source and repayments | Presentation and prior-value retention remain open. | [PRD-16]; [PRD-19]; [PRD-28] |
| Reporting candidate | Derived-Meaning Consumer; Traceability Participant | period policy, membership, totals, Incomplete Period | cross-view agreement and deterministic membership | derived reporting meaning | None for this behavior | exact range and supporting records | Presentation and prior-value retention remain open. | [PRD-16]; [PRD-19]; [PRD-28] |

#### Outcome Summary

- **Accepted complete outcome:** Return one complete event-effect explanation; change no state.
- **Blocked outcome:** The proposal is not accepted and previously confirmed state remains unchanged.
- **No-partial-effect rule:** Every participating boundary contributes to one complete product-domain result; no partial effect is accepted.
- **Earliest recalculation point:** None.
- **Later state reevaluated:** Explanation changes when correction/lifecycle state changes.
- **Unresolved behavior detail:** Presentation and prior-value retention remain open.
- **Explicit non-decisions:** No API, command, event, service, repository, transaction, persistence, coordination mechanism, framework, or Architecture structure is selected.

## 25. Cross-Boundary Participation Matrix

| Behavior ID | Workspace | Financial Event | Account | Category | Dedicated Fund | Debt Record | Reporting/Derived Meaning | Scope Provider | Fact Providers | Local-Invariant Evaluators | Affected-State Participants | Recalculation Participants | Traceability Participants | All-or-Nothing Scope | Open Responsibility | Source |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| WB-01 | scope/configuration | — | — | — | — | — | — | Workspace candidate | Workspace | Workspace | Workspace | None for this behavior | Workspace | Complete accepted meaning across all listed participants; no partial effect | Invitation mechanics and identity fields remain open. | [PRD-6]; [PRD-20]; [PI-3] |
| AC-01 | scope/configuration | — | date/balances/allocations | — | — | — | — | Workspace candidate | Workspace; Account | Workspace; Account | Workspace; Account | None for this behavior | Workspace; Account | Complete accepted meaning across all listed participants; no partial effect | Account-name uniqueness remains open. | [PRD-9]; [PRD-12]; [UL-Account] |
| IN-01 | scope/configuration | identity/form/date/effect | date/balances/allocations | kind/lifecycle | — | — | membership/totals/explanation | Workspace candidate | Workspace; Financial Event; Account; Category; Reporting | Workspace; Financial Event; Account; Category | Workspace; Financial Event; Account; Category; Reporting | Workspace; Financial Event; Account; Reporting | Workspace; Financial Event; Account; Category; Reporting | Complete accepted meaning across all listed participants; no partial effect | Exact deterministic same-date mechanism remains open. | [PRD-11]; [PRD-12]; [PRD-16] |
| EX-01 | scope/configuration | identity/form/date/effect | date/balances/allocations | kind/lifecycle | — | — | membership/totals/explanation | Workspace candidate | Workspace; Financial Event; Account; Category; Reporting | Workspace; Financial Event; Account; Category | Workspace; Financial Event; Account; Category; Reporting | Workspace; Financial Event; Account; Reporting | Workspace; Financial Event; Account; Category; Reporting | Complete accepted meaning across all listed participants; no partial effect | Expense-form correction classification remains open. | [PRD-11]; [PRD-12]; [PRD-16] |
| TR-01 | scope/configuration | identity/form/date/effect | date/balances/allocations | — | — | — | membership/totals/explanation | Workspace candidate | Workspace; Financial Event; Account; Reporting | Workspace; Financial Event; Account | Workspace; Financial Event; Account; Reporting | Workspace; Financial Event; Account; Reporting | Workspace; Financial Event; Account; Reporting | Complete accepted meaning across all listed participants; no partial effect | Source/destination equality and same-date mechanism remain open. | [PRD-11]; [PRD-12]; [PRD-16] |
| FA-01 | scope/configuration | identity/form/date/effect | date/balances/allocations | — | identity/balance/breakdown | — | membership/totals/explanation | Workspace candidate | Workspace; Financial Event; Account; Dedicated Fund; Reporting | Workspace; Financial Event; Account; Dedicated Fund | Workspace; Financial Event; Account; Dedicated Fund; Reporting | Workspace; Financial Event; Account; Dedicated Fund; Reporting | Workspace; Financial Event; Account; Dedicated Fund; Reporting | Complete accepted meaning across all listed participants; no partial effect | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| FR-01 | scope/configuration | identity/form/date/effect | date/balances/allocations | — | identity/balance/breakdown | — | membership/totals/explanation | Workspace candidate | Workspace; Financial Event; Account; Dedicated Fund; Reporting | Workspace; Financial Event; Account; Dedicated Fund | Workspace; Financial Event; Account; Dedicated Fund; Reporting | Workspace; Financial Event; Account; Dedicated Fund; Reporting | Workspace; Financial Event; Account; Dedicated Fund; Reporting | Complete accepted meaning across all listed participants; no partial effect | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| FX-01 | scope/configuration | identity/form/date/effect | date/balances/allocations | kind/lifecycle | identity/balance/breakdown | — | membership/totals/explanation | Workspace candidate | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting | Workspace; Financial Event; Account; Category; Dedicated Fund | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting | Workspace; Financial Event; Account; Dedicated Fund; Reporting | Workspace; Financial Event; Account; Category; Dedicated Fund; Reporting | Complete accepted meaning across all listed participants; no partial effect | Final allocation responsibility remains open. | [PRD-11]; [PRD-14]; [PRD-16] |
| DR-01 | scope/configuration | identity/form/date/effect | date/balances/allocations | — | — | date/principal | membership/totals/explanation | Workspace candidate | Workspace; Financial Event; Account; Debt Record; Reporting | Workspace; Financial Event; Account; Debt Record | Workspace; Financial Event; Account; Debt Record; Reporting | Workspace; Financial Event; Account; Debt Record; Reporting | Workspace; Financial Event; Account; Debt Record; Reporting | Complete accepted meaning across all listed participants; no partial effect | Same-date mechanism, creditor structure, and status representation remain open. | [PRD-11]; [PRD-15]; [PRD-16] |
| CR-01 | scope/configuration | identity/form/date/effect | date/balances/allocations | kind/lifecycle | identity/balance/breakdown | date/principal | membership/totals/explanation | Workspace candidate | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Account; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Complete accepted meaning across all listed participants; no partial effect | Editable fields and Expense Fund-reference classification remain open. | [PRD-16]; [PRD-28] |
| CR-02 | scope/configuration | identity/form/date/effect | date/balances/allocations | kind/lifecycle | identity/balance/breakdown | date/principal | membership/totals/explanation | Workspace candidate | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Account; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Complete accepted meaning across all listed participants; no partial effect | Ordinary-history visibility and correction reason remain open. | [PRD-16]; [PRD-28] |
| LC-01 | scope/configuration | identity/form/date/effect | date/balances/allocations | kind/lifecycle | identity/balance/breakdown | date/principal | membership/totals/explanation | Workspace candidate | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Account; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Complete accepted meaning across all listed participants; no partial effect | Trash retention remains open. | [PRD-16] |
| LC-02 | scope/configuration | identity/form/date/effect | date/balances/allocations | kind/lifecycle | identity/balance/breakdown | date/principal | membership/totals/explanation | Workspace candidate | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Account; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Complete accepted meaning across all listed participants; no partial effect | Archived-reference restoration eligibility remains open. | [PRD-16]; [PRD-28] |
| AC-06 | — | identity/form/date/effect | date/balances/allocations | — | identity/balance/breakdown | date/principal | membership/totals/explanation | owner-scoped participating facts | Account; Financial Event; Dedicated Fund; Debt Record; Reporting | Account; Financial Event; Dedicated Fund; Debt Record | Account; Financial Event; Dedicated Fund; Debt Record; Reporting | Account; Financial Event; Dedicated Fund; Debt Record; Reporting | Account; Financial Event; Dedicated Fund; Debt Record; Reporting | Complete accepted meaning across all listed participants; no partial effect | Impact Preview threshold and correction-reason requirement remain open. | [PRD-12]; [PRD-16] |
| AC-07 | — | identity/form/date/effect | date/balances/allocations | — | identity/balance/breakdown | date/principal | membership/totals/explanation | owner-scoped participating facts | Account; Financial Event; Dedicated Fund; Debt Record; Reporting | Account; Financial Event; Dedicated Fund; Debt Record | Account; Financial Event; Dedicated Fund; Debt Record; Reporting | Account; Financial Event; Dedicated Fund; Debt Record; Reporting | Account; Financial Event; Dedicated Fund; Debt Record; Reporting | Complete accepted meaning across all listed participants; no partial effect | Cross-boundary coordination and preview threshold remain open. | [PRD-12]; [PRD-16]; [PRD-28] |
| DB-02 | — | identity/form/date/effect | date/balances/allocations | — | — | date/principal | membership/totals/explanation | owner-scoped participating facts | Debt Record; Financial Event; Account; Reporting | Debt Record; Financial Event; Account | Debt Record; Financial Event; Account; Reporting | Debt Record; Financial Event; Account; Reporting | Debt Record; Financial Event; Account; Reporting | Complete accepted meaning across all listed participants; no partial effect | Preview threshold and correction-reason requirement remain open. | [PRD-15]; [PRD-16] |
| DB-03 | — | identity/form/date/effect | date/balances/allocations | — | — | date/principal | membership/totals/explanation | owner-scoped participating facts | Debt Record; Financial Event; Account; Reporting | Debt Record; Financial Event; Account | Debt Record; Financial Event; Account; Reporting | Debt Record; Financial Event; Account; Reporting | Debt Record; Financial Event; Account; Reporting | Complete accepted meaning across all listed participants; no partial effect | Coordination and preview threshold remain open. | [PRD-15]; [PRD-16]; [PRD-28] |
| RP-03 | scope/configuration | identity/form/date/effect | unchanged balances/allocations | — | unchanged balance/breakdown | unchanged principal | membership/totals/explanation | Workspace candidate | Workspace; Financial Event; Account; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Account; Dedicated Fund; Debt Record | Workspace; Financial Event; Account; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Reporting | Workspace; Financial Event; Account; Dedicated Fund; Debt Record; Reporting | Complete accepted meaning across all listed participants; no partial effect | Application timing, preview threshold, and final modeling form remain open. | [PRD-17]; [PRD-28] |
| RC-01 | scope/configuration | identity/form/date/effect | date/balances/allocations | kind/lifecycle | identity/balance/breakdown | date/principal | membership/totals/explanation | Workspace candidate | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Account; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Complete accepted meaning across all listed participants; no partial effect | Same-date mechanism and final coordination responsibility remain open. | [PRD-9]; [PRD-16]; [PRD-19] |
| TC-01 | — | identity/form/date/effect | date/balances/allocations | — | identity/balance/breakdown | — | membership/totals/explanation | owner-scoped participating facts | Financial Event; Account; Dedicated Fund; Reporting | Financial Event; Account; Dedicated Fund | Financial Event; Account; Dedicated Fund; Reporting | None for this behavior | Financial Event; Account; Dedicated Fund; Reporting | Complete accepted meaning across all listed participants; no partial effect | Exact presentation remains undecided. | [PRD-19] |
| TC-02 | — | identity/form/date/effect | date/balances/allocations | — | identity/balance/breakdown | — | membership/totals/explanation | owner-scoped participating facts | Financial Event; Account; Dedicated Fund; Reporting | Financial Event; Account; Dedicated Fund | Financial Event; Account; Dedicated Fund; Reporting | None for this behavior | Financial Event; Account; Dedicated Fund; Reporting | Complete accepted meaning across all listed participants; no partial effect | Exact presentation remains undecided. | [PRD-14]; [PRD-19] |
| TC-03 | — | identity/form/date/effect | date/balances/allocations | — | — | date/principal | membership/totals/explanation | owner-scoped participating facts | Financial Event; Account; Debt Record; Reporting | Financial Event; Account; Debt Record | Financial Event; Account; Debt Record; Reporting | None for this behavior | Financial Event; Account; Debt Record; Reporting | Complete accepted meaning across all listed participants; no partial effect | Exact presentation remains undecided. | [PRD-15]; [PRD-19] |
| TC-04 | scope/configuration | identity/form/date/effect | date/balances/allocations | kind/lifecycle | identity/balance/breakdown | date/principal | membership/totals/explanation | Workspace candidate | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | None for this behavior | Workspace; Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Complete accepted meaning across all listed participants; no partial effect | Archived-Account inclusion and comparison metrics remain open. | [PRD-17]; [PRD-19]; [PRD-28] |
| TC-05 | — | identity/form/date/effect | date/balances/allocations | kind/lifecycle | identity/balance/breakdown | date/principal | membership/totals/explanation | owner-scoped participating facts | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Financial Event; Account; Category; Dedicated Fund; Debt Record | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | None for this behavior | Financial Event; Account; Category; Dedicated Fund; Debt Record; Reporting | Complete accepted meaning across all listed participants; no partial effect | Presentation and prior-value retention remain open. | [PRD-16]; [PRD-19]; [PRD-28] |

Participation descriptions identify product-domain facts and meaning only. They do not assign repository, transaction, service, or coordination ownership.

## 26. Rejection and Blocking Matrix

| Blocking ID | Domain Condition | Behavior IDs | Candidate Fact Providers | Invariant Protected | Blocked Outcome | Confirmed or Open | Candidate Evaluation Step | User-Facing Priority Decided? | Source | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|
| BL-01 | Wrong Workspace owner or cross-owner reference | All behaviors | Workspace | Workspace isolation | Blocked; previously confirmed state unchanged. | Confirmed | 1 | No | [PRD-6]; [PRD-20] | Invitation/auth mechanism not decided |
| BL-02 | Missing required reference | All reference-bearing behaviors | Financial Event; referenced candidate | Reference integrity | Blocked; previously confirmed state unchanged. | Confirmed | 2 | No | [PRD-11–16] | Priority remains open |
| BL-03 | Archived/deleted/ineligible reference | Recording, correction, restoration | Reference lifecycle candidate | Lifecycle eligibility | Blocked; previously confirmed state unchanged. | Confirmed with open detail | 3 | No | [PRD-12–16] | Archived restore eligibility open |
| BL-04 | Invalid behavior shape or required-reference cardinality | Financial Event behaviors | Financial Event | Event-form integrity | Blocked; previously confirmed state unchanged. | Confirmed | 4 | No | [PRD-11] | Expense form transition open |
| BL-05 | Wrong Category kind | IN-01; EX-01; FX-01; corrections | Category; Financial Event | Category compatibility | Blocked; previously confirmed state unchanged. | Confirmed | 5 | No | [PRD-13] | None |
| BL-06 | Event Date before referenced Account effective date | Account-referencing events/corrections/restores | Financial Event; Account | Cross-boundary date validity | Blocked; previously confirmed state unchanged. | Confirmed | 6 | No | [PRD-12]; [PRD-16] | Same-date order mechanism open |
| BL-07 | Debt Repayment Event Date before Debt effective date | DR behaviors; DB-03 | Financial Event; Debt Record | Cross-boundary debt date validity | Blocked; previously confirmed state unchanged. | Confirmed | 6 | No | [PRD-15]; [PRD-16] | None |
| BL-08 | Non-positive amount | Amount-bearing behaviors | Financial Event or opening-state candidate | Positive monetary fact | Blocked; previously confirmed state unchanged. | Confirmed | 4/7 | No | [PRD-9]; [PRD-11–15] | None |
| BL-09 | Fractional Rupiah amount | All monetary behaviors | Behavior-fact provider | Whole-Rupiah policy | Blocked; previously confirmed state unchanged. | Confirmed | 4/7 | No | [PRD-9] | None |
| BL-10 | Insufficient Total Account Balance | EX; TR; FX; DR and corrections/restores | Account | Total Account Balance ≥ Rp0 | Blocked; previously confirmed state unchanged. | Confirmed | 7 | No | [PRD-11–12]; [PRD-14–16] | Competing shortfall priority open |
| BL-11 | Insufficient Unallocated Amount | EX; TR; FA; DR and corrections/restores | Account | Unallocated Amount ≥ Rp0 | Blocked; previously confirmed state unchanged. | Confirmed | 7 | No | [PRD-9]; [PRD-11–12] | Competing shortfall priority open |
| BL-12 | Insufficient matching Account-backed Fund Allocation | FR; FX and corrections/restores | Account; Dedicated Fund | Matching allocation ≥ Rp0 | Blocked; previously confirmed state unchanged. | Confirmed | 7 | No | [PRD-11]; [PRD-14] | Allocation responsibility open |
| BL-13 | Insufficient Outstanding Principal | DR and corrections/restores | Debt Record | Outstanding Principal ≥ Rp0 | Blocked; previously confirmed state unchanged. | Confirmed | 7 | No | [PRD-15] | Future credit/refund outside v1 |
| BL-14 | Account archival while Total is non-zero | AC-03; LC-04 | Account | Archive eligibility | Blocked; Account remains active. | Confirmed | 8 | No | [PRD-12] | Archived historical totals open |
| BL-15 | Permanent deletion target has history/dependency | AC-05; CT-05; DF-06; DB-04 | Target and referring candidates | Historical reference integrity | Blocked; previously confirmed state unchanged. | Confirmed with Debt open detail | 2/8 | No | [PRD-12–15] | Complete Debt eligibility open |
| BL-16 | Restoration invalid under current state | LC-02; TR-03; DR-03 | All current referenced candidates | Current and later invariants | Blocked; record remains in Trash. | Confirmed | 3–10 | No | [PRD-16] | Archived-reference eligibility open |
| BL-17 | Correction invalidates later state | All correction behaviors | Old/new affected candidates | Every-point historical validity | Blocked; prior corrected source remains unchanged. | Confirmed | 10 | No | [PRD-16] | Rejection precedence open |
| BL-18 | Same-date evaluation is not deterministic | All chronological behaviors; RC-01 | Affected candidates | Reproducible chronology | Blocked from final acceptance; prior state unchanged. | Confirmed rule/open mechanism | 10 | No | [PRD-16] | Exact mechanism open |
| BL-19 | Reporting membership is ambiguous | RP-01–03; TC-04 | Workspace; Financial Event; Reporting | One membership and exact range | Blocked; prior reporting configuration remains. | Confirmed | 9–11 | No | [PRD-17] | Application timing/model form open |
| BL-20 | Traceability or dashboard/detail disagreement | All accepted financial/reporting behaviors | All participants; Reporting | Cross-view consistency | Blocked from trusted acceptance; prior state unchanged. | Confirmed | 11 | No | [PRD-19] | User-facing priority open |

Every confirmed blocked outcome preserves previously confirmed state. The matrix order is not user-facing rejection priority.

## 27. Decision Conflict and Ambiguity Register

Open questions in this register have three distinct effects. **Acceptance-Blocking Open Decisions** apply where no confirmed accepted behavior exists: Dedicated Fund Rename (DF-02), Dedicated Fund Restore (DF-05), complete Debt Record deletion (DB-04), and permanent deletion from Trash (LC-03). **Conditional Open Branches** apply only when a proposal reaches the named duplicate-name, same-Account Transfer, same-date ordering, Fund-reference transition, non-zero Fund archival, archived-reference restoration, reporting-application, or archived-Account inclusion condition. **Non-Blocking Deferred Details** remain recorded for later product/domain work but do not stop an otherwise confirmed behavior; these include presentation, metadata/retention, status/creditor representation, preview/reason detail, candidate-root participation, allocation responsibility, and coordination responsibility. One ambiguity may have different effects by behavior—for example, Dedicated Fund restoration blocks DF-05 but is only a conditional branch within LC-05's otherwise confirmed Account and Category restoration behavior.

| Ambiguity ID | Question | Affected Behavior IDs | Affected Decision Tables | Confirmed Facts Around It | Decision That Must Not Be Assumed | Consequence of Leaving Open | Required Future Authority | Source |
|---|---|---|---|---|---|---|---|---|
| AM-01 | Account-name uniqueness | AC-01; AC-02 | DT-AC-01; shared AC-02 | Name required; onboarding rename supported | Do not assume uniqueness or later rename | Conditional naming branch remains | Product/domain decision | [PRD-12]; [PRD-28] |
| AM-02 | Category-name uniqueness within kind | CT-01; CT-02 | Shared CT tables | Kind immutable; names user-extensible | Do not assume uniqueness | Duplicate handling remains open | Product decision | [PRD-13]; [PRD-28] |
| AM-03 | Dedicated Fund-name uniqueness | DF-01; DF-02 | Shared DF records | Fund identity is not its name | Do not assume uniqueness | Rename/create checks remain conditional | Product decision | [PRD-14]; [PRD-28] |
| AM-04 | Transfer source equals destination | TR-01; TR-02 | DT-TR-01; DT-TR-02 | Both references required and owner-scoped | Do not accept or reject equality automatically | One decision branch stays open | Domain decision | [DCM: Transfer]; [DBC §27] |
| AM-05 | Add/remove Fund reference on Expense | FX-02; CR-01; CR-02 | DT-FX-02; DT-CR-01; DT-CR-02 | Both forms remain Expense | Do not assume Same-Type or Replacement | Correction classification stays open | Domain/product decision | [PRD-16]; [PRD-28] |
| AM-06 | Dedicated Fund rename | DF-02 | Still-open record | Identity/history must persist | Do not confirm rename | Behavior unavailable until decided | Product decision | [PRD-14]; [PRD-28] |
| AM-07 | Dedicated Fund restoration | DF-05; LC-05 | DT-LC-05; still-open record | History/allocations must persist | Do not infer lifecycle symmetry | Restore branch remains open | Product decision | [PRD-14]; [PRD-28] |
| AM-08 | Non-zero Fund archival | DF-04; LC-04 | DT-DF-04; DT-LC-04 | No silent release/zeroing | Do not assume block or confirmation | Non-zero branch remains open | Product decision | [PRD-14]; [PRD-28] |
| AM-09 | Target change/removal after history | DF-03 | Shared DF table | Target is optional and not a cap | Do not confirm later change/removal | Goal maintenance remains partial | Product decision | [PRD-14]; [PRD-28] |
| AM-10 | Goal completion representation | DF-01; DF-03 | Shared DF tables | Goal shares Fund identity | Do not make explicit state automatically | Derived/explicit meaning open | Product decision | [PRD-14]; [PRD-28] |
| AM-11 | Complete Debt Record deletion eligibility | DB-04 | DT-DB-04 | Repayment reference blocks | Do not infer all remaining eligibility | No accepted delete outcome finalized | Product/domain decision | [PRD-15]; [PRD-28] |
| AM-12 | Debt status representation | DB-01; DR-01 | Shared DB-01; DT-DR-01 | Principal is confirmed derived value | Do not create explicit Active/Paid Off state | Status meaning stays open | Product decision | [PRD-15]; [PRD-28] |
| AM-13 | Creditor structure | DB-01; DR-01 | Shared DB-01; DT-DR-01 | Debt requires identity/name | Do not add separate creditor field | Required facts remain minimal | Product decision | [PRD-15]; [PRD-28] |
| AM-14 | Archived-reference restoration eligibility | LC-02; LC-05 | DT-LC-02; DT-LC-05 | Restore evaluates current state | Do not universally allow/deny archived refs | Some restore branches remain open | Domain/product decision | [PRD-16]; [PRD-28] |
| AM-15 | Replaced-event ordinary-history visibility | CR-02 | DT-CR-02 | Original retained and linked | Do not decide ordinary-history placement | Presentation meaning remains open | Product/UX decision | [PRD-16]; [PRD-28] |
| AM-16 | Trash permanent deletion and retention | LC-03 | DT-LC-03 | Soft delete/restore confirmed | Do not set retention or manual delete | Permanent deletion has no accepted branch | Product decision | [PRD-16]; [PRD-28] |
| AM-17 | Reporting change application timing | RP-03 | DT-RP-03 | Regrouping only is confirmed | Do not choose immediate/next-session | Activation branch remains open | Product decision | [PRD-17]; [PRD-28] |
| AM-18 | Reporting Period modeling form | WB-02; RP-01–03 | DT-WB-02; DT-RP-03 | One active configuration confirmed | Do not finalize independent/Workspace-contained form | Boundary role remains provisional | Domain decision | [DOC: Reporting Period]; [AGG: Reporting configuration] |
| AM-19 | Deterministic same-date ordering | All chronological behaviors | All recalculation tables | Determinism confirmed | Do not choose mechanism | Acceptance requires a future stable rule | Domain specification | [PRD-16] |
| AM-20 | Impact Preview threshold | AC-06–07; corrections; RP-03 | Correction/opening/report tables | Preview required in confirmed cases | Do not generalize exact threshold | Conditional preview branches remain | Product decision | [PRD-16]; [PRD-28] |
| AM-21 | Correction reason requirement | Corrections/replacement | DT-CR-01–03 | Reason may be useful but unconfirmed | Do not require/omit categorically | Traceability field remains open | Product decision | [PRD-16]; [PRD-28] |
| AM-22 | Account-versus-Fund allocation responsibility | FA; FR; FX | Fund decision tables | Provenance/equation/reconciliation confirmed | Do not assign final owner | Participation remains shared/provisional | Domain decision | [PRD-14]; [AGG §15] |
| AM-23 | Candidate-root participation | All cross-boundary behaviors | §25 matrix | Participants are identified | Do not finalize roots | Decision tables remain candidate analysis | Final domain approval | [AGG §22]; [DBC §27] |
| AM-24 | Cross-boundary coordination responsibility | TR; FA; FR; FX; DR; corrections | Cross-boundary tables | All-or-nothing meaning confirmed | Do not name coordinator | Architecture cannot silently decide domain responsibility | Final domain approval | [AGG §16]; [DBC §27] |
| AM-25 | Archived Account inclusion in historical totals | AC-03; TC-04 | DT-AC-03; DT-TC-04 | History preserved | Do not include/exclude silently | Historical total branch remains open | Product decision | [PRD-12]; [PRD-28] |
| AM-26 | User-controlled Account exclusion from totals | TC-01; TC-04 | DT-TC-01; DT-TC-04 | Workspace total must be traceable | Do not add exclusion control | Inclusion set remains fixed to confirmed rules | Product decision | [PRD-12]; [PRD-28] |

## 28. Stress-Test Decision Walkthroughs

### WT-01 — Income on Account effective date

- **Initial Confirmed State:** Account Rp0 effective D; Income Category active
- **Proposed Behavior:** IN-01 Rp100 on D
- **Ordered Decision Steps:** 1,2–5,6 equality pass,7–11 pass
- **Candidate Fact Providers:** Workspace; Financial Event; Account; Category
- **Candidate Invariant Evaluators:** Account local balance evaluator; cross-boundary date participants
- **First Blocking Condition:** None
- **Accepted or Blocked Result:** Accept both Account increases
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** From D for later Account history
- **Traceability Result:** Income source and both increases shown
- **Protected Open Decision:** Conditional only if another affected event shares D and ordering can change the result; not reached here.
- **Source References:** [PRD-11]; [PRD-12]

### WT-02 — Income before Account effective date

- **Initial Confirmed State:** Account effective D
- **Proposed Behavior:** IN-01 on D-1
- **Ordered Decision Steps:** Steps 1–5 pass; step 6 fails
- **Candidate Fact Providers:** Workspace; Financial Event; Account; Category
- **Candidate Invariant Evaluators:** Financial Event plus Account
- **First Blocking Condition:** Event Date validity
- **Accepted or Blocked Result:** Blocked; Account unchanged
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** None
- **Traceability Result:** Invalid date pair explained
- **Protected Open Decision:** None
- **Source References:** [PRD-12]

### WT-03 — Ordinary Expense within unallocated

- **Initial Confirmed State:** Account Total/Unallocated Rp100
- **Proposed Behavior:** EX-01 Rp60
- **Ordered Decision Steps:** Steps 1–11 pass
- **Candidate Fact Providers:** Workspace; Financial Event; Account; Category
- **Candidate Invariant Evaluators:** Account
- **First Blocking Condition:** None
- **Accepted or Blocked Result:** Accept both decreases to Rp40
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** From Event Date
- **Traceability Result:** Both decreases and no allocation change shown
- **Protected Open Decision:** Conditional only if another affected event shares the Event Date and ordering can change the result; not reached here.
- **Source References:** [PRD-11]

### WT-04 — Ordinary Expense exceeds Unallocated

- **Initial Confirmed State:** Total100, Unallocated40, allocations60
- **Proposed Behavior:** EX-01 Rp50
- **Ordered Decision Steps:** Step 7 fails
- **Candidate Fact Providers:** Workspace; Financial Event; Account; Category
- **Candidate Invariant Evaluators:** Account
- **First Blocking Condition:** Insufficient Unallocated
- **Accepted or Blocked Result:** Blocked; no event/effect
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** None
- **Traceability Result:** Shortfall and unchanged state shown
- **Protected Open Decision:** Non-blocking deferred rejection priority.
- **Source References:** [PRD-11]; [PRD-12]

### WT-05 — Transfer with sufficient source

- **Initial Confirmed State:** A100, B20, valid dates
- **Proposed Behavior:** TR-01 Rp30 A to B
- **Ordered Decision Steps:** Steps 1–11 pass
- **Candidate Fact Providers:** Workspace; Financial Event; two Accounts
- **Candidate Invariant Evaluators:** Both Accounts; cross-boundary Transfer participants
- **First Blocking Condition:** None
- **Accepted or Blocked Result:** Accept A70/B50; Workspace total unchanged
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** From Event Date on both
- **Traceability Result:** Both sides shown together
- **Protected Open Decision:** Conditional only if another affected event shares the Event Date and ordering can change the result; not reached here.
- **Source References:** [PRD-11]

### WT-06 — Transfer exceeds source

- **Initial Confirmed State:** A Unallocated20, B10
- **Proposed Behavior:** TR-01 Rp30
- **Ordered Decision Steps:** Step 7 fails
- **Candidate Fact Providers:** Workspace; Financial Event; two Accounts
- **Candidate Invariant Evaluators:** Source Account
- **First Blocking Condition:** Insufficient source state
- **Accepted or Blocked Result:** Blocked; neither Account changes
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** None
- **Traceability Result:** No destination partial effect
- **Protected Open Decision:** Non-blocking deferred rejection priority.
- **Source References:** [PRD-11]; [PRD-12]

### WT-07 — Transfer source equals destination

- **Initial Confirmed State:** One Account referenced both ways
- **Proposed Behavior:** TR-01 proposed
- **Ordered Decision Steps:** Steps 1–6 reach protected branch
- **Candidate Fact Providers:** Workspace; Financial Event; Account
- **Candidate Invariant Evaluators:** Account and Transfer participants
- **First Blocking Condition:** Protected open decision
- **Accepted or Blocked Result:** No accepted/rejected equality outcome assumed
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** None
- **Traceability Result:** Open branch recorded
- **Protected Open Decision:** Conditional Same-Account branch reached by this proposal.
- **Source References:** [DCM: Transfer]; [DBC §27]

### WT-08 — Fund Allocation within Unallocated

- **Initial Confirmed State:** Account Total/Unallocated100; Fund0
- **Proposed Behavior:** FA-01 Rp60
- **Ordered Decision Steps:** Steps 1–11 pass
- **Candidate Fact Providers:** Workspace; Financial Event; Account; Dedicated Fund
- **Candidate Invariant Evaluators:** Account local; Account/Fund cross-boundary
- **First Blocking Condition:** None
- **Accepted or Blocked Result:** Accept Unallocated40, allocation/Fund60, Total100
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** From Event Date
- **Traceability Result:** Provenance and unchanged Total shown
- **Protected Open Decision:** Non-blocking deferred allocation responsibility.
- **Source References:** [PRD-14]

### WT-09 — Release selected allocation insufficient but Fund total sufficient

- **Initial Confirmed State:** Fund A20/B100
- **Proposed Behavior:** FR-01 Rp30 from A
- **Ordered Decision Steps:** Step 7 fails on selected pairing
- **Candidate Fact Providers:** Workspace; Financial Event; Accounts; Dedicated Fund
- **Candidate Invariant Evaluators:** Selected Account allocation evaluator
- **First Blocking Condition:** Insufficient matching allocation
- **Accepted or Blocked Result:** Blocked; A/B/Fund unchanged
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** None
- **Traceability Result:** Selected shortfall shown
- **Protected Open Decision:** Non-blocking deferred allocation responsibility.
- **Source References:** [PRD-14]

### WT-10 — Fund-Linked Expense matching allocation

- **Initial Confirmed State:** A Total100, Unallocated40, Fund allocation60
- **Proposed Behavior:** FX-01 Rp30
- **Ordered Decision Steps:** Steps 1–11 pass
- **Candidate Fact Providers:** Workspace; Financial Event; Account; Category; Dedicated Fund
- **Candidate Invariant Evaluators:** Account local; Account/Fund cross-boundary
- **First Blocking Condition:** None
- **Accepted or Blocked Result:** Accept Total70, Unallocated40, allocation/Fund30
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** From Event Date
- **Traceability Result:** Matching provenance and one Expense shown
- **Protected Open Decision:** Non-blocking deferred allocation responsibility.
- **Source References:** [PRD-11]; [PRD-14]

### WT-11 — Fund-Linked Expense attempts another Account allocation

- **Initial Confirmed State:** A matching0, B matching100; A Total100
- **Proposed Behavior:** FX-01 Rp30 paid by A
- **Ordered Decision Steps:** Step 7 fails
- **Candidate Fact Providers:** Workspace; Financial Event; Accounts; Category; Dedicated Fund
- **Candidate Invariant Evaluators:** Payment Account matching allocation evaluator
- **First Blocking Condition:** Insufficient matching A allocation
- **Accepted or Blocked Result:** Blocked; B allocation untouched
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** None
- **Traceability Result:** No cross-Account substitution shown
- **Protected Open Decision:** Non-blocking deferred allocation responsibility.
- **Source References:** [PRD-14]

### WT-12 — Debt Repayment within cash and principal

- **Initial Confirmed State:** Account100; principal80; dates valid
- **Proposed Behavior:** DR-01 Rp30
- **Ordered Decision Steps:** Steps 1–11 pass
- **Candidate Fact Providers:** Workspace; Financial Event; Account; Debt Record
- **Candidate Invariant Evaluators:** Account and Debt local; cross-boundary repayment
- **First Blocking Condition:** None
- **Accepted or Blocked Result:** Accept Account70/principal50
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** From Event Date in both histories
- **Traceability Result:** Cash/principal sides shown
- **Protected Open Decision:** Conditional only if another repayment shares the Event Date and ordering can change cash or principal validity; not reached here.
- **Source References:** [PRD-15]

### WT-13 — Debt Repayment exceeds principal

- **Initial Confirmed State:** Account100; principal20
- **Proposed Behavior:** DR-01 Rp30
- **Ordered Decision Steps:** Step 7 fails
- **Candidate Fact Providers:** Workspace; Financial Event; Account; Debt Record
- **Candidate Invariant Evaluators:** Debt Record
- **First Blocking Condition:** Insufficient principal
- **Accepted or Blocked Result:** Blocked; cash/principal unchanged
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** None
- **Traceability Result:** No partial cash effect
- **Protected Open Decision:** Non-blocking excluded-from-v1 credit/refund behavior.
- **Source References:** [PRD-15]

### WT-14 — Same-Type Edit changes Account reference

- **Initial Confirmed State:** Expense on A proposed on B
- **Proposed Behavior:** CR-01
- **Ordered Decision Steps:** Old reversal/new checks through step 10
- **Candidate Fact Providers:** Workspace; Financial Event; Accounts; Category
- **Candidate Invariant Evaluators:** Old/new Accounts
- **First Blocking Condition:** First invalid B date/sufficiency/later state if any
- **Accepted or Blocked Result:** Accept only if all pass; otherwise preserve original
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** Earliest old/new Event Date
- **Traceability Result:** Before/after Account effects shown
- **Protected Open Decision:** Non-blocking deferred preview threshold.
- **Source References:** [PRD-16]

### WT-15 — Same-Type Edit moves Event Date backward

- **Initial Confirmed State:** Active event D2 proposed D1
- **Proposed Behavior:** CR-01
- **Ordered Decision Steps:** Date gate then full later chronology
- **Candidate Fact Providers:** Workspace; Financial Event; Account
- **Candidate Invariant Evaluators:** Date providers and affected locals
- **First Blocking Condition:** First invalid date or later invariant
- **Accepted or Blocked Result:** Accept only if all pass
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** D1
- **Traceability Result:** Old/new position and first blocker shown
- **Protected Open Decision:** Conditional only if another affected event shares D1 and ordering can change the result.
- **Source References:** [PRD-16]

### WT-16 — Expense correction adds/removes Fund reference

- **Initial Confirmed State:** Existing Expense proposes form transition
- **Proposed Behavior:** FX-02/CR-01
- **Ordered Decision Steps:** Reach protected classification branch before acceptance
- **Candidate Fact Providers:** Workspace; Financial Event; Account; Category; Dedicated Fund
- **Candidate Invariant Evaluators:** Affected participants
- **First Blocking Condition:** Protected open decision
- **Accepted or Blocked Result:** No transition outcome assumed
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** Not finalized
- **Traceability Result:** Old/proposed form recorded
- **Protected Open Decision:** Conditional Same-Type Edit versus Event Replacement branch reached by this proposal.
- **Source References:** [PRD-16]; [PRD-28]

### WT-17 — Event Replacement Expense to Income

- **Initial Confirmed State:** Active Expense; valid Income proposal
- **Proposed Behavior:** CR-02
- **Ordered Decision Steps:** Reverse old, validate new, recalc, trace
- **Candidate Fact Providers:** Workspace; Financial Event; Account; Category
- **Candidate Invariant Evaluators:** Old/new participants
- **First Blocking Condition:** Any old/new/later invariant failure
- **Accepted or Blocked Result:** Accept linked replacement only if all pass
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** Earliest old/new Event Date
- **Traceability Result:** Original, replacement, link, no double count
- **Protected Open Decision:** Non-blocking deferred history visibility and correction-reason detail.
- **Source References:** [PRD-16]

### WT-18 — Restore backdated Transfer after later events

- **Initial Confirmed State:** Trashed Transfer with later A/B events
- **Proposed Behavior:** LC-02
- **Ordered Decision Steps:** Current refs/date/sufficiency and both later histories
- **Candidate Fact Providers:** Workspace; Financial Event; two Accounts
- **Candidate Invariant Evaluators:** Both Accounts
- **First Blocking Condition:** First current/later invalidity
- **Accepted or Blocked Result:** Accept full two-sided reapplication or remain Trash
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** Transfer Event Date
- **Traceability Result:** Trash identity and both sides shown
- **Protected Open Decision:** Conditional only if an actually referenced candidate is archived; otherwise the confirmed restoration rules apply.
- **Source References:** [PRD-16]

### WT-19 — Opening Balance correction invalidates later spending

- **Initial Confirmed State:** Opening100; later Expense80; propose50
- **Proposed Behavior:** AC-06
- **Ordered Decision Steps:** Preview then chronology fails at Expense
- **Candidate Fact Providers:** Workspace; Account; Financial Event
- **Candidate Invariant Evaluators:** Account
- **First Blocking Condition:** Later negative state
- **Accepted or Blocked Result:** Blocked; old opening and event remain
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** Account effective date
- **Traceability Result:** Blocking Expense and unchanged history shown
- **Protected Open Decision:** Non-blocking deferred preview-threshold and correction-reason detail.
- **Source References:** [PRD-12]; [PRD-16]

### WT-20 — Reporting Period valid regrouping

- **Initial Confirmed State:** Events across calendar/custom boundaries
- **Proposed Behavior:** RP-03 to start day25
- **Ordered Decision Steps:** Validate mode/day, old/new membership, reports
- **Candidate Fact Providers:** Workspace; Financial Event; Account; Dedicated Fund; Debt Record; Reporting
- **Candidate Invariant Evaluators:** Workspace policy and reporting consumers
- **First Blocking Condition:** None
- **Accepted or Blocked Result:** Accept membership/totals regroup only
- **No-Partial-Effect Statement:** No participant receives a partial accepted effect; blocked proposals preserve all previously confirmed state.
- **Recalculation Scope:** Earliest changed reporting boundary
- **Traceability Result:** Old/new ranges and unchanged facts shown
- **Protected Open Decision:** Conditional only if the proposal requires an application start or modeling form outside confirmed policy; not reached by this valid regrouping.
- **Source References:** [PRD-17]


## 29. Explicit Non-Decisions

This document does not decide:

- final Aggregate boundaries, final Aggregate Roots, final coordination ownership, repository ownership, persistence transaction boundaries, or database transactions;
- APIs, endpoints, request/response contracts, commands, handlers, domain events, application/domain services, or repositories;
- persistence, tables, schemas, identifiers, ORM mappings, rules-engine implementation, or state-machine implementation;
- messaging, orchestration, sagas, CQRS, event sourcing, replay, projections, caching, or framework modules;
- Architecture, deployment, locking, or any concurrency-control mechanism;
- the exact same-date ordering mechanism or user-facing rejection priority;
- error codes, exception types, transport statuses, retry policy, or error messages;
- Impact Preview UI, correction-reason UI, or persistence of prior values.

Decision-table steps are not technical execution steps. Candidate participants do not imply where data is stored, loaded, locked, or committed.

## 30. Still-Open Decision Questions

All ambiguity rows in §27 remain open, but they do not all block confirmed behavior.

**Acceptance-blocking until resolved:**

- Dedicated Fund Rename (DF-02) and Dedicated Fund Restore (DF-05);
- complete Debt Record deletion eligibility (DB-04);
- Trash permanent deletion availability, retention, eligibility, and traceability treatment (LC-03).

**Conditional only when the proposal reaches the unresolved condition:**

- naming uniqueness where a duplicate name exists;
- Transfer source/destination equality;
- outcome-relevant same-date ordering;
- Expense Fund-reference addition/removal;
- non-zero Dedicated Fund archival;
- archived-reference restoration eligibility;
- Reporting Period application/modeling conditions not covered by confirmed policy;
- archived Account inclusion where the requested total depends on it.

**Non-blocking deferred details:**

- candidate-root participation and final cross-boundary correction responsibility;
- Account-versus-Dedicated-Fund allocation responsibility;
- Impact Preview threshold and correction-reason requirement;
- replacement-history and traceability presentation;
- creditor/status representation and goal-completion representation;
- metadata or persistence-retention detail;
- user-facing rejection precedence.

No item in this section is answered by the candidate evaluation sequence or participation matrix. Non-blocking deferral does not resolve the question; it only records that the question does not prevent a confirmed accepted/blocked outcome.

## 31. Recommended Decision Baseline

### Sufficiently confirmed for later detailed specification

Ownership isolation, required event forms/references, whole-Rupiah positive amounts, cross-boundary effective-date checks, Account equations, non-negative allocation/principal rules, concept-specific deletion eligibility where confirmed, non-destructive correction, every-point chronological validation, reporting-only regrouping, and traceability have deterministic accepted/blocked cores.

### Candidate evaluation sequence

Use §5 as a review scaffold. It is a candidate reasoning order only. Reordering is acceptable if the same facts and invariants are evaluated, blocked proposals preserve prior state, and partial acceptance remains impossible.

### Deterministic versus open behaviors

Confirmed behaviors reach their accepted outcomes whenever all confirmed conditions pass and no proposal-specific conditional open branch is reached. LC-03 and DB-04 have no approved accepted deletion outcome; DF-02 and DF-05 remain Still-Open records without confirmed acceptance. FX-02, DF-04, LC-04, LC-05, RP-03, same-date-sensitive behaviors, and other conditional cases stop only when the proposal reaches their explicitly stated unresolved condition. Presentation, metadata/retention, candidate-root participation, allocation responsibility, coordination responsibility, and similar non-blocking deferred details do not stop confirmed acceptance.

### Participation hotspots

Transfer spans one Financial Event and two Accounts. Fund Allocation, Fund Release, and Fund-Linked Expense span Financial Event, Account, and Dedicated Fund, with Category additionally participating for Expense. Debt Repayment spans Financial Event, Account, and Debt Record. Historical correction/restoration can replace the participant set and reevaluates every affected later point. Reporting changes span Workspace policy, Event Dates, and all reporting consumers without mutating financial state.

### Decisions required before final domain approval

Resolve deterministic same-date ordering; candidate-root participation; allocation responsibility; cross-boundary correction responsibility; rejection precedence where multiple blockers coexist; Expense form-transition classification; and the lifecycle/deletion questions that currently prevent a confirmed outcome.

### Safe for later Architecture translation

Architecture may later choose implementation structures for storage, loading, transactions, concurrency, and integration only after domain responsibilities are sufficiently approved. Those choices must preserve the accepted/blocked logic and traceability here.

### Architecture must not redefine

Architecture must not redefine candidate boundaries, effective-date ownership, all-or-nothing effects, chronological validation, allocation provenance, correction identity, lifecycle eligibility, or open decisions merely for persistence, framework, or deployment convenience. A genuine contradiction must return explicitly to domain review.

### Recommended Session 21 task

The next domain-modeling task should be **Domain Responsibility and Ordering Resolution**: resolve or narrow deterministic same-date ordering, candidate-root participation, Account-versus-Fund allocation responsibility, cross-boundary correction responsibility, and rejection precedence using focused decision records and scenario comparisons. It must remain product-domain analysis and must not begin Architecture or select commands/domain events.

## 32. PRD Traceability

| Major decision-table group | PRD sections | Ubiquitous Language | Domain Concept Model | Domain Object Candidates | Aggregate Candidates | Behavior Catalog |
|---|---|---|---|---|---|---|
| Workspace/onboarding | §§9, 17; ownership §§6, 20 | Workspace; Currency; Timezone | Workspace/configuration relationships | Workspace/configuration candidates | Workspace candidate | §§6–7 |
| Account | §§9, 12, 16, 28 | Account; opening/effective-date/balance terms | Account relationships and lifecycle | Account/balance candidates | Account candidate/local invariants | §7 |
| Income | §§11–13, 16 | Income; Event Date | Income effect | Financial Event form | Event/Account/Category participation | §8 |
| Ordinary Expense | §§11–14, 16 | Expense; Unallocated Amount | Expense effect | Expense form | Event/Account/Category participation | §9 |
| Transfer | §§11–12, 16 | Transfer | Two-Account relationship | Transfer form | Transfer hotspot | §10 |
| Fund Allocation | §§9, 11, 14, 16 | Fund Allocation; Account-backed allocation | Account/Fund relationship | Allocation relationship candidate | Allocation hotspot | §11 |
| Fund Release | §§11, 14, 16 | Fund Release | Selected-pair relationship | Release form | Account/Fund hotspot | §12 |
| Fund-linked Expense | §§11, 14, 16, 28 | Fund-Linked Expense | Matching allocation effect | Expense secondary form | Account/Fund/Category hotspot | §13 |
| Category | §13; §28 | Category kinds | Category lifecycle | Category candidate | Category candidate | §14 |
| Dedicated Fund/goal | §14; §28 | Dedicated Fund; Financial Goal | Fund relationships | Fund/target candidates | Dedicated Fund candidate | §15 |
| Debt Record | §§9, 15–16, 28 | Debt Record; opening principal/date | Debt relationships | Debt candidates | Debt Record candidate | §16 |
| Debt Repayment | §§11, 15–16 | Debt Repayment | Account/Debt effect | Repayment form | Account/Debt hotspot | §17 |
| Correction/replacement | §16; §28 | Correction; Same-Type Edit; Replacement | Correction relationships | Behavior classifications | Correction hotspot | §18 |
| Lifecycle | §§12–16; §28 | Trash; Archive; Restoration | Concept-specific lifecycle | Lifecycle candidates | Lifecycle/dependency stress | §19 |
| Reporting | §17; §28 | Reporting Period; Incomplete Period | Reporting relationships | Configuration candidates | Weak independent candidate | §20 |
| Recalculation | §§9, 16, 19 | Chronological Recalculation | Historical invariant scenarios | Confirmed behavior | Cross-boundary hotspot | §21 |
| Traceability | §19 | Traceability; Supporting Records | Cross-view consistency | Derived/explanation candidates | Traceability participants | §22 |

Every confirmed blocking outcome in this document cites PRD support directly or through its detailed table source set. PROJECT_STATE is navigation only and is never the sole authority.
