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

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }
}
