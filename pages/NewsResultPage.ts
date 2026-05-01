import { expect, Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";
import { CompaniesCard } from "./fragments/CompaniesCard";
import { ShortCompanyPage } from "./fragments/ShortCompanyPage";

export class NewsResultPage extends BasePage {
	readonly pageTitle: Locator;
	readonly companyCard: CompaniesCard;
	readonly shortCompanyPage: ShortCompanyPage;
	readonly newsTitle: Locator;
	readonly newsDescription: Locator;
	readonly relatedCompaniesTitle: Locator;
	readonly aboutArticleSection: Locator;
	readonly newsLink: Locator;
	readonly backButton: Locator;

	constructor(page: Page) {
		super(page);
		this.backButton = this.page.getByRole("button", { name: "Back to previous page" });
		this.companyCard = new CompaniesCard(this.page);
		this.shortCompanyPage = new ShortCompanyPage(this.page);
		this.pageTitle = this.page.locator("//h3").getByText("In the News");
		this.newsTitle = this.page.getByRole("heading",{ name:"newsitem title" });
		this.newsLink = this.page.getByRole("link",{ name:"news link" });
		this.newsDescription = this.page.getByRole("region",{ name:"summary" });
		this.aboutArticleSection = this.page.getByRole("region",{ name:"about article" });
		this.relatedCompaniesTitle = this.page.locator("//h5").getByText("Companies related to the topic");
	}

	async validateTitleIsVisible() {
		await expect(this.pageTitle).toBeVisible();
	}

	async getNewsTitle(): Promise<string> {
		return await this.newsTitle.textContent() ?? "";
	}

	async newsDescriptionNotEmpty(): Promise<boolean> {
		const description = await this.newsDescription.textContent();
		return description !== null && description.trim() !== "";
	}

	async newsLinkPresentAndNotEmpty(): Promise<boolean> {
		const href = await this.newsLink.getAttribute("href");
		return href !== null && href.trim() !== "";
	}
}
