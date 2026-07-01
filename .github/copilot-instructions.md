# Copilot instructions for this repository

The end-to-end tests live in `playwright/`. The two files below are the **single source
of truth** — read them for full detail and update rules there, not here:

- **`playwright/PLAYWRIGHT_BEST_PRACTICES.md`** — how to write the tests.
- **`playwright/TEST_STRATEGY.md`** — what to test and when (scope, TC-01..TC-11,
  smoke = daily / regression = weekly).

## Key rules (follow when writing or editing e2e tests)
- **Locators:** prefer `getByRole` / `getByLabel` / `getByText` / `getByTestId`. Do not use
  CSS class/ID selectors or XPath. If the app lacks a stable hook, add a `data-testid`.
- **Assertions:** always use **soft** assertions for verifications (`await expect.soft(...)`);
  use web-first matchers and always `await` them; never use un-awaited `isVisible()`.
- **Page Object Model:** keep locators and user actions in page objects under
  `src/pages`; test files call POM methods only — no inline selectors in tests.
- **Setup:** the fixture (`src/fixtures/pizza.ts`) only constructs the page object.
  Do navigation + state reset in a `beforeEach` inside each `describe`, calling
  `open()` before `resetState()`.
- **Isolation:** each test is independent and repeatable; no shared state between tests;
  no fixed `waitForTimeout` sleeps — rely on Playwright's auto-waiting.
- **Test data:** keep data in `test-data/smoke` and `test-data/regression`; import it via
  the `@data` alias (e.g. `import data from '@data/smoke/smoke-data.json'`).
- **Structure & tags:** smoke tests under `tests/smoke-tests`, regression under
  `tests/regression-tests`, split into separate files by feature; tag describe blocks with
  `@smoke` or `@regression`.
