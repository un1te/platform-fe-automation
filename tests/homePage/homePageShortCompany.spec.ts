import {STORAGE_STATE_USER} from "../../playwright.config";
import {test} from '../../fixtures/base';
import {expect} from "@playwright/test";
import data from "test_data/shortCompanyData"

test.describe('Home Page - Short Company page', () => {
    test.use({storageState: STORAGE_STATE_USER});
    let companyName: string;
    let companiesOnHomePage: string[];
    test.beforeEach(async ({ homePage}) => {
        const companyCard = homePage.companyCard;

        await test.step("Navigate to the home page", async () => {
            await homePage.goto('');
            await homePage.companyCard.cardSkeletonIsNotVisible();
            expect(await companyCard.namePresent()).toBeTruthy();
        });
        companiesOnHomePage = await companyCard.getAllCompaniesNames();
        await test.step("Click on the company card", async () => {
            companyName = await companyCard.clickOnCompanyName();
            const shortCompanyPopup = homePage.shortCompanyPage;
            shortCompanyPopup.setInitialLocators(companyName);
        });

    });

    test('[C67556] Check short company page content on the Home page', async ({homePage}) => {
        const shortCompanyPopup = homePage.shortCompanyPage;

        await test.step("ShortCompany Popup is opened", async () => {
            await expect(shortCompanyPopup.slide).toBeVisible();
        });
        await test.step("Check breadcrumbs path", async () => {
            expect(await shortCompanyPopup.getBreadcrumbsContent()).toEqual(data.expectedBreadcrumbsRecommended + companyName);
        });
        await test.step("Connect My / My Colleague buttons are present and enabled", async () => {
            await expect(shortCompanyPopup.connectMeButton).toBeEnabled();
            await expect(shortCompanyPopup.connectMyColleagueButton).toBeEnabled();
        });
        await test.step("Close button is present", async () => {
            await expect(shortCompanyPopup.closeButton).toBeVisible()
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
            await expect(shortCompanyPopup.descriptionTitle).toBeVisible()
            expect(await shortCompanyPopup.descriptionTextPresent()).toBeTruthy()
        });
        await test.step("legalInfo is displayed and not null", async () => {
            expect(await shortCompanyPopup.legalInfoPresent()).toBeTruthy()
            expect(await shortCompanyPopup.legalInfoDoNotContainsNull()).toBeTruthy()
            expect(await shortCompanyPopup.linkPresentInLegalInfoSection()).toBeTruthy()
        });
    });

    test('[C67551] Short company page pop-up is closed via Close (X) button', async ({homePage}) => {
        const shortCompanyPopup = homePage.shortCompanyPage;
        await shortCompanyPopup.clickOnCloseButton();
        await test.step("ShortCompany Popup is closed", async () => {
            await expect(shortCompanyPopup.slide).not.toBeVisible();
        });
    });

    test('[C77523] Companies in the slider correspond to the companies on the Home page', async ({homePage}) => {
        const shortCompanyPopup = homePage.shortCompanyPage;
        const companiesInSlider = await shortCompanyPopup.getAllCompanies();
        await test.step("Companies In Slider correspond tpo the companies on the Home page", async () => {
            expect(companiesInSlider).toEqual(companiesOnHomePage);
        });
    });
});