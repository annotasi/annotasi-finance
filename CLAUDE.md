# Annotasi Finance — AI Working Guide

This file defines how Claude and other AI coding agents must work inside the Annotasi Finance repository.

## 1. Read the Product Foundation First

`docs/product/PRODUCT_IDENTITY.md` is the **approved product foundation**. It must be read before any product planning, design, or implementation work. It distinguishes between **Confirmed**, **Hypothesis — requires validation**, **Future direction**, and **Excluded from v1** — treat that distinction as load-bearing, not decorative.

## 2. Mandatory Product Principles

- Trust first.
- Financial events before categories.
- Explain every important number.
- Simple by default, flexible when needed.
- Clarity without shame.
- Make progress visible, not fragile.
- Help users notice before giving them something to pursue.

## 3. Scope Boundaries

- The platform is multi-user.
- Each v1 workspace has one owner and is private.
- Household collaboration is future scope.
- Learning Mode is future scope.
- Teachers must never receive access to students' real personal financial data.
- v1 is not banking software.
- v1 does not hold or transfer user funds.
- v1 is not an investment or trading platform.

## 4. Operating Rules for AI Agents

- Read relevant repository documentation before proposing changes.
- Do not write code before the requirement and acceptance criteria are understood.
- Do not assume that future ideas belong in the MVP.
- Clearly distinguish confirmed decisions, hypotheses, future directions, and excluded scope.
- Do not introduce technologies unless the current task explicitly requires technology selection.
- Make the smallest change necessary for the current task.
- Do not create unrelated files.
- Do not install dependencies without explicit approval.
- Do not commit or push unless explicitly instructed.
- Do not modify approved documents silently.
- Explain assumptions and unresolved questions.
- Prefer verifiable calculations and traceable financial behavior.
- Never treat user-defined funds such as Qurban or Home Sweet Home as universal transaction types.
- Keep account, category, financial event, and dedicated fund/goal concepts distinct.
- Preserve mobile-first responsive design as a product requirement, but do not assume a frontend framework yet.

## 5. Workflow

```
Product identity
→ Product discovery
→ PRD
→ Domain model
→ Architecture
→ Milestones
→ Specifications and acceptance criteria
→ Implementation
→ Review
→ Testing
→ Release
```

Steps may be refined as the project evolves, but implementation must never bypass unresolved product or domain decisions.

## 6. Repository Status

- The repository currently contains product documentation only.
- No application framework has been selected or initialized yet.
- No production architecture has been approved yet.
- The next planned phase is PRD discovery and definition.
