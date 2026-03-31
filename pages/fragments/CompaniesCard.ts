import {expect, Locator, Page} from '@playwright/test';
import BasePage from "../BasePage";

export class CompaniesCard extends BasePage{
    readonly page: Page;
    readonly card: Locator;
    readonly companyName: Locator;
    readonly logo: Locator;
    readonly oneLiner: Locator;
    readonly description: Locator;
    readonly menuButton: Locator;
    readonly connectMeMenuItem: Locator;
    readonly connectMyColleagueMenuItem: Locator;
    readonly companyLegalInfo: Locator;
    readonly logosSection: Locator;
    readonly menu: Locator;
    readonly cardSkeleton: Locator;

    constructor(page: Page) {
        super(page)
        this.page = page;
        this.card = page.getByRole('gridcell', { name:  'company card' });
        this.cardSkeleton = page.getByRole('gridcell', { name:  'company card placeholder' });
        this.companyName = this.card.first().locator('h5');
        this.logo = this.card.first().locator('img[class*="CompanyCard_logo"]');
        this.oneLiner = this.card.first().locator('div[class*="CompanyCard_oneLiner"]');
        this.description = this.card.first().locator('p[class*="CompanyCard_description"]');
        this.companyLegalInfo = this.card.first().getByRole('region', { name:  'legal info' });
        this.logosSection = this.card.first().getByRole('region', { name:  'clients' });
        
        this.menuButton = this.card.first().getByRole('button');
        this.menu = page.locator('ul[aria-label="card actions menu"]')
        this.connectMeMenuItem = this.menu.getByText('Connect me');
        this.connectMyColleagueMenuItem = this.menu.getByText('Connect my colleague');
    }

    async cardSkeletonIsNotVisible() {
        await expect(this.cardSkeleton).toHaveCount(0);
    }

    async countCompanyCards() : Promise<number>  {
        await this.card.first().waitFor({ state: 'visible' });
        return await this.card.count();
    }

    async namePresent(): Promise<boolean> {
        return this.isElementWithTextVisible(this.companyName);
    }

    async logoPresent(): Promise<boolean> {
        return this.isElementWithAttributePresent(this.logo, 'src');
    }

    async oneLinerPresent(): Promise<boolean> {
        return this.isElementWithTextVisible(this.oneLiner);
    }

    async descriptionPresent(): Promise<boolean> {
        return this.isElementWithTextVisible(this.description);
    }

    async menuIsVisible(): Promise<void> {
        await this.menuButton.waitFor({ state: 'visible' });
        await this.menuButton.click();
        await expect(this.connectMeMenuItem).toBeVisible();
    }

    async clickOnMenu(): Promise<void> {
        await this.menuButton.isVisible()
        await this.menuButton.click();
    }

    async connectMeMenuItemIsVisible(): Promise<void> {
        await expect(this.connectMeMenuItem).toBeVisible();
    }

    async connectMyColleagueMenuItemIsVisible(): Promise<void> {
        await expect(this.connectMyColleagueMenuItem).toBeVisible();
    }

    async clientsLogosPresentInCard(): Promise<boolean> {
        const imgElements: Locator = this.logosSection.locator('img');
        const imgCount = await imgElements.count();
        expect(imgCount).toBeGreaterThan(0);
        let empty = 0;
        for (let i = 0; i < imgCount; i++) {
            const imgSrc = await imgElements.nth(i).getAttribute('src');
            if (imgSrc == null || imgSrc == '') {
                empty++;
            }
        }
        return empty === 0;
    }

    async companyLegalInfoPresentInCard(): Promise<void> {
        const column1: Locator = this.companyLegalInfo.locator('ul').first().locator('li');
        const column2: Locator = this.companyLegalInfo.locator('ul').nth(1).locator('li');
        const infoCount = await column1.count() + await column2.count();
        expect(infoCount).toBeGreaterThan(0);
    }

    async clickOnConnectMeMenuItem(): Promise<void> {
        await this.clickOnMenu();
        await expect(this.connectMeMenuItem).toBeVisible();
        await this.waitAndClick(this.connectMeMenuItem)
        await this.menu.isHidden()
    }

    async clickOnConnectMyColleagueMenuItem(): Promise<void> {
        await this.clickOnMenu();
        await expect(this.connectMyColleagueMenuItem).toBeVisible();
        await this.connectMyColleagueMenuItem.click();
        await this.menu.isHidden();
    }

    async clickOnCompanyName(): Promise<string>{
        await this.page.waitForTimeout(500);
        const companyName = await this.companyName.textContent();
        await this.waitAndClick(this.companyName);
        return companyName;
    }
    async getNumberOfCards(): Promise<number> {
        await  this.card.last().waitFor({ state: 'visible', timeout: 4000 });
        return await this.card.count();
    }
    async getAllCompaniesNames(): Promise<string[]> {
        const cardCount = await this.getNumberOfCards();
        await expect(this.card.nth(cardCount-1)).toBeVisible()
        return await this.card.locator('h5').allTextContents();
    }
}
