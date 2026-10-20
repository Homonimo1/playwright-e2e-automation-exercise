import { Locator, Page, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly addressDetail: Locator;
  readonly placeOrderButton: Locator;
  readonly commentTextArea: Locator;
  readonly cartRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addressDetail = page.getByRole('heading', { name: 'Address Details' });
    this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });
    this.commentTextArea = page.locator('#ordermsg').getByRole('textbox');
    this.cartRows = page.locator('#cart_info tbody tr:has(td.cart_description)');
  }

  async goToCheckout() {
    await this.page.goto('/checkout');
  }

  async verifyPage() {
    await expect(this.addressDetail).toBeVisible();
  }

  async expectAllProducts(count: number) {
    await expect(this.cartRows).toHaveCount(count);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }

  async commentOrder(comment: string) {
    await this.commentTextArea.fill(comment);
  }
}
