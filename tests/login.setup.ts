import { test as setup } from '../fixtures/base'
import { STORAGE_STATE_USER } from '../playwright.config'
import * as process from "node:process";

setup('[C18862] Login with valid user credentials', async ({ page, loginPage, homePage }) => {
    await homePage.goto('');
    await homePage.clickSignIn();
    await loginPage.login(process.env.USERNAME, process.env.PASSWORD);
    await homePage.categoriesCardIsVisible();
    await page.context().storageState({ path: STORAGE_STATE_USER });
});