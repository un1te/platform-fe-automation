import { Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

export class OktaPage extends BasePage {

	readonly usernameInput: Locator;
	readonly passwordInput: Locator;
	readonly signInButton: Locator;

	constructor(page: Page) {
		super(page);
		this.usernameInput = this.page.locator("[name='identifier']");
		this.passwordInput = this.page.locator("[name='credentials.passcode']");
		this.signInButton = this.page.locator("[value='Sign in']");
	}

	async inputUsername(username: string) {
		await this.usernameInput.fill(username);
	}

	async inputPassword(password: string) {
		await this.passwordInput.fill(password);
	}

	async clickSignIn() {
		await this.waitAndClick(this.signInButton);
	}

	async login(username: string, password: string) {
		await this.inputUsername(username);
		await this.inputPassword(password);
		await this.clickSignIn();
	}

}