import { Locator, Page, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartRows: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartRows = page.locator('#cart_info_table tbody tr');
    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
  }

  async goto() {
    await this.page.goto('/view_cart');
  }

  async expectProductCount(count: number) {
    await expect(this.cartRows).toHaveCount(count);
  }

  async expectProducts(names: string[]) {
    for (const name of names) {
      await expect(this.cartRows.filter({ hasText: name })).toHaveCount(1);
    }
  }

  async expectQuantitiesAndTotals() {
    const rowCount = await this.cartRows.count();

    for (let index = 0; index < rowCount; index += 1) {
      const row = this.cartRows.nth(index);
      const priceText = await row.locator('.cart_price').innerText();
      const quantityText = await row.getByRole('button').innerText();
      const quantity = Number(quantityText.trim());
      const rowTotalText = await row.locator('.cart_total').innerText();
      const price = Number(priceText.match(/[\d,]+(?:\.\d+)?/)?.[0].replace(/,/g, ''));
      const rowTotal = Number(rowTotalText.match(/[\d,]+(?:\.\d+)?/)?.[0].replace(/,/g, ''));

      expect(Number.isFinite(price)).toBe(true);
      expect(Number.isInteger(quantity) && quantity > 0).toBe(true);
      expect(rowTotal).toBe(price * quantity);
    }
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }
}
