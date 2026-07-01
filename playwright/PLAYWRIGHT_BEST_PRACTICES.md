# Playwright best practices for this project

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

## Test isolation
- Reset browser state before each test.
- Clear localStorage and reload the page.
- Avoid depending on state from a previous test.

## Stability tips
- Prefer meaningful text and roles over CSS structure.
- Add data-testid attributes for complex repeated UI components.
- Avoid fixed waits; let Playwright wait for the UI.

## Debugging
- Run a single test with:
  - npx playwright test --debug
- Capture traces when debugging failures:
  - npx playwright test --trace on

## For this pizza app
Focus on these journeys:
1. Home page loads and menu is visible.
2. User adds pizza items to cart.
3. User places an order successfully.
4. User looks up an existing order.
5. User updates order status.
