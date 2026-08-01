import process from "node:process";

import { ESLint } from "eslint";

const eslint = new ESLint();
const formatter = await eslint.loadFormatter("stylish");

const productionResults = await eslint.lintFiles([
  "apps/**/*.{ts,tsx}",
  "packages/**/*.{ts,tsx}",
]);
const productionErrors = productionResults.filter(
  (result) => result.errorCount > 0,
);

if (productionErrors.length > 0) {
  process.stderr.write(await formatter.format(productionErrors));
  process.exitCode = 1;
} else {
  process.stdout.write("Production dependency boundaries: pass\n");
}

const fixtureExpectations = new Map([
  [
    "tests/architecture/fixtures/apps/web/src/imports-domain.ts",
    "no-restricted-imports",
  ],
  [
    "tests/architecture/fixtures/apps/web/src/imports-test-support.ts",
    "no-restricted-imports",
  ],
  [
    "tests/architecture/fixtures/apps/api/src/imports-test-support.ts",
    "no-restricted-imports",
  ],
  [
    "tests/architecture/fixtures/apps/web/src/imports-database.ts",
    "no-restricted-imports",
  ],
  [
    "tests/architecture/fixtures/apps/api/src/imports-migration-tooling.ts",
    "no-restricted-imports",
  ],
  [
    "tests/architecture/fixtures/packages/domain/src/imports-framework.ts",
    "no-restricted-imports",
  ],
  [
    "tests/architecture/fixtures/packages/domain/src/imports-postgres.ts",
    "no-restricted-imports",
  ],
  [
    "tests/architecture/fixtures/packages/contracts/src/imports-persistence.ts",
    "no-restricted-imports",
  ],
  [
    "tests/architecture/fixtures/packages/contracts/src/calculates-domain-state.ts",
    "no-restricted-syntax",
  ],
]);

const fixtureResults = await eslint.lintFiles([...fixtureExpectations.keys()]);
let missingExpectedFailure = false;

for (const result of fixtureResults) {
  const relativePath = result.filePath.slice(process.cwd().length + 1);
  const expectedRule = fixtureExpectations.get(relativePath);
  const rejectedByExpectedRule = result.messages.some(
    (message) => message.severity === 2 && message.ruleId === expectedRule,
  );

  if (!rejectedByExpectedRule) {
    missingExpectedFailure = true;
    process.stderr.write(
      `Boundary fixture was not rejected as expected: ${relativePath} (${expectedRule ?? "unknown rule"})\n`,
    );
  }
}

if (missingExpectedFailure) {
  process.exitCode = 1;
} else {
  process.stdout.write(
    `Deliberate boundary violations rejected: ${fixtureExpectations.size}\n`,
  );
}
