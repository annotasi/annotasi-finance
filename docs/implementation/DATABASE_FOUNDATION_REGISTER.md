# SLICE-FOUND-002 Database Foundation Evidence Register

Verified on 2026-08-01 for Session 26. This register records implementation
evidence for the technical foundation probe only. It does not define product or
domain tables, production-provider configuration, or a later implementation
slice.

## Selected Baseline

| Selection                    |                   Exact pin | Official evidence                                                                                                                                        | Decision                                                                                                                                                                                 |
| ---------------------------- | --------------------------: | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PostgreSQL                   |                       17.10 | [PostgreSQL versioning policy](https://www.postgresql.org/support/versioning/) and [17.10 release notes](https://www.postgresql.org/docs/release/17.10/) | PostgreSQL 17 remains supported through 2029 and is the reviewed implementation baseline. PostgreSQL 18 is not adopted merely because it is newer; PostgreSQL 19 is beta and prohibited. |
| Docker image                 | `postgres:17.10-alpine3.24` | [Docker Official Image](https://hub.docker.com/_/postgres) and [exact tag](https://hub.docker.com/_/postgres/tags?name=17.10-alpine3.24)                 | One exact tag is shared by Compose, Testcontainers, and migration verification. Docker publishes amd64 and arm64 variants.                                                               |
| Drizzle ORM                  |                      0.45.2 | [npm registry](https://www.npmjs.com/package/drizzle-orm) and [official release](https://github.com/drizzle-team/drizzle-orm/releases/tag/0.45.2)        | Latest stable 0.x line; the 1.0 RC line is not selected.                                                                                                                                 |
| Drizzle Kit                  |                     0.31.10 | [npm registry](https://www.npmjs.com/package/drizzle-kit) and [migration docs](https://orm.drizzle.team/docs/drizzle-kit-migrate)                        | Generates reviewable SQL and maintains a deterministic migration journal; `push` is not used.                                                                                            |
| `pg`                         |                      8.22.0 | [npm registry](https://www.npmjs.com/package/pg) and [Drizzle PostgreSQL driver guide](https://orm.drizzle.team/docs/get-started-postgresql)             | Selected over `postgres.js` for explicit checked-out clients, transactions, rollback, pooling, and direct Drizzle support. No second driver exists.                                      |
| `@types/pg`                  |                      8.20.3 | [npm registry](https://www.npmjs.com/package/@types/pg)                                                                                                  | Current stable compatible declarations.                                                                                                                                                  |
| `testcontainers`             |                      12.0.4 | [npm registry](https://www.npmjs.com/package/testcontainers) and [supported runtimes](https://node.testcontainers.org/supported-container-runtimes/)     | Real disposable PostgreSQL; no mock, SQLite, shared database, skip, or fallback.                                                                                                         |
| `@testcontainers/postgresql` |                      12.0.4 | [npm registry](https://www.npmjs.com/package/@testcontainers/postgresql)                                                                                 | PostgreSQL-specific lifecycle harness using the exact selected image.                                                                                                                    |

The selected packages were verified with Node.js 24.18.0, TypeScript 6.0.3,
Vitest 4.1.10, and pnpm 11.19.0. Drizzle 0.45.2's published declarations still
include optional-dialect declaration references that fail full library checking
under the repository's TypeScript 6 strict options. The private database
workspace therefore sets `skipLibCheck` only for third-party declaration files;
all project TypeScript remains strict. This follows the workaround recorded in
the Drizzle maintainers' [declaration issue](https://github.com/drizzle-team/drizzle-orm/issues/879)
and does not switch to a prerelease or weaken domain/application checking.

## Image Identity and Advisory Review

- Pulled image: `docker.io/library/postgres:17.10-alpine3.24`.
- Resolved manifest identity on the validated arm64 runtime:
  `sha256:742f40ea20b9ff2ff31db5458d127452988a2164df9e17441e191f3b72252193`.
- Validated local platform: Linux/arm64; the Docker Official Image also publishes
  linux/amd64 and other documented architectures.
- PostgreSQL 17.10 fixes the May 2026 security issues affecting earlier 17.x
  minors, including CVE-2026-6473, CVE-2026-6478, CVE-2026-6479, and
  CVE-2026-6638. The selected minor is not in the affected-before ranges.
- Drizzle 0.45.2 includes the maintainers' escaping fix for the reported
  `sql.identifier()` / `sql.as()` injection issue.
- GitHub's reviewed npm advisory searches returned no package-specific result
  for the selected `pg` or Drizzle packages at verification time. The final
  lockfile audit reports zero high or critical findings. It reports one
  moderate development-only finding, GHSA-67mh-4wv8-2f99, in Drizzle Kit's
  transitive `@esbuild-kit/core-utils > esbuild@0.18.20`. The advisory concerns
  an exposed esbuild development server; this slice uses the dependency only as
  a local Drizzle configuration loader and starts no esbuild server. The finding
  is assessed, not hidden, and remains a reconsideration trigger for a compatible
  stable Drizzle Kit update.

## Repository and Dependency Boundary

`database/` is a private root workspace with no exports or public product API.
It contains only:

- `schema/` — the foundation probe Drizzle schema;
- `migrations/` — committed SQL and Drizzle journal/snapshot metadata;
- `scripts/` — role bootstrap, deterministic migrator, and read-only local
  verification;
- `test/` — real-PostgreSQL Testcontainers evidence.

No `packages/database`, seed directory, product repository interface, NestJS
wrapper, or API runtime database wiring exists. Architecture checks prohibit
the web, domain, contracts, and API production code from importing database or
migration internals.

The pnpm build-script policy allows `esbuild`, required by the selected Drizzle
Kit/Vite toolchain, and continues to allow the previously reviewed `sharp`
build. Optional `cpu-features`, `ssh2`, and `protobufjs` build hooks are
explicitly denied because this slice uses neither SSH containers nor their
native accelerators/code generation. No interactive or blanket build approval
is used.

## Role Model

| Role                    | Purpose                                  | Required properties                                                                                |
| ----------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Container administrator | Bootstrap roles and database grants only | Container-local owner/superuser; never used to certify RLS behavior                                |
| `annotasi_migration`    | Apply reviewed migration history         | LOGIN, non-superuser, no `BYPASSRLS`, owns migration-managed objects, distinct from runtime        |
| `annotasi_application`  | Exercise ordinary scoped DML             | LOGIN, non-superuser, no `BYPASSRLS`, non-owner, no database/schema creation, probe-table DML only |

The local environment uses distinct `DATABASE_ADMIN_URL`,
`DATABASE_MIGRATION_URL`, and `DATABASE_APPLICATION_URL` placeholders. Tests
generate isolated passwords. No credential or complete connection URL is
logged.

## Migration Strategy

- Drizzle schema generates visible SQL; reviewed SQL is committed.
- The only migration creates `foundation_workspace_scope_probe`, its Workspace
  index, comment, RLS settings, policy, and minimal application-role grants.
- Manually reviewed SQL after the generated table/index statements enables and
  forces RLS, applies grants, and defines the policy.
- `drizzle-orm`'s migrator reads the committed history and records successful
  application in `drizzle.__drizzle_migrations`.
- A migration file executes once; the migration command is repeatable and a
  tracked no-op afterward; a second empty database can replay the full history.
- There is no `drizzle-kit push`, entrypoint-init migration, application-startup
  synchronization, hidden auto-migration, or destructive migration.

Commands: `pnpm db:migrate`, `pnpm db:verify`, `pnpm db:check`, and
`pnpm db:test`.

## RLS and Exact Representation

The probe policy applies only to `annotasi_application` and uses both `USING`
and `WITH CHECK`. It compares `workspace_id` with the transaction-local
`app.workspace_id` setting established through `set_config(..., true)`.
Missing or empty context yields no visible row and rejects writes; foreign
Workspace context cannot read or insert another Workspace's row. Tests prove
the context disappears after commit and does not leak when a pooled connection
is reused.

The probe's `exact_integer_value` is PostgreSQL `BIGINT`. The integration suite
round-trips `9007199254740993`, which is above JavaScript's safe-integer range,
as an exact decimal string through `pg`. No global BIGINT-to-number parser,
JSON money serialization, product table, or financial formula is introduced.

## CI and Validation Evidence

The existing `Eight foundation checks` job remains unchanged. A separate
`Database foundation checks` job performs frozen installation and
`pnpm ci:database` on GitHub-hosted Ubuntu Docker, without a PostgreSQL service,
provider account, deployment, or production secret.

Focused local evidence completed during implementation:

- empty-database migration: pass;
- repeated migration command tracked no-op: pass;
- second fresh database replay: pass;
- role privilege and non-ownership assertions: pass;
- no-context and cross-Workspace RLS denial: pass;
- Workspace A / Workspace B isolation: pass;
- transaction-local context cleanup on connection reuse: pass;
- exact BIGINT round-trip: pass;
- Testcontainers cleanup: pass.

The complete FOUND-001, aggregate CI, Compose smoke, audit, and Git results are
recorded in the Session 26 review report rather than treated as a product or
domain source here.

## Explicit Exclusions

No real User, Workspace, Account, Category, Dedicated Fund, Debt Record,
Financial Event, session, entitlement, audit, or projection table exists. No
financial behavior, API business route, authentication, Clerk, opaque session,
beta entitlement, provider account/configuration, deployment, backup/PITR,
queue, worker, shadcn/ui, frontend redesign, `SLICE-IAM-001`, or later slice is
implemented.

## Reconsideration Triggers

Re-review this baseline if PostgreSQL 17 approaches end of support; the exact
image is withdrawn or gains an unmitigated advisory; a selected package gains
an unresolved high-severity advisory; Drizzle stable changes its migration or
driver behavior; TypeScript compatibility allows removal of the scoped
declaration workaround; Testcontainers no longer supports the CI/runtime Docker
API; or a later reviewed Architecture decision changes role, RLS, migration, or
exact-integer requirements.
