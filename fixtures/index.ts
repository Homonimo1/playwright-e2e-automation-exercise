import { test as base, expect } from '@playwright/test';

import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { LoginPage } from '../pages/login.page';
import { PaymentPage } from '../pages/payment.page';
import { ProductsPage } from '../pages/products.page';
import { buildUser, buildUserForm, type User } from '../data/userFactory';

type Fixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  createdUser: User;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await use(productsPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  paymentPage: async ({ page }, use) => {
    const paymentPage = new PaymentPage(page);
    await use(paymentPage);
  },

  createdUser: async ({ request }, use) => {
    const user = buildUser();

    // Setup: create the user through the API.
    const createResponse = await request.post('/api/createAccount', {
      form: buildUserForm(user),
    });
    const createBody = (await createResponse.json()) as { responseCode: number };
    expect(createBody.responseCode).toBe(201);

    await use(user);

    // Teardown: delete the user even if the test failed.
    const deleteResponse = await request.delete('/api/deleteAccount', {
      form: { email: user.email, password: user.password },
    });
    const deleteBody = JSON.parse(await deleteResponse.text()) as { responseCode: number };
    expect(deleteBody.responseCode).toBe(200);
  },
});

export { expect };
