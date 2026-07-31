# Annotasi Finance — Product Identity

- Status: Approved foundation
- Discovery completed: 2026-07-31
- Document type: Product identity, not a PRD

*Status labels used throughout: **Confirmed**, **Hypothesis — requires validation**, **Future direction**, **Excluded from v1**.*

---

## 1. Product Essence

Annotasi Finance is a responsive, mobile-first personal finance application whose first job is to be **trustworthy**: every financial event is recorded once, represented accurately, and reflected consistently everywhere the user looks. On top of that trustworthy foundation, it aims to become a product that helps people build healthy financial habits and eventually learn financial decision-making — without shame, competition, or manipulation. **(Confirmed)**

## 2. Why the Product Should Exist

The current workaround — Telegram bot → Google Apps Script → Google Sheets — proves the underlying need is real, but the workaround itself is fragile: financial events get misrepresented (debt repayment logged as a daily expense; a contribution to a dedicated fund such as Qurban recorded as generic savings instead of an allocation to its intended fund), some funds require manual handling outside the normal flow, and when the dashboard looks wrong, debugging requires inspecting five different layers of the system. It also only *records* — it doesn't help anyone understand or learn from their financial behavior. **(Confirmed — founder's lived problem)**

**(Hypothesis — requires validation)** Generic finance apps may solve the recording problem but may force real financial events into a generic model without making each event's actual financial effect explicit or transparent — so the gap Annotasi Finance targets isn't "no categories," it's "no trustworthy representation of what actually happened."

## 3. Primary User for the First Release

- **Platform level:** multi-user. Anyone invited (family, friends, beta users) registers their own account. **(Confirmed)**
- **Workspace level:** single-owner. Each user has one private financial workspace; no shared editing, invitations, roles, or collaborative households in v1. **(Confirmed)**
- User-defined funds or goals (e.g., Wife Savings, Mac Istri, Home Sweet Home) are tracked **by the account owner**, not jointly edited by multiple people. **(Confirmed)**
- Beta users are expected to want a working system with sensible defaults, not a blank canvas to configure — unlike the founder, who is comfortable designing his own structure. **(Hypothesis — requires validation)**

Household collaboration (spouse invitations, shared/personal accounts, roles, audit trail) is an explicit **future direction**, deliberately excluded from v1 scope. **(Excluded from v1 / Future direction)**

## 4. Core Problem

> **Financial data cannot currently be trusted, and that undermines everything built on top of it — reports, goals, and any future educational or gamified feedback.**

Symptoms observed today: financial events get misrepresented (a transfer counted as an expense, debt repayment counted as daily spending, a contribution to a dedicated fund recorded as generic savings), unclear whether values are manually entered or auto-calculated, and no single reliable source of truth. **(Confirmed)**

## 5. Product Promise

> **"Record a financial event once, represent what actually happened, and show a result the user can understand and trust."** **(Confirmed)**

Trustworthy handling means more than assigning a category — it means correctly capturing the actual **financial effect** of an event (e.g., a transfer moves money between the user's own accounts and is not income or expense; a fund contribution reduces a spendable balance and increases a dedicated fund's balance; a debt repayment reduces both cash and outstanding debt).

Trust cannot rest on the dashboard alone. What actually happened must be represented **consistently** across every place a user might look, including:

- account balances
- transaction history
- dedicated funds and goals
- summaries
- reports
- dashboard views

If any one of these disagrees with the others, the product has failed its core promise regardless of whether the dashboard itself looks correct.

The strongest expression of success, in the user's own words:

> **"I recorded it once, I understand the result, and I trust it enough to make a decision."**

## 6. Differentiation Hypothesis *(Hypothesis — requires validation)*

> "Many users need more flexibility and transparency than a generic expense tracker, but they should not need to build and maintain a spreadsheet system themselves."

Proposed combination: a financial structure that can be shaped to the user's real life + explicit representation of what each event actually did financially + transparent, traceable calculations + trustworthy reporting + simple mobile-first recording. This has **not** been tested against existing products or real users and should not be treated as a settled market position.

## 7. MVP Philosophy

**Core concepts (product language, not a data model or finalized enum list):**

To keep these ideas distinct going forward, the product should consistently separate four concepts:

- **Financial event / transaction type** — the nature of what happened (e.g., income, expense, transfer, debt repayment, a contribution/allocation to a fund). This is a small, structural set.
- **Account** — where money physically or logically sits (e.g., a wallet, a bank account).
- **Category** — a descriptive label for an event (e.g., Food, Transportation).
- **Dedicated fund or financial goal** — a user-defined purpose money is set aside for (e.g., Qurban, Wife Savings, Mac Istri, Home Sweet Home, an emergency fund). A contribution to one of these is represented as an *allocation to a named fund*, not as its own transaction type.

The exact set of event types, starter categories, and fund examples is illustrative only. Detailed selection of what ships in the first technical release will happen during PRD definition, not in this document.

**Foundation (must exist, at a high level):**

1. Reliable recording of financial events
2. Clear representation of what actually happened (income, expense, transfer, debt repayment, and allocations to user-defined funds/goals, as illustrative examples)
3. Correct handling of transfers and allocations to dedicated funds
4. Consistency across accounts, transaction history, funds/goals, summaries, reports, and dashboard
5. Easy, transparent correction of mistakes
6. Calculations the user can trace back to their source

**Onboarding principle:** *"Simple by default, flexible when needed."* New users get a working system with practical starter categories and should be able to record a transaction on day one without configuring anything. Customization (renaming/adding/hiding categories, defining custom funds, adjusting the reporting cycle) exists but is progressive and optional, not front-loaded. **(Confirmed direction; specific defaults are illustrative, not final — Hypothesis)**

**Mobile-first, not mobile-only:** most recording will happen on a phone, but mobile usability supports the trust mission — it does not replace it. **(Confirmed)**

## 8. Emotional North Star

> **"Clarity without shame."** **(Confirmed)**

After any month — good or bad — a user should feel: calm enough to face the situation, understood rather than judged, clear about what happened, still capable of improving, and aware of one next small action. The dashboard shows reality honestly; it never hides or sugar-coats it, but it never delivers a verdict either.

**Product failure condition:** users regularly feeling shame, guilt, inferiority, or fear of opening the app. A related failure: helplessness — seeing a problem with no understandable next step.

## 9. Responsible Gamification Philosophy

Sequenced, not simultaneous: **(Confirmed sequencing; specific mechanics are illustrative)**

1. **Trustworthy recording** (prerequisite for everything else)
2. **Reflection and pattern awareness** — "help me notice" (e.g., surfacing recording consistency or goal progress from data the user already entered)
3. **Gentle milestones and optional challenges** — "give me something to pursue," but optional, achievable, private by default, resumable, and behavior-based rather than perfection-based
4. **Broader financial education** (future)

Guiding principle: *"Make progress visible before making progress competitive or task-driven."*

Explicitly rejected: leaderboards, punishing/aggressive streaks, points without purpose, artificial daily tasks, trivial badges, wealth-based comparison, and any mechanic that pressures app-opening. Progress framing prefers descriptive statements ("20 of the last 24 days") over binary streak-loss language ("you lost your streak").

## 10. Future Education Direction *(Future direction — not scoped for v1)*

Two distinct modes, deliberately separated:

| | **Personal Finance Mode** | **Learning Mode** |
|---|---|---|
| Data | Real financial activity | Simulated scenarios, no real money required |
| Privacy | Private to the user | Teacher sees learning progress only |
| Visibility to teacher | Never | Modules completed, exercises attempted, reflection submitted, concepts understood |
| Purpose | Trustworthy tracking and reflection | Practicing financial decision-making safely |

**Hard boundary (Confirmed):** a teacher or facilitator must never see a student's real balances, income, transactions, debts, or savings goals/funds. Students may later opt into Personal Finance Mode for their own real money, but that is a separate decision from Learning Mode participation. Neither teacher/student features nor Learning Mode are part of the first release. **(Excluded from v1)**

## 11. Success Criteria (3–4 months into private beta)

**Founder success (Confirmed):**

- Telegram and Google Sheets are no longer needed as the primary finance system.

**Beta-user success (distinct from founder success):**

- Users rely on Annotasi Finance as their primary place for recording or understanding their finances, without maintaining a second system purely to verify it.
- Data is trusted: transfers, debt repayments, and contributions to dedicated funds (e.g., Qurban, Wife Savings) are represented as what they actually are, not miscategorized; balances trace back to real transactions; corrections propagate immediately everywhere.
- Mistakes are correctable without technical help.
- Recording a common transaction from a phone is quick and confident, with no repeated setup burden.
- Users can answer: where did my money go, what changed, how much fund/goal progress, what caused a major change, what's a reasonable next step.
- Users keep returning across financial cycles and after difficult months (not necessarily daily — usage tied to real financial events and reviews is the meaningful signal, not raw DAU).
- At least some users voluntarily recommend it.

## 12. Early Warning Signs

1. Users keep a parallel spreadsheet because they don't trust the app.
2. Repeated confusion about why balances or totals differ from expectations.
3. Users default everything into generic income/expense because the model is confusing.
4. Onboarding abandoned before a first useful transaction.
5. Frequent need for manual/support intervention to fix data.
6. Users avoid the app after overspending or missing a goal.
7. Gamification becomes more visible than the actual financial information.
8. Badge/streak chasing without any gain in financial understanding.
9. New features keep shipping while representation/reporting problems remain unresolved.
10. The app starts feeling like "another spreadsheet I have to configure."

**Most serious signal:** *users do not trust the numbers* — if this happens, no new feature, education, or gamification work should be prioritized until it's fixed.

**Second most serious signal:** *users feel judged or discouraged* — a direct violation of the emotional north star, regardless of calculation accuracy.

## 13. Product Principles

- Trust first — no feature outranks correctly representing what happened and correctly calculating its effect.
- **Financial events before categories.** Model what happened financially before deciding how it should be categorized or displayed.
- **Explain every important number.** Important balances, totals, and insights should be traceable to understandable financial records.
- Simple by default, flexible when needed.
- Clarity without shame.
- Make progress visible, not fragile.
- Help users notice before giving them something to pursue.
- Multi-user platform with single-owner private workspace in v1.
- Household collaboration is future scope.
- Learning Mode is future scope.
- Teachers never receive access to students' real personal financial data.

## 14. What Annotasi Finance Is Not

- Not a generic tracker that forces real events (transfers, debt repayment, fund allocations) into an ambiguous model.
- v1 is not a regulated financial service.
- v1 is not banking software.
- v1 does not hold or transfer user funds.
- v1 is not an investment or trading platform.
- v1 begins as a limited private beta rather than a large-scale SaaS launch.
- Not a competitive, streak-driven, or leaderboard-based gamified app.
- Not a household-collaboration tool in v1 (no shared editing, invitations, or roles yet).
- Not a classroom tool with any access to a student's real financial data.
- Not a blank-canvas system that requires users to design their own structure before they can use it.
- Not a product that judges users by wealth, balance, or mistakes.

**Future business models remain undecided.** These are v1 boundaries, not permanent limits on what Annotasi Finance could become.

## 15. Open Assumptions Requiring Validation

- The differentiation hypothesis (flexibility + transparency without spreadsheet-building) has not been tested against existing finance apps or real user behavior.
- Whether the proposed default categories and event types actually fit most beta users' real financial lives, or whether they'll need adjustment — exact selection is deferred to PRD.
- Whether a non-calendar, salary-cycle-based reporting period is a need shared by other users or specific to the founder.
- Whether the "gentle milestone" mechanics will actually feel non-pressuring in practice, or whether even optional mechanics risk feeling obligatory.
- Whether the Learning Mode / simulation hypothesis is actually what teachers and students would want, versus assumptions made without direct input from that audience.
- Whether "many independent users, each with a private workspace" will hold up once early users (e.g., couples) ask for shared visibility sooner than expected.
- Whether progressive/optional customization is discoverable enough for beginners without either overwhelming them or hiding needed flexibility.
- What future business model(s), if any, Annotasi Finance should pursue beyond the private beta — currently undecided.
