# Annotasi Finance

This repository contains the SLICE-FOUND-001 non-database technical foundation
and the SLICE-FOUND-002 local database foundation: a pnpm/Turborepo workspace,
strict TypeScript, framework shells, automated Architecture-boundary checks,
PostgreSQL migration/RLS evidence, smoke tests, and Foundation Gate CI.

No financial feature, product table, authentication, provider integration, or
deployment is implemented in these foundation slices.

## Prerequisites

- Node.js 24.x LTS (validated with 24.18.0)
- pnpm 11.19.0, pinned by the root `packageManager` field
- Docker-compatible runtime with Compose (validated with Docker 29.4.0 and
  Compose 5.1.2)

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
database/        private migration and real-PostgreSQL integration tooling
infra/local/     local-only PostgreSQL Compose configuration
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
pnpm db:check
pnpm db:test
pnpm run ci
```

`pnpm ci:foundation` runs the seven post-install FOUND-001 validation commands
in the same order as the existing eight-check CI job. `pnpm ci:database` runs
the Testcontainers-backed empty-database migration, migration replay/no-op,
RLS isolation, and exact BIGINT evidence. `pnpm run ci` runs the complete local
Foundation Gate. `pnpm format` is the explicit write-mode formatter; CI uses
only `format:check`. Use `pnpm run ci` for the aggregate package script because
pnpm reserves the shorter `pnpm ci` form as an install alias. Before TypeScript
validation, `pnpm typecheck` generates
the Next.js route types required by a clean checkout. The generated
`apps/web/next-env.d.ts` is intentionally not tracked.

## Local PostgreSQL

The local runtime uses the exact official image
`postgres:17.10-alpine3.24`. Its data lives in a named Docker volume and is
throwaway local data only. The committed environment example contains
non-production placeholders; never reuse them outside local development.

```bash
cp infra/local/.env.example infra/local/.env
pnpm db:up
pnpm db:migrate
pnpm db:verify
pnpm db:down
```

Useful database commands:

```bash
pnpm db:up       # start PostgreSQL and wait for health
pnpm db:down     # stop PostgreSQL while preserving its named volume
pnpm db:logs     # follow local PostgreSQL logs
pnpm db:migrate  # bootstrap local roles and apply reviewed SQL migrations
pnpm db:verify   # perform read-only version/migration/policy verification
pnpm db:check    # verify empty-DB migration, no-op, and fresh replay
pnpm db:test     # verify RLS roles/isolation/context and exact BIGINT behavior
pnpm db:reset    # stop PostgreSQL and delete the throwaway named volume
```

The container administrator is bootstrap-only. The separate
`annotasi_migration` role owns migration-managed objects, while the
`annotasi_application` role is a non-owner, non-superuser role without
`BYPASSRLS` or schema-creation privileges. Application RLS evidence always
connects as the application role. Migrations are explicit commands; application
startup never synchronizes or migrates the schema.

The only table is `foundation_workspace_scope_probe`, a temporary technical
probe for transaction-local Workspace RLS and exact BIGINT behavior. It is not
the product Workspace model or a financial table.

## Development

Run `pnpm dev` to start the web and API foundation shells together. The API
performs an initial TypeScript build before it starts. API live reload is not
part of SLICE-FOUND-001.

Local non-secret settings are documented in each application's `.env.example`
and `infra/local/.env.example`. Use those files as references when providing
process environment variables; real local environment files remain ignored.
