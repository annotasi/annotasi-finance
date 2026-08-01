# SLICE-FOUND-001 Dependency Verification Register

Verified on 2026-08-01 before package initialization. All pins are exact. npm
links below are the package maintainers' registry metadata; project links are
the official maintainers' documentation or release records.

## Runtime and Package Manager

| Selection |                              Pin | Official evidence and compatibility                                                                                                                                | Verification     | Alternative decision                                                                        |
| --------- | -------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ------------------------------------------------------------------------------------------- |
| Node.js   | 24.x; validation release 24.18.0 | [Node releases](https://nodejs.org/en/about/previous-releases) identifies v24 as LTS and 24.18.0 as the latest v24 release. Every selected engine accepts Node 24. | `node --version` | Node 26 is Current, not LTS; Node 22 is older LTS and is not the selected baseline.         |
| pnpm      |                          11.19.0 | [pnpm registry metadata](https://www.npmjs.com/package/pnpm) requires Node >=22.13; Node 24 satisfies it.                                                          | `pnpm --version` | This is the newest verified stable 11.x release; no prerelease or newer major was selected. |

## Root Direct Development Dependencies

| Package             |     Pin | Official evidence and compatibility                                                                                                                                                        | Verification / advisory note                                                                                                                                                                             |
| ------------------- | ------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@eslint/js`        |  10.0.1 | [Official ESLint package metadata](https://www.npmjs.com/package/@eslint/js); paired with ESLint 10 flat configuration.                                                                    | `pnpm ls @eslint/js --depth 0`                                                                                                                                                                           |
| `@types/node`       | 24.13.3 | [Official DefinitelyTyped registry metadata](https://www.npmjs.com/package/@types/node); matches the Node 24 baseline and Vitest's `>=24` peer range.                                      | `pnpm ls @types/node --depth 0`                                                                                                                                                                          |
| `eslint`            |  10.8.0 | [ESLint v10 migration guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0) supports Node 24 and newer.                                                                             | `pnpm exec eslint --version`                                                                                                                                                                             |
| `globals`           |  17.8.0 | [Package metadata](https://www.npmjs.com/package/globals) supports Node >=18 and supplies explicit Node/browser global sets to ESLint.                                                     | `pnpm ls globals --depth 0`                                                                                                                                                                              |
| `prettier`          |   3.9.6 | [Prettier package metadata](https://www.npmjs.com/package/prettier) supports Node >=14.                                                                                                    | `pnpm exec prettier --version`                                                                                                                                                                           |
| `turbo`             |  2.10.8 | [Turborepo package metadata](https://www.npmjs.com/package/turbo); newest verified stable 2.10.x patch selected by the implementation baseline.                                            | `pnpm exec turbo --version`                                                                                                                                                                              |
| `typescript`        |   6.0.3 | [TypeScript package metadata](https://www.npmjs.com/package/typescript) and Microsoft's [TypeScript 6 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/). | `pnpm exec tsc --version`; [TypeScript 7 is released](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) but remains unselected until all compiler-API-dependent tooling is verified. |
| `typescript-eslint` |  8.65.0 | [typescript-eslint package metadata](https://www.npmjs.com/package/typescript-eslint) explicitly accepts ESLint 10 and TypeScript `>=4.8.4 <6.1.0`; 6.0.3 is inside that range.            | `pnpm ls typescript-eslint --depth 0`                                                                                                                                                                    |
| `vitest`            |  4.1.10 | [Vitest package metadata](https://www.npmjs.com/package/vitest) accepts Node 24 and `@types/node >=24`.                                                                                    | `pnpm exec vitest --version`                                                                                                                                                                             |

These are the newest verified stable releases inside the selected major/minor
baselines. No canary, beta, RC, nightly, or experimental version is used.

## Web Direct Dependencies

| Package            |     Pin | Official evidence and compatibility                                                                                                                                     | Verification / alternative decision                                                                  |
| ------------------ | ------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `next`             | 16.2.12 | [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16) requires Node >=20.9 and TypeScript >=5.1; its package peer range accepts React 19. | `pnpm --filter @annotasi/web exec next --version`; Next 15 is superseded and no canary was selected. |
| `react`            |  19.2.8 | [React package metadata](https://www.npmjs.com/package/react); selected with the exact React DOM peer.                                                                  | `pnpm --filter @annotasi/web ls react --depth 0`                                                     |
| `react-dom`        |  19.2.8 | [React DOM package metadata](https://www.npmjs.com/package/react-dom) requires React `^19.2.8`.                                                                         | `pnpm --filter @annotasi/web ls react-dom --depth 0`                                                 |
| `@types/react`     | 19.2.18 | [DefinitelyTyped registry metadata](https://www.npmjs.com/package/@types/react); matches React 19.                                                                      | `pnpm --filter @annotasi/web ls @types/react --depth 0`                                              |
| `@types/react-dom` |  19.2.4 | [DefinitelyTyped registry metadata](https://www.npmjs.com/package/@types/react-dom); matches React DOM 19.                                                              | `pnpm --filter @annotasi/web ls @types/react-dom --depth 0`                                          |

A clean-CI typecheck exposed that a development-generated and tracked
`next-env.d.ts` referenced `.next/dev/types/routes.d.ts`, which is absent in a
fresh checkout. The official [Next.js CLI reference](https://nextjs.org/docs/app/api-reference/cli/next#next-typegen-options)
defines `next typegen` as the CI-safe command for generating route types without
a full build, and the official [TypeScript configuration reference](https://nextjs.org/docs/app/api-reference/config/typescript#next-envdts)
identifies `next-env.d.ts` as generated and recommends ignoring it. The web
typecheck now generates these files before `tsc`; `next-env.d.ts` is ignored and
not tracked. No dependency or Architecture baseline changed.

## API Direct Dependencies

| Package                    |     Pin | Official evidence and compatibility                                                                                                                                                                                    | Verification / advisory note                                                                                    |
| -------------------------- | ------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `@nestjs/common`           | 11.1.28 | [Nest package metadata](https://www.npmjs.com/package/@nestjs/common) accepts `reflect-metadata` 0.2 and RxJS 7.                                                                                                       | `pnpm --filter @annotasi/api ls @nestjs/common --depth 0`                                                       |
| `@nestjs/core`             | 11.1.28 | [Nest core metadata](https://www.npmjs.com/package/@nestjs/core) requires Node >=20 and the same common/reflect/RxJS line.                                                                                             | `pnpm --filter @annotasi/api ls @nestjs/core --depth 0`                                                         |
| `@nestjs/platform-fastify` | 11.1.28 | [Adapter metadata](https://www.npmjs.com/package/@nestjs/platform-fastify) resolves Fastify 5.10.0. [CVE-2026-54281](https://nvd.nist.gov/vuln/detail/CVE-2026-54281) is fixed in 11.1.24; 11.1.28 is above the floor. | `pnpm --filter @annotasi/api ls @nestjs/platform-fastify fastify`; risky normalization options remain disabled. |
| `reflect-metadata`         |   0.2.2 | [Package metadata](https://www.npmjs.com/package/reflect-metadata); inside Nest's `^0.2.0` peer range.                                                                                                                 | `pnpm --filter @annotasi/api ls reflect-metadata --depth 0`                                                     |
| `rxjs`                     |   7.8.2 | [Package metadata](https://www.npmjs.com/package/rxjs); inside Nest's `^7.1.0` peer range.                                                                                                                             | `pnpm --filter @annotasi/api ls rxjs --depth 0`                                                                 |
| `@nestjs/testing`          | 11.1.28 | [Testing package metadata](https://www.npmjs.com/package/@nestjs/testing); exact-match Nest 11 test harness.                                                                                                           | `pnpm --filter @annotasi/api ls @nestjs/testing --depth 0`                                                      |

`@annotasi/config` and `@annotasi/contracts` are direct internal `workspace:*`
dependencies of the API. They are local packages, not external selections.
Nest CLI and schematics are intentionally absent: the shell builds with the
selected TypeScript compiler directly, avoiding an unnecessary compiler-API
tool in this slice.

## Shared Package Direct Dependencies

| Package |   Pin | Used by                                   | Official evidence and compatibility                                                                                          | Verification                                                                                               |
| ------- | ----: | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `zod`   | 4.4.3 | `@annotasi/contracts`, `@annotasi/config` | [Zod package metadata](https://www.npmjs.com/package/zod); current verified stable 4.x patch with no runtime-framework peer. | `pnpm --filter @annotasi/contracts ls zod --depth 0` and `pnpm --filter @annotasi/config ls zod --depth 0` |

`@annotasi/domain` and `@annotasi/test-support` have no direct external runtime
dependency. The latter is blocked from production app imports.

## GitHub Actions Verification

| Action               | Selected major | Official evidence                                                                                                                            | Selection and behavior                                                                                                                                            |
| -------------------- | -------------: | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `actions/checkout`   |           `v7` | [Official v7.0.0 release](https://github.com/actions/checkout/releases/tag/v7.0.0) and [repository](https://github.com/actions/checkout)     | The current official major is selected for repository checkout. The workflow retains least-privilege `contents: read` permissions.                                |
| `pnpm/action-setup`  |           `v6` | [Official v6.0.8 release](https://github.com/pnpm/action-setup/releases/tag/v6.0.8) and [repository](https://github.com/pnpm/action-setup)   | The current stable major is selected. With no `version` input, it reads `pnpm@11.19.0` from the root `packageManager` field.                                      |
| `actions/setup-node` |           `v7` | [Official v7.0.0 release](https://github.com/actions/setup-node/releases/tag/v7.0.0) and [repository](https://github.com/actions/setup-node) | The current official major is selected. The workflow explicitly installs Node.js 24.18.0 and caches the pnpm store using `pnpm-lock.yaml` as the dependency path. |

These selections update CI execution dependencies only. They do not change an
application dependency pin, introduce provider authentication, or add a
deployment step.

## Architecture-Boundary Selection

The selected boundary mechanism is ESLint 10 flat configuration using
`no-restricted-imports` plus a contracts-only calculation-syntax fence. It was
chosen over a boundaries plugin and dependency-cruiser because ESLint is
already required, supports the selected Node/TypeScript versions, and can
validate both the normal repository and out-of-source deliberate violations
without adding overlapping graph tooling. Run `pnpm boundaries`; success means
the production tree passes and every deliberate fixture is rejected.

## Lockfile and Security Verification

The initial lockfile audit exposed high-severity advisories in three transitive
packages even though the direct framework pins were current. The root manifest
therefore applies these narrow security overrides:

| Transitive package | Patched pin | Reason and compatibility evidence                                                                                                                                                                                                                                          |
| ------------------ | ----------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `find-my-way`      |       9.7.0 | Fixes [GHSA-c96f-x56v-gq3h](https://github.com/advisories/GHSA-c96f-x56v-gq3h). Fastify 5.10.0 declares `^9.6.0`; 9.7.0 remains inside that range. Nest's adapter also pins 9.6.0 directly, so the real adapter initialization/injection smoke test verifies the override. |
| `postcss`          |      8.5.25 | Exceeds the 8.5.18 patched floor for [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849). The Next production build verifies compatibility.                                                                                                           |
| `sharp`            |      0.35.3 | Exceeds the 0.35.0 patched floor for [GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj). Node 24 satisfies Sharp's Node >=20.9 engine; the Next production build verifies this newer line for the foundation shell.                                  |

These are lock-resolution safety corrections, not additional application
dependencies. Remove an override only after a selected direct framework release
resolves an equally patched or newer version and the full foundation suite
passes.

After `pnpm-lock.yaml` is generated, verify the selected graph with:

```bash
pnpm install --frozen-lockfile
pnpm list --depth 0 -r
pnpm audit --audit-level high
```

The audit is local review evidence rather than a required network-dependent CI
step. A new advisory, a peer-range conflict, or a lockfile resolution below the
Nest Fastify security floor blocks review until explicitly resolved.
