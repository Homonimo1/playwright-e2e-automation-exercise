import { Locator, Page } from "@playwright/test";

export class ProductsPage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator(".features_items .product-image-wrapper");
    this.continueShoppingButton = page.getByRole("button", {
      name: "Continue Shopping",
    });
    this.viewCartLink = page.getByRole("link", { name: "View Cart" });
  }

  async goto() {
    await this.page.goto("/products");
  }

  async addProductToCart(index: number) {
    const card = this.productCards.nth(index);
    await card.hover();
    await card.locator(".overlay-content .add-to-cart").click();
  }
  async addProductForName(name: string){
    const product= this.productCards.filter({hasText:name});
    await product.hover();
    await product.locator(".overlay-content .add-to-cart").click();


  }

  async goToCart() {
    await this.viewCartLink.click();
  }
}
