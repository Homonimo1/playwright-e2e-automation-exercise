import { Locator, Page, expect } from '@playwright/test';
import type { RegisteredAddress } from '../data/userFactory';

export class CheckoutPage {
  readonly page: Page;
  readonly addressDetail: Locator;
  readonly placeOrderButton: Locator;
  readonly commentTextArea: Locator;
  readonly cartRows: Locator;
  readonly deliveryAddress: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addressDetail = page.getByRole('heading', { name: 'Address Details' });
    this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });
    this.commentTextArea = page.locator('#ordermsg').getByRole('textbox');
    this.cartRows = page.locator('#cart_info tbody tr:has(td.cart_description)');
    this.deliveryAddress = page.locator('#address_delivery li');
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

  async expectDeliveryAddress(address: RegisteredAddress) {
    const expectedValues = [
      `${address.firstname} ${address.lastname}`,
      address.company,
      address.address1,
      address.address2,
      address.city,
      address.state,
      address.zipcode,
      address.country,
    ];

    for (const value of expectedValues) {
      await expect(this.deliveryAddress.filter({ hasText: value })).toHaveCount(1);
    }
  }

  async commentOrder(comment: string) {
    await this.commentTextArea.fill(comment);
  }
}
