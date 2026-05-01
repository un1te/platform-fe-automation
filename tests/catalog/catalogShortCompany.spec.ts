import { STORAGE_STATE_USER } from "../../playwright.config";
import { test } from "../../fixtures/base";
import { expect } from "@playwright/test";

test.describe("Catalog Page - Short Company page", () => {
	test.use({ storageState: STORAGE_STATE_USER });
	let companyName: string;
	let companiesOnCatalogPage: string[];
	test.beforeEach(async ({ homePage, catalogPage }) => {
		await test.step("Navigate to the Home page and click 'View all' button ", async () => {
			await homePage.goto("");
			await homePage.clickViewAllButton();
		});
		const companyCard = catalogPage.companyCard;
		await companyCard.cardSkeletonIsNotVisible();
		companiesOnCatalogPage= await companyCard.getAllCompaniesNames();
		await test.step("Click on the company card ", async () => {
			companyName = await companyCard.clickOnCompanyName();
			const shortCompanyPopup = catalogPage.shortCompanyPage;
			shortCompanyPopup.setInitialLocators(companyName);
		});
	});

	test("[C77520] Check short company page content on the Catalog page", async ({ catalogPage }) => {
		const shortCompanyPopup = catalogPage.shortCompanyPage;

		await test.step("ShortCompany Popup is opened", async () => {
			await expect(shortCompanyPopup.slide).toBeVisible();
		});
		await test.step("Connect My / My Colleague buttons are present and enabled", async () => {
			await expect(shortCompanyPopup.connectMeButton).toBeEnabled();
			await expect(shortCompanyPopup.connectMyColleagueButton).toBeEnabled();
		});
		await test.step("Close button is present", async () => {
			await expect(shortCompanyPopup.closeButton).toBeVisible();
		});
		await test.step("Company logo present and not empty", async () => {
			expect(await shortCompanyPopup.companyLogoPresent(companyName)).toBeTruthy();
		});
		await test.step("Company Name is correct", async () => {
			expect(await shortCompanyPopup.getCompanyName()).toEqual(companyName);
		});
		await test.step("Company oneLiner is displayed ", async () => {
			await expect(shortCompanyPopup.oneLiner).toBeVisible();
		});
		await test.step("Description is displayed", async () => {
			await expect(shortCompanyPopup.descriptionTitle).toBeVisible();
			expect(await shortCompanyPopup.descriptionTextPresent()).toBeTruthy();
		});
		await test.step("legalInfo is displayed and not null", async () => {
			expect(await shortCompanyPopup.legalInfoPresent()).toBeTruthy();
			expect(await shortCompanyPopup.legalInfoDoNotContainsNull()).toBeTruthy();
			expect(await shortCompanyPopup.linkPresentInLegalInfoSection()).toBeTruthy();
		});
	});

	test("[C77522] Companies in the slider correspond to the companies on the Catalog page", async ({ catalogPage }) => {
		const shortCompanyPopup = catalogPage.shortCompanyPage;
		const companiesInSlider = await shortCompanyPopup.getAllCompanies();
		await test.step("Companies In Slider correspond to the companies on the Catalog page", async () => {
			expect(companiesInSlider).toEqual(companiesOnCatalogPage);
		});
	});
});