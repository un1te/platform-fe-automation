import { STORAGE_STATE_USER } from "../../playwright.config";
import { test } from "../../fixtures/base";
import { expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";

test.describe("News result Page - General", () => {
	let newsTitle: string;
	test.use({ storageState: STORAGE_STATE_USER });
	test.beforeEach(async ({ page }) => {
		const homePage = new HomePage(page);
		await page.goto("");
		newsTitle = await homePage.navigateToNewsResultPage();
	});

	test("[C67497] Check news results content page", async ({ newsResultPage }) => {
		await test.step("Check Company Name in card", async () => {
			await newsResultPage.validateTitleIsVisible();
		});
		await test.step("Check News title", async () => {
			expect(await newsResultPage.getNewsTitle()).toEqual(newsTitle);
		});
		await test.step("Check News link", async () => {
			expect(await newsResultPage.newsLinkPresentAndNotEmpty()).toBeTruthy();
		});
		await test.step("Check News description is present", async () => {
			expect(await newsResultPage.newsDescriptionNotEmpty()).toBeTruthy();
		});
		await test.step("Check About article section is present", async () => {
			await expect(newsResultPage.aboutArticleSection).toBeVisible();
		});
		await test.step("Check related Companies title", async () => {
			await expect(newsResultPage.relatedCompaniesTitle).toBeVisible();
		});
	});

	test("[C67423] Check back button in the news results page", async ({ homePage, newsResultPage }) => {
		await test.step("User clicks the back button", async () => {
			await newsResultPage.backButton.click();
			await homePage.categoriesCardIsVisible();
		});
	});
});
