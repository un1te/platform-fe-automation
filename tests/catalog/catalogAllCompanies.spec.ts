import { STORAGE_STATE_USER } from "../../playwright.config";
import { test } from "../../fixtures/base";
import { expect } from "@playwright/test";

test.describe("Catalog - All Companies Page", () => {
	test.use({ storageState: STORAGE_STATE_USER });
	test.beforeEach(async ({ homePage }) => {
		await test.step("Navigate to the Catalog page", async () => {
			await homePage.goto("");
			await homePage.filterSkeletonIsNotVisible();
		});
	});

	test("[C77712] Redirect to all portfolio Companies Page (no meeting started)", async ({ homePage, catalogAllCompaniesPage }) => {
		const companyCard = catalogAllCompaniesPage.companyCard;
		const sortingButton = catalogAllCompaniesPage.sortingButton;
		await companyCard.cardSkeletonIsNotVisible();

		await test.step("Click on 'View all' button", async () => {
			await homePage.clickViewAllButton();
			await companyCard.cardSkeletonIsNotVisible();
		});
		await test.step("CISO role selected in breadcrumbs", async () => {
			expect(await catalogAllCompaniesPage.checkRoleChipIsActive(catalogAllCompaniesPage.CISOChip)).toBeTruthy();
			expect(await companyCard.namePresent()).toBeTruthy();
		});
		await test.step("Recommended Sorting is selected", async () => {
			expect(await sortingButton.recommendedSortingIsSelected()).toBeTruthy();
		});
	});

	test("[C77780] Switching between roles - Catalog All companies page", async ({ homePage, catalogAllCompaniesPage }) => {
		const companyCard = catalogAllCompaniesPage.companyCard;
		const sortingButton = catalogAllCompaniesPage.sortingButton;

		await test.step("Click on 'View all' button", async () => {
			await homePage.clickViewAllButton();
			await companyCard.cardSkeletonIsNotVisible();
		});
		await test.step("Select 'All roles' chip in breadcrumbs", async () => {
			await catalogAllCompaniesPage.clickOnBreadCrumb(catalogAllCompaniesPage.allRolesChip);
		});
		await test.step("'All roles' chip is selected in breadcrumbs", async () => {
			expect(await catalogAllCompaniesPage.checkRoleChipIsActive(catalogAllCompaniesPage.allRolesChip)).toBeTruthy();
			expect(await companyCard.namePresent()).toBeTruthy();
		});
		await test.step("Alphabetical Sorting is selected", async () => {
			expect(await sortingButton.alphabeticalSortingIsSelected()).toBeTruthy();
		});

		await test.step("Select 'CIO' chip in breadcrumbs", async () => {
			await catalogAllCompaniesPage.clickOnBreadCrumb(catalogAllCompaniesPage.CIOChip);
		});
		await test.step("'CIO' chip is selected in breadcrumbs", async () => {
			expect(await catalogAllCompaniesPage.checkRoleChipIsActive(catalogAllCompaniesPage.CIOChip)).toBeTruthy();
			expect(await companyCard.namePresent()).toBeTruthy();
		});
		await test.step("Recommended Sorting is selected", async () => {
			expect(await sortingButton.recommendedSortingIsSelected()).toBeTruthy();
		});

		await test.step("Select 'CISO' chip in breadcrumbs", async () => {
			await catalogAllCompaniesPage.clickOnBreadCrumb(catalogAllCompaniesPage.CISOChip);
		});
		await test.step("'CISO' chip is selected in breadcrumbs", async () => {
			expect(await catalogAllCompaniesPage.checkRoleChipIsActive(catalogAllCompaniesPage.CISOChip)).toBeTruthy();
			expect(await companyCard.namePresent()).toBeTruthy();
		});
		await test.step("Recommended Sorting is selected", async () => {
			expect(await sortingButton.recommendedSortingIsSelected()).toBeTruthy();
		});
	});

	test("[C71871] Check the companies order toggle (All companies)", async ({ homePage, catalogAllCompaniesPage }) => {
		const sortingButton = catalogAllCompaniesPage.sortingButton;

		await test.step("Click on 'View all' button", async () => {
			await homePage.clickViewAllButton();
			await catalogAllCompaniesPage.validateTitleIsVisible();
		});
		await test.step("Sorting button is displayed", async () => {
			expect(await sortingButton.sortingButtonIsVisible()).toBeTruthy();
		});
		await test.step("Recommended Sorting is selected", async () => {
			expect(await sortingButton.recommendedSortingIsSelected()).toBeTruthy();
		});
		await test.step("Open sorting menu and check the sorting options", async () => {
			await sortingButton.clickOnSortingButton();
			expect(await sortingButton.recommendedChipIsVisible()).toBeTruthy();
			expect(await sortingButton.alphabeticalChipIsVisible()).toBeTruthy();
			expect(await sortingButton.checkSortingChipIsActive(sortingButton.recommendedChip), "Recommended option is not active").toBeTruthy();
		});
	});

	test("[C72021] Companies sorting order become \"recommended\" after page reload", async ({ page, homePage, catalogAllCompaniesPage }) => {
		const sortingButton = catalogAllCompaniesPage.sortingButton;

		await test.step("Click on 'View all' button", async () => {
			await homePage.clickViewAllButton();
			await catalogAllCompaniesPage.validateTitleIsVisible();
		});
		await test.step("Select Alphabetical Sorting", async () => {
			await sortingButton.selectAlphabeticalSorting();
		});
		await test.step("Reload the page", async () => {
			await page.reload();
		});
		await test.step("Recommended sorting is selected", async () => {
			await sortingButton.clickOnSortingButton();
			expect(await sortingButton.recommendedSortingIsSelected()).toBeTruthy();
		});
	});
});