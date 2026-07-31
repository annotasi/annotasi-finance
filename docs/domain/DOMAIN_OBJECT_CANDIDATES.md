# Annotasi Finance — Domain Object Candidates

## 1. Document Status

- **Status:** Draft for domain-modeling review
- **Scope:** Annotasi Finance Private Beta MVP
- This document assigns **candidate** product-level classifications (Candidate Entity, Candidate Value Object, Derived Value, Classification/Enumeration Candidate, Configuration/Policy Candidate, Lifecycle State Candidate, Relationship Concept Candidate, Not a Domain Object, Still Open) to every canonical concept in `docs/domain/UBIQUITOUS_LANGUAGE.md` and `docs/domain/DOMAIN_CONCEPT_MODEL.md`.
- **Every classification in this document is a candidate, not a final decision.** No Aggregate, Aggregate Root, Domain Service, Repository, Command, Domain Event, or Bounded Context is assigned anywhere in this document. No database identifier, key type, persistence mechanism, API contract, or framework choice is made.
- This document does not rename any canonical term from `UBIQUITOUS_LANGUAGE.md` and does not alter any relationship confirmed in `DOMAIN_CONCEPT_MODEL.md`.
- **Unresolved PRD, Ubiquitous Language, and Domain Concept Model questions remain unresolved.** Where the approved sources do not support a safe classification, this document says so and marks it Still Open.

---

## 2. Purpose

This document is the next step after the Domain Concept Model in CLAUDE.md §5's workflow. Its job is to:

- Assess, one concept at a time, whether each confirmed domain concept behaves more like something with independent identity (a Candidate Entity), something defined purely by its value (a Candidate Value Object), a computed number (a Derived Value), a closed descriptive set (a Classification/Enumeration Candidate), a confirmed rule or workspace choice (a Configuration/Policy Candidate), a named lifecycle state (a Lifecycle State Candidate), a concept whose meaning exists only through a relationship (a Relationship Concept Candidate), or not a domain object at all.
- Keep every classification explicitly provisional — a starting point for later Entity/Value-Object/Aggregate refinement, not that refinement itself.
- Preserve every open product question rather than resolving it through a classification choice.
- Stress-test candidate classifications against concrete scenarios, using the `domain-modeling` skill's scenario technique.

This document does **not** decide aggregate boundaries, consistency boundaries, persistence, identifiers, APIs, or any other implementation concern.

---

## 3. Source of Truth and Decision Rules

**Priority order for this document:**

1. Confirmed requirements in `docs/product/ANNOTASI_FINANCE_MVP_PRD.md`
2. Approved principles in `docs/product/PRODUCT_IDENTITY.md`
3. Working rules in `CLAUDE.md`
4. Canonical terminology in `docs/domain/UBIQUITOUS_LANGUAGE.md`
5. Confirmed relationships in `docs/domain/DOMAIN_CONCEPT_MODEL.md`
6. This Session 16 specification
7. Generic procedural guidance from the project-local `domain-modeling` skill

Higher-priority sources always override the skill.

**How the `domain-modeling` skill is used, and how it is not:**

- **Adopted, as procedural technique only:** challenging candidate classifications against the approved glossary and concept model, sharpening identity-versus-value language ("is this the same concept because of who it is, or because of what value it holds?"), testing candidate classifications with concrete scenarios (§17), and detecting concepts that should not yet be classified (routed to Still Open, §14 and §19).
- **Not adopted:** the skill's default artifact paths (`CONTEXT.md`, `CONTEXT-MAP.md`, `docs/adr/`) — none are created. The skill's "be opinionated, pick a winner" default is suspended for anything the PRD, `UBIQUITOUS_LANGUAGE.md`, or `DOMAIN_CONCEPT_MODEL.md` mark Candidate, Still open, Hypothesis, Future only, or Excluded from v1. No entity/value-object classification is forced where the approved sources do not clearly support one — such concepts are marked Still Open instead.

---

## 4. Classification Principles

The following product-level definitions are used throughout this document, taken from the Session 16 specification:

- **Candidate Entity:** must remain distinguishable from other instances over time; its history or lifecycle matters; two instances with identical visible attributes may still represent different domain things; corrections, archival, restoration, replacement, or historical references may need to preserve its continuity. No database ID, UUID, primary key, or class is inferred.
- **Candidate Value Object:** defined by its value and meaning rather than independent identity; two instances with the same valid value are interchangeable in domain meaning; validation and immutability matter more than lifecycle; it can describe another concept without its own independent history. No implementation type, struct, record, embeddable, or table is inferred.
- **Derived Value:** calculated from starting state and Financial Events; not directly edited as an independent domain object.
- **Classification/Enumeration Candidate:** a small, closed descriptive set whose members classify another concept. No programming-language enum is chosen.
- **Configuration/Policy Candidate:** a confirmed product rule or workspace-level choice that controls behavior, but is not necessarily an Entity or Value Object.
- **Lifecycle State Candidate:** a named state describing where another concept currently is in its confirmed lifecycle.
- **Relationship Concept Candidate:** a concept whose meaning exists through a relationship between two or more domain concepts, such as Account-Backed Fund Allocation. Whether it is implemented as its own Entity, Value Object, or internal Aggregate component is not decided here.
- **Not a Domain Object:** a product name, umbrella term, analytical label, process, behavior, requirement, or other concept that should not be forced into Entity or Value Object classification.
- **Still Open:** used when the approved sources do not yet support a safe classification.

---

## 5. Classification Summary

One row per required concept (54 total). "Candidate Status" describes how settled the classification itself is, independent of the "Primary Classification" category. Full reasoning for each concept appears in §6–§13.

| Concept | Primary Classification | Candidate Status | Identity Required? | Independent Lifecycle? | Defined by Value? | Directly Edited or Derived? | Key Reason | PRD / Domain Reference | Notes or Open Risk |
|---|---|---|---|---|---|---|---|---|---|
| Annotasi Finance | Not a Domain Object | Not a candidate — product name | No | No | No | N/A | Product/umbrella name for the whole system | PRODUCT_IDENTITY.md §1; PRD §2 | — |
| User | Candidate Entity | Strong candidate | Yes | Yes | No | N/A (identity-bearing) | Distinct authenticated identity persisting over time; owns exactly one Workspace continuously | PRD §6, §20 | Authentication mechanism not addressed — out of scope |
| Workspace | Candidate Entity | Strong candidate | Yes | Yes | No | N/A (identity-bearing) | Persistent financial context whose continuity underlies all history | PRD §6, §20 | Workspace-level deletion not addressed by PRD |
| Single-Owner Workspace | Configuration/Policy Candidate | Candidate | No | No | No | Fixed policy | Confirmed v1 ownership policy constraining Workspace, not an object itself | PRD §6 | Future household collaboration excluded from v1 |
| Account | Candidate Entity | Strong candidate | Yes | Yes | No | N/A (identity-bearing) | Must remain distinguishable across renames, archival, and all historical references | PRD §12 | Name-uniqueness not confirmed — Still Open |
| Account Type | Classification/Enumeration Candidate | Strong candidate | No | No | No | N/A (classifier) | Fixed four-member descriptive set; never changes financial semantics | PRD §12, §22 | Candidate Bahasa Indonesia labels pending review |
| Opening Balance | Candidate Value Object | Candidate | No | No | Yes | Directly edited (via its own correction flow) | Defined by its monetary amount; validated ≥ Rp0; correctable by value replacement, not by creating a new Account | PRD §9, §12 | — |
| Opening-Balance Effective Date | Candidate Value Object | Candidate | No | No | Yes | Directly edited (via Impact Preview flow) | Defined by its date value; validated against Event Dates; replaceable without changing Account identity | PRD §12, §15 | Impact Preview threshold Still Open |
| Total Account Balance | Derived Value | Strong candidate | No | No | No | Derived | Computed from Opening Balance plus all subsequent Financial Events | PRD §9, §12 | — |
| Unallocated Amount | Derived Value | Strong candidate | No | No | No | Derived | Computed as Total Account Balance minus current Account-Backed Fund Allocations | PRD §9, §12 | — |
| Workspace Total Balance | Derived Value | Strong candidate | No | No | No | Derived | Sum of Total Account Balance across active Accounts | PRD §12, §18 | Archived-account inclusion Still Open |
| Financial Event | Candidate Entity | Strong candidate | Yes | Yes | No | N/A (identity-bearing) | Two events with identical fields may still be distinct; identity must survive Same-Type Edit and Chronological Recalculation | PRD §9, §11, §16 | See Financial Event Special Analysis (§6) |
| Event Type | Classification/Enumeration Candidate | Strong candidate | No | No | No | N/A (classifier) | Closed six-member set classifying a Financial Event instance | PRD §9, §11 | — |
| Event Date | Candidate Value Object | Candidate | No | No | Yes | Directly edited (via Same-Type Edit) | Defined by its date value; replacing it does not change which Financial Event it belongs to | PRD §12, §16, §17 | — |
| Created Timestamp | Candidate Value Object | Candidate | No | No | Yes | Set once, not edited | Immutable point-in-time metadata value | PRD §16 | — |
| Updated Timestamp | Candidate Value Object | Candidate | No | No | Yes | System-managed (replaced automatically on each change; not user-edited) | System-managed metadata value, replaced whenever the Financial Event changes | PRD §16 | — |
| Income | Classification/Enumeration Candidate | Strong candidate (dual nature) | No (as classifier) | No | No | N/A | Event Type member; also informally denotes a Financial Event whose type is Income | PRD §11, §24 | See Financial Event Special Analysis (§6) |
| Expense | Classification/Enumeration Candidate | Strong candidate (dual nature) | No (as classifier) | No | No | N/A | Event Type member; also informally denotes a Financial Event whose type is Expense | PRD §11, §24 | See Financial Event Special Analysis (§6) |
| Ordinary Expense | Classification/Enumeration Candidate | Strong candidate | No | No | No | N/A (classifier) | Secondary classifier of Expense: no Dedicated Fund reference present | PRD §11 | Not part of the six-member Event Type set |
| Fund-Linked Expense | Classification/Enumeration Candidate | Strong candidate | No | No | No | N/A (classifier) | Secondary classifier of Expense: exactly one Dedicated Fund reference present | PRD §11, §14 | Not part of the six-member Event Type set |
| Transfer | Classification/Enumeration Candidate | Strong candidate (dual nature) | No (as classifier) | No | No | N/A | Event Type member; also informally denotes the linked Financial Event moving money between two Accounts | PRD §11, §24 | Source/destination distinctness Still Open |
| Fund Allocation | Classification/Enumeration Candidate | Strong candidate (dual nature) | No (as classifier) | No | No | N/A | Event Type member; also informally denotes the Financial Event reserving money to a fund | PRD §11, §14, §24 | — |
| Fund Release | Classification/Enumeration Candidate | Strong candidate (dual nature) | No (as classifier) | No | No | N/A | Event Type member; also informally denotes the Financial Event releasing an allocation | PRD §11, §14, §24 | — |
| Debt Repayment | Classification/Enumeration Candidate | Strong candidate (dual nature) | No (as classifier) | No | No | N/A | Event Type member; also informally denotes the Financial Event reducing Outstanding Principal | PRD §11, §15, §24 | — |
| Category | Candidate Entity | Strong candidate | Yes | Yes | No | N/A (identity-bearing) | Historical Income/Expense references must survive rename/archive; name alone is unsafe for identity | PRD §13 | Name-uniqueness within a kind Still Open |
| Income Category | Classification/Enumeration Candidate | Candidate | No | No | No | N/A (kind tag) | Denotes "the Income kind" a Category instance belongs to, not a fixed enumeration of every user-defined category | PRD §13 | Starter set/wording Candidate terminology |
| Expense Category | Classification/Enumeration Candidate | Candidate | No | No | No | N/A (kind tag) | Denotes "the Expense kind" a Category instance belongs to, not a fixed enumeration of every user-defined category | PRD §13 | Starter set/wording Candidate terminology |
| Dedicated Fund | Candidate Entity | Strong candidate | Yes | Yes | No | N/A (identity-bearing) | Allocation/release/expense history accumulates against it over time; continuity must survive archival | PRD §9, §14 | Name-uniqueness Still Open; restore behavior Still Open |
| Financial Goal | Not a Domain Object | Not a candidate — descriptive label | No | No | No | N/A | Not a separate identity from Dedicated Fund; see Financial Goal Special Analysis (§6) | PRD §14 | Do not classify separately per Session 16 instruction |
| Target Amount | Candidate Value Object | Candidate | No | No | Yes | User-supplied; change/removal after allocation history Still Open | Optional monetary marker on a Dedicated Fund; not a hard cap | PRD §14 | Change/removal after history exists Still Open |
| Account-Backed Fund Allocation | Relationship Concept Candidate | Strong candidate | Still Open (independent identity undecided) | N/A | N/A | Amount is derived | Meaning arises from one Account–Dedicated Fund pairing; whether the relationship requires independent identity remains open | PRD §9, §14 | See Relationship Concept Candidates (§12) |
| Fund Balance | Derived Value | Strong candidate | No | No | No | Derived | Sum of a Dedicated Fund's Account-Backed Fund Allocations across all backing Accounts | PRD §14, §18 | — |
| Debt Record | Candidate Entity | Strong candidate | Yes | Yes | No | N/A (identity-bearing) | Repayments reference it continuously; must remain distinguishable even with identical visible attributes | PRD §15 | Name-uniqueness Still Open |
| Opening Outstanding Principal | Candidate Value Object | Candidate | No | No | Yes | Directly edited (via Impact Preview flow) | Defined by its monetary amount alone; its associated effective date is a separate value | PRD §15 | — |
| Outstanding Principal | Derived Value | Strong candidate | No | No | No | Derived | Computed from Opening Outstanding Principal and all valid Debt Repayments | PRD §15, §16 | Active/Paid-Off status Still Open |
| Reporting Period | Configuration/Policy Candidate | Candidate, modeling form open | No | No | Partially | Configuration choice | The one active configuration (Calendar Month or a Custom Monthly Cycle) per Workspace | PRD §17 | Whether best modeled as value/config pair Still Open |
| Calendar Month | Configuration/Policy Candidate | Strong candidate | No | No | No | Fixed default | Default Reporting Period requiring no setup | PRD §17 | — |
| Custom Monthly Cycle | Configuration/Policy Candidate | Candidate | No | No | Partially | Configuration choice (single start day, 1–28) | Workspace-selected alternative to Calendar Month | PRD §17 | Also has Value-Object-like characteristics (see §10) |
| Asia/Jakarta Workspace Timezone | Configuration/Policy Candidate | Strong candidate | No | No | No | Fixed policy | Fixed for all v1 workspaces; not user-configurable | PRD §17, §21 | — |
| Incomplete Period | Lifecycle State Candidate | Strong candidate | No | No | No | Derived flag | Named state describing a Reporting Period's tracking completeness | PRD §17 | — |
| Correction | Not a Domain Object | Not a candidate — umbrella process | No | No | No | N/A | Umbrella behavior covering Same-Type Edit, Event Replacement, Soft Deletion, Restoration, Opening Balance correction | PRD §16 | — |
| Same-Type Edit | Not a Domain Object | Not a candidate — process | No | No | No | N/A | A behavior applied to a Financial Event, not an object itself | PRD §16 | — |
| Event Replacement | Not a Domain Object | Not a candidate — process; link discussed separately | No | No | No | N/A | The guided correction flow/process; its resulting link is discussed in §12 | PRD §16 | — |
| Soft Deletion | Not a Domain Object | Not a candidate — process | No | No | No | N/A | The act of moving a Financial Event to Trash | PRD §16 | — |
| Trash | Lifecycle State Candidate | Strong candidate | No | No | No | Resulting state | Named recoverable state a Financial Event occupies after Soft Deletion | PRD §16 | Retention period Still Open |
| Restoration | Not a Domain Object | Not a candidate — process | No | No | No | N/A | The act of reapplying a Trashed event's effect | PRD §16 | — |
| Archive | Lifecycle State Candidate | Candidate, dual action/state | No | No | No | Resulting state (and naming the action) | Names both the archiving action and the resulting excluded-from-new-events state, depending on concept | PRD §12, §13, §14 | Exact implementation undecided |
| Permanent Deletion | Not a Domain Object | Not a candidate — process | No | No | No | N/A | An irreversible action, gated by no-history preconditions | PRD §12, §13, §14 | — |
| Chronological Recalculation | Not a Domain Object | Not a candidate — process/requirement | No | No | No | N/A | The recalculation process/requirement itself, not an object | PRD §9, §16 | Distinguished from Financial Invariant (the rules it enforces) |
| Deterministic Same-Date Ordering | Configuration/Policy Candidate | Candidate, mechanism deferred | No | No | No | Requirement, mechanism deferred | Confirmed requirement for determinism; exact ordering mechanism not decided | PRD §16 | Mechanism Still Open |
| Impact Preview | Configuration/Policy Candidate | Candidate, threshold open | No | No | No | Requirement | Required confirmation step for material historical changes | PRD §12, §15, §17 | Exact trigger threshold Still Open |
| Traceability | Not a Domain Object | Not a candidate — requirement | No | No | No | N/A | Cross-cutting product requirement ("explain every important number") | PRD §19 | — |
| Supporting Record | Not a Domain Object | Not a candidate — relationship, discussed in §12 | No | No | No | N/A | Names the relationship between a summary number and the records that produced it | PRD §19 | See Relationship Concept Candidates (§12) |
| Financial Invariant | Configuration/Policy Candidate | Strong candidate | No | No | No | Fixed rule set | Confirmed correctness rules constraining all financial state | PRD §9, §16 | — |

**Total: 54 concepts classified.**

---

## 6. Candidate Entities

For each Candidate Entity: why identity matters, what makes instances distinct, confirmed lifecycle, reference continuity, whether visible attributes may change without changing identity, deletion behavior, and what remains unknown. No identifier field or type is assigned to any of these.

### User
- **Why identity matters:** A User is the persistent authenticated identity that owns a Workspace continuously; the Workspace's entire lifetime is tied to this one User (PRD §6).
- **What makes instances distinct:** Not confirmed by name or email alone in this document's scope — the PRD does not specify uniqueness rules here; distinctness is simply that each registered User is a separate person (PRODUCT_IDENTITY.md §3).
- **Confirmed lifecycle:** registration, email verification, ongoing use, session/authentication events (PRD §20) — no deletion behavior for the User concept itself is addressed by the PRD (only account-deletion *request* paths are mentioned, with retention/export deferred).
- **Reference continuity:** the User-to-Workspace ownership link remains resolvable for the life of the Workspace.
- **Visible attributes may change without changing identity:** plausible (e.g., password reset, session changes) but not explicitly addressed by the PRD at the domain-concept level.
- **Deletion:** an account-deletion request path exists; exact behavior (retention/export specifics) is deferred (PRD §20).
- **Still unknown:** authentication/authorization mechanics are entirely out of this document's scope.

### Workspace
- **Why identity matters:** All financial history (accounts, funds, debts, events) is scoped to one continuously-existing Workspace; losing that continuity would break every historical reference described in `DOMAIN_CONCEPT_MODEL.md`.
- **What makes instances distinct:** each Workspace belongs to exactly one owning User (PRD §6); the PRD does not describe a Workspace-level name or other visible attribute distinguishing one Workspace from another.
- **Confirmed lifecycle:** created for a User, holds Accounts/Categories/Dedicated Funds/Debt Records/Financial Events/Reporting Period configuration continuously (PRD §6, §9).
- **Reference continuity:** every Account, Category, Dedicated Fund, Debt Record, and Financial Event's currently recorded Workspace reference remains resolvable, for the life of that record.
- **Visible attributes may change without changing identity:** not addressed — the PRD does not describe editable Workspace-level attributes beyond its Reporting Period configuration, which is itself a separate concept (§13).
- **Deletion:** not addressed by the PRD at all — Workspace-level deletion is out of scope for this document.
- **Still unknown:** whether a Workspace has any user-facing name or identifying attribute of its own.

### Account
- **Why identity matters:** Total Account Balance, Unallocated Amount, and every Account-Backed Fund Allocation are computed against one specific, continuously-existing Account; Financial Events reference it by identity, not by its current name or type (PRD §12).
- **What makes instances distinct:** not by name alone — name cannot safely define identity, and the PRD does not confirm uniqueness; whether duplicate visible names are allowed remains open (§19). Distinctness is that each represents a separately-tracked money-holding location the user set up.
- **Confirmed lifecycle:** created with a name, Account Type, Opening Balance, and Opening-Balance Effective Date; used for Financial Events; archived at exactly Rp0 Total Account Balance; restored to active use (confirmed); permanently deleted only if never used (PRD §12).
- **Reference continuity:** every Financial Event and Account-Backed Fund Allocation currently referencing this Account remains resolvable across its entire history, including after archival (`DOMAIN_CONCEPT_MODEL.md` §13, §15).
- **Visible attributes may change without changing identity:** renaming is confirmed at onboarding (choosing/renaming the suggested default name, PRD §10); whether renaming is available after Financial Events exist is not explicitly confirmed elsewhere in the PRD — see §14.
- **Deletion:** Archive/Permanent Deletion distinction confirmed — Archive requires exactly Rp0 Total Account Balance; Permanent Deletion requires never having been used, an Rp0 opening balance, and no history (PRD §12).
- **Still unknown:** whether Account names must be unique within a Workspace (§19).

### Financial Event
- **Why identity matters:** the entire correction model (Same-Type Edit vs. Event Replacement), Traceability, and Chronological Recalculation all depend on a Financial Event remaining "the same event" through edits, and on a *different* Financial Event being created through Event Replacement (PRD §16, §19).
- **What makes instances distinct:** not by field equality — two Financial Events can share identical amount, date, account, and category and still be two separate, individually traceable events (see §15, Identity and Equality Analysis).
- **Confirmed lifecycle:** created (with exactly one Event Type, one Event Date, Created/Updated Timestamps); edited via Same-Type Edit; replaced via Event Replacement; soft-deleted to Trash; restored; all subject to Chronological Recalculation (PRD §16).
- **Reference continuity:** its currently recorded Account(s), Category (if Income/Expense), Dedicated Fund (if referenced), and Debt Record (if a Debt Repayment) remain resolvable after the referenced concept is later archived (`DOMAIN_CONCEPT_MODEL.md` §15). A Same-Type Edit may replace the currently recorded reference where permitted (PRD §16); Event Replacement instead preserves the link between the old and new Financial Event rather than editing a reference in place. This document does not require or imply a full field-level history of every reference a Financial Event has carried before a Same-Type Edit — that is an audit-log question outside this document's scope.
- **Visible attributes may change without changing identity:** yes, via Same-Type Edit — amount, date, account, category/fund/debt reference, and note may all change while it remains the same event (PRD §16).
- **Deletion:** Soft Deletion only, with a Trash/Restoration cycle; no confirmed Permanent Deletion mechanism for Financial Events specifically (PRD §16).
- **Still unknown:** exact Trash retention period; whether manual Permanent Deletion from Trash exists in v1 (§19).

#### Financial Event Special Analysis

- **Financial Event is the general candidate identity-bearing concept.** It is the one Candidate Entity in this family.
- **Income, Expense, Transfer, Fund Allocation, Fund Release, and Debt Repayment are type-specific forms of that concept, not separately identified concepts.** An "Income" is simply a Financial Event whose Event Type is Income; its identity is the Financial Event's identity, not a separate one. This is why these six are classified in §9 as Classification/Enumeration Candidates (Event Type members) rather than as additional Candidate Entities.
- **Ordinary Expense and Fund-Linked Expense are forms of Expense, distinguished by whether a Dedicated Fund reference is present — not separately identified concepts.** Both remain the same Financial Event/Expense; the distinction is a secondary classifier, not an identity difference.
- No inheritance, composition, class hierarchy, union type, table, or polymorphic persistence is chosen here — only the product-level observation that identity is carried once, by Financial Event, and Event Type (plus the fund-reference distinction for Expense) classifies which form it currently takes.

### Category
- **Why identity matters:** historical Income/Expense events must keep referencing the same Category even after it is renamed or archived (PRD §13).
- **What makes instances distinct:** not by visible label alone — label cannot safely define identity, and the PRD does not confirm uniqueness; whether duplicate visible labels are allowed remains open (§19).
- **Confirmed lifecycle:** created, renamed, archived/hidden, restored (all confirmed, PRD §13); permanently deleted only if unused.
- **Reference continuity:** every Income/Expense event's currently recorded Category reference remains resolvable, even after the Category is archived.
- **Visible attributes may change without changing identity:** yes — rename is explicitly confirmed (PRD §13).
- **Deletion:** Permanent Deletion allowed only for unused Categories; Categories with transaction history must be archived, not deleted (PRD §13).
- **Still unknown:** whether Category names must be unique within their Income/Expense kind (§19).

### Dedicated Fund
- **Why identity matters:** Fund Allocation, Fund Release, and Fund-Linked Expense events, and every Account-Backed Fund Allocation, accumulate against one continuously-existing Dedicated Fund over time (PRD §14).
- **What makes instances distinct:** not by name alone — name cannot safely define identity, and the PRD does not confirm uniqueness; whether duplicate visible names (e.g., two funds both named "Qurban") are allowed remains open (§19).
- **Confirmed lifecycle:** created (name, optional Target Amount, optional target date, optional note); accumulates Account-Backed Fund Allocations; archived (preserves all history); permanently deleted only with zero balance and zero event history (PRD §14).
- **Reference continuity:** every Fund Allocation, Fund Release, and Fund-Linked Expense event's currently recorded reference to it remains resolvable across its entire history.
- **Visible attributes may change without changing identity:** a name change is not explicitly addressed by the PRD for Dedicated Fund (unlike Category, which explicitly confirms rename) — see §14. Adding a Target Amount does not change its identity; if changing or removing a Target Amount is ever permitted, that too would not change the Dedicated Fund's identity — but whether such changes are permitted after allocation history exists remains open (§14, §19; §9 below).
- **Deletion:** Archive preserves history; a non-zero-balance fund's archival requires a warning and explicit resolution; Permanent Deletion only with zero balance and zero history (PRD §14).
- **Still unknown:** name uniqueness; restore-to-active-use behavior after archiving; non-zero archival blocking behavior (§19).

#### Financial Goal Special Analysis

- **Dedicated Fund and Financial Goal are one underlying concept** (PRD §14). A Dedicated Fund behaves as a Financial Goal when a Target Amount is present.
- **Financial Goal is not classified as a separate Candidate Entity.** The approved sources do not support separate identity for it — there is no confirmed Financial Goal creation, lifecycle, or reference distinct from the Dedicated Fund it describes. It is classified in §5 and §13 as Not a Domain Object: a descriptive label for "a Dedicated Fund with a Target Amount present," sharing the Dedicated Fund's identity entirely.
- **Target Amount presence does not create a new Candidate Entity.** Adding a Target Amount to a Dedicated Fund does not change its identity. If changing or removing a Target Amount is ever permitted, doing so would likewise not change the Dedicated Fund's identity — but whether such changes are permitted after allocation history exists remains explicitly Still Open (PRD §14, §28; §19). This document does not label the add/change/remove operations themselves as Confirmed — only the identity consequence (that the Dedicated Fund remains the same identity regardless) is stated with confidence.

### Debt Record
- **Why identity matters:** every Debt Repayment references one specific, continuously-existing Debt Record; Outstanding Principal is computed against that one record over its entire history (PRD §15).
- **What makes instances distinct:** not by name alone — the PRD does not confirm uniqueness of debt names.
- **Confirmed lifecycle:** created (name, Opening Outstanding Principal, effective date, optional note), possibly inline during a Debt Repayment flow; accumulates Debt Repayments; continues to exist after Outstanding Principal reaches Rp0 (see §16, test 10); deletion is blocked while repayment events reference it (PRD §15).
- **Reference continuity:** every Debt Repayment's currently recorded reference to it remains resolvable across its entire history.
- **Visible attributes may change without changing identity:** moving the Opening Outstanding Principal or its effective date is confirmed, via an Impact Preview and Chronological Recalculation (PRD §15); this does not change which Debt Record it is.
- **Deletion:** deleting a Debt Record is blocked while repayment events still reference it (PRD §15); no confirmed Permanent Deletion path is described for Debt Records with history.
- **Still unknown:** whether creditor/lender name is a separate field; whether an explicit Active/Paid-Off status exists (§19).

---

## 7. Candidate Value Objects

For each: what defines equality, PRD-confirmed validation, whether it has independent lifecycle, why separate identity is unnecessary, and whether it is edited by value replacement rather than identity mutation. No money, date, timestamp, or timezone implementation type is designed.

### Opening Balance
- **Equality defined by:** its monetary amount (in whole Rupiah, the workspace's single fixed currency).
- **Validation confirmed by PRD:** must never be negative (PRD §12); initializes Total Account Balance and Unallocated Amount to the same value at Account creation, with fund allocations starting at Rp0 (PRD §9).
- **Independent lifecycle:** none — it exists only as part of an Account's starting state.
- **Why separate identity is unnecessary:** two Accounts with the same Opening Balance amount are not "the same balance" in any meaningful sense beyond sharing a value — the amount itself carries no history of its own.
- **Editable by value replacement:** yes — its own correction flow shows before/after impact and replaces the value; it does not create a new Account (PRD §16).

### Opening-Balance Effective Date
- **Equality defined by:** its date value.
- **Validation confirmed by PRD:** must be a valid date; Financial Events cannot have an Event Date earlier than it (same-date allowed) (PRD §12).
- **Independent lifecycle:** none — moving it requires an Impact Preview and triggers Chronological Recalculation, but the date itself is a replaced value, not an object with its own history.
- **Why separate identity is unnecessary:** its meaning is entirely captured by "which date," not by any distinguishing feature beyond the date value.
- **Editable by value replacement:** yes, explicitly, via the confirmed Impact Preview flow (PRD §12, §15).

### Event Date
- **Equality defined by:** its date value.
- **Validation confirmed by PRD:** cannot precede the effective date of any referenced Account or Debt Record; same-date is allowed (PRD §12, §15).
- **Independent lifecycle:** none — it is one field of a Financial Event.
- **Why separate identity is unnecessary:** many Financial Events can validly share the same Event Date (PRD §16's Deterministic Same-Date Ordering requirement presupposes this); the date's meaning is fully captured by its value.
- **Editable by value replacement:** yes — changing it via Same-Type Edit does not change which Financial Event it belongs to (PRD §16).

### Created Timestamp
- **Equality defined by:** its point-in-time value.
- **Validation confirmed by PRD:** none beyond being set once at creation (PRD §16).
- **Independent lifecycle:** none — set once, never edited afterward.
- **Why separate identity is unnecessary:** it is minimal change metadata, not a concept with its own history.
- **Editable by value replacement:** no — it is set once and not subsequently replaced (distinguishing it from Updated Timestamp).

### Updated Timestamp
- **Equality defined by:** its point-in-time value.
- **Validation confirmed by PRD:** none beyond reflecting the most recent edit (PRD §16).
- **Independent lifecycle:** none.
- **Why separate identity is unnecessary:** same reasoning as Created Timestamp — minimal change metadata.
- **System-managed, not directly editable by the User:** it is replaced automatically with a new point-in-time value whenever the Financial Event changes; the User does not set or edit this value directly (PRD §16).

### Target Amount
- **Equality defined by:** its monetary amount.
- **Validation confirmed by PRD:** none beyond being a monetary value; explicitly not a hard cap — allocations may exceed it (PRD §14).
- **Independent lifecycle:** none confirmed — whether it can be changed or removed after allocation history exists is Still Open (PRD §14, §28).
- **Why separate identity is unnecessary:** its entire confirmed meaning is "the amount the user is aiming to reach"; no history of its own is described.
- **User-supplied, not unconditionally editable:** Target Amount is a value the User supplies when present. Whether it may later be changed or removed after allocation history exists is explicitly Still Open (PRD §14, §28; §19) — this document does not assume it is freely editable.

### Opening Outstanding Principal
- **Equality defined by:** its monetary amount.
- **Validation confirmed by PRD:** represents an existing liability's starting balance for a Debt Record; never Income or Expense (PRD §15).
- **Independent lifecycle:** none — it exists only as part of a Debt Record's starting state.
- **Why separate identity is unnecessary:** its meaning is fully captured by the amount value; no history of its own is described.
- **Editable by value replacement:** yes — moving it requires an Impact Preview and triggers Chronological Recalculation of later Debt Repayments (PRD §15).
- **Relationship to its effective date:** Opening Outstanding Principal is defined by its monetary amount only. The Debt Record also carries an associated effective date — a separate date value, playing a role analogous to an Account's Opening-Balance Effective Date, but not part of Opening Outstanding Principal's own definition. Opening Outstanding Principal and Opening Balance are analogous starting-state values for two different concepts (Debt Record and Account, respectively) — they remain separate canonical domain concepts, not the same concept in two forms.

**On Reporting Period configuration and Asia/Jakarta Workspace Timezone:** these were considered for Candidate Value Object status but are classified instead as Configuration/Policy Candidates in §10, since they represent workspace-level *choices/fixed policies* governing behavior rather than values that merely describe another concept. Custom Monthly Cycle's single start-day parameter does have Value-Object-like characteristics (a validated value, replaceable) and this is noted in §10, without forcing a Value Object classification against the Session 16 specification's explicit placement of these concepts under Configuration/Policy analysis.

---

## 8. Derived Values

For each: what it is derived from, whether directly editable, which Financial Invariants constrain it, which historical events affect it, and how Traceability applies.

### Total Account Balance
- **Derived from:** the Account's Opening Balance plus the cumulative effect of every Income, Expense, Transfer, and Debt Repayment referencing that Account (PRD §9, §12).
- **Directly editable:** no.
- **Financial Invariants:** never below Rp0; the balance equation (Total Account Balance = Unallocated Amount + current Account-Backed Fund Allocations) always holds (`UBIQUITOUS_LANGUAGE.md` §12).
- **Historical events affecting it:** Income, Expense (both forms), Transfer (both sides), Debt Repayment; unaffected by Fund Allocation/Fund Release.
- **Traceability:** must be traceable to the individual events that produced it (PRD §19).

### Unallocated Amount
- **Derived from:** Total Account Balance minus the sum of current Account-Backed Fund Allocations for that Account (PRD §9).
- **Directly editable:** no.
- **Financial Invariants:** never below Rp0.
- **Historical events affecting it:** Income (increases), Ordinary Expense/Transfer/Debt Repayment (decrease), Fund Allocation (decreases), Fund Release (increases); unaffected by Fund-Linked Expense.
- **Traceability:** its formula and components must be shown when traced (PRD §19).

### Workspace Total Balance
- **Derived from:** the sum of Total Account Balance across active Accounts (PRD §12, §18).
- **Directly editable:** no.
- **Financial Invariants:** must be traceable to the individual account balances it includes.
- **Historical events affecting it:** indirectly, via every event affecting any active Account's Total Account Balance.
- **Traceability:** must trace to individual account balances (PRD §12).
- **Open risk:** whether archived Accounts factor into historical totals remains Still Open (§19).

### Account-Backed Fund Allocation amount
- **Derived from:** the cumulative effect of Fund Allocation, Fund Release, and Fund-Linked Expense events between one specific Account and one specific Dedicated Fund (PRD §14).
- **Directly editable:** no — always derived from its events.
- **Financial Invariants:** never below Rp0.
- **Historical events affecting it:** Fund Allocation (increases), Fund Release (decreases), Fund-Linked Expense drawing on that specific Account-backed allocation (decreases).
- **Traceability:** must trace to the Fund Allocation/Release/linked-Expense history that produced it, including the source Account (PRD §14, §19).
- **Distinguishing the relationship from its amount:** the *relationship* between one Account and one Dedicated Fund is classified separately as a Relationship Concept Candidate in §12. This subsection addresses only the *current derived amount* of that relationship, which is unambiguously a Derived Value.

### Fund Balance
- **Derived from:** the sum of a Dedicated Fund's Account-Backed Fund Allocation amounts across every Account backing it (PRD §14).
- **Directly editable:** no.
- **Financial Invariants:** the sum must always be breakable down per originating Account, never an unexplained aggregate.
- **Historical events affecting it:** every Fund Allocation, Fund Release, and Fund-Linked Expense referencing that Dedicated Fund, from any backing Account.
- **Traceability:** must trace to its Allocation/Release/linked-Expense history, including each allocation's source Account (PRD §14, §19).

### Outstanding Principal
- **Derived from:** the Debt Record's Opening Outstanding Principal plus the cumulative effect of all valid Debt Repayments (PRD §15).
- **Directly editable:** no.
- **Financial Invariants:** never below Rp0; an overpayment attempt is blocked (PRD §15, §16).
- **Historical events affecting it:** every Debt Repayment referencing that Debt Record.
- **Traceability:** each Debt Repayment must show both the account effect and the outstanding-debt effect (PRD §19).
- **Open risk:** whether an explicit Active/Paid-Off status attaches when it reaches Rp0 is Still Open (§19).

---

## 9. Classification and Enumeration Candidates

### Account Type
- Fixed four-member descriptive classification of an Account (Cash, Bank Account, E-Wallet, Other); descriptive only, never changes financial semantics (PRD §12).
- Not to be confused with an Account instance itself — Account Type classifies an Account, it is not an Account.

### Event Type
- The closed six-member set (Income, Expense, Transfer, Fund Allocation, Fund Release, Debt Repayment) classifying which kind a Financial Event instance is (PRD §9, §11).
- Not to be confused with a Financial Event instance itself — Event Type classifies a Financial Event, it is not one.

### Income, Expense, Transfer, Fund Allocation, Fund Release, Debt Repayment — dual nature
- Each is simultaneously **(a)** a member of the Event Type enumeration, and **(b)** the informal name for a Financial Event instance whose Event Type equals that member. This document concludes the answer to "are these Event Type members, type-specific domain forms, or both?" is **both** — sense (a) is the Classification/Enumeration Candidate; sense (b) shares Financial Event's Candidate Entity identity (see §6, Financial Event Special Analysis). There is no third, independently-identified concept.

### Ordinary Expense / Fund-Linked Expense
- Secondary classifiers of Expense, based on whether a Dedicated Fund reference is present — not members of the six-item Event Type set, and not separately identified concepts from Expense (PRD §11, §14).

### Income Category / Expense Category
- These represent **separate Category kinds** — a two-member classification of "which kind does this Category instance belong to" — **not** a fixed enumeration of every user-defined Category name. The actual set of Income Categories or Expense Categories in a Workspace is user-extensible (create/rename/archive/restore, PRD §13); only the *kind* (Income vs. Expense) is the closed, classified part.
- Not to be confused with a Category instance (a specific named category, which is the Candidate Entity in §6) — Income Category/Expense Category classify which kind a Category instance is, they are not instances themselves.

No programming-language enum is selected for any of the above — these are product-level closed or semi-closed descriptive sets only.

---

## 10. Configuration and Policy Candidates

### Single-Owner Workspace
- A **fixed product policy** for v1: exactly one owning User per Workspace, no shared editing (PRD §6). Not user-configurable; not an open decision.

### Reporting Period
- A **workspace-level configuration choice**: which cycle (Calendar Month or a Custom Monthly Cycle) is currently active, exactly one at a time (PRD §17). Whether this is later best modeled as a value/configuration pair, or some other form, is explicitly **Still Open** (§19) and not decided here.

### Calendar Month
- A **fixed default policy option** — requires no setup, no configurable parameters (PRD §17).

### Custom Monthly Cycle
- A **workspace-level configuration choice** with one parameter (a start day, 1–28) (PRD §17). Its single parameter also has Value-Object-like characteristics (a validated, replaceable value) — noted here without overriding its placement as a configuration candidate, per the Session 16 specification.

### Asia/Jakarta Workspace Timezone
- A **fixed product policy** for all v1 workspaces — not user-configurable, unaffected by device timezone or location (PRD §17, §21).

### Deterministic Same-Date Ordering
- A **confirmed requirement whose mechanism remains deferred.** The rule that same-date recalculation must be deterministic is confirmed; the exact ordering mechanism is explicitly not decided by the PRD, `UBIQUITOUS_LANGUAGE.md`, `DOMAIN_CONCEPT_MODEL.md`, or this document (PRD §16).

### Financial Invariant
- A **fixed rule set** constraining all financial state at every historical point (`UBIQUITOUS_LANGUAGE.md` §12). Distinguished from Chronological Recalculation (§13/§5), which is the *process* that re-establishes these rules after a change, not the rules themselves.

### Impact Preview
- A **confirmed requirement** (a before/after view shown before confirming a material historical change) whose **exact trigger threshold is an open decision** (PRD §12, §15, §17, §28) — not resolved here.

No policy above is turned into a service or component; each remains a product-level rule or choice.

---

## 11. Lifecycle State Candidates

### Trash
- A named recoverable state a Financial Event occupies after Soft Deletion, until its retention period elapses or it is restored (PRD §16). The exact retention period is Still Open.

### Archive
- Names both **the action** of archiving and **the resulting state** (excluded from selectors for new events, history preserved), depending on which concept is being discussed; exact implementation (a single state field, a timestamp, or something else) is not decided here (PRD §12, §13, §14).

### Incomplete Period
- A named state flagging a Reporting Period whose tracking history is incomplete, so comparisons are not presented as misleadingly complete (PRD §17).

### Replaced-event state and edited/deleted/replaced metadata flags
- The PRD confirms minimal change metadata exists: edited/deleted/replaced flags and a replacement link where applicable (PRD §16). Whether "replaced" is best understood as a Lifecycle State Candidate on the old Financial Event, separate from the Event Replacement process that produced it, is a reasonable reading — this document notes it as such without deciding an implementation shape. Whether a replaced event appears in ordinary history or only in its own detail/audit context is Still Open (§19).

### Possible Active/Paid-Off debt status
- **Still Open.** The PRD confirms Outstanding Principal as a derived value but does not confirm whether an explicit "Active"/"Paid Off" state is attached to a Debt Record, or whether status is always presented as derived from the balance (PRD §15, §28).

### Possible completed Financial Goal status
- **Still Open.** The PRD does not confirm whether a Dedicated Fund reaching or exceeding its Target Amount produces an explicit "completed" state, or whether completion is always a derived presentation from Fund Balance vs. Target Amount (PRD §14, §28).

**Process vs. state distinction:** Correction, Soft Deletion, Restoration, Permanent Deletion, Same-Type Edit, and Event Replacement are classified in §5/§13 as Not a Domain Object — they are confirmed **behaviors/processes**, not independent objects or states. Trash, Archive, and Incomplete Period are the **resulting states** those processes (or, for Incomplete Period, a derived condition) produce. No universal state machine is invented here — each concept's confirmed lifecycle is described only as far as the PRD supports.

---

## 12. Relationship Concept Candidates

### Account-Backed Fund Allocation (primary analysis)

- **Why its meaning exists only between one Account and one Dedicated Fund:** every individual allocation is backed by exactly one source Account and belongs to exactly one Dedicated Fund (PRD §14; `DOMAIN_CONCEPT_MODEL.md` §7). Neither "the Account" nor "the Dedicated Fund" alone captures its meaning — it exists only as the pairing.
- **Why its current amount is derived:** it is always computed from the Fund Allocation, Fund Release, and Fund-Linked Expense events between that specific Account and Dedicated Fund (§8 above) — never directly editable.
- **Why its provenance matters:** the PRD requires that a Dedicated Fund's balance always be breakable down per originating Account, and forbids automatically drawing from a different Account's allocation for the same Fund (PRD §14).
- **Why it must not be modeled as a historical allocation lot:** Fund Release and Fund-Linked Expense always draw from the *current* allocation balance for an Account-Dedicated Fund pairing, never from a specific historical Fund Allocation event; no FIFO, LIFO, or per-allocation consumption relationship exists in v1 (PRD §14, §16).
- **Why independent identity is undecided:** the PRD confirms the relationship's provenance rules and derived amount, but does not state whether the relationship itself requires independent identity beyond its current derived amount. This document does not decide that question (see also `DOMAIN_CONCEPT_MODEL.md` §7 and this document's §19).

### Event Replacement link
- The **link** connecting a replaced (old) Financial Event to its new, replacing Financial Event is a relationship between two Financial Event identities, preserved for Traceability (PRD §16, §19). It does not require its own independent object beyond that link — both endpoints already carry Financial Event identity (§6); Event Replacement itself remains classified as a process (§5, §11).

### Transfer's linked source/destination effect
- A Transfer's "linked" nature (one Financial Event, two Account effects) is already fully captured by Transfer referencing exactly one source Account and exactly one destination Account (`DOMAIN_CONCEPT_MODEL.md` §8). This does not require a separate relationship concept beyond what is already described — Transfer remains a single Financial Event with two references.

### Supporting Record relationship
- Supporting Record names the relationship between a traced summary number and the underlying accounts, categories, funds, debts, or events that produced it (PRD §19). This is better treated as a relationship/description of Traceability's second level than as an independent domain object — it does not require its own classification beyond what is already stated in `DOMAIN_CONCEPT_MODEL.md` §14.

No join entity, join table, or similar implementation construct is invented for any of the above.

---

## 13. Concepts That Are Not Domain Objects

- **Annotasi Finance** — the product name/umbrella term for the whole system (PRODUCT_IDENTITY.md §1).
- **Financial Goal** — a descriptive label for "a Dedicated Fund with a Target Amount present," sharing Dedicated Fund's identity entirely (§6).
- **Correction** — the umbrella behavior covering Same-Type Edit, Event Replacement, Soft Deletion, Restoration, and Opening Balance correction (PRD §16).
- **Same-Type Edit** — a behavior applied to a Financial Event (PRD §16).
- **Event Replacement** — the guided correction process/flow; its resulting link is a relationship, discussed in §12 (PRD §16).
- **Soft Deletion** — the act of moving a Financial Event to Trash (PRD §16).
- **Restoration** — the act of reapplying a Trashed Financial Event's effect (PRD §16).
- **Permanent Deletion** — an irreversible action gated by no-history preconditions (PRD §12, §13, §14).
- **Chronological Recalculation** — the recalculation process/requirement itself; distinguished from Financial Invariant, the rule set it enforces (PRD §9, §16).
- **Traceability** — a cross-cutting product requirement, "explain every important number" (PRD §19).
- **Supporting Record** — names a relationship (§12), not an independent object.

None of these are forced into Entity or Value Object status; each is a name, umbrella term, behavior, process, or requirement.

---

## 14. Concepts Requiring Further Analysis

The following concepts received a definite primary classification in §5 but carry meaningful open risk that later domain modeling should revisit:

- **Account-Backed Fund Allocation** — whether the relationship needs independent identity is unresolved (§12).
- **Reporting Period** — whether it is best modeled as a value/configuration pair or another form is unresolved (§10).
- **Archive** — whether it is best represented as an action, a resulting state, or both, depending on the concept, is unresolved (§11).
- **Financial Goal completed status** and **debt Active/Paid-Off status** — both explicitly Still Open; if either becomes an explicit named state, it would need Lifecycle State Candidate treatment later (§11).
- **Account, Category, and Dedicated Fund renaming after history exists** — Category rename is confirmed; Account rename is confirmed only at onboarding; Dedicated Fund rename is not addressed at all by the PRD (§16, test 2).
- **Custom Monthly Cycle** — flagged as having both Configuration/Policy and Value-Object-like characteristics; not forced into one now (§10).

---

## 15. Identity and Equality Analysis

- **Name alone cannot safely define Account identity.** The PRD does not confirm Account name uniqueness; name and Opening Balance are visible attributes, not identity (PRD §12). Whether duplicate visible names are allowed remains open. If duplicate names are permitted, equal names alone would not make two Accounts the same domain thing. **Still Open** whether uniqueness is ever enforced.
- **Name alone cannot safely define Category identity.** The PRD does not confirm uniqueness of Category names within a kind; historical Income/Expense events must keep referencing the correct Category regardless of what other Categories are named (PRD §13). Whether duplicate visible labels are allowed remains open. If duplicate labels are permitted, equal labels alone would not make two Categories the same domain thing. **Still Open** whether name uniqueness within a kind is enforced.
- **Name alone cannot safely define Dedicated Fund identity.** The PRD does not confirm uniqueness of Dedicated Fund names (e.g., two funds both named "Qurban") (PRD §14). Whether duplicate visible names are allowed remains open. If duplicate names are permitted, equal names alone would not make two Dedicated Funds the same domain thing. **Still Open.**
- **Two Financial Events with identical fields may still be distinct events.** Recording the same amount, category, account, and date twice produces two separately traceable events, not one event counted twice (PRD §9, §11, §19) — this is a structural property of Financial Event identity, not an open question.
- **A corrected Financial Event remains the same event during a Same-Type Edit, while an Event Replacement creates a new event linked to the old one.** This distinction is explicitly confirmed (PRD §16).
- **Two monetary values of the same amount and currency have the same value meaning, without implying they are the same Account or Event.** Rp100.000 in one Account's Opening Balance and Rp100.000 recorded as an Income amount elsewhere are equal *values*; neither implication about shared Account or Event identity follows from that equality (PRD §9). This illustrates the Value Object vs. Entity distinction directly.

No uniqueness constraint is invented in this document; every uniqueness question the PRD does not confirm is marked Still Open here and in §19.

---

## 16. Lifecycle and Historical Continuity Tests

1. **Rename without identity change** — Confirmed for Category (PRD §13, "create, rename, archive/hide, and restore categories"). Confirmed at Account creation/onboarding only (PRD §10, "accepts or renames the suggested default name"); whether an Account can be renamed later, after Financial Events exist, is not explicitly addressed. Not addressed at all for Dedicated Fund.
2. **Archival while preserving history** — Confirmed for Account, Category, and Dedicated Fund (PRD §12, §13, §14).
3. **Restoration where confirmed** — Confirmed for Account and Category (PRD §12, §13); not confirmed for Dedicated Fund beyond "archiving preserves history" (§9, §18 of `DOMAIN_CONCEPT_MODEL.md`).
4. **Permanent deletion when unused** — Confirmed for Account, Category, and Dedicated Fund, each gated on no history/dependencies (PRD §12, §13, §14).
5. **Same-Type Edit preserving Financial Event identity** — Confirmed (PRD §16).
6. **Event Replacement creating a distinct new Financial Event** — Confirmed, with the old event marked replaced and linked to the new one (PRD §16).
7. **Soft Deletion preserving recoverability** — Confirmed, via the Trash state and a defined retention period (exact length Still Open) (PRD §16).
8. **Historical references surviving Category or Account archival** — Confirmed: archiving does not retroactively invalidate events that already reference the archived concept (`DOMAIN_CONCEPT_MODEL.md` §15).
9. **Dedicated Fund history preservation on archive** — Confirmed (PRD §14); restore-to-active-use behavior beyond that is Still Open.
10. **Debt Record continuity after Outstanding Principal reaches Rp0** — The Debt Record is not deleted or stripped of identity merely because its *derived* Outstanding Principal reaches zero; Permanent Deletion requires no repayment history, which a repaid debt would not satisfy, so continuity follows from already-confirmed rules rather than a new assumption. Whether an explicit "Paid Off" status attaches is Still Open (PRD §15, §28).

Open restore/status behavior is not decided by any of the above tests — each explicitly notes where the PRD stops confirming behavior.

---

## 17. Classification Stress-Test Scenarios

**1. Two Accounts both named "BCA"**
- Concepts: Account.
- Question tested: does Account identity depend on its name?
- Expected conclusion: Name alone cannot safely define identity. The PRD does not confirm whether duplicate visible names are allowed. If duplicate names are permitted, equal names alone would not make the two Accounts the same domain thing.
- What remains open: whether uniqueness is ever enforced.
- Reference: PRD §12; §19.

**2. Renaming an Account after historical events exist**
- Concepts: Account, Financial Event.
- Question tested: does renaming break identity or historical references?
- Expected conclusion: No — Account is a Candidate Entity; a name change would not affect its identity or invalidate historical Financial Events referencing it.
- What remains open: whether renaming is confirmed to be available after onboarding/after history exists — the PRD confirms renaming only at onboarding (PRD §10).
- Reference: PRD §10, §12.

**3. Two Categories with the same visible label**
- Concepts: Category.
- Question tested: does Category identity depend on its label?
- Expected conclusion: Name alone cannot safely define identity. The PRD does not confirm whether duplicate visible labels within a kind are allowed. If duplicate labels are permitted, equal labels alone would not make the two Categories the same domain thing.
- What remains open: whether label uniqueness within a kind is enforced.
- Reference: PRD §13; §19.

**4. Archiving a Category used by historical Expenses**
- Concepts: Category, Expense (historical).
- Question tested: does archiving break historical references?
- Expected conclusion: Valid — Category archival preserves history; historical Expenses retain their Category reference.
- What remains open: nothing — this is confirmed.
- Reference: PRD §13.

**5. Two Dedicated Funds both named "Qurban"**
- Concepts: Dedicated Fund.
- Question tested: does Dedicated Fund identity depend on its name?
- Expected conclusion: Name alone cannot safely define identity. The PRD does not confirm whether duplicate visible names are allowed. If duplicate names are permitted, equal names alone would not make the two Dedicated Funds the same domain thing.
- What remains open: whether uniqueness is ever enforced.
- Reference: PRD §14; §19.

**6. Adding a Target Amount to an existing Dedicated Fund**
- Concepts: Dedicated Fund, Target Amount, Financial Goal.
- Question tested: does adding a Target Amount create a new concept or change identity?
- Expected conclusion: Identity is unaffected — it is the same Dedicated Fund, now behaving as a Financial Goal; no new entity is created (Financial Goal Special Analysis, §6). This conclusion is about identity only; it does not confirm operational rules for changing or removing a Target Amount later.
- What remains open: nothing about identity from adding a Target Amount; presentation/UI implications are out of scope; change/removal permissions remain Still Open (scenario 7).
- Reference: PRD §14.

**7. Removing or changing Target Amount after allocation history exists**
- Concepts: Dedicated Fund, Target Amount.
- Question tested: is this change permitted?
- Expected conclusion: Not decided — explicitly Still Open.
- What remains open: whether this change is allowed at all.
- Reference: PRD §14, §28; §19.

**8. Two identical Income records created separately**
- Concepts: Financial Event, Income.
- Question tested: does field equality imply the same event?
- Expected conclusion: No — they are two distinct, individually traceable Financial Events despite identical visible fields.
- What remains open: nothing — this is a structural property of Financial Event identity.
- Reference: PRD §9, §11, §19.

**9. Editing the amount of an Income without changing Event Type**
- Concepts: Financial Event, Same-Type Edit.
- Question tested: does a field edit change identity?
- Expected conclusion: No — this is a Same-Type Edit; the Financial Event's identity is preserved, and Chronological Recalculation applies.
- What remains open: nothing — confirmed.
- Reference: PRD §16.

**10. Changing an Expense into Income through Event Replacement**
- Concepts: Financial Event, Event Replacement.
- Question tested: does an Event Type change preserve or replace identity?
- Expected conclusion: A new Financial Event identity is created (the replacement); the old one is marked replaced and linked to it for Traceability — two distinct identities, linked.
- What remains open: whether the replaced event appears in ordinary history or only in its own detail/audit context.
- Reference: PRD §16; §19.

**11. Soft-deleting and restoring a Financial Event**
- Concepts: Financial Event, Soft Deletion, Trash, Restoration.
- Question tested: does the Trash/Restoration cycle preserve identity?
- Expected conclusion: Yes — the same Financial Event identity persists through Soft Deletion, Trash, and Restoration; Restoration revalidates dependencies and every Financial Invariant.
- What remains open: exact retention period; manual Permanent Deletion availability.
- Reference: PRD §16; §19.

**12. A Debt Record reaching Rp0 Outstanding Principal**
- Concepts: Debt Record, Outstanding Principal.
- Question tested: does reaching zero end the Debt Record's identity or existence?
- Expected conclusion: No — Outstanding Principal is a derived value; the Debt Record continues to exist (see §16, test 10).
- What remains open: whether an explicit Active/Paid-Off status attaches.
- Reference: PRD §15, §28; §19.

**13. Two Custom Monthly Cycle definitions with the same start day**
- Concepts: Custom Monthly Cycle, Reporting Period.
- Question tested: can two Custom Monthly Cycle configurations with the same start day coexist or conflict?
- Expected conclusion: Not applicable in v1 — only one active Reporting Period configuration exists per Workspace at a time, so no simultaneous-identity conflict can arise; classification remains Configuration/Policy Candidate, not Entity.
- What remains open: nothing about identity; only the eventual detailed modeling form of Reporting Period (§10).
- Reference: PRD §17.

**14. Same Event Date applied to multiple Financial Events**
- Concepts: Financial Event, Event Date, Deterministic Same-Date Ordering.
- Question tested: does sharing a date merge or conflict identity?
- Expected conclusion: No — this is expected and normal; each event retains its own separate identity; Deterministic Same-Date Ordering governs recalculation order among them.
- What remains open: the exact ordering mechanism.
- Reference: PRD §16; §19.

**15. Account-Backed Fund Allocation reaching Rp0**
- Concepts: Account-Backed Fund Allocation.
- Question tested: does the current allocation amount reaching Rp0 change the relationship's classification?
- Expected conclusion: The current allocation amount reaches Rp0; whether the relationship requires independent identity remains open. This document reaches no conclusion about storage, persistence, or zero-value representation.
- What remains open: independent identity of the relationship (§12, §19).
- Reference: PRD §14; `DOMAIN_CONCEPT_MODEL.md` §7.

No scenario above invents a new business rule — each tests an already-confirmed relationship or explicitly defers to an already-flagged open question.

---

## 18. Explicit Non-Decisions

This document does not decide:

- database identifiers;
- natural versus surrogate keys;
- UUID format;
- aggregate boundaries;
- aggregate roots;
- consistency boundaries;
- repository boundaries;
- domain services;
- commands;
- domain events;
- bounded contexts;
- event sourcing;
- inheritance or composition;
- immutable class design;
- database normalization;
- persistence ownership;
- API contracts;
- serialization;
- frontend state shape;
- uniqueness constraints not confirmed by the PRD (Account, Category, Dedicated Fund names);
- the deterministic same-date ordering mechanism.

---

## 19. Still-Open Classification Questions

- Whether Account names must be unique inside one Workspace.
- Whether Category names must be unique within their Income/Expense kind.
- Whether Dedicated Fund names must be unique.
- Whether Account-Backed Fund Allocation requires independent identity, or is fully captured by its current derived amount.
- Whether Reporting Period is best treated as a value/configuration pair or another form in later detailed modeling.
- Whether debt Active/Paid-Off is an explicit state or a derived presentation.
- Whether Financial Goal completed status is an explicit state or a derived presentation.
- Whether archived Dedicated Funds can be restored to active use.
- Replaced-event visibility (ordinary history vs. detail/audit-only context).
- Exact Trash retention behavior and manual Permanent Deletion availability.
- The deterministic same-date ordering mechanism.
- Whether Account renaming is available after onboarding/after historical events exist.
- Whether Dedicated Fund renaming is supported at all.
- Whether non-zero Dedicated Fund archival is ever blocked outright vs. always allowed with confirmation.
- Whether a Target Amount can be changed or removed after allocation history exists.
- The exact Impact Preview trigger threshold.

None of these questions is answered by this document.

---

## 20. PRD Traceability

| Section (this document) | Primary PRD / Domain Sections |
|---|---|
| Classification Summary (§5) | PRD §6, §9, §11, §12, §13, §14, §15, §16, §17, §19; `UBIQUITOUS_LANGUAGE.md`; `DOMAIN_CONCEPT_MODEL.md` |
| Candidate Entities (§6) | PRD §6, §9, §10, §11, §12, §13, §14, §15, §16, §19, §20 |
| Candidate Value Objects (§7) | PRD §9, §12, §14, §15, §16 |
| Derived Values (§8) | PRD §9, §12, §14, §15, §18, §19 |
| Classification and Enumeration Candidates (§9) | PRD §9, §11, §12, §13, §14 |
| Configuration and Policy Candidates (§10) | PRD §6, §9, §12, §15, §16, §17, §21, §28 |
| Lifecycle State Candidates (§11) | PRD §12, §13, §14, §16, §17, §28 |
| Relationship Concept Candidates (§12) | PRD §14, §16, §19 |
| Concepts That Are Not Domain Objects (§13) | PRD §9, §12, §13, §14, §16, §19 |
| Identity and Equality Analysis (§15) | PRD §9, §11, §12, §13, §14, §16, §19 |
| Lifecycle and Historical Continuity Tests (§16) | PRD §10, §12, §13, §14, §15, §16 |
| Classification Stress-Test Scenarios (§17) | PRD §9, §10, §11, §12, §13, §14, §15, §16, §17, §19, §28 |
| Still-Open Classification Questions (§19) | PRD §12, §14, §15, §16, §17, §28 |

Every classification in this document is a **candidate**, supported by the cited sections, carrying explicit uncertainty where the approved sources do not confirm further. Nothing in this document claims to be final implementation design.
