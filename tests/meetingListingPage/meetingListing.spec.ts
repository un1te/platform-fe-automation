import {STORAGE_STATE_USER} from "../../playwright.config";
import {test} from '../../fixtures/base';
import {expect} from "@playwright/test";
import data from "../../test_data/meetingListingPageData"
import newMeetingData from "../../test_data/newMeetingPageData";
import meetingData from "../../test_data/meetingListingPageData";

test.describe('Meeting Listing page', () => {
    let allAddedCompanies: string[] =[];

    test.use({storageState: STORAGE_STATE_USER});

    test.beforeEach(async ({apiHelper}) => {
        await apiHelper.deleteAllMeetings();
    });

    test.afterEach(async ({apiHelper}) => {
        await apiHelper.deleteAllMeetings();
    })

    test('[C65548] Check the meeting card (Prepared)', async ({apiHelper, meetingListingPage}) => {
        await apiHelper.createNewMeeting();
        await meetingListingPage.goto(data.meetingsUrl);
        await test.step("Meeting card's elements are displayed", async () => {
            await expect(meetingListingPage.meetingsList).toBeVisible()
            await expect(meetingListingPage.meetingCard).toBeVisible()
            expect(await meetingListingPage.startMeetingButtonIsVisible());
        });
        await test.step("Meeting card contains correct person name", async () => {
            expect(await meetingListingPage.meetingPersonName.textContent()).toEqual(data.createMeetingRequest.employeeName)
        });
        await test.step("Meeting card contains correct status", async () => {
            expect(await meetingListingPage.meetingHasExpectedStatus(data.statuses.prepared));
        });
    });

    test('[C64759] Check the meeting card (Started)', async ({apiHelper, meetingListingPage, homePage}) => {
        await meetingListingPage.createAndStartMeeting(apiHelper);
        await homePage.categoriesCardIsVisible();
        await meetingListingPage.goto(data.meetingsUrl);

        await test.step("Meeting card contains correct status", async () => {
            expect(await meetingListingPage.meetingHasExpectedStatus(data.statuses.started));
        });
    });

    test('[C65550] Check the meeting card (finished)', async ({apiHelper, page, homePage, meetingListingPage, userAccount}) => {
        await test.step("Create and start the meeting", async () => {
            await meetingListingPage.createAndStartMeeting(apiHelper);
            await homePage.preparedForTitleIsVisible();
        });
        await test.step("Finish meeting from User Account Menu", async () => {
            await userAccount.finishMeetingFromUserAccountMenu();
        });
        await test.step("Meeting card contains correct status", async () => {
            await page.goto(data.meetingsUrl);
            expect(await meetingListingPage.meetingHasExpectedStatus(data.statuses.finished));
        });
    })

    test('[C64764] User able to navigate to the Meeting listing empty page', async ({ page, meetingListingPage, homePage}) => {
        const userAccountMenu = homePage.userAccountMenu;

        await page.goto('',);
        await userAccountMenu.clickOnManageMeetingsMenuItem();

        await test.step("Check the empty meeting listing page", async () => {
            await expect(meetingListingPage.emptyPageSubTitle, 'Wrong subtitle').toBeVisible();
            const url = await meetingListingPage.getUrl();
            expect(url.endsWith(data.meetingsUrl), 'Wrong Url').toBeTruthy();
        });
    });

    test('[C64757] User able to see all created meetings on a meeting listing page', async ({apiHelper, meetingListingPage}) => {
        await apiHelper.createNewMeeting(2);
        await meetingListingPage.goto(data.meetingsUrl);
        await test.step("All created meeting are displayed in the list", async () => {
            expect(await meetingListingPage.getNumberOfMeetingCards()).toEqual(2);
        });
    });

    test('[C65549] Start the meeting from the Meeting listing page', async ({apiHelper, meetingListingPage, homePage}) => {
        await apiHelper.createNewMeeting();
        await meetingListingPage.goto(data.meetingsUrl);
        await test.step("Click on 'Start The Meeting' button", async () => {
            await meetingListingPage.clickStartMeetingButton();
        });
        await test.step("Correct person name displayed on the Home Page", async () => {
            expect(await homePage.getPersonName()).toEqual(data.createMeetingRequest.employeeName);
        });
    });

    // New Meeting page

    test('[C20086] New meeting is created after clicking on Start the meeting button', async ({newMeetingPage, homePage}) => {
        await newMeetingPage.goto(data.newMeetingUrl);
        await test.step("Search person by name and start meeting", async () => {
            await newMeetingPage.searchPersonByNameAndSelect(newMeetingData.personName);
            await newMeetingPage.searchRoleAndSelect(newMeetingData.expectedRole);
            await newMeetingPage.clickStartMeetingButton()
        });
        await test.step("Selected Person name is displayed on the home page", async () => {
            expect(await homePage.getPersonName()).toEqual(newMeetingData.personName);
        });
    });

    test('[C65673] User able to save the meeting', async ({newMeetingPage, meetingListingPage}) => {
        await newMeetingPage.goto(newMeetingData.setUpNewMeetingUrl);

        await expect(newMeetingPage.saveMeetingButton, 'save button is not disabled').toBeDisabled();
        await test.step("Search person by name and select", async () => {
            await newMeetingPage.searchPersonByNameAndSelect(newMeetingData.personName);
            await expect(newMeetingPage.saveMeetingButton, 'save button is not disabled').toBeDisabled();
        });
        await test.step("Search person by role and select", async () => {
            await newMeetingPage.searchRoleAndSelect(newMeetingData.expectedRole);
            await expect(newMeetingPage.saveMeetingButton, 'save button is not enabled').toBeEnabled();
        });
        await test.step("Click on the save button", async () => {
            expect(newMeetingPage.clickOnSaveMeetingButton(), 'Save button is not clickable');
        });
        await test.step("Meeting card is displayed on teh Meeting listing page with correct nme", async () => {
            expect(await meetingListingPage.meetingCardHasExpectedName(newMeetingData.personName), 'Meeting card is not displayed Meeting listing page');
        });
    });

    // Home page

    test('[C66584] "Connected with CxO" label triggered from the Home page (meeting started)', async ({apiHelper, page,  homePage, meetingListingPage}) => {
        const companyCard = homePage.companyCard;
        const shortCompanyPopup = homePage.shortCompanyPage;

        await meetingListingPage.createAndStartMeeting(apiHelper);
        await homePage.categoriesCardIsVisible();

        await test.step("Open the short company popup", async () => {
            const companyName = await companyCard.clickOnCompanyName();
            shortCompanyPopup.setInitialLocators(companyName);
        });
        await test.step("Click on 'Connect me' in short company popup", async () => {
            await shortCompanyPopup.clickOnConnectMeButton();
            await page.goto(data.meetingsUrl);
        });
        await test.step("'Connected with CxO' label is visible on the Meeting listing page", async () => {
            expect(await meetingListingPage.cxoLabelIsVisible()).toBeTruthy();
        });
    });

    test('[C66587] "Connected with Colleague" label triggered from the Home page (meeting started)', async ({apiHelper, page, homePage, meetingListingPage}) => {
        const companyCard = homePage.companyCard;
        const shortCompanyPopup = homePage.shortCompanyPage;
        await meetingListingPage.createAndStartMeeting(apiHelper);
        await homePage.categoriesCardIsVisible();

        await test.step("Open the short company popup", async () => {
            const companyName = await companyCard.clickOnCompanyName();
            shortCompanyPopup.setInitialLocators(companyName);
        });
        await test.step("Click on 'Connect my Colleague' in short company popup", async () => {
            await shortCompanyPopup.clickOnConnectMyColleagueButton();
            await page.goto(data.meetingsUrl);
        });
        await test.step("'Connected with Colleague' label is visible on the Meeting listing page", async () => {
            expect(await meetingListingPage.colleagueLabelIsVisible()).toBeTruthy();
        });
    });

    test('[C65551] Check the User account menu when the meeting was started', async ({newMeetingPage, homePage}) => {
        await newMeetingPage.startNewMeeting();
        const userAccountMenu = homePage.userAccountMenu;

        await test.step("Open User Account Menu", async () => {
            await homePage.categoriesCardIsVisible();
            await userAccountMenu.clickOnUserAccountIcon();
        });
        await test.step("'Ongoing Meeting' menu item is  Visible", async () => {
            await expect(userAccountMenu.ongoingMeetingMenuItem).toBeVisible();
        });
        await test.step("'Finish the meeting'  menu item is  Visible", async () => {
            expect(userAccountMenu.finishMeetingMenuItemIsVisible()).toBeTruthy();
        });
        await test.step("'Set up new meeting' menu item is Visible", async () => {
            await expect(userAccountMenu.setUpNewMeetingMenuItem).toBeVisible();
        });
        await test.step("'Manage meetings' menu item is Visible", async () => {
            await expect(userAccountMenu.manageMeetingsMenuItem).toBeVisible();
        });
        await test.step("'LogOut' Link is Visible", async () => {
            await userAccountMenu.logOutLinkIsVisible();
        });
    })

    test('[C77714] Redirect to all portfolio view - meeting started', async ({apiHelper, homePage, catalogAllCompaniesPage, meetingListingPage}) => {
        const companyCard = catalogAllCompaniesPage.companyCard;
        const sortingButton = catalogAllCompaniesPage.sortingButton;
        await meetingListingPage.createAndStartMeeting(apiHelper, meetingData.roleIdCIO);

        await test.step("Click on 'View all' button", async () => {
            await homePage.clickViewAllButton();
            await catalogAllCompaniesPage.validateTitleIsVisible();
        });
        await test.step("CIO role selected in breadcrumbs", async () => {
            expect(await catalogAllCompaniesPage.checkRoleChipIsActive(catalogAllCompaniesPage.CIOChip), 'Wrong role selected').toBeTruthy();
            expect(await companyCard.namePresent()).toBeTruthy();
        });
        await test.step("Recommended Sorting is selected", async () => {
            expect(await sortingButton.recommendedSortingIsSelected()).toBeTruthy()
        });
    });

    // featured companies

    test('[C79613] Featured companies are shown for the started meeting - Home page', async ({newMeetingPage, homePage}) => {
        const companyCard = homePage.companyCard;
        await newMeetingPage.goto('meetings/new');
        await newMeetingPage.searchPersonByNameAndSelect(newMeetingData.personName);
        await newMeetingPage.searchRoleAndSelect(newMeetingData.expectedRole);

        await test.step("Add 3 featured companies", async () => {
            await newMeetingPage.searchCompanyAndSelect(newMeetingData.featuredCompanies.postman);
            await newMeetingPage.searchCompanyAndSelect(newMeetingData.featuredCompanies.blaBlaCar);
            await newMeetingPage.searchCompanyAndSelect(newMeetingData.featuredCompanies.keyfactor);
        });
        allAddedCompanies = await newMeetingPage.getAllCompaniesNames();
        await test.step("Start the meeting", async () => {
            await newMeetingPage.clickStartMeetingButton();
            await homePage.categoriesCardIsVisible();
        });
        await test.step("Featured companies are sorted according to the order, that the user set during the creation the meeting", async () => {
            expect(await companyCard.getAllCompaniesNames()).toEqual(allAddedCompanies);
        });
    });

    test('[C79614] Featured companies are not shown for the NOT started meeting - Home page', async ({newMeetingPage, homePage, meetingListingPage}) => {
        const companyCard = homePage.companyCard;
        await newMeetingPage.goto('meetings/new');
        await newMeetingPage.searchPersonByNameAndSelect(newMeetingData.personName);
        await newMeetingPage.searchRoleAndSelect(newMeetingData.expectedRole);

        await test.step("Add 3 featured companies", async () => {
            await newMeetingPage.searchCompanyAndSelect(newMeetingData.featuredCompanies.postman);
            await newMeetingPage.searchCompanyAndSelect(newMeetingData.featuredCompanies.blaBlaCar);
            await newMeetingPage.searchCompanyAndSelect(newMeetingData.featuredCompanies.keyfactor);
        });
        allAddedCompanies = await newMeetingPage.getAllCompaniesNames();
        await test.step("Save the meeting", async () => {
            await newMeetingPage.clickOnSaveMeetingButton();
            await meetingListingPage.titleIsVisible();
        });
        await test.step("Navigate to the Home page", async () => {
            await meetingListingPage.goto('');
        });
        await test.step("Featured companies are NOT shown on the home page", async () => {
            expect(await companyCard.getAllCompaniesNames()).not.toEqual(allAddedCompanies);
        });
    });

    test('[C79623] Featured companies are not shown for the finished meeting - Home page', async ({newMeetingPage, homePage,}) => {
        const companyCard = homePage.companyCard;
        const userAccount = homePage.userAccountMenu;

        await newMeetingPage.goto('meetings/new');
        await newMeetingPage.searchPersonByNameAndSelect(newMeetingData.personName);
        await newMeetingPage.searchRoleAndSelect(newMeetingData.expectedRole);

        await test.step("Add 3 featured companies", async () => {
            await newMeetingPage.searchCompanyAndSelect(newMeetingData.featuredCompanies.postman);
            await newMeetingPage.searchCompanyAndSelect(newMeetingData.featuredCompanies.blaBlaCar);
            await newMeetingPage.searchCompanyAndSelect(newMeetingData.featuredCompanies.keyfactor);
        });
        allAddedCompanies = await newMeetingPage.getAllCompaniesNames();
        await test.step("Start the meeting", async () => {
            await newMeetingPage.clickStartMeetingButton();
            await companyCard.cardSkeletonIsNotVisible();
            await homePage.preparedForTitleIsVisible();
        });
        await test.step("Finish meeting", async () => {
            await userAccount.finishMeetingFromUserAccountMenu();
            await expect(homePage.personName).not.toBeVisible();
        });
        await test.step("Featured companies are NOT shown on the home page", async () => {
            expect(await companyCard.getAllCompaniesNames()).not.toEqual(allAddedCompanies);
        });
    });

    test('[C81993] Start saved meetings with featured companies', async ({newMeetingPage, homePage, meetingListingPage}) => {
        const companyCard = homePage.companyCard;
        await newMeetingPage.goto('meetings/new');
        await newMeetingPage.searchPersonByNameAndSelect(newMeetingData.personName);
        await newMeetingPage.searchRoleAndSelect(newMeetingData.expectedRole);

        await test.step("Add 3 featured companies", async () => {
            await newMeetingPage.searchCompanyAndSelect(newMeetingData.featuredCompanies.postman);
            await newMeetingPage.searchCompanyAndSelect(newMeetingData.featuredCompanies.blaBlaCar);
            await newMeetingPage.searchCompanyAndSelect(newMeetingData.featuredCompanies.keyfactor);
        });
        allAddedCompanies = await newMeetingPage.getAllCompaniesNames();
        await test.step("Save the meeting", async () => {
            await newMeetingPage.clickOnSaveMeetingButton();
            await meetingListingPage.titleIsVisible();
        });
        await test.step("Start the meeting from the meeting listing page", async () => {
            await meetingListingPage.clickStartMeetingButton();
            await homePage.categoriesCardIsVisible();
        });
        await test.step("Featured companies are sorted according to the order, that the user set during the creation the meeting", async () => {
            expect(await companyCard.getAllCompaniesNames()).toEqual(allAddedCompanies);
        });
    });
});