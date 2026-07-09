---
name: authoring-playwright-test
description: Write, edit, or review/audit end-to-end Playwright tests for the Awesome Pizza app against project standards — conventions for locators, soft assertions, POM + fixtures, the @Step decorator, tags, test data, and file placement. Use when adding, changing, or checking any test under playwright/.
---

# Authoring & reviewing a Playwright test (Awesome Pizza)

The canonical guides are the single source of truth — read them for full detail, and
update rules there, not here:

- `playwright/PLAYWRIGHT_BEST_PRACTICES.md` — how to write the tests.
- `playwright/TEST_STRATEGY.md` — what to test and when (scope, TC-01..TC-11,
  smoke = daily / regression = weekly).

The checklist below is the standard. Use it both ways:
- **Authoring/editing** — follow each item as you write.
- **Reviewing/auditing existing tests** — treat each item as a pass/fail rule. See
  "Reviewing existing tests" at the end for how to report findings.

## Locators
- Prefer `getByRole` / `getByLabel` / `getByText` / `getByTestId`.
- Do **not** use CSS class/ID selectors or XPath. If the app lacks a stable hook, add a
  `data-testid` to the app rather than reaching for a brittle selector.

## Assertions
- Always use **soft** assertions for verifications: `await expect.soft(...)`, so one run
  surfaces every UI issue instead of stopping at the first failure.
- Use web-first matchers and always `await` them. Never use un-awaited `isVisible()`.

## Page Object Model + fixtures
- Keep locators and user actions in page objects under `src/pages` (e.g. `homePage.ts`).
  Test files call POM methods only — no inline selectors in tests.
- The fixture (`src/fixtures/pizza.ts`) only **constructs** the page object.
- Do navigation + state reset in a `beforeEach` inside each `describe`, not the fixture.
  Call `open()` (navigate to `/`) before `resetState()` (clear localStorage, reload) so
  storage is cleared on the app origin.

## The @Step decorator (readable HTML reports)
- Decorate **every public async page-object method** — actions and assertions alike:
  ```ts
  import { Step } from '@utils/step';
  @Step() async addPizza(name: string) { ... }
  ```
- Default title is `ClassName.methodName`; pass a string to override: `@Step('Place order')`.
- Always call with parentheses — `@Step` (no parens) will not work; it's a factory.
- Don't add manual `test.step()` inside a decorated method; the decorator wraps the body.
- These are TC39 standard decorators — keep `experimentalDecorators` **off** in tsconfig.

## Isolation
- Each test independent and repeatable; no shared state between tests.
- No fixed `waitForTimeout` sleeps — rely on Playwright's auto-waiting.

## Test data
- Keep data out of test logic in `test-data/smoke` and `test-data/regression`.
- Import via the `@data` alias, e.g. `import data from '@data/smoke/smoke-data.json'`.

## Structure, tags, and suites
- Smoke tests under `tests/smoke-tests`; regression under `tests/regression-tests`.
- Split into separate files by feature for readability.
- Tag describe blocks with `@smoke` or `@regression`.
- Run suites via `npm run test:smoke` / `npm run test:regression`.

## Path aliases
`@pages`, `@fixtures`, `@data`, `@utils` are defined in `tsconfig.json` (relative `./`
targets, no `baseUrl`). Use them instead of long relative paths.

## Reviewing existing tests
When auditing tests already in the repo (rather than writing new ones), walk each file
under `tests/` and its page objects under `src/pages/` against the checklist above and
report violations. Common things to flag:
- CSS/XPath selectors or `page.locator('.class')` instead of role/label/text/testid.
- Hard (`expect(...)`) assertions where verifications should be `expect.soft(...)`, or
  un-awaited `isVisible()` / missing `await` on matchers.
- Inline selectors in test files instead of POM methods; logic leaking out of `src/pages`.
- `waitForTimeout` / fixed sleeps; state reset or navigation done outside `beforeEach`.
- Public async POM methods missing `@Step()`, or `@Step` written without parentheses.
- Hard-coded test data instead of imports from `test-data/**` via the `@data` alias.
- Wrong location or missing `@smoke` / `@regression` tag; long relative paths instead of
  `@pages` / `@fixtures` / `@data` / `@utils`.

Report each finding as `file:line` → the rule broken → the fix. Don't change code unless
asked; if asked to fix, apply the fixes and then run the quality gate.

## When done
Run the quality gate before finishing — see the **format-check** skill
(`npm run check` from `playwright/`, then fix and re-run until green).
