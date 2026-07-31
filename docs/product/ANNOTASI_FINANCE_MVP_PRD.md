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

Trustworthy handling means correctly capturing the actual financial effect of an event — a transfer moves money between the user's own accounts and is neither income nor expense; a fund contribution reduces available money and increases a dedicated fund's balance without touching income/expense totals; a debt repayment reduces both cash and outstanding debt without inflating ordinary spending. **(Confirmed)**

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
- Multi-currency and currency conversion (see Section 28, Blocking Decisions Before Domain Modeling, for the currency question itself).
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
- **Dedicated fund / financial goal** — a user-defined purpose for which money is reserved (e.g., an emergency fund, a named savings purpose). A fund with an optional target amount behaves as a goal. Represents intended purpose, not a physical location of money.
- **Debt record** — a minimal, structured representation of an existing liability (name, opening outstanding principal, effective date), distinct from an account, referenced by Debt Repayment events.
- **Reporting period** — the time window (calendar month or an optional custom monthly cycle) used to group events for summaries and reports.
- **Opening balance** — the starting state of an account (or debt), not a financial event, and never treated as income or expense.

**(Confirmed)** Named user purposes such as Qurban, Wife Savings, Mac Istri, Home Sweet Home, or Emergency Fund are always instances of the generic "dedicated fund/goal" concept — never their own event types, categories, or universal structures.

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

**Still undecided:** whether the first guided event type is fixed or user-selectable; whether users may skip the guided flow entirely during private beta; exact placement and cadence of the optional post-onboarding setup checklist.

---

## 11. Financial Event Requirements

The v1 financial event set is closed at **six types**. Opening balance is explicitly **not** a financial event — it is account/debt starting state. Candidate Bahasa Indonesia labels for these event types are given in Section 22's terminology note; the English names below are the internal/canonical concept names used in this document, not final UI text.

### 1. Income

- **Meaning:** Money enters the workspace from an external source (salary, freelance payment, gift, business income).
- **Required references:** one account, one income category.
- **Account effect:** increases the selected account balance.
- **Reporting effect:** increases income totals for the relevant period; never affects expense totals.
- **Fund/debt effect:** none automatically.
- **Must never be:** money moved from another account owned by the same user (that is a Transfer).

### 2. Expense

- **Meaning:** Money leaves an account for a good, service, obligation, or consumption.
- **Required references:** one account, one expense category; optionally, one dedicated fund.
- **Account effect:** decreases the selected account balance.
- **Reporting effect:** increases spending totals for the relevant period; never affects income totals.
- **Fund/debt effect:** if linked to a fund, also decreases that fund's balance; the expense is counted once in spending totals, and the fund's prior allocation is not counted as an expense.
- **Must never be:** a Transfer or the principal portion of a Debt Repayment.

### 3. Transfer

- **Meaning:** Money moves between two accounts owned by the same user.
- **Required references:** one source account, one destination account (both owned by the user).
- **Account effect:** decreases source, increases destination.
- **Reporting effect:** never counted as income or expense; does not change total money owned by the user.
- **Fund/debt effect:** none.
- **Must never be:** represented as two independent, potentially inconsistent income/expense records — both sides remain one linked event.

### 4. Fund Allocation

- **Meaning:** The user reserves existing money for a named purpose.
- **Required references:** one dedicated fund, one source account.
- **Account effect:** none to the physical account balance.
- **Reporting effect:** never counted as income or expense; does not change net financial position.
- **Fund effect:** increases the fund's allocated balance; decreases the amount available/unallocated from the source account. Cannot exceed the amount currently unallocated in that account.
- **Must never be:** its own universal transaction type per named fund (e.g., "Qurban" is not an event type), nor a stand-in for a generic savings category.

### 5. Fund Release

- **Meaning:** The user removes previously allocated money from a fund back to available/unallocated status, without implying the original allocation was a mistake.
- **Required references:** one dedicated fund; sufficient allocation-source provenance to release correctly.
- **Account effect:** none to the physical account balance.
- **Reporting effect:** never counted as income or expense.
- **Fund effect:** decreases the fund's allocated balance; increases available/unallocated money. Cannot exceed the fund's currently available balance.
- **Must never be:** confused with deleting/correcting a Fund Allocation (which implies the original record was wrong).

### 6. Debt Repayment

- **Meaning:** The user pays down an existing debt balance.
- **Required references:** one existing debt record, one payment account. Cannot exist without a debt record (no free-text debt labels).
- **Account effect:** decreases the payment account balance.
- **Reporting effect:** principal is never counted as ordinary expense or income; interest, penalties, or fees are recorded separately as Expense events.
- **Debt effect:** decreases the outstanding debt balance. Cannot reduce outstanding debt below zero; an overpayment attempt must be blocked or require correction before saving.

**(Confirmed)** Opening balance remains outside this list, applies to both accounts and debt records, is never income or expense, and requires its own confirmation/correction flow (see Sections 10, 12, 15, 16). The precise relationship between an event's date and an account's or debt's opening-balance effective date is a blocking decision before domain modeling — see Section 28.

---

## 12. Account Requirements

**(Confirmed)**

- An account represents where money actually/operationally resides (physical cash, bank account, e-wallet). It is never a category, fund, debt record, person, or reporting label.
- Minimum structure: user-defined name, account type, opening balance, opening-balance effective date, active/archived state, optional note.
- Account type is a fixed v1 list — internal canonical names **Cash, Bank Account, E-Wallet, Other** (candidate Bahasa Indonesia labels: Tunai, Rekening Bank, Dompet Digital, Lainnya) — descriptive only; it must never alter the financial semantics of a transaction (a Transfer is a Transfer regardless of account type).
- The **Other / Lainnya** account type remains an **asset-like, money-holding account** in v1 (e.g., an uncategorized cash-equivalent or e-money holding). It must **not** be used to represent a debt, credit-card liability, or investment account — those remain out of the account concept entirely (debt is its own record per Section 15; investment accounts are out of scope per Section 8).
- Multiple accounts are a day-one v1 capability (required for Transfer to be meaningful and for a trustworthy total position).
- Onboarding starts with exactly one account, chosen and optionally renamed by the user (see Section 10); additional accounts are added afterward as an optional step.
- Every account requires the explicit opening-balance starting-point decision (enter current balance vs. start from zero) before it can be used for a real transaction.
- A workspace total balance across active accounts must be traceable to the individual account balances it includes.
- **Archiving** is the normal way to stop using an account: preserves all financial history, excludes the account from active selectors, blocks new transactions, and must never silently zero, move, or delete a balance.
- **Permanent deletion** is allowed only for an account with a zero opening balance and no financial history or dependencies; otherwise, deletion is blocked and archiving is required.
- Archiving an account must preserve all historical fund-allocation and debt-repayment links tied to it.

**Still undecided:** whether the workspace total allows user-controlled account exclusion; whether archived accounts remain in historical reporting-period/workspace totals. Whether negative balances are permitted for any account type, and the exact behavior when archiving an account with a non-zero balance, are blocking decisions before domain modeling — see Section 28.

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
- A fund exists at the workspace level and may logically span multiple accounts, but every individual allocation still references exactly one source account, preserving traceability of where the money came from.
- Fund balance is always derived from its events (Fund Allocation, Fund Release, linked Expenses, and their corrections/deletions/restorations) — never a directly editable number.
- **Fund Allocation** cannot exceed the amount currently unallocated in the selected source account — no double-reserving the same money. Planned future contributions belong in the target amount, not in an allocation against money that doesn't yet exist.
- **Fund Release** cannot exceed the fund's currently available balance; the source must never be unexplained.
- A fund-linked **Expense** cannot exceed the fund's available balance — the product must block saving and require an explicit resolution (reduce amount, allocate more first, unlink from the fund, or record separate events) rather than silently allowing a negative fund balance.
- Target amount is a planning marker, not a hard cap — allocations may exceed it, shown clearly as "target exceeded," and must never be blocked for that reason alone.
- Archiving preserves all history; permanent deletion is allowed only for a fund with zero balance and zero event history. Archiving a non-zero-balance fund requires a warning and explicit resolution, never a silent reset.

**Still undecided:** whether target date ships in v1's form; whether archiving a non-zero fund is ever blocked outright vs. always allowed with confirmation; whether a target amount can be changed/removed after history exists; whether a "completed" state is explicit or purely derived. The exact allocation-provenance-consumption strategy when a fund spans multiple accounts, and the correct behavior when a fund-linked Expense is paid from a different account than the allocation source, are blocking decisions before domain modeling — see Section 28.

---

## 15. Debt Record and Debt Repayment Requirements

**(Confirmed)**

- Debt tracking is **optional at the workspace level** — users who don't need it never create a debt record — but a debt record is **mandatory** for every Debt Repayment event; an unstructured text label is never sufficient.
- Minimum debt record: debt name, opening outstanding principal balance, effective date of that opening balance, optional note. Represents a liability that already exists when the user begins tracking it.
- Debt records may be created **inline**, without leaving the repayment recording flow — no full debt-management workflow is required.
- Debt Repayment flow: select event → select or inline-create a debt record → select payment account → enter principal amount → review effect before confirming (payment account decreases, outstanding debt decreases, principal not counted as expense) → save → trace both effects back to the event.
- A repayment cannot silently reduce outstanding debt below zero; an entered principal exceeding the outstanding balance must be blocked or require correction before saving.
- Interest, penalties, and service fees are recorded as **separate Expense events**, not mixed into the principal repayment.
- Editing or deleting a Debt Repayment must recalculate both the account balance and the outstanding debt consistently; any correction that would create an invalid debt balance (overpayment, negative outstanding, unexplained result after changing the linked debt) must be blocked.
- Deleting a debt record is blocked while repayment events still reference it.
- Full debt lifecycle management — original borrowing/issuance events, lender management, repayment schedules, interest calculation, installment automation — is explicitly outside v1.

**Still undecided:** whether creditor/lender name is a separate field or part of the debt name; whether v1 needs an explicit Active/Paid-Off status vs. deriving it from balance; whether overpayment is always hard-blocked or a future release supports credit-balance/refund scenarios. The relationship between a Debt Repayment's event date and the debt record's opening-balance effective date is a blocking decision before domain modeling — see Section 28.

---

## 16. Correction, Replacement, Trash, and Restore Requirements

**(Confirmed)**

- Users may edit fields **within the same event type** (amount, date, account, category/fund/debt reference, note). Every valid edit recalculates all affected balances, funds, debts, summaries, reports, dashboard, and history immediately, with a before/after impact shown for material changes.
- **Changing an event's type** (e.g., Expense → Income) is never treated as an ordinary field edit. It uses a guided "Replace event" flow: the old event is marked as replaced, a new event is created with the required fields, and both remain linked for traceability — presented to the user as one correction action.
- Financial events use **soft deletion**: deleted events move to a recoverable Trash state, their financial effect is reversed immediately, and they remain recoverable for a defined retention period (30 days is the current preference). Restoring an event reapplies its effect only after revalidating current dependencies.
- Deletion is not the default irreversible action; permanent deletion is not required as a default v1 capability.
- **Transfers** are always edited, deleted, and restored as one linked event — never one-sided.
- **Dependency-aware blocking:** an edit or deletion that would leave the financial state invalid or unexplained (e.g., reducing a Fund Allocation already consumed by a linked Expense, editing a Debt Repayment in a way that breaks the outstanding balance) must be blocked with a clear explanation of the dependency and what the user can do next — never silently forced to "make things work."
- **Opening balance** has its own correction flow, separate from ordinary event editing: changing it shows the impact on current and historical balances, is never treated as income or expense, requires explicit confirmation, and cannot be deleted if doing so would leave the account without a defined starting point.
- Full field-level audit history (a complete change ledger) is deferred, but v1 requires minimal change metadata: created timestamp, last-updated timestamp, edited/deleted/replaced flags, and a replacement link where applicable.
- All correction and deletion language uses clear, natural Bahasa Indonesia consistent with "Clarity without shame."

**Still undecided:** exact Trash retention period; whether manual permanent deletion from Trash is available in v1; whether previous field values are stored internally even without a UI history view; whether high-impact corrections require a stated reason; the exact threshold for requiring an impact-preview confirmation; whether a replaced event appears in ordinary history or only in its own detail/audit context.

---

## 17. Reporting Period Requirements

**(Confirmed)**

- v1 supports **calendar-month reporting** (the default for every new workspace, requiring no setup) and one **optional custom monthly cycle**, configured once at the workspace level.
- Only one active cycle definition per workspace — no multiple simultaneous cycles per account, category, fund, or purpose.
- The custom cycle uses a single recurring start day, supported for **days 1 through 28** (avoiding month-end ambiguity); days 29–31 are deferred.
- Events are grouped into a period based on the user-selected event date.
- Every displayed period must show its **exact start and end date range** — never a vague label like "Agustus" when a custom cycle is active.
- Changing the reporting cycle never modifies transaction dates, account balances, or the financial effect of any event — it only regroups historical summaries. It requires an impact preview (showing old vs. new ranges) and explicit confirmation before applying.
- v1 includes a lightweight **current-vs-previous-period comparison**: direction of Income/Expense change, largest category changes, absolute and percentage difference where meaningful — always traceable to underlying events, phrased neutrally (e.g., "Pengeluaran transportasi bertambah Rp150.000 dibanding periode sebelumnya," never judgmental language).
- Periods with incomplete tracking history must be explicitly flagged so comparisons are not presented as misleadingly complete.

**Still undecided:** whether a fully custom one-off date-range filter is needed; final comparison metric set; whether percentage differences are hidden when the previous value is zero; how archived accounts factor into historical period totals; whether a cycle change applies immediately or at next session start. The workspace timezone and reporting-boundary timezone rule is a blocking decision before domain modeling — see Section 28.

---

## 18. Dashboard Requirements

**(Confirmed)**

The dashboard is a concise financial overview, not a full analytics workspace. It must show, at minimum:

- The **exact active reporting-period date range**, and whether the workspace uses calendar month or a custom cycle.
- **Account position:** total balance across active accounts, total amount allocated to dedicated funds, and total amount available/unallocated — presented so that Total account balance = Allocated money + Available/unallocated money, never adding fund balances on top of the account total as if funds were separate physical money.
- **Current-period summary:** total Income, total Expense, and their difference — with the difference explicitly labeled as a reporting-period result, never presented as total wealth or available balance.
- The approved **previous-period comparison** (Section 17), in neutral, factual Bahasa Indonesia.
- A compact section of **active funds/goals**: name, current allocated balance, target amount and progress percentage where a target exists (a fund without a target shows balance only, no misleading percentage).
- A compact **debt summary** for users who use debt tracking (total outstanding principal, per-debt outstanding amounts) — omitted or shown as a helpful empty state for users without debt records, never a required or judgmental section.
- A short list of **recent financial events** (type, amount, date, account(s), category, fund/debt reference where applicable) — for quick verification, not a full history replacement.
- The initial "noticing" insights defined in Section 23 (fund/goal progress, previous-period comparison, onboarding acknowledgment, incomplete-data notices), always visually subordinate to the financial information above.
- At most **one optional, non-blocking next-step suggestion**, always subordinate to the financial information.

**Fund double-counting is explicitly prohibited** — allocated fund money is a subset of the account total, never additional money.

**Still undecided:** exact card order/visual hierarchy; item counts before "Lihat semua"; whether available/unallocated money is a standalone card; final comparison metrics; dashboard customization; whether archived accounts factor into historical drill-downs; empty-state wording for users without funds/debts.

---

## 19. Traceability Requirements

**(Confirmed)** "Explain every important number" is a hard v1 requirement, implemented as three levels:

1. **Summary** — the dashboard/report shows the important number.
2. **Supporting records** — opening the number reveals the accounts, categories, funds, debts, or financial events that produced it (e.g., Income total → the Income events included; fund balance → its Allocation/Release/linked-Expense history; available/unallocated amount → its formula and components).
3. **Individual event explanation** — opening one financial event shows enough detail to fully understand its effect: event type, amount, date, account(s), category, fund, debt record, note, account/fund/debt balance effects, and whether it was edited, replaced, or restored. A Transfer shows both sides together; a fund-linked Expense shows both the account decrease and the fund decrease; a Debt Repayment shows both the account decrease and the outstanding-debt decrease.

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
2. **Expense** — Record Expense from an account. Account balance decreases. Expense total increases. Income total does not change. Category reporting updates consistently.
3. **Transfer** — Move money between two owned accounts. Source decreases, destination increases. Workspace total remains unchanged. Income and Expense totals remain unchanged. Both sides remain one linked event.
4. **Fund Allocation** — Allocate available money from an account to a dedicated fund. Physical account balance remains unchanged. Allocated amount increases; available/unallocated amount decreases. Income and Expense totals remain unchanged. The same money is never double-counted.
5. **Fund Release** — Release allocated money from a fund. Fund balance decreases; available/unallocated amount increases. Physical account balance remains unchanged. Income and Expense totals remain unchanged.
6. **Fund-linked Expense** — Record an Expense linked to a fund. Payment-account balance decreases and fund balance decreases. Expense total increases exactly once. The earlier allocation remains non-expense. The event detail explains both effects.
7. **Debt Repayment** — Create a minimal debt record. Record principal repayment. Payment account decreases; outstanding debt decreases. Principal does not increase ordinary Expense totals. Interest or fees, when present, remain separate Expense events.
8. **Opening balance** — Set or correct an opening balance. The opening balance is never counted as Income. All later balances recalculate consistently. The user can understand the selected starting point.
9. **Correction (same-type edit)** — Edit an event's amount, date, account, category, fund, or debt reference within the same event type. Every dependent view updates consistently. Invalid dependency-breaking changes are blocked with an understandable explanation.
10. **Event-type replacement** — Correct one event type into another through the guided replacement flow. The old event is marked as replaced; the new event becomes active. No double-counting or temporary unexplained result remains.
11. **Deletion and restoration** — Move an event to Trash. Its financial effect is reversed everywhere. Restore it. Its effect is reapplied everywhere after dependency validation.
12. **Reporting-cycle boundary** — Confirm events on both sides of a custom-cycle boundary. Each event appears in the correct period. Exact date ranges are displayed. Changing the cycle regroups reports without modifying transactions or balances.

These twelve scenarios constitute the minimum pre-launch acceptance suite. Detailed step-by-step test cases derived from these scenarios may later be extracted into a dedicated specification/test-plan document, but the scenario summaries above must remain present in this PRD regardless of where detailed test cases are later maintained.

### C. Cross-View Consistency Is a Hard Launch Gate

For every scenario above, these views must agree: dashboard, transaction history, account details, fund details, debt details, period summaries, reports, and traceability drill-downs. Any unexplained difference between an important summary number and its source records is a release-blocking defect. The product must not launch while known inconsistencies remain.

### D. Traceability Must Work

Before private beta: every important dashboard total must be openable; the user must be able to see the records that produced it; each event detail must explain its complete financial effect; derived values (e.g., available/unallocated money) must show their formula and components; Transfer, fund-linked Expense, and Debt Repayment must show both sides of their effects. Having no dead-end numbers is a launch requirement. Any important number that cannot be traced to its supporting records is release-blocking.

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

None of the items in this section are silently resolved by this PRD. They are grouped by the kind of decision required.

### Blocking Decisions Before Domain Modeling

These items must be resolved before domain modeling begins, because the domain model cannot be designed consistently while they remain open:

- **v1 currency and workspace currency behavior.** *(Recommended hypothesis, not Confirmed:* "v1 may support only Indonesian Rupiah (IDR), with one fixed workspace currency; multi-currency remains excluded." *Recommended for confirmation before domain modeling.)*
- Whether negative balances are allowed for asset accounts.
- Account archival behavior when the account's balance is non-zero.
- Fund-allocation provenance consumption when a fund spans multiple accounts (i.e., which account-backed allocation is affected by a Fund Release or a fund-linked Expense).
- Behavior when a fund-linked Expense is paid from a different account than the account(s) that originally funded the allocation.
- The relationship between a financial event's date and an account's opening-balance effective date (e.g., can an event predate the opening-balance effective date?).
- The relationship between a Debt Repayment's event date and the debt record's opening-balance effective date (same class of question as above, applied to debt).
- Workspace timezone and reporting-period boundary timezone (which timezone determines which reporting period an event falls into).

These eight items remain explicitly unresolved. None of them is decided by this document.

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
- Whether available/unallocated money is a standalone dashboard card or nested within account/fund sections.
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
6. **The eight items in "Blocking Decisions Before Domain Modeling"** (Section 28) remain explicitly unresolved in this saved file, including the recommended-but-unconfirmed IDR-only currency hypothesis.
7. **Document status** remains "Status: Draft for review" (Section 1), unchanged by this formatting pass.

A further, final documentation-correction pass made two additional edits, neither of which changed a confirmed requirement or resolved an open question:

8. **Section 24.D wording** — the ambiguous sentence "No dead-end number is a launch requirement" was replaced with "Having no dead-end numbers is a launch requirement. Any important number that cannot be traced to its supporting records is release-blocking," to remove ambiguity about what is being required.
9. **Section 28 completeness** — Section 28 was made a complete centralized index of open questions already present elsewhere in the document. Items already listed as "Still undecided" in Sections 16, 17, and 10/13/18 (Trash retention period, manual permanent deletion from Trash, internal storage of previous field values, stated-reason requirement for high-impact corrections, impact-preview confirmation threshold, replaced-event visibility, final period-comparison metrics, zero-value percentage-difference handling, reporting-cycle change timing, fixed vs. user-selectable first guided event type, onboarding-checklist placement/cadence, category icons/colors/ordering, and dashboard visibility/ordering customization) were added to the appropriate Section 28 subsections without being removed from their original sections and without being resolved. Subcategories remain identified as not proposed for v1 (Section 13) rather than being reframed as a required v1 decision. All eight items under "Blocking Decisions Before Domain Modeling" remain unresolved and unchanged.

No technology, framework, database, API, domain-model, milestone, or implementation decision was introduced in this file.
