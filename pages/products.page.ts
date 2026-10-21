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
    const matchingCards = await card.count();
    if (matchingCards !== 1) {
      throw new Error(`Expected exactly one product card matching "${name}".`);
    }
    await card.waitFor({ state: 'visible' });
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
