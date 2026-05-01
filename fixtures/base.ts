import { test as base, expect } from "@playwright/test";
import { OktaPage } from "../pages/OktaPage";
import { HomePage } from "../pages/HomePage";
import { MeetingListingPage } from "../pages/MeetingListingPage";
import { NewMeetingPage } from "../pages/NewMeetingPage";
import { UserAccount } from "../pages/fragments/UserAccount";
import { NewsResultPage } from "../pages/NewsResultPage";
import { CatalogPage } from "../pages/CatalogPage";
import { CatalogPageAllCompaniesPage } from "../pages/CatalogPageAllCompaniesPage";
import { APIHelper } from "../helpers/APIHelper";

type MyFixtures = {
    homePage: HomePage;
    loginPage: OktaPage;
    meetingListingPage: MeetingListingPage;
    newMeetingPage: NewMeetingPage;
    userAccount: UserAccount;
    newsResultPage: NewsResultPage;
    catalogPage: CatalogPage;
    catalogAllCompaniesPage: CatalogPageAllCompaniesPage;
    apiHelper: APIHelper;
};

export const test = base.extend<MyFixtures>({
	apiHelper: async (_args, use) => {
		const apiHelper = new APIHelper();
		await use(apiHelper);
	},
	loginPage: async ({ page }, use) => {
		const loginPage = new OktaPage(page);
		await use(loginPage);
	},
	homePage: async ({ page }, use) => {
		const homePage = new HomePage(page);
		await use(homePage);
	},
	meetingListingPage: async ({ page }, use) => {
		const meetingListingPage = new MeetingListingPage(page);
		await use(meetingListingPage);
	},
	newMeetingPage: async ({ page }, use) => {
		const newMeetingPage = new NewMeetingPage(page);
		await use(newMeetingPage);
	},
	userAccount: async ({ page }, use) => {
		const userAccount = new UserAccount(page);
		await use(userAccount);
	},
	newsResultPage: async ({ page }, use) => {
		const newsResultPage = new NewsResultPage(page);
		await use(newsResultPage);
	},
	catalogPage: async ({ page }, use) => {
		const catalogPage = new CatalogPage(page);
		await use(catalogPage);
	},
	catalogAllCompaniesPage: async ({ page }, use) => {
		const catalogAllCompaniesPage = new CatalogPageAllCompaniesPage(page);
		await use(catalogAllCompaniesPage);
	},
});

test.afterEach(async ({ page }, testInfo) => {
	if (testInfo.status === "failed") {
		const path = `./screenshots/${new Date().toISOString() + testInfo.title}.png`;
		await page.screenshot({ path: path });
		testInfo.attachments.push({
			name: "screenshot",
			path: path,
			contentType: "image/png",
		});
		testInfo.annotations.push({ type: "testrail_attachment", description: path });
	}
});

export { expect };
