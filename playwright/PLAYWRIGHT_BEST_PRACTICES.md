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

## Execution and CI
- Locally the HTML reporter is used; on CI the blob reporter is used.
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
