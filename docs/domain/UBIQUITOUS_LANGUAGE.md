# Annotasi Finance — Ubiquitous Language

## 1. Document Status

- **Status:** Draft for domain-modeling review
- **Scope:** Annotasi Finance Private Beta MVP
- This document defines **shared domain language**, not software architecture. It contains no database tables, fields, APIs, classes, aggregates, bounded contexts, repositories, services, frameworks, or technology choices of any kind.
- **English terms are canonical internal domain terms.** They are used in product discussion, domain modeling, source code, tests, and specifications — not necessarily in the UI.
- **User-facing labels must eventually use natural Bahasa Indonesia** (PRD §22). This document is not that UI-copy document.
- **Candidate Bahasa Indonesia labels are not automatically final UI wording.** Where a candidate label exists (PRD §13, §22), it is marked *Candidate terminology* and remains subject to UX terminology review.
- **Unresolved PRD questions remain unresolved.** Nothing in this document silently resolves an open product, UX, or terminology decision. Where the PRD is silent or explicitly undecided, this document says so and stops there.

---

## 2. Purpose

This document exists to give one shared vocabulary to everyone and everything that will describe Annotasi Finance's domain going forward: the PRD, domain modeling, future source code, automated tests, and user-facing specifications. Its job is to:

- Identify the precise internal name for every confirmed domain concept.
- Distinguish concepts that sound similar but are not (e.g., "balance" alone vs. total account balance vs. unallocated amount vs. fund allocation).
- Flag words that are used ambiguously or inconsistently across the source documents.
- Preserve the confirmed financial semantics and invariants from the PRD in precise, non-technical language.
- Give domain modeling (the next workflow step per CLAUDE.md §5) a stable, unambiguous starting vocabulary — without performing any domain modeling itself.

This document does **not** decide product behavior, UX copy, or architecture. Where the PRD has already confirmed a meaning, this document restates it precisely. Where the PRD has not yet decided something, this document says so and leaves it open.

---

## 3. Source of Truth and Decision Rules

**Priority order for this document:**

1. Confirmed requirements in `docs/product/ANNOTASI_FINANCE_MVP_PRD.md`
2. Approved principles in `docs/product/PRODUCT_IDENTITY.md`
3. Working rules in `CLAUDE.md`
4. The Session 13 specification that commissioned this document
5. Generic procedural guidance from the project-local `ubiquitous-language` skill

**Decision rules:**

- Where the PRD marks something **(Confirmed)**, this document treats it as settled domain meaning and states it plainly.
- Where the PRD marks something **(Hypothesis — requires validation)**, this document preserves that status — it is a candidate meaning, not a settled one.
- Where the PRD offers a **candidate Bahasa Indonesia label** (§13, §22) or lists an item as **"Still undecided"** or under **§28 Open Questions** (any subsection other than "Resolved Decisions Before Domain Modeling"), this document marks it **Candidate terminology** or **Still open** and does not pick a winner.
- Where a required term in this document (per the Session 13 specification) has no verbatim PRD label but the underlying behavior it names is fully and unambiguously specified in the PRD (e.g., "Ordinary Expense," "Same-Type Edit"), this document coins the canonical internal term for that already-confirmed behavior. This is vocabulary-naming, not a new product decision — the term is marked **Confirmed** and the PRD section defining the underlying behavior is cited.
- The `ubiquitous-language` skill's own defaults (opinionated term-picking, generic example dialogue, flat single-file glossary format, conversation-as-source) are **not authoritative** here. The skill is used only as a procedural technique — for spotting synonyms, ambiguity, and natural term groupings — never as a source of domain meaning. Any conflict between the skill and a higher-priority source is resolved in favor of the higher-priority source, and is documented above.

---

## 4. Language Rules

- Canonical internal terms are written in English, **Title Case**, and bolded on first use in each subsection (e.g., **Financial Event**, **Unallocated Amount**).
- Candidate Bahasa Indonesia labels, where they exist, are shown alongside the canonical term but are explicitly non-final.
- "Transaction" may be used conversationally, but **Financial Event** is the precise canonical domain term (PRD §9, §11).
- "Delete" is never used unqualified in this document — the precise terms are **Soft Deletion**, **Trash**, **Restoration**, **Archive**, and **Permanent Deletion** (§11 below), each with a distinct meaning.
- "Balance" is never used unqualified — the precise terms are **Total Account Balance**, **Unallocated Amount**, **Account-Backed Fund Allocation**, **Fund Balance**, **Outstanding Principal**, and **Workspace Total Balance** (§7, §8, §9 below), each naming a different quantity.
- Internal technical terminology may appear in engineering documentation (this document included) but must never leak into the user-facing product (CLAUDE.md, PRD §22).
- Named user purposes (Qurban, Wife Savings, Mac Istri, Home Sweet Home, etc.) are never treated as universal transaction types, categories, or structural concepts — they are always instances of the generic **Dedicated Fund** concept (PRD §9, §13; CLAUDE.md §4).

---

## 5. Core Domain Glossary

### Annotasi Finance
- **Definition:** The product itself — a mobile-first personal finance application whose first job is trustworthy recording and representation of financial events.
- **Represents:** The product as a whole.
- **Does not represent:** A banking service, an investment/trading platform, or a fund custodian (PRODUCT_IDENTITY.md §14; PRD §8).
- **Related terms:** Workspace, User.
- **PRD reference:** PRODUCT_IDENTITY.md §1; PRD §2.
- **Status:** Confirmed.

### User
- **Definition:** A person with an authenticated identity on the multi-user Annotasi Finance platform.
- **Represents:** An authenticated identity on the platform.
- **Does not represent:** A financial **Account** (where money resides) — see the flagged ambiguity in §14. Also does not represent a household, family, or shared identity; each User owns exactly one Workspace in v1.
- **Related terms:** Workspace, Single-Owner Workspace.
- **PRD reference:** PRD §6; PRODUCT_IDENTITY.md §3.
- **Status:** Confirmed.

### Workspace
- **Definition:** A User's private financial space containing their accounts, categories, dedicated funds, debt records, and financial events.
- **Represents:** The complete, isolated financial context belonging to one User.
- **Does not represent:** A shared or household space — v1 workspaces are never jointly edited (PRD §6, §20).
- **Related terms:** Single-Owner Workspace, Workspace Total Balance, Asia/Jakarta Workspace Timezone.
- **PRD reference:** PRD §6, §20.
- **Status:** Confirmed.

### Single-Owner Workspace
- **Definition:** The v1 workspace model in which exactly one User owns and privately controls a workspace — no shared editing, invitations, roles, or collaborative access.
- **Represents:** The v1 scope boundary for workspace ownership.
- **Does not represent:** Household collaboration, which is future direction and explicitly excluded from v1 (PRODUCT_IDENTITY.md §3, §14; PRD §6, §8, §29; CLAUDE.md §3).
- **Related terms:** Workspace, User.
- **PRD reference:** PRD §6.
- **Status:** Confirmed.

### Financial Event
- **Definition:** A record of something that financially happened in a workspace, belonging to one of six closed v1 event types.
- **Represents:** The precise nature of what happened financially — the structural core of the domain (PRD §9, §11).
- **Does not represent:** Opening Balance, which is starting state, not a Financial Event (PRD §9, §11, §28). Also does not represent a Category, which only describes an Income or Expense event, never determines its type.
- **Related terms:** Event Type, Event Date, Financial Invariant.
- **PRD reference:** PRD §9, §11.
- **Status:** Confirmed.

### Event Type
- **Definition:** Which of the six closed v1 kinds a Financial Event is: Income, Expense, Transfer, Fund Allocation, Fund Release, or Debt Repayment.
- **Represents:** A small, closed, structural set (PRD §11).
- **Does not represent:** A Category (descriptive label) or an Account Type (where money resides) — these are separate, non-overlapping concepts (PRD §9, §12, §13).
- **Related terms:** Financial Event, Category.
- **PRD reference:** PRD §9, §11.
- **Status:** Confirmed.

### Event Date
- **Definition:** The user-selected date a Financial Event is understood to have happened, used for reporting-period grouping and chronological ordering.
- **Represents:** The date used for all reporting, ordering, and validity checks against account/debt opening dates (PRD §12, §15, §17).
- **Does not represent:** The Created Timestamp or Updated Timestamp — the event date never equals the system's record-keeping time, and the system timestamp never determines reporting period (PRD §16, §17).
- **Related terms:** Created Timestamp, Updated Timestamp, Reporting Period, Deterministic Same-Date Ordering.
- **Important rule:** An Event Date can never be earlier than the effective date of every account (and, for Debt Repayment, the debt record) it references; same-date is allowed (PRD §12, §15).
- **PRD reference:** PRD §12, §15, §16, §17.
- **Status:** Confirmed.

### Created Timestamp
- **Definition:** The system-recorded moment a Financial Event was first saved.
- **Represents:** Minimal change metadata (PRD §16).
- **Does not represent:** The Event Date, and never determines reporting period (PRD §17).
- **Related terms:** Updated Timestamp, Event Date.
- **PRD reference:** PRD §16, §17.
- **Status:** Confirmed.

### Updated Timestamp
- **Definition:** The system-recorded moment a Financial Event was most recently edited.
- **Represents:** Minimal change metadata alongside edited/deleted/replaced flags and a replacement link where applicable (PRD §16).
- **Does not represent:** The Event Date; never determines reporting period.
- **Related terms:** Created Timestamp, Correction, Event Replacement.
- **PRD reference:** PRD §16.
- **Status:** Confirmed.

### Category
- **Definition:** A descriptive label applied only to Income and Expense events, explaining their purpose.
- **Represents:** A description of *why* an Income or Expense happened.
- **Does not represent:** An event's financial effect (event type decides that first), a Dedicated Fund, or an Event Type. A Category never determines financial effect (PRD §9, §13).
- **Related terms:** Income Category, Expense Category, Event Type, Dedicated Fund.
- **Important rule:** Transfer, Fund Allocation, Fund Release, and Debt Repayment never use categories. Exactly one category per Income/Expense event — no multi-category or split events (PRD §13).
- **PRD reference:** PRD §9, §13.
- **Status:** Confirmed.

### Income Category
- **Definition:** A Category belonging to the Income kind (e.g., candidate labels Gaji, Freelance/Usaha, Hadiah/Uang Saku, Pemasukan Lainnya).
- **Represents:** One of a non-overlapping set of Income-only categories.
- **Does not represent:** An Expense Category — Income and Expense use separate, non-overlapping category sets (PRD §13).
- **Related terms:** Category, Expense Category, Income (event type).
- **PRD reference:** PRD §13.
- **Status:** Confirmed — canonical domain concept (a Category kind reserved for Income, non-overlapping with Expense Category). Candidate starter labels, exact wording, count, and default category sets remain open (PRD §13, §28).

### Expense Category
- **Definition:** A Category belonging to the Expense kind (e.g., candidate labels Makanan & Minuman, Transportasi, Pengeluaran Lainnya).
- **Represents:** One of a non-overlapping set of Expense-only categories.
- **Does not represent:** An Income Category; never a stand-in for a Dedicated Fund purpose or an Event Type name (e.g., "Transfer," "Tabungan," "Pembayaran Utang," "Qurban" must never appear as category names) (PRD §13).
- **Related terms:** Category, Income Category, Expense (event type), Fund-Linked Expense.
- **PRD reference:** PRD §13.
- **Status:** Confirmed — canonical domain concept (a Category kind reserved for Expense, non-overlapping with Income Category). Candidate starter labels, exact wording, count, and default category sets remain open (PRD §13, §28).

### Traceability
- **Definition:** The property that every important number can be opened to reveal the records that produced it, down to individual Financial Events.
- **Represents:** The hard v1 requirement "Explain every important number," implemented as three levels: Summary, Supporting Record, and individual event explanation (PRD §19).
- **Does not represent:** A full audit-log/history UI feature — field-level audit history is deferred; only minimal change metadata is required in v1 (PRD §16, §19).
- **Related terms:** Supporting Record.
- **Important rule:** A dashboard number that disagrees with its source detail is a release-blocking defect (PRD §19, §24).
- **PRD reference:** PRD §19, §24.
- **Status:** Confirmed.

### Supporting Record
- **Definition:** The accounts, categories, funds, debts, or financial events revealed when an important number is opened, showing what produced it.
- **Represents:** The second of Traceability's three levels (PRD §19).
- **Does not represent:** The number itself (Summary level) or the full individual-event explanation (the third level).
- **Related terms:** Traceability.
- **PRD reference:** PRD §19.
- **Status:** Confirmed.

---

## 6. Financial Event Glossary

The v1 Financial Event set is **closed at six types**. For each: what financially happened, required references, and effect on Total Account Balance, Unallocated Amount, Account-Backed Fund Allocation, Income totals, Expense totals, and outstanding debt.

### Income
- **Candidate Bahasa Indonesia label:** Pemasukan (not final — PRD §22).
- **What happened:** Money enters the workspace from an external source (salary, freelance payment, gift, business income).
- **Required references:** one Account, one Income Category.
- **Effect — Total Account Balance:** increases.
- **Effect — Unallocated Amount:** increases (by the same amount).
- **Effect — Account-Backed Fund Allocation:** none.
- **Effect — Income total:** increases for the relevant Reporting Period.
- **Effect — Expense total:** none.
- **Effect — outstanding debt:** none.
- **Must never be confused with:** money moved from another account owned by the same User — that is a Transfer, not Income (PRD §11).
- **PRD reference:** PRD §11 (Income), §9, §24.
- **Status:** Confirmed.

### Expense
- **Candidate Bahasa Indonesia label:** Pengeluaran (not final — PRD §22).
- **What happened:** Money leaves an Account for a good, service, obligation, or consumption. Has two forms — Ordinary Expense and Fund-Linked Expense (see below).
- **Required references:** one Account, one Expense Category; optionally, one Dedicated Fund.
- **Effect — Total Account Balance:** decreases (in both forms).
- **Effect — Unallocated Amount:** decreases, only if there is no fund reference (Ordinary Expense). Unchanged if fund-linked.
- **Effect — Account-Backed Fund Allocation:** unchanged if Ordinary; decreases the matching allocation if Fund-Linked.
- **Effect — Income total:** none.
- **Effect — Expense total:** increases exactly once for the relevant Reporting Period, regardless of form.
- **Effect — outstanding debt:** none.
- **Must never be confused with:** a Transfer, or the principal portion of a Debt Repayment (PRD §11).
- **PRD reference:** PRD §11 (Expense), §9, §14, §24.
- **Status:** Confirmed.

#### Ordinary Expense
- **Definition:** An Expense with no Dedicated Fund reference.
- **Represents:** An Expense that draws only from Unallocated Amount; cannot exceed the Account's current Unallocated Amount.
- **Does not represent:** A Fund-Linked Expense.
- **Related terms:** Expense, Fund-Linked Expense, Unallocated Amount.
- **PRD reference:** PRD §11.
- **Status:** Confirmed (concept fully specified in PRD §11; "Ordinary Expense" is this document's canonical label for "an Expense without a fund reference," not a verbatim PRD phrase).

#### Fund-Linked Expense
- **Definition:** An Expense linked to one Dedicated Fund, where the single payment Account must be the same account backing the fund allocation being drawn down.
- **Represents:** An Expense that draws from the matching Account-Backed Fund Allocation instead of Unallocated Amount; does not require sufficient Unallocated Amount.
- **Does not represent:** An Ordinary Expense; does not consume an "allocation lot" — there is no FIFO/LIFO/allocation-lot relationship in v1 (PRD §14, §16).
- **Related terms:** Expense, Dedicated Fund, Account-Backed Fund Allocation.
- **Important rule:** Amount must not exceed the selected fund's current allocation from the payment account, and must not make the payment account's Total Account Balance negative. Allocations belonging to a different account are never automatically consumed.
- **PRD reference:** PRD §11, §14, §28 (item 5).
- **Status:** Confirmed.

### Transfer
- **Candidate Bahasa Indonesia label:** Transfer (not final, though already Indonesian-adjacent — PRD §22).
- **What happened:** Money moves between two Accounts owned by the same User.
- **Required references:** one source Account, one destination Account (both owned by the User).
- **Effect — Total Account Balance:** decreases for the source, increases for the destination.
- **Effect — Unallocated Amount:** decreases for the source, increases for the destination (a Transfer never consumes a fund allocation).
- **Effect — Account-Backed Fund Allocation:** none; a Transfer never automatically moves or reassigns a fund allocation.
- **Effect — Income total:** none.
- **Effect — Expense total:** none.
- **Effect — outstanding debt:** none.
- **Must never be confused with:** two independent, potentially inconsistent Income/Expense records — both sides remain one linked event (PRD §11).
- **PRD reference:** PRD §11 (Transfer), §9, §24.
- **Status:** Confirmed.

### Fund Allocation
- **Candidate Bahasa Indonesia label:** Alokasi Dana (not final — PRD §22).
- **What happened:** The User reserves existing money in an Account for a named Dedicated Fund purpose.
- **Required references:** one Dedicated Fund, one source Account.
- **Effect — Total Account Balance:** none.
- **Effect — Unallocated Amount:** decreases.
- **Effect — Account-Backed Fund Allocation:** increases (backed by that same source account).
- **Effect — Income total:** none.
- **Effect — Expense total:** none.
- **Effect — outstanding debt:** none.
- **Must never be:** its own universal transaction type per named fund (e.g., "Qurban" is not an event type), nor a stand-in for a generic savings category (PRD §11).
- **PRD reference:** PRD §11 (Fund Allocation), §9, §14, §24.
- **Status:** Confirmed.

### Fund Release
- **Candidate Bahasa Indonesia label:** Pelepasan Alokasi Dana (not final — PRD §22).
- **What happened:** The User moves previously allocated money from a Dedicated Fund back into Unallocated Amount, without implying the original Fund Allocation was a mistake.
- **Required references:** one Dedicated Fund, exactly one source Account. Draws from that account's *current* allocation balance for the fund — never a particular historical Fund Allocation event.
- **Effect — Total Account Balance:** none.
- **Effect — Unallocated Amount:** increases.
- **Effect — Account-Backed Fund Allocation:** decreases (the allocation backed by the chosen source account).
- **Effect — Income total:** none.
- **Effect — Expense total:** none.
- **Effect — outstanding debt:** none.
- **Must never be confused with:** deleting/correcting a Fund Allocation, which implies the original record was wrong (PRD §11).
- **PRD reference:** PRD §11 (Fund Release), §14, §24, §28 (item 4).
- **Status:** Confirmed.

### Debt Repayment
- **Candidate Bahasa Indonesia label:** Pembayaran Pokok Utang (not final — PRD §22).
- **What happened:** The User pays down an existing Debt Record's Outstanding Principal.
- **Required references:** one existing Debt Record, one payment Account. Cannot exist without a Debt Record (no free-text debt labels).
- **Effect — Total Account Balance:** decreases (payment account).
- **Effect — Unallocated Amount:** decreases (a Debt Repayment never consumes a fund allocation).
- **Effect — Account-Backed Fund Allocation:** none.
- **Effect — Income total:** none.
- **Effect — Expense total:** none for principal; interest, penalties, or fees are recorded as separate Expense events.
- **Effect — outstanding debt:** decreases Outstanding Principal; cannot reduce it below Rp0.
- **Must never be confused with:** an Ordinary Expense counting principal as daily spending (PRD §11, §15).
- **PRD reference:** PRD §11 (Debt Repayment), §15, §24, §28 (items 1, 2, 7 as applicable).
- **Status:** Confirmed.

### Opening Balance is not a seventh Financial Event

Opening Balance (§7 below) is starting state for an Account or Debt Record, is never Income, and is never counted among the six Financial Event types (PRD §9, §11, §28).

---

## 7. Account and Balance Vocabulary

### Account
- **Definition:** Where money actually or operationally resides — physical cash, a bank account, or an e-wallet.
- **Represents:** A money-holding location.
- **Does not represent:** A Category, a Dedicated Fund, a Debt Record, a person, or a reporting label (PRD §12).
- **Related terms:** Account Type, Opening Balance, Total Account Balance, Unallocated Amount.
- **Important rule:** Every v1 Account is asset-like and money-holding; credit-card/overdraft/negative-balance accounts are outside v1 (PRD §12, §28 item 2).
- **PRD reference:** PRD §12.
- **Status:** Confirmed.

### Account Type
- **Definition:** A fixed, descriptive classification of an Account — internal canonical names Cash, Bank Account, E-Wallet, Other (candidate Bahasa Indonesia labels: Tunai, Rekening Bank, Dompet Digital, Lainnya).
- **Represents:** A description of the account, never a determinant of financial semantics — a Transfer is a Transfer regardless of account type.
- **Does not represent:** A Dedicated Fund. In particular, "Dompet Digital" (E-Wallet) must never be confused with the generic concept of a Dedicated Fund (see §14 below).
- **Related terms:** Account.
- **PRD reference:** PRD §10, §12, §22.
- **Status:** Confirmed (the four-type list and internal names); candidate Bahasa Indonesia labels pending UX terminology review.

### Opening Balance
- **Definition:** The starting-state value of an Account (or, separately, a Debt Record's Opening Outstanding Principal) at the moment it begins being tracked.
- **Represents:** Starting state — never a Financial Event, never Income (PRD §9, §11, §12).
- **Does not represent:** Income, or any of the six Financial Event types.
- **Related terms:** Opening-Balance Effective Date, Total Account Balance, Unallocated Amount.
- **Important rule:** At creation, Opening Balance initializes both Total Account Balance and Unallocated Amount to the same value; initial fund allocations are Rp0. Opening Balance must never be negative. Any later allocation to a Dedicated Fund must be recorded explicitly, afterward, through a Fund Allocation event (PRD §9, §12).
- **PRD reference:** PRD §9, §11, §12, §28 (item 2).
- **Status:** Confirmed.

### Opening-Balance Effective Date
- **Definition:** The date from which an Account's (or Debt Record's) Opening Balance is considered to hold.
- **Represents:** The earliest valid Event Date boundary for that account/debt (same-date events are allowed).
- **Does not represent:** An arbitrary or automatically-changed date — the system never changes it automatically; moving it requires an explicit Impact Preview and triggers Chronological Recalculation.
- **Related terms:** Opening Balance, Event Date, Impact Preview, Chronological Recalculation.
- **PRD reference:** PRD §12, §15, §28 (items 6, 7).
- **Status:** Confirmed.

### Total Account Balance
- **Definition:** The complete current value held in an Account.
- **Represents:** `Unallocated Amount + the sum of all current Account-Backed Fund Allocations for that account.` This equation always holds.
- **Does not represent:** "Available balance" — that phrase is prohibited as an unexplained canonical term (see §14). Also does not represent Workspace Total Balance (which sums across accounts).
- **Related terms:** Unallocated Amount, Account-Backed Fund Allocation, Workspace Total Balance.
- **Important rule:** Never below Rp0 at any point in recalculated history (PRD §9, §12, §16).
- **PRD reference:** PRD §9, §12, §16, §18, §24, §28 (item 4).
- **Status:** Confirmed.

### Unallocated Amount
- **Definition:** The portion of an Account's Total Account Balance not currently reserved in any Dedicated Fund.
- **Represents:** The money an Ordinary Expense, Transfer, or Debt Repayment may draw from.
- **Does not represent:** Total Account Balance itself, nor any single fund's allocation.
- **Related terms:** Total Account Balance, Account-Backed Fund Allocation.
- **Important rule:** Never below Rp0 at any point in recalculated history. Income increases it; Ordinary Expense, Transfer, and Debt Repayment decrease it; Fund Allocation moves money out of it into a fund allocation; Fund Release moves money back into it; a Fund-Linked Expense leaves it unchanged (PRD §9, §12, §16).
- **PRD reference:** PRD §9, §12, §16, §18, §28 (item 4).
- **Status:** Confirmed.

### Account-Backed Fund Allocation
- **Definition:** The portion of a Dedicated Fund's balance that is reserved from one specific Account.
- **Represents:** One account's contribution to a fund's total balance; a Dedicated Fund may hold allocations from multiple accounts, but each individual allocation is backed by exactly one source account.
- **Does not represent:** A historical Fund Allocation *event* — Fund Release and Fund-Linked Expense always draw from the account's *current* allocation balance for the fund, never a particular historical Fund Allocation event. No FIFO, LIFO, or allocation-lot relationship exists in v1.
- **Related terms:** Fund Allocation, Fund Release, Fund Balance, Total Account Balance, Unallocated Amount.
- **Important rule:** Never below Rp0 at any point in recalculated history (PRD §9, §14, §16, §28 item 4).
- **PRD reference:** PRD §9, §14, §16, §18, §28 (item 4).
- **Status:** Confirmed.

### Workspace Total Balance
- **Definition:** The sum of Total Account Balance across a workspace's active Accounts.
- **Represents:** A traceable aggregate — always derivable from the individual account balances it includes.
- **Does not represent:** A separately-stored or independently-editable number.
- **Related terms:** Total Account Balance.
- **PRD reference:** PRD §12, §18.
- **Status:** Confirmed (the concept and traceability requirement); whether archived accounts factor into historical totals and whether user-controlled exclusion is allowed remain **Still open** (PRD §12, §28).

---

## 8. Dedicated Fund and Goal Vocabulary

### Dedicated Fund
- **Definition:** A user-defined purpose for which money is reserved (e.g., an emergency fund, Qurban, Wife Savings, Mac Istri, Home Sweet Home).
- **Represents:** A virtual, purpose-based allocation of one or more accounts' balances.
- **Does not represent:** An Account. It is not real money custody, holds no money independently of the accounts backing it, and never moves or transfers real money. Named user purposes (Qurban, etc.) are always instances of this generic concept — never their own Event Type or Category (PRD §9, §13, CLAUDE.md §4).
- **Related terms:** Financial Goal, Fund Balance, Account-Backed Fund Allocation, Fund Allocation, Fund Release.
- **Important rule:** A single Dedicated Fund may contain allocations backed by several accounts; each allocation remains individually traceable to its source account. Do not use "Dompet" as a universal canonical term for this concept — "Dompet Digital" already denotes the E-Wallet Account Type (PRD §9, §22).
- **PRD reference:** PRD §9, §14, §28 (item 4).
- **Status:** Confirmed (concept and provenance rules); final UI terminology for this concept is explicitly undecided in the PRD (PRD §9 note, §22).

### Financial Goal
- **Definition:** A Dedicated Fund that additionally carries a Target Amount, behaving with progress tracking.
- **Represents:** The same underlying structure as a Dedicated Fund, with an optional target — Fund and Goal are one underlying concept, not two competing structures.
- **Does not represent:** A separate entity type from Dedicated Fund.
- **Related terms:** Dedicated Fund, Target Amount.
- **PRD reference:** PRD §14.
- **Status:** Confirmed.

### Target Amount
- **Definition:** An optional planning marker on a Dedicated Fund, expressing the amount the user is aiming to reach.
- **Represents:** A planning marker, not a hard cap — allocations may exceed it, shown as "target exceeded," and must never be blocked for that reason alone.
- **Does not represent:** A limit that blocks further Fund Allocation.
- **Related terms:** Financial Goal, Fund Balance.
- **PRD reference:** PRD §14.
- **Status:** Confirmed (the concept and non-blocking rule); whether a Target Amount can be changed/removed after allocation history exists, and whether a "completed" state is explicit or derived, remain **Still open** (PRD §14, §28).

### Fund Balance
- **Definition:** A Dedicated Fund's total current balance.
- **Represents:** The sum of that fund's Account-Backed Fund Allocations across all accounts backing it — always derivable per originating account, never an unexplained aggregate.
- **Does not represent:** A directly editable number — always derived from Fund Allocation, Fund Release, linked Expenses, and their corrections/deletions/restorations.
- **Related terms:** Account-Backed Fund Allocation, Dedicated Fund.
- **PRD reference:** PRD §14, §18.
- **Status:** Confirmed.

---

## 9. Debt Vocabulary

### Debt Record
- **Definition:** A minimal, structured representation of an existing liability the user already had before tracking it — name, Opening Outstanding Principal, effective date, optional note.
- **Represents:** The mandatory reference every Debt Repayment must point to; debt tracking itself is optional at the workspace level.
- **Does not represent:** An Account. Also does not represent new borrowing/issuance — original borrowing is out of scope; only repayment against an existing opening-balance debt is in v1 (PRD §8, §15).
- **Related terms:** Opening Outstanding Principal, Debt Repayment, Outstanding Principal.
- **PRD reference:** PRD §15.
- **Status:** Confirmed.

### Opening Outstanding Principal
- **Definition:** The Debt Record's starting liability amount as of its effective date.
- **Represents:** Starting state for a debt, analogous to an Account's Opening Balance — never Income or Expense.
- **Does not represent:** A Debt Repayment event.
- **Related terms:** Debt Record, Outstanding Principal, Opening-Balance Effective Date.
- **PRD reference:** PRD §15.
- **Status:** Confirmed.

### Outstanding Principal
- **Definition:** A Debt Record's current remaining liability, after all Debt Repayments to date.
- **Represents:** A value that decreases with each Debt Repayment.
- **Does not represent:** Interest, penalties, or fees — those are recorded as separate Expense events, never mixed into principal.
- **Related terms:** Debt Record, Debt Repayment.
- **Important rule:** Never below Rp0 at any point in recalculated history; an overpayment attempt is blocked (PRD §15, §16).
- **PRD reference:** PRD §11, §15, §16, §24, §28 (item 7).
- **Status:** Confirmed (whether an explicit Active/Paid-Off status label exists, distinct from a derived zero balance, remains **Still open** — PRD §15, §28).

---

## 10. Reporting and Time Vocabulary

### Reporting Period
- **Definition:** The time window used to group Financial Events for summaries and reports — either a Calendar Month or a Custom Monthly Cycle.
- **Represents:** A grouping determined by each event's Event Date, never by Created Timestamp or Updated Timestamp.
- **Does not represent:** A per-account, per-category, or per-fund cycle — only one active cycle definition exists per workspace.
- **Related terms:** Calendar Month, Custom Monthly Cycle, Event Date, Incomplete Period.
- **PRD reference:** PRD §17, §18.
- **Status:** Confirmed.

### Calendar Month
- **Definition:** The default v1 Reporting Period, requiring no setup.
- **Represents:** A standard month-based reporting window.
- **Does not represent:** The Custom Monthly Cycle.
- **Related terms:** Reporting Period, Custom Monthly Cycle.
- **PRD reference:** PRD §17.
- **Status:** Confirmed.

### Custom Monthly Cycle
- **Definition:** An optional Reporting Period, configured once at the workspace level, using a single recurring start day supported for days 1 through 28.
- **Represents:** An alternative to Calendar Month for workspaces with a non-calendar financial cycle (e.g., salary-cycle based).
- **Does not represent:** Multiple simultaneous cycles, or a start day in the 29–31 range (deferred).
- **Related terms:** Reporting Period, Calendar Month.
- **PRD reference:** PRD §17.
- **Status:** Confirmed (the mechanism); whether this is a widely shared need or founder-specific remains a **Future Validation Question** (PRD §28).

### Asia/Jakarta Workspace Timezone
- **Definition:** The single, fixed timezone every v1 workspace uses for "today," date defaults, day boundaries, and reporting-period boundaries.
- **Represents:** A workspace-level constant, not user-configurable and unaffected by device timezone or the user's physical location.
- **Does not represent:** A per-user or per-device timezone setting. Reporting cycles change over at 00:00 Asia/Jakarta.
- **Related terms:** Reporting Period, Event Date.
- **PRD reference:** PRD §17, §21, §28 (item 8).
- **Status:** Confirmed.

### Incomplete Period
- **Definition:** A Reporting Period with incomplete tracking history, which must be explicitly flagged.
- **Represents:** A period whose comparisons could otherwise misleadingly appear complete.
- **Does not represent:** A period with simply low activity — incompleteness refers specifically to gaps in tracking history, not low transaction volume.
- **Related terms:** Reporting Period.
- **PRD reference:** PRD §17.
- **Status:** Confirmed.

---

## 11. Correction and Lifecycle Vocabulary

### Correction
- **Definition:** The umbrella concept covering all ways a user can fix a mistake in recorded financial state — Same-Type Edit, Event Replacement, Soft Deletion, Restoration, and Opening Balance correction.
- **Represents:** Easy, transparent, non-destructive fixing of mistakes (PRODUCT_IDENTITY.md §7, PRD §7).
- **Does not represent:** Any specific one of its subtypes by itself.
- **Related terms:** Same-Type Edit, Event Replacement, Soft Deletion, Restoration.
- **PRD reference:** PRD §16 (section title), §24.
- **Status:** Confirmed.

### Same-Type Edit
- **Definition:** Editing a Financial Event's fields (amount, date, account, category/fund/debt reference, note) without changing its Event Type.
- **Represents:** An ordinary field edit; every valid edit recalculates all affected balances, funds, debts, summaries, reports, dashboard, and history immediately.
- **Does not represent:** An Event Replacement — changing the Event Type itself is never treated as an ordinary field edit.
- **Related terms:** Event Replacement, Chronological Recalculation.
- **PRD reference:** PRD §16, §24 (scenario 9).
- **Status:** Confirmed (concept fully specified in PRD §16; "Same-Type Edit" is this document's canonical label for that behavior).

### Event Replacement
- **Definition:** The guided flow used when a Financial Event's type must change (e.g., Expense → Income): the old event is marked as replaced, a new event is created with the required fields, and both remain linked for traceability.
- **Represents:** One correction action, presented to the user as a single step.
- **Does not represent:** A Same-Type Edit, and not two independent, unlinked events.
- **Related terms:** Same-Type Edit, Traceability.
- **PRD reference:** PRD §16, §24 (scenario 10).
- **Status:** Confirmed (whether a replaced event appears in ordinary history or only in its own detail/audit context remains **Still open** — PRD §16, §28).

### Soft Deletion
- **Definition:** The mechanism by which a Financial Event, when deleted, moves to a recoverable Trash state with its financial effect reversed immediately, remaining recoverable for a defined retention period.
- **Represents:** The default, reversible way financial events are removed in v1.
- **Does not represent:** Permanent Deletion. Deletion is not the default irreversible action in v1.
- **Related terms:** Trash, Restoration, Permanent Deletion.
- **PRD reference:** PRD §16.
- **Status:** Confirmed (the mechanism); the exact retention period (30 days is the current preference) remains **Still open** (PRD §16, §28).

### Trash
- **Definition:** The recoverable state a soft-deleted Financial Event resides in until its retention period elapses or it is restored.
- **Represents:** A holding state, not a final state.
- **Does not represent:** Permanent Deletion or an active event.
- **Related terms:** Soft Deletion, Restoration, Permanent Deletion.
- **PRD reference:** PRD §16.
- **Status:** Confirmed (the concept); whether manual Permanent Deletion from Trash is available in v1 remains **Still open** (PRD §16, §28).

### Restoration
- **Definition:** Reapplying a Trashed Financial Event's effect after revalidating its current dependencies.
- **Represents:** Reversal of a Soft Deletion; requires full chronological revalidation against every confirmed Financial Invariant, not only the current state.
- **Does not represent:** A guaranteed success — restoration can be blocked if it would leave any invariant invalid at any point in the recalculated history.
- **Related terms:** Soft Deletion, Trash, Chronological Recalculation, Financial Invariant.
- **PRD reference:** PRD §16, §24 (scenario 11).
- **Status:** Confirmed.

### Archive
- **Definition:** A history-preserving retirement state that stops an Account, Category, or Dedicated Fund from being used for new financial events, while preserving all its historical data.
- **Represents:** A shared *shape* — excluding the item from selectors for new events without erasing its history — but the precise lifecycle rules are concept-specific, not one universal rule:
  - **Account:** Archiving is permitted only when Total Account Balance is exactly Rp0; archiving preserves all financial history, excludes the account from selectors for new events, and **restoration to active use is confirmed** (PRD §12).
  - **Category:** Categories may be archived/hidden and **restoration is confirmed** ("Users may create, rename, archive/hide, and restore categories") (PRD §13).
  - **Dedicated Fund:** Archiving a Dedicated Fund **preserves all history**; archiving a non-zero-balance fund requires a warning and explicit resolution, never a silent reset. The PRD confirms archiving and history preservation for funds but does **not** state a restore-to-active-use rule for funds the way it does for Accounts and Categories — any Dedicated Fund restore behavior beyond "archiving preserves history" is **not explicitly confirmed** and remains for later detailed specification (PRD §14).
- **Does not represent:** Permanent Deletion. Also does not represent a single, uniform restoration guarantee across Account, Category, and Dedicated Fund — each concept's lifecycle rule must be read on its own terms.
- **Related terms:** Permanent Deletion, Account, Category, Dedicated Fund.
- **PRD reference:** PRD §12, §13, §14.
- **Status:** Confirmed (Account and Category archiving-and-restoration; Dedicated Fund archiving-and-history-preservation). Whether archiving a non-zero-balance Dedicated Fund is ever blocked outright vs. always allowed with confirmation, and the exact Dedicated Fund restore behavior, remain **Still open** (PRD §14, §28) — not resolved by this document.

### Permanent Deletion
- **Definition:** Irreversible removal, allowed only for items that were never used and carry no financial history or dependencies (e.g., an Account with an Rp0 opening balance and no history; a Category with no transaction history; a Dedicated Fund with zero balance and zero event history).
- **Represents:** A narrow, safety-gated capability — not the default correction path.
- **Does not represent:** Soft Deletion or Archive.
- **Related terms:** Soft Deletion, Trash, Archive.
- **PRD reference:** PRD §12, §13, §14.
- **Status:** Confirmed.

### Chronological Recalculation
- **Definition:** Whenever an event, opening balance, date, account/fund/debt reference, deletion, restoration, or replacement changes historical financial state, the product recalculates the affected history from the earliest affected point forward — never only the final/current balance.
- **Represents:** A first-class requirement: every confirmed Financial Invariant must hold at *every* point in the recalculated history, not only in the current state.
- **Does not represent:** A recalculation that only checks the final balance.
- **Related terms:** Financial Invariant, Deterministic Same-Date Ordering, Impact Preview.
- **PRD reference:** PRD §9, §12, §14, §15, §16, §24.
- **Status:** Confirmed.

### Deterministic Same-Date Ordering
- **Definition:** The requirement that when multiple Financial Events share the same Event Date, Chronological Recalculation applies a stable, reproducible ordering among them.
- **Represents:** A confirmed requirement for reproducibility.
- **Does not represent:** Any specific ordering mechanism — the exact mechanism is explicitly **deferred to domain modeling or detailed specification** and is not decided by this document or the PRD.
- **Related terms:** Chronological Recalculation, Event Date.
- **PRD reference:** PRD §16.
- **Status:** Still open (mechanism); the *requirement* for determinism itself is Confirmed.

### Impact Preview
- **Definition:** A before/after view of the effect of a material change (e.g., moving an Opening-Balance Effective Date, changing a Reporting Period cycle), shown before the user confirms it.
- **Represents:** A required confirmation step for changes with historical or cross-period effect.
- **Does not represent:** A change that has already taken effect — the preview happens before confirmation.
- **Related terms:** Chronological Recalculation, Opening-Balance Effective Date, Reporting Period.
- **PRD reference:** PRD §12, §15, §17.
- **Status:** Confirmed (the requirement); the exact threshold for which changes require an Impact Preview remains **Still open** (PRD §16, §28).

---

## 12. Financial Invariants

### Financial Invariant
- **Definition:** A condition that must remain true of a workspace's financial state at every point in time, including every point in a Chronologically Recalculated history — not only the current/final state.
- **Represents:** The non-negotiable correctness rules underlying "Trust first."
- **Does not represent:** A UX preference or a default that can be silently overridden.
- **Related terms:** Chronological Recalculation.
- **PRD reference:** PRD §9, §16.
- **Status:** Confirmed.

**The confirmed v1 Financial Invariants, at product-language level:**

1. **Total Account Balance is never below Rp0**, for every account, at every point in recalculated history.
2. **Unallocated Amount is never below Rp0**, for every account, at every point in recalculated history.
3. **Every Account-Backed Fund Allocation is never below Rp0**, at every point in recalculated history.
4. **The account balance equation always holds:** Total Account Balance = Unallocated Amount + the sum of all current Account-Backed Fund Allocations for that account.
5. **Outstanding Principal is never below Rp0**, for every debt record, at every point in recalculated history.
6. **Event dates remain valid** against the relevant account's and debt's Opening-Balance Effective Date — an Event Date can never precede it (same-date is allowed).
7. **Recalculation is deterministic when events share the same Event Date** — see Deterministic Same-Date Ordering above; the exact ordering mechanism is deferred, not decided here.

A change that would make any of the above false at any point in the recalculated history is blocked with a clear explanation and next steps — never silently applied (PRD §16).

---

## 13. Preferred Terms

Use these terms in domain discussion, modeling, tests, and specifications:

| Prefer | Instead of | Why |
|---|---|---|
| **Financial Event** | "transaction" (in precise/technical contexts) | "Transaction" is acceptable conversationally, but Financial Event is the exact canonical term (PRD §9, §11). |
| **Total Account Balance** | "balance" (unqualified) | "Balance" alone does not specify which of the three components is meant (PRD §9). |
| **Unallocated Amount** | "available balance," "spendable balance" | "Available balance" is prohibited as an unexplained canonical term (PRD §9). |
| **Account-Backed Fund Allocation** | "fund balance from an account," "allocated money" | Precisely names the per-account-backed component of a fund's balance (PRD §9, §14). |
| **Dedicated Fund** | "wallet," "dompet," "pocket," "savings" | Avoids collision with E-Wallet ("Dompet Digital") and avoids the ambiguity of "savings" (PRD §9, §22). |
| **Fund Allocation** | "fund contribution," "saving," "deposit to fund" | Fund Allocation is the precise structural event name (PRD §11). |
| **Opening Balance** | "starting balance," "initial deposit" | Opening Balance is the PRD's exact term and is explicitly not Income (PRD §9, §12). |
| **Same-Type Edit** / **Event Replacement** | "edit," "delete and redo" (unqualified) | Distinguishes an ordinary field edit from a guided type-change flow (PRD §16). |
| **Soft Deletion** / **Trash** / **Permanent Deletion** | "delete" (unqualified) | Distinguishes reversible from irreversible removal (PRD §16). |

---

## 14. Ambiguous or Prohibited Terms

### `available balance`
- **Status:** Prohibited as an unexplained canonical term.
- **Use instead:** Total Account Balance, Unallocated Amount, or Account-Backed Fund Allocation, depending on which quantity is meant (PRD §9).

### `wallet` / `dompet`
- **Status:** Not a canonical replacement for Dedicated Fund.
- **Rule:** May appear only where the PRD already uses "Dompet Digital" for the E-Wallet Account Type. Using "Dompet" generically for a Dedicated Fund would collide with this existing usage (PRD §9, §22).

### `savings`
- **Status:** Too ambiguous unless explicitly referring to a user-defined Dedicated Fund/Financial Goal.
- **Rule:** Must never become a universal Event Type. "Tabungan" is explicitly listed in the PRD as a name that must never appear as a Category, since it actually represents a fund purpose (PRD §13).

### `fund contribution`
- **Status:** Discouraged for the structural event.
- **Use instead:** Fund Allocation, when describing the structural event (PRD §11).

### `transaction`
- **Status:** Acceptable conversationally.
- **Rule:** Financial Event is the precise canonical domain term when precision matters (PRD §9, §11).

### `delete`
- **Status:** Ambiguous unqualified.
- **Rule:** Distinguish Soft Deletion, Trash, and Permanent Deletion — each has a distinct, non-interchangeable meaning (PRD §16).

### `balance`
- **Status:** Never used alone in domain-precise contexts.
- **Rule:** Use Total Account Balance, Unallocated Amount, Fund Balance, Account-Backed Fund Allocation, Outstanding Principal, or Workspace Total Balance — whichever is actually intended (PRD §9, §12, §14, §15, §18).

### `account` (as authentication identity vs. financial Account)
- **Status:** Flagged ambiguity found in the source documents.
- **Detail:** PRD §10 describes onboarding as "creates account credentials (email + password)" — using "account" to mean an authentication identity — while the domain term **Account** (capitalized in this document) means a money-holding location (PRD §12). These are different concepts using the same word.
- **Recommendation:** In domain-precise writing, distinguish "user account" / "authentication account" (the login identity — closer to the **User** concept in this glossary, §5) from **Account** (the financial concept, §7). This document does not rename either — it flags the collision for domain modeling to resolve explicitly.

### `goal` vs. `fund`
- **Status:** Not an ambiguity — a potential false ambiguity worth pre-empting.
- **Detail:** The PRD explicitly confirms Fund and Goal are **one underlying concept** — a fund without a Target Amount is open-ended; a fund with one behaves as a goal (PRD §14). Do not treat "goal" as a separate structural concept from Dedicated Fund.

### `saldo` (Bahasa Indonesia "balance")
- **Status:** Still open / candidate.
- **Detail:** The onboarding flow's candidate label "Masukkan saldo saat ini" uses "saldo" for what the internal model calls Total Account Balance / Unallocated Amount at creation (PRD §10). Like its English counterpart "balance," bare "saldo" will need qualification once distinct Bahasa Indonesia labels for Total Account Balance, Unallocated Amount, and Fund Balance are chosen — this is explicitly part of the still-pending UX terminology review (PRD §22, §28) and is not resolved here.

---

## 15. Examples and Non-Examples

- Salary entering an account named **BCA** is **Income** — money enters the workspace from an external source (PRD §11).
- Moving money from **BCA** to **GoPay** is a **Transfer** — money moves between two of the user's own accounts; it is never counted as Income or Expense (PRD §11).
- Reserving BCA money for **Qurban** is a **Fund Allocation** — Qurban is a Dedicated Fund's name, not an Event Type or Category; the allocation reduces BCA's Unallocated Amount and increases the Qurban fund's BCA-backed allocation, without changing BCA's Total Account Balance (PRD §9, §11, §13, §14).
- Spending Qurban money from its matching BCA-backed allocation is a **Fund-Linked Expense** — it decreases BCA's Total Account Balance and the Qurban/BCA allocation, while leaving BCA's Unallocated Amount unchanged (PRD §11, §14).
- Paying down an existing debt's principal is a **Debt Repayment**, not an Ordinary Expense — it decreases the payment account and the Outstanding Principal, without inflating ordinary spending totals (PRD §11, §15).
- Interest or late-payment penalties on that same debt are recorded as **separate Expense events** — never mixed into the Debt Repayment's principal (PRD §15).
- Setting an account's **Opening Balance** is not **Income** — it is starting state (PRD §9, §11, §12).
- **Qurban** is a Dedicated Fund's name — never an Event Type (there is no "Qurban" event) and never a Category (PRD §13, §14; CLAUDE.md §4).
- A **Fund Release** does not change Total Account Balance — it only moves money from an Account-Backed Fund Allocation back into Unallocated Amount on the same account (PRD §11, §14).
- A **Transfer** does not automatically carry fund purpose — moving money from an account that backed a Qurban allocation to another account does not create a Qurban allocation on the destination account; that requires an explicit Fund Release followed by a new Fund Allocation (PRD §11, §14).

---

## 16. Still-Open Terminology Questions

The following terminology-related questions are extracted from PRD §28 and remain genuinely open. This document does **not** answer them.

- **Final Bahasa Indonesia UI terminology** for the six Financial Event types and four Account Types — candidates are given in PRD §22, but are explicitly not final and pending UX terminology review.
- **Final exact wording and count of starter Categories** — candidates are given in PRD §13, expressed directly in Bahasa Indonesia, but not final.
- **Whether a "Refund/Reimbursement" Income Category belongs in the default set**, given deferred refund mechanics (PRD §13, §28).
- **Whether debt status ("Active"/"Paid Off") is an explicit named state or purely derived** from Outstanding Principal — affects whether these become formal domain vocabulary (PRD §15, §28).
- **Whether a Financial Goal "completed" state is explicit or purely derived** from Fund Balance vs. Target Amount — affects whether "Completed"/"Goal Completed" becomes formal vocabulary (PRD §14, §28).
- **Whether creditor/lender name is a separate Debt Record field** or folded into the debt name — a naming question that may introduce a new term (e.g., "Creditor") (PRD §15, §28).
- **Final UI terminology for the Dedicated Fund concept itself** — the PRD explicitly states this is undecided, only ruling out "Dompet" as a universal replacement (PRD §9, §22, §28).

Terminology distinctions preserved by this document:

- Terms whose **domain meaning is already Confirmed**: all terms in §5–§12 marked "Status: Confirmed."
- **Candidate Bahasa Indonesia labels still awaiting UX review**: all terms in §5–§12 marked "Candidate terminology," and every entry in PRD §22's terminology table.
- **Product decisions outside this document's scope**: anything listed under PRD §28's "Product Decisions," "UX Decisions," "Security and Privacy Decisions," "Operational Decisions," or "Future Validation Questions" subsections that is not itself a naming/terminology question.
- **Future concepts excluded from v1**: Household collaboration and Learning Mode vocabulary is not defined here — both are future direction only (PRODUCT_IDENTITY.md §10, §14; PRD §8, §29; CLAUDE.md §3).

---

## 17. PRD Traceability

| Domain Language Group (this document) | Primary PRD Sections |
|---|---|
| Core Domain Glossary (§5) | PRD §6, §9, §11, §12, §13, §16, §19, §20 |
| Financial Event Glossary (§6) | PRD §9, §11, §14, §24 |
| Account and Balance Vocabulary (§7) | PRD §9, §12, §16, §18, §28 |
| Dedicated Fund and Goal Vocabulary (§8) | PRD §9, §14, §22, §28 |
| Debt Vocabulary (§9) | PRD §11, §15, §16, §24, §28 |
| Reporting and Time Vocabulary (§10) | PRD §17, §21, §28 |
| Correction and Lifecycle Vocabulary (§11) | PRD §12, §14, §15, §16, §24, §28 |
| Financial Invariants (§12) | PRD §9, §16 |
| Preferred / Ambiguous / Prohibited Terms (§13, §14) | PRD §9, §11, §13, §14, §22 |
| Examples and Non-Examples (§15) | PRD §9, §11, §13, §14, §15 |
| Still-Open Terminology Questions (§16) | PRD §28 (all subsections except "Resolved Decisions Before Domain Modeling") |

This document carries forward, without change, the PRD's confirmed balance model — **Total Account Balance = Unallocated Amount + the sum of all current Account-Backed Fund Allocations for that account** — and every confirmed Fund, Debt, Chronological Recalculation, Asia/Jakarta timezone, Event Date, Correction, and Traceability distinction defined in PRD §9, §11, §12, §14, §15, §16, §17, and §19.
