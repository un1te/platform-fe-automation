import { defineConfig, devices } from "@playwright/test";
import * as path from "node:path";
import * as process from "node:process";
import { testPlanFilter } from "allure-playwright/testplan";

export const STORAGE_STATE_USER = path.join(__dirname, ".auth/user.json");

const testRailOptions = {
	embedAnnotationsAsProperties: true,
	outputFile: "./test-results/junit-report.xml",
};
export default defineConfig({
	globalSetup: "./helpers/utils/globalSetup.js",
	testDir: "./tests",
	grep: testPlanFilter(),
	reporter: [
		["list"],
		["junit", testRailOptions],
		["allure-playwright",
			{
				detail: false,
				outputFolder: "allure-results",
				suiteTitle: false,
			},
		],
	],
	timeout: 60 * 1000,


	expect: {
		timeout: 10000,
	},
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 5,
	use: {
		baseURL: process.env.BASE_URL,
		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "on-first-retry",
	},

	/* Configure projects for major browsers */
	projects: process.env.CI ? [
		{
			name: "setup",
			testMatch: "**/*.setup.ts",
			use: {
				headless: true,
			},
		},
		{
			name: "iPad Pro 11 - Chrome",
			dependencies: ["setup"],
			use: {
				...devices["iPad Pro 11 landscape"],
				launchOptions: {
					headless: true,
				},
			},
		},
	] :
		[
			{
				name: "setup",
				testMatch: "**/*.setup.ts",
				use: {
					headless: true,
				},
			},
			{
				name: "Desktop Chrome",
				testMatch: "**/*.spec.ts",
				dependencies: ["setup"],
				use: {
					...devices["Desktop Chrome"],
					launchOptions: {
						headless: true,
					},
				},
			},
		],
});