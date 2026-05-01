import { STORAGE_STATE_USER } from "../../playwright.config";
import { test } from "../../fixtures/base";
import { expect } from "@playwright/test";
import data from "../../test_data/newMeetingPageData";

test.describe("Set up new meeting page", () => {
	test.use({ storageState: STORAGE_STATE_USER });
	test.beforeEach(async ({ page }) => {
		await page.goto("meetings/new");
	});

	test("[C20530] Check Set up a new Meeting page", async ({ newMeetingPage }) => {
		await test.step("Check the page Title and subtitle", async () => {
			expect(await newMeetingPage.titleIsVisible()).toBeTruthy();
			expect(await newMeetingPage.getSettingsTitleIsVisible()).toBeTruthy();
		});
		await test.step("Name field is editable", async () => {
			await expect(newMeetingPage.nameField).toBeEditable();
		});
		await test.step("Check disabled fields", async () => {
			await expect(newMeetingPage.roleField).not.toBeEditable();
			await expect(newMeetingPage.companyField).not.toBeEditable();
			await expect(newMeetingPage.industryField).not.toBeEditable();
			await expect(newMeetingPage.topCompaniesSearchField).not.toBeEditable();
		});
		await test.step("Check empty companies table", async () => {
			await expect(newMeetingPage.emptyCompanyName).toBeVisible();
			await expect(newMeetingPage.emptyCompanyOneLiner).toBeVisible();
		});
		await test.step("Cancel button is active", async () => {
			await expect(newMeetingPage.cancelButton).toBeEnabled();
		});
		await test.step("Save and Start Meeting buttons are disabled", async () => {
			await expect(newMeetingPage.saveMeetingButton).toBeDisabled();
			await expect(newMeetingPage.startMeetingButton).toBeDisabled();
		});
	});

	test("[C20081] Search person by Name", async ({ newMeetingPage }) => {
		await test.step("Check the form is empty", async () => {
			expect( await newMeetingPage.validateFormIsEmpty()).toBeTruthy();
		});
		await test.step("Search person by name and select", async () => {
			await newMeetingPage.searchPersonByNameAndSelect(data.personName);
			await newMeetingPage.searchRoleAndSelect(data.expectedRole);
		});
		await test.step("Form is auto-populated", async () => {
			await newMeetingPage.validateFormIsAutoPopulated(
				data.personName,
				data.expectedRole,
				data.expectedCompanyName,
				data.expectedIndustry);
		});
		await test.step("Save and Start Meeting buttons are active", async () => {
			await expect(newMeetingPage.saveMeetingButton).toBeEnabled();
			await expect(newMeetingPage.startMeetingButton).toBeEnabled();
		});
	});

	test("[C33850] Clear search results on the Set up a new Meeting page", async ({ newMeetingPage }) => {
		await test.step("Clear button is not visible", async () => {
			await expect(newMeetingPage.clearButton).not.toBeVisible();
		});
		await test.step("Search person by name an select", async () => {
			await newMeetingPage.searchPersonByNameAndSelect(data.personName);
		});
		await test.step("Click on clear button", async () => {
			await newMeetingPage.clickOnClearButton();
		});
		await test.step("Form is cleared", async () => {
			expect(await newMeetingPage.validateFormIsEmpty()).toBeTruthy();
		});
	});

	test("[C20087] Verify Cancel button", async ({ newMeetingPage, homePage }) => {
		await homePage.goto("");
		const userAccountMenu = homePage.userAccountMenu;
		await userAccountMenu.clickOnSetUpNewMeetingMenuItem();

		await test.step("Search person by name, role an select", async () => {
			await newMeetingPage.searchPersonByNameAndSelect(data.personName);
			await newMeetingPage.searchRoleAndSelect(data.expectedRole);
		});
		await test.step("Click on Cancel button", async () => {
			await newMeetingPage.clickOnCancelMeetingButton();
		});
		await test.step("Home page is opened on Cancel button", async () => {
			await homePage.categoriesCardIsVisible();
		});
		await newMeetingPage.goto(data.setUpNewMeetingUrl);
		await test.step("Form is clear on the Set up nem meeting page", async () => {
			expect(await newMeetingPage.validateFormIsEmpty()).toBeTruthy();
		});
	});
});