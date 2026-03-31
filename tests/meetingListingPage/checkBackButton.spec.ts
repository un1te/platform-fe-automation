import {STORAGE_STATE_USER} from "../../playwright.config";
import {test} from '../../fixtures/base';

test.describe('Meeting Listing page', () => {
    test.use({storageState: STORAGE_STATE_USER});

    test('[C64768] Check the "back" button on the Meeting listing page ', async ({homePage, meetingListingPage}) => {
        const userAccountMenu = homePage.userAccountMenu;

        await meetingListingPage.goto('');
        await userAccountMenu.clickOnManageMeetingsMenuItem();
        await test.step("User clicks the back button", async () => {
            await meetingListingPage.backButton.click();
            await homePage.categoriesCardIsVisible();
        });
    });

});