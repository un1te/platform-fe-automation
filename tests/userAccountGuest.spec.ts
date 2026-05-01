import { test } from "../fixtures/base";
import { HomePage } from "../pages/HomePage";
import { expect } from "@playwright/test";

test.describe("User account menu - Guest", () => {

	test("[C20525] User account icon is NOT visible for non authorized user", async ({ page }) => {
		const homePage = new HomePage(page);
		const userAccountMenu = homePage.userAccountMenu;

		await test.step("Navigate to the Home page", async () => {
			await page.goto("");
		});
		await test.step("User account icon is not visible", async () => {
			await expect(userAccountMenu.userIcon).not.toBeVisible();
		});
	});
});
