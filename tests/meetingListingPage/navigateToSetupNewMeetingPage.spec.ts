import {STORAGE_STATE_USER} from "../../playwright.config";
import {test} from '../../fixtures/base';
import {expect} from "@playwright/test";
import data from "../../test_data/meetingListingPageData"

test.describe('Meeting Listing page', () => {
    test.use({storageState: STORAGE_STATE_USER});

    test('[C64767] User navigates to the "Set up new meeting" page from the Meeting listing page', async ({meetingListingPage, newMeetingPage}) => {
        await meetingListingPage.goto(data.meetingsUrl);
        await test.step("Click on 'Set Up New Meeting' button", async () => {
            await meetingListingPage.clickSetUpNewMeetingButton()
        });
        await test.step("User navigated to the 'Set up a New Meeting' page", async () => {
            expect(await newMeetingPage.titleIsVisible()).toBeTruthy()
        });
    });

});