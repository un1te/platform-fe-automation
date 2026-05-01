import { expect, Locator, Page } from "@playwright/test";
import BasePage from "../BasePage";

export class SortingButton extends BasePage {
	readonly page: Page;
	readonly sortingButton: Locator;
	readonly recommendedChip: Locator;
	readonly alphabeticalChip: Locator;
	private recommendedSortingIcon: Locator;
	private alphabeticalSortingIcon: Locator;


	constructor(page: Page) {
		super(page);
		this.page = page;
		this.sortingButton = page.getByRole("button", { name: "sorting control" });
		this.recommendedSortingIcon = this.sortingButton.locator("clipPath[id*=\"clip0_8750_236196\"]" );
		this.alphabeticalSortingIcon = this.sortingButton.locator("clipPath[id*=\"clip0_8750_236176\"]" );
		this.recommendedChip = page.getByRole("button", { name: "sorting chip - score" });
		this.alphabeticalChip = page.getByRole("button", { name: "sorting chip - name" });
	}

	async sortingButtonIsVisible(): Promise<boolean> {
		return await this.sortingButton.isVisible() ?? false;
	}

	async recommendedChipIsVisible(): Promise<boolean> {
		return await this.recommendedChip.isVisible();
	}

	async alphabeticalChipIsVisible(): Promise<boolean> {
		return await this.alphabeticalChip.isVisible();
	}

	async recommendedSortingIsSelected(): Promise<boolean> {
		await this.sortingButtonIsVisible();
		return await this.recommendedSortingIcon.count() > 0;
	}

	async alphabeticalSortingIsSelected(): Promise<boolean> {
		await this.sortingButtonIsVisible();
		return await this.alphabeticalSortingIcon.count() > 0;
	}

	async clickOnSortingButton() {
		await this.sortingButtonIsVisible();
		await this.waitAndClick(this.sortingButton);
	}

	async checkSortingChipIsActive(locator: Locator): Promise<boolean> {
		await expect(locator).toBeVisible();
		const className = await locator.getAttribute("class");
		return className?.includes("outlinedPrimary") ?? false;
	}

	async selectRecommendedSorting() {
		await this.sortingButtonIsVisible();
		await this.waitAndClick(this.sortingButton);
		await this.waitAndClick(this.recommendedChip);
		await this.recommendedSortingIsSelected();
	}

	async selectAlphabeticalSorting() {
		await this.sortingButtonIsVisible();
		await this.waitAndClick(this.sortingButton);
		await this.waitAndClick(this.alphabeticalChip);
		await this.alphabeticalSortingIsSelected();
	}
}
