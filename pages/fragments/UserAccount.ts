import {expect, Locator, Page} from '@playwright/test';

export class UserAccount {
    readonly page: Page;
    readonly userIcon: Locator;
    readonly userAccountMenu: Locator;
    readonly userAccountName: Locator;
    readonly logOutLink: Locator;
    readonly setUpNewMeetingMenuItem: Locator;
    readonly manageMeetingsMenuItem: Locator;
    readonly ongoingMeetingMenuItem: Locator;
    readonly finishMeetingMenuItem: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userIcon = this.page.getByRole('button', {name: 'user icon'})
        this.userAccountMenu = this.page.getByRole('menubar')
        this.userAccountName = this.userAccountMenu.getByText('Ignite Test');
        this.ongoingMeetingMenuItem = this.userAccountMenu.getByText('Ongoing Meeting:')
        this.finishMeetingMenuItem = this.userAccountMenu.getByText('Finish the meeting');
        this.setUpNewMeetingMenuItem = this.userAccountMenu.getByText('Set up a new meeting')
        this.manageMeetingsMenuItem = this.userAccountMenu.getByText('Manage meetings')
        this.logOutLink = this.userAccountMenu.getByText('Log out');
    }

    async userAccountMenuIsVisible()   {
        await expect(this.userAccountMenu).toBeVisible();
    };

    async userAccountNameIsVisible()   {
        await expect(this.userAccountName).toBeVisible();
    };

    async clickOnUserAccountIcon() : Promise<void>  {
        await this.userIcon.waitFor({ state: 'visible' });
        await this.userIcon.click();
        await this.userAccountMenuIsVisible();
    };

    async logOutLinkIsVisible()   {
        await expect(this.logOutLink).toBeVisible();
    };

    async clickLogOutLink()   {
       await this.logOutLink.waitFor({ state: 'visible', timeout: 5000 });
       await this.logOutLink.click();
    };

    async clickOnSetUpNewMeetingMenuItem() : Promise<void>  {
        await this.clickOnUserAccountIcon();
        await this.setUpNewMeetingMenuItem.isVisible()
        await this.setUpNewMeetingMenuItem.click();
        await this.setUpNewMeetingMenuItem.isHidden()
    };

    async clickOnManageMeetingsMenuItem() : Promise<void>  {
        await this.clickOnUserAccountIcon();
        await this.manageMeetingsMenuItem.isVisible()
        await this.manageMeetingsMenuItem.click();
        await this.manageMeetingsMenuItem.isHidden();
    };

    async finishMeetingMenuItemIsVisible(): Promise<boolean>   {
        return await this.finishMeetingMenuItem.count() >0;
    };

    async finishMeetingFromUserAccountMenu()   {
        await expect(this.userIcon).toBeVisible()
        await this.userIcon.click();
        await this.page.waitForTimeout(500);
        expect(await this.finishMeetingMenuItemIsVisible()).toBeTruthy();
        await this.finishMeetingMenuItem.click();
        await this.page.waitForTimeout(500);
        await this.page.keyboard.down('Escape');
    };
}