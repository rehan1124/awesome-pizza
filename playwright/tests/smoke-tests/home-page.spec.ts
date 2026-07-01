import { test } from '@fixtures/pizza';
import smokeData from '@data/smoke/smoke-data.json';

test.describe('Core journeys', { tag: '@smoke' }, () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.open();
        await homePage.resetState();
    });

    test('TC-01: Homepage loads successfully', async ({ homePage }) => {
        await homePage.expectLoaded();
    });

    test('TC-02: User can add an item to the cart', async ({ homePage }) => {
        await homePage.addPizza(smokeData.pizzaName);
        await homePage.expectCartCount('1');
    });

    test('TC-03: User can place an order successfully', async ({ homePage }) => {
        await homePage.addPizza(smokeData.pizzaName);
        await homePage.fillCustomerName(smokeData.customerName);
        await homePage.placeOrder();

        await homePage.expectSuccessNotification();
        await homePage.expectOrderDetailsVisible();
    });

    test('TC-04: User can look up an existing order', async ({ homePage }) => {
        await homePage.addPizza(smokeData.pizzaName);
        await homePage.fillCustomerName(smokeData.customerName);
        await homePage.placeOrder();

        const orderId = await homePage.placedOrderId();
        await homePage.lookupOrder(orderId);
        await homePage.expectOrderDetailsVisible();
    });
});
