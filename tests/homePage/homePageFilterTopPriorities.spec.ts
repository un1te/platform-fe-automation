import {STORAGE_STATE_USER} from "../../playwright.config";
import {test} from '../../fixtures/base';
import {HomePage} from "../../pages/HomePage";
import {expect} from "@playwright/test";
import data from "../../test_data/homePageData";

test.describe('Home page - Top priorities Filter', () => {
    test.use({storageState: STORAGE_STATE_USER});
    test.beforeEach(async ({homePage}) => {
        await test.step("Navigate to the Home page", async () => {
            await homePage.goto('',);
            await homePage.filterSkeletonIsNotVisible();
            await homePage.prioritiesCardIsVisible();

        })
    })

     test('[C19774] Check top priority cards', async ({page}) => {
        const homePage = new HomePage(page);

        await test.step("Check Priority Card is visible", async () => {
            await homePage.prioritiesCardIsVisible();
        });
        await test.step("Check Priority Card Title", async () => {
            expect(await homePage.getPriorityCardTitle()).toEqual(data.topPrioritiesTitle);
        });
    });

    test('[C19775] User able to select the top priority', async ({homePage}) => {
        let priorityName: string;

        await test.step("Any priority is not selected", async () => {
            await expect(homePage.selectedPriority).toBeHidden();
        });
        await test.step("Click the priority", async () => {
            priorityName = await homePage.clickOnPriorityChip();
        });
        await test.step("Priority is selected", async () => {
            await expect(homePage.selectedPriority).toBeVisible();
        });
        await test.step("Priority CTA button is displayed", async () => {
            expect(await homePage.topPrioritiesCTAButtonIsDisplayed(priorityName));
        });
    });

    test('[C19779] User able to see more/less top priorities', async ({page}) => {
        const homePage = new HomePage(page);

        await test.step("Priorities Card is Collapsed", async () => {
            await expect(homePage.prioritiesCardExpended).toBeHidden();
        });
        await test.step("Click the 'More' button", async () => {
            await homePage.clickOnMorePrioritiesButton();
        });
        await test.step("Priorities Card is expanded", async () => {
            await expect(homePage.prioritiesCardExpended).toBeVisible()
        });
        await test.step("Click the 'Less' button", async () => {
            await homePage.clickOnLessPrioritiesButton();
        });
        await test.step("Priorities Card is Collapsed", async () => {
            await expect(homePage.prioritiesCardExpended).toBeHidden();
        });
    });
});
