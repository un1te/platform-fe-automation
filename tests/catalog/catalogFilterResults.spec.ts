import {STORAGE_STATE_USER} from "../../playwright.config";
import {test} from '../../fixtures/base';
import {expect} from "@playwright/test";
import data from "../../test_data/catalogPageData";

test.describe('Catalog Page filter results', () => {
    test.use({storageState: STORAGE_STATE_USER});
    test.beforeEach(async ({homePage}) => {
            await homePage.goto('');
            await homePage.filterSkeletonIsNotVisible();
    })

    test('[C19788] Breadcrumbs for Categories', async ({homePage, catalogPage}) => {
        const categoryName = await homePage.selectCategoryAndNavigateToCatalogPage();
        await catalogPage.companyCard.cardSkeletonIsNotVisible();

        expect(await catalogPage.getFirstLevelBreadCrumbsName()).toEqual(data.marketCategories);
        expect(await catalogPage.getSecondLevelBreadCrumbsName()).toEqual(categoryName);
        expect(await catalogPage.getThirdLevelBreadCrumbsName()).toEqual('All ' + categoryName);
    });

    test('[C19789] Breadcrumbs for Subcategories', async ({homePage, catalogPage}) => {
        const breadcrumbs = await homePage.selectSubCategoryAndNavigateToCatalogPage();
        const categoryName = breadcrumbs[0]
        const subCategoryName = breadcrumbs[1]
        await catalogPage.companyCard.cardSkeletonIsNotVisible();

        expect(await catalogPage.getFirstLevelBreadCrumbsName()).toEqual(data.marketCategories);
        expect(await catalogPage.getSecondLevelBreadCrumbsName()).toEqual(categoryName);
        expect(await catalogPage.getThirdLevelBreadCrumbsName()).toEqual(subCategoryName);
    });

    test('[C20058] Breadcrumbs for Top Priorities', async ({homePage, catalogPage}) => {
        const priorityName = await homePage.selectTopPriorityAndNavigateToCatalogPage();
        await catalogPage.companyCard.cardSkeletonIsNotVisible();

        expect(await catalogPage.getFirstLevelBreadCrumbsName()).toEqual(data.topPriorities);
        expect(await catalogPage.getSecondLevelBreadCrumbsName()).toEqual(priorityName);

        await catalogPage.clickOnBreadcrumb(catalogPage.secondLevelBreadCrumbs);
        expect(await catalogPage.checkBreadcrumbsChipIsActive(priorityName)).toBeTruthy();
    });
});
