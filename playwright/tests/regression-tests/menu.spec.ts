import { test } from '@fixtures/pizza';
import regressionData from '@data/regression/regression-data.json';

test.describe('Menu', { tag: '@regression' }, () => {
    test('TC-05: Daily menu is rendered correctly', async ({ homePage }) => {
        await homePage.expectLoaded();
        await homePage.expectMenuItems(regressionData.expectedMenuItems);
    });
});
