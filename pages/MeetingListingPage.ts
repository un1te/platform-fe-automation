import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";
import data from "../test_data/meetingListingPageData";
import { APIHelper } from "../helpers/APIHelper";

export class MeetingListingPage extends BasePage {
	readonly title: Locator;
	readonly setUpMeetingButton: Locator;
	readonly emptyPageSubTitle: Locator;
	readonly backButton: Locator;
	readonly meetingsList: Locator;
	readonly meetingCard: Locator;
	readonly meetingPersonName: Locator;
	readonly meetingStatus: Locator;
	readonly colleagueLabel: Locator;
	readonly cxoLabel: Locator;
	readonly startMeetingButton: Locator;

	constructor(page: Page) {
		super(page);
		this.title = this.page.getByRole("heading", { level: 3, name: "Meetings" });
		this.emptyPageSubTitle = this.page.getByRole("heading", { level: 5, name: "There are no meetings yet" });
		this.setUpMeetingButton = this.page.getByRole("button", { name: "Set up a new meeting" });
		this.backButton = this.page.getByRole("button", { name: "Back to previous page" });
		this.meetingsList = this.page.getByRole("listbox");
		this.meetingCard = this.meetingsList.getByRole("listitem").first();
		this.meetingPersonName = this.meetingCard.getByRole("heading");
		this.meetingStatus = this.meetingCard.locator("p[role=\"mark\"]");
		this.colleagueLabel = this.meetingCard.getByText("Connected with Colleague");
		this.cxoLabel = this.meetingCard.getByText("Connected with CxO");
		this.startMeetingButton = this.meetingCard.getByRole("button", { name: "Start The Meeting" });
	}

	async titleIsVisible(): Promise<boolean> {
		await this.title.waitFor({
			state: "visible",
		});
		return await this.title.isVisible();
	};

	async clickSetUpNewMeetingButton() {
		await this.waitAndClick(this.setUpMeetingButton);
	}

	async clickStartMeetingButton() {
		await this.waitAndClick(this.startMeetingButton);
	}

	async meetingHasExpectedStatus(status: string) {
		expect(await this.meetingStatus.textContent()).toEqual(status);
	}

	async startMeetingButtonIsVisible(): Promise<boolean> {
		return await this.startMeetingButton.isVisible();
	}

	async getNumberOfMeetingCards(): Promise<number> {
		await this.meetingsList.waitFor({ state: "visible" });
		const meetingCards = this.meetingsList.getByRole("listitem").count();
		return await meetingCards;
	}

	async cxoLabelIsVisible(): Promise<boolean> {
		await expect(this.cxoLabel).toBeVisible();
		return await this.cxoLabel.isVisible();
	}

	async colleagueLabelIsVisible(): Promise<boolean> {
		await expect(this.colleagueLabel).toBeVisible();
		return await this.colleagueLabel.isVisible();
	}

	async createAndStartMeeting(apiHelper: APIHelper, role?: string) {
		if (role) {
			data.createMeetingRequest.roleId = role;
		}
		await apiHelper.createNewMeeting();
		await this.page.goto(data.meetingsUrl);
		await this.clickStartMeetingButton();
	}

	async meetingCardHasExpectedName(name: string) {
		expect(await this.meetingPersonName.textContent()).toEqual(name);
	}
}
