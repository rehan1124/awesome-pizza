# Playwright best practices for this project

These are the framework conventions for implementing the tests described in
[TEST_STRATEGY.md](./TEST_STRATEGY.md).

## Core principles
- Test what the user sees and does.
- Keep each test independent and repeatable.
- Prefer resilient selectors.
- Use Playwright's built-in waiting and assertions.

## Recommended locator strategy
- Prefer:
  - page.getByRole('button', { name: 'Place Order' })
  - page.getByLabel('Your Name')
  - page.getByText('Your cart is empty')
  - page.getByTestId('menu-item')
- Avoid:
  - page.locator('.class-name')
  - page.locator('//div[@id="x"]')

## Assertions
- Use web-first assertions:
  - await expect(page.getByText('Order placed successfully')).toBeVisible();
  - await expect(page.getByRole('button', { name: 'Place Order' })).toBeDisabled();
- Do not use manual checks like isVisible() without awaiting expect.
- Always use soft assertions for verifications so a single run surfaces every UI
  issue instead of stopping at the first failure:
  - await expect.soft(page.getByText('Order placed successfully')).toBeVisible();
  - await expect.soft(page.getByRole('button', { name: 'Place Order' })).toBeDisabled();

## Test structure
- Use the Page Object Model (POM): keep locators and user actions on a page object
  (see src/pages/homePage.ts).
- Provide the page object through a fixture (src/fixtures/pizza.ts); the fixture only
  constructs the POM.
- Handle per-test navigation and state reset in a beforeEach hook inside each describe
  block, not in the fixture.

## Readable reports: the @Step decorator
Wrap every public async page-object method with the `@Step()` decorator so the HTML
report reads as high-level intent (`ClassName.methodName`) with the low-level
`locator.click` / `expect` calls nested inside each method, instead of a flat list.

- Decorate every public async method on a page object — actions and assertions alike:
  - import { Step } from '@utils/step';
  - @Step() async addPizza(name: string) { ... }
- The default title is `ClassName.methodName` (auto-derived); pass a string to override:
  - @Step('Place order and wait for confirmation') async placeOrder() { ... }
- Always call it with parentheses. It is a decorator factory, so `@Step` (no parens)
  will not work — use `@Step()`.
- The decorator lives in src/utils/step.ts and wraps the method body in test.step, so
  the nesting appears automatically in the HTML report. Do not add manual test.step()
  calls inside a decorated method.
- These are TC39 standard decorators: keep `experimentalDecorators` OFF in tsconfig.json
  (it is off today). Do not enable it — that would switch to the legacy decorator style
  and break the @Step signature.

## Test isolation
- Reset app state before each test in a beforeEach hook inside the describe block.
- The page object exposes open() (navigate to '/') and resetState() (clear localStorage,
  then reload); call open() before resetState() so storage is cleared on the app origin.
- Avoid depending on state from a previous test.

## Test data
- Keep test data out of test logic in dedicated folders: test-data/smoke and
  test-data/regression.
- Import data via the @data path alias, e.g. import data from '@data/smoke/smoke-data.json'.

## Tags and suites
- Tag smoke tests with @smoke and regression tests with @regression (at the describe level).
- Keep smoke tests under tests/smoke-tests and regression tests under tests/regression-tests.
- Split tests into separate files by feature for readability.
- Select suites with npm run test:smoke (@smoke) and npm run test:regression (@regression).

## Stability tips
- Prefer meaningful text and roles over CSS structure.
- Add data-testid attributes for complex repeated UI components.
- Avoid fixed waits; let Playwright wait for the UI.

## Code quality: lint, format, and types
Style and quality are enforced mechanically, not just by review. Run these before
pushing (CI runs them too, and fails the build on any error):
- npm run lint — ESLint (flat config in eslint.config.mjs). Uses typescript-eslint's
  type-aware rules plus eslint-plugin-playwright, which enforces the conventions above
  (web-first assertions, no fixed waits, awaited expects, no `test.only` left in, etc.).
  Use `npm run lint:fix` to auto-fix.
- npm run format:check — Prettier (config in .prettierrc). Use `npm run format` to write.
  Do not hand-format; let Prettier own whitespace/quotes/semicolons.
- npm run typecheck — `tsc --noEmit`. Playwright transpiles each file in isolation and
  never fails on type errors, so this is the only gate that actually catches them. Keep
  it green.
- Editor consistency comes from .editorconfig; line endings are pinned to LF via
  .prettierrc and the repo .gitattributes (we develop on Windows, CI runs on Linux).
- Path aliases (@pages, @fixtures, @data, @utils) are defined in tsconfig.json without
  `baseUrl` (relative `./` targets), so they keep working on TypeScript 7+.

## Execution and CI
- Locally the HTML reporter is used; on CI the blob reporter is used.
- CI runs a fast `quality` job (lint + format + typecheck) first; the browser matrix only
  runs if it passes, so style/type errors fail in seconds instead of after a full run.
- On CI the suite is sharded across 4 machines (GitHub Actions matrix).
- A merge job combines the per-shard blob reports into a single HTML report and a single
  GitHub Actions run summary (see merge.config.ts).

## Debugging
- Run a single test with:
  - npx playwright test --debug
- Capture traces when debugging failures:
  - npx playwright test --trace on

## For this pizza app
See [TEST_STRATEGY.md](./TEST_STRATEGY.md) for the full list of user journeys and
test cases to cover.
