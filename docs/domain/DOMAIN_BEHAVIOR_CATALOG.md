# Annotasi Finance Domain Behavior Catalog

## 1. Document Status

- **Status:** Candidate domain-behavior baseline for detailed review.
- **Session:** Session 19 — Domain Behavior Analysis.
- **Domain stage:** Downstream of the approved PRD and Session 18 aggregate-candidate analysis; upstream of final domain approval and Architecture.
- **Scope:** v1 domain behaviors, invariants, rejection conditions, recalculation, lifecycle interaction, traceability, and protected open questions.
- **Authority:** Source documents remain authoritative. This catalog clarifies behavior without silently resolving their open decisions.
- **Change boundary:** This document introduces no implementation or Architecture decision.

## 2. Purpose

This catalog turns the approved product rules and current domain candidates into a reviewable behavior baseline. It makes business intent, evaluated history, accepted effects, invariants, cross-boundary participation, rejection outcomes, recalculation reach, and traceability explicit enough for detailed domain approval.

The catalog does not finalize aggregate roots or coordination mechanisms. “Candidate boundary” means only the current Session 18 hypothesis.

## 3. Source of Truth and Behavior Rules

- **[PI]** `docs/product/PRODUCT_IDENTITY.md`, especially §§3, 5, 7, 13–15.
- **[PRD]** `docs/product/ANNOTASI_FINANCE_MVP_PRD.md`; suffixes identify sections, for example [PRD-11].
- **[UL]** `docs/domain/UBIQUITOUS_LANGUAGE.md`; suffixes identify canonical terms.
- **[DCM]** `docs/domain/DOMAIN_CONCEPT_MODEL.md`; suffixes identify concept/scenario families.
- **[DOC]** `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`.
- **[AGG]** `docs/domain/AGGREGATE_CANDIDATES.md`.
- **[STATE]** `docs/project/PROJECT_STATE.md`.

When sources differ in authority, confirmed Product Identity and PRD rules govern; the domain documents refine terminology and candidate structure without overriding product decisions. Open questions remain open.

The allowed behavior-status vocabulary is: **Confirmed Behavior**, **Confirmed Rule with Open Detail**, **Candidate Behavior**, **Still Open**, and **Excluded from v1**. The last label is used for explicit scope classification; no excluded capability is promoted into an executable v1 behavior here.

## 4. Behavior Modeling Vocabulary

- **Behavior** describes a domain-significant intent and its valid outcome, not an API, screen, command, or method.
- **Local invariant** is evaluable from one candidate boundary’s owned facts.
- **Cross-boundary invariant** needs facts owned by more than one candidate boundary.
- **Effective-date constraint** is provided by Account or Debt Record; the complete date rule is cross-boundary because Event Date belongs to Financial Event.
- **Evaluated state and history** is the minimum chronological evidence needed to accept or reject a behavior.
- **Earliest recalculation point** is the first date/boundary from which derived state may change.
- **Impact Preview** is a domain requirement to expose projected affected records and outcomes before confirmation where required; its UI and coordination mechanism are undecided.
- **Chronological Recalculation** re-evaluates affected state from the earliest point through every later dependency.
- **Accepted effect** is all-or-nothing at the domain level; a multi-concept effect is never accepted partially.
- **Rejection** preserves the previously confirmed state.
- **Traceability** means an important value or effect can be reconciled to its supporting domain records.
- **Soft delete** removes active effect but preserves a recoverable record; permanent deletion has separate eligibility.
- **Same-Type Edit** preserves event identity; **Event Replacement** changes Event Type and uses a distinct linked identity.
- **Candidate boundary** is provisional and must not be treated as an implementation container.
- **Behavior names and IDs** are product-domain documentation language, not Commands, APIs, methods, classes, events, or database identifiers.
- **Primary Actor or Trigger** describes business initiation, not an operation entry point or technical interface.

## 5. Behavior Catalog Summary

| Behavior ID | Domain Behavior | Primary Intent | Behavior Status | Primary Domain Concepts | Affected Candidate Boundaries | Local or Cross-Boundary | Chronological Recalculation Possible | Main Invariants | Main Rejection Conditions | Source References | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|
| WB-01 | Establish Single-Owner Workspace | Give one invited owner a private financial scope. | Confirmed Behavior | Owner identity; Workspace candidate. | Workspace candidate; configuration candidates. | Cross-boundary | No | Exactly one owner and one workspace per v1 user. Workspace isolation applies to every referenced concept and derived view. | Unverified owner, existing workspace, or cross-owner reference. | [PI-3]; [PRD-6]; [PRD-20] | Invitation mechanics, identity fields, and deletion retention remain open. |
| WB-02 | Establish Initial Workspace Configuration | Create the fixed financial and reporting defaults needed before recording. | Confirmed Behavior | Workspace; Currency; Timezone; Reporting Period Configuration. | Workspace/configuration candidates; Reporting configuration candidate. | Cross-boundary | No | One active configuration; currency and timezone are fixed for v1. Later financial events and reporting use the same workspace configuration. | Conflicting configuration, unsupported currency, or unsupported timezone. | [PRD-9]; [PRD-17]; [PRD-28] | Starter-category content and exact onboarding presentation remain open. |
| AC-01 | Establish Account Opening State | Create an asset-like money-holding starting point without fabricating an event. | Confirmed Behavior | Account; Account Name; Account Type; Opening Balance; Opening-Balance Effective Date. | Account candidate; Workspace candidate. | Cross-boundary | No | Opening Balance and all resulting balances stay non-negative; Account Type is descriptive only. Name constraints and workspace totals may involve other Account candidates. | Invalid Account Type, negative/fractional amount, missing effective date, or confirmed name-rule violation. | [PRD-9]; [PRD-12]; [UL-Account]; [AGG-7] | Account-name uniqueness remains open. |
| AC-02 | Rename Account | Let the owner use a meaningful Account name without changing financial history. | Confirmed Rule with Open Detail | Account; Account Name. | Account candidate; possibly Workspace candidate for uniqueness. | Local | No | Rename never changes amounts, dates, references, or event identity. Any workspace-wide uniqueness rule is evaluated if later confirmed. | Missing/invalid name or confirmed duplicate-name violation. | [PRD-12]; [PRD-28]; [UL-Account] | Availability after onboarding and name uniqueness remain open. |
| AC-03 | Archive Account | Remove an unused-for-new-entry Account from active use while preserving history. | Confirmed Behavior | Account; Total Account Balance; Financial Event history. | Account candidate; Financial Event and Workspace candidates as readers. | Local | No | Archival never changes balance or history; only a zero-total Account qualifies. Dependent candidates must retain valid historical references. | Non-zero total or invalid lifecycle state. | [PRD-12]; [PRD-28]; [UL-Archive] | Whether archived Accounts remain in all historical totals is open. |
| AC-04 | Restore Archived Account | Return an archived Account to eligible active use without recreating it. | Confirmed Behavior | Account; archived state. | Account candidate; Financial Event readers. | Cross-boundary | No | Restoration changes no amount, date, or historical reference. Workspace scope and reference validity remain intact. | Not archived, deleted, or outside owner workspace. | [PRD-12]; [UL-Restore] | No protected financial-rule question. |
| AC-05 | Permanently Delete Account | Remove only an Account that has never carried financial meaning. | Confirmed Behavior | Account; Opening Balance; dependency/history evidence. | Account candidate plus every potential referring candidate. | Cross-boundary | No | Deletion cannot erase financial history or a non-zero opening state. All candidate boundaries must report no reference or dependency. | Non-zero opening state, any history/dependency, or invalid lifecycle state. | [PRD-12]; [UL-Delete] | Exact retention of non-financial metadata is outside this behavior. |
| AC-06 | Correct Opening Balance | Correct a mistaken starting amount while preserving chronological truth. | Confirmed Behavior | Account; all later Account-affecting Financial Events and allocations. | Account candidate plus affected Financial Event, Dedicated Fund, Workspace/reporting candidates. | Cross-boundary | Yes | No recalculated Account total or Unallocated Amount may become negative. Later Financial Events, Dedicated Fund allocations, debts, and summaries must remain valid. | Any confirmed date or financial invariant would fail after recalculation. | [PRD-12]; [PRD-16]; [AGG-13] | Exact high-impact confirmation threshold or reason requirement remains open. |
| AC-07 | Correct Opening-Balance Effective Date | Correct when an Account's opening state begins without rewriting history. | Confirmed Behavior | Account; proposed date; all referencing Financial Events. | Account and Financial Event candidates; other affected readers. | Cross-boundary | Yes | Account provides the effective date constraint; it cannot alone evaluate Event Date. Complete rule is cross-boundary because Event Date belongs to Financial Event; each referencing Event Date must be on/after the proposed date. | Blocked if any confirmed date or financial invariant cannot remain valid. | [PRD-12]; [PRD-16]; [PRD-28]; [AGG-13]; [AGG-14] | Exact coordination and confirmation threshold remain open. |
| IN-01 | Record Income | Represent external money entering one Account. | Confirmed Behavior | Financial Event; Amount; Event Date; Account; Income Category. | Financial Event, Account, Category, Workspace/reporting candidates. | Cross-boundary | Yes | Positive whole-Rupiah Amount; Category kind is Income. Account-date validity, workspace scope, reporting, and cross-view consistency. | Invalid amount/date/reference/category or isolation violation. | [PRD-11]; [UL-Income]; [DCM-Income] | Deterministic same-date ordering mechanism remains open. |
| EX-01 | Record Ordinary Expense | Represent spending from unallocated Account money. | Confirmed Behavior | Financial Event; Amount; Event Date; Account; Expense Category. | Financial Event, Account, Category, Workspace/reporting candidates. | Cross-boundary | Yes | Resulting Account total and Unallocated Amount stay non-negative. Date/reference/category validity and cross-view consistency span candidates. | Insufficient Unallocated Amount/total, invalid date, wrong Category kind, or invalid reference. | [PRD-11]; [UL-Expense]; [DCM-Expense] | Transition between ordinary and fund-linked Expense remains protected under FX-02. |
| TR-01 | Record Transfer | Represent money moving between two owner Accounts without income or expense. | Confirmed Behavior | Financial Event; Amount; Event Date; Source Account; Destination Account. | Financial Event and two Account candidates; Workspace/reporting readers. | Cross-boundary | Yes | Source balances stay non-negative; transfer has complete two-sided effect. Both Account effective-date constraints, isolation, and synchronized two-sided consistency. | Insufficient source values, invalid date/reference, or cross-owner Account. | [PRD-11]; [UL-Transfer]; [DCM-Transfer] | Whether source and destination equality needs an explicit rule remains open. |
| TR-02 | Correct Transfer | Correct amount, date, note, or Account references while preserving Transfer identity. | Confirmed Behavior | Existing Transfer; proposed editable fields; both Account histories. | Financial Event and affected Account candidates; Workspace/reporting readers. | Cross-boundary | Yes | Transfer remains positive and complete; affected Account balances stay non-negative. All old/new Account dates and later histories remain valid. | Any invalid proposed reference/date or later negative state. | [PRD-16]; [UL-Correction]; [AGG-13] | Preview threshold and same-date ordering mechanism remain open. |
| TR-03 | Delete or Restore Transfer | Remove or reinstate a mistaken Transfer without losing its record. | Confirmed Behavior | Transfer; Trash state; both Account histories. | Financial Event and two Account candidates; Workspace/reporting readers. | Cross-boundary | Yes | Reversal/reapplication is complete and never one-sided. Restoration must revalidate dates, references, and both Account histories. | Restore is blocked if any current invariant would fail. | [PRD-16]; [UL-Trash]; [DCM-Transfer] | No exact Trash retention or permanent-deletion rule is decided. |
| FA-01 | Allocate Account Money to Dedicated Fund | Set aside part of one Account's unallocated money for one purpose without moving cash. | Confirmed Behavior | Financial Event; Amount; Event Date; Account; Dedicated Fund. | Financial Event, Account, Dedicated Fund, Workspace/reporting candidates. | Cross-boundary | Yes | Account total equals unallocated plus allocations; no component becomes negative. Date/reference validity and synchronized Account/Fund effects span candidates. | Insufficient unallocated, invalid date/reference, or non-positive amount. | [PRD-11]; [PRD-14]; [UL-FundAllocation]; [DCM-Fund] | No allocation-lot or FIFO/LIFO policy is introduced. |
| FA-02 | Correct Fund Allocation | Correct allocation facts while preserving chronological backing. | Confirmed Behavior | Existing Fund Allocation; proposed amount/date/Account/Fund. | Financial Event, affected Account and Dedicated Fund candidates. | Cross-boundary | Yes | All decompositions hold and no allocation/unallocated amount becomes negative. Old/new dates and references plus later Account/Fund events remain valid. | Insufficient proposed backing or any invalid later state. | [PRD-16]; [AGG-13]; [UL-Correction] | Impact-preview threshold and ordering remain open. |
| FR-01 | Release Dedicated Fund Allocation to Unallocated Amount | Return a selected Account's current allocation for one Fund to that Account's spendable amount. | Confirmed Behavior | Financial Event; Amount; Event Date; selected Account; Dedicated Fund. | Financial Event, Account, Dedicated Fund, Workspace/reporting candidates. | Cross-boundary | Yes | Release draws only from selected Account's current matching allocation; values stay non-negative. Account effective date and coherent Account/Fund effects span candidates. | Amount exceeds selected matching allocation, invalid date/reference, or non-positive amount. | [PRD-11]; [PRD-14]; [UL-FundRelease]; [DCM-Fund] | No cross-Account auto-consumption or allocation-lot selection. |
| FR-02 | Correct Fund Release | Correct a Fund Release while preserving selected-Account provenance and Financial Event identity. | Confirmed Behavior | Existing Fund Release; proposed amount, Event Date, Account, and Dedicated Fund references. | Financial Event, affected Account candidates, affected Dedicated Fund candidates, and reporting readers. | Cross-boundary | Yes | Proposed release does not exceed the selected Account's matching allocation; Total Account Balance remains unchanged; values stay non-negative; old/proposed references, dates, and later Account/Fund histories remain valid. | Insufficient matching allocation, invalid date/reference, or any invalid proposed or later Account/Fund state. | [PRD-11]; [PRD-14]; [PRD-16]; [AGG-13]; [UL-Correction] | Impact Preview threshold, deterministic same-date ordering, and final allocation responsibility remain open. |
| FX-01 | Record Fund-Linked Expense | Represent spending paid by one Account from that Account's allocation to one Fund. | Confirmed Behavior | Financial Event; Amount; Event Date; payment Account; Expense Category; Dedicated Fund. | Financial Event, Account, Category, Dedicated Fund, Workspace/reporting candidates. | Cross-boundary | Yes | Matching allocation and Account total stay non-negative; unallocated is unchanged. Account date, Category kind, Account/Fund provenance, and synchronized effects span candidates. | Insufficient matching allocation or total, invalid date/reference/category. | [PRD-11]; [PRD-14]; [UL-FundLinkedExpense]; [DCM-Fund] | No multi-Account draw or automatic use of another Account's allocation. |
| FX-02 | Correct Fund-Linked Expense | Correct a fund-backed Expense without obscuring its provenance or financial effect. | Confirmed Rule with Open Detail | Existing Expense; proposed amount/date/Account/Category/Fund reference. | Financial Event, Account, Category, Dedicated Fund candidates and readers. | Cross-boundary | Yes | All Expense amount and Account/Fund invariants hold. Category kind, Account dates, provenance, and later histories remain valid. | Any insufficient balance/allocation, invalid reference/date, or unresolved classification transition. | [PRD-16]; [PRD-28]; [UL-Expense] | Whether adding/removing a Fund reference is always Same-Type Edit or needs a distinct correction rule remains open. |
| CT-01 | Establish Category | Create an owner-defined descriptive classification of one immutable kind. | Confirmed Behavior | Category; Category Name; Category Kind. | Category candidate; Workspace candidate. | Cross-boundary | No | Category has exactly one kind; kind never changes through rename. Workspace naming and later Financial Event reference validity may span candidates. | Invalid name/kind or confirmed duplicate rule violation. | [PRD-13]; [UL-Category] | Name uniqueness and starter-category final set remain open. |
| CT-02 | Rename Category | Improve a label without reclassifying past events. | Confirmed Behavior | Category; proposed Category Name. | Category candidate; Financial Event readers. | Local | No | Rename never changes Category Kind or financial effects. Any confirmed workspace naming constraint applies. | Invalid name or confirmed duplicate violation. | [PRD-13]; [UL-Category] | Name uniqueness remains open. |
| CT-03 | Archive or Hide Category | Remove a Category from new choices while preserving classifications. | Confirmed Behavior | Category; Financial Event references. | Category candidate; Financial Event/reporting readers. | Local | No | Archival does not alter kind or existing event effects. Historical reports retain valid Category references. | Invalid lifecycle state. | [PRD-13]; [UL-Archive] | Exact user-facing archive/hide terminology is a UX decision. |
| CT-04 | Restore Category | Return an archived Category to new-event eligibility. | Confirmed Behavior | Category; archived state. | Category candidate; Financial Event readers. | Local | No | No financial record or kind changes. Workspace scope remains valid. | Not archived, deleted, or wrong workspace. | [PRD-13]; [UL-Restore] | No protected domain question. |
| CT-05 | Permanently Delete Category | Remove only a Category that has never classified an event. | Confirmed Behavior | Category; reference/dependency evidence. | Category and Financial Event candidates. | Cross-boundary | No | Deletion cannot erase historical classification. All potential Financial Event references must be absent. | Any event reference/dependency or invalid lifecycle state. | [PRD-13]; [UL-Delete] | Retention of non-financial metadata is not decided. |
| DF-01 | Establish Dedicated Fund | Create a named virtual purpose for allocations. | Confirmed Behavior | Dedicated Fund; Fund Name; optional Target Amount. | Dedicated Fund candidate; Workspace candidate. | Cross-boundary | No | Fund Balance begins at zero; target is not a spending cap. Workspace naming and later Account-backed allocations span candidates. | Invalid name/target or confirmed duplicate rule violation. | [PRD-14]; [PRD-28]; [UL-DedicatedFund] | Name uniqueness, target-date shipping, and completed-state representation remain open. |
| DF-02 | Rename Dedicated Fund | Potentially relabel a purpose without changing its financial history. | Still Open | Dedicated Fund; proposed name. | Dedicated Fund candidate; readers. | Local | No | Any future rule must preserve balance, identity, and event references. Potential workspace naming rule would also apply. | No rejection catalog can be finalized until behavior is approved. | [PRD-14]; [PRD-28] | Availability and uniqueness rules remain open. |
| DF-03 | Set or Change Target Amount | Express an optional goal without changing the Fund's actual allocated money. | Confirmed Rule with Open Detail | Dedicated Fund; optional Target Amount; allocation history. | Dedicated Fund candidate; reporting readers. | Local | No | Target never caps allocation or spending and never changes Fund Balance. Workspace reports may read target-derived progress. | Invalid numeric target; later-history cases remain undecided. | [PRD-14]; [PRD-28] | Whether change/removal is allowed after allocation history and whether target date ships remain open. |
| DF-04 | Archive Dedicated Fund | Stop new use of a Fund while preserving its purpose and history. | Confirmed Rule with Open Detail | Dedicated Fund; Fund Balance; referencing events. | Dedicated Fund, Account, Financial Event candidates and readers. | Cross-boundary | Yes | Archival never silently releases, spends, deletes, or zeroes allocations. Account-backed allocations and historical event references must remain coherent. | Invalid lifecycle state; non-zero case cannot be silently resolved. | [PRD-14]; [PRD-28] | Whether non-zero archival is blocked or confirmed remains open. |
| DF-05 | Restore Dedicated Fund | Potentially return an archived Fund to active use. | Still Open | Dedicated Fund; archived state; preserved allocations. | Dedicated Fund, Account, Financial Event candidates. | Cross-boundary | No | Any future rule must preserve allocations and history. Account-backed allocation validity would remain cross-boundary. | Not finalized. | [PRD-14]; [PRD-28] | Availability and eligibility remain open. |
| DF-06 | Permanently Delete Dedicated Fund | Remove only a Fund that has no balance or financial history. | Confirmed Behavior | Dedicated Fund; Fund Balance; event/dependency history. | Dedicated Fund, Account, Financial Event candidates. | Cross-boundary | No | Deletion cannot erase allocation history or non-zero value. All referring Financial Event and Account-backed allocation dependencies are absent. | Non-zero balance, any history/dependency, or invalid lifecycle state. | [PRD-14]; [UL-Delete] | No persistence-retention decision is made. |
| DB-01 | Establish Opening Debt Record | Represent an existing liability starting point without inventing borrowing history. | Confirmed Behavior | Debt Record; Opening Outstanding Principal; Debt Effective Date. | Debt Record candidate; Workspace candidate. | Cross-boundary | No | Opening and current principal remain non-negative. Workspace scope and later repayment date/reference validity span candidates. | Non-positive/fractional principal, missing date, or invalid workspace reference. | [PRD-15]; [UL-DebtRecord]; [AGG-8] | Creditor field and explicit-vs-derived status remain open. |
| DB-02 | Correct Opening Outstanding Principal | Correct a debt starting amount while preserving repayment history. | Confirmed Behavior | Debt Record; all Debt Repayment Financial Events. | Debt Record, Financial Event, Account, Workspace/reporting candidates. | Cross-boundary | Yes | Principal may never become negative at any point. Repayment histories and reports must remain consistent. | Any repayment sequence would exceed principal or other confirmed invariant. | [PRD-15]; [PRD-16]; [AGG-13] | Exact high-impact threshold/reason requirement remains open. |
| DB-03 | Correct Debt Effective Date | Correct when an opening debt state begins without rewriting repayment history. | Confirmed Behavior | Debt Record; proposed date; all referencing Debt Repayment events. | Debt Record and Financial Event candidates; Account and reporting readers. | Cross-boundary | Yes | Debt Record provides its effective-date constraint; it does not own Event Date. Complete rule is cross-boundary because Debt Repayment Event Date belongs to Financial Event and must be on/after proposed Debt Effective Date. | Blocked if any confirmed date, principal, or financial invariant cannot remain valid. | [PRD-15]; [PRD-16]; [PRD-28]; [AGG-13]; [AGG-14] | Exact coordination and confirmation threshold remain open. |
| DB-04 | Permanently Delete Debt Record | Remove a Debt Record only when doing so cannot erase financial meaning. | Candidate Behavior | Debt Record; opening principal; repayment/dependency history. | Debt Record, Financial Event, Workspace candidates. | Cross-boundary | No | Deletion must never orphan or erase repayment history. All Financial Event references must be absent. | Any repayment reference blocks; additional blockers remain open. | [PRD-15]; [PRD-28] | Whether zero/current/ opening principal and non-repayment dependencies affect eligibility remains open. |
| DR-01 | Record Debt Repayment | Represent cash leaving one Account and reducing one Debt Record. | Confirmed Behavior | Financial Event; Amount; Event Date; Account; Debt Record. | Financial Event, Account, Debt Record, Workspace/reporting candidates. | Cross-boundary | Yes | No Account value or principal becomes negative. Account and Debt date constraints, references, and synchronized cash/debt effects span candidates. | Insufficient Account unallocated/total or principal; invalid Account/Debt date/reference. | [PRD-11]; [PRD-15]; [UL-DebtRepayment]; [DCM-Debt] | Overpayment policy beyond v1 and same-date ordering remain open. |
| DR-02 | Correct Debt Repayment | Correct repayment facts while preserving linked cash and principal histories. | Confirmed Behavior | Existing repayment; proposed amount/date/Account/Debt. | Financial Event, affected Account and Debt Record candidates. | Cross-boundary | Yes | No Account value or principal may become negative. All old/new Account and Debt dates/references plus later state remain valid. | Any insufficient cash/principal, invalid date/reference, or later invalidity. | [PRD-16]; [AGG-13]; [UL-Correction] | Preview threshold and deterministic ordering remain open. |
| DR-03 | Delete or Restore Debt Repayment | Reverse or reapply a repayment non-destructively. | Confirmed Behavior | Debt Repayment; Trash state; Account and Debt histories. | Financial Event, Account, Debt Record candidates and readers. | Cross-boundary | Yes | Complete two-sided reversal/reapplication; values stay non-negative. Restoration revalidates Account/Debt dates and both chronological histories. | Restore blocked if current cash, principal, date, or reference invariants fail. | [PRD-16]; [UL-Trash]; [DCM-Debt] | Trash retention/permanent deletion remain open. |
| CR-01 | Same-Type Edit Financial Event | Correct editable facts while retaining the event's identity and type. | Confirmed Behavior | Existing Financial Event; old/proposed fields; affected histories. | Financial Event plus all old/new referenced candidates and readers. | Cross-boundary | Yes | Event-specific local rules remain true. Every affected candidate boundary revalidates dates, references, and later state. | Any proposed or later invariant failure. | [PRD-16]; [UL-SameTypeEdit]; [AGG-13] | Which Expense-form transitions count as same-type remains open. |
| CR-02 | Replace Financial Event with Different Event Type | Correct a misclassified event without pretending it was always the new type. | Confirmed Behavior | Original Financial Event; proposed replacement type and facts. | Financial Event and all old/new referenced candidates and readers. | Cross-boundary | Yes | Each event form satisfies its own local rules. All referenced candidate boundaries remain valid after replacement. | Proposed replacement or later state violates any invariant. | [PRD-16]; [UL-EventReplacement]; [AGG-13] | Ordinary-history placement and reason requirement remain open. |
| CR-03 | Preview Correction Impact | Let the owner understand chronological consequences before a material correction is confirmed. | Confirmed Rule with Open Detail | Proposed correction; affected records; derived values. | All affected candidate boundaries. | Cross-boundary | Yes | Projection uses the same invariants as confirmation. All candidate boundaries involved in the correction contribute constraints. | Preview itself rejects only an unevaluable proposal; confirmation is blocked by projected invariant failure. | [PRD-16]; [PRD-28]; [AGG-13] | Exact threshold, presentation, confirmation wording, and reason requirement remain open. |
| LC-01 | Soft Delete Financial Event | Remove an event's active financial effect while retaining a recoverable record. | Confirmed Behavior | Financial Event; current lifecycle; affected histories. | Financial Event and all referenced candidates/readers. | Cross-boundary | Yes | Reversal is complete and preserves non-negative invariants. Every affected candidate boundary and report becomes consistent with the reversal. | Invalid lifecycle state or inability to preserve a confirmed invariant. | [PRD-16]; [UL-SoftDelete]; [AGG-13] | Exact Trash retention remains open. |
| LC-02 | Restore Financial Event | Reapply a trashed event only when today's confirmed history can support it. | Confirmed Behavior | Trashed event; current references and chronological histories. | Financial Event and all referenced candidates/readers. | Cross-boundary | Yes | Event-specific local rules hold. All current cross-boundary date, reference, and later-state invariants hold. | Any archived/deleted invalid reference, insufficient value, date invalidity, or later invariant failure. | [PRD-16]; [UL-Restore]; [AGG-13] | Whether some archived references can support restoration needs detailed lifecycle rules. |
| LC-03 | Permanently Delete Trashed Financial Event | Potentially remove a trashed event after any required retention. | Still Open | Trashed Financial Event; retention/dependency policy. | Financial Event and all readers. | Cross-boundary | No | Any future rule must not break explanation or linked replacements. All referenced candidates and required traceability would need protection. | Not finalized. | [PRD-16]; [PRD-28] | Availability, retention, and eligibility remain open. |
| LC-04 | Archive Domain Reference | Make an Account, Category, or Dedicated Fund unavailable for new use while preserving history. | Confirmed Rule with Open Detail | Reference; lifecycle; balances/history/dependencies. | Relevant reference candidate plus Financial Event/readers. | Cross-boundary | No | Archival never rewrites financial facts. Historical references and cross-view consistency remain valid. | Type-specific blockers, especially non-zero Account and unresolved Fund case. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | Fund non-zero archival and some reporting treatment remain open. |
| LC-05 | Restore Archived Domain Reference | Return a supported archived reference without recreating it. | Confirmed Rule with Open Detail | Archived Account, Category, or Dedicated Fund. | Relevant reference candidate plus readers. | Cross-boundary | No | Restore changes no financial history by itself. Workspace scope and historical references remain valid. | Wrong lifecycle/deleted state; Fund rule unresolved. | [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28] | Dedicated Fund restoration remains open. |
| RP-01 | Use Calendar Month | Group Event Dates into ordinary calendar months. | Confirmed Behavior | Reporting configuration; Event Date; Asia/Jakarta timezone. | Reporting configuration, Financial Event, Workspace/reporting readers. | Cross-boundary | No | One active rule; exact displayed date range. Every report/view uses identical membership and workspace timezone. | Missing/contradictory configuration or non-deterministic membership. | [PRD-17]; [UL-ReportingPeriod] | No protected domain question. |
| RP-02 | Use Custom Monthly Cycle | Group Event Dates by one recurring start day suited to the owner. | Confirmed Behavior | Reporting configuration; start day; Event Date; Asia/Jakarta timezone. | Reporting configuration, Financial Event, Workspace/reporting readers. | Cross-boundary | No | Start day is 1–28; one active rule; no gaps/overlaps. All reports use the same membership and timezone. | Start day outside 1–28 or ambiguous membership. | [PRD-17]; [PRD-28]; [UL-ReportingPeriod] | One-off ranges are open and not part of this behavior. |
| RP-03 | Change Reporting Period Configuration | Regroup historical reporting without changing financial facts. | Confirmed Rule with Open Detail | Current/proposed configuration; all active Event Dates. | Reporting configuration, Financial Event, Workspace/reporting readers. | Cross-boundary | Yes | One valid active configuration; no event mutation. Every reporting consumer agrees on proposed membership. | Invalid start day, ambiguous grouping, or inability to keep reports consistent. | [PRD-17]; [PRD-28]; [AGG-13] | Immediate-vs-next-session timing and exact preview threshold remain open. |
| RC-01 | Recalculate Chronologically Affected State | Restore deterministic truth after a backdated or corrective change. | Confirmed Behavior | Changed source; affected histories; same-date ordering rule. | All candidates touched by the initiating behavior. | Cross-boundary | Yes | Every local invariant holds at every point. All participating candidate boundaries agree on references, dates, and effects. | Any point violates a confirmed invariant or ordering is not deterministic. | [PRD-16]; [PRD-19]; [UL-ChronologicalRecalculation]; [AGG-13] | Deterministic same-date ordering and exact coordination responsibility remain open. |
| TC-01 | Explain Derived Account Values | Let the owner trace Account total and Unallocated Amount to opening state and events. | Confirmed Behavior | Account opening state; active Account-affecting events; allocations. | Account, Financial Event, Dedicated Fund, Workspace/reporting candidates. | Cross-boundary | No | Explained values equal confirmed derived state. Event, Fund, and workspace readers agree. | Missing source, inconsistent total, or cross-view disagreement. | [PRD-19]; [PI-5] | Exact UI presentation is not decided. |
| TC-02 | Explain Dedicated Fund Balance and Account Breakdown | Show how a Fund is backed across Accounts and events. | Confirmed Behavior | Dedicated Fund; per-Account allocations; allocation/release/fund-expense events. | Dedicated Fund, Account, Financial Event, Workspace/reporting candidates. | Cross-boundary | No | Fund Balance equals sum of current Account-backed allocations. Account and Financial Event views agree with Fund view. | Missing provenance, mismatch, or unexplained value. | [PRD-14]; [PRD-19]; [PI-5] | Exact visualization is not decided. |
| TC-03 | Explain Outstanding Principal | Trace remaining debt to opening principal and repayments. | Confirmed Behavior | Debt opening state; active repayments. | Debt Record, Financial Event, Account, Workspace/reporting candidates. | Cross-boundary | No | Explained principal equals non-negative confirmed state. Financial Event and workspace/report views agree. | Missing source, negative/mismatched result, or cross-view disagreement. | [PRD-15]; [PRD-19] | Exact presentation is not decided. |
| TC-04 | Explain Workspace and Reporting Totals | Reconcile important totals to owner-scoped Accounts and active events. | Confirmed Behavior | Workspace; Accounts; active Financial Events; reporting configuration. | Workspace, reporting configuration, Account, Financial Event, Fund, Debt candidates. | Cross-boundary | No | Totals use one confirmed meaning and correct membership. Every contributing candidate and view agrees; no other workspace contributes. | Missing source, inconsistent membership, or dashboard/detail disagreement. | [PRD-17]; [PRD-19]; [PRD-28] | Archived-Account inclusion and final comparison metrics remain open. |
| TC-05 | Explain One Financial Event’s Effects | Show exactly what one event changed and what it did not change. | Confirmed Behavior | Event form; references; active/replaced/trashed state. | Financial Event plus every referenced candidate/readers. | Cross-boundary | No | Explanation matches event-form invariant. All referenced candidate views and totals agree. | Incomplete effect, missing source, or disagreement with derived views. | [PRD-11]; [PRD-19]; [PI-5] | Exact UI wording/layout and prior-value storage remain open. |

## 6. Workspace and Onboarding Behaviors

### WB-01 — Establish Single-Owner Workspace

- **Behavior ID:** WB-01
- **Behavior Name:** Establish Single-Owner Workspace
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Give one invited owner a private financial scope.
- **Primary Actor or Trigger:** Verified owner begins workspace setup.
- **Required Domain References:** Owner identity; Workspace candidate.
- **Preconditions:** Owner is verified; no financial workspace already exists for that owner.
- **Evaluated State and History:** Workspace ownership and existence only; no other user's state.
- **Accepted Effects:** One private, single-owner workspace becomes the scope for the owner's domain records.
- **Derived Values Affected:** Workspace existence and onboarding readiness.
- **Local Invariants:** Exactly one owner and one workspace per v1 user.
- **Cross-Boundary Invariants:** Workspace isolation applies to every referenced concept and derived view.
- **Candidate Boundaries Involved:** Workspace candidate; configuration candidates.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** All later records remain scoped to this workspace.
- **Rejection Conditions:** Unverified owner, existing workspace, or cross-owner reference.
- **Traceability Requirements:** Workspace origin and owner scope remain explainable without exposing financial data.
- **Lifecycle and Correction Interaction:** Workspace deletion and retention are outside this behavior.
- **Protected Open Questions:** Invitation mechanics, identity fields, and deletion retention remain open.
- **Source References:** [PI-3]; [PRD-6]; [PRD-20]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### WB-02 — Establish Initial Workspace Configuration

- **Behavior ID:** WB-02
- **Behavior Name:** Establish Initial Workspace Configuration
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Create the fixed financial and reporting defaults needed before recording.
- **Primary Actor or Trigger:** Workspace onboarding reaches configuration establishment.
- **Required Domain References:** Workspace; Currency; Timezone; Reporting Period Configuration.
- **Preconditions:** WB-01 accepted; configuration does not yet exist.
- **Evaluated State and History:** Workspace configuration and any confirmed onboarding choices.
- **Accepted Effects:** IDR whole-Rupiah currency, Asia/Jakarta timezone, and one active Calendar Month default are established.
- **Derived Values Affected:** Current reporting period boundaries and display currency.
- **Local Invariants:** One active configuration; currency and timezone are fixed for v1.
- **Cross-Boundary Invariants:** Later financial events and reporting use the same workspace configuration.
- **Candidate Boundaries Involved:** Workspace/configuration candidates; Reporting configuration candidate.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Reporting-period membership is derived later from Event Date.
- **Rejection Conditions:** Conflicting configuration, unsupported currency, or unsupported timezone.
- **Traceability Requirements:** Configuration origin and active reporting rule remain inspectable.
- **Lifecycle and Correction Interaction:** Reporting configuration may later change only through RP-03.
- **Protected Open Questions:** Starter-category content and exact onboarding presentation remain open.
- **Source References:** [PRD-9]; [PRD-17]; [PRD-28]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### AC-01 — Establish Account Opening State

- **Behavior ID:** AC-01
- **Behavior Name:** Establish Account Opening State
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Create an asset-like money-holding starting point without fabricating an event.
- **Primary Actor or Trigger:** Owner establishes an Account.
- **Required Domain References:** Account; Account Name; Account Type; Opening Balance; Opening-Balance Effective Date.
- **Preconditions:** Workspace exists; Account Type is one of Cash, Bank Account, E-Wallet, or Other; whole-Rupiah Opening Balance is at least Rp0; date is supplied.
- **Evaluated State and History:** No prior Account history; proposed opening state.
- **Accepted Effects:** Account begins with its descriptive Account Type, Total Account Balance and Unallocated Amount equal to Opening Balance, and zero fund allocations; no Financial Event or Income is created.
- **Derived Values Affected:** Total Account Balance; Unallocated Amount; Workspace Total.
- **Local Invariants:** Opening Balance and all resulting balances stay non-negative; Account Type is descriptive only and never changes financial semantics.
- **Cross-Boundary Invariants:** Name constraints and workspace totals may involve other Account candidates.
- **Candidate Boundaries Involved:** Account candidate; Workspace candidate.
- **Earliest Recalculation Point:** None for establishment; the Opening-Balance Effective Date becomes the baseline for any later AC-06 or AC-07 correction.
- **Later State Requiring Reevaluation:** Establishment has no existing history to recalculate; later Financial Events derive from the baseline, and later AC-06/AC-07 corrections may reevaluate affected history from it.
- **Rejection Conditions:** Unsupported Account Type, negative/fractional amount, missing effective date, or confirmed name-rule violation.
- **Traceability Requirements:** Opening state is a source component for later balance explanations.
- **Lifecycle and Correction Interaction:** Establishment creates the opening baseline and does not recalculate existing history; later correction uses AC-06/AC-07, deletion uses AC-05, and archive uses AC-03.
- **Protected Open Questions:** Account-name uniqueness remains open.
- **Source References:** [PRD-9]; [PRD-12]; [UL-Account]; [AGG-7]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

## 7. Account Behaviors

### AC-02 — Rename Account

- **Behavior ID:** AC-02
- **Behavior Name:** Rename Account
- **Behavior Status:** Confirmed Rule with Open Detail
- **Business Intent:** Let the owner use a meaningful Account name without changing financial history.
- **Primary Actor or Trigger:** Owner proposes a new Account Name.
- **Required Domain References:** Account; Account Name.
- **Preconditions:** Account exists and is not deleted; the confirmed acceptance scope is onboarding, while post-onboarding availability remains undecided.
- **Evaluated State and History:** Current name, candidate name, and any applicable workspace name rule.
- **Accepted Effects:** Within the confirmed onboarding scope, the name changes while balances, effective date, and Financial Events do not; no post-onboarding accepted outcome is asserted.
- **Derived Values Affected:** Labels in explanations and historical views.
- **Local Invariants:** Rename never changes amounts, dates, references, or event identity.
- **Cross-Boundary Invariants:** Any workspace-wide uniqueness rule is evaluated if later confirmed.
- **Candidate Boundaries Involved:** Account candidate; possibly Workspace candidate for uniqueness.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Historical records display the current or historically appropriate label; exact presentation is open.
- **Rejection Conditions:** Missing/invalid name or confirmed duplicate-name violation.
- **Traceability Requirements:** The renamed Account remains traceable as the same Account.
- **Lifecycle and Correction Interaction:** Archiving/restoring does not create a new Account.
- **Protected Open Questions:** Availability after onboarding and name uniqueness remain open.
- **Source References:** [PRD-12]; [PRD-28]; [UL-Account]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### AC-03 — Archive Account

- **Behavior ID:** AC-03
- **Behavior Name:** Archive Account
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Remove an unused-for-new-entry Account from active use while preserving history.
- **Primary Actor or Trigger:** Owner proposes Account archival.
- **Required Domain References:** Account; Total Account Balance; Financial Event history.
- **Preconditions:** Account exists, is active, and Total Account Balance is exactly Rp0.
- **Evaluated State and History:** Current total plus all historical references and dependencies.
- **Accepted Effects:** Account becomes archived and unavailable to new Financial Events; history remains.
- **Derived Values Affected:** Active-reference choices and workspace presentation.
- **Local Invariants:** Archival never changes balance or history; only a zero-total Account qualifies.
- **Cross-Boundary Invariants:** Dependent candidates must retain valid historical references.
- **Candidate Boundaries Involved:** Account candidate; Financial Event and Workspace candidates as readers.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Historical reporting treatment may require reevaluation only as a presentation rule.
- **Rejection Conditions:** Non-zero total or invalid lifecycle state.
- **Traceability Requirements:** Reason for blocking and preserved historical references are explainable.
- **Lifecycle and Correction Interaction:** AC-04 may restore; AC-05 is a separate stricter action.
- **Protected Open Questions:** Whether archived Accounts remain in all historical totals is open.
- **Source References:** [PRD-12]; [PRD-28]; [UL-Archive]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### AC-04 — Restore Archived Account

- **Behavior ID:** AC-04
- **Behavior Name:** Restore Archived Account
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Return an archived Account to eligible active use without recreating it.
- **Primary Actor or Trigger:** Owner restores an archived Account.
- **Required Domain References:** Account; archived state.
- **Preconditions:** Account exists and is archived, not deleted.
- **Evaluated State and History:** Preserved opening state, current balance, and history.
- **Accepted Effects:** Same Account becomes active and eligible for new references.
- **Derived Values Affected:** Active Account lists and future selectors.
- **Local Invariants:** Restoration changes no amount, date, or historical reference.
- **Cross-Boundary Invariants:** Workspace scope and reference validity remain intact.
- **Candidate Boundaries Involved:** Account candidate; Financial Event readers.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Future events can reference the restored Account.
- **Rejection Conditions:** Not archived, deleted, or outside owner workspace.
- **Traceability Requirements:** Restoration is shown as lifecycle change of the same Account.
- **Lifecycle and Correction Interaction:** No historical event is re-created or reapplied by Account restoration.
- **Protected Open Questions:** No protected financial-rule question.
- **Source References:** [PRD-12]; [UL-Restore]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### AC-05 — Permanently Delete Account

- **Behavior ID:** AC-05
- **Behavior Name:** Permanently Delete Account
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Remove only an Account that has never carried financial meaning.
- **Primary Actor or Trigger:** Owner requests permanent deletion.
- **Required Domain References:** Account; Opening Balance; dependency/history evidence.
- **Preconditions:** Account exists; Opening Balance is Rp0; no Financial Event, allocation, or other dependency ever referenced it.
- **Evaluated State and History:** Entire Account history and dependency set.
- **Accepted Effects:** Eligible Account ceases to exist.
- **Derived Values Affected:** Active Account lists only.
- **Local Invariants:** Deletion cannot erase financial history or a non-zero opening state.
- **Cross-Boundary Invariants:** All candidate boundaries must report no reference or dependency.
- **Candidate Boundaries Involved:** Account candidate plus every potential referring candidate.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** No later state exists for an accepted deletion.
- **Rejection Conditions:** Non-zero opening state, any history/dependency, or invalid lifecycle state.
- **Traceability Requirements:** Blocking dependencies are explainable without exposing other workspaces.
- **Lifecycle and Correction Interaction:** Archive remains the non-destructive alternative when deletion is ineligible.
- **Protected Open Questions:** Exact retention of non-financial metadata is outside this behavior.
- **Source References:** [PRD-12]; [UL-Delete]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### AC-06 — Correct Opening Balance

- **Behavior ID:** AC-06
- **Behavior Name:** Correct Opening Balance
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Correct a mistaken starting amount while preserving chronological truth.
- **Primary Actor or Trigger:** Owner proposes a replacement Opening Balance.
- **Required Domain References:** Account; all later Account-affecting Financial Events and allocations.
- **Preconditions:** Account exists; proposed amount is whole Rupiah and at least Rp0; Impact Preview is available.
- **Evaluated State and History:** Opening state and every later affected state from the effective date.
- **Accepted Effects:** On confirmation, Opening Balance changes and affected state is recalculated; history stays present.
- **Derived Values Affected:** Account totals, Unallocated Amount, fund-backed state, workspace/report totals.
- **Local Invariants:** No recalculated Account total or Unallocated Amount may become negative.
- **Cross-Boundary Invariants:** Later Financial Events, Dedicated Fund allocations, debts, and summaries must remain valid.
- **Candidate Boundaries Involved:** Account candidate plus affected Financial Event, Dedicated Fund, Workspace/reporting candidates.
- **Earliest Recalculation Point:** Account effective date.
- **Later State Requiring Reevaluation:** All later events and derived states.
- **Rejection Conditions:** Any confirmed date or financial invariant would fail after recalculation.
- **Traceability Requirements:** Preview identifies affected records and explanations retain the corrected source.
- **Lifecycle and Correction Interaction:** Correction is non-destructive; it neither deletes nor excludes Financial Events.
- **Protected Open Questions:** Exact high-impact confirmation threshold or reason requirement remains open.
- **Source References:** [PRD-12]; [PRD-16]; [AGG-13]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### AC-07 — Correct Opening-Balance Effective Date

- **Behavior ID:** AC-07
- **Behavior Name:** Correct Opening-Balance Effective Date
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Correct when an Account's opening state begins without rewriting history.
- **Primary Actor or Trigger:** Owner proposes a new Opening-Balance Effective Date.
- **Required Domain References:** Account; proposed date; all referencing Financial Events.
- **Preconditions:** Account exists; Impact Preview and Chronological Recalculation are available.
- **Evaluated State and History:** All existing Financial Events are identified as remaining valid, becoming valid, or becoming invalid relative to the proposed date.
- **Accepted Effects:** On confirmation, date changes only if every confirmed invariant can remain valid; existing events remain in history.
- **Derived Values Affected:** Chronological Account, fund, workspace, and reporting explanations.
- **Local Invariants:** Account provides the effective date constraint and protects its non-negative balance history; it cannot alone evaluate Event Date.
- **Cross-Boundary Invariants:** Complete rule is cross-boundary because Event Date belongs to Financial Event; each referencing Event Date must be on/after the proposed date.
- **Candidate Boundaries Involved:** Account and Financial Event candidates; other affected readers.
- **Earliest Recalculation Point:** Earlier of old and proposed effective dates.
- **Later State Requiring Reevaluation:** Every referencing Financial Event and later derived state.
- **Rejection Conditions:** Blocked if any confirmed date or financial invariant cannot remain valid.
- **Traceability Requirements:** Preview names affected records and validity changes; explanations retain history.
- **Lifecycle and Correction Interaction:** No existing Financial Event is silently removed, excluded, or moved.
- **Protected Open Questions:** Exact coordination and confirmation threshold remain open.
- **Source References:** [PRD-12]; [PRD-16]; [PRD-28]; [AGG-13]; [AGG-14]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

## 8. Income Behaviors

### IN-01 — Record Income

- **Behavior ID:** IN-01
- **Behavior Name:** Record Income
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Represent external money entering one Account.
- **Primary Actor or Trigger:** Owner records Income.
- **Required Domain References:** Financial Event; Amount; Event Date; Account; Income Category; optional Note.
- **Preconditions:** Active valid references; Amount > Rp0; Event Date is not before Account effective date.
- **Evaluated State and History:** Selected Account history through Event Date and deterministic same-date position.
- **Accepted Effects:** Income is recorded once; Account total and Unallocated Amount increase by Amount; Fund Balance and Outstanding Principal do not change.
- **Derived Values Affected:** Account totals; workspace income and balance totals; reporting membership.
- **Local Invariants:** Positive whole-Rupiah Amount; Category kind is Income.
- **Cross-Boundary Invariants:** Account-date validity, workspace scope, reporting, and cross-view consistency.
- **Candidate Boundaries Involved:** Financial Event, Account, Category, Workspace/reporting candidates.
- **Earliest Recalculation Point:** Event Date.
- **Later State Requiring Reevaluation:** Later events for the Account and affected reports.
- **Rejection Conditions:** Invalid amount/date/reference/category or isolation violation.
- **Traceability Requirements:** Event detail explains source and both Account-derived increases.
- **Lifecycle and Correction Interaction:** Edit/delete/restore uses CR-01 and LC behaviors; type change uses CR-02.
- **Protected Open Questions:** Deterministic same-date ordering mechanism remains open.
- **Source References:** [PRD-11]; [UL-Income]; [DCM-Income]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

## 9. Ordinary Expense Behaviors

### EX-01 — Record Ordinary Expense

- **Behavior ID:** EX-01
- **Behavior Name:** Record Ordinary Expense
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Represent spending from unallocated Account money.
- **Primary Actor or Trigger:** Owner records an Expense without a Dedicated Fund reference.
- **Required Domain References:** Financial Event; Amount; Event Date; Account; Expense Category.
- **Preconditions:** Active references; Amount > Rp0; Event Date valid; sufficient Unallocated Amount and Total Account Balance.
- **Evaluated State and History:** Account and allocation history through the event position.
- **Accepted Effects:** Expense is recorded once; Account total and Unallocated Amount each decrease by Amount; fund allocations remain unchanged.
- **Derived Values Affected:** Account, workspace spending, reporting, and summary totals.
- **Local Invariants:** Resulting Account total and Unallocated Amount stay non-negative.
- **Cross-Boundary Invariants:** Date/reference/category validity and cross-view consistency span candidates.
- **Candidate Boundaries Involved:** Financial Event, Account, Category, Workspace/reporting candidates.
- **Earliest Recalculation Point:** Event Date.
- **Later State Requiring Reevaluation:** Later Account-affecting events and reports.
- **Rejection Conditions:** Insufficient Unallocated Amount/total, invalid date, wrong Category kind, or invalid reference.
- **Traceability Requirements:** Event detail explains both decreases and supporting records.
- **Lifecycle and Correction Interaction:** Correction/deletion/restore recalculates from affected date; type change is replacement.
- **Protected Open Questions:** Transition between ordinary and fund-linked Expense remains protected under FX-02.
- **Source References:** [PRD-11]; [UL-Expense]; [DCM-Expense]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

## 10. Transfer Behaviors

### TR-01 — Record Transfer

- **Behavior ID:** TR-01
- **Behavior Name:** Record Transfer
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Represent money moving between two owner Accounts without income or expense.
- **Primary Actor or Trigger:** Owner records a Transfer.
- **Required Domain References:** Financial Event; Amount; Event Date; Source Account; Destination Account; no Category.
- **Preconditions:** Both Accounts active and owner-scoped; Amount > Rp0; dates valid for both; source total and Unallocated Amount sufficient.
- **Evaluated State and History:** Both Account histories through the event position.
- **Accepted Effects:** Source total/unallocated decrease; destination total/unallocated increase; Workspace Total Balance, income/expense totals, and fund allocations remain unchanged.
- **Derived Values Affected:** Both Account totals, workspace composition, reporting traceability.
- **Local Invariants:** Source balances stay non-negative; transfer has complete two-sided effect.
- **Cross-Boundary Invariants:** Both Account effective-date constraints, isolation, and synchronized two-sided consistency.
- **Candidate Boundaries Involved:** Financial Event and two Account candidates; Workspace/reporting readers.
- **Earliest Recalculation Point:** Event Date.
- **Later State Requiring Reevaluation:** Later events on either Account.
- **Rejection Conditions:** Insufficient source values, invalid date/reference, or cross-owner Account.
- **Traceability Requirements:** One event explains both Account effects and zero income/expense effect.
- **Lifecycle and Correction Interaction:** Edit/delete/restore must reverse and reapply both sides coherently.
- **Protected Open Questions:** Whether source and destination equality needs an explicit rule remains open.
- **Source References:** [PRD-11]; [UL-Transfer]; [DCM-Transfer]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### TR-02 — Correct Transfer

- **Behavior ID:** TR-02
- **Behavior Name:** Correct Transfer
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Correct amount, date, note, or Account references while preserving Transfer identity.
- **Primary Actor or Trigger:** Owner proposes a Same-Type Edit to a Transfer.
- **Required Domain References:** Existing Transfer; proposed editable fields; both Account histories.
- **Preconditions:** Transfer exists and is active; preview available when impact is material.
- **Evaluated State and History:** Old reversal and proposed reapplication across both Account timelines.
- **Accepted Effects:** Accepted correction preserves identity and recalculates both sides from earliest affected point.
- **Derived Values Affected:** Both Account totals, workspace composition, reports.
- **Local Invariants:** Transfer remains positive and complete; affected Account balances stay non-negative.
- **Cross-Boundary Invariants:** All old/new Account dates and later histories remain valid.
- **Candidate Boundaries Involved:** Financial Event and affected Account candidates; Workspace/reporting readers.
- **Earliest Recalculation Point:** Earliest old/new Event Date.
- **Later State Requiring Reevaluation:** Later events on old and new Accounts.
- **Rejection Conditions:** Any invalid proposed reference/date or later negative state.
- **Traceability Requirements:** Before/after effect and impacted histories remain traceable.
- **Lifecycle and Correction Interaction:** Same event identity; type change must use CR-02.
- **Protected Open Questions:** Preview threshold and same-date ordering mechanism remain open.
- **Source References:** [PRD-16]; [UL-Correction]; [AGG-13]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### TR-03 — Delete or Restore Transfer

- **Behavior ID:** TR-03
- **Behavior Name:** Delete or Restore Transfer
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Remove or reinstate a mistaken Transfer without losing its record.
- **Primary Actor or Trigger:** Owner soft-deletes or restores a Transfer.
- **Required Domain References:** Transfer; Trash state; both Account histories.
- **Preconditions:** Transfer exists in the lifecycle state required by LC-01 or LC-02.
- **Evaluated State and History:** Both Account histories from Event Date.
- **Accepted Effects:** Delete reverses both sides; restore reapplies both sides only if current history remains valid.
- **Derived Values Affected:** Both Account totals and dependent summaries.
- **Local Invariants:** Reversal/reapplication is complete and never one-sided.
- **Cross-Boundary Invariants:** Restoration must revalidate dates, references, and both Account histories.
- **Candidate Boundaries Involved:** Financial Event and two Account candidates; Workspace/reporting readers.
- **Earliest Recalculation Point:** Transfer Event Date.
- **Later State Requiring Reevaluation:** Later events on either Account.
- **Rejection Conditions:** Restore is blocked if any current invariant would fail.
- **Traceability Requirements:** Trash record explains original effect, reversal, or restoration result.
- **Lifecycle and Correction Interaction:** Uses LC-01/LC-02; permanent deletion remains LC-03.
- **Protected Open Questions:** No exact Trash retention or permanent-deletion rule is decided.
- **Source References:** [PRD-16]; [UL-Trash]; [DCM-Transfer]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

## 11. Fund Allocation Behaviors

### FA-01 — Allocate Account Money to Dedicated Fund

- **Behavior ID:** FA-01
- **Behavior Name:** Allocate Account Money to Dedicated Fund
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Set aside part of one Account's unallocated money for one purpose without moving cash.
- **Primary Actor or Trigger:** Owner records a Fund Allocation.
- **Required Domain References:** Financial Event; Amount; Event Date; Account; Dedicated Fund; no Category.
- **Preconditions:** Active references; Amount > Rp0; date valid; Account Unallocated Amount sufficient.
- **Evaluated State and History:** Account and selected Account–Fund allocation history through event position.
- **Accepted Effects:** Account total and income/expense totals remain unchanged; Unallocated Amount decreases; selected allocation and Fund Balance increase.
- **Derived Values Affected:** Unallocated Amount; allocation by Account; Fund Balance; workspace allocation totals.
- **Local Invariants:** Account total equals unallocated plus allocations; no component becomes negative.
- **Cross-Boundary Invariants:** Date/reference validity and synchronized Account/Fund effects span candidates.
- **Candidate Boundaries Involved:** Financial Event, Account, Dedicated Fund, Workspace/reporting candidates.
- **Earliest Recalculation Point:** Event Date.
- **Later State Requiring Reevaluation:** Later Account/fund events and reports.
- **Rejection Conditions:** Insufficient unallocated, invalid date/reference, or non-positive amount.
- **Traceability Requirements:** Event explains virtual allocation, backing Account, and unchanged total.
- **Lifecycle and Correction Interaction:** Correction/delete/restore recalculates both Account and Fund views.
- **Protected Open Questions:** No allocation-lot or FIFO/LIFO policy is introduced.
- **Source References:** [PRD-11]; [PRD-14]; [UL-FundAllocation]; [DCM-Fund]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### FA-02 — Correct Fund Allocation

- **Behavior ID:** FA-02
- **Behavior Name:** Correct Fund Allocation
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Correct allocation facts while preserving chronological backing.
- **Primary Actor or Trigger:** Owner proposes Same-Type Edit.
- **Required Domain References:** Existing Fund Allocation; proposed amount/date/Account/Fund.
- **Preconditions:** Active event; old and proposed references exist; impact can be previewed.
- **Evaluated State and History:** Old reversal plus proposed application across affected Account/Fund histories.
- **Accepted Effects:** Identity preserved; affected unallocated and allocation values recalculate.
- **Derived Values Affected:** Account decomposition; Account–Fund allocations; Fund Balance; reports.
- **Local Invariants:** All decompositions hold and no allocation/unallocated amount becomes negative.
- **Cross-Boundary Invariants:** Old/new dates and references plus later Account/Fund events remain valid.
- **Candidate Boundaries Involved:** Financial Event, affected Account and Dedicated Fund candidates.
- **Earliest Recalculation Point:** Earliest old/new Event Date.
- **Later State Requiring Reevaluation:** All later affected Account/Fund events.
- **Rejection Conditions:** Insufficient proposed backing or any invalid later state.
- **Traceability Requirements:** Before/after virtual-allocation effects and affected sources are explainable.
- **Lifecycle and Correction Interaction:** Type change is replacement; delete/restore uses lifecycle behaviors.
- **Protected Open Questions:** Impact-preview threshold and ordering remain open.
- **Source References:** [PRD-16]; [AGG-13]; [UL-Correction]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

## 12. Fund Release Behaviors

### FR-01 — Release Dedicated Fund Allocation to Unallocated Amount

- **Behavior ID:** FR-01
- **Behavior Name:** Release Dedicated Fund Allocation to Unallocated Amount
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Return a selected Account's current allocation for one Fund to that Account's spendable amount.
- **Primary Actor or Trigger:** Owner records a Fund Release.
- **Required Domain References:** Financial Event; Amount; Event Date; selected Account; Dedicated Fund.
- **Preconditions:** Active references; Amount > Rp0; valid date; matching Account–Fund allocation is sufficient.
- **Evaluated State and History:** Selected Account–Fund allocation history through event position.
- **Accepted Effects:** Account total and income/expense totals remain unchanged; selected allocation and Fund Balance decrease; Account Unallocated Amount increases.
- **Derived Values Affected:** Account decomposition, selected allocation, Fund Balance, workspace totals.
- **Local Invariants:** Release draws only from selected Account's current matching allocation; values stay non-negative.
- **Cross-Boundary Invariants:** Account effective date and coherent Account/Fund effects span candidates.
- **Candidate Boundaries Involved:** Financial Event, Account, Dedicated Fund, Workspace/reporting candidates.
- **Earliest Recalculation Point:** Event Date.
- **Later State Requiring Reevaluation:** Later events affecting selected Account or Fund.
- **Rejection Conditions:** Amount exceeds selected matching allocation, invalid date/reference, or non-positive amount.
- **Traceability Requirements:** Event explains selected backing Account and unchanged Account total.
- **Lifecycle and Correction Interaction:** Correction/delete/restore recalculates Account and Fund state.
- **Protected Open Questions:** No cross-Account auto-consumption or allocation-lot selection.
- **Source References:** [PRD-11]; [PRD-14]; [UL-FundRelease]; [DCM-Fund]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### FR-02 — Correct Fund Release

- **Behavior ID:** FR-02
- **Behavior Name:** Correct Fund Release
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Correct a Fund Release while preserving selected-Account provenance and Financial Event identity.
- **Primary Actor or Trigger:** Owner proposes Same-Type Edit.
- **Required Domain References:** Existing Fund Release; proposed amount, Event Date, Account, and Dedicated Fund references.
- **Preconditions:** Existing active event; proposed references/date are valid; affected chronological state can be evaluated.
- **Evaluated State and History:** Reverse the old effect and evaluate the proposed effect across all old and new Account–Fund histories.
- **Accepted Effects:** Preserve Financial Event identity; reverse the old release and apply the proposed release only when every affected invariant remains valid.
- **Derived Values Affected:** Account Unallocated Amount, matching Account-Backed Fund Allocation, Dedicated Fund Balance, and related reports.
- **Local Invariants:** Proposed release does not exceed the selected Account's matching allocation at its chronological position; Total Account Balance remains unchanged; resulting values remain non-negative.
- **Cross-Boundary Invariants:** Old and proposed Account/Fund references, effective-date constraints, and later Account/Fund histories remain valid.
- **Candidate Boundaries Involved:** Financial Event, affected Account candidates, affected Dedicated Fund candidates, and reporting readers.
- **Earliest Recalculation Point:** Earliest old/new Event Date.
- **Later State Requiring Reevaluation:** Every later event and derived state affecting either old or proposed Account–Fund pairing.
- **Rejection Conditions:** Insufficient matching allocation, invalid date/reference, or any invalid proposed or later Account/Fund state.
- **Traceability Requirements:** Preview/detail explains old and proposed Account–Fund pairing, amount, provenance, and resulting effects.
- **Lifecycle and Correction Interaction:** Type change uses Event Replacement; deletion/restoration reverses or reapplies the full release effect.
- **Protected Open Questions:** Impact Preview threshold, deterministic same-date ordering, and final allocation responsibility remain open.
- **Source References:** [PRD-11]; [PRD-14]; [PRD-16]; [AGG-13]; [UL-Correction]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

## 13. Fund-Linked Expense Behaviors

### FX-01 — Record Fund-Linked Expense

- **Behavior ID:** FX-01
- **Behavior Name:** Record Fund-Linked Expense
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Represent spending paid by one Account from that Account's allocation to one Fund.
- **Primary Actor or Trigger:** Owner records an Expense with a Dedicated Fund reference.
- **Required Domain References:** Financial Event; Amount; Event Date; payment Account; Expense Category; Dedicated Fund.
- **Preconditions:** Active references; Amount > Rp0; valid date; Account total and matching Account–Fund allocation are sufficient.
- **Evaluated State and History:** Payment Account and matching allocation history through event position.
- **Accepted Effects:** Account total decreases; matching allocation and Fund Balance decrease; Unallocated Amount stays unchanged; Expense reporting counts the event exactly once.
- **Derived Values Affected:** Account total/decomposition; selected allocation; Fund Balance; spending/report totals.
- **Local Invariants:** Matching allocation and Account total stay non-negative; unallocated is unchanged.
- **Cross-Boundary Invariants:** Account date, Category kind, Account/Fund provenance, and synchronized effects span candidates.
- **Candidate Boundaries Involved:** Financial Event, Account, Category, Dedicated Fund, Workspace/reporting candidates.
- **Earliest Recalculation Point:** Event Date.
- **Later State Requiring Reevaluation:** Later Account/Fund events and reports.
- **Rejection Conditions:** Insufficient matching allocation or total, invalid date/reference/category.
- **Traceability Requirements:** Event explains payment Account, consumed allocation, unchanged unallocated, and spending classification.
- **Lifecycle and Correction Interaction:** Correction/delete/restore recalculates all affected views.
- **Protected Open Questions:** No multi-Account draw or automatic use of another Account's allocation.
- **Source References:** [PRD-11]; [PRD-14]; [UL-FundLinkedExpense]; [DCM-Fund]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### FX-02 — Correct Fund-Linked Expense

- **Behavior ID:** FX-02
- **Behavior Name:** Correct Fund-Linked Expense
- **Behavior Status:** Confirmed Rule with Open Detail
- **Business Intent:** Correct a fund-backed Expense without obscuring its provenance or financial effect.
- **Primary Actor or Trigger:** Owner proposes editing an Expense currently linked to a Fund.
- **Required Domain References:** Existing Expense; proposed amount/date/Account/Category/Fund reference.
- **Preconditions:** Event exists; proposed classification and references can be evaluated; preview available as required.
- **Evaluated State and History:** Old and proposed Account/Fund histories from earliest affected point.
- **Accepted Effects:** Accepted same-type correction preserves event identity and reapplies the complete Expense effect.
- **Derived Values Affected:** Account decomposition, allocation, Fund Balance, spending/report totals.
- **Local Invariants:** All Expense amount and Account/Fund invariants hold.
- **Cross-Boundary Invariants:** Category kind, Account dates, provenance, and later histories remain valid.
- **Candidate Boundaries Involved:** Financial Event, Account, Category, Dedicated Fund candidates and readers.
- **Earliest Recalculation Point:** Earliest old/new Event Date.
- **Later State Requiring Reevaluation:** All later affected Account/Fund events.
- **Rejection Conditions:** Any insufficient balance/allocation, invalid reference/date, or unresolved classification transition.
- **Traceability Requirements:** Before/after effect identifies whether Fund backing changes.
- **Lifecycle and Correction Interaction:** Delete/restore is non-destructive; Event Type change is replacement.
- **Protected Open Questions:** Whether adding/removing a Fund reference is always Same-Type Edit or needs a distinct correction rule remains open.
- **Source References:** [PRD-16]; [PRD-28]; [UL-Expense]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

## 14. Category Behaviors

### CT-01 — Establish Category

- **Behavior ID:** CT-01
- **Behavior Name:** Establish Category
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Create an owner-defined descriptive classification of one immutable kind.
- **Primary Actor or Trigger:** Owner creates a Category.
- **Required Domain References:** Category; Category Name; Category Kind.
- **Preconditions:** Workspace exists; name supplied; kind is Income or Expense.
- **Evaluated State and History:** Workspace Category set and applicable naming rules.
- **Accepted Effects:** Active Category becomes available only for matching event kind.
- **Derived Values Affected:** Category choices and classified summaries.
- **Local Invariants:** Category has exactly one kind; kind never changes through rename.
- **Cross-Boundary Invariants:** Workspace naming and later Financial Event reference validity may span candidates.
- **Candidate Boundaries Involved:** Category candidate; Workspace candidate.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Later Financial Events reference the same Category identity.
- **Rejection Conditions:** Invalid name/kind or confirmed duplicate rule violation.
- **Traceability Requirements:** Category origin, kind, and referenced events remain explainable.
- **Lifecycle and Correction Interaction:** Archive/restore/delete use CT-03/04/05.
- **Protected Open Questions:** Name uniqueness and starter-category final set remain open.
- **Source References:** [PRD-13]; [UL-Category]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### CT-02 — Rename Category

- **Behavior ID:** CT-02
- **Behavior Name:** Rename Category
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Improve a label without reclassifying past events.
- **Primary Actor or Trigger:** Owner renames a Category.
- **Required Domain References:** Category; proposed Category Name.
- **Preconditions:** Category exists and is not deleted.
- **Evaluated State and History:** Current Category and workspace naming context.
- **Accepted Effects:** Name changes; Category identity, kind, and event references remain.
- **Derived Values Affected:** Labels in history, reports, and explanations.
- **Local Invariants:** Rename never changes Category Kind or financial effects.
- **Cross-Boundary Invariants:** Any confirmed workspace naming constraint applies.
- **Candidate Boundaries Involved:** Category candidate; Financial Event readers.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** All referenced events continue to use the same Category.
- **Rejection Conditions:** Invalid name or confirmed duplicate violation.
- **Traceability Requirements:** Historical events remain traceable to the renamed Category.
- **Lifecycle and Correction Interaction:** Archival/restoration does not create a new Category.
- **Protected Open Questions:** Name uniqueness remains open.
- **Source References:** [PRD-13]; [UL-Category]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### CT-03 — Archive or Hide Category

- **Behavior ID:** CT-03
- **Behavior Name:** Archive or Hide Category
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Remove a Category from new choices while preserving classifications.
- **Primary Actor or Trigger:** Owner archives/hides an active Category.
- **Required Domain References:** Category; Financial Event references.
- **Preconditions:** Category exists and is active.
- **Evaluated State and History:** Category history and all referencing events.
- **Accepted Effects:** Category becomes unavailable to new events; existing references remain.
- **Derived Values Affected:** Active choices and category summaries.
- **Local Invariants:** Archival does not alter kind or existing event effects.
- **Cross-Boundary Invariants:** Historical reports retain valid Category references.
- **Candidate Boundaries Involved:** Category candidate; Financial Event/reporting readers.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Historical events remain classified.
- **Rejection Conditions:** Invalid lifecycle state.
- **Traceability Requirements:** Dependents and preserved history are explainable.
- **Lifecycle and Correction Interaction:** CT-04 restores; CT-05 has stricter eligibility.
- **Protected Open Questions:** Exact user-facing archive/hide terminology is a UX decision.
- **Source References:** [PRD-13]; [UL-Archive]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### CT-04 — Restore Category

- **Behavior ID:** CT-04
- **Behavior Name:** Restore Category
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Return an archived Category to new-event eligibility.
- **Primary Actor or Trigger:** Owner restores Category.
- **Required Domain References:** Category; archived state.
- **Preconditions:** Category exists and is archived, not deleted.
- **Evaluated State and History:** Preserved identity, kind, and references.
- **Accepted Effects:** Same Category becomes active.
- **Derived Values Affected:** Active choices only.
- **Local Invariants:** No financial record or kind changes.
- **Cross-Boundary Invariants:** Workspace scope remains valid.
- **Candidate Boundaries Involved:** Category candidate; Financial Event readers.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Future matching-kind events may reference it.
- **Rejection Conditions:** Not archived, deleted, or wrong workspace.
- **Traceability Requirements:** Restore is a lifecycle fact of the same Category.
- **Lifecycle and Correction Interaction:** No historical event is recreated.
- **Protected Open Questions:** No protected domain question.
- **Source References:** [PRD-13]; [UL-Restore]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### CT-05 — Permanently Delete Category

- **Behavior ID:** CT-05
- **Behavior Name:** Permanently Delete Category
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Remove only a Category that has never classified an event.
- **Primary Actor or Trigger:** Owner requests permanent deletion.
- **Required Domain References:** Category; reference/dependency evidence.
- **Preconditions:** Category exists and no Financial Event has ever referenced it.
- **Evaluated State and History:** Complete Category reference history.
- **Accepted Effects:** Eligible Category ceases to exist.
- **Derived Values Affected:** Category choices only.
- **Local Invariants:** Deletion cannot erase historical classification.
- **Cross-Boundary Invariants:** All potential Financial Event references must be absent.
- **Candidate Boundaries Involved:** Category and Financial Event candidates.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** No later state exists for accepted deletion.
- **Rejection Conditions:** Any event reference/dependency or invalid lifecycle state.
- **Traceability Requirements:** Blocking reference is explainable.
- **Lifecycle and Correction Interaction:** Archive is the non-destructive alternative.
- **Protected Open Questions:** Retention of non-financial metadata is not decided.
- **Source References:** [PRD-13]; [UL-Delete]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

## 15. Dedicated Fund and Financial Goal Behaviors

### DF-01 — Establish Dedicated Fund

- **Behavior ID:** DF-01
- **Behavior Name:** Establish Dedicated Fund
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Create a named virtual purpose for allocations.
- **Primary Actor or Trigger:** Owner establishes a Dedicated Fund.
- **Required Domain References:** Dedicated Fund; Fund Name; optional Target Amount.
- **Preconditions:** Workspace exists; valid name; optional target is positive whole Rupiah if supplied.
- **Evaluated State and History:** Workspace Fund set; no allocation history.
- **Accepted Effects:** Fund begins active with zero Fund Balance and optional target.
- **Derived Values Affected:** Fund Balance, goal progress, workspace allocation totals.
- **Local Invariants:** Fund Balance begins at zero; target is not a spending cap.
- **Cross-Boundary Invariants:** Workspace naming and later Account-backed allocations span candidates.
- **Candidate Boundaries Involved:** Dedicated Fund candidate; Workspace candidate.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Later allocations, releases, and fund-linked expenses.
- **Rejection Conditions:** Invalid name/target or confirmed duplicate rule violation.
- **Traceability Requirements:** Fund balance explains zero starting state and later supporting events.
- **Lifecycle and Correction Interaction:** Rename/target/lifecycle use DF-02 through DF-06.
- **Protected Open Questions:** Name uniqueness, target-date shipping, and completed-state representation remain open.
- **Source References:** [PRD-14]; [PRD-28]; [UL-DedicatedFund]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### DF-02 — Rename Dedicated Fund

- **Behavior ID:** DF-02
- **Behavior Name:** Rename Dedicated Fund
- **Behavior Status:** Still Open
- **Business Intent:** Potentially relabel a purpose without changing its financial history.
- **Primary Actor or Trigger:** Owner proposes a Fund name change.
- **Required Domain References:** Dedicated Fund; proposed name.
- **Preconditions:** Not yet approved as a v1 domain behavior.
- **Evaluated State and History:** Fund identity and all allocation history would need evaluation.
- **Accepted Effects:** No accepted effect is established.
- **Derived Values Affected:** Potential labels only.
- **Local Invariants:** Any future rule must preserve balance, identity, and event references.
- **Cross-Boundary Invariants:** Potential workspace naming rule would also apply.
- **Candidate Boundaries Involved:** Dedicated Fund candidate; readers.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** All historical references would remain relevant.
- **Rejection Conditions:** No rejection catalog can be finalized until behavior is approved.
- **Traceability Requirements:** Any future decision must preserve traceability.
- **Lifecycle and Correction Interaction:** No lifecycle implication is approved.
- **Protected Open Questions:** Availability and uniqueness rules remain open.
- **Source References:** [PRD-14]; [PRD-28]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### DF-03 — Set or Change Target Amount

- **Behavior ID:** DF-03
- **Behavior Name:** Set or Change Target Amount
- **Behavior Status:** Confirmed Rule with Open Detail
- **Business Intent:** Express an optional goal without changing the Fund's actual allocated money.
- **Primary Actor or Trigger:** Owner proposes adding, changing, or removing Target Amount.
- **Required Domain References:** Dedicated Fund; optional Target Amount; allocation history.
- **Preconditions:** Fund exists; proposed numeric target is positive whole Rupiah if present.
- **Evaluated State and History:** Current target, Fund Balance, and whether allocation history exists.
- **Accepted Effects:** Confirmed creation-time target may be set; later change/removal is accepted only once open rules are approved.
- **Derived Values Affected:** Progress amount/ratio presentations, never Fund Balance.
- **Local Invariants:** Target never caps allocation or spending and never changes Fund Balance.
- **Cross-Boundary Invariants:** Workspace reports may read target-derived progress.
- **Candidate Boundaries Involved:** Dedicated Fund candidate; reporting readers.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Later allocations alter progress against the current target.
- **Rejection Conditions:** Invalid numeric target; later-history cases remain undecided.
- **Traceability Requirements:** Target and actual Fund Balance remain separately explainable.
- **Lifecycle and Correction Interaction:** Archive/restore does not itself change target.
- **Protected Open Questions:** Whether change/removal is allowed after allocation history and whether target date ships remain open.
- **Source References:** [PRD-14]; [PRD-28]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### DF-04 — Archive Dedicated Fund

- **Behavior ID:** DF-04
- **Behavior Name:** Archive Dedicated Fund
- **Behavior Status:** Confirmed Rule with Open Detail
- **Business Intent:** Stop new use of a Fund while preserving its purpose and history.
- **Primary Actor or Trigger:** Owner proposes Fund archival.
- **Required Domain References:** Dedicated Fund; Fund Balance; referencing events.
- **Preconditions:** Fund exists and is active; history is inspected.
- **Evaluated State and History:** Current Fund Balance, Account-backed allocations, and references.
- **Accepted Effects:** Zero-balance archival is specifiable; exact non-zero-balance behavior awaits product decision; history is always preserved.
- **Derived Values Affected:** Active choices and fund summaries.
- **Local Invariants:** Archival never silently releases, spends, deletes, or zeroes allocations.
- **Cross-Boundary Invariants:** Account-backed allocations and historical event references must remain coherent.
- **Candidate Boundaries Involved:** Dedicated Fund, Account, Financial Event candidates and readers.
- **Earliest Recalculation Point:** None unless a separately confirmed financial change occurs; archival itself has none.
- **Later State Requiring Reevaluation:** Historical reports and any continuing non-zero balance presentation.
- **Rejection Conditions:** Invalid lifecycle state; non-zero case cannot be silently resolved.
- **Traceability Requirements:** Remaining balance and dependencies are explainable.
- **Lifecycle and Correction Interaction:** DF-05 restoration is open; DF-06 is stricter.
- **Protected Open Questions:** Whether non-zero archival is blocked or confirmed remains open.
- **Source References:** [PRD-14]; [PRD-28]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### DF-05 — Restore Dedicated Fund

- **Behavior ID:** DF-05
- **Behavior Name:** Restore Dedicated Fund
- **Behavior Status:** Still Open
- **Business Intent:** Potentially return an archived Fund to active use.
- **Primary Actor or Trigger:** Owner proposes restoration.
- **Required Domain References:** Dedicated Fund; archived state; preserved allocations.
- **Preconditions:** No v1 restoration rule is approved.
- **Evaluated State and History:** Archived Fund state, balance, and history would need evaluation.
- **Accepted Effects:** No accepted effect is established.
- **Derived Values Affected:** Potential active choices.
- **Local Invariants:** Any future rule must preserve allocations and history.
- **Cross-Boundary Invariants:** Account-backed allocation validity would remain cross-boundary.
- **Candidate Boundaries Involved:** Dedicated Fund, Account, Financial Event candidates.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Existing and future fund activity.
- **Rejection Conditions:** Not finalized.
- **Traceability Requirements:** Any future restore must retain identity and sources.
- **Lifecycle and Correction Interaction:** No rule approved.
- **Protected Open Questions:** Availability and eligibility remain open.
- **Source References:** [PRD-14]; [PRD-28]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### DF-06 — Permanently Delete Dedicated Fund

- **Behavior ID:** DF-06
- **Behavior Name:** Permanently Delete Dedicated Fund
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Remove only a Fund that has no balance or financial history.
- **Primary Actor or Trigger:** Owner requests permanent deletion.
- **Required Domain References:** Dedicated Fund; Fund Balance; event/dependency history.
- **Preconditions:** Fund exists; Fund Balance is Rp0; no Financial Event or dependency ever referenced it.
- **Evaluated State and History:** Complete Fund and Account-backed allocation history.
- **Accepted Effects:** Eligible Fund ceases to exist.
- **Derived Values Affected:** Fund choices only.
- **Local Invariants:** Deletion cannot erase allocation history or non-zero value.
- **Cross-Boundary Invariants:** All referring Financial Event and Account-backed allocation dependencies are absent.
- **Candidate Boundaries Involved:** Dedicated Fund, Account, Financial Event candidates.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** No later state exists after accepted deletion.
- **Rejection Conditions:** Non-zero balance, any history/dependency, or invalid lifecycle state.
- **Traceability Requirements:** Blocking balance/dependencies are explainable.
- **Lifecycle and Correction Interaction:** Archive is the non-destructive alternative.
- **Protected Open Questions:** No persistence-retention decision is made.
- **Source References:** [PRD-14]; [UL-Delete]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

## 16. Debt Record Behaviors

### DB-01 — Establish Opening Debt Record

- **Behavior ID:** DB-01
- **Behavior Name:** Establish Opening Debt Record
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Represent an existing liability starting point without inventing borrowing history.
- **Primary Actor or Trigger:** Owner establishes a Debt Record.
- **Required Domain References:** Debt Record; Opening Outstanding Principal; Debt Effective Date.
- **Preconditions:** Whole-Rupiah principal > Rp0; effective date supplied; workspace exists.
- **Evaluated State and History:** No prior repayment history for this Debt Record.
- **Accepted Effects:** Debt begins with Outstanding Principal equal to opening principal; no Financial Event is created.
- **Derived Values Affected:** Outstanding Principal; workspace debt total.
- **Local Invariants:** Opening and current principal remain non-negative.
- **Cross-Boundary Invariants:** Workspace scope and later repayment date/reference validity span candidates.
- **Candidate Boundaries Involved:** Debt Record candidate; Workspace candidate.
- **Earliest Recalculation Point:** None for establishment; the Debt Effective Date becomes the baseline for any later DB-02 or DB-03 correction.
- **Later State Requiring Reevaluation:** Establishment has no existing repayment history to recalculate; later Debt Repayments derive from the baseline, and later DB-02/DB-03 corrections may reevaluate affected history from it.
- **Rejection Conditions:** Non-positive/fractional principal, missing date, or invalid workspace reference.
- **Traceability Requirements:** Debt explanation identifies opening source separately from repayments.
- **Lifecycle and Correction Interaction:** Establishment creates the debt opening baseline and does not recalculate existing repayment history; later corrections use DB-02/03 and deletion uses DB-04.
- **Protected Open Questions:** Creditor field and explicit-vs-derived status remain open.
- **Source References:** [PRD-15]; [UL-DebtRecord]; [AGG-8]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### DB-02 — Correct Opening Outstanding Principal

- **Behavior ID:** DB-02
- **Behavior Name:** Correct Opening Outstanding Principal
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Correct a debt starting amount while preserving repayment history.
- **Primary Actor or Trigger:** Owner proposes a new Opening Outstanding Principal.
- **Required Domain References:** Debt Record; all Debt Repayment Financial Events.
- **Preconditions:** Debt exists; proposed principal > Rp0; Impact Preview and recalculation available.
- **Evaluated State and History:** Opening state and every later repayment position.
- **Accepted Effects:** On confirmation, opening principal changes and repayments recalculate; events remain.
- **Derived Values Affected:** Outstanding Principal and workspace debt totals.
- **Local Invariants:** Principal may never become negative at any point.
- **Cross-Boundary Invariants:** Repayment histories and reports must remain consistent.
- **Candidate Boundaries Involved:** Debt Record, Financial Event, Account, Workspace/reporting candidates.
- **Earliest Recalculation Point:** Debt Effective Date.
- **Later State Requiring Reevaluation:** Every later Debt Repayment and derived debt total.
- **Rejection Conditions:** Any repayment sequence would exceed principal or other confirmed invariant.
- **Traceability Requirements:** Preview identifies affected repayments and resulting principal path.
- **Lifecycle and Correction Interaction:** No repayment is deleted or excluded.
- **Protected Open Questions:** Exact high-impact threshold/reason requirement remains open.
- **Source References:** [PRD-15]; [PRD-16]; [AGG-13]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### DB-03 — Correct Debt Effective Date

- **Behavior ID:** DB-03
- **Behavior Name:** Correct Debt Effective Date
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Correct when an opening debt state begins without rewriting repayment history.
- **Primary Actor or Trigger:** Owner proposes a new Debt Effective Date.
- **Required Domain References:** Debt Record; proposed date; all referencing Debt Repayment events.
- **Preconditions:** Debt exists; Impact Preview and Chronological Recalculation are available.
- **Evaluated State and History:** Existing Debt Repayment Financial Events are identified as remaining valid, becoming valid, or becoming invalid relative to proposed date.
- **Accepted Effects:** Date changes only if all confirmed date and principal invariants remain valid; existing repayments stay in history.
- **Derived Values Affected:** Outstanding Principal chronology and reports.
- **Local Invariants:** Debt Record provides its effective-date constraint and protects non-negative Outstanding Principal throughout recalculated history; it does not own Event Date.
- **Cross-Boundary Invariants:** Complete rule is cross-boundary because Debt Repayment Event Date belongs to Financial Event and must be on/after proposed Debt Effective Date.
- **Candidate Boundaries Involved:** Debt Record and Financial Event candidates; Account and reporting readers.
- **Earliest Recalculation Point:** Earlier of old/proposed effective dates.
- **Later State Requiring Reevaluation:** Every repayment and later derived debt state.
- **Rejection Conditions:** Blocked if any confirmed date, principal, or financial invariant cannot remain valid.
- **Traceability Requirements:** Preview identifies affected repayments and validity changes.
- **Lifecycle and Correction Interaction:** No existing repayment is silently removed or excluded.
- **Protected Open Questions:** Exact coordination and confirmation threshold remain open.
- **Source References:** [PRD-15]; [PRD-16]; [PRD-28]; [AGG-13]; [AGG-14]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### DB-04 — Permanently Delete Debt Record

- **Behavior ID:** DB-04
- **Behavior Name:** Permanently Delete Debt Record
- **Behavior Status:** Candidate Behavior
- **Business Intent:** Remove a Debt Record only when doing so cannot erase financial meaning.
- **Primary Actor or Trigger:** Owner requests permanent deletion.
- **Required Domain References:** Debt Record; opening principal; repayment/dependency history.
- **Preconditions:** Confirmed minimum: no Debt Repayment references; complete eligibility is not approved.
- **Evaluated State and History:** Entire Debt Record history and dependencies.
- **Accepted Effects:** Deletion is only a candidate outcome after all eligibility rules are approved.
- **Derived Values Affected:** Workspace debt totals and lists.
- **Local Invariants:** Deletion must never orphan or erase repayment history.
- **Cross-Boundary Invariants:** All Financial Event references must be absent.
- **Candidate Boundaries Involved:** Debt Record, Financial Event, Workspace candidates.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** No later state after accepted deletion.
- **Rejection Conditions:** Any repayment reference blocks; additional blockers remain open.
- **Traceability Requirements:** Blocking dependencies must be explainable.
- **Lifecycle and Correction Interaction:** No archive/restore behavior is introduced for Debt Record.
- **Protected Open Questions:** Whether zero/current/ opening principal and non-repayment dependencies affect eligibility remains open.
- **Source References:** [PRD-15]; [PRD-28]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

## 17. Debt Repayment Behaviors

### DR-01 — Record Debt Repayment

- **Behavior ID:** DR-01
- **Behavior Name:** Record Debt Repayment
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Represent cash leaving one Account and reducing one Debt Record.
- **Primary Actor or Trigger:** Owner records a Debt Repayment.
- **Required Domain References:** Financial Event; Amount; Event Date; Account; Debt Record.
- **Preconditions:** Active Account and Debt; Amount > Rp0; Event Date valid against both effective dates; sufficient Account total and Unallocated Amount; sufficient Outstanding Principal.
- **Evaluated State and History:** Account and Debt repayment histories through the event position.
- **Accepted Effects:** Account total and Unallocated Amount decrease; Outstanding Principal decreases; principal repayment is not Expense, while any interest, fee, or penalty is represented separately as an Expense Financial Event.
- **Derived Values Affected:** Account balances; Outstanding Principal; workspace/report totals.
- **Local Invariants:** No Account value or principal becomes negative.
- **Cross-Boundary Invariants:** Account and Debt date constraints, references, and synchronized cash/debt effects span candidates.
- **Candidate Boundaries Involved:** Financial Event, Account, Debt Record, Workspace/reporting candidates.
- **Earliest Recalculation Point:** Event Date.
- **Later State Requiring Reevaluation:** Later Account events, later repayments, and reports.
- **Rejection Conditions:** Insufficient Account unallocated/total or principal; invalid Account/Debt date/reference.
- **Traceability Requirements:** One event explains both cash and liability effects and non-expense classification.
- **Lifecycle and Correction Interaction:** Correction/delete/restore recalculates both histories.
- **Protected Open Questions:** Overpayment policy beyond v1 and same-date ordering remain open.
- **Source References:** [PRD-11]; [PRD-15]; [UL-DebtRepayment]; [DCM-Debt]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### DR-02 — Correct Debt Repayment

- **Behavior ID:** DR-02
- **Behavior Name:** Correct Debt Repayment
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Correct repayment facts while preserving linked cash and principal histories.
- **Primary Actor or Trigger:** Owner proposes Same-Type Edit.
- **Required Domain References:** Existing repayment; proposed amount/date/Account/Debt.
- **Preconditions:** Active event; old/proposed references and chronological histories available.
- **Evaluated State and History:** Old effect reversed; proposed effect evaluated across Account and Debt timelines.
- **Accepted Effects:** Identity preserved; both cash and principal effects reapply if valid.
- **Derived Values Affected:** Account balances; principal; workspace/report totals.
- **Local Invariants:** No Account value or principal may become negative.
- **Cross-Boundary Invariants:** All old/new Account and Debt dates/references plus later state remain valid.
- **Candidate Boundaries Involved:** Financial Event, affected Account and Debt Record candidates.
- **Earliest Recalculation Point:** Earliest old/new Event Date.
- **Later State Requiring Reevaluation:** Later Account events and repayments on old/new references.
- **Rejection Conditions:** Any insufficient cash/principal, invalid date/reference, or later invalidity.
- **Traceability Requirements:** Preview explains both histories and before/after effect.
- **Lifecycle and Correction Interaction:** Type change is replacement; lifecycle uses DR-03/LC rules.
- **Protected Open Questions:** Preview threshold and deterministic ordering remain open.
- **Source References:** [PRD-16]; [AGG-13]; [UL-Correction]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### DR-03 — Delete or Restore Debt Repayment

- **Behavior ID:** DR-03
- **Behavior Name:** Delete or Restore Debt Repayment
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Reverse or reapply a repayment non-destructively.
- **Primary Actor or Trigger:** Owner soft-deletes or restores a repayment.
- **Required Domain References:** Debt Repayment; Trash state; Account and Debt histories.
- **Preconditions:** Event is in required lifecycle state.
- **Evaluated State and History:** Both histories from repayment Event Date.
- **Accepted Effects:** Delete restores Account cash and principal; restore reapplies reductions only if valid.
- **Derived Values Affected:** Account balances; Outstanding Principal; reports.
- **Local Invariants:** Complete two-sided reversal/reapplication; values stay non-negative.
- **Cross-Boundary Invariants:** Restoration revalidates Account/Debt dates and both chronological histories.
- **Candidate Boundaries Involved:** Financial Event, Account, Debt Record candidates and readers.
- **Earliest Recalculation Point:** Repayment Event Date.
- **Later State Requiring Reevaluation:** Later Account events and Debt Repayments.
- **Rejection Conditions:** Restore blocked if current cash, principal, date, or reference invariants fail.
- **Traceability Requirements:** Trash/detail explains both sides and result.
- **Lifecycle and Correction Interaction:** Permanent deletion remains LC-03.
- **Protected Open Questions:** Trash retention/permanent deletion remain open.
- **Source References:** [PRD-16]; [UL-Trash]; [DCM-Debt]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

## 18. Correction and Replacement Behaviors

### CR-01 — Same-Type Edit Financial Event

- **Behavior ID:** CR-01
- **Behavior Name:** Same-Type Edit Financial Event
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Correct editable facts while retaining the event's identity and type.
- **Primary Actor or Trigger:** Owner proposes an edit that does not change Event Type.
- **Required Domain References:** Existing Financial Event; old/proposed fields; affected histories.
- **Preconditions:** Event exists and is active; proposed type is unchanged; required references/history are available.
- **Evaluated State and History:** Old effects, proposed effects, and all later affected state from earliest point.
- **Accepted Effects:** Old effects reverse, proposed effects apply, identity remains; accepted only when all invariants hold.
- **Derived Values Affected:** All values affected by old/new forms.
- **Local Invariants:** Event-specific local rules remain true.
- **Cross-Boundary Invariants:** Every affected candidate boundary revalidates dates, references, and later state.
- **Candidate Boundaries Involved:** Financial Event plus all old/new referenced candidates and readers.
- **Earliest Recalculation Point:** Earliest old/new Event Date.
- **Later State Requiring Reevaluation:** All later state touched by either version.
- **Rejection Conditions:** Any proposed or later invariant failure.
- **Traceability Requirements:** Before/after facts, identity, and impacted records remain traceable.
- **Lifecycle and Correction Interaction:** Deleted events restore before edit; type change uses CR-02.
- **Protected Open Questions:** Which Expense-form transitions count as same-type remains open.
- **Source References:** [PRD-16]; [UL-SameTypeEdit]; [AGG-13]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### CR-02 — Replace Financial Event with Different Event Type

- **Behavior ID:** CR-02
- **Behavior Name:** Replace Financial Event with Different Event Type
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Correct a misclassified event without pretending it was always the new type.
- **Primary Actor or Trigger:** Owner confirms a type-changing correction.
- **Required Domain References:** Original Financial Event; proposed replacement type and facts.
- **Preconditions:** Original exists; proposed event independently satisfies its rules; impact can be evaluated.
- **Evaluated State and History:** Original effects, proposed effects, and all affected histories.
- **Accepted Effects:** Original is non-destructively replaced by a distinct event identity linked for traceability; old effects reverse and new effects apply.
- **Derived Values Affected:** All values affected by both types.
- **Local Invariants:** Each event form satisfies its own local rules.
- **Cross-Boundary Invariants:** All referenced candidate boundaries remain valid after replacement.
- **Candidate Boundaries Involved:** Financial Event and all old/new referenced candidates and readers.
- **Earliest Recalculation Point:** Earliest original/replacement Event Date.
- **Later State Requiring Reevaluation:** All later affected state.
- **Rejection Conditions:** Proposed replacement or later state violates any invariant.
- **Traceability Requirements:** Original, replacement, link, reasons if required, and before/after effects remain explainable.
- **Lifecycle and Correction Interaction:** Original is not silently overwritten or erased.
- **Protected Open Questions:** Ordinary-history placement and reason requirement remain open.
- **Source References:** [PRD-16]; [UL-EventReplacement]; [AGG-13]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### CR-03 — Preview Correction Impact

- **Behavior ID:** CR-03
- **Behavior Name:** Preview Correction Impact
- **Behavior Status:** Confirmed Rule with Open Detail
- **Business Intent:** Let the owner understand chronological consequences before a material correction is confirmed.
- **Primary Actor or Trigger:** Correction proposal reaches a rule requiring preview.
- **Required Domain References:** Proposed correction; affected records; derived values.
- **Preconditions:** Affected scope and earliest recalculation point can be identified.
- **Evaluated State and History:** Old/proposed state and every later affected record.
- **Accepted Effects:** Preview reports affected records, values, and validity without changing confirmed state.
- **Derived Values Affected:** Projected balances, allocations, principal, totals, and validity.
- **Local Invariants:** Projection uses the same invariants as confirmation.
- **Cross-Boundary Invariants:** All candidate boundaries involved in the correction contribute constraints.
- **Candidate Boundaries Involved:** All affected candidate boundaries.
- **Earliest Recalculation Point:** Proposal-specific earliest point.
- **Later State Requiring Reevaluation:** Every later affected state.
- **Rejection Conditions:** Preview itself rejects only an unevaluable proposal; confirmation is blocked by projected invariant failure.
- **Traceability Requirements:** Projected sources and reasons are understandable.
- **Lifecycle and Correction Interaction:** Preview never deletes, excludes, or mutates history.
- **Protected Open Questions:** Exact threshold, presentation, confirmation wording, and reason requirement remain open.
- **Source References:** [PRD-16]; [PRD-28]; [AGG-13]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

## 19. Deletion, Trash, Restoration, and Archival Behaviors

### LC-01 — Soft Delete Financial Event

- **Behavior ID:** LC-01
- **Behavior Name:** Soft Delete Financial Event
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Remove an event's active financial effect while retaining a recoverable record.
- **Primary Actor or Trigger:** Owner sends an active Financial Event to Trash.
- **Required Domain References:** Financial Event; current lifecycle; affected histories.
- **Preconditions:** Event exists, is active, and its reversal can be evaluated.
- **Evaluated State and History:** Event effect and all later affected state.
- **Accepted Effects:** Event becomes trashed; complete effect reverses chronologically; source record remains.
- **Derived Values Affected:** All event-derived balances/totals.
- **Local Invariants:** Reversal is complete and preserves non-negative invariants.
- **Cross-Boundary Invariants:** Every affected candidate boundary and report becomes consistent with the reversal.
- **Candidate Boundaries Involved:** Financial Event and all referenced candidates/readers.
- **Earliest Recalculation Point:** Event Date.
- **Later State Requiring Reevaluation:** All later affected state.
- **Rejection Conditions:** Invalid lifecycle state or inability to preserve a confirmed invariant.
- **Traceability Requirements:** Trash retains original facts, effect, and reversal explanation.
- **Lifecycle and Correction Interaction:** LC-02 may restore; LC-03 permanent deletion is open.
- **Protected Open Questions:** Exact Trash retention remains open.
- **Source References:** [PRD-16]; [UL-SoftDelete]; [AGG-13]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### LC-02 — Restore Financial Event

- **Behavior ID:** LC-02
- **Behavior Name:** Restore Financial Event
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Reapply a trashed event only when today's confirmed history can support it.
- **Primary Actor or Trigger:** Owner restores a trashed Financial Event.
- **Required Domain References:** Trashed event; current references and chronological histories.
- **Preconditions:** Event is trashed; references and full affected history are available.
- **Evaluated State and History:** Current state from Event Date, not merely state at deletion time.
- **Accepted Effects:** Same identity becomes active and full effect reapplies if valid.
- **Derived Values Affected:** All event-derived balances/totals.
- **Local Invariants:** Event-specific local rules hold.
- **Cross-Boundary Invariants:** All current cross-boundary date, reference, and later-state invariants hold.
- **Candidate Boundaries Involved:** Financial Event and all referenced candidates/readers.
- **Earliest Recalculation Point:** Event Date.
- **Later State Requiring Reevaluation:** All later affected state.
- **Rejection Conditions:** Any archived/deleted invalid reference, insufficient value, date invalidity, or later invariant failure.
- **Traceability Requirements:** Restoration result and blocking reason are explainable.
- **Lifecycle and Correction Interaction:** No duplicate event is created; history remains present when blocked.
- **Protected Open Questions:** Whether some archived references can support restoration needs detailed lifecycle rules.
- **Source References:** [PRD-16]; [UL-Restore]; [AGG-13]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### LC-03 — Permanently Delete Trashed Financial Event

- **Behavior ID:** LC-03
- **Behavior Name:** Permanently Delete Trashed Financial Event
- **Behavior Status:** Still Open
- **Business Intent:** Potentially remove a trashed event after any required retention.
- **Primary Actor or Trigger:** Owner requests permanent deletion from Trash.
- **Required Domain References:** Trashed Financial Event; retention/dependency policy.
- **Preconditions:** No approved v1 availability or eligibility rule.
- **Evaluated State and History:** Complete event, correction, replacement, and traceability history would need evaluation.
- **Accepted Effects:** No accepted effect is established.
- **Derived Values Affected:** Potential audit/traceability records.
- **Local Invariants:** Any future rule must not break explanation or linked replacements.
- **Cross-Boundary Invariants:** All referenced candidates and required traceability would need protection.
- **Candidate Boundaries Involved:** Financial Event and all readers.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Linked corrections/replacements and supporting explanations.
- **Rejection Conditions:** Not finalized.
- **Traceability Requirements:** A future decision must protect required traceability.
- **Lifecycle and Correction Interaction:** Soft deletion remains the confirmed v1 correction path.
- **Protected Open Questions:** Availability, retention, and eligibility remain open.
- **Source References:** [PRD-16]; [PRD-28]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### LC-04 — Archive Domain Reference

- **Behavior ID:** LC-04
- **Behavior Name:** Archive Domain Reference
- **Behavior Status:** Confirmed Rule with Open Detail
- **Business Intent:** Make an Account, Category, or Dedicated Fund unavailable for new use while preserving history.
- **Primary Actor or Trigger:** Owner proposes archival of a supported reference.
- **Required Domain References:** Reference; lifecycle; balances/history/dependencies.
- **Preconditions:** Type-specific archival preconditions apply.
- **Evaluated State and History:** Complete relevant balance and dependency state.
- **Accepted Effects:** Reference becomes inactive for new use; history remains; Account zero-balance rule applies; Fund non-zero rule is open.
- **Derived Values Affected:** Active choices and historical presentations.
- **Local Invariants:** Archival never rewrites financial facts.
- **Cross-Boundary Invariants:** Historical references and cross-view consistency remain valid.
- **Candidate Boundaries Involved:** Relevant reference candidate plus Financial Event/readers.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Historical reports and restoration eligibility.
- **Rejection Conditions:** Type-specific blockers, especially non-zero Account and unresolved Fund case.
- **Traceability Requirements:** Balance and dependencies are explainable.
- **Lifecycle and Correction Interaction:** Uses AC-03, CT-03, or DF-04; no generic implementation abstraction is implied.
- **Protected Open Questions:** Fund non-zero archival and some reporting treatment remain open.
- **Source References:** [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### LC-05 — Restore Archived Domain Reference

- **Behavior ID:** LC-05
- **Behavior Name:** Restore Archived Domain Reference
- **Behavior Status:** Confirmed Rule with Open Detail
- **Business Intent:** Return a supported archived reference without recreating it.
- **Primary Actor or Trigger:** Owner proposes restoration.
- **Required Domain References:** Archived Account, Category, or Dedicated Fund.
- **Preconditions:** Type-specific restore rule exists; Fund restore remains open.
- **Evaluated State and History:** Preserved identity, history, balances, and dependencies.
- **Accepted Effects:** Account/Category may return active unchanged; no Fund outcome is approved.
- **Derived Values Affected:** Active choices.
- **Local Invariants:** Restore changes no financial history by itself.
- **Cross-Boundary Invariants:** Workspace scope and historical references remain valid.
- **Candidate Boundaries Involved:** Relevant reference candidate plus readers.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Future reference eligibility.
- **Rejection Conditions:** Wrong lifecycle/deleted state; Fund rule unresolved.
- **Traceability Requirements:** Same identity and preserved dependencies remain traceable.
- **Lifecycle and Correction Interaction:** Uses AC-04, CT-04, or protected DF-05.
- **Protected Open Questions:** Dedicated Fund restoration remains open.
- **Source References:** [PRD-12]; [PRD-13]; [PRD-14]; [PRD-28]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

## 20. Reporting Period Behaviors

### RP-01 — Use Calendar Month

- **Behavior ID:** RP-01
- **Behavior Name:** Use Calendar Month
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Group Event Dates into ordinary calendar months.
- **Primary Actor or Trigger:** Active Reporting Period Configuration is Calendar Month.
- **Required Domain References:** Reporting configuration; Event Date; Asia/Jakarta timezone.
- **Preconditions:** Workspace configuration exists and Calendar Month is active.
- **Evaluated State and History:** Event Dates only; created/updated timestamps are irrelevant.
- **Accepted Effects:** Each active event belongs deterministically to the calendar month containing its Event Date; this defines reporting membership and performs no financial Chronological Recalculation.
- **Derived Values Affected:** Period income, expense, allocations, balances, comparisons.
- **Local Invariants:** One active rule; exact displayed date range.
- **Cross-Boundary Invariants:** Every report/view uses identical membership and workspace timezone.
- **Candidate Boundaries Involved:** Reporting configuration, Financial Event, Workspace/reporting readers.
- **Earliest Recalculation Point:** None; RP-01 defines reporting membership and performs no financial Chronological Recalculation.
- **Later State Requiring Reevaluation:** Reports change as events are added/corrected; financial effects do not depend on grouping.
- **Rejection Conditions:** Missing/contradictory configuration or non-deterministic membership.
- **Traceability Requirements:** Every period shows exact range and supporting events.
- **Lifecycle and Correction Interaction:** Changing mode uses RP-03; events are never rewritten.
- **Protected Open Questions:** No protected domain question.
- **Source References:** [PRD-17]; [UL-ReportingPeriod]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### RP-02 — Use Custom Monthly Cycle

- **Behavior ID:** RP-02
- **Behavior Name:** Use Custom Monthly Cycle
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Group Event Dates by one recurring start day suited to the owner.
- **Primary Actor or Trigger:** Active configuration is Custom Monthly Cycle.
- **Required Domain References:** Reporting configuration; start day; Event Date; Asia/Jakarta timezone.
- **Preconditions:** One start day from 1 through 28 is active.
- **Evaluated State and History:** Event Dates and cycle boundaries.
- **Accepted Effects:** Each event belongs deterministically to exactly one custom cycle and its exact range is derived; this performs no financial Chronological Recalculation.
- **Derived Values Affected:** Period totals/comparisons and current period.
- **Local Invariants:** Start day is 1–28; one active rule; no gaps/overlaps.
- **Cross-Boundary Invariants:** All reports use the same membership and timezone.
- **Candidate Boundaries Involved:** Reporting configuration, Financial Event, Workspace/reporting readers.
- **Earliest Recalculation Point:** None; RP-02 defines reporting membership and performs no financial Chronological Recalculation.
- **Later State Requiring Reevaluation:** New/corrected Event Dates change membership deterministically.
- **Rejection Conditions:** Start day outside 1–28 or ambiguous membership.
- **Traceability Requirements:** Exact ranges and supporting events are visible.
- **Lifecycle and Correction Interaction:** Changing configuration uses RP-03.
- **Protected Open Questions:** One-off ranges are open and not part of this behavior.
- **Source References:** [PRD-17]; [PRD-28]; [UL-ReportingPeriod]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### RP-03 — Change Reporting Period Configuration

- **Behavior ID:** RP-03
- **Behavior Name:** Change Reporting Period Configuration
- **Behavior Status:** Confirmed Rule with Open Detail
- **Business Intent:** Regroup historical reporting without changing financial facts.
- **Primary Actor or Trigger:** Owner proposes switching mode or custom start day.
- **Required Domain References:** Current/proposed configuration; all active Event Dates.
- **Preconditions:** Proposed mode/start day valid; Impact Preview and recalculation of reporting membership and derived reporting totals are available.
- **Evaluated State and History:** All active Financial Events and old/proposed period memberships.
- **Accepted Effects:** On confirmation, reporting membership, derived reporting totals, exact ranges, comparisons, and Incomplete Period flags recalculate; Financial Event facts, Event Dates, Account balances, Fund allocations, Dedicated Fund Balance, and Outstanding Principal remain unchanged and present.
- **Derived Values Affected:** All period totals, comparisons, dashboard/report groupings, exact date ranges, and Incomplete Period flags.
- **Local Invariants:** One valid active configuration; no event mutation; periods with incomplete tracking history remain explicitly flagged.
- **Cross-Boundary Invariants:** Every reporting consumer agrees on proposed membership.
- **Candidate Boundaries Involved:** Reporting configuration, Financial Event, Workspace/reporting readers.
- **Earliest Recalculation Point:** Earliest reporting-period boundary affected by old/new configuration; only reporting membership and derived reporting totals recalculate.
- **Later State Requiring Reevaluation:** All events whose membership or comparative totals change.
- **Rejection Conditions:** Invalid start day, ambiguous grouping, or inability to keep reports consistent.
- **Traceability Requirements:** Preview shows changed ranges/memberships/totals and sources.
- **Lifecycle and Correction Interaction:** No Financial Event is silently removed or excluded from history.
- **Protected Open Questions:** Immediate-vs-next-session timing and exact preview threshold remain open.
- **Source References:** [PRD-17]; [PRD-28]; [AGG-13]
- **Explicit Non-Decisions:** No financial write boundary, implementation transaction, API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

## 21. Chronological Recalculation Behavior

### RC-01 — Recalculate Chronologically Affected State

- **Behavior ID:** RC-01
- **Behavior Name:** Recalculate Chronologically Affected State
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Restore deterministic truth after a backdated or corrective change.
- **Primary Actor or Trigger:** Backdated creation; Same-Type Edit; Event Replacement; Soft Deletion; Restoration; Opening Balance or Account effective-date correction; Opening Outstanding Principal or Debt effective-date correction.
- **Required Domain References:** Changed source; affected histories; same-date ordering rule.
- **Preconditions:** Affected scope is known; confirmed source facts are available.
- **Evaluated State and History:** Every affected state transition from earliest point through latest dependent state.
- **Accepted Effects:** Only affected histories are recomputed in chronological order; unaffected histories remain unchanged, and this scope does not imply one giant Workspace Aggregate.
- **Derived Values Affected:** Account balances, allocations, Fund Balance, principal, workspace/report totals.
- **Local Invariants:** Every local invariant holds at every point.
- **Cross-Boundary Invariants:** All participating candidate boundaries agree on references, dates, and effects.
- **Candidate Boundaries Involved:** All candidates touched by the initiating behavior.
- **Earliest Recalculation Point:** Earliest changed effective date/Event Date/configuration boundary.
- **Later State Requiring Reevaluation:** Every later affected state and dependent view.
- **Rejection Conditions:** Any point violates a confirmed invariant or ordering is not deterministic.
- **Traceability Requirements:** Recalculation exposes source, sequence, affected values, and rejection point.
- **Lifecycle and Correction Interaction:** It never silently drops, excludes, or rewrites confirmed Financial Events.
- **Protected Open Questions:** Deterministic same-date ordering and exact coordination responsibility remain open.
- **Source References:** [PRD-16]; [PRD-19]; [UL-ChronologicalRecalculation]; [AGG-13]
- **Explicit Non-Decisions:** This behavior selects no event-sourcing, replay, API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism.

## 22. Traceability and Supporting-Record Behaviors

### TC-01 — Explain Derived Account Values

- **Behavior ID:** TC-01
- **Behavior Name:** Explain Derived Account Values
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Let the owner trace Account total and Unallocated Amount to opening state and events.
- **Primary Actor or Trigger:** Owner inspects an Account-derived value.
- **Required Domain References:** Account opening state; active Account-affecting events; allocations.
- **Preconditions:** Owner-scoped Account exists.
- **Evaluated State and History:** Complete chronological supporting history.
- **Accepted Effects:** Explanation presents formula, components, and supporting records; no financial state changes.
- **Derived Values Affected:** Total Account Balance; Unallocated Amount; allocation decomposition.
- **Local Invariants:** Explained values equal confirmed derived state.
- **Cross-Boundary Invariants:** Event, Fund, and workspace readers agree.
- **Candidate Boundaries Involved:** Account, Financial Event, Dedicated Fund, Workspace/reporting candidates.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Explanation updates whenever source state changes.
- **Rejection Conditions:** Missing source, inconsistent total, or cross-view disagreement.
- **Traceability Requirements:** Source records are navigable/identifiable at domain level.
- **Lifecycle and Correction Interaction:** Trash/replacements are represented according to active effect without erasing history.
- **Protected Open Questions:** Exact UI presentation is not decided.
- **Source References:** [PRD-19]; [PI-5]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### TC-02 — Explain Dedicated Fund Balance and Account Breakdown

- **Behavior ID:** TC-02
- **Behavior Name:** Explain Dedicated Fund Balance and Account Breakdown
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Show how a Fund is backed across Accounts and events.
- **Primary Actor or Trigger:** Owner inspects Fund Balance.
- **Required Domain References:** Dedicated Fund; per-Account allocations; allocation/release/fund-expense events.
- **Preconditions:** Owner-scoped Fund exists.
- **Evaluated State and History:** Complete active Fund and Account-backed history.
- **Accepted Effects:** Explanation reconciles Fund Balance to Account breakdown and supporting events.
- **Derived Values Affected:** Fund Balance; allocation by Account; target progress if present.
- **Local Invariants:** Fund Balance equals sum of current Account-backed allocations.
- **Cross-Boundary Invariants:** Account and Financial Event views agree with Fund view.
- **Candidate Boundaries Involved:** Dedicated Fund, Account, Financial Event, Workspace/reporting candidates.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Updates after any related event or correction.
- **Rejection Conditions:** Missing provenance, mismatch, or unexplained value.
- **Traceability Requirements:** Each component identifies backing Account and source records.
- **Lifecycle and Correction Interaction:** Archived references retain historical explanation.
- **Protected Open Questions:** Exact visualization is not decided.
- **Source References:** [PRD-14]; [PRD-19]; [PI-5]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### TC-03 — Explain Outstanding Principal

- **Behavior ID:** TC-03
- **Behavior Name:** Explain Outstanding Principal
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Trace remaining debt to opening principal and repayments.
- **Primary Actor or Trigger:** Owner inspects a Debt-derived value.
- **Required Domain References:** Debt opening state; active repayments.
- **Preconditions:** Owner-scoped Debt Record exists.
- **Evaluated State and History:** Complete repayment chronology.
- **Accepted Effects:** Explanation reconciles opening principal minus active repayments.
- **Derived Values Affected:** Outstanding Principal; workspace debt total.
- **Local Invariants:** Explained principal equals non-negative confirmed state.
- **Cross-Boundary Invariants:** Financial Event and workspace/report views agree.
- **Candidate Boundaries Involved:** Debt Record, Financial Event, Account, Workspace/reporting candidates.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Updates after repayment, correction, deletion, restoration, or opening correction.
- **Rejection Conditions:** Missing source, negative/mismatched result, or cross-view disagreement.
- **Traceability Requirements:** Opening state and each repayment are identifiable.
- **Lifecycle and Correction Interaction:** Trashed/replaced repayments remain traceable but only active effects count.
- **Protected Open Questions:** Exact presentation is not decided.
- **Source References:** [PRD-15]; [PRD-19]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### TC-04 — Explain Workspace and Reporting Totals

- **Behavior ID:** TC-04
- **Behavior Name:** Explain Workspace and Reporting Totals
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Reconcile important totals to owner-scoped Accounts and active events.
- **Primary Actor or Trigger:** Owner opens a workspace/report total.
- **Required Domain References:** Workspace; Accounts; active Financial Events; reporting configuration.
- **Preconditions:** Owner scope and one valid reporting configuration.
- **Evaluated State and History:** All included records and exact period membership.
- **Accepted Effects:** Explanation lists formula, exact range, and supporting records.
- **Derived Values Affected:** Workspace balance, income, expense, allocation, debt, and period totals.
- **Local Invariants:** Totals use one confirmed meaning and correct membership.
- **Cross-Boundary Invariants:** Every contributing candidate and view agrees; no other workspace contributes.
- **Candidate Boundaries Involved:** Workspace, reporting configuration, Account, Financial Event, Fund, Debt candidates.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Updates after any contributing source or reporting change.
- **Rejection Conditions:** Missing source, inconsistent membership, or dashboard/detail disagreement.
- **Traceability Requirements:** No dead-end number; exact supporting set is identifiable.
- **Lifecycle and Correction Interaction:** Corrections/lifecycle changes update active contribution while preserving traceability.
- **Protected Open Questions:** Archived-Account inclusion and final comparison metrics remain open.
- **Source References:** [PRD-17]; [PRD-19]; [PRD-28]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

### TC-05 — Explain One Financial Event’s Effects

- **Behavior ID:** TC-05
- **Behavior Name:** Explain One Financial Event’s Effects
- **Behavior Status:** Confirmed Behavior
- **Business Intent:** Show exactly what one event changed and what it did not change.
- **Primary Actor or Trigger:** Owner inspects Financial Event detail.
- **Required Domain References:** Event form; references; active/replaced/trashed state.
- **Preconditions:** Owner-scoped event exists.
- **Evaluated State and History:** Event facts, candidate-boundary effects, lifecycle/correction links.
- **Accepted Effects:** Explanation states complete signed effects and classification consequences.
- **Derived Values Affected:** All values directly affected by that event.
- **Local Invariants:** Explanation matches event-form invariant.
- **Cross-Boundary Invariants:** All referenced candidate views and totals agree.
- **Candidate Boundaries Involved:** Financial Event plus every referenced candidate/readers.
- **Earliest Recalculation Point:** None.
- **Later State Requiring Reevaluation:** Explanation updates with correction/replacement/lifecycle state.
- **Rejection Conditions:** Incomplete effect, missing source, or disagreement with derived views.
- **Traceability Requirements:** Original/replacement and lifecycle links remain available as required.
- **Lifecycle and Correction Interaction:** No change is performed by explanation.
- **Protected Open Questions:** Exact UI wording/layout and prior-value storage remain open.
- **Source References:** [PRD-11]; [PRD-19]; [PI-5]
- **Explicit Non-Decisions:** No API, command, handler, domain event, repository, persistence, UI, messaging, framework, or coordination mechanism is decided.

## 23. Cross-Boundary Behavior Matrix

| Behavior ID | Financial Event | Workspace | Account | Category | Dedicated Fund | Debt Record | Reporting/Derived State | Local or Cross-Boundary | Main Coordination Requirement | Open Detail |
|---|---|---|---|---|---|---|---|---|---|---|
| IN-01 | Owns Income facts and Event Date | Enforces owner scope | Supplies effective date and accepts balance effects | Supplies Income kind | — | — | Recomputes income and balance totals | Cross-boundary | Validate date and kind, then keep event, Account, and reports consistent | Same-date ordering |
| EX-01 | Owns ordinary Expense facts and Event Date | Enforces owner scope | Supplies effective date and sufficient total/unallocated state | Supplies Expense kind | Must be absent | — | Recomputes spending and balance totals | Cross-boundary | Validate date, kind, and Account sufficiency without changing allocations | Expense-form correction classification |
| TR-01–03 | Owns one linked Transfer and Event Date | Enforces common owner scope | Source and destination supply dates and accept two-sided effects | Not applicable | — | — | Workspace total unchanged; composition changes | Cross-boundary | Preserve one all-or-nothing result across both Account histories | Source/destination distinctness and same-date ordering |
| FA-01–02 | Owns Fund Allocation facts and Event Date | Enforces owner scope | Supplies date, unallocated state, and Account-backed allocation | Not applicable | Supplies Fund identity and reconciled balance | — | Recomputes allocation summaries | Cross-boundary | Keep Account decomposition and Fund balance synchronized | Final allocation responsibility |
| FR-01–02 | Owns Fund Release facts and Event Date | Enforces owner scope | Supplies date and selected matching allocation | Not applicable | Supplies Fund identity and reconciled balance | — | Recomputes allocation summaries | Cross-boundary | Release only the selected Account–Fund allocation | Final allocation responsibility |
| FX-01–02 | Owns Expense facts, Event Date, and Fund reference | Enforces owner scope | Supplies date, total, and matching allocation | Supplies Expense kind | Supplies Fund identity and reconciled balance | — | Counts Expense once and updates summaries | Cross-boundary | Consume only the payment Account's matching allocation | Ordinary-versus-fund-linked edit classification |
| DR-01–03 | Owns repayment facts and Event Date | Enforces owner scope | Supplies effective date and cash sufficiency | Not applicable to principal repayment | — | Supplies effective date and principal sufficiency | Recomputes cash, debt, and non-expense summaries | Cross-boundary | Keep Account cash and Debt principal effects synchronized | Same-date ordering; debt status representation |
| CR-01 | Preserves identity and owns old/new event facts | Enforces owner scope | Old/new Account histories participate as referenced | Old/new kind-valid references participate | Old/new Fund histories participate when referenced | Old/new Debt histories participate when referenced | Recomputes every affected derived value | Cross-boundary when references/effects span candidates | Reverse old effect, validate and apply proposed effect from earliest point | Editable-field and Expense-form details |
| CR-02 | Preserves original identity and links distinct replacement identity | Enforces owner scope | Old/new Account histories participate | Old/new Category references participate | Old/new Fund histories participate | Old/new Debt histories participate | Prevents double counting and recomputes reports | Cross-boundary | Reverse original and apply replacement as one traceable correction | Replaced-event visibility and reason requirement |
| LC-01 | Preserves trashed event identity and original facts | Enforces owner scope | Referenced histories accept complete reversal | Historical reference remains | Referenced Fund history accepts reversal | Referenced Debt history accepts reversal | Removes active contribution but preserves traceability | Cross-boundary for multi-candidate effects | Reverse the complete effect and reevaluate all later affected state | Trash retention |
| LC-02 | Preserves trashed identity and proposes reapplication | Enforces owner scope | Current referenced histories must remain valid | Current reference must be eligible | Current Fund history must remain valid | Current Debt history must remain valid | Restores contribution only when all views agree | Cross-boundary | Revalidate current references, dates, sufficiency, and later state | Archived-reference eligibility |
| AC-06–07; DB-02–03 | Existing referencing events remain present | Enforces owner scope | Supplies Account opening amount/date constraint | — | Affected allocation history participates | Supplies Debt opening principal/date constraint | Recomputes affected balances, principal, and totals | Cross-boundary | Preview events becoming valid/invalid and block any invalid confirmed change | Candidate-root participation and preview threshold |
| RP-03 | Event Dates remain unchanged and present | Owns one active reporting policy candidate | Financial state remains unchanged | Classification remains unchanged | Fund state remains unchanged | Debt state remains unchanged | Regroups exact ranges, totals, comparisons, and Incomplete Period flags | Cross-boundary | Give every active event exactly one deterministic new membership | Application timing and final modeling form |

This matrix does not assign a coordinator, service, transaction boundary, or message flow. It exposes where detailed domain behavior specification must establish candidate-root participation and responsibility before final domain approval.

## 24. Failure and Rejection Catalog

| Failure ID | Domain Condition | Affected Behavior IDs | Confirmed or Open | Resulting Domain Outcome | Invariant Protected | Source | Open Detail |
|---|---|---|---|---|---|---|---|
| F-01 | Proposed ordinary spending or allocation exceeds Account Unallocated Amount | EX-01; FA-01; DR-01 and related corrections/restores | Confirmed | Reject; confirmed state is unchanged | Unallocated Amount never negative | [PRD-11]; [PRD-12] | Explain available amount and affected Account |
| F-02 | Fund Release or fund-linked Expense exceeds selected Account's matching Fund allocation | FR-01; FX-01 and related corrections/restores | Confirmed | Reject; do not consume another Account's allocation | Account–Fund allocation never negative | [PRD-14] | No FIFO/LIFO or cross-Account substitution |
| F-03 | Debt Repayment exceeds Outstanding Principal | DR-01 and corrections/restores | Confirmed | Reject; debt state unchanged | Outstanding Principal never negative | [PRD-15] | Future credit/refund policy outside v1 |
| F-04 | Any accepted sequence would make Total Account Balance negative | EX-01; TR-01; FX-01; DR-01; corrections/restores/opening corrections | Confirmed | Reject proposed behavior | Total Account Balance never negative | [PRD-12] | Evaluate every chronological point |
| F-05 | Financial Event Date precedes an effective date of a referenced Account | IN-01; EX-01; TR-01; FA-01; FR-01; FX-01; DR-01 and corrections/restores | Confirmed | Reject until Account date is explicitly and validly corrected | Complete Event Date rule is cross-boundary | [PRD-12]; [AGG-14] | Account supplies constraint; Financial Event owns Event Date |
| F-06 | Debt Repayment Event Date precedes Debt Effective Date | DR-01 and corrections/restores; DB-03 | Confirmed | Reject until Debt date is explicitly and validly corrected | Complete repayment date rule is cross-boundary | [PRD-15]; [AGG-14] | Debt Record supplies constraint; Financial Event owns Event Date |
| F-07 | Category Kind does not match Income or Expense form | IN-01; EX-01; FX-01 and corrections/restores | Confirmed | Reject reference | Category kind validity | [PRD-13] | Kind is not silently changed |
| F-08 | Proposed event uses an archived, deleted, cross-owner, or otherwise ineligible reference | All recording/correction/restoration behaviors | Confirmed with open lifecycle detail | Reject or keep restore blocked | Reference and workspace validity | [PRD-12–16]; [PRD-20] | Archived-reference restore details need specification |
| F-09 | Account archival proposed while Total Account Balance is non-zero | AC-03; LC-04 | Confirmed | Reject archival; explain remaining balance | Only zero-total Account may archive | [PRD-12] | No automatic financial action |
| F-10 | Permanent deletion target has financial history or dependency | AC-05; CT-05; DF-06; DB-04 | Confirmed with open Debt detail | Reject deletion | Financial history/reference integrity | [PRD-12–15] | Debt eligibility beyond repayment blocking remains open |
| F-11 | Restoration would make current or later chronological state invalid | TR-03; DR-03; LC-02 | Confirmed | Keep record trashed; reject reapplication | All current and later invariants | [PRD-16] | Explain first blocking condition and affected history |
| F-12 | Correction would make a current or later chronological state invalid | All correction behaviors | Confirmed | Reject confirmation; preserve prior confirmed state | All chronological invariants | [PRD-16] | Preview identifies invalid point |
| F-13 | Same-date affected events cannot be ordered deterministically | All chronological financial behaviors; RC-01 | Open detail protecting confirmed rule | Do not finalize a result until deterministic evaluation is possible | Reproducible chronological state | [AGG-13] | Ordering mechanism remains open |
| F-14 | Dashboard, detail, report, or traceability result disagrees | TC-01–05; all financial behaviors | Confirmed | Treat result as invalid/release-blocking; reconcile to sources | Cross-view consistency | [PRD-19]; [PI-5] | No view is privileged as a hidden correction source |
| F-15 | Custom Reporting Period start day is outside 1–28 | RP-02; RP-03 | Confirmed | Reject configuration | Valid unambiguous recurring cycle | [PRD-17] | No 29–31 handling invented |
| F-16 | Opening effective-date proposal would make existing Financial Events invalid | AC-07; DB-03 | Confirmed | Block confirmation unless every event and financial invariant remains valid; keep all history | No silent historical exclusion | [PRD-12]; [PRD-15]; [PRD-16] | Preview classifies events becoming valid/invalid |
| F-17 | Reporting change produces ambiguous membership or silently omits an active event | RP-03; TC-04 | Confirmed | Reject confirmation; retain old configuration | Every active event belongs to exactly one period | [PRD-17]; [PRD-19] | Only grouping may change |

Rejection is a domain outcome, not an error code, transport status, message format, or retry policy. Unless a behavior explicitly says otherwise, rejected proposals leave confirmed domain state unchanged.

## 25. Behavior Stress-Test Scenarios

### S-01 — Create Account with Rp0 opening

- **Initial State:** No Account; workspace configured
- **Behavior:** AC-01 with Rp0 and date D
- **Evaluated History:** Opening state only
- **Candidate Boundaries:** Account; Workspace
- **Preconditions:** Amount whole Rupiah; date present
- **Invariant Under Test:** Non-negative opening/decomposition
- **Expected Domain Outcome:** Accept: total=unallocated=Rp0; allocations=0
- **Chronological Recalculation:** From D; no later state yet
- **Traceability Requirement:** Opening source explains all zero values
- **Protected Open Question:** Name uniqueness
- **Source References:** [PRD-12]

### S-02 — Create Account with positive opening

- **Initial State:** No Account
- **Behavior:** AC-01 with Rp1,000,000 at D
- **Evaluated History:** Opening state only
- **Candidate Boundaries:** Account; Workspace
- **Preconditions:** Valid positive amount/date
- **Invariant Under Test:** Opening equals total/unallocated
- **Expected Domain Outcome:** Accept equal positive values
- **Chronological Recalculation:** From D
- **Traceability Requirement:** Opening source shown; no Income invented
- **Protected Open Question:** Name uniqueness
- **Source References:** [PRD-12]

### S-03 — Create Account with negative opening

- **Initial State:** No Account
- **Behavior:** AC-01 with -Rp1
- **Evaluated History:** Opening proposal
- **Candidate Boundaries:** Account
- **Preconditions:** None satisfied for amount
- **Invariant Under Test:** No negative opening/total
- **Expected Domain Outcome:** Reject; no Account established
- **Chronological Recalculation:** None
- **Traceability Requirement:** Reason cites invalid opening amount
- **Protected Open Question:** None
- **Source References:** [PRD-12]

### S-04 — Income on Account effective date

- **Initial State:** Account Rp0 effective D
- **Behavior:** IN-01 Rp100 on D
- **Evaluated History:** Account history through D
- **Candidate Boundaries:** Financial Event; Account; Category
- **Preconditions:** Valid Income Category and amount
- **Invariant Under Test:** Event Date may equal effective date
- **Expected Domain Outcome:** Accept; total/unallocated +Rp100
- **Chronological Recalculation:** From D
- **Traceability Requirement:** Income and both increases explained
- **Protected Open Question:** Same-date ordering
- **Source References:** [PRD-11]; [PRD-12]

### S-05 — Income before Account effective date

- **Initial State:** Account effective D
- **Behavior:** IN-01 on D-1
- **Evaluated History:** Account date constraint and event proposal
- **Candidate Boundaries:** Financial Event; Account; Category
- **Preconditions:** Other facts valid
- **Invariant Under Test:** Event Date not before Account effective date
- **Expected Domain Outcome:** Reject; Account unchanged
- **Chronological Recalculation:** None
- **Traceability Requirement:** Cross-boundary date failure explained
- **Protected Open Question:** Ordering irrelevant
- **Source References:** [PRD-12]

### S-06 — Ordinary Expense within Unallocated Amount

- **Initial State:** Account total/unallocated Rp100
- **Behavior:** EX-01 Rp60
- **Evaluated History:** Account history
- **Candidate Boundaries:** Financial Event; Account; Category
- **Preconditions:** Valid date/Expense Category
- **Invariant Under Test:** Balances remain non-negative
- **Expected Domain Outcome:** Accept; both become Rp40
- **Chronological Recalculation:** From Event Date
- **Traceability Requirement:** Both reductions and spending classification explained
- **Protected Open Question:** Same-date ordering
- **Source References:** [PRD-11]

### S-07 — Ordinary Expense exceeding Unallocated Amount

- **Initial State:** Account total Rp100, unallocated Rp40, allocations Rp60
- **Behavior:** EX-01 Rp50
- **Evaluated History:** Account decomposition
- **Candidate Boundaries:** Financial Event; Account; Category
- **Preconditions:** Total sufficient but unallocated insufficient
- **Invariant Under Test:** Unallocated never negative
- **Expected Domain Outcome:** Reject; values unchanged
- **Chronological Recalculation:** None
- **Traceability Requirement:** Available unallocated and rule explained
- **Protected Open Question:** None
- **Source References:** [PRD-11]; [PRD-14]

### S-08 — Transfer between owner Accounts

- **Initial State:** A Rp100 unallocated; B Rp20 unallocated
- **Behavior:** TR-01 Rp30 A→B
- **Evaluated History:** Both histories
- **Candidate Boundaries:** Financial Event; Accounts
- **Preconditions:** Both active/date-valid; source sufficient
- **Invariant Under Test:** Complete two-sided non-income/expense effect
- **Expected Domain Outcome:** Accept; A=70, B=50
- **Chronological Recalculation:** From Event Date on both
- **Traceability Requirement:** One event explains both sides
- **Protected Open Question:** Distinct Account rule
- **Source References:** [PRD-11]

### S-09 — Transfer exceeding source

- **Initial State:** A Rp20; B Rp10
- **Behavior:** TR-01 Rp30 A→B
- **Evaluated History:** Both histories
- **Candidate Boundaries:** Financial Event; Accounts
- **Preconditions:** Source insufficient
- **Invariant Under Test:** Source never negative
- **Expected Domain Outcome:** Reject; neither side changes
- **Chronological Recalculation:** None
- **Traceability Requirement:** No partial destination effect
- **Protected Open Question:** None
- **Source References:** [PRD-11]; [PRD-12]

### S-10 — Allocate within Unallocated Amount

- **Initial State:** Account total/unallocated Rp100; Fund zero
- **Behavior:** FA-01 Rp60
- **Evaluated History:** Account/Fund history
- **Candidate Boundaries:** Financial Event; Account; Fund
- **Preconditions:** Valid references/date; unallocated sufficient
- **Invariant Under Test:** Total=unallocated+allocations
- **Expected Domain Outcome:** Accept; total100, unallocated40, allocation/Fund60
- **Chronological Recalculation:** From Event Date
- **Traceability Requirement:** Virtual allocation and backing Account shown
- **Protected Open Question:** Ordering
- **Source References:** [PRD-14]

### S-11 — Allocate more than Unallocated Amount

- **Initial State:** Account Total Account Balance Rp100, Unallocated Amount Rp40, existing allocations Rp60; selected Dedicated Fund exists.
- **Behavior:** FA-01 attempts to allocate Rp50.
- **Evaluated History:** Account and selected Account–Fund history through the proposed Event Date.
- **Candidate Boundaries:** Financial Event; Account; Dedicated Fund.
- **Preconditions:** References/date valid and amount positive, but Account Unallocated Amount is insufficient.
- **Invariant Under Test:** Unallocated Amount never becomes negative and the Account balance equation remains true.
- **Expected Domain Outcome:** Reject; no Financial Event or Account/Fund value changes.
- **Chronological Recalculation:** None because rejected proposal never becomes confirmed state.
- **Traceability Requirement:** Explain current Unallocated Amount, proposed amount, shortfall, and unchanged state.
- **Protected Open Question:** Same-date ordering is not reached because insufficient Unallocated Amount already rejects the proposal.
- **Source References:** [PRD-11]; [PRD-14]

### S-12 — Release from selected matching allocation

- **Initial State:** Account A has Rp60 in Fund F
- **Behavior:** FR-01 Rp20 from A/F
- **Evaluated History:** A/F allocation history
- **Candidate Boundaries:** Financial Event; Account; Fund
- **Preconditions:** Matching allocation sufficient
- **Invariant Under Test:** Release uses selected Account allocation
- **Expected Domain Outcome:** Accept; allocation/Fund -20; unallocated +20; total unchanged
- **Chronological Recalculation:** From Event Date
- **Traceability Requirement:** Selected provenance shown
- **Protected Open Question:** Ordering
- **Source References:** [PRD-14]

### S-13 — Release exceeds selected allocation while Fund total is sufficient

- **Initial State:** F: A allocation20, B allocation100
- **Behavior:** FR-01 Rp30 from A/F
- **Evaluated History:** Both breakdowns, selected A history
- **Candidate Boundaries:** Financial Event; Accounts; Fund
- **Preconditions:** Fund total sufficient; selected allocation insufficient
- **Invariant Under Test:** No cross-Account auto-consumption
- **Expected Domain Outcome:** Reject; A and B unchanged
- **Chronological Recalculation:** None
- **Traceability Requirement:** Selected shortfall explained
- **Protected Open Question:** No FIFO/LIFO
- **Source References:** [PRD-14]

### S-14 — Fund-linked Expense with matching allocation

- **Initial State:** A total100, unallocated40, F allocation60
- **Behavior:** FX-01 Rp30 from A/F
- **Evaluated History:** A/F and Account histories
- **Candidate Boundaries:** Financial Event; Account; Category; Fund
- **Preconditions:** Matching allocation and total sufficient
- **Invariant Under Test:** Unallocated unchanged; total/allocation decrease
- **Expected Domain Outcome:** Accept; total70, unallocated40, F allocation30
- **Chronological Recalculation:** From Event Date
- **Traceability Requirement:** Payment and consumed allocation shown
- **Protected Open Question:** Ordering
- **Source References:** [PRD-11]; [PRD-14]

### S-15 — Fund-linked Expense tries another Account's allocation

- **Initial State:** F: A0, B100; payment Account A total100
- **Behavior:** FX-01 Rp30 paid by A from F
- **Evaluated History:** Per-Account Fund breakdown
- **Candidate Boundaries:** Financial Event; Accounts; Fund; Category
- **Preconditions:** A total sufficient but A/F allocation insufficient
- **Invariant Under Test:** Consume only payment Account's matching allocation
- **Expected Domain Outcome:** Reject; B allocation untouched
- **Chronological Recalculation:** None
- **Traceability Requirement:** Matching-provenance failure explained
- **Protected Open Question:** No multi-Account draw
- **Source References:** [PRD-14]

### S-16 — Debt Repayment within cash and principal

- **Initial State:** A total/unallocated100; Debt principal80; dates valid
- **Behavior:** DR-01 Rp30
- **Evaluated History:** Account and repayment histories
- **Candidate Boundaries:** Financial Event; Account; Debt
- **Preconditions:** Both sufficiencies and dates valid
- **Invariant Under Test:** No negative Account/principal
- **Expected Domain Outcome:** Accept; Account70; principal50
- **Chronological Recalculation:** From Event Date in both histories
- **Traceability Requirement:** Cash and liability reductions shown
- **Protected Open Question:** Ordering
- **Source References:** [PRD-15]

### S-17 — Debt Repayment exceeds principal

- **Initial State:** A cash100; Debt principal20
- **Behavior:** DR-01 Rp30
- **Evaluated History:** Both histories
- **Candidate Boundaries:** Financial Event; Account; Debt
- **Preconditions:** Cash sufficient; principal insufficient
- **Invariant Under Test:** Principal never negative
- **Expected Domain Outcome:** Reject; both unchanged
- **Chronological Recalculation:** None
- **Traceability Requirement:** Principal shortfall and no partial cash effect
- **Protected Open Question:** Future overpayment policy excluded
- **Source References:** [PRD-15]

### S-18 — Debt Repayment exceeds Account Unallocated Amount

- **Initial State:** A total100, unallocated20; principal100
- **Behavior:** DR-01 Rp30
- **Evaluated History:** Account/debt histories
- **Candidate Boundaries:** Financial Event; Account; Debt
- **Preconditions:** Principal/total sufficient; unallocated insufficient
- **Invariant Under Test:** Unallocated never negative
- **Expected Domain Outcome:** Reject; cash and principal unchanged
- **Chronological Recalculation:** None
- **Traceability Requirement:** Account shortfall and no partial principal effect
- **Protected Open Question:** None
- **Source References:** [PRD-11]; [PRD-15]

### S-19 — Same-Type Edit moves date backward

- **Initial State:** Valid Expense on D2; earlier history exists
- **Behavior:** CR-01 proposes D1
- **Evaluated History:** Old/new Account history
- **Candidate Boundaries:** Financial Event; Account; Category
- **Preconditions:** New date valid against Account
- **Invariant Under Test:** All states valid at new chronological position
- **Expected Domain Outcome:** Accept only if preview/recalculation passes; otherwise reject
- **Chronological Recalculation:** Earliest D1
- **Traceability Requirement:** Old/new positions and impact explained
- **Protected Open Question:** Same-date ordering/preview threshold
- **Source References:** [PRD-16]

### S-20 — Same-Type Edit changes Account reference

- **Initial State:** Expense on A; proposed Account B
- **Behavior:** CR-01 changes reference
- **Evaluated History:** A and B histories
- **Candidate Boundaries:** Financial Event; Accounts; Category
- **Preconditions:** B date and sufficiency valid; A reversal valid
- **Invariant Under Test:** Both histories remain non-negative
- **Expected Domain Outcome:** Accept only after old reversal/new application validate
- **Chronological Recalculation:** Event Date on A and B
- **Traceability Requirement:** Before/after Account effects shown
- **Protected Open Question:** Preview threshold
- **Source References:** [PRD-16]

### S-21 — Replace Expense with Income

- **Initial State:** Active Expense on A
- **Behavior:** CR-02 proposes Income facts
- **Evaluated History:** Original reversal and replacement application histories
- **Candidate Boundaries:** Two Financial Events; Account; Categories
- **Preconditions:** New Income independently valid
- **Invariant Under Test:** Distinct identities; complete reversal/new effect
- **Expected Domain Outcome:** Accept if all state valid; link original/replacement
- **Chronological Recalculation:** Earliest old/new Event Date
- **Traceability Requirement:** Misclassification and both effects explained
- **Protected Open Question:** History placement/reason
- **Source References:** [PRD-16]

### S-22 — Soft-delete and restore backdated Transfer

- **Initial State:** Backdated active Transfer with later events
- **Behavior:** LC-01 then LC-02
- **Evaluated History:** Both Account histories from Transfer date
- **Candidate Boundaries:** Financial Event; Accounts
- **Preconditions:** Delete reversible; restore revalidates current state
- **Invariant Under Test:** Complete two-sided reversal/reapplication
- **Expected Domain Outcome:** Delete accepted; restore accepted only if all current history valid
- **Chronological Recalculation:** Transfer Event Date
- **Traceability Requirement:** Trash and both sides explained
- **Protected Open Question:** Permanent deletion/order
- **Source References:** [PRD-16]

### S-23 — Reduce Opening Balance below later spending

- **Initial State:** Account opening100; later Expense80
- **Behavior:** AC-06 proposes opening50
- **Evaluated History:** Entire Account history from effective date
- **Candidate Boundaries:** Account; Financial Event
- **Preconditions:** Impact Preview available
- **Invariant Under Test:** No later negative total/unallocated
- **Expected Domain Outcome:** Reject confirmed change; keep events and old opening state
- **Chronological Recalculation:** Account effective date
- **Traceability Requirement:** Preview identifies blocking Expense; no event excluded
- **Protected Open Question:** Preview threshold
- **Source References:** [PRD-12]; [PRD-16]

### S-24 — Change Reporting Period configuration

- **Initial State:** Active events across old/new boundaries
- **Behavior:** RP-03 Calendar→custom day25
- **Evaluated History:** All Event Dates and memberships
- **Candidate Boundaries:** Reporting config; Financial Events; readers
- **Preconditions:** Valid start day; preview available
- **Invariant Under Test:** One membership per event; financial facts unchanged
- **Expected Domain Outcome:** Accept regrouping if consistent; no event removed
- **Chronological Recalculation:** Earliest affected boundary
- **Traceability Requirement:** Old/new ranges, memberships, totals, sources shown
- **Protected Open Question:** Immediate-vs-next-session timing
- **Source References:** [PRD-17]


## 26. Explicit Non-Decisions

The following are deliberately not decided by this catalog:

- Final Aggregate boundaries, final Aggregate Roots, transaction boundaries, or coordinating domain responsibility.
- API operations, endpoint paths, HTTP methods, request/response contracts, commands, command handlers, domain events, application services, or domain services.
- Repositories, repository ownership, persistence transactions, database transactions, tables, schemas, implementation identifiers, ORM mappings, or database operations.
- Messaging, orchestration, sagas, CQRS, event sourcing, replay, projections, caches, framework modules, Architecture, deployment, concurrency control, or locking.
- UI layout, interaction component, exact wording, confirmation control, navigation, or preview presentation.
- Authentication provider, invitation mechanism, session mechanism, or workspace-provisioning implementation.
- Exact storage of prior values, audit representation, Trash retention, or permanent deletion mechanism.
- Exact deterministic same-date ordering mechanism.
- Exact Impact Preview threshold, correction-reason requirement, or cross-boundary coordination mechanism.
- Automatic allocation-lot selection, FIFO/LIFO, cross-Account allocation consumption, or physical movement of money for a Fund.
- Negative-balance, overdraft, credit-card, multi-currency, split transaction, recurring transaction, refund linkage, new debt borrowing/issuance, household collaboration, and Learning Mode behavior; these remain excluded from v1 by the PRD.
- Architecture follows a sufficiently approved domain model and translates it into implementation structures; it does not redefine aggregate boundaries for persistence, framework, or deployment convenience.
- Exact error codes, exception types, transport statuses, retry behavior, or user-facing messages.

## 27. Still-Open Behavior Questions

| Question ID | Protected question | Affected behavior IDs |
|---|---|---|
| OQ-01 | Are Account names unique within a workspace, and is rename available after onboarding? | AC-01; AC-02 |
| OQ-02 | Must Transfer source and destination be distinct as an explicit domain rule? | TR-01; TR-02 |
| OQ-03 | Does adding/removing a Fund reference remain a Same-Type Edit of Expense? | FX-02; CR-01 |
| OQ-04 | Are Category names unique within their kind in a workspace? | CT-01 |
| OQ-05 | Does Dedicated Fund rename ship in v1? | DF-02 |
| OQ-06 | Can Target Amount change or be removed after allocation history? | DF-03 |
| OQ-07 | Does target date ship, and is goal completion explicit or derived? | DF-01; DF-03 |
| OQ-08 | Is non-zero Dedicated Fund archival blocked or confirmable? | DF-04; LC-04 |
| OQ-09 | Does Dedicated Fund restoration ship, and under what eligibility? | DF-05; LC-05 |
| OQ-10 | What complete eligibility permits permanent Debt Record deletion? | DB-04 |
| OQ-11 | Is creditor/lender a separate Debt Record fact; is status explicit or derived? | DB-01 |
| OQ-12 | What deterministic rule orders same-date events? | All chronological behaviors; RC-01 |
| OQ-13 | What impact threshold requires preview confirmation or a correction reason? | CR-03 |
| OQ-14 | Where does a replaced event appear in ordinary history? | CR-02 |
| OQ-15 | Does manual permanent deletion from Trash ship, and what retention applies? | LC-03 |
| OQ-16 | Which archived references may support Financial Event restoration? | LC-02 |
| OQ-17 | Do archived Accounts remain in historical workspace/report totals? | AC-03; TC-04 |
| OQ-18 | Does a reporting change apply immediately or at next session start? | RP-03 |
| OQ-19 | Is a fully custom one-off reporting range needed? | RP-02 |
| OQ-20 | What exact candidate-root participation resolves each coordination hotspot? | Cross-boundary behaviors |
| OQ-21 | How are cross-boundary correction conflicts presented and confirmed without weakening invariants? | CR-01–03; RC-01 |
| OQ-22 | Are previous field values retained beyond the traceability required for correction/replacement? | TC-05 |
| OQ-23 | What final starter categories ship? | CT-01; WB-02 |
| OQ-24 | Are Dedicated Fund names unique within a workspace? | DF-01; DF-02 |
| OQ-25 | May the owner exclude selected Accounts from Workspace Total Balance? | AC-01; TC-01; TC-04 |
| OQ-26 | What is the final domain modeling form of Reporting Period configuration and derived Incomplete Period state? | WB-02; RP-01–03 |
| OQ-27 | Which candidate boundary is responsible for current Account-backed allocation state? | FA-01–02; FR-01–02; FX-01–02 |

These questions are protected from accidental resolution. A later answer must cite its product/domain authority and update affected behaviors consistently.

## 28. Recommended Behavior Baseline

### Confirmed and sufficiently specifiable groups

Workspace ownership/configuration, Account opening state and strict lifecycle eligibility, all six confirmed Financial Event forms, Category lifecycle, opening Debt Record and Debt Repayment effects, Same-Type Edit versus Event Replacement distinction, soft delete/conditional restore, reporting-period membership, chronological recalculation, and traceability have confirmed behavioral cores.

### Confirmed rules with open detail

Account rename after onboarding; the precise correction classification for adding/removing a Fund reference on Expense; Target Amount changes after history; non-zero Fund archival; generic archive/restore coverage; Impact Preview threshold/reason rules; reporting-change timing; and selected historical-report presentation rules remain protected details.

### Still Open

Dedicated Fund rename, Dedicated Fund restoration, and permanent deletion from Trash are not approved v1 behaviors. Debt Record permanent deletion remains only a candidate because blocking repayment references is confirmed but complete eligibility is not.

### Cross-boundary coordination hotspots

The principal hotspots are two-Account Transfer effects; Account-backed Fund allocation/release/expense effects; Account-plus-Debt Repayment effects; corrections, replacement, deletion, and restoration across old/new references; opening-state corrections; and reporting regrouping. These require detailed candidate-root participation and responsibility, not premature implementation structure.

### Correction and recalculation requiring further specification

Detailed decision tables must cover old/new reference participation, earliest affected point, every later state checked, same-date ordering, preview content, rejection precedence, and traceability of blocked/accepted corrections. Effective-date changes must classify existing events as becoming valid or invalid, block invalid confirmation, and never silently exclude history.

### Excluded behaviors

The PRD’s excluded v1 capabilities remain excluded; this catalog does not turn them into candidate commands or aggregates. Explicit exclusions are listed in Section 26.

### Recommended next domain-modeling task

The next domain-modeling task should be **Domain Behavior Decision Tables and Boundary Participation Analysis**. It should refine candidate-root participation, allocation responsibility, reference/lifecycle edge cases, cross-boundary correction behavior, rejection precedence, and deterministic same-date ordering. It must remain a domain review and must not begin Architecture.

Final domain approval should follow sufficiently detailed behavior specification. Architecture is downstream: it translates the approved model into implementation structures. Architecture must not silently finalize, replace, or redefine domain decisions for persistence, framework, or deployment convenience. If later architectural work discovers a genuine contradiction, that discovery triggers an explicit return to domain review.

## 29. PRD Traceability

| Major behavior group | Behavior IDs | MVP PRD | Ubiquitous Language | Domain Concept Model | Domain Object Candidates | Aggregate Candidates | Preserved conclusion |
|---|---|---|---|---|---|---|---|
| Workspace and onboarding | WB-01–02 | §§6, 9, 17, 20 | Workspace; Currency; Asia/Jakarta Workspace Timezone | Workspace ownership and configuration relationships | Workspace and Reporting configuration candidates | Plausible Workspace/configuration candidate | One private owner scope and one fixed initial configuration |
| Account | AC-01–07 | §§9, 12, 16, 28 | Account; Account Type; Opening Balance; Effective Date; balances | Account relationships, equations, and lifecycle scenarios | Account and balance candidates | Strong Account candidate; cross-boundary date rule | Asset-like non-negative opening state, strict lifecycle, non-destructive correction |
| Income | IN-01 | §§11–13 | Income; Financial Event; Event Date | Income effect and Category/Account relationships | Financial Event and Income-form candidates | Financial Event/Account/Category participation | One destination increase; no Fund or Debt effect |
| Ordinary Expense | EX-01 | §§11–14 | Expense; Unallocated Amount | Ordinary Expense effect scenario | Expense-form and balance candidates | Financial Event/Account/Category participation | Spend unallocated money without changing allocations |
| Transfer | TR-01–03 | §§11, 12, 16 | Transfer; source/destination Account | One linked two-Account relationship and scenarios | Transfer form and Account-reference candidates | Two-Account coordination hotspot | One event, two coherent Account effects, no workspace wealth change |
| Fund Allocation | FA-01–02 | §§11, 14, 16 | Fund Allocation; Account-Backed Fund Allocation | Account/Fund allocation relationships and scenarios | Allocation relationship/state candidates | Allocation-responsibility hotspot | Virtual allocation lowers unallocated, not Account total |
| Fund Release | FR-01–02 | §§11, 14, 16 | Fund Release | Selected Account–Fund release relationship | Release form and allocation candidates | Account/Fund coordination hotspot | Release only selected Account's matching allocation |
| Fund-linked Expense | FX-01–02 | §§11, 14, 16 | Fund-Linked Expense | Matching-allocation Expense effects and scenarios | Expense form, Account, Fund, Category candidates | Account/Fund/Event coordination hotspot | Expense counts once and consumes only matching backing allocation |
| Category | CT-01–05 | §13; §28 | Category; Income Category; Expense Category | Category-kind and lifecycle relationships | Category candidate | Plausible Category candidate | Immutable kind, extensible names, historical references preserved |
| Dedicated Fund and goal | DF-01–06 | §14; §28 | Dedicated Fund; Financial Goal; Fund Balance | Fund/goal identity and allocation relationships | Dedicated Fund, Target Amount, lifecycle candidates | Plausible Dedicated Fund candidate | Fund is virtual, Account-backed, with protected lifecycle/goal questions |
| Debt Record | DB-01–04 | §§9, 15, 16, 28 | Debt Record; Opening Outstanding Principal; Debt Effective Date | Opening debt and repayment relationships | Debt Record and principal candidates | Strong Debt Record candidate | Opening liability is not borrowing; principal remains non-negative |
| Debt Repayment | DR-01–03 | §§11, 15, 16 | Debt Repayment | Account-plus-Debt effects and scenarios | Repayment form and reference candidates | Account/Debt coordination hotspot | One non-expense event reduces cash and principal |
| Correction and replacement | CR-01–03 | §16; §28 | Correction; Same-Type Edit; Event Replacement; Impact Preview | Correction relationship scenarios | Behaviors distinguished from domain objects | Cross-boundary correction hotspot | Identity-preserving edit differs from linked type replacement |
| Deletion, Trash, restoration, archival | LC-01–05 | §§12–16; §28 | Soft Deletion; Trash; Restoration; Archive; Permanent Deletion | Concept-specific lifecycle relationships | Lifecycle-state and behavior classifications | Lifecycle stress tests and dependency rules | Preserve history; reapply only when current invariants remain valid |
| Reporting Period | RP-01–03 | §17; §28 | Reporting Period; Calendar Month; Custom Monthly Cycle; Incomplete Period | Reporting/time relationships | Reporting configuration and Incomplete Period candidates | Weak independent configuration candidate | Group by Event Date only; financial facts never change |
| Chronological recalculation | RC-01 | §16 | Chronological Recalculation; Event Date | Historical invariant scenarios | Confirmed behavior, not domain object | Cross-boundary recalculation hotspot | Reevaluate only affected histories from earliest point, deterministically |
| Traceability and supporting records | TC-01–05 | §19 | Traceability; Supporting Records; derived-value terms | Cross-view consistency rules | Explanation/derived-value candidates | Reporting/readers outside write-boundary finalization | Every important number and multi-sided effect reconciles to sources |

The baseline is intentionally domain-level. It preserves all confirmed PRD constraints while leaving candidate boundaries and open decisions available for explicit review.
