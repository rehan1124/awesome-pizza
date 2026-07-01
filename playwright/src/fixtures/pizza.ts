import { test as base } from '@playwright/test';
import { HomePage } from '@pages/homePage';

export type Fixtures = {
    homePage: HomePage;
};

export const test = base.extend<Fixtures>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await homePage.open();
        // Keep each test isolated and repeatable: reset stored state, then reload.
        await homePage.resetState();
        await use(homePage);
    },
});

export { expect } from '@playwright/test';
