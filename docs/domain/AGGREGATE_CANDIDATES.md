# Annotasi Finance — Aggregate Candidates

## 1. Document Status

- **Status:** Draft for domain-modeling review
- **Scope:** Annotasi Finance Private Beta MVP
- **Workflow stage:** Domain Modeling — Session 18 Aggregate Candidate Analysis
- **Modeling level:** Product-domain candidate consistency boundaries only
- **Candidate rule:** Every Aggregate, Aggregate Root, consistency boundary, status, and recommendation in this document is provisional and remains subject to later refinement.
- **Only artifact created by this session:** `docs/domain/AGGREGATE_CANDIDATES.md`

This document does not begin Architecture. A Candidate Aggregate does not imply one persistence transaction, table, document, module, API, repository, deployment unit, or process. No existing product or domain source document is modified by this analysis.

Sources directly loaded and verified for this analysis:

- `CLAUDE.md`
- `docs/project/PROJECT_STATE.md`
- `docs/product/PRODUCT_IDENTITY.md`
- `docs/product/ANNOTASI_FINANCE_MVP_PRD.md` §§9, 11, 12, 13, 14, 15, 16, 19, plus §§6, 17, 20, and 28 where Workspace ownership/privacy, reporting behavior, and protected open questions are directly implicated
- `docs/domain/UBIQUITOUS_LANGUAGE.md`
- `docs/domain/DOMAIN_CONCEPT_MODEL.md`
- `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`

The project-local `domain-modeling` skill contributed only generic techniques: challenge proposed boundaries, test concrete scenarios, and detect oversized or undersized candidates. Its default artifact paths and any architectural examples were not used.

## 2. Purpose

This document identifies candidate clusters of domain concepts that may need to be evaluated together to keep confirmed Annotasi Finance rules true after one logical business operation. It assesses candidate Aggregate Roots, candidate local and cross-boundary invariants, correction and chronological-recalculation scope, and coordination requirements.

The analysis is deliberately provisional. It narrows the domain questions that later detailed behavior specifications must answer before Architecture translates a sufficiently approved domain model into implementation structures. It does not choose persistence ownership, transaction mechanisms, interfaces, or implementation structures. It preserves the product promise that a Financial Event is recorded once, represented accurately, reflected consistently everywhere, and traceable to the records that produced every important number (PRODUCT_IDENTITY.md §§1, 5, 13; PRD §§16, 19).

## 3. Source of Truth and Decision Rules

Priority order:

1. Confirmed requirements in `docs/product/ANNOTASI_FINANCE_MVP_PRD.md`, especially §§9, 11–16, and 19.
2. Approved product direction in `docs/product/PRODUCT_IDENTITY.md` where Workspace ownership, privacy, trust, or product identity is directly relevant.
3. Repository working rules in `CLAUDE.md`.
4. Canonical terminology in `docs/domain/UBIQUITOUS_LANGUAGE.md`.
5. Confirmed relationships in `docs/domain/DOMAIN_CONCEPT_MODEL.md`.
6. Candidate classifications in `docs/domain/DOMAIN_OBJECT_CANDIDATES.md`.
7. Navigation and current-state guidance in `docs/project/PROJECT_STATE.md`, which never overrides an authoritative source.
8. The Session 18 specification.

Decision rules:

- A confirmed product invariant may justify a candidate consistency boundary; generic domain-modeling convention may not.
- Candidate Entity status does not automatically make a concept an Aggregate Root (`DOMAIN_OBJECT_CANDIDATES.md` §§4–6, 18).
- A derived value is not directly editable and does not become an independent Aggregate merely because it is important (PRD §§9, 14, 15, 19; `DOMAIN_OBJECT_CANDIDATES.md` §8).
- A cross-boundary rule identifies a coordination need but does not select how coordination works.
- A product ownership or containment relationship does not automatically imply one Aggregate. Workspace contains the financial context, but containment alone does not settle consistency boundaries (`DOMAIN_CONCEPT_MODEL.md` §§6–7).
- Every protected open question stays open. This document may expose its effect on aggregate analysis but cannot decide it.
- Sources cited as `PRD` refer to `docs/product/ANNOTASI_FINANCE_MVP_PRD.md`; `UL` to `UBIQUITOUS_LANGUAGE.md`; `DCM` to `DOMAIN_CONCEPT_MODEL.md`; and `DOC` to `DOMAIN_OBJECT_CANDIDATES.md`.

## 4. Aggregate Modeling Principles

### Working definitions

- **Candidate Aggregate:** a cluster of domain concepts that may need to be treated as one consistency boundary for a specific class of changes. It implies none of the implementation structures listed in §21.
- **Candidate Aggregate Root:** the candidate domain concept through which changes to a Candidate Aggregate may need to be initiated or validated. No identifier field or repository method is assigned.
- **Local Invariant:** a rule plausibly evaluable using only current state and history inside one candidate boundary.
- **Cross-Aggregate Invariant:** a rule whose validation appears to require information from more than one candidate boundary.
- **Consistency Boundary:** the domain scope evaluated together so a confirmed rule remains true after one logical business operation. It is not automatically a persistence transaction.
- **Coordination Requirement:** a business need for multiple candidate boundaries to participate in one logical operation. It is not converted here into a service, command, event, message, saga, or orchestration design.

### Candidate statuses

The allowed provisional statuses are **Strong Candidate**, **Plausible Candidate**, **Alternative Candidate**, **Weak Candidate**, **Rejected Candidate**, and **Still Open**.

### Annotasi Finance-specific tests

1. **Invariant locality:** Can the proposed root evaluate the rule from its own current state and history?
2. **Lifecycle continuity:** Does the root's identity survive rename, archive, correction, deletion/restoration, or replacement as confirmed by the sources?
3. **Historical reach:** Can a backdated change require reevaluation from an earliest affected point, and does that remain coherent inside the candidate boundary?
4. **Traceability:** Can every derived value inside the boundary remain explainable through its starting state and Financial Events?
5. **Cross-concept effects:** Does one logical operation necessarily affect another candidate boundary?
6. **Size pressure:** Would the proposal absorb unrelated histories merely to make coordination disappear?
7. **Fragmentation pressure:** Would the proposal separate values that must be validated together, allowing an invalid intermediate business result?

The fixed single-owner, private Workspace model is load-bearing: one User owns exactly one Workspace in v1, with no shared ownership, roles, invitations, or household collaboration (PRODUCT_IDENTITY.md §3; `CLAUDE.md` §3; DCM §6). This ownership rule is a scope constraint on every candidate, not evidence that all financial state must be one Aggregate.

## 5. Candidate Aggregate Summary

Counts reported later use the rows in this table, including explicit alternative and rejected boundary variants.

| Candidate Boundary | Candidate Root | Included Concepts | Excluded but Referenced Concepts | Primary Invariants Protected | Candidate Status | Main Reason | Main Risk | Source References | Open Question |
|---|---|---|---|---|---|---|---|---|---|
| Workspace — ownership plus selected configuration | Workspace | owning User relationship, isolation/scope, one active Reporting Period configuration, fixed Workspace timezone policy | Accounts, Categories, Dedicated Funds, Debt Records, Financial Events, derived reports | one User ↔ one private Workspace; one active Reporting Period; Workspace isolation | Plausible Candidate | Workspace has continuous identity and confirmed workspace-level policy | May blur ownership scope with financial-write responsibility | PRODUCT_IDENTITY.md §3; PRD §§17, 20; DCM §§6, 12; DOC §§6, 10 | Whether Reporting Period configuration belongs inside its consistency boundary |
| Workspace — all financial state | Workspace | all Accounts, Categories, Funds, Debts, Events, reporting configuration and derived totals | none inside one Workspace | potentially every invariant | Rejected Candidate | Could evaluate everything together | Oversized boundary couples all history and configuration; product containment is mistaken for one change boundary | PRD §§9, 11–17, 19; DCM §§6–15 | None needed to reject as recommended baseline; final boundaries still remain provisional |
| Workspace — ownership/scope only | Workspace or no financial root role | owning User relationship, isolation, containment scope | all financial lifecycle and configuration changes | owner cardinality and isolation only | Alternative Candidate | Cleanly separates privacy scope from financial consistency | Leaves Reporting Period configuration without an obvious candidate home | PRODUCT_IDENTITY.md §3; PRD §§6, 20; DCM §6; DOC §6 | Whether Workspace needs root behavior beyond ownership/scope |
| Account | Account | identity/lifecycle, Account Type, Opening Balance, effective date, Total Account Balance, Unallocated Amount, candidate current per-fund Account-Backed Fund Allocation amounts | Financial Event identities, Dedicated Fund identities, Debt Records, Category | non-negative balances and allocations; balance equation; effective-date constraint supplied for cross-boundary Event Date validation; archive eligibility | Strong Candidate | Most confirmed monetary invariants are account-local across Account history | Cross-account and fund/debt operations, including complete Event Date validation, cannot be completed by Account alone | PRD §§9, 11, 12, 14, 16; UL §§7, 12; DCM §§7–8, 15; DOC §§6, 8, 12 | Whether Account owns current allocation state, and whether the relationship has identity |
| Financial Event | Financial Event | one event identity, Event Type/form, required references, Event Date, minimal change metadata, replacement link and Trash lifecycle | Account/Fund/Debt/Category state and their histories | type/reference shape; identity preservation; replacement/soft-deletion lifecycle; traceability of one recorded occurrence | Plausible Candidate | Identity and correction lifecycle are clearly event-centered | Cannot independently validate the monetary effects it claims | PRD §§11, 16, 19; UL §§5–6, 11; DCM §§8, 13–14; DOC §§6, 12 | Whether it is a root or an identity-bearing concept governed through financial boundaries |
| Category | Category | identity, Income/Expense kind, name, archive/hide, restoration, deletion eligibility | historical Financial Events that reference it | kind stability; availability for new use; no-history deletion rule; reference resolvability | Plausible Candidate | Small lifecycle with independent historical continuity | Could instead be Workspace-owned configuration; name uniqueness remains open | PRD §13; UL §5; DCM §11, §13; DOC §§6, 15–16 | Independent boundary or Workspace-owned configuration; name uniqueness |
| Dedicated Fund | Dedicated Fund | identity/lifecycle, name, optional Target Amount, Fund Balance, per-Account breakdown as candidate fund-side view | Accounts, Financial Events, matching account-local allocations | Fund Balance equals per-Account breakdown; no cross-account automatic consumption; lifecycle/deletion eligibility | Plausible Candidate | Cross-account fund meaning and lifecycle center on the Fund | Allocation amount may be shared responsibility with Account; restoration and target changes remain open | PRD §§9, 14, 16; UL §8; DCM §§7, 9, 15; DOC §§6, 8, 12 | Who owns allocation state; independent identity; restoration behavior |
| Debt Record | Debt Record | identity/lifecycle, Opening Outstanding Principal, effective date, Outstanding Principal, repayment history relationship, deletion eligibility | payment Accounts and Financial Event identities | Outstanding Principal ≥ Rp0; effective-date constraint supplied for cross-boundary Debt Repayment Event Date validation; no deletion while referenced | Strong Candidate | Principal history and overpayment prevention are coherent around one Debt Record | Every repayment also needs Account consistency and one Financial Event identity, including its Event Date | PRD §§11, 15, 16; UL §§9, 12; DCM §§8, 10, 15; DOC §§6, 8 | Creditor structure and explicit/derived debt status remain open |
| Reporting configuration — independent | Reporting Period configuration | Calendar Month or Custom Monthly Cycle, exact range grouping policy | Workspace identity, events, reports, Incomplete Period | one active cycle; valid start day; regrouping only | Weak Candidate | Configuration has behavior but no confirmed independent identity or lifecycle | Creates a boundary with little independent consistency value and weak source support | PRD §17; UL §10; DCM §12; DOC §§10, 14, 19 | Whether it is a value/configuration pair and whether Workspace contains it |
| Account-centered financial history | Account | Account plus most events affecting it | other Accounts, Funds, Debt Records, Categories | account invariants | Alternative Candidate | Strong account locality | Transfer, fund, debt, and event identity become awkwardly split or duplicated | PRD §§11–16; DCM §§7–10, 13; DOC §6 | How one event spanning two Accounts retains one identity |
| Financial-Event-centered effects | Financial Event | event identity plus all claimed financial effects | referenced roots as validation sources | operation-wide effect consistency | Alternative Candidate | Correction and Traceability center on one recorded occurrence | Event would absorb unrelated historical state or fail to protect downstream invariants locally | PRD §§11, 16, 19; DCM §§8, 13–15; DOC §6 | Whether effects belong inside the event boundary or require coordination |

The summary deliberately does not make every Candidate Entity a root. User is outside this session's minimum financial-boundary assessment; Financial Goal shares Dedicated Fund identity; derived balances are not independent roots; and Account-Backed Fund Allocation remains a relationship concept whose identity is open (DOC §§5–6, 8, 12, 19).

## 6. Workspace Boundary Analysis

### Alternative A — Workspace as one large financial Aggregate

This alternative would place Accounts, Categories, Dedicated Funds, Debt Records, Financial Events, and Reporting Period configuration inside one Workspace consistency boundary. It could, in product-domain terms, evaluate every affected Account, Fund, Debt, and Event together. That breadth superficially makes Transfer, Fund Allocation, Debt Repayment, and correction coordination local.

The cost is an oversized candidate: one unrelated Category rename, one Income, one backdated Transfer, and one reporting-cycle change would all sit inside the same financial boundary. Workspace contains the complete financial context, but confirmed containment and privacy do not say every change must evaluate the whole context (DCM §6). Historical recalculation can reach multiple affected histories without implying that all those histories permanently form one Aggregate (PRD §16; UL §11). This is therefore a **Rejected Candidate** as the recommended baseline, while final boundary design remains deferred.

### Alternative B — Workspace as ownership/scope boundary only

Workspace would establish the one owning User, privacy/isolation, and containment scope, while smaller candidates govern financial and lifecycle changes. This closely matches the confirmed Single-Owner Workspace model and avoids turning privacy containment into a giant financial consistency boundary (PRODUCT_IDENTITY.md §3; PRD §§6, 20; DCM §6).

Its strength is conceptual clarity. Its risk is leaving the one active Reporting Period configuration without a clear candidate boundary and underrepresenting Workspace's own candidate-entity continuity (DOC §6). It remains an **Alternative Candidate**, not a conclusion.

### Alternative C — Workspace as root for selected configuration only

Workspace would protect ownership/isolation and the rule that exactly one Reporting Period configuration is active, while Account, Financial Event, Category, Dedicated Fund, and Debt Record remain smaller candidates. Reporting Period changes regroup summaries but never change Event Dates, account balances, or event financial effects (PRD §17; DCM §12). This makes configuration plausibly Workspace-local while reports remain derived.

This is a **Plausible Candidate** baseline because it respects both Workspace continuity and smaller financial boundaries. It remains open whether Reporting Period configuration belongs inside Workspace's consistency boundary or should have another later modeling form (DOC §§10, 14, 19).

All three alternatives preserve exactly one User owning exactly one private Workspace. None introduces shared ownership, roles, invitations, guests, or collaboration.

## 7. Account Boundary Analysis

Account is a **Strong Candidate** root for identity and lifecycle, Account Type, Opening Balance, Opening-Balance Effective Date, current Total Account Balance, current Unallocated Amount, archive eligibility, and Account-local historical validation (PRD §§9, 12, 16; UL §§7, 12; DOC §6).

### Candidate included responsibilities

- Total Account Balance must never fall below Rp0.
- Unallocated Amount must never fall below Rp0.
- The balance equation must always hold.
- Every current Account-Backed Fund Allocation amount backed by the Account must remain at least Rp0.
- Account provides the Opening-Balance Effective Date against which every referencing Financial Event must be validated. The complete Event Date invariant is cross-boundary because Event Date belongs to Financial Event.
- Archive is allowed only when Total Account Balance is exactly Rp0; restoration is confirmed; Permanent Deletion requires an Rp0 Opening Balance, no history, and no dependencies.
- Opening Balance or effective-date correction reevaluates Account history from the earliest affected point.

The local monetary and lifecycle rules in this list can plausibly be evaluated from one Account's starting state, current derived state, and the ordered effects of Financial Events referencing it. The complete Event Date rule additionally requires the referencing Financial Event's Event Date and is therefore not Account-local. This supports placing current per-fund allocation amounts inside the Account candidate consistency boundary. It does **not** settle persistence ownership, and it does not prove the Account-Backed Fund Allocation relationship has independent identity.

### Operation effects against the Account candidate

| Financial Event form | Account-local effect | Additional boundary implicated | Source |
|---|---|---|---|
| Income | Total Account Balance and Unallocated Amount increase | Financial Event; Category | PRD §11; DCM §8 |
| Ordinary Expense | both decrease; amount cannot exceed Unallocated Amount | Financial Event; Category | PRD §§11–12; DCM §8 |
| Fund-Linked Expense | Total Account Balance and matching per-fund allocation decrease; Unallocated Amount unchanged | Financial Event; Category; Dedicated Fund | PRD §§11, 14; DCM §§8–9 |
| Transfer | source totals/unallocated decrease; destination totals/unallocated increase | Financial Event; second Account | PRD §11; DCM §8 |
| Fund Allocation | Unallocated Amount decreases; matching allocation increases; total unchanged | Financial Event; Dedicated Fund | PRD §§11, 14; DCM §§8–9 |
| Fund Release | matching allocation decreases; Unallocated Amount increases; total unchanged | Financial Event; Dedicated Fund | PRD §§11, 14; DCM §§8–9 |
| Debt Repayment | Total Account Balance and Unallocated Amount decrease | Financial Event; Debt Record | PRD §§11, 15; DCM §§8, 10 |

Backdated creation, Same-Type Edit, Event Replacement, Soft Deletion, and Restoration can change the Account's sequence from the earliest affected Event Date forward. Every Account-local monetary invariant must hold at every recalculated point, while complete Event Date validity remains cross-boundary (PRD §16; UL §§11–12).

### Allocation-state alternatives

1. **Inside Account:** strongest fit for the balance equation and matching-Account validation; the Fund references the Account-backed breakdown.
2. **Referenced derived projection:** weak as the only source of truth because Account must still protect non-negative allocation and its balance equation.
3. **Shared domain responsibility with Dedicated Fund:** plausible at candidate level because the same pairing contributes both to the Account equation and the Fund Balance breakdown.
4. **Still open:** final ownership and whether the relationship has independent identity are not decided (DOC §§12, 19).

Account alone cannot protect complete Event Date validity, both sides of Transfer, Fund Balance across Accounts, Debt Record principal, Financial Event lifecycle, or Category validity. Those are cross-boundary needs, not reasons to enlarge every Account into the whole Workspace.

## 8. Financial Event Boundary Analysis

Financial Event is a **Plausible Candidate** root because one general identity persists through Same-Type Edit, Soft Deletion, Trash, and Restoration; Event Replacement creates a distinct new Financial Event linked to the old; and minimal change metadata and Traceability attach to the recorded occurrence (PRD §§11, 16, 19; DOC §6).

Its candidate boundary could include:

- one Financial Event identity;
- exactly one of the six closed Event Types;
- type-specific required references and one Event Date;
- Created Timestamp, Updated Timestamp, edited/deleted/replaced indicators, Trash state, and replacement link where applicable;
- the distinction between Ordinary Expense and Fund-Linked Expense;
- the fact that Transfer is one linked Financial Event with two Account references.

It would exclude the authoritative current and historical state of referenced Accounts, Dedicated Funds, Debt Records, and Categories. Therefore it can plausibly protect its identity, type/reference shape, and lifecycle, but cannot alone prove that a Transfer source has enough Unallocated Amount, a fund-backed allocation is sufficient, a Debt Record will not be overpaid, or historical recalculation remains valid.

Four candidate forms remain:

1. **Independent Candidate Aggregate Root:** strongest for identity and correction lifecycle, but all balance-affecting changes need coordination.
2. **Identity-bearing concept inside another boundary:** could improve local monetary consistency, but Transfer and cross-Fund/Debt behavior make any single containing root incomplete.
3. **Immutable historical record plus correction lifecycle:** plausible descriptive form, but immutability is not selected and event sourcing is not inferred.
4. **Another hybrid form:** Financial Event retains identity while multiple financial candidates jointly validate its effects.

The last form best describes the current evidence without finalizing it. An identity-bearing Entity need not be a root (DOC §§4, 6, 18). Traceability does not justify a giant audit Aggregate; it requires resolvable links from derived values to the Financial Events and starting state that produced them (PRD §19; DCM §14).

## 9. Category Boundary Analysis

Category is a **Plausible Candidate** small root responsible for its identity, Income or Expense kind, name, rename, archive/hide, restoration, and Permanent Deletion eligibility (PRD §13; UL §5; DOC §6).

Local candidate rules include:

- one Category belongs to exactly one non-overlapping kind;
- only Income or Expense may reference it, exactly one Category per such event;
- archive/hide prevents selection for new Financial Events while historical references remain resolvable;
- restoration is supported;
- Permanent Deletion is allowed only when unused.

Category does not determine Event Type, does not control Account balances, and is not a Dedicated Fund (PRD §§9, 13; DCM §§11, 17). Historical Financial Events must retain a resolvable reference through rename or archive.

Two models remain plausible:

- **Independent Category candidate:** lifecycle changes and historical continuity are small and coherent.
- **Workspace-owned configuration:** the Workspace contains its Category set and could protect set-level rules.

The sources do not confirm Category-name uniqueness within an Income/Expense kind, so no set-level uniqueness invariant can justify either model yet (`PROJECT_STATE.md` §8; DOC §§15, 19). Persistence ownership is not selected.

## 10. Dedicated Fund Boundary Analysis

Dedicated Fund is a **Plausible Candidate** root for identity and lifecycle, name, optional Target Amount, current Fund Balance, Account-backed breakdown, archive/delete eligibility, and Financial Goal behavior when Target Amount is present (PRD §§9, 14; UL §8; DOC §6).

### Fund-local candidate rules

- Fund Balance equals the sum of current Account-Backed Fund Allocation amounts across backing Accounts.
- The breakdown must remain traceable per originating Account.
- Target Amount is optional and not a hard cap.
- Financial Goal shares Dedicated Fund identity; it is not a separate Aggregate candidate.
- Permanent Deletion requires zero Fund Balance and zero event history.
- Archive preserves history; restoration behavior and the exact non-zero archival rule remain open.

### Account-local candidate rules

- The matching Account-backed allocation must remain at least Rp0.
- Account Total Balance equals Unallocated Amount plus all its current fund allocations.
- Fund Allocation cannot exceed the source Account's Unallocated Amount.
- Fund Release cannot exceed the selected Account's current allocation.
- Fund-Linked Expense cannot exceed the matching allocation and cannot make Total Account Balance negative.

### Cross-boundary rules

Fund Allocation, Fund Release, and Fund-Linked Expense each change both Account-local allocation state and Dedicated Fund's cross-account breakdown/Fund Balance, while one Financial Event identity records what happened. No automatic cross-account consumption is allowed; one Fund-Linked Expense cannot draw from multiple Accounts; and no FIFO/LIFO or allocation-lot relationship exists (PRD §§11, 14, 16; DCM §§7–9, 15).

This tension supports shared domain responsibility at the candidate level: Account is the strongest evaluator of its own allocation and balance equation; Dedicated Fund is the strongest evaluator of its cross-account breakdown and lifecycle. The analysis does not select where the Account-Backed Fund Allocation is persisted, whether it has independent identity, or which side “owns” it. Dedicated Fund restoration behavior is not inferred.

## 11. Debt Record Boundary Analysis

Debt Record is a **Strong Candidate** root for identity/lifecycle, Opening Outstanding Principal, associated effective date, current Outstanding Principal, its Debt Repayment history relationship, overpayment prevention, and deletion eligibility (PRD §§11, 15, 16; UL §9; DOC §§6, 8).

Debt-local candidate rules:

- Outstanding Principal is derived from Opening Outstanding Principal and valid Debt Repayments.
- Outstanding Principal must remain at least Rp0 at every recalculated point.
- Changing opening principal or effective date triggers Impact Preview and chronological reevaluation of later repayments.
- Deletion is blocked while Debt Repayments reference the Debt Record.

Debt Record provides the effective date against which every referencing Debt Repayment must be validated. The complete date-validity invariant is cross-boundary because the Debt Repayment Event Date belongs to Financial Event; same-date remains allowed. This does not weaken Debt Record's local responsibility for non-negative Outstanding Principal throughout its recalculated history.

Debt Repayment is still cross-boundary: the Debt Record can validate principal, but the payment Account must independently validate Unallocated Amount and its balance equation; Financial Event preserves the one repayment identity and Traceability. Interest, penalties, and fees remain separate Expense Financial Events and do not change Outstanding Principal (PRD §§11, 15; DCM §10).

No Active/Paid-Off state is invented. Whether status is explicit or derived remains open. Creditor/lender field structure remains open. No persistence ownership is selected.

## 12. Reporting and Derived-Value Boundary Analysis

### Reporting Period configuration

Exactly one Reporting Period configuration is active per Workspace: Calendar Month by default or one Custom Monthly Cycle with a start day from 1 through 28. Asia/Jakarta is a fixed v1 Workspace policy. A cycle change regroups summaries but does not change Event Dates, balances, or financial effects; it requires Impact Preview and explicit confirmation (PRD §17; UL §10; DCM §12).

This supports configuration inside the **Plausible Workspace candidate boundary**. A separate Reporting Configuration Aggregate is a **Weak Candidate** because the sources give it no confirmed independent identity or lifecycle (DOC §§10, 14, 19). Its final modeling form remains open.

### Derived values and views

Workspace Total Balance, Total Account Balance, Unallocated Amount, current Account-Backed Fund Allocation amount, Fund Balance, Outstanding Principal, reports, dashboard totals, comparisons, and Supporting Records are derived or descriptive relationships. They are not directly editable and should not become independent financial-write candidates merely because they are displayed (PRD §§9, 14, 15, 18, 19; DCM §14; DOC §§8, 12–13).

Reporting Period, Calendar Month, Custom Monthly Cycle, Asia/Jakarta Workspace Timezone, and Incomplete Period are policy/configuration or state concepts, not evidence for absorbing reporting data into Account, Fund, Debt, or Financial Event write boundaries (DOC §§10–11).

Traceability requires:

- every important number to open to Supporting Records and individual event explanations;
- Account, Fund, Debt, and Workspace totals to reconcile with their contributing records;
- a Transfer to show both sides together;
- a Fund-Linked Expense to show Account and allocation effects;
- a Debt Repayment to show Account and principal effects;
- dashboard/detail disagreement to remain release-blocking.

These are cross-cutting correctness requirements, not a decision to create projections, read models, caches, analytics stores, APIs, or a giant reporting Aggregate (PRD §19; DCM §14).

## 13. Correction and Chronological Recalculation Analysis

Chronological Recalculation begins at the earliest point whose financial meaning may change and proceeds through every later affected point. It validates all confirmed invariants throughout, not only final state (PRD §§9, 16; UL §§11–12).

| Change | Earliest affected point | Candidate boundaries to reevaluate | Required rules | Source |
|---|---|---|---|---|
| Same-Type Edit — amount/date/reference | earlier of old and new Event Date, subject to referenced effective dates | Financial Event; old and new Accounts/Funds/Debts as applicable; reporting grouping | all financial invariants, valid references/dates, Traceability | PRD §16; DCM §13 |
| Event Replacement | earlier of replaced and replacement Event Dates | old and new Financial Events; every boundary losing old effects or gaining new effects | reverse old/apply new without double counting; replacement link; all invariants | PRD §§16, 19; DCM §§13–14 |
| Soft Deletion | deleted Event Date | Financial Event and every boundary whose effect is reversed | all invariants at every later point; linked Transfer remains one event | PRD §16 |
| Restoration | restored Event Date | restored Financial Event and all currently referenced/chronologically affected boundaries | current dependency validity and all invariants throughout | PRD §16; UL §11 |
| Opening Balance correction | Account opening point | Account plus downstream Fund/Debt coordination where later events touch them | Account balance invariants throughout | PRD §§12, 16 |
| Account effective-date change | earlier of old/new effective date; identify existing referencing Financial Events that would become valid or invalid relative to the proposed date | Account, existing referencing Financial Events, and affected Funds/Debts/report grouping | Impact Preview and Chronological Recalculation; block the proposal if confirmed date or financial invariants cannot remain valid; existing events are not silently removed or excluded | PRD §§12, 16 |
| Opening Outstanding Principal correction | Debt opening point | Debt Record; later Debt Repayments; their payment Accounts | principal and Account invariants throughout | PRD §§15–16 |
| Debt effective-date change | earlier of old/new effective date; identify existing Debt Repayment Financial Events that would become valid or invalid relative to the proposed date | Debt Record, existing Debt Repayment Financial Events, and payment Accounts | Impact Preview and Chronological Recalculation; block the proposal if confirmed date or financial invariants cannot remain valid; existing repayments are not silently removed or excluded | PRD §§15–16 |
| Reporting Period change | configuration effective choice for all regrouped history | Workspace configuration and derived reports only; underlying financial boundaries remain unchanged | exact ranges, Event Date grouping, Incomplete Period, Traceability | PRD §17 |

Changing a reference can remove an effect from one Account/Fund/Debt history and introduce it into another, so both old and new histories may require reevaluation. Event Replacement can change the set of boundary types involved entirely.

Changing an Account or Debt Record effective date does not itself remove existing Financial Events from history. Impact Preview and Chronological Recalculation identify which existing referencing Financial Events would become valid or invalid under the proposed date. The proposed change is blocked if confirmed date-validity or financial invariants cannot remain true; no affected Financial Event or Debt Repayment is silently excluded.

This historical reach does not mean every concept belongs to one giant Aggregate. It means the logical correction has a coordination scope that may span several candidate boundaries. Identifying that business requirement does not decide transactions, services, commands, events, messages, sagas, or any other implementation.

## 14. Local Invariants

“Local or Cross-Boundary” describes the smallest plausible evaluation scope under the candidate baseline; uncertain rules are not forced local.

| Invariant | Candidate Boundary Able to Evaluate It | Required Information | Local or Cross-Boundary | Source | Uncertainty |
|---|---|---|---|---|---|
| Total Account Balance ≥ Rp0 | Account | Opening Balance and ordered Account effects | Local | PRD §§9, 12, 16; UL §12 | None at product-rule level |
| Unallocated Amount ≥ Rp0 | Account | Total Account Balance and ordered allocation/unallocated effects | Local | PRD §§9, 12, 16; UL §12 | None |
| Account-Backed Fund Allocation ≥ Rp0 | Account, with Dedicated Fund reference | ordered Allocation/Release/Fund-Linked Expense effects for one Account–Fund pair | Local to Account candidate; mirrored Fund meaning is cross-boundary | PRD §§9, 14, 16; DCM §15 | Final responsibility and relationship identity open |
| Account balance equation | Account | Total Account Balance, Unallocated Amount, all current per-fund allocations | Local | PRD §9; UL §12 | None |
| Outstanding Principal ≥ Rp0 | Debt Record | Opening Outstanding Principal and ordered Debt Repayments | Local | PRD §§15–16; UL §12 | Explicit status still open |
| Event Date not before each referenced Account effective date | Financial Event plus every referenced Account | Event Date and one/two Account effective dates | Cross-boundary | PRD §§11–12, 16 | Transfer source/destination distinctness does not alter date rule |
| Event Date not before referenced Debt Record effective date | Financial Event plus Debt Record | repayment Event Date and debt effective date | Cross-boundary | PRD §§15–16 | None |
| Fund Release not exceeding selected Account's current fund allocation | Account plus Dedicated Fund/Financial Event references | selected Account–Fund current amount | Account-local amount validation within a cross-boundary operation | PRD §§11, 14; DCM §15 | Allocation responsibility open |
| Fund-Linked Expense not exceeding matching Account-backed allocation | Account plus Dedicated Fund/Financial Event references | payment Account, selected Fund, matching allocation | Account-local amount validation within a cross-boundary operation | PRD §§11, 14; DCM §15 | Allocation responsibility open |
| Fund-Linked Expense does not make Total Account Balance negative | Account | payment Account history/current state | Local | PRD §§11, 14 | None |
| Debt Repayment not exceeding Outstanding Principal | Debt Record plus Financial Event | current principal and proposed repayment | Debt-local amount validation within a cross-boundary operation | PRD §§11, 15 | Future credit/refund policy does not change v1 rule |
| Debt Repayment not exceeding payment Account's Unallocated Amount | Account plus Financial Event | payment Account state and amount | Account-local amount validation within a cross-boundary operation | PRD §§11–12, 15 | None |
| Transfer not exceeding source Account's Unallocated Amount | source Account plus Financial Event | source Account state and amount | Source-Account-local validation within a cross-boundary operation | PRD §§11–12 | Source/destination distinctness open |
| Account archival requires Total Account Balance = Rp0 | Account | current Total Account Balance and lifecycle state | Local | PRD §12; DCM §13 | None |
| Category Permanent Deletion requires no history | Category plus historical reference knowledge | whether any Financial Event references Category | Cross-boundary unless history is treated inside Category candidate | PRD §13 | Final boundary responsibility open |
| Account Permanent Deletion requires Rp0 Opening Balance and no history/dependency | Account plus historical reference knowledge | opening state and all dependencies | Cross-boundary unless dependency knowledge is inside Account candidate | PRD §12 | Final dependency-evaluation boundary open |
| Dedicated Fund Permanent Deletion requires zero balance and zero event history | Dedicated Fund plus Financial Event history | Fund Balance and reference/dependency history | Cross-boundary | PRD §14 | Non-zero archive behavior and restore open |
| Deterministic same-date recalculation | Every chronologically affected financial candidate | stable reproducible ordering of same-date Financial Events | Cross-boundary requirement | PRD §16; UL §11 | Exact mechanism explicitly deferred |
| Traceability of derived values | Account/Fund/Debt/Workspace derived value plus contributing records | starting state, Financial Events, included records and formulas | Cross-boundary requirement | PRD §19; DCM §14 | Does not establish an audit Aggregate |

## 15. Cross-Aggregate Invariants

| Logical operation | Candidate boundaries involved | Invariants that must hold | Local or cross-boundary | What remains open | Why implementation is deferred |
|---|---|---|---|---|---|
| Transfer | Financial Event; source Account; destination Account | one linked identity; both Account equations; source Unallocated Amount ≥ Rp0; both Event Dates valid; Workspace total unchanged | Cross-boundary | root role of Financial Event; source/destination distinctness; protection of both sides | Sources define one logical result, not its mechanism (PRD §§11, 16) |
| Fund Allocation | Financial Event; source Account; Dedicated Fund | source Unallocated Amount ≥ Rp0; Account equation; matching allocation increases; Fund breakdown/balance reconciles | Cross-boundary | allocation identity and Account-vs-Fund responsibility | PRD defines provenance and effects only (§§11, 14) |
| Fund Release | Financial Event; source Account; Dedicated Fund | release ≤ selected Account's allocation; Account equation; Fund breakdown reconciles; total unchanged | Cross-boundary | allocation responsibility | No FIFO/LIFO or implementation approach may be inferred (PRD §§11, 14, 16) |
| Fund-Linked Expense | Financial Event; payment Account; Dedicated Fund; Category | matching allocation and Total Account Balance remain ≥ Rp0; Unallocated unchanged; Fund Balance reconciles; Expense counted once | Cross-boundary | allocation responsibility; correction scope | Confirmed behavior does not select coordination design (PRD §§11, 14) |
| Debt Repayment | Financial Event; payment Account; Debt Record | payment Unallocated Amount ≥ Rp0; Total Account Balance ≥ Rp0; Outstanding Principal ≥ Rp0; principal excluded from Expense | Cross-boundary | root entry order; debt status/creditor fields | PRD requires both effects and Traceability, not a technical boundary (§§11, 15, 19) |
| Event Replacement | old Financial Event; new Financial Event; all Accounts/Funds/Debts/Categories affected by removing old and applying new | no double counting; link preserved; all histories valid from earliest affected point; all derived views reconcile | Cross-boundary | replaced-event visibility; final correction coordination | Type change can alter the boundary set; mechanism requires later specification (PRD §16) |
| Restoration | restored Financial Event; every currently referenced and chronologically affected Account/Fund/Debt/Category | current dependencies valid; every invariant holds at every later point; Traceability preserved | Cross-boundary | Trash retention/manual deletion; archived-reference behavior in restoration details | Restoration may be blocked; implementation is not defined by product rules (PRD §16) |

Cross-boundary does not mean “eventually consistent,” “distributed,” or “one database transaction.” It means multiple candidate domain boundaries must participate in one indivisible business meaning.

## 16. Coordination Requirements

1. **One Financial Event, multiple financial effects.** A single Transfer, Fund Allocation, Fund Release, Fund-Linked Expense, or Debt Repayment must never produce only part of its confirmed meaning (PRD §11; DCM §8).
2. **Reference validation.** Event Type and required-reference shape belong with Financial Event, while availability, lifecycle, effective dates, and sufficient balances belong with referenced candidates (PRD §§11–16; DCM §§8, 13, 15).
3. **Account–Fund reconciliation.** Every change to one Account-backed allocation must preserve both the Account equation and Dedicated Fund's per-Account breakdown/Fund Balance (PRD §§9, 14).
4. **Account–Debt reconciliation.** Debt Repayment must preserve payment Account state and Debt Record principal together and remain one traceable Financial Event (PRD §§11, 15, 19).
5. **Two-sided Transfer.** Both Account effects remain linked through one Financial Event and must be edited, deleted, and restored together (PRD §§11, 16).
6. **Correction reversal and application.** Same-Type Edit, Event Replacement, Soft Deletion, and Restoration must identify every old and new affected boundary, reevaluate them from the earliest affected point, and reconcile all derived values (PRD §16).
7. **Reporting regrouping.** Reporting Period changes coordinate Workspace configuration with derived summaries without changing underlying Financial Events or financial state (PRD §17).
8. **Traceability reconciliation.** Summary, Supporting Records, and individual event explanation must describe the same effects across Account, Fund, Debt, report, and dashboard views (PRD §19).

These are product-domain participation requirements only. This section intentionally does not name a coordinator, service, command, event, message, process manager, transaction, or interface.

## 17. Candidate Aggregate Alternatives

| Model | Source support | Invariant protection | Correction complexity | Traceability implications | Oversized risk | Weak-consistency risk | Unresolved questions | Candidate assessment |
|---|---|---|---|---|---|---|---|---|
| Model 1 — One Workspace Financial Aggregate | Workspace contains all concepts (DCM §6) | Could evaluate every rule together | Conceptually centralized but every correction reaches a broad boundary | Easy to claim one history, but risks conflating Traceability with ownership | Very high | Low inside boundary, but size obscures meaningful locality | Whether containment truly means one consistency scope | Rejected Candidate baseline |
| Model 2 — Entity-Centered Aggregates | Candidate Entities have continuity (DOC §6) | Strong lifecycle locality | Cross-boundary effects and corrections require explicit participation | Clear identities and references | Moderate | High if each Entity is treated independently without operation-wide rules | Which Entities are roots; allocation responsibility | Alternative Candidate |
| Model 3 — Account-Centered Financial Aggregate | Most monetary invariants are Account-local (PRD §§9, 12) | Strong for Account state | Transfers split across two Accounts; fund/debt/event lifecycle awkward | Account values trace well; one general event identity is harder | High if all Account history is contained indefinitely | High at Fund/Debt joins | How one Financial Event spans Accounts/Funds/Debts | Alternative Candidate |
| Model 4 — Financial-Event-Centered Aggregate | One identity and correction lifecycle (PRD §§16, 19) | Strong for event shape, weak for historical financial state unless expanded | Natural correction focus; requires old/new downstream reevaluation | Strong event explanation | High if all referenced histories are absorbed | High if event effects are detached from balances | Whether Financial Event is a root and where balances are protected | Alternative Candidate |
| Model 5 — Hybrid Candidate Model | Combines source-supported localities (PRD §§9, 11–17; DCM §§7–15) | Account/Debt local rules plus explicit cross-boundary operation rules | Makes coordination hotspots explicit | Preserves one event identity and traceable derived values | Lower than Models 1, 3, 4 | Requires later precise behavior specification | Allocation responsibility, root roles, recalculation process, Reporting Period placement | Recommended candidate baseline |

The comparison is based on Annotasi Finance behavior, not generic domain-modeling preference. Model 5 is recommended provisionally because the sources show both strong local invariants and unavoidable cross-boundary operations.

## 18. Oversized-Aggregate Risks

| Oversized proposal | Product-domain risk | Source tension |
|---|---|---|
| Workspace contains all financial history | Every unrelated lifecycle, configuration, and financial change becomes one boundary concern; containment and privacy are mistaken for consistency | DCM §6 confirms containment, while PRD §§11–17 show narrower behaviors |
| Account contains all Financial Events indefinitely | One Transfer would belong to two Account histories while remaining one event; Fund and Debt identity become subordinate to Account | PRD §§11, 14–16; DOC §6 |
| Dedicated Fund contains events from every backing Account | A Fund spanning Accounts would absorb unrelated Account histories and balance rules | PRD §§9, 14; DCM §§7, 9 |
| One historical recalculation loads all Workspace history conceptually | Earliest-affected reevaluation is confused with reevaluating every unrelated history | PRD §16 requires affected history, not automatically all history |
| Reporting data included in write consistency boundaries | Derived summaries and dashboard values are treated as directly governed financial state rather than traceable results | PRD §§17–19; DCM §14; DOC §8 |

No performance benchmark or database assumption is needed to identify these product-domain size problems.

## 19. Undersized-Aggregate Risks

| Undersized proposal | Product-domain failure risk | Source |
|---|---|---|
| Every Financial Event fully independent from balances | An event could appear valid while making Account/Fund/Debt history invalid | PRD §§11–16 |
| Account-Backed Fund Allocation isolated from Account and Fund | Account equation and Fund breakdown could disagree; provenance becomes unexplained | PRD §§9, 14 |
| Transfer source and destination effects separated | One side could be changed, deleted, or restored without the other, contradicting one linked event | PRD §§11, 16 |
| Debt Repayment separated from Debt Record validation | Principal could fall below Rp0 or disagree with repayment history | PRD §§11, 15–16 |
| Fund-Linked Expense separated from matching allocation | Another Account's allocation might be consumed or the matching allocation could become negative | PRD §§11, 14, 16 |
| Derived balances directly writable as independent objects | Starting state, Financial Events, and displayed totals could disagree and lose Traceability | PRD §§9, 14, 15, 19 |
| Category treated as a text value on each event | Rename/archive continuity and historical resolvability would be lost | PRD §13; DOC §6 |

## 20. Aggregate Stress-Test Scenarios

Candidate root entry points below name domain concepts through which a change may need to be initiated or validated. They are not endpoints, commands, or interfaces.

| # | Scenario | Concepts involved | Candidate boundaries involved | Invariants involved | Consistency scope | Candidate root entry points | Cross-boundary coordination? | What remains open | Source reference |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | Income recorded into one Account | Income Financial Event, Account, Income Category | Financial Event, Account, Category | Account balances ≥ Rp0; equation; valid date; Category kind | One Account plus event/reference validity | Financial Event; Account; Category validation | Yes, small | Whether Financial Event is a root | PRD §11; DCM §16.1 |
| 2 | Ordinary Expense exceeding Unallocated Amount | Expense, Account, Expense Category | Financial Event, Account, Category | Unallocated Amount and Total Account Balance ≥ Rp0 | Account validation with event/reference | Financial Event; Account | Yes; operation is blocked | Root role only | PRD §§11–12; DCM §16.2 |
| 3 | Transfer between two Accounts | Transfer, source/destination Accounts | Financial Event, two Accounts | source Unallocated ≥ Rp0; both equations; valid dates; one linked event | Two Account histories plus one event lifecycle | Financial Event; source Account; destination Account | Yes | Source/destination distinctness and protection mechanism | PRD §§11, 16; DCM §16.3 |
| 4 | Fund Allocation from one Account | Fund Allocation, Account, Dedicated Fund, allocation | Financial Event, Account, Dedicated Fund | source Unallocated ≥ Rp0; Account equation; Fund breakdown | Account–Fund pair plus one event | Financial Event; Account; Dedicated Fund | Yes | Allocation responsibility/identity | PRD §§11, 14; DCM §16.4 |
| 5 | Dedicated Fund backed by two Accounts | Fund, two Accounts, two allocations/events | Dedicated Fund, two Accounts, Financial Events | each allocation ≥ Rp0; Fund Balance equals breakdown; both Account equations | Fund plus each backing Account | Dedicated Fund; each Account | Yes | Fund-side vs Account-side responsibility | PRD §14; DCM §16.5 |
| 6 | Fund Release from one selected Account | Fund Release, selected Account, Fund | Financial Event, Account, Dedicated Fund | release ≤ selected allocation; equation; Fund Balance | selected Account–Fund pair plus event | Financial Event; Account; Dedicated Fund | Yes | Allocation identity/responsibility | PRD §§11, 14; DCM §16.8 |
| 7 | Fund-Linked Expense using matching allocation | Expense, Account, Fund, Expense Category | Financial Event, Account, Dedicated Fund, Category | matching allocation and total ≥ Rp0; unallocated unchanged; expense counted once | Account–Fund pair plus event/category | Financial Event; Account; Dedicated Fund; Category validation | Yes | Allocation responsibility | PRD §§11, 14; DCM §16.6 |
| 8 | Fund-Linked Expense attempts another Account's allocation | Expense, payment Account, Fund, other backing Account | Financial Event, two Accounts, Dedicated Fund | no cross-account automatic consumption; matching allocation ≥ Rp0 | Payment Account's own pairing; blocked despite Fund total | Financial Event; payment Account; Dedicated Fund | Yes; validation blocks | None beyond ownership model | PRD §§11, 14; DCM §16.7 |
| 9 | Debt Repayment affects Account and Debt Record | Debt Repayment, payment Account, Debt Record | Financial Event, Account, Debt Record | payment Unallocated ≥ Rp0; principal ≥ Rp0; valid dates | Account and Debt histories plus event | Financial Event; Account; Debt Record | Yes | Root order/coordination mechanism | PRD §§11, 15; DCM §16.9 |
| 10 | Debt Repayment exceeds Outstanding Principal | repayment, Debt Record, payment Account | Financial Event, Debt Record, Account | principal ≥ Rp0 | Debt validation, with Account effect unapplied because blocked | Financial Event; Debt Record | Yes; operation is blocked | Future credit/refund policy outside v1 | PRD §15; UL §12 |
| 11 | Same-Type Edit changes event amount | existing Financial Event and affected roots | Financial Event plus existing referenced Accounts/Funds/Debts | all affected invariants from Event Date | Existing histories from earliest affected point | Financial Event; every affected root | Usually | Impact Preview threshold | PRD §16 |
| 12 | Same-Type Edit changes referenced Account | Financial Event, old/new Accounts, possibly Fund/Debt | Financial Event, both Accounts, other referenced roots | remove old/apply new; dates; balances/allocations | Old and new histories from earliest affected point | Financial Event; old Account; new Account; other roots | Yes | Archived/reference-selection details; root role | PRD §16; DCM §13 |
| 13 | Event Replacement changes Expense into Income | old Expense, new Income, Accounts, Categories, optional Fund | old/new Financial Events; old/new Accounts/Categories/Fund | reverse old/apply new; no double count; link; all invariants | Every old and new affected boundary | old Financial Event; new Financial Event; affected roots | Yes | Replaced-event visibility | PRD §16; DCM §16.13 |
| 14 | Soft Deletion of a backdated Transfer | Transfer, two Accounts, Trash | Financial Event, two Accounts | reverse both sides together; all later points valid | Two histories from Transfer date | Financial Event; both Accounts | Yes | Trash retention/manual deletion | PRD §16 |
| 15 | Restoration after later dependent events exist | Trashed event and current dependencies | Financial Event plus all referenced/affected roots | every invariant at every later point; reference availability | Potentially multiple histories; restoration may block | Financial Event; each affected root | Yes | Detailed archived-reference behavior | PRD §16; DCM §16.12 |
| 16 | Opening Balance reduction affects later history | Account opening state and later events/funds/debts | Account plus downstream affected candidates | Account equation and non-negativity throughout | Account history from opening point; cross-boundary where later events span roots | Account; affected roots | Potentially | Exact Impact Preview threshold | PRD §§12, 16 |
| 17 | Account archival at non-zero Total Account Balance | Account, Archive, possible Fund allocations | Account; referenced Fund only for next-step explanation | Total Account Balance must equal Rp0 | Account-local eligibility; action blocked | Account | No for eligibility; later user-chosen changes may coordinate | None | PRD §12; DCM §16.14 |
| 18 | Reporting Period change requiring Impact Preview | Workspace, Reporting Period, reports, events | Workspace candidate plus derived reporting | one active cycle; exact ranges; Event Dates unchanged; Traceability | Workspace configuration and derived regrouping only | Workspace | No financial-state coordination; derived reporting reevaluation required | Placement of config; application timing; preview threshold | PRD §17; UL §10 |

These scenarios show that cross-boundary coordination is common but selective: it follows one logical operation's affected concepts, not every concept in the Workspace.

## 21. Explicit Non-Decisions

This document does not decide:

- final Aggregate boundaries;
- final Aggregate Roots;
- persistence transaction boundaries;
- database transaction model;
- repositories or repository ownership;
- identifiers or keys;
- tables, documents, or schemas;
- ORM ownership;
- APIs;
- commands;
- domain events;
- application services;
- domain services;
- orchestration;
- messaging;
- sagas;
- event sourcing;
- CQRS;
- projections;
- caches;
- framework modules;
- deployment units;
- locking;
- concurrency-control implementation;
- distributed transactions;
- inheritance or composition;
- deterministic same-date ordering mechanism.

It also does not infer immutable implementation for Financial Event, persistence ownership for Account-Backed Fund Allocation, or a universal restoration state machine.

## 22. Still-Open Aggregate Questions

1. Whether Workspace is an Aggregate Root or ownership/scope boundary only.
2. Whether Workspace should root selected configuration without owning financial changes.
3. Whether Financial Event is an Aggregate Root.
4. Whether Account owns current Account-Backed Fund Allocation state.
5. Whether Dedicated Fund owns its cross-account allocation breakdown.
6. Whether Account-Backed Fund Allocation requires independent identity.
7. Whether Reporting Period configuration belongs inside Workspace's consistency boundary.
8. Whether Category is independent or Workspace-owned configuration.
9. How one logical Transfer protects both Account sides.
10. Whether a Transfer's source and destination Accounts must differ.
11. How one logical Debt Repayment protects both Account and Debt Record.
12. How correction/recalculation coordinates multiple candidate boundaries.
13. Whether full historical recalculation belongs to one boundary or is a cross-boundary domain process.
14. How Traceability relates to boundaries without becoming one giant audit Aggregate.
15. Whether archived Accounts remain in historical Workspace/reporting totals.
16. Whether users may exclude Accounts from Workspace totals.
17. Whether Category names must be unique within kind.
18. Whether Account names must be unique and whether post-onboarding rename is supported.
19. Whether Dedicated Fund names must be unique and whether rename is supported.
20. Whether archived Dedicated Funds can be restored and whether non-zero archival may be blocked.
21. Whether Target Amount may change/remove after history and whether goal completion is explicit or derived.
22. Whether debt status is explicit or derived and how creditor/lender information is structured.
23. Whether replaced events appear in ordinary history, and the exact Trash/manual-deletion behavior.
24. The exact Impact Preview threshold and deterministic same-date ordering mechanism.

All remain protected questions. This document does not answer implementation questions or silently resolve any source-level uncertainty (`PROJECT_STATE.md` §8; DCM §18; DOC §19; PRD §28).

## 23. Recommended Candidate Baseline

The cautious recommendation is **Model 5 — Hybrid Candidate Model**:

- **Strong Candidate Aggregates:** Account and Debt Record.
- **Plausible Candidate Aggregates:** Workspace for ownership plus selected configuration, Financial Event, Category, and Dedicated Fund.
- **Weak independent candidate:** Reporting configuration; it is more plausibly inside Workspace's candidate boundary, while its final modeling form remains open.
- **Rejected candidate baseline:** one Workspace Aggregate containing all financial history and configuration.
- **Alternative candidates retained for comparison:** Workspace as scope only, Account-centered financial history, Financial-Event-centered effects, and fully entity-centered separation.

Why not one giant Workspace Aggregate: Workspace is the confirmed ownership/isolation scope, but the sources show narrower local rules around Account balance, Debt principal, Category lifecycle, Fund lifecycle/breakdown, and Financial Event identity. Treating all containment as one consistency boundary would make unrelated changes share one oversized domain scope and would conflate affected historical recalculation with all Workspace history (PRD §§9, 11–17; DCM §§6–15).

Where coordination is unavoidable: Transfer spans two Accounts; Fund Allocation, Fund Release, and Fund-Linked Expense span Account and Dedicated Fund; Debt Repayment spans Account and Debt Record; each also retains one Financial Event identity. Corrections and Restoration may reverse and reapply effects across every old and new affected candidate. Traceability reconciles these effects in derived views (PRD §§11, 14–16, 19).

Domain consistency and persistence transactions remain distinct. This baseline says which domain state must be considered together for one logical operation; it does not say how data is stored, loaded, locked, or committed.

The candidate baseline requires further detailed behavior specification before final domain approval, especially for candidate root participation, allocation responsibility, reference and lifecycle edge cases, cross-boundary correction behavior, and deterministic same-date ordering.

Architecture follows the sufficiently approved domain model and translates it into implementation structures. It must not silently redefine aggregate boundaries for persistence convenience, framework convenience, or deployment convenience. A later architectural discovery may trigger an explicit return to domain review, but Architecture itself does not finalize, replace, or override domain decisions. This document does not begin that downstream work.

## 24. PRD Traceability

| Major analysis section | Targeted PRD support | Ubiquitous Language support | Domain Concept Model support | Domain Object Candidates support |
|---|---|---|---|---|
| Workspace (§6) | §§9, 17; ownership context §§6, 20 | §§5, 10 | §§6, 12 | §§6, 10, 14, 19 |
| Account (§7) | §§9, 11, 12, 14, 16 | §§7, 11, 12 | §§7–8, 13, 15 | §§6, 8, 12 |
| Financial Event (§8) | §§9, 11, 16, 19 | §§5–6, 11 | §§8, 13–15 | §§6, 9, 11–13 |
| Category (§9) | §§9, 13 | §5 | §§11, 13, 15 | §§6, 9, 15–16, 19 |
| Dedicated Fund (§10) | §§9, 11, 14, 16 | §§7–8, 11–12 | §§7–9, 13, 15 | §§6, 8, 12, 19 |
| Debt Record (§11) | §§11, 15, 16 | §§9, 11–12 | §§8, 10, 13, 15 | §§6, 8, 11, 19 |
| Reporting/derived values (§12) | §19; required context §17 | §§5, 7–10 | §§12, 14 | §§8, 10–13, 19 |
| Correction/recalculation (§13) | §§12, 14, 15, 16 | §§11–12 | §§13, 15–16 | §§6, 10–13, 16–17 |
| Local/cross invariants (§§14–15) | §§9, 11, 12, 14, 15, 16, 19 | §§7–12 | §§7–10, 14–15 | §§8, 10, 12–13 |
| Coordination/alternatives/risks (§§16–19) | §§9, 11–16, 19 | §§5–12 | §§6–17 | §§4–19 |
| Stress tests (§20) | §§11–17, 19 | §§6–12 | §§15–16 | §§15–17 |
| Open questions/baseline (§§22–23) | §§12–17, 19; protected questions §28 | §§10–12, 16 | §18 | §§14, 19 |

Every major candidate conclusion is supported by the cited authoritative requirements, canonical terminology, confirmed relationships, and prior candidate classifications. Supplemental PRD §17 was necessary for Reporting Period analysis; PRD §28 was necessary to preserve affected open questions. Neither changes the requested priority of targeted §§9, 11–16, and 19.
