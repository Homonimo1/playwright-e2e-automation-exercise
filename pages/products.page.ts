import { Locator, Page } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator('.features_items .product-image-wrapper');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.viewCartLink = page.getByRole('link', { name: 'View Cart' });
  }

  async goto() {
    await this.page.goto('/products');
  }

  async addProductToCart(index: number) {
    const card = this.productCards.nth(index);
    await card.hover();
    await card.locator('.overlay-content .add-to-cart').click();
  }

  async addProductByName(name: string) {
    const card = this.productCards.filter({ hasText: name });
    await card.hover();
    await card.locator('.overlay-content .add-to-cart').click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async goToCart() {
    await this.viewCartLink.click();
  }
}
