import { STORAGE_STATE_USER } from "../../playwright.config";
import { test } from "../../fixtures/base";
import { HomePage } from "../../pages/HomePage";
import { expect } from "@playwright/test";

test.describe("Home page - top Company Cards", () => {
	test.use({ storageState: STORAGE_STATE_USER });
	test.beforeEach(async ({ homePage }) => {
		await test.step("Navigate to the Home page", async () => {
			await homePage.goto("");
			await homePage.companyCard.cardSkeletonIsNotVisible();
		});
	});

	test("[C18580] Check top company cards", async ({ page }) => {
		const homePage = new HomePage(page);
		const companyCard = homePage.companyCard;

		await test.step("Check top Company Cards quantity", async () => {
			expect(await companyCard.countCompanyCards()).toEqual(6);
		});
		await test.step("Company name is displayed", async () => {
			expect(await companyCard.namePresent()).toBeTruthy();
		});
		await test.step("Company Logo is displayed", async () => {
			expect(await companyCard.logoPresent()).toBeTruthy();
		});
		await test.step("One Liner is displayed", async () => {
			expect(await companyCard.oneLinerPresent()).toBeTruthy();
		});
		await test.step("Top Company Description is displayed", async () => {
			expect(await companyCard.descriptionPresent()).toBeTruthy();
		});
		await test.step("Company legal info section  is displayed", async () => {
			await companyCard.companyLegalInfoPresentInCard();
		});
		await test.step("Clients logos are displayed", async () => {
			expect(await companyCard.clientsLogosPresentInCard()).toBeTruthy();
		});
		await test.step("Top Company menu is visible in card", async () => {
			await companyCard.menuIsVisible();
		});
	});

	test("[C19701] Check company card action menu on the Home page", async ({ page }) => {
		const homePage = new HomePage(page);
		const companyCard = homePage.companyCard;
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
});
