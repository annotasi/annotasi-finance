# Annotasi Finance

This repository currently contains the SLICE-FOUND-001 technical foundation:
a pnpm/Turborepo workspace, strict TypeScript, framework shells, automated
Architecture-boundary checks, smoke tests, and non-database CI.

No financial feature, database, authentication, or provider integration is
implemented in this slice.

## Prerequisites

- Node.js 24.x LTS (validated with 24.18.0)
- pnpm 11.19.0, pinned by the root `packageManager` field

## Workspace

```text
apps/
  web/           Next.js technical-status shell
  api/           NestJS/Fastify readiness shell
packages/
  domain/        framework-independent boundary skeleton
  contracts/     transport-shape skeleton
  config/        validated non-secret foundation configuration
  test-support/  test-only utilities
```

## Commands

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm boundaries
pnpm build:web
pnpm build:api
```

`pnpm run ci` runs the seven post-install validation commands in the same order
as CI. `pnpm format` is the explicit write-mode formatter; CI uses only
`format:check`. Before TypeScript validation, `pnpm typecheck` generates the
Next.js route types required by a clean checkout. The generated
`apps/web/next-env.d.ts` is intentionally not tracked.

## Development

Run `pnpm dev` to start the web and API foundation shells together. The API
performs an initial TypeScript build before it starts. API live reload is not
part of SLICE-FOUND-001.

Local non-secret settings are documented in each application's `.env.example`.
Use those files as references when providing process environment variables;
real local environment files remain ignored.
