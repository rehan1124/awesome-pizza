# E2E Test Strategy for Awesome Pizza

## 1. Objective
Validate the core business flows of the pizza ordering website at http://localhost:3000/ from the user’s perspective using end-to-end browser tests.

## 2. Scope
Cover the main user journeys:
- Loading the homepage
- Viewing the menu
- Adding items to the cart
- Placing an order
- Looking up an order
- Updating order status
- Handling validation and error scenarios

## 3. Test approach
- Execute tests in a real browser using Playwright.
- Validate visible UI behavior and business outcomes.
- Keep tests isolated by resetting app state before each run.
- Prefer user-facing locators such as role, label, text, and test IDs.
- Always use soft assertions (expect.soft) for verifications to capture multiple UI issues in one run.
- Use Playwright hooks for shared setup and teardown across similar tests.
- Separate test data from test logic using dedicated folders for smoke and regression data.
- Use fixtures together with POM to provide reusable page objects and common test setup.

## 4. Test cases with categorization

### Smoke tests (daily run)
These are the highest-value tests for quick confidence and should run every day.

- TC-01: Homepage loads successfully (Smoke)
  - Open the homepage
  - Verify the main heading and menu section are visible

- TC-02: User can add an item to the cart (Smoke)
  - Add a pizza from the menu
  - Verify the cart count updates

- TC-03: User can place an order successfully (Smoke)
  - Add an item, enter a customer name, and place the order
  - Verify a success notification and order ID appear

- TC-04: User can look up an existing order (Smoke)
  - Enter a valid order ID
  - Verify order details are displayed

### Regression tests (weekly run)
These cover broader behavior, validation paths, and less frequent but important workflows.

- TC-05: Daily menu is rendered correctly (Regression)
  - Verify menu items, names, and descriptions are shown properly

- TC-06: User can adjust or remove cart items (Regression)
  - Increase, decrease, and remove items from the cart
  - Verify the cart updates correctly

- TC-07: Order placement is blocked without items (Regression)
  - Try to place an order with an empty cart
  - Verify validation error is shown

- TC-08: Order placement is blocked without a customer name (Regression)
  - Add an item but leave the name empty
  - Verify validation error is shown

- TC-09: Lookup of an invalid order shows an error (Regression)
  - Enter a non-existent order ID
  - Verify the app shows an error state

- TC-10: Order status update flow works (Regression)
  - Update an order status through the UI
  - Verify the new status is reflected

- TC-11: Theme toggle works (Regression)
  - Toggle the theme and verify the UI updates correctly

## 5. Execution strategy
- Daily: run only smoke tests
- Weekly: run smoke + regression tests
- Keep smoke tests under playwright/tests/smoke-tests and regression tests under playwright/tests/regression-tests
- Separate the tests into different test files for better readability and maintenance
- Use separate folders or tags:
  - smoke-tests/
  - regression-tests/

## 6. Recommended tagging
- Smoke tests: @smoke
- Regression tests: @regression
