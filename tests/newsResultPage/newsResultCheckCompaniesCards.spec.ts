import { STORAGE_STATE_USER } from "../../playwright.config";
import { test } from "../../fixtures/base";
import { expect } from "@playwright/test";
import { NewsResultPage } from "../../pages/NewsResultPage";

test.describe("News result Page - Companies card", () => {
	test.use({ storageState: STORAGE_STATE_USER });
	test.beforeEach(async ({ homePage, newsResultPage }) => {
		await homePage.goto("");
		await homePage.navigateToNewsResultPage();
		await newsResultPage.companyCard.cardSkeletonIsNotVisible();
	});

	test("[C69683] Check company cards on the News result page", async ({ page }) => {
		const newsResultPage = new NewsResultPage(page);
		const companyCard = newsResultPage.companyCard;

		await test.step("Check Company Name in card", async () => {
			expect(await companyCard.namePresent()).toBeTruthy();
		});
		await test.step("Check Company Logo in card", async () => {
			expect(await companyCard.logoPresent()).toBeTruthy();
		});
		await test.step("Check One Liner in card", async () => {
			expect(await companyCard.oneLinerPresent()).toBeTruthy();
		});
		await test.step("Check Company Description in card", async () => {
			expect(await companyCard.descriptionPresent()).toBeTruthy();
		});
		await test.step("Company legal info section  is displayed", async () => {
			await expect(companyCard.companyLegalInfo).toBeVisible();
		});
		await test.step("Check Company menu is visible in card", async () => {
			await companyCard.menuIsVisible();
		});
	});

	test("[C69684] Check company card action menu on the News Result Page", async ({ page }) => {
		const newsResultPage = new NewsResultPage(page);
		const companyCard = newsResultPage.companyCard;

		await test.step("Click on company card menu", async () => {
			await newsResultPage.validateTitleIsVisible();
			await companyCard.clickOnMenu();
		});
		await test.step("'Connect me' menu item іs visible", async () => {
			await companyCard.connectMeMenuItemIsVisible();
		});
		await test.step("'Connect my colleague' menu item is visible", async () => {
			await companyCard.connectMyColleagueMenuItemIsVisible();
		});
	});
});
