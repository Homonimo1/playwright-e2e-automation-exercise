import { Locator, Page, expect } from '@playwright/test';

export type CardInfo = {
  name: string;
  number: string;
  cvc: string;
  month: string;
  expirationYear: string;
};

export class PaymentPage {
  readonly page: Page;
  readonly paymentHeading: Locator;
  readonly nameOnCard: Locator;
  readonly cardNumber: Locator;
  readonly cvc: Locator;
  readonly expirationMonth: Locator;
  readonly expirationYear: Locator;
  readonly payButton: Locator;
  readonly orderPlaced: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.paymentHeading = this.page.getByRole('heading', { name: 'Payment' });
    this.nameOnCard = this.page.getByTestId('name-on-card');
    this.cardNumber = this.page.getByTestId('card-number');
    this.cvc = this.page.getByTestId('cvc');
    this.expirationMonth = this.page.getByTestId('expiry-month');
    this.expirationYear = this.page.getByTestId('expiry-year');
    this.payButton = this.page.getByTestId('pay-button');
    this.orderPlaced = this.page.getByTestId('order-placed');
    this.continueButton = this.page.getByRole('link', { name: 'Continue' });
  }

  async verifyPage() {
    await expect(this.paymentHeading).toBeVisible();
  }

  async fillCardInfo(card: CardInfo) {
    await this.nameOnCard.fill(card.name);
    await this.cardNumber.fill(card.number);
    await this.cvc.fill(card.cvc);
    await this.expirationMonth.fill(card.month);
    await this.expirationYear.fill(card.expirationYear);
  }

  async payAndConfirmOrder() {
    await this.payButton.click();
  }

  async verifyOrderPlaced() {
    await expect(this.page).toHaveURL(/payment_done/);
    await expect(this.orderPlaced).toBeVisible();
  }

  async continueToHome() {
    await this.continueButton.click();
    await expect(this.page).toHaveURL('/');
  }
}
