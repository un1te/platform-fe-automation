import {STORAGE_STATE_USER} from "../../playwright.config";
import {test} from '../../fixtures/base';
import {expect} from "@playwright/test";
import {CatalogPage} from "../../pages/CatalogPage";

test.describe('Catalog Page', () => {
    test.use({storageState: STORAGE_STATE_USER});
    test.beforeEach(async ({homePage}) => {
        await test.step("Navigate to the Catalog page", async () => {
            await homePage.goto('');
            await homePage.clickViewAllButton();
        })
    })

    test('[C19160] Check company cards on the Catalog Page', async ({page}) => {
        const catalogPage = new CatalogPage(page);
        const companyCard = catalogPage.companyCard;

        await test.step("Check Company Cards quantity", async () => {
            expect(await companyCard.countCompanyCards()).toEqual(6);
        })
        await test.step("Check Company Name in card", async () => {
            expect(await companyCard.namePresent()).toBeTruthy();
        })
        await test.step("Check Company Logo in card", async () => {
            expect(await companyCard.logoPresent()).toBeTruthy();
        })
        await test.step("Check One Liner in card", async () => {
            expect(await companyCard.oneLinerPresent()).toBeTruthy();
        })
        await test.step("Check Company Description in card", async () => {
            expect(await companyCard.descriptionPresent()).toBeTruthy();
        })
        await test.step("Company legal info section  is displayed", async () => {
            await expect(companyCard.companyLegalInfo).toBeVisible();
        })
        await test.step("Clients logos are displayed", async () => {
            expect(companyCard.clientsLogosPresentInCard()).toBeTruthy()
        })
        await test.step("Check Company menu is visible in card", async () => {
            expect(await companyCard.menuIsVisible());
        })
    });

    test('[C45418] Check company card action menu on the Catalog page', async ({page}) => {
        const catalogPage = new CatalogPage(page);
        const companyCard = catalogPage.companyCard;

        await test.step("Click on card menu", async () => {
            await companyCard.clickOnMenu();
        });
        await test.step("'Connect me' menu item іs visible", async () => {
            await companyCard.connectMeMenuItemIsVisible();
        });
        await test.step("'Connect my colleague' menu item is visible", async () => {
            await companyCard.connectMyColleagueMenuItemIsVisible();
        });
    });

    test('[C71971] User can change companies sorting order', async ({catalogPage}) => {
        const sortingButton = catalogPage.sortingButton;

        await test.step("Recommended Sorting is selected by default", async () => {
            expect(await sortingButton.recommendedSortingIsSelected()).toBeTruthy();
            await sortingButton.clickOnSortingButton();
            expect(await sortingButton.checkSortingChipIsActive(sortingButton.recommendedChip)).toBeTruthy()
            expect(await sortingButton.alphabeticalChipIsVisible()).toBeTruthy();
            await sortingButton.clickOnSortingButton();
        });
        await test.step("Select and check Alphabetical Sorting", async () => {
            await sortingButton.selectAlphabeticalSorting();
            expect(await sortingButton.alphabeticalSortingIsSelected()).toBeTruthy();
            await sortingButton.clickOnSortingButton();
            expect(await sortingButton.checkSortingChipIsActive(sortingButton.alphabeticalChip)).toBeTruthy()
            expect(await sortingButton.recommendedChipIsVisible()).toBeTruthy();
            await sortingButton.clickOnSortingButton();
        });
        await test.step("Select and check Recommended Sorting", async () => {
            await sortingButton.selectRecommendedSorting();
            expect(await sortingButton.recommendedSortingIsSelected()).toBeTruthy();
            await sortingButton.clickOnSortingButton();
            expect(await sortingButton.checkSortingChipIsActive(sortingButton.recommendedChip)).toBeTruthy()
        });
    });
});
