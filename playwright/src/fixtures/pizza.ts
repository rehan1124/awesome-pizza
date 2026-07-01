import { test as base } from '@playwright/test';
import { HomePage } from '@pages/homePage';

export type Fixtures = {
    homePage: HomePage;
};

export const test = base.extend<Fixtures>({
    // Provide the page object only. Navigation + state reset happen in each
    // describe's beforeEach so the setup is explicit in the spec files.
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
});

export { expect } from '@playwright/test';
