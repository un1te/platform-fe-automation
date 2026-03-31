import {STORAGE_STATE_USER} from "../../playwright.config";
import {test} from '../../fixtures/base';
import {expect} from "@playwright/test";
import data from "test_data/shortCompanyData"

test.describe('News result Page - Short Company page', () => {
    test.use({storageState: STORAGE_STATE_USER});
    let companyName: string;
    let companiesOnNewResultPage: string[];
    test.beforeEach(async ({homePage, newsResultPage}) => {
        await homePage.goto('',);
        await homePage.navigateToNewsResultPage();
        await newsResultPage.validateTitleIsVisible();
        const companyCard = newsResultPage.companyCard;
        companyName = await companyCard.clickOnCompanyName();
        companiesOnNewResultPage = await companyCard.getAllCompaniesNames();
        const shortCompanyPopup = newsResultPage.shortCompanyPage;
        shortCompanyPopup.setInitialLocators(companyName);
    });

    test('[C72072] Company pop-up is opened on the News Result page', async ({newsResultPage}) => {
        const shortCompanyPopup = newsResultPage.shortCompanyPage;
        await test.step("ShortCompany Popup is opened", async () => {
            await expect(shortCompanyPopup.slide).toBeVisible();
        });
        await test.step("Check breadcrumbs path", async () => {
            expect(await shortCompanyPopup.getBreadcrumbsContent()).toEqual(data.expectedBreadcrumbsOnNewsResultPage + companyName);
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
        })
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

    test('[C77258] User can close Company pop-up on the News Result page', async ({newsResultPage}) => {
        const shortCompanyPopup = newsResultPage.shortCompanyPage;
        await shortCompanyPopup.clickOnCloseButton();
        await test.step("ShortCompany Popup is closed", async () => {
            await expect(shortCompanyPopup.slide).not.toBeVisible();
        });
    });

    test('[C77259] Companies in slider correspond the companies on the News result page', async ({newsResultPage}) => {
        const shortCompanyPopup = newsResultPage.shortCompanyPage;
        await test.step("Companies In Slider correspond tpo the companies on the News result page", async () => {
            const companiesInSlider = await shortCompanyPopup.getAllCompanies();
            expect(companiesInSlider).toEqual(companiesOnNewResultPage);
        });
    });
})