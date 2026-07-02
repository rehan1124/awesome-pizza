// Flat ESLint config (ESLint 10). Enforces the conventions written in
// PLAYWRIGHT_BEST_PRACTICES.md so they are checked mechanically, not just by review.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        // Never linted: dependencies, reports, and test artifacts.
        ignores: [
            'node_modules/**',
            'playwright-report/**',
            'blob-report/**',
            'all-blob-reports/**',
            'test-results/**',
            'eslint.config.mjs',
        ],
    },

    // Base JavaScript + type-aware TypeScript rules for all source files.
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },

    // Playwright-specific rules for specs and page objects.
    {
        ...playwright.configs['flat/recommended'],
        files: ['tests/**/*.ts', 'src/**/*.ts'],
        rules: {
            ...playwright.configs['flat/recommended'].rules,
            // Assertions live in Page Object methods named expectX (expectLoaded,
            // expectCartCount, ...). Treat any call ending in `.expect*` as an
            // assertion so the rule still flags genuinely assertion-less tests.
            'playwright/expect-expect': ['warn', { assertFunctionPatterns: ['^expect'] }],
        },
    },

    // Must be last: turn off stylistic rules that Prettier owns.
    prettier,
);
