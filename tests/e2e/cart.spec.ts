import { test } from '../../fixtures';

test.describe('Products page', () => {
  test('adds three products to the cart', async ({
    loginPage,
    cartPage,
    productsPage,
    createdUser,
  }) => {
    await test.step('log in with the created user', async () => {
      await loginPage.login(createdUser.email, createdUser.password);
      await loginPage.expectLoggedIn();
    });

    await test.step('add three products to the cart', async () => {
      await productsPage.goto();
      await productsPage.addProductToCart(0);
      await productsPage.continueShopping();
      await productsPage.addProductToCart(1);
      await productsPage.continueShopping();
      await productsPage.addProductByName('Winter Top');
      await productsPage.goToCart();
    });

    await test.step('verify the cart count', async () => {
      await cartPage.expectProductCount(3);
    });
  });
});
