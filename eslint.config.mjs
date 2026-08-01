import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

const webFiles = [
  "apps/web/**/*.{ts,tsx}",
  "tests/architecture/fixtures/apps/web/**/*.{ts,tsx}",
];

const apiProductionFiles = [
  "apps/api/src/**/*.{ts,tsx}",
  "tests/architecture/fixtures/apps/api/src/**/*.{ts,tsx}",
];

const domainFiles = [
  "packages/domain/**/*.{ts,tsx}",
  "tests/architecture/fixtures/packages/domain/**/*.{ts,tsx}",
];

const contractFiles = [
  "packages/contracts/src/**/*.{ts,tsx}",
  "tests/architecture/fixtures/packages/contracts/**/*.{ts,tsx}",
];

export default tseslint.config(
  {
    ignores: [
      "**/.next/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/dist/**",
      "**/node_modules/**",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    files: webFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@annotasi/domain",
                "@annotasi/domain/*",
                "@annotasi/api",
                "@annotasi/api/*",
                "@annotasi/test-support",
                "@annotasi/test-support/*",
                "**/packages/domain/**",
                "**/packages/test-support/**",
                "**/apps/api/**",
              ],
              message:
                "The web application may not import the authoritative domain package, API internals, or test support.",
            },
          ],
        },
      ],
    },
  },
  {
    files: apiProductionFiles,
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@annotasi/test-support",
                "@annotasi/test-support/*",
                "**/packages/test-support/**",
              ],
              message:
                "Production application code may not depend on test-support.",
            },
          ],
        },
      ],
    },
  },
  {
    files: domainFiles,
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@nestjs/*",
                "next",
                "next/*",
                "react",
                "react/*",
                "drizzle-orm",
                "drizzle-orm/*",
                "drizzle-kit",
                "fastify",
                "fastify/*",
                "@fastify/*",
                "axios",
                "@clerk/*",
                "@sentry/*",
                "@annotasi/contracts",
                "@annotasi/config",
                "@annotasi/test-support",
                "**/apps/**",
              ],
              message:
                "The domain package must remain independent of frameworks, transport, persistence, providers, applications, and test support.",
            },
          ],
        },
      ],
    },
  },
  {
    files: contractFiles,
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@annotasi/domain",
                "@annotasi/domain/*",
                "**/packages/domain/**",
              ],
              message:
                "Transport contracts may not import authoritative domain logic.",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "BinaryExpression[operator='+'], BinaryExpression[operator='-'], BinaryExpression[operator='*'], BinaryExpression[operator='/'], BinaryExpression[operator='%'], BinaryExpression[operator='**'], AssignmentExpression[operator='+='], AssignmentExpression[operator='-='], AssignmentExpression[operator='*='], AssignmentExpression[operator='/='], UpdateExpression",
          message:
            "Transport contracts define shapes only and may not implement calculation logic.",
        },
      ],
    },
  },
);
