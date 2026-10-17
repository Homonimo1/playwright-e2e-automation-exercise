import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loggedInLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page
      .locator("form")
      .filter({ hasText: "Login" })
      .getByPlaceholder("Email Address");
    this.passwordInput = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.errorMessage = page.getByText("Your email or password is incorrect!");
    this.loggedInLabel = page.getByText("Logged in as");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(user: string, password: string) {
    await this.emailInput.fill(user);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoginError() {
    await expect(this.errorMessage).toBeVisible();
  }
}
