import { test } from '@fixtures/pizza';

test.describe('Theme', { tag: '@regression' }, () => {
    test('TC-11: Theme toggle works', async ({ homePage }) => {
        // App starts in light theme.
        await homePage.expectLightTheme();

        await homePage.toggleTheme();
        await homePage.expectDarkTheme();

        await homePage.toggleTheme();
        await homePage.expectLightTheme();
    });
});
