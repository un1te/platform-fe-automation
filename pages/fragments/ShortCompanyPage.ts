import { expect, Locator, Page } from "@playwright/test";
import BasePage from "../BasePage";

export class ShortCompanyPage extends BasePage {
	readonly page: Page;
	readonly companiesSlider: Locator;
	public slide!: Locator;
	public breadcrumbs!: Locator;
	public connectMeButton!: Locator;
	public connectMyColleagueButton!: Locator;
	public closeButton!: Locator;
	public companyName!: Locator;
	public oneLiner!: Locator;
	public descriptionSection!: Locator;
	public descriptionText!: Locator;
	public legalInfo!: Locator;
	public caseStudySection!: Locator;
	public enterpriseBuyersSection!: Locator;
	public enterpriseBuyersTitle!: Locator;
	public caseStudyTitle!: Locator;
	public descriptionTitle!: Locator;
	public legalInfoLink!: Locator;

	constructor(page: Page) {
		super(page);
		this.page = page;
		this.companiesSlider = page.getByRole("list", { name: "Companies Slider" });
	}

	setInitialLocators(companyName: string): void {
		this.slide = this.companiesSlider.getByLabel(`Slide ${companyName}`);
		this.breadcrumbs = this.slide.getByRole("navigation");
		this.connectMeButton = this.slide.getByRole("button", { name: "Connect me" });
		this.connectMyColleagueButton = this.slide.getByRole("button", { name: "Connect my colleague" });
		this.closeButton = this.slide.getByRole("button", { name: "Close Companies Slider" });
		this.companyName = this.slide.locator("//h4");
		this.oneLiner = this.slide.locator("span[role=\"mark\"]");
		this.descriptionSection = this.slide.getByRole("region", { name: "description" });
		this.descriptionTitle = this.descriptionSection.locator("//h3").getByText("Description");
		this.descriptionText = this.descriptionSection.locator("//div/span").first();
		this.legalInfo = this.descriptionSection.getByRole("list");
		this.legalInfoLink = this.legalInfo.locator("li").last().locator("a");
		this.caseStudySection = this.slide.getByRole("region", { name: "case studies" });
		this.caseStudyTitle = this.caseStudySection.locator("//h3").getByText("Case Studies");
		this.enterpriseBuyersSection = this.slide.getByRole("region", { name: "enterprise buyers" });
		this.enterpriseBuyersTitle = this.enterpriseBuyersSection.locator("//h3").getByText("Enterprise buyers");
	}

	async companyLogoPresent(companyName: string): Promise<boolean> {
		const logo =  this.slide.getByRole("img", { name: `${companyName} Logo` });
		await expect(logo).toBeVisible();
		const src = await logo.getAttribute("src");
		return src !== null && src !== "";
	}

	async getBreadcrumbsContent(): Promise<string> {
		await expect(this.breadcrumbs).toBeVisible();
		const paragraphs = this.breadcrumbs.locator("p");
		const texts = await paragraphs.allTextContents();
		return texts.join("");
	}

	async getCompanyName(): Promise<string> {
		return await this.companyName.textContent() ?? "";
	}

	async descriptionTextPresent(): Promise<boolean> {
		const text = await this.descriptionText.textContent();
		return text !== null && text.trim() !== "";
	}

	async legalInfoPresent(): Promise<boolean> {
		const text = await this.legalInfo.textContent();
		return text !== null && text.trim() !== "";
	}

	async legalInfoDoNotContainsNull(): Promise<boolean> {
		const text = await this.legalInfo.textContent();
		return text !== null && !text.includes("null");
	}

	async linkPresentInLegalInfoSection(): Promise<boolean> {
		const href = await this.legalInfoLink.getAttribute("href");
		return href !== null && href.trim() !== "";
	}

	async clickOnCloseButton(): Promise<void> {
		await this.waitAndClick(this.closeButton);
	}

	async getAllCompanies(): Promise<string[]> {
		await  this.companiesSlider.getByLabel("Slide").locator("//h4").last().waitFor({ state: "visible", timeout: 4000 });
		const slideCount = await this.companiesSlider.getByLabel("Slide").locator("//h4").count();
		await expect(this.companiesSlider.getByLabel("Slide").locator("//h4").nth(slideCount-1)).toBeVisible();
		return await this.companiesSlider.getByLabel("Slide").locator("//h4").allTextContents();
	}

	async clickOnConnectMeButton(): Promise<void> {
		await this.waitAndClick(this.connectMeButton);
		await this.page.waitForTimeout(800);
	}

	async clickOnConnectMyColleagueButton(): Promise<void> {
		await this.waitAndClick(this.connectMyColleagueButton);
		await this.page.waitForTimeout(800);
	}
}
