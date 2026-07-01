import { test } from '@fixtures/pizza';
import regressionData from '@data/regression/regression-data.json';

test.describe('Order flow', { tag: '@regression' }, () => {
    test('TC-07: Order placement is blocked without items', async ({ homePage }) => {
        // Cart is empty; even with a name the order cannot be placed.
        await homePage.fillCustomerName(regressionData.customerName);

        await homePage.expectPlaceOrderDisabled();
    });

    test('TC-08: Order placement is blocked without a customer name', async ({ homePage }) => {
        // Item in cart but no name; the place-order action stays disabled.
        await homePage.addPizza(regressionData.pizzaName);

        await homePage.expectPlaceOrderDisabled();
    });

    test('TC-09: Lookup of an invalid order shows an error', async ({ homePage }) => {
        await homePage.lookupOrder(regressionData.invalidOrderId);

        await homePage.expectNotification(/not found/i);
    });

    test('TC-10: Order status update flow works', async ({ homePage }) => {
        await homePage.addPizza(regressionData.pizzaName);
        await homePage.fillCustomerName(regressionData.customerName);
        await homePage.placeOrder();

        await homePage.expectOrderStatus('RECEIVED');
        await homePage.markAsDelivering();
        await homePage.expectOrderStatus('DELIVERING');
    });
});
