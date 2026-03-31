import {expect, Locator, Page} from "@playwright/test";
import BasePage from "./BasePage";
import {CompaniesCard} from "./fragments/CompaniesCard";
import {SortingButton} from "./fragments/SortingButton";

export class CatalogPageAllCompaniesPage extends BasePage {
    readonly title: Locator;
    readonly companyCard: CompaniesCard;
    readonly breadCrumbs: Locator;
    readonly allRolesChip: Locator;
    readonly CIOChip: Locator;
    readonly CISOChip: Locator;
    readonly sortingButton: SortingButton;

    constructor(page: Page) {
        super(page)
        this.companyCard = new CompaniesCard(this.page);
        this.sortingButton = new SortingButton(this.page);
        this.title = this.page.locator('h3').getByText('All Portfolio Companies');
        this.breadCrumbs = this.page.getByRole('menu', {name: 'breadcrumbs'});
        this.allRolesChip = this.breadCrumbs.getByRole('button', {name: 'role - All Roles'});
        this.CIOChip = this.breadCrumbs.getByRole('button', {name: 'role - CIO'});
        this.CISOChip = this.breadCrumbs.getByRole('button', {name: 'role - CISO'});
    }

    async validateTitleIsVisible() {
        await expect(this.title).toBeVisible();
    }

    async breadcrumbsAreVisible(): Promise<boolean> {
        return await this.allRolesChip.isVisible() && await this.CIOChip.isVisible() && await this.CIOChip.isVisible();
    }

    async clickOnBreadCrumb(locator: Locator) {
        await this.breadcrumbsAreVisible();
        await this.waitAndClick(locator);
    }

    async checkRoleChipIsActive(locator: Locator): Promise<boolean> {
        await locator.isVisible();
        const className = await locator.getAttribute('class');
        return className?.includes('outlinedPrimary') ?? false;
    }
}