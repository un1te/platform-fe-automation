import {STORAGE_STATE_USER} from "../../playwright.config";
import {test} from '../../fixtures/base';
import {expect} from "@playwright/test";
import data from "../../test_data/newMeetingPageData"

test.describe('Featured companies - Set up new meeting page', () => {
    test.use({storageState: STORAGE_STATE_USER});
    test.beforeEach(async ({newMeetingPage}) => {
        await newMeetingPage.goto('meetings/new');
        await newMeetingPage.searchPersonByNameAndSelect(data.personName);
    });

    test('[C79453] Search featured Company on Set up a New Meeting page',async ({newMeetingPage}) => {
        await test.step("Companies Search Field is enabled", async () => {
            await expect(newMeetingPage.topCompaniesSearchField).toBeEnabled();
        });
        await test.step("Fill company field with company partial name", async () => {
            await newMeetingPage.fillCompanyField(data.featuredCompanies.post);
        });
        await test.step("Expected company is shown in suggestions", async () => {
            await newMeetingPage.expectedCompanyIsShownInSuggestions(data.featuredCompanies.postman);
        });
        await test.step("Selected the company from suggestion", async () => {
            await newMeetingPage.selectCompany(data.featuredCompanies.post);
        });
        await test.step("Selected company's details are shown in the table", async () => {
            expect(await newMeetingPage.selectedCompanyNameIsShownInTable(data.featuredCompanies.postman));
            expect(await newMeetingPage.companyNumber.textContent()).toEqual('1');
            expect(await newMeetingPage.companyOneLinerIsShown()).toBeTruthy();
            expect(await newMeetingPage.companyRemoveButtonIsShown()).toBeTruthy();
        });
    });

    test('[C79454] The next entered featured company is added below the list', async ({newMeetingPage}) => {
        await test.step("Add 2 companies to the meeting", async () => {
            await newMeetingPage.searchCompanyAndSelect(data.featuredCompanies.postman);
            await newMeetingPage.searchCompanyAndSelect(data.featuredCompanies.blaBlaCar);
        });
        await test.step("Last company added at the bottom of the table", async () => {
            expect(await newMeetingPage.getCompanyNumberByName(data.featuredCompanies.blaBlaCar)).toEqual('2')
        });
    });

    test('[C79456] User can remove added featured company', async ({newMeetingPage}) => {
        await test.step("Add company to the meeting", async () => {
            await newMeetingPage.searchCompanyAndSelect(data.featuredCompanies.postman);
        });
        await test.step("Remove company", async () => {
            expect(await newMeetingPage.removeCompany(data.featuredCompanies.postman));
        });
        await test.step("Company is not shown in the Top Companies section", async () => {
            await expect(newMeetingPage.companyName.getByText(data.featuredCompanies.postman)).not.toBeVisible();
        });
    });
});