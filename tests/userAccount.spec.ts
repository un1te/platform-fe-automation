import {STORAGE_STATE_USER} from "../playwright.config";
import {test} from '../fixtures/base';
import {HomePage} from "../pages/HomePage";
import {expect} from "@playwright/test";
import {NewMeetingPage} from "../pages/NewMeetingPage";
import newMeetingData from "../test_data/newMeetingPageData"
import meetingListingData from "../test_data/meetingListingPageData"

test.describe('User account menu - Logged in', () => {
    test.use({storageState: STORAGE_STATE_USER});
    test.beforeEach(async ({page}) => {
            await page.goto('',);
    });

    test('[C20069] User account icon is visible on all pages for the authorized user', async ({page}) => {
        const homePage = new HomePage(page);
        const userAccountMenu = homePage.userAccountMenu;

        await test.step("User account icon is visible on the Home Page", async () => {
            await expect(userAccountMenu.userIcon).toBeVisible();
        });
        await test.step("User account icon is visible on Catalog page", async () => {
            await page.goto('portfolio',);
            await expect(userAccountMenu.userIcon).toBeVisible();
        });
        await test.step("User account icon is visible on Meeting Listing page", async () => {
            await page.goto('/meetings',);
            await expect(userAccountMenu.userIcon).toBeVisible();
        });
        await test.step("User account icon is visible on Set up new meeting page", async () => {
            await page.goto('/meetings/new',);
            await expect(userAccountMenu.userIcon).toBeVisible();
        });
    });

    test('[C20068] Check user account menu', async ({page}) => {
        const homePage = new HomePage(page);
        const userAccountMenu = homePage.userAccountMenu;

        await test.step("Click on user account icon", async () => {
            await userAccountMenu.clickOnUserAccountIcon();
        });
        await test.step("User Account Menu Is Visible", async () => {
            await userAccountMenu.userAccountMenuIsVisible();
        });
        await test.step("User Account Name Is Visible", async () => {
            await userAccountMenu.userAccountNameIsVisible();
        });
        await test.step("'LogOut' Link is Visible", async () => {
            await userAccountMenu.logOutLinkIsVisible();
        });
        await test.step("'Ongoing Meeting' menu item is not Visible", async () => {
            await expect(userAccountMenu.ongoingMeetingMenuItem).not.toBeVisible();
        });
        await test.step("'Set up new meeting' menu item is Visible", async () => {
            await expect(userAccountMenu.setUpNewMeetingMenuItem).toBeVisible();
        });
        await test.step("'Manage meetings' menu item is Visible", async () => {
            await expect(userAccountMenu.manageMeetingsMenuItem).toBeVisible();
        });
    });

    test('[C20070] User is able to log out', async ({page}) => {
        const homePage = new HomePage(page);
        const userAccountMenu = homePage.userAccountMenu;

        await test.step("Click on user account icon", async () => {
            await userAccountMenu.clickOnUserAccountIcon();
        });
        await test.step("Click on Log out", async () => {
            await userAccountMenu.clickLogOutLink();
        });
        await test.step("Sign in button is visible", async () => {
            await expect(homePage.signInButton).toBeVisible();
        });
        await test.step("User account icon is not visible for guest", async () => {
            await expect(userAccountMenu.userIcon).not.toBeVisible();
        });
    });

    test('[C64782] Redirect to the Set up a new Meeting page from User account menu', async ({page}) => {
        const homePage = new HomePage(page);
        const userAccountMenu = homePage.userAccountMenu;
        const setupNewMeetingPage = new NewMeetingPage(page);

        await test.step("Click on Set Up New Meeting Menu Item", async () => {
            await userAccountMenu.clickOnSetUpNewMeetingMenuItem();
        });
        await test.step("Set up New Meeting Page title is displayed", async () => {
            expect(await setupNewMeetingPage.titleIsVisible()).toBeTruthy();
        });
        await test.step("Current url is correct", async () => {
            const url = await setupNewMeetingPage.getUrl();
            expect(url.endsWith(newMeetingData.setUpNewMeetingUrl)).toBeTruthy();
        });
    });

    test('[C64783] Redirect to the Manage Meetings page from User account menu', async ({homePage, meetingListingPage}) => {
        const userAccountMenu = homePage.userAccountMenu;

        await test.step("Click on Set Up New Meeting Menu Item", async () => {
            await userAccountMenu.clickOnManageMeetingsMenuItem();
        });
        await test.step("Set up New Meeting Page title is visible", async () => {
            expect(await meetingListingPage.titleIsVisible()).toBeTruthy()
        });
        await test.step("Current url is correct", async () => {
            const url = await meetingListingPage.getUrl();
            expect(url.endsWith(meetingListingData.meetingsUrl)).toBeTruthy();
        });
    });
});
