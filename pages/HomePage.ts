import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";
import { CompaniesCard } from "./fragments/CompaniesCard";
import { UserAccount } from "./fragments/UserAccount";
import { ShortCompanyPage } from "./fragments/ShortCompanyPage";

export class HomePage extends BasePage {
	readonly  signInButton: Locator;
	readonly categoriesCard: Locator;
	readonly prioritiesCard:Locator;
	readonly viewAllButton: Locator;
	readonly companyCard: CompaniesCard;
	readonly userAccountMenu: UserAccount;
	readonly categoriesCardTitle: Locator;
	readonly categoriesChipsList: Locator;
	readonly categoriesChipName: Locator;
	readonly selectedCategory: Locator;
	readonly prioritiesCardTitle: Locator;
	readonly prioritiesCTAButton: Locator;
	readonly prioritiesChipsList: Locator;
	readonly priorityChipName: Locator;
	readonly selectedPriority: Locator;
	readonly moreButton: Locator;
	readonly prioritiesCardExpended: Locator;
	readonly lessButton: Locator;
	readonly personName: Locator;
	readonly newsCard: Locator;
	readonly newsItem: Locator;
	readonly newsItemDescription: Locator;
	readonly newsCompaniesLogos: Locator;
	readonly newsCardTitle: Locator;
	readonly filterNewsTitle: Locator;
	readonly shortCompanyPage: ShortCompanyPage;
	readonly categoriesCTAButton: Locator;
	readonly personRoleDropdown: Locator;
	readonly rolesChips: Locator;
	readonly filtersSkeleton: Locator;
	readonly preparedForTitle: Locator;
	readonly subCategoriesChipsList: Locator;
	readonly subCategoriesChipName: Locator;

	constructor(page: Page) {
		super(page);
		this.shortCompanyPage = new ShortCompanyPage(this.page);

		this.signInButton = this.page.getByText("Sign In with OKTA");
		this.viewAllButton = this.page.getByRole("button", { name: "View All" });

		this.filtersSkeleton = this.page.getByTestId("filter-placeholder");

		this.categoriesCard = this.page.getByTestId("filter-market-categories");
		this.categoriesCardTitle = this.categoriesCard.locator("//h5");
		this.categoriesChipsList = this.categoriesCard.getByRole("listbox").first();
		this.categoriesChipName = this.categoriesChipsList.getByRole("listitem");
		this.subCategoriesChipsList = this.categoriesCard.locator("div[class*=\"_chipsList_\"]").nth(1);
		this.subCategoriesChipName = this.subCategoriesChipsList.getByRole("listitem");
		this.selectedCategory = this.categoriesCard.locator("div[class*=\"MuiChip-colorPrimary\"]");
		this.categoriesCTAButton = this.categoriesCard.getByRole("button", { name: "Explore" });

		this.prioritiesCard = this.page.getByTestId("filter-top-priorities");
		this.prioritiesCardExpended = this.page.locator("div[class*=\"primary_expanded\"]");
		this.prioritiesCardTitle = this.prioritiesCard.locator("//h5");
		this.prioritiesChipsList = this.prioritiesCard.getByRole("listbox");
		this.priorityChipName = this.prioritiesCard.getByRole("listitem");
		this.selectedPriority = this.prioritiesCard.locator("div[class*=\"MuiChip-colorPrimary\"]");
		this.prioritiesCTAButton = this.prioritiesCard.getByText("Explore");
		this.moreButton = this.prioritiesCard.getByRole("button", { name: "More" });
		this.lessButton = this.prioritiesCard.getByRole("button", { name: "Less" });

		this.newsCard = this.page.getByTestId("filter-news");
		this.newsCardTitle = this.newsCard.locator("//h5");
		this.newsItem = this.newsCard.locator("div[class*=\"FilterNews_item\"]").first();
		this.filterNewsTitle = this.newsItem.locator("div[class*=\"FilterNews_title\"]");
		this.newsItemDescription = this.newsItem.locator("div[class*=\"FilterNews_title\"]");
		this.newsCompaniesLogos = this.newsItem.locator("div[class*=\"FilterNews_companies\"]");

		this.companyCard = new CompaniesCard(this.page);
		this.userAccountMenu = new UserAccount(this.page);

		this.preparedForTitle = this.page.getByText("Prepared for");
		this.personName = this.page.locator("h3", { hasText: "Prepared for" }).locator("..").locator("h3").nth(1);
		this.personRoleDropdown = this.page.locator("h3", { hasText: "Prepared for" }).locator("..").getByRole("button");
		this.rolesChips = this.page.getByRole("listbox", { name: "roles" }).getByRole("listitem");
	}

	async clickSignIn() {
		await this.waitAndClick(this.signInButton);
	}

	async categoriesCardIsVisible() {
		await expect(this.categoriesCard).toBeVisible();
	}

	async filterSkeletonIsNotVisible() {
		await expect(this.filtersSkeleton).toHaveCount(0);
	}

	async getCategoryCardTitle():Promise<string> {
		return await this.categoriesCardTitle.textContent() ?? "";
	};

	async getCategoriesCount():Promise<number> {
		await this.categoriesCardIsVisible();
		return await this.categoriesChipName.count();
	};

	async getSubCategoriesCount():Promise<number> {
		await expect(this.subCategoriesChipName.first()).toBeVisible();
		return await this.subCategoriesChipName.count();
	};

	async getListOfCategories(): Promise<string[]> {
		const listOfCategories: string[] = [];
		const count= await this.categoriesChipName.count();
		for (let i = 0; i < count; i++) {
			const text = await this.categoriesChipName.nth(i).textContent();
			if (text) {
				listOfCategories.push(text.trim());
			}
		}
		return listOfCategories;
	}

	async clickOnCategoryChip(): Promise<string> {
		const categoryName =  await this.categoriesChipName.first().textContent();
		await this.waitAndClick(this.categoriesChipName.first());
		return categoryName ?? "";
	};

	async clickOnSubCategoryChip(): Promise<string> {
		const subCategoryName =  await this.subCategoriesChipName.first().textContent();
		await this.waitAndClick(this.subCategoriesChipName.first());
		return subCategoryName ?? "";
	};

	async clickViewAllButton() {
		await this.viewAllButton.click();
		await this.viewAllButton.waitFor({ state: "hidden" });
	};

	async prioritiesCardIsVisible() {
		await expect(this.prioritiesCard).toBeVisible();
	}

	async getPriorityCardTitle():Promise<string> {
		return await this.prioritiesCardTitle.textContent() ?? "";
	};

	async clickOnPriorityChip(): Promise<string> {
		const priorityName = await this.priorityChipName.first().textContent();
		await this.priorityChipName.first().click();
		return priorityName ?? "";
	};

	async clickOnMorePrioritiesButton() {
		await this.moreButton.click();
	};

	async clickOnLessPrioritiesButton() {
		await this.lessButton.click();
	};

	async getPersonName(): Promise<string> {
		await expect(this.personName).toBeVisible();
		return await this.personName.textContent() ?? "";
	};

	async newsCardIsVisible() {
		await expect(this.newsCard).toBeVisible();
	}

	async getNewsCardTitle():Promise<string> {
		return await this.newsCardTitle.textContent() ?? "";
	};

	async newsDescriptionPresentsInNewsCard(): Promise<void> {
		expect((await this.newsItemDescription.textContent())?.trim()).not.toBe("");
	};

	async clientsLogosPresentInNewsCard(): Promise<void> {
		const imgElements: Locator = this.newsCompaniesLogos.locator("img");

		const imgCount = await imgElements.count();
		expect(imgCount).toBeGreaterThan(0);
		for (let i = 0; i < imgCount; i++) {
			const imgSrc = await imgElements.nth(i).getAttribute("src");
			expect(imgSrc).not.toBeNull();
			expect(imgSrc).not.toBe("");
		}
	}

	async navigateToNewsResultPage(): Promise<string> {
		const textContent = await this.filterNewsTitle.textContent();
		await this.filterNewsTitle.click();
		return textContent ?? "";
	}

	async categoriesCTAButtonIsDisplayed(categoryName: string) {
		await expect(this.categoriesCard.getByRole("button").getByText("Explore "+ categoryName)).toBeVisible();
	}

	async topPrioritiesCTAButtonIsDisplayed(priorityName: string) {
		await expect(this.prioritiesCard.getByRole("button").getByText("Explore "+ priorityName)).toBeVisible();
	}

	async clickOnCategoriesCTAButton() {
		await this.waitAndClick(this.categoriesCTAButton);
	}

	async clickOnPriorityCTAButton() {
		await this.waitAndClick(this.prioritiesCTAButton);
	}

	async preparedForTitleIsVisible() {
		await expect(this.preparedForTitle).toBeVisible();
	}

	async selectCategoryAndNavigateToCatalogPage(): Promise<string> {
		const category = await this.clickOnCategoryChip();
		await this.clickOnCategoriesCTAButton();
		return category;
	}

	async selectSubCategoryAndNavigateToCatalogPage(): Promise<string[]> {
		const category = await this.clickOnCategoryChip();
		const subCategory = await this.clickOnSubCategoryChip();
		await this.clickOnCategoriesCTAButton();
		return [category, subCategory];
	}

	async selectTopPriorityAndNavigateToCatalogPage(): Promise<string> {
		const topPriority = await this.clickOnPriorityChip();
		await this.clickOnPriorityCTAButton();
		return topPriority;
	}
}
