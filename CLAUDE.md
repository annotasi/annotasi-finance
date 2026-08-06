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
- Preserve mobile-first responsive design as a product requirement; the frontend framework and canonical component foundation are already selected and implemented (Section 7) — do not reinitialize them or introduce a competing one.

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

- The repository is an implemented pnpm/Turborepo monorepo: `apps/web` (Next.js), `apps/api` (NestJS/Fastify), `packages/domain`, `packages/contracts`, `packages/config`, `packages/test-support`, and `database/` (PostgreSQL/Drizzle with forced Row-Level Security).
- Managed identity and application sessions, Private Beta onboarding and Workspace isolation, and the Account Management Baseline (create, list, rename, archive, restore, delete-eligibility evaluation) are implemented and merged into `dev`.
- Five implementation slices are complete: `SLICE-FOUND-001`, `SLICE-FOUND-002`, `SLICE-IAM-001`, `SLICE-IAM-002`, `SLICE-ACC-001`.
- `SLICE-UI-001` (Product UI Foundation & Existing Screen Retrofit) is the next approved implementation slice and has not started. No later slice is authorized by this file.
- `docs/project/PROJECT_STATE.md` is the current navigation snapshot and must be read every session; this section is a stable summary, not a substitute for it.

## 7. Frontend Policy

- End-user UI and microcopy are Bahasa Indonesia; internal code, identifiers, and documentation remain English.
- Mobile-first is mandatory — every core flow must be fully usable on a phone.
- shadcn/ui with the existing Base UI primitive baseline (`apps/web/components.json`, style `base-nova`) is canonical. Do not reinitialize shadcn and do not introduce a competing primitive library (Radix UI, React Aria, Material UI, Chakra UI, Ant Design, or similar).
- Design tokens (`apps/web/app/styles.css` CSS variables) precede page-specific styling; pages must not accumulate unrelated one-off component styles.
- UI/UX Pro Max is advisory only (design reasoning, exploration, review) — never a production runtime dependency, and its recommendations never override product identity, domain behavior, accessibility, Indonesian language, architecture, or the canonical component system.
- 21st.dev is a selective pattern/component accelerator, not the design system — any adapted component must be normalized to local tokens and `components/ui` primitives and reviewed for provenance, license, dependencies, and accessibility before use.
- Motion is optional and purposeful — used only where it improves understanding, never for decoration or to delay access to financial information; CSS transitions remain the default; `prefers-reduced-motion` must always be respected.
- No arbitrary mixing of primitive libraries or design systems within one screen.
- No copy-pasted external component is accepted without provenance, dependency, accessibility, responsiveness, and security review.
- No authoritative financial rule or calculation is implemented in the browser; server-confirmed outcomes remain authoritative.
- Loading, empty, error, success, disabled (with a stated reason), and pending states are required wherever a screen can be in one of those states.
- Reduced motion and visible keyboard focus are required, not optional polish.
- Dependencies, repository skills, external registry integrations, MCP integrations, and imported external components must not be added without explicit approval. UI/UX Pro Max, 21st.dev, and Motion must each be handled according to their distinct governance role in `docs/implementation/UI_FOUNDATION_REGISTER.md` — 21st.dev in particular is a component/pattern registry, not necessarily an installed package or skill.
- Implementing agents must inspect existing components and screens before generating replacements — do not rewrite a working screen solely to use a fashionable component.
- `docs/implementation/UI_FOUNDATION_REGISTER.md` governs `SLICE-UI-001` implementation detail; it carries no product or domain authority.
