# Annotasi Finance — MVP Product Requirements Document

## 1. Document Status

- Status: Draft for review
- Product phase: Private Beta MVP
- UI language: Bahasa Indonesia
- Scope: Product requirements only, not technical architecture. No technology, framework, database, or API decisions are made in this document.
- Basis: This PRD is derived only from `docs/product/PRODUCT_IDENTITY.md` (approved product foundation), `CLAUDE.md` (AI working guide), and the confirmed decisions from the completed 12-question PRD discovery interview.

---

## 2. Product Summary

Annotasi Finance is a mobile-first personal finance application whose first job is to be trustworthy: every financial event is recorded once, represented according to what it actually did financially, and reflected consistently everywhere the user looks — account balances, transaction history, dedicated funds and goals, summaries, reports, and the dashboard. **(Confirmed)**

The v1 private beta is a single-owner, private-workspace product for invited users. It is **intended to replace** an existing Telegram-bot-and-Google-Sheets workaround by correctly distinguishing income, expense, transfers, dedicated-fund allocations, and debt repayments — the exact events that workaround has historically misrepresented. **(Confirmed: this is the product's intent and mechanism.)** Whether it actually succeeds in replacing that workaround, for the founder or for beta users, is an outcome to be observed after real usage, not a guarantee established by this document. **(Hypothesis — requires validation; see Section 25.)**

---

## 3. Problem Statement

Financial data cannot currently be trusted in the founder's existing workflow, and that undermines everything built on top of it. Specifically:

- Transfers between the user's own accounts get counted as income or expense.
- Debt repayments get counted as ordinary daily spending.
- Contributions to a dedicated fund (e.g., Qurban) get recorded as generic savings rather than an allocation to their intended purpose.
- It is unclear whether displayed values are manually entered or calculated, and there is no single reliable source of truth.
- The existing system only records — it does not help the user understand or reflect on financial behavior. **(Confirmed)**

**(Hypothesis — requires validation)** Generic finance apps may solve basic recording but may force real financial events into an ambiguous model without making each event's actual financial effect explicit — meaning the underlying gap is "no trustworthy representation of what happened," not "no categories."

---

## 4. Product Promise

> "Record a financial event once, represent what actually happened, and show a result the user can understand and trust."

Trustworthy handling means correctly capturing the actual financial effect of an event — a transfer moves money between the user's own accounts and is neither income nor expense; a Fund Allocation reduces unallocated amount and increases the selected fund allocation without changing total account balance or income/expense totals; a debt repayment reduces both cash and outstanding debt without inflating ordinary spending. **(Confirmed)**

---

## 5. Product Principles

- **Trust first** — no feature outranks correctly representing what happened and correctly calculating its effect.
- **Financial events before categories** — what happened financially is modeled before how it is categorized or displayed.
- **Explain every important number** — balances, totals, and insights must be traceable to understandable financial records.
- **Simple by default, flexible when needed** — a new user can record a transaction on day one without configuring anything; customization is progressive and optional.
- **Clarity without shame** — the product shows reality honestly without delivering a verdict about the user.
- **Make progress visible, not fragile** — progress framing is descriptive, not binary or punitive.
- **Help users notice before giving them something to pursue** — reflection and pattern awareness come before any milestone or challenge mechanic.

**(All Confirmed, carried directly from PRODUCT_IDENTITY.md and CLAUDE.md)**

---

## 6. Target Users and Private-Beta Scope

- Annotasi Finance is a **multi-user platform** — anyone invited registers their own account. **(Confirmed)**
- Each user has exactly **one private, single-owner workspace** in v1 — no shared editing, invitations, roles, or collaborative households. **(Confirmed)**
- Access during the first release is **invitation-based**, reflecting a limited private beta rather than an open or large-scale launch. **(Confirmed)**
- Beta users are expected to want a working system with sensible defaults, not a blank canvas. **(Hypothesis — requires validation)**
- **Household collaboration** (spouse invitations, shared/personal accounts, roles, audit trail) is **excluded from v1** and is future direction only.
- **Learning Mode** (teacher/student simulation) is **excluded from v1** and is future direction only; teachers must never receive access to a student's real personal financial data under any future design.

---

## 7. MVP Goals

Confirmed product-requirement goals for v1:

1. Reliably record all six confirmed v1 financial event types with correct, explicit financial effects.
2. Correctly and distinctly handle transfers and dedicated-fund allocations so they are never mistaken for income or expense.
3. Keep every dependent view (accounts, history, funds, debts, summaries, reports, dashboard) consistent with every recorded event, at all times.
4. Make every important number traceable back to the records that produced it.
5. Allow easy, transparent, non-destructive correction of mistakes.
6. Deliver a mobile-first experience where every core flow is fully usable on a phone.
7. Provide a guided, low-friction first-use journey that produces one trusted recorded event without requiring upfront configuration.

**(Confirmed — derived directly from PRODUCT_IDENTITY.md §7 foundation items and the discovery interview)**

A further, ultimate aim of the product is for the founder to no longer need Telegram and Google Sheets, and for beta users to no longer need a parallel system to verify Annotasi Finance. This is **not** a pre-launch requirement and must not be treated as already achieved by shipping the above goals — it is an outcome measured after real usage. **(Hypothesis — requires validation; see Section 25.)**

---

## 8. Non-Goals

The following are explicitly out of scope for the v1 private beta:

- Banking services, or holding/transferring user funds (v1 is not banking software).
- Investment or trading functionality, investment projections, or credit/financial-health scores.
- Household collaboration — shared editing, invitations, roles, or audit trails across multiple people.
- Learning Mode and any teacher/student simulation features.
- Split transactions (one payment across multiple categories, accounts, or partially fund-backed).
- Recurring or scheduled transactions.
- New debt borrowing/issuance as its own event (only debt *repayment* against an existing opening-balance debt record is in scope).
- Merchant refunds and linked reversal mechanics (deferred pending beta validation).
- Multi-currency, foreign-currency accounts, and exchange-rate conversion — v1 uses Indonesian Rupiah (IDR) only, as a single fixed workspace currency (see Section 9 and Section 28).
- Transfers involving accounts not owned by the same user.
- Broad gamification — points, badges, levels, streaks, leaderboards, competitive comparisons, or proactive behavioral coaching.
- Forecasting, predictive spending, AI-generated financial advice, automated budget recommendations, or any speculative "you will run out of money" messaging.
- A routine admin/support interface for browsing raw user financial data.
- Full offline-first synchronization.

**(Confirmed — all explicitly excluded during the discovery interview and/or PRODUCT_IDENTITY.md §14)**

---

## 9. Core Product Concepts

Seven concepts must remain distinct throughout the product, its language, and its future specification. This section defines their product-level meaning only — no database entities or schemas are implied.

- **Financial event** — the nature of what financially happened. A small, closed, structural set in v1 (see Section 11). Determines the actual financial effect.
- **Account** — where money actually or operationally resides (e.g., cash, a bank account, an e-wallet). Never a category, fund, debt record, or reporting label.
- **Category** — a descriptive label applied only to Income and Expense events, explaining their purpose. Never determines financial effect.
- **Dedicated fund / financial goal** — a user-defined purpose for which money is reserved (e.g., an emergency fund, a named savings purpose). A fund with an optional target amount behaves as a goal. A dedicated fund is a **virtual allocation of an account's balance, not a physical account**: *"Dana tujuan adalah pembagian virtual dari saldo akun, similar in concept to purpose-based pockets, but Annotasi Finance does not hold or transfer real funds."* Every real account has a total account balance and an unallocated amount, plus zero or more virtual fund allocations; a single fund may hold allocations originating from multiple accounts, but each individual fund allocation is backed by exactly one source account (see Section 14), and a Fund Release always draws from that account's *current* allocation balance for the fund — never a particular historical Fund Allocation event. Fund Allocation and Fund Release never move real money and never change an account's total account balance; they only reclassify how much of that balance is currently unallocated versus allocated to a fund. **(Note:** final UI terminology for this concept is undecided; "Dompet" must not be used as a universal term for it, since "Dompet Digital" already denotes the E-Wallet account type — see Section 22.)
- **Debt record** — a minimal, structured representation of an existing liability (name, opening outstanding principal, effective date), distinct from an account, referenced by Debt Repayment events.
- **Reporting period** — the time window (calendar month or an optional custom monthly cycle) used to group events for summaries and reports.
- **Opening balance** — the starting state of an account (or debt), not a financial event, and never treated as income or expense.

**(Confirmed)** Named user purposes such as Qurban, Wife Savings, Mac Istri, Home Sweet Home, or Emergency Fund are always instances of the generic "dedicated fund/goal" concept — never their own event types, categories, or universal structures.

**(Confirmed)** Every v1 workspace uses one fixed currency: Indonesian Rupiah (IDR). All accounts, funds, debt records, opening balances, financial events, summaries, reports, and dashboard values are expressed in IDR. Monetary values are represented as whole Rupiah amounts without fractional currency units. Users do not select a currency during onboarding or event recording. Multi-currency, foreign-currency accounts, and exchange-rate conversion remain outside v1 (see Section 8).

**(Confirmed)** For every account: **total account balance = unallocated amount + the sum of that account's current fund allocations.** All three — total account balance, unallocated amount, and each fund allocation — are non-negative in v1. Income increases both total account balance and unallocated amount. An Expense without a fund reference, a Transfer, and a Debt Repayment each consume only unallocated amount (never a fund allocation), decreasing total account balance by the same amount. A Fund Allocation moves money from unallocated amount into a fund allocation backed by the same account; a Fund Release moves it back into unallocated amount; neither changes total account balance. A fund-linked Expense consumes the selected fund's allocation backed by the payment account, decreasing both total account balance and that allocation, while leaving unallocated amount unchanged — it does not require sufficient unallocated amount. Throughout this document, **total account balance**, **unallocated amount**, and **fund allocation from the selected account** are the precise terms for these three components; the ambiguous phrase "available balance" is avoided because it does not specify which of these it refers to.

**(Confirmed)** When an account is first created, its opening balance initializes both total account balance and unallocated amount to that same value; the account's initial fund allocations are Rp0. Opening balance is never treated as Income. Any allocation of that money to a dedicated fund must be recorded explicitly and separately, afterward, through a Fund Allocation event (Section 11).

**(Confirmed)** Whenever an event, opening balance, date, account reference, fund reference, debt reference, deletion, restoration, or replacement changes historical financial state, the product recalculates the affected history chronologically from the earliest affected point forward, and the invariants above — together with valid event dates and non-negative outstanding debt principal — must hold at every point in that recalculated history, not only in the current state. See Section 16 for the full recalculation requirement.

---

## 10. First-Use and Onboarding Journey

**(Confirmed)** The guided first-use journey is:

1. User accepts a private-beta invitation, creates account credentials (email + password), and accepts applicable privacy terms.
2. Email verification is required before any real financial data can be entered. Before verification, the user may view a short welcome screen and resend the verification email, but cannot confirm an opening balance, record an event, or create a real fund/debt record.
3. A short welcome message states the core promise in simple language ("Catat sekali, lalu pahami dari mana angkanya berasal") — not a long product tour.
4. The user chooses one starter-account type — **Tunai**, **Rekening Bank**, **Dompet Digital**, or **Lainnya** (internal canonical names: Cash, Bank Account, E-Wallet, Other) — and accepts or renames the suggested default name.
5. The user explicitly confirms the account's starting point by choosing one of two options: **"Masukkan saldo saat ini"** (recommended; internal canonical name: Enter current balance) or **"Mulai mencatat dari nol"** (internal canonical name: Start tracking from zero) — with the consequence of each choice explained in plain Bahasa Indonesia. Zero is never silently assumed to be a verified real balance.
6. The user records one guided Income or Expense event using only essential fields: what happened, amount, account, category (default/simple selection), date (defaults to today, editable), optional note.
7. The user sees an explicit confirmation of what the system understood (event type, amount, account, category, balance effect) before/after saving.
8. The recorded event appears consistently in transaction history, account balance, and summary immediately.
9. The user may correct the transaction immediately if the representation is wrong.
10. Onboarding is considered complete once: one active account exists, the opening-balance choice is explicitly confirmed, one event is recorded, and its effect is visible consistently across history and summary. This does **not** require configuring funds, additional accounts, custom categories, custom reporting cycle, or debt tracking.
11. Funds/goals may be briefly introduced as an optional, non-blocking capability after the first transaction.
12. The session ends with one optional, non-blocking next-step suggestion (e.g., add another account, review the transaction).
13. If onboarding is interrupted, the user resumes from their last confirmed step without restarting signup or losing confirmed progress; partially entered financial-event data is never silently saved as a real event.

**(Confirmed)** Every workspace uses a single fixed timezone, Asia/Jakarta; "today" and all date defaults throughout onboarding (and the rest of the product) are computed in Asia/Jakarta regardless of the user's device timezone or physical location, and are not user-configurable in v1 (see Section 17).

**Still undecided:** whether the first guided event type is fixed or user-selectable; whether users may skip the guided flow entirely during private beta; exact placement and cadence of the optional post-onboarding setup checklist.

---

## 11. Financial Event Requirements

The v1 financial event set is closed at **six types**. Opening balance is explicitly **not** a financial event — it is account/debt starting state. Candidate Bahasa Indonesia labels for these event types are given in Section 22's terminology note; the English names below are the internal/canonical concept names used in this document, not final UI text. Every event's amount is expressed in Indonesian Rupiah (IDR) as a whole Rupiah amount (Section 9), and every event's date is validated against the effective date of each account (and, for Debt Repayment, the debt record) it references (Section 12, Section 15).

### 1. Income

- **Meaning:** Money enters the workspace from an external source (salary, freelance payment, gift, business income).
- **Required references:** one account, one income category.
- **Account effect:** increases both the selected account's total account balance and its unallocated amount.
- **Reporting effect:** increases income totals for the relevant period; never affects expense totals.
- **Fund/debt effect:** none automatically.
- **Must never be:** money moved from another account owned by the same user (that is a Transfer).

### 2. Expense

- **Meaning:** Money leaves an account for a good, service, obligation, or consumption.
- **Required references:** one account, one expense category; optionally, one dedicated fund.
- **Account effect:** if not linked to a fund, decreases the selected account's total account balance and its unallocated amount; cannot exceed the account's currently unallocated amount, and insufficient unallocated amount blocks saving with a clear explanation (Section 12). If linked to a fund, see Fund/debt effect below.
- **Reporting effect:** increases spending totals for the relevant period; never affects income totals.
- **Fund/debt effect:** if linked to a fund, the Expense's single payment account must be the same account backing the fund allocation being drawn down. The amount must not exceed the selected fund's current allocation from that payment account, and must not make the payment account's total account balance negative; it does not require sufficient unallocated amount, and unallocated amount remains unchanged. Allocations belonging to a different account are never automatically consumed (see Section 14). If the fund allocation from that account is insufficient, saving is blocked with a clear explanation and next steps. The expense is counted once in spending totals, and the fund's prior allocation is not counted as an expense.
- **Must never be:** a Transfer or the principal portion of a Debt Repayment.

### 3. Transfer

- **Meaning:** Money moves between two accounts owned by the same user.
- **Required references:** one source account, one destination account (both owned by the user).
- **Account effect:** decreases the source account's total account balance and unallocated amount; increases the destination account's total account balance and unallocated amount. The amount cannot exceed the source account's currently unallocated amount (a Transfer never consumes a fund allocation), and insufficient unallocated amount blocks saving with a clear explanation (Section 12).
- **Reporting effect:** never counted as income or expense; does not change total money owned by the user.
- **Fund/debt effect:** none. A Transfer never automatically moves or reassigns a virtual fund allocation tied to the source or destination account. If the user's intended purpose should follow the moved money, that must be recorded explicitly through a Fund Release on the original account-backed allocation followed by a new Fund Allocation on the destination account — the product must never infer that transferred money retains its prior fund purpose.
- **Must never be:** represented as two independent, potentially inconsistent income/expense records — both sides remain one linked event.

### 4. Fund Allocation

- **Meaning:** The user reserves existing money for a named purpose.
- **Required references:** one dedicated fund, one source account.
- **Account effect:** none to total account balance.
- **Reporting effect:** never counted as income or expense; does not change net financial position.
- **Fund effect:** decreases the source account's unallocated amount and increases the selected fund's allocation backed by that same account; total account balance does not change. Cannot exceed the amount currently unallocated in that account. This source-account reference means the fund's balance can always be broken down per originating account (Section 14).
- **Must never be:** its own universal transaction type per named fund (e.g., "Qurban" is not an event type), nor a stand-in for a generic savings category.

### 5. Fund Release

- **Meaning:** The user moves previously allocated money from a fund back into unallocated amount, without implying the original allocation was a mistake.
- **Required references:** one dedicated fund, and exactly one source account. The release draws from that account's *current* allocation balance for the fund — it does not select any particular historical Fund Allocation event.
- **Account effect:** none to total account balance.
- **Reporting effect:** never counted as income or expense.
- **Fund effect:** decreases the selected fund's allocation backed by the chosen source account and increases that account's unallocated amount by the same amount; total account balance does not change. Cannot exceed that account's current allocation balance for the fund — not merely the fund's total balance across all accounts. The system never automatically consumes an allocation from a different account; FIFO, LIFO, allocation lots, or other automatic ordering are outside v1 (see Section 14).
- **Must never be:** confused with deleting/correcting a Fund Allocation (which implies the original record was wrong).

### 6. Debt Repayment

- **Meaning:** The user pays down an existing debt balance.
- **Required references:** one existing debt record, one payment account. Cannot exist without a debt record (no free-text debt labels).
- **Account effect:** decreases the payment account's total account balance and unallocated amount; cannot exceed the payment account's currently unallocated amount (a Debt Repayment never consumes a fund allocation). Insufficient unallocated amount blocks saving with a clear explanation, distinct from the separate block on repaying more than the outstanding debt itself (Section 12).
- **Reporting effect:** principal is never counted as ordinary expense or income; interest, penalties, or fees are recorded separately as Expense events.
- **Debt effect:** decreases the outstanding debt balance. Cannot reduce outstanding debt below zero; an overpayment attempt must be blocked or require correction before saving.

**(Confirmed)** Opening balance remains outside this list, applies to both accounts and debt records, is never income or expense, and requires its own confirmation/correction flow (see Sections 10, 12, 15, 16). The relationship between an event's date and an account's or debt's opening-balance effective date is defined in Section 12 (accounts) and Section 15 (debt records).

---

## 12. Account Requirements

**(Confirmed)**

- An account represents where money actually/operationally resides (physical cash, bank account, e-wallet). It is never a category, fund, debt record, person, or reporting label.
- Every v1 account is **asset-like and money-holding**; credit-card liability accounts, overdraft accounts, and other negative-balance asset accounts are outside v1. An existing liability is represented separately through Debt Record (Section 15), never as a negative account balance.
- Minimum structure: user-defined name, account type, opening balance, opening-balance effective date, active/archived state, optional note.
- Account type is a fixed v1 list — internal canonical names **Cash, Bank Account, E-Wallet, Other** (candidate Bahasa Indonesia labels: Tunai, Rekening Bank, Dompet Digital, Lainnya) — descriptive only; it must never alter the financial semantics of a transaction (a Transfer is a Transfer regardless of account type).
- The **Other / Lainnya** account type remains an **asset-like, money-holding account** in v1 (e.g., an uncategorized cash-equivalent or e-money holding). It must **not** be used to represent a debt, credit-card liability, or investment account — those remain out of the account concept entirely (debt is its own record per Section 15; investment accounts are out of scope per Section 8).
- Multiple accounts are a day-one v1 capability (required for Transfer to be meaningful and for a trustworthy total position).
- Onboarding starts with exactly one account, chosen and optionally renamed by the user (see Section 10); additional accounts are added afterward as an optional step.
- Every account requires the explicit opening-balance starting-point decision (enter current balance vs. start from zero) before it can be used for a real transaction. Opening balance must never be negative. At creation, opening balance initializes both total account balance and unallocated amount to the same value, with initial fund allocations at Rp0 (Section 9); any later allocation to a dedicated fund must be recorded explicitly through Fund Allocation (Section 11).
- **Total account balance and unallocated amount must never fall below Rp0.** An Expense without a fund reference, a Transfer, and a Debt Repayment are blocked when the selected payment/source account has insufficient unallocated amount to cover the amount, with a clear explanation and next steps rather than allowing the balance to go negative. A fund-linked Expense is validated differently: it may proceed even when unallocated amount is lower than the amount, as long as the matching fund allocation from the payment account is sufficient (see Section 14).
- All account balances and opening balances are expressed in **Indonesian Rupiah (IDR)** as whole Rupiah amounts, consistent with the workspace's single fixed currency (see Section 9); v1 has no currency field or currency selection.
- A financial event's date can never be earlier than the effective date of every account it references (both accounts for a Transfer; the single account for Income, Expense, Fund Allocation, Fund Release, or Debt Repayment); an event dated exactly on the opening-balance effective date is allowed. To record an earlier event, the user must first explicitly move the account's opening-balance effective date earlier — the system never changes it automatically. Changing the opening-balance effective date requires an impact preview and triggers the chronological recalculation defined in Section 16, which must leave every confirmed invariant (Section 9) valid at every affected historical point, not only the final balance; an event date or balance that would become invalid as a result is blocked with a clear explanation and next steps.
- A workspace total balance across active accounts must be traceable to the individual account balances it includes.
- **Archiving** is the normal way to stop using an account, but is only permitted when the account's **total account balance** is exactly Rp0. If the account still has fund allocations, the user must first use Fund Release to move those allocations into the account's unallocated amount — Fund Release alone never changes total account balance, so it never brings an account to Rp0 by itself. The user must then explicitly Transfer the remaining unallocated amount elsewhere, or otherwise correctly record its disposition, before the total account balance reaches Rp0. An account with a non-zero total account balance cannot be archived through confirmation alone — the product must explain the remaining balance and offer these next steps rather than automatically transferring, spending, deleting, zeroing, or otherwise correcting the balance on the user's behalf; no automatic event or balance adjustment ever occurs. Once total account balance reaches Rp0, the account may be archived; archiving preserves all financial history, excludes the account from selectors for new financial events, and the account can be restored to active use.
- **Permanent deletion** is allowed only for an account that was never used, has an opening balance of Rp0, and has no financial history or dependencies; otherwise, deletion is blocked and archiving is required.
- Archiving an account must preserve all historical fund-allocation and debt-repayment links tied to it.

**Still undecided:** whether the workspace total allows user-controlled account exclusion; whether archived accounts remain in historical reporting-period/workspace totals.

---

## 13. Category Requirements

**(Confirmed)**

- A category is a descriptive classification used only for Income and Expense events; it never determines an event's financial effect (event type is decided first).
- Transfer, Fund Allocation, Fund Release, and Debt Repayment do not use categories — their references (accounts, fund, debt) already provide sufficient context.
- Income and Expense use **separate, non-overlapping** category sets; a category belongs to exactly one kind.
- Exactly one category per Income/Expense event in v1 — no multi-category or split events.
- An Expense linked to a fund may carry both a category (what was purchased) and a fund reference (which reserved purpose paid for it) — these remain distinct.
- Default category sets must never include names that actually represent event types or fund purposes (e.g., Transfer, Tabungan, Pembayaran Utang, Qurban, Tabungan Istri, Rumah Impian).
- Users may create, rename, archive/hide, and restore categories. Permanent deletion is allowed only for unused categories; categories with transaction history must be archived, not deleted, and historical transactions retain their category reference.
- Required fallback categories, so onboarding is never blocked by an imperfect category fit, are described below.

**(Hypothesis — requires validation; candidate labels pending UX terminology review, not final)** Candidate starter categories, expressed directly in Bahasa Indonesia rather than as English UI labels:

- **Kategori pengeluaran (Expense):** Makanan & Minuman, Transportasi, Tagihan & Utilitas, Belanja, Kesehatan, Pendidikan, Hiburan, Keluarga & Sosial, Keagamaan & Donasi, **Pengeluaran Lainnya** (required fallback).
- **Kategori pemasukan (Income):** Gaji, Freelance/Usaha, Hadiah/Uang Saku, **Pemasukan Lainnya** (required fallback).

"Pengeluaran Lainnya" and "Pemasukan Lainnya" are required fallback categories so a beginner is never blocked from recording an event because a perfect category doesn't exist, while the product should not encourage over-reliance on them.

**Still undecided:** whether a "Refund/Reimbursement" income category belongs in the default set given deferred refund mechanics; icons/colors; custom ordering; subcategories (not proposed for v1); final exact wording/count of starter categories.

---

## 14. Dedicated Fund and Goal Requirements

**(Confirmed)**

- Fund and goal are **one underlying concept**: a fund without a target amount is open-ended; a fund with a target amount behaves as a goal with progress tracking. No separate, competing structures.
- Minimum structure: user-defined name, optional target amount, current allocated balance (system-derived, never manually editable), active/archived state, optional target date, optional note.
- Fund balances and target amounts are expressed in **Indonesian Rupiah (IDR)** as whole Rupiah amounts, consistent with the workspace's single fixed currency (see Section 9).
- A dedicated fund is a **virtual allocation of an account's balance, not a physical account or a movement of real money** (see Section 9 for the full explanatory model, including the confirmed calculation: total account balance = unallocated amount + the sum of that account's current fund allocations). A fund exists at the workspace level and may logically span multiple accounts, but every individual fund allocation is backed by exactly one source account, preserving traceability of where the money came from.
- The product must preserve, and be able to derive, each fund's allocated balance broken down **per originating account** — a fund's total balance is always the sum of its account-backed allocations, never an unexplained aggregate. The system never automatically consumes an allocation from a different account than the one specified; FIFO, LIFO, allocation lots, or other automatic cross-account consumption ordering are outside v1. A Fund Release always selects one source account and draws from that account's *current* allocation balance for the fund — it does not select a particular historical Fund Allocation event.
- Fund balance is always derived from its events (Fund Allocation, Fund Release, linked Expenses, and their corrections/deletions/restorations) — never a directly editable number. A correction, deletion, or restoration affecting a fund allocation is allowed only if the chronological recalculation defined in Section 16 leaves every affected account-backed fund allocation, and every other confirmed invariant (Section 9), valid at every later point in its history — not only in the fund's current balance.
- **Fund Allocation** cannot exceed the amount currently unallocated in the selected source account — no double-reserving the same money. Planned future contributions belong in the target amount, not in an allocation against money that doesn't yet exist.
- **Fund Release** always selects exactly one source account and cannot exceed that account's current allocation balance for the fund — not merely the fund's total balance across all accounts, and not any particular historical Fund Allocation event; the source account is never unexplained.
- A fund-linked **Expense** has exactly one payment account and draws from that account's current allocation balance for the selected fund: its amount must not exceed the fund's allocation backed by that payment account, and must not make the payment account's total account balance negative. It does not require sufficient unallocated amount, and unallocated amount is left unchanged. Because a fund allocation is always a subset of its account's total account balance, a valid allocation amount will normally already guarantee total-account-balance coverage — but the product must still protect both invariants explicitly, since they are conceptually distinct. Allocations belonging to another account are never automatically consumed. If the fund allocation from that account is insufficient, the product must block saving with a clear Bahasa Indonesia explanation and explicit next steps (reduce amount, allocate more first from that account, unlink from the fund, or record separate events) rather than silently allowing a negative fund allocation or silently drawing from another account's allocation. One Expense consuming allocations from multiple accounts is outside v1.
- A Transfer between accounts never automatically moves or reassigns a fund's virtual allocation; carrying a fund's purpose to money that has physically moved requires an explicit Fund Release followed by a new Fund Allocation on the destination account (see Section 11).
- Target amount is a planning marker, not a hard cap — allocations may exceed it, shown clearly as "target exceeded," and must never be blocked for that reason alone.
- Archiving preserves all history; permanent deletion is allowed only for a fund with zero balance and zero event history. Archiving a non-zero-balance fund requires a warning and explicit resolution, never a silent reset.

**Still undecided:** whether target date ships in v1's form; whether archiving a non-zero fund is ever blocked outright vs. always allowed with confirmation; whether a target amount can be changed/removed after history exists; whether a "completed" state is explicit or purely derived.

---

## 15. Debt Record and Debt Repayment Requirements

**(Confirmed)**

- Debt tracking is **optional at the workspace level** — users who don't need it never create a debt record — but a debt record is **mandatory** for every Debt Repayment event; an unstructured text label is never sufficient.
- Minimum debt record: debt name, opening outstanding principal balance, effective date of that opening balance, optional note. Represents a liability that already exists when the user begins tracking it.
- Debt opening principal and repayment amounts are expressed in **Indonesian Rupiah (IDR)** as whole Rupiah amounts, consistent with the workspace's single fixed currency (see Section 9).
- Debt records may be created **inline**, without leaving the repayment recording flow — no full debt-management workflow is required.
- Debt Repayment flow: select event → select or inline-create a debt record → select payment account → enter principal amount → review effect before confirming (payment account decreases, outstanding debt decreases, principal not counted as expense) → save → trace both effects back to the event.
- A repayment cannot silently reduce outstanding debt below zero; an entered principal exceeding the outstanding balance must be blocked or require correction before saving. A repayment additionally cannot exceed the payment account's currently unallocated amount (a Debt Repayment never consumes a fund allocation); if insufficient, saving is blocked with a clear explanation, distinct from the block on overpaying the outstanding debt itself (see Section 12).
- A Debt Repayment's event date can never be earlier than the debt record's opening outstanding-principal effective date; a repayment dated exactly on that effective date is allowed. To record an earlier repayment, the user must first explicitly move the debt's opening date earlier — the system never changes the opening date or opening principal automatically. Changing the debt's opening date or opening principal requires an impact preview, after which all later Debt Repayment events are recalculated chronologically; the change is blocked if it would create a negative outstanding principal at any point along that recalculated history.
- Interest, penalties, and service fees are recorded as **separate Expense events**, not mixed into the principal repayment.
- Editing or deleting a Debt Repayment must recalculate both the account balance and the outstanding debt consistently; any correction that would create an invalid debt balance (overpayment, negative outstanding, unexplained result after changing the linked debt) must be blocked.
- Deleting a debt record is blocked while repayment events still reference it.
- Every date- or amount-dependency message for debt records and repayments explains the problem and next steps in natural Bahasa Indonesia, consistent with Section 22.
- Full debt lifecycle management — original borrowing/issuance events, lender management, repayment schedules, interest calculation, installment automation — is explicitly outside v1.

**Still undecided:** whether creditor/lender name is a separate field or part of the debt name; whether v1 needs an explicit Active/Paid-Off status vs. deriving it from balance; whether overpayment is always hard-blocked or a future release supports credit-balance/refund scenarios.

---

## 16. Correction, Replacement, Trash, and Restore Requirements

**(Confirmed)**

- Users may edit fields **within the same event type** (amount, date, account, category/fund/debt reference, note). Every valid edit recalculates all affected balances, funds, debts, summaries, reports, dashboard, and history immediately, with a before/after impact shown for material changes.
- **Changing an event's type** (e.g., Expense → Income) is never treated as an ordinary field edit. It uses a guided "Replace event" flow: the old event is marked as replaced, a new event is created with the required fields, and both remain linked for traceability — presented to the user as one correction action.
- Financial events use **soft deletion**: deleted events move to a recoverable Trash state, their financial effect is reversed immediately, and they remain recoverable for a defined retention period (30 days is the current preference). Restoring an event reapplies its effect only after revalidating current dependencies.
- Deletion is not the default irreversible action; permanent deletion is not required as a default v1 capability.
- **Transfers** are always edited, deleted, and restored as one linked event — never one-sided.
- **Dependency-aware blocking:** an edit or deletion that would leave the financial state invalid or unexplained (e.g., reducing an account-backed fund allocation below what a fund-linked Expense drawing on it would then require; editing a fund-linked Expense's payment account to one whose allocation for the selected fund is insufficient; editing an Expense, Transfer, or Debt Repayment amount or account in a way that would drive total account balance or unallocated amount below Rp0; editing a Debt Repayment in a way that breaks the outstanding balance; moving a debt's opening date or opening principal in a way that would create a negative outstanding principal at any point in its recalculated history) must be blocked with a clear explanation of the dependency and what the user can do next — never silently forced to "make things work." Fund-linked Expense, Fund Release, edits, deletions, and restorations always operate against the selected fund's account-backed allocation balance as a whole; none of them consume, select, or link to a particular historical Fund Allocation event, and no FIFO, LIFO, allocation-lot, or per-allocation consumption relationship exists in v1. A correction to a historical Fund Allocation is allowed only if chronological recalculation (below) leaves the affected account-backed fund allocation valid at every later point in its history.
- **Chronological recalculation:** whenever an event, opening balance, date, account reference, fund reference, debt reference, deletion, restoration, or replacement changes historical financial state, the product recalculates the affected history from the earliest affected point forward — never only the final/current balance. At every point in that recalculated history, all confirmed invariants (Section 9) must remain valid: total account balance ≥ Rp0; unallocated amount ≥ Rp0; every fund allocation backed by an account ≥ Rp0; total account balance = unallocated amount + all current fund allocations backed by that account; outstanding debt principal ≥ Rp0; and every event date remains valid against the relevant account's and debt's opening-balance effective dates (Section 12, Section 15). If any invariant would fail at any point in the recalculated history, the correction, deletion, restoration, replacement, or opening-balance change is blocked with a clear Bahasa Indonesia explanation and next steps — not silently applied and left inconsistent.
- **Deterministic same-date recalculation:** when multiple financial events share the same user-selected event date, chronological recalculation must apply a deterministic, stable ordering among them so that recalculated results are reproducible. The exact stable ordering mechanism is not decided by this document and is deferred to domain modeling or detailed specification. As elsewhere in this PRD, the created/updated system timestamp still never determines which reporting period an event belongs to (Section 17).
- **Opening balance** has its own correction flow, separate from ordinary event editing: changing it shows the impact on current and historical balances, is never treated as income or expense, requires explicit confirmation, and cannot be deleted if doing so would leave the account without a defined starting point. Moving an account's (or a debt record's) opening-balance effective date earlier or later always requires this explicit impact-preview flow — triggering the chronological recalculation above and blocking any change that would leave an invariant invalid at any affected point — and never happens automatically as a side effect of any other action.
- Full field-level audit history (a complete change ledger) is deferred, but v1 requires minimal change metadata: created timestamp, last-updated timestamp, edited/deleted/replaced flags, and a replacement link where applicable.
- All correction and deletion language uses clear, natural Bahasa Indonesia consistent with "Clarity without shame."

**Still undecided:** exact Trash retention period; whether manual permanent deletion from Trash is available in v1; whether previous field values are stored internally even without a UI history view; whether high-impact corrections require a stated reason; the exact threshold for requiring an impact-preview confirmation; whether a replaced event appears in ordinary history or only in its own detail/audit context.

---

## 17. Reporting Period Requirements

**(Confirmed)**

- Every v1 workspace uses a single, fixed timezone: **Asia/Jakarta**. Users cannot change the workspace timezone in v1, and neither device timezone nor the user's physical travel location ever changes it. "Today," date defaults, day boundaries, and reporting-period boundaries are all computed in Asia/Jakarta, and reporting cycles change over at 00:00 Asia/Jakarta. Users may still manually select any valid event date, including a date that differs from the current Asia/Jakarta date. Additional or per-user workspace timezones are outside v1.
- v1 supports **calendar-month reporting** (the default for every new workspace, requiring no setup) and one **optional custom monthly cycle**, configured once at the workspace level.
- Only one active cycle definition per workspace — no multiple simultaneous cycles per account, category, fund, or purpose.
- The custom cycle uses a single recurring start day, supported for **days 1 through 28** (avoiding month-end ambiguity); days 29–31 are deferred.
- Events are grouped into a period based on the user-selected event date (evaluated in Asia/Jakarta), never by the created/updated system timestamp — event date and system timestamp are separate concepts (see Section 16).
- Every displayed period must show its **exact start and end date range** — never a vague label like "Agustus" when a custom cycle is active.
- Changing the reporting cycle never modifies transaction dates, account balances, or the financial effect of any event — it only regroups historical summaries. It requires an impact preview (showing old vs. new ranges) and explicit confirmation before applying.
- v1 includes a lightweight **current-vs-previous-period comparison**: direction of Income/Expense change, largest category changes, absolute and percentage difference where meaningful — always traceable to underlying events, phrased neutrally (e.g., "Pengeluaran transportasi bertambah Rp150.000 dibanding periode sebelumnya," never judgmental language).
- Periods with incomplete tracking history must be explicitly flagged so comparisons are not presented as misleadingly complete.

**Still undecided:** whether a fully custom one-off date-range filter is needed; final comparison metric set; whether percentage differences are hidden when the previous value is zero; how archived accounts factor into historical period totals; whether a cycle change applies immediately or at next session start.

---

## 18. Dashboard Requirements

**(Confirmed)**

The dashboard is a concise financial overview, not a full analytics workspace. All monetary values shown are expressed in Indonesian Rupiah (IDR) as whole Rupiah amounts, consistent with the workspace's single fixed currency (Section 9). It must show, at minimum:

- The **exact active reporting-period date range**, and whether the workspace uses calendar month or a custom cycle.
- **Account position:** total account balance across active accounts, total amount allocated to dedicated funds, and total unallocated amount — presented so that total account balance = (sum of fund allocations) + unallocated amount (Section 9), never adding fund balances on top of the account total as if funds were separate physical money. Internally, each account's allocated amount is the sum of that account's own fund allocations (Section 14); the dashboard is not required to surface a per-account fund breakdown by default.
- **Current-period summary:** total Income, total Expense, and their difference — with the difference explicitly labeled as a reporting-period result, never presented as total wealth or unallocated amount.
- The approved **previous-period comparison** (Section 17), in neutral, factual Bahasa Indonesia.
- A compact section of **active funds/goals**: name, current allocated balance, target amount and progress percentage where a target exists (a fund without a target shows balance only, no misleading percentage).
- A compact **debt summary** for users who use debt tracking (total outstanding principal, per-debt outstanding amounts) — omitted or shown as a helpful empty state for users without debt records, never a required or judgmental section.
- A short list of **recent financial events** (type, amount, date, account(s), category, fund/debt reference where applicable) — for quick verification, not a full history replacement.
- The initial "noticing" insights defined in Section 23 (fund/goal progress, previous-period comparison, onboarding acknowledgment, incomplete-data notices), always visually subordinate to the financial information above.
- At most **one optional, non-blocking next-step suggestion**, always subordinate to the financial information.

**Fund double-counting is explicitly prohibited** — allocated fund money is a subset of the account total, never additional money.

**Still undecided:** exact card order/visual hierarchy; item counts before "Lihat semua"; whether unallocated amount is shown as a standalone card; final comparison metrics; dashboard customization; whether archived accounts factor into historical drill-downs; empty-state wording for users without funds/debts.

---

## 19. Traceability Requirements

**(Confirmed)** "Explain every important number" is a hard v1 requirement, implemented as three levels:

1. **Summary** — the dashboard/report shows the important number.
2. **Supporting records** — opening the number reveals the accounts, categories, funds, debts, or financial events that produced it (e.g., Income total → the Income events included; fund balance → its Allocation/Release/linked-Expense history, including the source account each allocation, release, or fund-linked Expense traces back to (Section 14); unallocated amount → its formula and components (Section 9)).
3. **Individual event explanation** — opening one financial event shows enough detail to fully understand its effect: event type, amount, date, account(s), category, fund, debt record, note, account/fund/debt balance effects, and whether it was edited, replaced, or restored. A Transfer shows both sides together; a fund-linked Expense shows both the total-account-balance decrease and the fund-allocation decrease, identifying the source account whose fund allocation it drew from; a Debt Repayment shows both the account decrease and the outstanding-debt decrease.

Every important number must have a direct, understandable path to its source — there is no dead-end number in v1. A dashboard number that disagrees with its source detail is a release-blocking defect (see Section 24).

---

## 20. Authentication and Privacy Requirements

**(Confirmed — product-requirement level only; no provider, framework, or implementation specified)**

- Account access is **invitation-based** for the private beta. Email and password are sufficient for account creation; no government ID, banking verification, biometrics, or phone verification is required.
- **Email verification is required before any real financial data can be saved** (opening balance, events, real funds/debts); the user may view the welcome screen and resend verification before that point.
- Each workspace is **single-owner and completely private**: no shared links, guests, household/teacher/spouse access, cross-user dashboards, or leaderboards. Isolation applies to accounts, balances, events, categories, funds, debts, reports, dashboard data, Trash, onboarding state, and exports. **Cross-user data exposure is release-blocking.**
- v1 has **no routine admin/support interface** for browsing raw user financial data; support relies on user-shared information, diagnostic references, and redacted technical data.
- Session behavior: users may stay signed in on trusted personal devices, can explicitly sign out, reset a forgotten password via verified email, and use "sign out of all devices"; a password reset invalidates or offers to invalidate other sessions.
- Account recovery never relies on weak identity questions or informal support claims; if the verified email itself is permanently lost, privacy is prioritized over convenience.
- Users have an account-deletion request path (retention/export specifics deferred to specification).
- All authentication, recovery, privacy, and session messaging uses clear, natural Bahasa Indonesia, explaining what happened and what to do next without blame (e.g., "Sesi Anda telah berakhir. Silakan masuk kembali untuk melanjutkan.").

### Where Financial Values May and May Not Appear

Financial values (amounts, balances) **may** appear inside an **authenticated, owner-visible interface** when needed to explain the user's own calculation or validation problem — for example, a validation message that quotes the user's own entered amount, or a dependency explanation that references the user's own fund balance. This is consistent with "Explain every important number" (Section 19) and is not a privacy violation, because it is shown only to the workspace's own owner, in-app, after authentication.

Raw financial data **must not** leak through any of the following, regardless of authentication state:

- unauthenticated or public error pages
- URLs
- technical logs
- analytics
- external notifications (e.g., push notification previews)
- email previews or email bodies
- responses returned to any other user (cross-user responses)

**Still undecided:** invitation mechanics (single-use/expiry); password requirements; session duration; whether password reset auto-invalidates all sessions or asks first; whether a device list is shown; recovery policy if the verified email is unrecoverable; exact deletion retention period; whether export ships in the first beta; whether any consent-based temporary support access is ever needed; whether a local privacy lock is needed for sensitive screens.

---

## 21. Mobile-First Responsive Requirements

**(Confirmed)**

- Every core v1 flow — invitation through signup, verification, onboarding, all six event types, correction/replacement/deletion/restore, accounts, categories, funds/goals, debt, dashboard drill-down, reporting-cycle changes, and auth/session settings — must be **fully usable on a phone**. No essential capability is desktop- or tablet-only.
- The highest-priority mobile context is recording a financial event quickly and confidently; common Income/Expense recording should require only event type, amount, account, category, date, optional note, with explicit review before saving. No silent inference of event type or category.
- Dashboard/reports/corrections may use progressive disclosure (expandable sections, drill-downs, bottom sheets) but must never sacrifice traceability, require horizontal scrolling or device rotation for core content, or reduce meaning to unexplained icons.
- Touch-friendly interaction: comfortable tap targets, no hover-dependent actions, confirmed destructive actions, appropriate input types (numeric keypad, usable date picker), field-level validation that never erases entered data, ability to go back without losing confirmed progress.
- Recording a new event must be easily reachable from mobile navigation, not buried in nested menus.
- The same financial state, terminology, and core actions must be consistent across phone, tablet, and desktop.
- A stable connection may be assumed for v1 (full offline-first sync is deferred), but the product must remain resilient to slow/intermittent connections: clear loading/retry states, no silent failure, no data loss on recoverable errors.
- **Duplicate-submission protection is a hard trust requirement:** repeated taps, retries after timeout, or reconnecting must never create duplicate financial events. The product must never confirm an event as saved unless persistence is confirmed, and must clearly communicate an explicit uncertain-save state rather than a false confirmation.
- A user's device timezone or physical location while using a phone (including while traveling) never changes the workspace's fixed Asia/Jakarta timezone, "today," or reporting-period boundaries (see Section 17); the user can still manually pick a different event date when needed.
- Baseline accessibility/readability: sufficient contrast, no color-only signaling, readable Indonesian text without truncation in critical actions, assistive-technology labels, meaningful error messages that explain the next step.

---

## 22. User-Facing Language Requirements

**(Confirmed)**

- All user-facing interfaces must use **Bahasa Indonesia** — navigation, page titles, buttons, form labels, validation/error messages, empty states, onboarding, confirmations, summaries, reports, insights, gamification-adjacent messages, and help text.
- Terminology must be clear, natural, and understandable to beginners; unnecessary English terms are avoided in the UI.
- Internal technical terminology, code identifiers, and engineering documentation may use English but must never leak into the user-facing product.
- "Clarity without shame" must be preserved in Indonesian wording specifically, not just in English framing. Detailed microcopy is finalized during UX/specification work — this requirement fixes the language, not the final copy.

### Terminology Note

This document uses English concept names (Income, Expense, Transfer, Fund Allocation, Fund Release, Debt Repayment, Cash, Bank Account, E-Wallet, Other) as **internal, canonical concept names** for clarity in product and domain discussion. These are not intended as UI text. Every UI label the user actually sees must be natural Bahasa Indonesia.

The following candidate user-facing terms are proposed for UX terminology review and are **not final**:

| Internal concept | Candidate Bahasa Indonesia label |
|---|---|
| Income | Pemasukan |
| Expense | Pengeluaran |
| Transfer | Transfer |
| Fund Allocation | Alokasi Dana |
| Fund Release | Pelepasan Alokasi Dana |
| Debt Repayment | Pembayaran Pokok Utang |
| Cash | Tunai |
| Bank Account | Rekening Bank |
| E-Wallet | Dompet Digital |
| Other | Lainnya |

**(Hypothesis — requires validation / candidate pending UX terminology review, not Confirmed)** — see also Section 13 for candidate category labels expressed directly in Bahasa Indonesia.

---

## 23. Initial Insight and Gamification Scope

**(Confirmed)**

For the initial private-beta launch, v1 includes the following factual "noticing" items, directly derived from already-approved dashboard/reporting data:

- Fund/goal progress (e.g., "Dana Qurban telah mencapai 60% dari target.")
- The approved previous-period factual comparison (e.g., "Pengeluaran transportasi bertambah Rp150.000 dibanding periode sebelumnya.")
- Onboarding-completion acknowledgment (e.g., "Transaksi pertama berhasil dicatat dan saldonya telah diperbarui.")
- Incomplete-data notices.

These four items are confirmed to ship at initial launch as part of the trusted reporting foundation — they are not open questions. Every observation must be traceable to recorded data, use neutral Bahasa Indonesia, avoid judgment, pressure, or cross-user comparison, and remain visually subordinate to core financial information.

**Any noticing or insight beyond these four items remains deferred** past initial launch. **Explicitly deferred:** points, badges, levels, streaks, leaderboards, milestones beyond onboarding, optional challenges, and proactive behavioral coaching. Sequencing is: trust foundation + the four factual items above (initial launch) → broader reflection/"help me notice" (post-launch iteration, criteria still undecided, see Section 28) → gentle milestones/optional challenges (later) → broader responsible gamification only if validated (much later).

---

## 24. Private-Beta Launch Criteria

**(Confirmed)** Readiness is not "all screens exist" — it requires a defined end-to-end acceptance suite and explicit launch gates. This section is self-contained and does not depend on any external document or prior conversation.

### A. Core Financial-Event Scenarios Must Work End-to-End

Each of the six event types must work from creation through all dependent views: creation → review before saving → successful confirmation → transaction-history display → account/fund/debt effect → dashboard and report effect → editing → guided replacement when event type changes → soft deletion → restoration → traceability to source. The result must remain consistent everywhere.

### B. Minimum Acceptance Scenarios

At minimum, private-beta readiness requires the following scenarios to pass, tested with realistic amounts and multiple linked events, not only isolated single-record examples:

1. **Income** — Record Income into an account. Account balance increases. Income total for the period increases. Expense total does not change. Dashboard, history, account detail, and report show the same result.
2. **Expense** — Record an ordinary Expense (no fund reference) from an account. Total account balance and unallocated amount both decrease. Expense total increases. Income total does not change. Category reporting updates consistently. Attempting such an Expense exceeding the account's unallocated amount is blocked with a clear explanation.
3. **Transfer** — Move money between two owned accounts. Source's total account balance and unallocated amount decrease; destination's total account balance and unallocated amount increase. Workspace total remains unchanged. Income and Expense totals remain unchanged. Both sides remain one linked event. Attempting a Transfer exceeding the source account's unallocated amount is blocked with a clear explanation. The Transfer never automatically moves a fund allocation tied to either account.
4. **Fund Allocation** — Allocate unallocated money from an account to a dedicated fund. Total account balance remains unchanged. The fund's allocation from that account increases; the account's unallocated amount decreases by the same amount. Income and Expense totals remain unchanged. The same money is never double-counted. The allocation's source account is preserved and traceable within the fund's per-account balance breakdown.
5. **Fund Release** — Release allocated money from a fund back into unallocated amount. The fund's allocation from the source account decreases; that account's unallocated amount increases by the same amount. Total account balance remains unchanged throughout — Fund Release only changes the allocation-versus-unallocated composition. Income and Expense totals remain unchanged. The release selects exactly one source account and draws from that account's current allocation balance for the fund — never a particular historical Fund Allocation event, and never an allocation belonging to a different account.
6. **Fund-linked Expense** — Record an Expense linked to a fund, using a single payment account. The payment account's total account balance decreases and the fund's allocation from that same account decreases by the same amount; the account's unallocated amount remains unchanged. Expense total increases exactly once. The earlier allocation remains non-expense. The event detail explains both effects, including which source account's fund allocation was drawn from. The Expense succeeds even when the payment account's unallocated amount is lower than the Expense amount, as long as the fund's allocation from that account is sufficient. Attempting a fund-linked Expense that exceeds the fund's allocation from the payment account, or that would make the payment account's total account balance negative, is blocked with a clear explanation — even if the fund holds sufficient balance from a different account.
7. **Debt Repayment** — Create a minimal debt record. Record principal repayment. Payment account's total account balance and unallocated amount decrease; outstanding debt decreases. Principal does not increase ordinary Expense totals. Interest or fees, when present, remain separate Expense events. Attempting a repayment exceeding the payment account's unallocated amount is blocked, distinct from the existing block on repaying more than the outstanding debt. A repayment dated earlier than the debt's opening outstanding-principal effective date is blocked with a clear explanation.
8. **Opening balance** — Set an opening balance; it initializes total account balance and unallocated amount to the same value, with fund allocations starting at Rp0, and is never counted as Income. Correct an opening balance (or its effective date): the change recalculates all later account, fund, and debt states chronologically, and the user can understand the selected starting point. An event dated earlier than an account's (or debt's) opening-balance effective date is blocked with a clear explanation; moving the opening-balance effective date earlier requires an explicit impact preview before it takes effect, and never happens automatically.
9. **Correction (same-type edit)** — Edit an event's amount, date, account, category, fund, or debt reference within the same event type. Every dependent view updates consistently. Editing a historical event is blocked when chronological recalculation would make any later total account balance, unallocated amount, account-backed fund allocation, or outstanding debt balance invalid at any point in the recalculated history — not only in the final state. Invalid dependency-breaking changes are blocked with an understandable explanation.
10. **Event-type replacement** — Correct one event type into another through the guided replacement flow. The old event is marked as replaced; the new event becomes active. No double-counting or temporary unexplained result remains.
11. **Deletion and restoration** — Move an event to Trash. Its financial effect is reversed everywhere. Restore it: restoring (and deleting) an event revalidates the complete affected chronological history, not only the current state, against every confirmed invariant. Restoring or deleting a fund-linked Expense or a Fund Release does not require or depend on a link to any particular historical Fund Allocation — it is validated against the fund's current account-backed allocation balance.
12. **Reporting-cycle boundary** — Confirm events on both sides of a custom-cycle boundary. Each event appears in the correct period. Exact date ranges are displayed. Changing the cycle regroups reports without modifying transactions or balances. All boundary calculations use the workspace's fixed Asia/Jakarta timezone regardless of the tester's device timezone; an event's reporting period is always determined by its selected event date, never by its created/updated timestamp.

These twelve scenarios constitute the minimum pre-launch acceptance suite. Detailed step-by-step test cases derived from these scenarios may later be extracted into a dedicated specification/test-plan document, but the scenario summaries above must remain present in this PRD regardless of where detailed test cases are later maintained.

### C. Cross-View Consistency Is a Hard Launch Gate

For every scenario above, these views must agree: dashboard, transaction history, account details, fund details, debt details, period summaries, reports, and traceability drill-downs. Any unexplained difference between an important summary number and its source records is a release-blocking defect. The product must not launch while known inconsistencies remain.

### D. Traceability Must Work

Before private beta: every important dashboard total must be openable; the user must be able to see the records that produced it; each event detail must explain its complete financial effect; derived values (e.g., unallocated amount) must show their formula and components; Transfer, fund-linked Expense, and Debt Repayment must show both sides of their effects. Having no dead-end numbers is a launch requirement. Any important number that cannot be traced to its supporting records is release-blocking.

### E. Privacy and Workspace Isolation Must Pass

Before launch, tests must prove that: one user cannot access another user's workspace; changing URLs or identifiers never reveals another user's financial data; unauthenticated users cannot access private pages; signing out or session expiry does not expose the previous financial view; Trash, reports, exports, and derived insights are also isolated; financial details do not leak into logs, URLs, page titles, analytics, or notification previews. Any cross-user data exposure is release-blocking.

### F. Mobile-First Flows Must Pass

Every core flow must be completable on a supported smartphone-sized screen: invitation and signup, email verification continuation, onboarding, opening-balance setup, all six event types, correction/replacement/deletion/restore, accounts, categories, funds/goals, debt record and repayment, dashboard drill-down, reporting-cycle changes, sign-out and password recovery. No core flow may require desktop, horizontal scrolling, hover, or device rotation.

### G. Network-Failure Trust Behavior Must Pass

Before launch, the product must prove that: repeated taps do not create duplicate events; retries after timeout do not silently duplicate records; entered data is not lost after recoverable failures; the product does not show "saved" unless persistence is confirmed; uncertain submission states are communicated clearly; users can verify whether the event exists before retrying. Duplicate financial records caused by network behavior are release-blocking.

### H. Onboarding Must Produce the Trust Moment

A new invited user must be able to verify their email, create the starter account, explicitly choose the opening-balance starting point, record one guided Income or Expense, review what the system understood, and see the same result in balance, history, and summary. The flow must be resumable if interrupted. The product is not ready if users commonly become blocked before their first trusted event.

### I. User-Facing Language Must Be Ready

Before private beta: all user-facing text must use natural Bahasa Indonesia; no internal technical identifiers may leak into the UI; financial terminology must remain consistent; validation, dependency, and error messages must explain the next action; wording must preserve "Clarity without shame." Critical terms should receive a terminology review before launch.

### J. Backup and Recovery Readiness

Before handling real beta data: a documented backup and recovery policy must exist; restoration from backup must be tested and demonstrated to work before the first invitation wave; known recovery limitations must be documented and communicated internally. This requirement is at the product/operational level only — no backup technology, tool, or method is specified here.

### K. Known-Scope and Operational Readiness

Before launch: the private-beta invitation flow works; support has a documented way to receive diagnostic references without browsing raw financial data; known limitations are documented; the account-deletion request path is available or clearly scheduled before handling real beta data; critical defects have a defined triage process. The product must not depend on developers manually correcting normal user data directly in storage as the standard support process.

### Explicitly Not Launch-Blocking

Founder replacement of Telegram/Sheets, beta-user trust/retention/recommendation outcomes, and other behavioral outcomes are observed **post-launch** (see Section 25), not treated as pre-launch pass/fail criteria.

---

## 25. Post-Launch Success Signals

**(This evaluation framework is Confirmed; the outcomes themselves are Hypothesis — requires validation, to be measured after launch and never treated as proven at PRD approval.)**

- **Founder outcome:** Telegram and Google Sheets are no longer needed as the primary finance system.
- **Beta-user trust outcome:** users don't maintain a parallel spreadsheet to verify the app; users report numbers matching their understanding; users can explain where an important number came from; users correct mistakes without developer help.
- **Adoption/retention outcome:** users return across multiple reporting periods; users record events when they occur; users continue after a difficult financial month; onboarding converts into at least one trusted event.
- **Understanding outcome:** users can answer — Ke mana uang saya digunakan? Apa yang berubah dari periode sebelumnya? Berapa saldo setiap akun? Berapa uang yang sudah dialokasikan? Apa yang menyebabkan perubahan besar? Berapa sisa utang yang tercatat?
- **Recommendation outcome:** at least some users voluntarily recommend the product.

---

## 26. Early Warning Signals

**(Confirmed as signals to monitor; their occurrence/absence is an empirical beta outcome)**

- Users keep a parallel spreadsheet because they don't trust the app.
- Users repeatedly ask why totals differ from expectations.
- Users default everything into generic Income/Expense because the model is confusing (e.g., believing Fund Allocation is an Expense, or a Transfer is Income/Expense).
- Onboarding is abandoned before a first useful transaction.
- Frequent need for manual/support intervention to fix data.
- Users avoid the app after overspending or missing a goal.
- Users cannot distinguish account, category, fund, and event type.
- New features keep shipping while representation/reporting problems remain unresolved.
- The app starts feeling like "another spreadsheet I have to configure."

**Most serious signal:** users do not trust the numbers — if this occurs, no new feature, education, or gamification work should be prioritized until resolved. **Second most serious signal:** users feel judged or discouraged, a direct violation of "Clarity without shame."

---

## 27. Privacy-Safe Metrics

**(Confirmed)** This section governs the operational analytics/logging layer specifically; it does not restrict what may be shown to a user, in-app, about their own data (see Section 20's clarification on authenticated owner-visible interfaces).

**Permitted operational events** (no raw financial content): invitation accepted; email verification completed; onboarding started/completed; first trusted event completed; failed event submissions; uncertain submission states; duplicate-prevention activations; correction attempts; blocked dependency-breaking corrections; Trash deletion/restoration usage; report/dashboard drill-down usage; support-error reference frequency; session/authentication failures.

**Prohibited from analytics/logs:** raw amounts, account names, user-created category names, fund names, debt names, notes, transaction descriptions, balances.

**Qualitative signals** (gathered via interviews/feedback, not instrumented): whether users keep a parallel spreadsheet; whether users repeatedly question totals; whether users find the transaction model confusing; whether users default to generic Income/Expense; whether users feel judged or avoid the app; whether users need manual help for normal corrections; whether users conflate account/category/fund/event-type concepts.

---

## 28. Open Questions

Items in the "Resolved" subsection below were decided by the product owner and are now part of the approved product requirements; all other items in this section remain genuinely open and are not resolved by this PRD.

### Resolved Decisions Before Domain Modeling

The eight decisions that were previously blocking domain modeling have all been explicitly resolved by the product owner. **Domain modeling may now begin.** These decisions remain part of the approved product requirements, detailed in the sections referenced below — the summaries here are intentionally concise, and the referenced sections govern in case of any apparent conflict.

1. **Currency.** v1 supports Indonesian Rupiah (IDR) only, as a single fixed workspace currency; monetary values are whole Rupiah amounts with no fractional units and no user-facing currency selection. Multi-currency remains outside v1. **(Confirmed — Section 9)**
2. **Negative account balances.** All v1 accounts are asset-like and money-holding; balance (including opening balance) must never go below Rp0. Expense, Transfer, and Debt Repayment are blocked when the relevant account has insufficient balance. Credit-card/overdraft/negative-balance accounts are outside v1; debt remains represented only through Debt Record. **(Confirmed — Section 12)**
3. **Archiving accounts with a non-zero balance.** An account may be archived only at exactly Rp0 balance. A non-zero-balance account cannot be archived through confirmation alone — the product explains the remaining balance and offers next steps, and never automatically transfers, spends, deletes, zeroes, or corrects the balance itself. Archived accounts are excluded from new events, remain restorable, and preserve historical records. **(Confirmed — Section 12)**
4. **Fund allocation provenance.** A dedicated fund is a virtual allocation of account balance, never a physical account or a movement of real money. Every account's total account balance equals its unallocated amount plus the sum of its current fund allocations (Section 9); a fund may hold allocations from multiple accounts, but each allocation is backed by exactly one account, and a Fund Release always draws from the selected account's *current* allocation balance for that fund — never a particular historical Fund Allocation event. The system never automatically consumes an allocation from a different account; FIFO, LIFO, allocation lots, or other automatic cross-account consumption are outside v1. **(Confirmed — Section 14)**
5. **Fund-linked Expense paid from an account.** A fund-linked Expense has exactly one payment account; its amount must not exceed the selected fund's current allocation backed by that payment account, and must not make the payment account's total account balance negative — it does not require sufficient unallocated amount, and unallocated amount is left unchanged. Allocations from other accounts are never auto-consumed; insufficient fund allocation blocks saving with a clear Bahasa Indonesia explanation and next steps. A Transfer never automatically moves a fund's virtual allocation — carrying a purpose to moved money requires an explicit Fund Release plus a new Fund Allocation. One Expense drawing from multiple accounts' allocations is outside v1. **(Confirmed — Section 11, Section 14)**
6. **Event date vs. account opening-balance effective date.** A financial event's date can never precede the effective date of any account it uses (same-date is allowed). Recording an earlier event requires first explicitly moving the account's opening-balance effective date earlier — the system never does this automatically — which requires an impact preview and recalculates all later balances. Invalid dates are blocked with a clear explanation. **(Confirmed — Section 12)**
7. **Debt Repayment date vs. debt opening date.** A Debt Repayment's date can never precede the debt record's opening outstanding-principal effective date (same-date is allowed). Recording an earlier repayment requires first explicitly moving the debt's opening date earlier — never automatic — with an impact preview and chronological recalculation of all later repayments; a change is blocked if it would create negative outstanding principal at any point. **(Confirmed — Section 15)**
8. **Workspace timezone and reporting boundary.** Every v1 workspace uses a single, fixed timezone, Asia/Jakarta, not user-configurable and unaffected by device timezone or travel; "today," date defaults, day boundaries, and reporting-period boundaries follow Asia/Jakarta, with cycles changing at 00:00 Asia/Jakarta. Reporting grouping always uses the user-selected event date, never the created/updated system timestamp. **(Confirmed — Section 17)**

### Product Decisions Before Detailed Specification

- Whether target date ships in the v1 fund/goal form.
- Whether archiving a non-zero-balance fund is ever blocked outright vs. always allowed with confirmation.
- Whether a fund's target amount can be changed/removed after allocation history exists.
- Whether a "goal completed" state is explicit or purely derived.
- Whether creditor/lender name is a separate debt-record field.
- Whether debt status (Active/Paid Off) is explicit or derived from balance.
- Whether overpayment blocking is permanent policy or may later allow credit-balance/refund handling.
- Whether a "Refund/Reimbursement" income category belongs in the default set.
- Whether the workspace total allows user-controlled account exclusion.
- Whether archived accounts remain in historical reporting-period/workspace totals.
- Whether a fully custom one-off date-range filter is needed.
- How many recorded events should occur before the product suggests creating a fund/goal.
- Exact Trash retention period.
- Whether manual permanent deletion from Trash is available in v1.
- Whether previous field values are stored internally even without a UI history view.
- Whether high-impact corrections require a stated reason.
- The exact threshold for requiring an impact-preview confirmation.
- Whether a replaced event appears in ordinary history or only in its own detail/audit context.
- Final period-comparison metric set.
- Whether percentage differences are hidden when the previous value is zero.
- Whether a reporting-cycle change applies immediately or at the next session start.

### UX Decisions

- Exact dashboard card order, visual hierarchy, and item counts before "Lihat semua."
- Whether unallocated amount is a standalone dashboard card or nested within account/fund sections.
- Exact empty-state wording for users without funds/debts.
- Exact mobile navigation pattern and placement of the primary "record event" action.
- Whether form drafts persist after closing the browser.
- Exact final wording/count of starter categories (candidates given in Section 13).
- How long a dismissed contextual suggestion stays hidden.
- Whether onboarding completion is shown to the user as a milestone or tracked only internally.
- Whether users can skip the guided first transaction entirely during private beta.
- Final Bahasa Indonesia UI terminology (candidates given in Section 22).
- Whether the first guided event type is fixed or user-selectable.
- Exact placement and cadence of the optional post-onboarding setup checklist.
- Category icons, colors, and custom ordering.
- Whether dashboard visibility or ordering is customizable.

### Security and Privacy Decisions

- Invitation mechanics: single-use vs. reusable, expiry.
- Password requirements.
- Exact session duration.
- Whether password reset auto-invalidates all other sessions or asks the user first.
- Whether v1 shows an active-device list or only "sign out of all devices."
- Recovery policy when the verified email account itself becomes permanently inaccessible.
- Exact account-deletion retention period.
- Whether any consent-based temporary support-access mechanism is ever needed.
- Whether a local privacy lock/re-authentication is needed for particularly sensitive screens.
- Whether a future balance-hiding privacy mode belongs in v1.

### Operational Decisions

- Exact beta cohort size and invitation wave structure.
- Exact supported mobile-browser/viewport matrix.
- Whether account deletion must be fully self-service before the first invitation wave, or may begin as a documented manual request process.
- Whether data export must ship before the first beta wave.
- Exact numerical quality thresholds (onboarding completion rate, support-incident rate, etc.).
- Exact operational analytics tooling.
- Exact criteria for promoting reflection/noticing features beyond the four confirmed in Section 23, once trust is validated.
- Whether recording-consistency observations ("N of last M days") belong in the first post-launch iteration.
- Exact backup/recovery testing cadence and documentation format.

### Future Validation Questions

- Whether the differentiation hypothesis (flexibility + transparency without spreadsheet-building) holds against real user behavior.
- Whether the proposed starter categories/event types fit most beta users' real financial lives.
- Whether the non-calendar salary-cycle reporting need is shared broadly or specific to the founder.
- Whether "gentle milestone" mechanics will feel non-pressuring once eventually introduced.
- Whether independent, private single-owner workspaces hold up once couples/early users ask for shared visibility.
- Whether progressive/optional customization is discoverable enough without overwhelming beginners.
- What future business model(s), if any, Annotasi Finance should pursue beyond private beta.

---

## 29. Future Directions

**(Explicitly Future direction — not scoped for v1)**

- **Household collaboration:** spouse/family invitations, shared or joint editing, roles, audit trail across multiple people.
- **Learning Mode:** a separate teacher/student simulation mode using simulated scenarios with no real money; teacher visibility limited strictly to learning progress (modules completed, exercises attempted, reflection submitted) and never to real financial data, under a hard, non-negotiable boundary carried forward from PRODUCT_IDENTITY.md §10.
- **Broader financial education** content and features.
- **Responsible gamification expansion:** gentle milestones and optional challenges (sequenced after trust and reflection are validated), always private by default, resumable, behavior-based rather than perfection-based, and never leaderboard-, streak-loss-, or comparison-based.
- **Future business model(s):** currently undecided; v1 boundaries (not banking, not investment/trading, no fund custody) describe v1 scope, not permanent limits on what Annotasi Finance could become.

---

## 30. Requirement Traceability Summary

| Product Principle / Scope Boundary | Primary PRD Sections |
|---|---|
| Trust first | 11, 12, 13, 14, 15, 16, 19, 20, 24 |
| Financial events before categories | 9, 11, 13 |
| Explain every important number | 18, 19, 20, 24 |
| Simple by default, flexible when needed | 10, 12, 13, 23 |
| Clarity without shame | 16, 20, 21, 22, 23, 26 |
| Make progress visible, not fragile | 17, 18, 23 |
| Help users notice before giving them something to pursue | 23, 29 |
| Multi-user platform, single-owner private workspace | 6, 20, 24 |
| Household collaboration is future scope | 6, 8, 29 |
| Learning Mode is future scope | 6, 8, 29 |
| Teachers never access students' real financial data | 6, 29 |
| Bahasa Indonesia user-facing UI | 10, 16, 17, 20, 21, 22, 23 |
| Mobile-first responsive design | 10, 21, 24 |
| Privacy by default | 20, 24, 27 |

---

## Revision Notes

This file, `docs/product/ANNOTASI_FINANCE_MVP_PRD.md`, is the approved Draft-for-review PRD, combining the content agreed upon through the PRD discovery interview and a subsequent content-correction pass, followed by this formatting-and-file-creation pass. No product requirement was changed, added, removed, or silently resolved during this pass — only formatting and file creation were performed.

This pass specifically verified and, where needed, corrected the following in the saved file:

1. **Heading levels** — the document title uses `#`; all thirty numbered sections use `##`; every named subsection (including "Where Financial Values May and May Not Appear," "Terminology Note," the Section 24 launch-blocking subsections A–K, and the six Section 28 groupings) uses `###`.
2. **Product Promise** (Section 4) is formatted as a Markdown blockquote using `>`.
3. **Tables** — the terminology mapping (Section 22) and the requirement traceability summary (Section 30) are valid pipe-delimited Markdown tables with complete rows; no box-drawing characters or non-Markdown table formatting are present anywhere in this file.
4. **Bahasa Indonesia onboarding examples** — Section 10's starter-account and opening-balance choice steps use the Bahasa Indonesia terms Tunai, Rekening Bank, Dompet Digital, Lainnya, Masukkan saldo saat ini, and Mulai mencatat dari nol, with the internal canonical English names retained parenthetically where identified as internal terminology, consistent with the Section 22 terminology note.
5. **No Claude UI or terminal artifacts** — this file contains no prompt borders, `❯` characters, manual-mode text, shortcut hints, or other chat-interface artifacts of any kind.
6. **The eight items in "Blocking Decisions Before Domain Modeling"** (Section 28, as it existed at that time) remained explicitly unresolved in this saved file, including the recommended-but-unconfirmed IDR-only currency hypothesis.
7. **Document status** remained "Status: Draft for review" (Section 1), unchanged by this formatting pass.

A further, final documentation-correction pass made two additional edits, neither of which changed a confirmed requirement or resolved an open question:

8. **Section 24.D wording** — the ambiguous sentence "No dead-end number is a launch requirement" was replaced with "Having no dead-end numbers is a launch requirement. Any important number that cannot be traced to its supporting records is release-blocking," to remove ambiguity about what is being required.
9. **Section 28 completeness** — Section 28 was made a complete centralized index of open questions already present elsewhere in the document. Items already listed as "Still undecided" in Sections 16, 17, and 10/13/18 (Trash retention period, manual permanent deletion from Trash, internal storage of previous field values, stated-reason requirement for high-impact corrections, impact-preview confirmation threshold, replaced-event visibility, final period-comparison metrics, zero-value percentage-difference handling, reporting-cycle change timing, fixed vs. user-selectable first guided event type, onboarding-checklist placement/cadence, category icons/colors/ordering, and dashboard visibility/ordering customization) were added to the appropriate Section 28 subsections without being removed from their original sections and without being resolved. Subcategories remain identified as not proposed for v1 (Section 13) rather than being reframed as a required v1 decision. At that time, all eight items under "Blocking Decisions Before Domain Modeling" remained unresolved and unchanged.

A further revision pass applied eight product-owner decisions that had been the "Blocking Decisions Before Domain Modeling" in Section 28:

10. **Eight blocking decisions resolved.** The product owner explicitly resolved: (1) currency — IDR-only, whole Rupiah, single fixed workspace currency; (2) negative account balances — never permitted, balance-checked blocking on Expense/Transfer/Debt Repayment; (3) archiving accounts with a non-zero balance — blocked with explanation and next steps, never auto-resolved; (4) fund allocation provenance — funds are virtual, per-account-backed allocations with no automatic cross-account consumption; (5) fund-linked Expense paid from an account — single matching payment account and allocation source, Transfers never move fund purpose automatically; (6) event date vs. account opening-balance effective date — events cannot predate an account's opening-balance effective date without first explicitly moving that date, with impact preview; (7) Debt Repayment date vs. debt opening date — the same rule applied to debt records; (8) workspace timezone — every workspace fixed to Asia/Jakarta, not user-configurable. These decisions were incorporated into Sections 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 21, 24, and 28. Section 28 was restructured so the former "Blocking Decisions Before Domain Modeling" subsection is now "Resolved Decisions Before Domain Modeling," stating that domain modeling may now begin, and the corresponding "Still undecided" mentions of these eight items were removed from Sections 8, 11, 12, 14, 15, and 17 (without removing any unrelated still-open item). No architecture, technology, database, API, domain-model, milestone, or implementation decision was introduced during this pass, and the document's status remains "Draft for review" (Section 1) — the PRD as a whole is not being marked Final by this pass.

A subsequent review pass corrected one calculation inconsistency and one over-specified provenance rule found in the previous pass's wording, without changing any other confirmed requirement:

11. **Balance-component and fund-provenance corrections.** Sections 9, 11, 12, 14, 18, 19, 24, and 28 were updated to consistently apply one confirmed calculation model — total account balance = unallocated amount + the sum of that account's current fund allocations — replacing the ambiguous phrase "available balance" with the precise terms "total account balance," "unallocated amount," and "fund allocation from the selected account." The fund-linked Expense validation rule was corrected: it must not exceed the selected fund's current allocation backed by the payment account and must not make total account balance negative, rather than the earlier, over-specified requirement that it also not exceed the payment account's unallocated amount. Section 12's account-archival guidance was corrected to clarify that Fund Release alone never changes total account balance and therefore can never by itself bring a non-zero account to Rp0 — releasing allocations only moves money into unallocated amount, after which an explicit Transfer or other correctly recorded disposition is still required before archiving. Wording implying Fund Release or a fund-linked Expense selects a specific historical Fund Allocation event ("the specific prior allocation," "that specific account-backed allocation") was replaced with wording stating that both instead draw from the selected source account's *current* allocation balance for the fund, with no FIFO, LIFO, allocation lots, or other automatic ordering. The Section 24 acceptance scenarios were updated to test these corrected invariants explicitly. No architecture, technology, database, API, domain-model, milestone, or implementation decision was introduced during this pass.

A final consistency-correction pass removed the one remaining allocation-lot implication and made recalculation an explicit, first-class requirement, without changing any other confirmed requirement:

12. **Chronological recalculation and remaining lot-implication removal.** Section 16's dependency-blocking example "reducing a Fund Allocation already consumed by a linked Expense" — which incorrectly implied that a fund-linked Expense links to a particular historical Fund Allocation event — was replaced with aggregate, account-backed-allocation-balance language; it now states explicitly that fund-linked Expense, Fund Release, edits, deletions, and restorations operate against the selected fund's account-backed allocation balance as a whole, never against a particular historical Fund Allocation event, and that no FIFO, LIFO, allocation-lot, or per-allocation consumption relationship exists in v1. Section 16 now states a first-class **chronological recalculation** requirement: any change to historical financial state (event, opening balance, date, account/fund/debt reference, deletion, restoration, or replacement) recalculates the affected history from the earliest affected point forward, and every confirmed invariant (total account balance ≥ Rp0, unallocated amount ≥ Rp0, every account-backed fund allocation ≥ Rp0, total account balance = unallocated amount + current fund allocations, outstanding debt principal ≥ Rp0, and valid event dates against account/debt opening dates) must hold at *every* point in that recalculated history, not only in the final state — a failure at any point blocks the change with a clear Bahasa Indonesia explanation. A **deterministic same-date recalculation** requirement was added: when multiple events share one event date, recalculation must use a stable, reproducible ordering, with the exact mechanism explicitly deferred to domain modeling/detailed specification, and with created/updated timestamp continuing to never determine the reporting period. Opening-balance initialization was clarified in Sections 9 and 12: it sets total account balance and unallocated amount to the same value with fund allocations starting at Rp0, and is never Income; later fund allocation must be recorded explicitly through Fund Allocation. Section 4's Product Promise sentence was updated to say "a Fund Allocation reduces unallocated amount and increases the selected fund allocation without changing total account balance or income/expense totals" in place of the imprecise "a fund contribution reduces available money," without rewriting the Product Promise itself. Section 24 acceptance scenarios 8, 9, and 11 were strengthened to verify chronological recalculation of opening-balance changes, blocking of historical edits that would invalidate any later invariant, and full-history revalidation on deletion/restoration without any dependency on a historical Fund Allocation lot. No architecture, technology, database, API, domain-model, milestone, or implementation decision was introduced during this pass.

No technology, framework, database, API, domain-model, milestone, or implementation decision was introduced in this file.
