import { test } from '@fixtures/pizza';
import regressionData from '@data/regression/regression-data.json';

test.describe('Cart', { tag: '@regression' }, () => {
    test('TC-06: User can adjust or remove cart items', async ({ homePage }) => {
        const pizza = regressionData.pizzaName;

        // Increase to 2.
        await homePage.addPizza(pizza);
        await homePage.addPizza(pizza);
        await homePage.expectCartCount('2');

        // Decrease back to 1.
        await homePage.decreasePizza(pizza);
        await homePage.expectCartCount('1');

        // Remove entirely -> cart is empty.
        await homePage.removeFromCart(pizza);
        await homePage.expectCartEmpty();
    });
});
