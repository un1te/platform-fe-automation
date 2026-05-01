import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";
import data from "../test_data/meetingListingPageData";
import newMeetingData from "../test_data/newMeetingPageData";
import * as console from "node:console";

export class NewMeetingPage extends BasePage {
	readonly title: Locator;
	readonly userSettingsTitle: Locator;
	readonly nameField: Locator;
	readonly roleField: Locator;
	readonly companyField: Locator;
	readonly industryField: Locator;
	readonly cancelButton: Locator;
	readonly saveMeetingButton: Locator;
	readonly startMeetingButton: Locator;
	readonly suggestionsList: Locator;
	readonly firstSuggestion: Locator;
	readonly clearButton: Locator;
	readonly topCompanySettingsTitle: Locator;
	readonly topCompaniesSearchField: Locator;
	readonly topCompaniesEmptyTable: Locator;
	readonly emptyCompanyName: Locator;
	readonly emptyCompanyOneLiner: Locator;
	readonly companiesTable: Locator;
	readonly dragIcon: Locator;
	readonly companyNumber: Locator;
	readonly companyLogo: Locator;
	readonly companyName: Locator;
	readonly companyOneLiner: Locator;
	readonly removeCompanyButton: Locator;

	constructor(page: Page) {
		super(page);
		this.title = this.page.getByRole("heading", { name: "Set up a New Meeting" });
		this.userSettingsTitle = this.page.getByRole("heading", { name: "User Settings" });
		this.nameField = page.getByPlaceholder("Search by name");
		this.roleField = page.getByPlaceholder("Please select Meeting Attendee");
		this.companyField = page.locator("input[name=\"companyName\"]");
		this.industryField = page.locator("input[name=\"industryName\"]");

		this.topCompanySettingsTitle = this.page.getByRole("heading", { name: "Top Companies Settings " });
		this.topCompaniesSearchField = page.getByPlaceholder("Search by Company Name");
		this.topCompaniesEmptyTable = page.getByLabel("No companies added");
		this.emptyCompanyName = this.topCompaniesEmptyTable.getByText("Not Added");
		this.emptyCompanyOneLiner = this.topCompaniesEmptyTable.getByText("Not Applicable");
		this.companiesTable = page.locator("div[data-rbd-droppable-id=\"featured-companies\"]");
		this.dragIcon = this.companiesTable.getByLabel("Drag to reorder companies");
		this.companyNumber = this.companiesTable.getByLabel("Company number");
		this.companyLogo = this.companiesTable.getByLabel("Company logo");
		this.companyName = this.companiesTable.getByLabel("Company name");
		this.companyOneLiner = this.companiesTable.getByLabel("Company One-Liner");
		this.removeCompanyButton = this.companiesTable.getByLabel("Remove Company");

		this.cancelButton = this.page.getByRole("button", { name: "Cancel" });
		this.saveMeetingButton = this.page.getByRole("button", { name: "Save the Meeting" });
		this.startMeetingButton = this.page.getByRole("button", { name: "Start the Meeting" });
		this.suggestionsList = this.page.getByRole("presentation").getByRole("listbox");
		this.firstSuggestion = this.suggestionsList.locator("//li").first();
		this.clearButton = this.page.getByRole("button", { name: "Clear" });
	}

	async titleIsVisible(): Promise<boolean> {
		await this.title.waitFor({
			state: "visible",
		});
		return await this.title.isVisible();
	};

	async getSettingsTitleIsVisible(): Promise<boolean> {
		return await this.userSettingsTitle.isVisible();
	};

	async searchPersonByNameAndSelect(name: string) {
		await this.nameField.fill(name);
		await expect(this.suggestionsList).toBeVisible();
		await this.waitAndClick(this.firstSuggestion);
		expect(await this.nameField.inputValue()).not.toBe("");
	};

	async searchRoleAndSelect(role: string) {
		await this.roleField.fill(role);
		await expect(this.suggestionsList).toBeVisible();
		await this.waitAndClick(this.firstSuggestion);
		expect(await this.roleField.inputValue()).not.toBe("");
	};

	async clickOnClearButton() {
		await this.nameField.focus();
		await this.waitAndClick(this.clearButton);
	};

	async validateFormIsEmpty(): Promise<boolean> {
		return await this.nameField.inputValue() === ""
            && await this.roleField.inputValue() === ""
            && await this.companyField.inputValue() === ""
            && await this.industryField.inputValue() === "";
	};

	async validateFormIsAutoPopulated(name: string, role: string, companyName?: string, industryName?: string) {
		expect(await this.nameField.inputValue()).toEqual(name);
		expect(await this.roleField.inputValue()).toEqual(role);
		expect(await this.companyField.inputValue()).toEqual(companyName);
		expect(await this.industryField.inputValue()).toEqual(industryName);
	};

	async clickStartMeetingButton() {
		await this.waitAndClick(this.startMeetingButton);
	};

	async startNewMeeting() {
		await this.page.goto(data.newMeetingUrl);
		await this.searchPersonByNameAndSelect(newMeetingData.personName);
		await this.searchRoleAndSelect(newMeetingData.expectedRole);
		await this.clickStartMeetingButton();
	};

	async clickOnSaveMeetingButton(): Promise<void> {
		await this.waitAndClick(this.saveMeetingButton);
	}

	async clickOnCancelMeetingButton(): Promise<void> {
		await this.waitAndClick(this.cancelButton);
	}

	async fillCompanyField(name: string) {
		await expect(this.topCompaniesSearchField).toBeEnabled();
		await this.topCompaniesSearchField.fill(name);
	}

	async expectedCompanyIsShownInSuggestions(name: string): Promise<boolean> {
		await expect(this.suggestionsList).toBeVisible();
		return await this.suggestionsList.getByText(name).isVisible();
	}

	async selectCompany(name: string) {
		await expect(this.suggestionsList).toBeVisible();
		await this.suggestionsList.getByText(name).click();
	}

	async selectedCompanyNameIsShownInTable(companyName: string) {
		await expect(this.companyName.getByText(companyName)).toBeVisible({ timeout: 5000 });
	}

	async companyOneLinerIsShown(): Promise<boolean> {
		return await this.companyOneLiner.isVisible();
	}

	async companyRemoveButtonIsShown(): Promise<boolean> {
		return await this.removeCompanyButton.isVisible();
	}

	async searchCompanyAndSelect(company: string) {
		await this.fillCompanyField(company);
		await expect(this.suggestionsList).toBeVisible();
		const companyLocator = this.suggestionsList.getByText(company);
		await expect(companyLocator).toBeVisible({ timeout: 5000 });
		await this.selectCompany(company);
		await this.selectedCompanyNameIsShownInTable(company);
	};

	async getCompanyNumberByName(companyName: string): Promise<string | null> {
		if (await this.companyName.getByText(companyName).count() === 0) {
			console.log("Company number not found");
			return null;
		}
		const parentElement = this.companyName.getByText(companyName).locator("..").locator("..").locator("..");
		return await parentElement.getByLabel("Company number").textContent();
	}

	async removeCompany(companyName: string) {
		const row = Number(await this.getCompanyNumberByName(companyName));
		await expect(this.removeCompanyButton.nth(row-1)).toBeVisible();
		await this.waitAndClick(this.removeCompanyButton.nth(row-1));
	}

	async getAllCompaniesNames(): Promise<string[]> {
		await expect(this.companyName.last()).toBeVisible();
		return await this.companyName.allTextContents();
	}
}
