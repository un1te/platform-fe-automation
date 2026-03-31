import {STORAGE_STATE_USER} from "../../playwright.config";
import {test} from '../../fixtures/base';
import {expect} from "@playwright/test";
import data from "../../test_data/catalogPageData";

test.describe('Catalog Page breadcrumbs', () => {
    let categoryName: string;
    test.use({storageState: STORAGE_STATE_USER});
    test.beforeEach(async ({homePage, catalogPage}) => {
        await test.step("Navigate to the Catalog page", async () => {
            await homePage.goto('');
            await homePage.filterSkeletonIsNotVisible();
            categoryName = await homePage.selectCategoryAndNavigateToCatalogPage();
            await catalogPage.companyCard.cardSkeletonIsNotVisible();
        })
    })

    test('[C19792] Navigation between Categories breadcrumbs', async ({catalogPage}) => {
        expect(await catalogPage.getSecondLevelBreadCrumbsName()).toEqual(categoryName);
        await catalogPage.clickOnBreadcrumb(catalogPage.secondLevelBreadCrumbs);
        expect(await catalogPage.checkBreadcrumbsChipIsActive(categoryName)).toBeTruthy();
        await catalogPage.chipNameIsPresentInExpandedBreadcrumbs(data.allMarketCategories)

        categoryName = await catalogPage.selectChipFromDropdown(catalogPage.secondLevelBreadCrumbs, 3);
        expect(await catalogPage.getThirdLevelBreadCrumbsName()).toEqual('All ' + categoryName);
        await catalogPage.clickOnBreadcrumb(catalogPage.secondLevelBreadCrumbs);
        expect(await catalogPage.checkBreadcrumbsChipIsActive(categoryName)).toBeTruthy();
    });

    test('[C71213] Navigation between Subcategories breadcrumbs', async ({catalogPage}) => {
        await catalogPage.clickOnBreadcrumb(catalogPage.thirdLevelBreadCrumbs);
        expect(catalogPage.breadcrumbsAreExpanded()).toBeTruthy()
        const subcategoryName = await catalogPage.selectChipFromDropdown(catalogPage.thirdLevelBreadCrumbs, 2);
        expect(await catalogPage.getThirdLevelBreadCrumbsName()).toEqual(subcategoryName);

        await catalogPage.clickOnBreadcrumb(catalogPage.thirdLevelBreadCrumbs);
        expect(await catalogPage.checkBreadcrumbsChipIsActive(subcategoryName)).toBeTruthy();
    });
});