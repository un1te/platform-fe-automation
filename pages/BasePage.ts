import { Locator, Page } from "@playwright/test";

/**
 * Base page class with common methods shared across all page objects.
 * Provides utilities for navigation, element interaction, and visibility checks.
 */
export default class BasePage {

	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	/**
     * Navigate to a URL with optional timeout
     * @param url - URL path or full URL to navigate to
     * @param timeout - Optional timeout in milliseconds
     */
	async goto(url: string, timeout?: number) {
		await this.page.goto(url, {
			waitUntil: "domcontentloaded",
			timeout: timeout,
		});
	}

	/**
     * Wait for element to be visible and click it
     * @param element - Locator of element to click
     */
	async waitAndClick(element: Locator) {
		await element.waitFor({
			state: "visible",
		});
		await element.click();
	}

	/**
     * Get the current page URL
     * @returns Current page URL
     */
	async getUrl(): Promise<string> {
		return this.page.url();
	}

	/**
     * Check if element is visible
     * @param element - Locator to check
     * @param timeout - Optional timeout in milliseconds (default: 5000)
     * @returns True if element is visible, false otherwise
     */
	async isElementVisible(element: Locator, timeout: number = 5000): Promise<boolean> {
		try {
			await element.waitFor({ state: "visible", timeout });
			return true;
		} catch {
			return false;
		}
	}

	/**
     * Check if element contains non-empty text content
     * @param element - Locator to check
     * @param timeout - Optional timeout in milliseconds (default: 5000)
     * @returns True if element has text content, false otherwise
     */
	async isElementWithTextVisible(element: Locator, timeout: number = 5000): Promise<boolean> {
		try {
			await element.waitFor({ state: "visible", timeout });
			const text = await element.textContent();
			return text !== null && text.trim() !== "";
		} catch {
			return false;
		}
	}

	/**
     * Check if element has a non-empty attribute
     * @param element - Locator to check
     * @param attributeName - Name of attribute to check (e.g., 'src', 'href')
     * @param timeout - Optional timeout in milliseconds (default: 5000)
     * @returns True if attribute exists and has value, false otherwise
     */
	async isElementWithAttributePresent(element: Locator, attributeName: string, timeout: number = 5000): Promise<boolean> {
		try {
			await element.waitFor({ state: "visible", timeout });
			const value = await element.getAttribute(attributeName);
			return value !== null && value !== "";
		} catch {
			return false;
		}
	}

	/**
     * Check if element has a specific CSS class
     * @param element - Locator to check
     * @param className - CSS class name to check for
     * @param timeout - Optional timeout in milliseconds (default: 5000)
     * @returns True if element has the class, false otherwise
     */
	async hasClass(element: Locator, className: string, timeout: number = 5000): Promise<boolean> {
		try {
			await element.waitFor({ state: "visible", timeout });
			const classAttr = await element.getAttribute("class");
			return classAttr?.includes(className) ?? false;
		} catch {
			return false;
		}
	}
}