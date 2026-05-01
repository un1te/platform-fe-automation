import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";
import { CompaniesCard } from "./fragments/CompaniesCard";
import { ShortCompanyPage } from "./fragments/ShortCompanyPage";
import { SortingButton } from "./fragments/SortingButton";

export class CatalogPage extends BasePage {
	readonly title: Locator;
	readonly companyCard: CompaniesCard;
	readonly shortCompanyPage: ShortCompanyPage;
	readonly sortingButton: SortingButton;
	readonly breadcrumbsArea: Locator;
	readonly firstLevelBreadCrumbs: Locator;
	readonly secondLevelBreadCrumbs: Locator;
	readonly thirdLevelBreadCrumbs: Locator;
	readonly breadcrumbsExpandedArea: Locator;
	readonly marketCategoryChip: Locator;
	readonly topPriorityChip: Locator;
	readonly allMarketCategoryChip: Locator;
	readonly allTopPriorityChip: Locator;

	constructor(page: Page) {
		super(page);
		this.companyCard = new CompaniesCard(this.page);
		this.sortingButton = new SortingButton(this.page);
		this.shortCompanyPage = new ShortCompanyPage(this.page);

		this.title = this.page.locator("h3").getByText("Portfolio");
		this.breadcrumbsArea = this.page.getByRole("menu", { name: "breadcrumbs" });
		this.firstLevelBreadCrumbs = this.breadcrumbsArea.getByRole("button").first();
		this.secondLevelBreadCrumbs = this.breadcrumbsArea.getByRole("button").nth(1);
		this.thirdLevelBreadCrumbs = this.breadcrumbsArea.getByRole("button").nth(2);
		this.breadcrumbsExpandedArea = this.page.getByRole("list", { name: "chips" });
		this.marketCategoryChip = this.breadcrumbsExpandedArea.getByRole("button", { name: "chip - Market Categories" });
		this.topPriorityChip = this.breadcrumbsExpandedArea.getByRole("button", { name: "chip - Top Priorities" });
		this.allMarketCategoryChip = this.breadcrumbsExpandedArea.getByRole("button", { name: "chip - All Market Categories" });
		this.allTopPriorityChip = this.breadcrumbsExpandedArea.getByRole("button", { name: "chip - All Top Priorities" });
	}

	async titleIsVisible(): Promise<boolean> {
		return this.title.isVisible();
	}

	async getFirstLevelBreadCrumbsName(): Promise<string> {
		try {
			await expect(this.firstLevelBreadCrumbs).toBeVisible();
		} catch {
			throw new Error("First level breadcrumb is not visible");
		}
		return await this.firstLevelBreadCrumbs.textContent() || "";
	}

	async getSecondLevelBreadCrumbsName(): Promise<string> {
		await expect(this.secondLevelBreadCrumbs).toBeVisible();
		return await this.secondLevelBreadCrumbs.textContent() ?? "";
	}

	async getThirdLevelBreadCrumbsName(): Promise<string> {
		await expect(this.thirdLevelBreadCrumbs).toBeVisible();
		return await this.thirdLevelBreadCrumbs.textContent() ?? "";
	}

	async clickOnBreadcrumb(breadcrumbLevel: Locator) {
		await expect(breadcrumbLevel).toBeVisible();
		await this.waitAndClick(breadcrumbLevel);

	}

	async breadcrumbsAreExpanded(): Promise<boolean> {
		return await this.breadcrumbsExpandedArea.isVisible();
	}



	async selectChipFromDropdown(breadcrumbLevel: Locator, chipNumber: number): Promise<string> {
		const chipName = await this.breadcrumbsExpandedArea.getByRole("button").nth(chipNumber).textContent();
		await this.waitAndClick(this.breadcrumbsExpandedArea.getByRole("button").nth(chipNumber));
		return chipName ?? "";
	}

	async checkBreadcrumbsChipIsActive(chipName: string): Promise<boolean> {
		const locator = this.breadcrumbsExpandedArea.getByRole("button", { name: `chip - ${chipName}` });
		await expect(locator).toBeVisible();
		const className = await locator.getAttribute("class");
		return className?.includes("outlinedPrimary") ?? false;
	}

	async chipNameIsPresentInExpandedBreadcrumbs(chipName: string): Promise<boolean> {
		const locator = this.breadcrumbsExpandedArea.getByRole("button").getByText(`${chipName}`);
		return await locator.isVisible();
	}
}
