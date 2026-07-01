# Playwright testing instructions for this workspace

When writing or editing Playwright tests in this repository, follow these rules:

## 1. Core principles
- Test user-visible behavior, not implementation details.
- Prefer resilient locators such as getByRole, getByLabel, getByText, and getByTestId.
- Avoid CSS selectors and XPath unless there is no better option.
- Use web-first assertions and await them, for example expect(page.getByText('Order placed successfully')).toBeVisible().
- Prefer soft assertions when you want the test run to continue and report multiple issues together.
- Keep tests isolated. Reset state such as localStorage, cookies, and app data before each test.
- Do not use arbitrary sleeps; rely on Playwright's auto-waiting.
- Keep tests small, focused, and named after the user journey.

## 2. Folder structure
- Keep smoke tests under playwright/tests/smoke-tests.
- Keep regression tests under playwright/tests/regression-tests.
- Keep reusable test data under playwright/test-data/smoke and playwright/test-data/regression.
- Keep page objects under playwright/src/pages.
- Keep test fixtures under playwright/src/fixtures.ts when shared setup is needed.

## 3. Page Object Model pattern
Follow the Page Object Model pattern strictly:
- Keep locators and page actions in page objects.
- Keep test files focused on scenarios and assertions.
- Expose methods such as open(), addPizza(), placeOrder(), and expectLoaded().
- Use readonly locators and initialize them in the constructor.

Example structure:

```ts
import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly menuHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Awesome Pizza/i });
    this.menuHeading = page.getByRole('heading', { name: "Today's Menu" });
  }

  async open() {
    await this.page.goto('/');
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.menuHeading).toBeVisible();
  }
}
```

Tests should use the page object and avoid inline DOM selectors.

## 4. Fixtures and shared setup
- Use fixtures when the same setup is needed across multiple tests.
- Keep fixtures focused on setup and pass page objects into the test.

```ts
import { test as base } from '@playwright/test';
import { HomePage } from '../src/pages/homePage';

export const test = base.extend<{ homePage: HomePage }>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await use(homePage);
  },
});
```

## 5. Business focus for this app
Prioritize flows such as:
- loading the menu
- adding items to the cart
- placing an order
- looking up an order
- updating order status

If the UI needs a stable hook, add data-testid attributes rather than relying on fragile DOM structure.
