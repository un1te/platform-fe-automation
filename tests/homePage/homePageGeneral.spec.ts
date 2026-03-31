import {STORAGE_STATE_USER} from "../../playwright.config";
import {test} from '../../fixtures/base';
import {HomePage} from "../../pages/HomePage"
import {CatalogPage} from "../../pages/CatalogPage";
import {NewsResultPage} from "../../pages/NewsResultPage";
import {expect} from "@playwright/test";

test.describe('Home Page General', () => {
    test.use({storageState: STORAGE_STATE_USER});
    test.beforeEach(async ({page}) => {
            await page.goto('',);
    })

    test('[C67050] Navigate to Catalog page from the Home Page', async ({page}) => {
        const homePage = new HomePage(page);
        const catalogPage = new CatalogPage(page);

        await test.step("Click ViewAll Button", async () => {
            await homePage.clickViewAllButton();
        });
        await test.step("Catalog page is opened", async () => {
            expect(await catalogPage.titleIsVisible()).toBeTruthy();
        });
    });

    test('[C67388] User able to navigate to news results page from the news filter', async ({page}) => {
        const homePage = new HomePage(page);
        const newsResultPage = new NewsResultPage(page);

        await test.step("Click the news item in filters", async () => {
            await homePage.navigateToNewsResultPage();
        });
        await test.step("News result page is opened", async () => {
            await newsResultPage.validateTitleIsVisible();
        });
    });
});