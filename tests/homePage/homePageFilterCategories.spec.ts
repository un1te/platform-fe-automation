import {STORAGE_STATE_USER} from "../../playwright.config";
import {test} from '../../fixtures/base';
import {HomePage} from "../../pages/HomePage";
import {expect} from "@playwright/test";
import data from "../../test_data/homePageData";

test.describe('Home page - Categories Filters', () => {
    test.use({storageState: STORAGE_STATE_USER});
    test.beforeEach(async ({homePage}) => {
        await test.step("Navigate to the Home page", async () => {
            await homePage.goto('',);
            await homePage.filterSkeletonIsNotVisible();
            await homePage.categoriesCardIsVisible();
        })
    })

    test('[C19766] Check market category card', async ({page}) => {
        const homePage = new HomePage(page);

        await test.step("Check Category Card is visible", async () => {
            await homePage.categoriesCardIsVisible();
        });
        await test.step("Check Category Card Title", async () => {
            expect(await homePage.getCategoryCardTitle()).toEqual(data.categoriesTitle);
        });
        await test.step("Check categories quantity ", async () => {
            expect(await homePage.getCategoriesCount()).toEqual(7);
        });
        await test.step("Check categories list", async () => {
            expect(await homePage.getListOfCategories()).toEqual(data.categoryList);
        });
    });

    test('[C19768] User able to select/deselect the category', async ({homePage}) => {
        let categoryName: string;

        await test.step("Any category is not selected", async () => {
            await expect(homePage.selectedCategory).toBeHidden();
        });
        await test.step("Subcategories are not shown", async () => {
            expect(await homePage.getCategoriesCount()).toEqual(7);
        });
        await test.step("Click the category", async () => {
            categoryName = await homePage.clickOnCategoryChip();
        });
        await test.step("Category is selected", async () => {
            await expect(homePage.selectedCategory).toBeVisible();
        });
        await test.step("Subcategories are shown", async () => {
            expect(await homePage.getSubCategoriesCount()).toBeGreaterThan(6);
        });
        await test.step("Category CTA button is displayed", async () => {
            expect(await homePage.categoriesCTAButtonIsDisplayed(categoryName));
        });
    });
});