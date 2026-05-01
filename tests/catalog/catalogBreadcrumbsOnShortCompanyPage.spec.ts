import { STORAGE_STATE_USER } from "../../playwright.config";
import { test } from "../../fixtures/base";
import { expect } from "@playwright/test";
import data from "test_data/shortCompanyData";

test.describe("Catalog Page - Breadcrumbs on Short Company page", () => {
	test.use({ storageState: STORAGE_STATE_USER });
	let companyName: string;

	test.beforeEach(async ({ homePage }) => {
		await homePage.goto("");
	});

	test("[C67560] Verify breadcrumbs on the Short company popup (Catalog page - View All)", async ({ homePage, catalogPage }) => {
		const companyCard = catalogPage.companyCard;
		const shortCompanyPopup = catalogPage.shortCompanyPage;

		await test.step("Click on 'View all' button on the home page", async () => {
			await homePage.clickViewAllButton();
			await companyCard.cardSkeletonIsNotVisible();
		});
		await test.step("Click on the company card", async () => {
			companyName = await companyCard.clickOnCompanyName();
			shortCompanyPopup.setInitialLocators(companyName);
		});
		await test.step("Validate the breadcrumbs", async () => {
			expect(await shortCompanyPopup.getBreadcrumbsContent()).toEqual(data.expectedBreadcrumbsRecommended + companyName);
		});
	});

	test("[C78597] Verify breadcrumbs on the Short company popup (Catalog page - Filter selected)", async ({ homePage, catalogPage }) => {
		const companyCard = catalogPage.companyCard;
		const shortCompanyPopup = catalogPage.shortCompanyPage;
		let categoryName: string;
		await homePage.filterSkeletonIsNotVisible();
		await homePage.categoriesCardIsVisible();

		await test.step("Select category and navigate to the Catalog page ", async () => {
			categoryName = await homePage.clickOnCategoryChip();
			await homePage.clickOnCategoriesCTAButton();
			await companyCard.cardSkeletonIsNotVisible();
			expect(await companyCard.namePresent()).toBeTruthy();
		});
		await test.step("Click on the company card", async () => {
			companyName = await companyCard.clickOnCompanyName();
			shortCompanyPopup.setInitialLocators(companyName);
		});
		await test.step("Validate the breadcrumbs", async () => {
			expect(await shortCompanyPopup.getBreadcrumbsContent()).toEqual(`${data.expectedBreadcrumbsCategory}${categoryName}/All ${categoryName}/${companyName}`);
		});
	});
});
