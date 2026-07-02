import { expect, type Locator, type Page } from '@playwright/test';
import { Step } from '@utils/step';

export class HomePage {
    readonly page: Page;
    readonly heading: Locator;
    readonly menuHeading: Locator;
    readonly menuItem: Locator;
    readonly cartItem: Locator;
    readonly emptyCartMessage: Locator;
    readonly cartCount: Locator;
    readonly customerNameInput: Locator;
    readonly placeOrderButton: Locator;
    readonly orderIdInput: Locator;
    readonly lookupOrderButton: Locator;
    readonly orderDetails: Locator;
    readonly orderStatus: Locator;
    readonly notification: Locator;
    readonly themeToggle: Locator;
    readonly htmlRoot: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: /Awesome Pizza/i });
        this.menuHeading = page.getByRole('heading', { name: "Today's Menu" });
        this.menuItem = page.getByTestId('menu-item');
        this.cartItem = page.getByTestId('cart-item');
        this.emptyCartMessage = page.getByText('Your cart is empty');
        this.cartCount = page.getByTestId('cart-count');
        this.customerNameInput = page.getByLabel('Your Name:');
        this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
        this.orderIdInput = page.getByLabel('Order ID:');
        this.lookupOrderButton = page.getByRole('button', { name: 'Look Up Order' });
        this.orderDetails = page.getByTestId('order-details');
        this.orderStatus = page.getByTestId('order-status');
        this.notification = page.getByTestId('notification');
        this.themeToggle = page.getByRole('button', { name: 'Toggle dark theme' });
        this.htmlRoot = page.locator('html');
    }

    @Step()
    async open() {
        await this.page.goto('/');
    }

    // Reset app state so each test starts clean (best-practices: clear storage + reload).
    @Step()
    async resetState() {
        await this.page.evaluate(() => globalThis.localStorage.clear());
        await this.page.reload();
    }

    // --- Actions ---

    @Step()
    async addPizza(pizzaName: string) {
        await this.menuItem
            .filter({ hasText: pizzaName })
            .getByRole('button', { name: 'Increase quantity' })
            .click();
    }

    @Step()
    async decreasePizza(pizzaName: string) {
        await this.menuItem
            .filter({ hasText: pizzaName })
            .getByRole('button', { name: 'Decrease quantity' })
            .click();
    }

    @Step()
    async removeFromCart(pizzaName: string) {
        await this.cartItem
            .filter({ hasText: pizzaName })
            .getByRole('button', { name: 'Remove from cart' })
            .click();
    }

    @Step()
    async fillCustomerName(name: string) {
        await this.customerNameInput.fill(name);
    }

    @Step()
    async placeOrder() {
        await this.placeOrderButton.click();
    }

    @Step()
    async placedOrderId(): Promise<string> {
        return this.orderIdInput.inputValue();
    }

    @Step()
    async lookupOrder(orderId: string) {
        await this.orderIdInput.fill(orderId);
        await this.lookupOrderButton.click();
    }

    @Step()
    async markAsDelivering() {
        await this.orderDetails.getByRole('button', { name: 'Mark as Delivering' }).click();
    }

    @Step()
    async toggleTheme() {
        await this.themeToggle.click();
    }

    // --- Assertions (soft, per project convention: surface all UI issues in one run) ---

    @Step()
    async expectLoaded() {
        await expect.soft(this.heading).toBeVisible();
        await expect.soft(this.menuHeading).toBeVisible();
        await expect.soft(this.menuItem.first()).toBeVisible();
    }

    @Step()
    async expectMenuItems(expectedNames: string[]) {
        await expect.soft(this.menuItem).toHaveCount(expectedNames.length);
        for (const name of expectedNames) {
            await expect.soft(this.menuItem.filter({ hasText: name })).toBeVisible();
        }
    }

    @Step()
    async expectCartCount(count: string) {
        await expect.soft(this.cartCount).toHaveText(count);
    }

    @Step()
    async expectCartEmpty() {
        await expect.soft(this.emptyCartMessage).toBeVisible();
        await expect.soft(this.cartCount).toHaveText('0');
    }

    @Step()
    async expectPlaceOrderDisabled() {
        await expect.soft(this.placeOrderButton).toBeDisabled();
    }

    @Step()
    async expectOrderDetailsVisible() {
        await expect.soft(this.orderDetails).toBeVisible();
    }

    @Step()
    async expectOrderStatus(status: string) {
        await expect.soft(this.orderStatus).toHaveText(status);
    }

    @Step()
    async expectSuccessNotification() {
        await expect.soft(this.notification).toContainText(/Order placed successfully/i);
    }

    @Step()
    async expectNotification(text: string | RegExp) {
        await expect.soft(this.notification).toContainText(text);
    }

    @Step()
    async expectDarkTheme() {
        await expect.soft(this.htmlRoot).toHaveAttribute('data-theme', 'dark');
    }

    @Step()
    async expectLightTheme() {
        await expect.soft(this.htmlRoot).not.toHaveAttribute('data-theme', 'dark');
    }
}
