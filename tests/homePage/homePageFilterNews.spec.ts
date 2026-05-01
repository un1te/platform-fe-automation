import { STORAGE_STATE_USER } from "../../playwright.config";
import { test } from "../../fixtures/base";
import { HomePage } from "../../pages/HomePage";
import { expect } from "@playwright/test";
import data from "../../test_data/homePageData";

test.describe("Home page - News Filters", () => {
	test.use({ storageState: STORAGE_STATE_USER });
	test("[C66718] Check the news filter content", async ({ page }) => {
		const homePage = new HomePage(page);

		await page.goto("");
		await test.step("News Card is visible", async () => {
			await homePage.newsCardIsVisible();
		});
		await test.step("Check News Card Title", async () => {
			expect(await homePage.getNewsCardTitle()).toEqual(data.newsCardTitle);
		});
		await test.step("Check News item Description", async () => {
			await homePage.newsDescriptionPresentsInNewsCard();
		});
		await test.step("Check News item logos", async () => {
			await homePage.clientsLogosPresentInNewsCard();
		});
	});
});
