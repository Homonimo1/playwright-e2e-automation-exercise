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
      await productsPage.addProductByName('Blue Top');
      await productsPage.continueShopping();
      await productsPage.addProductByName('Men  Tshirt');
      await productsPage.continueShopping();
      await productsPage.addProductByName('Winter Top');
      await productsPage.goToCart();
    });

    await test.step('verify the cart count and selected products', async () => {
      await cartPage.expectProductCount(3);
      await cartPage.expectProducts(['Blue Top', 'Men  Tshirt', 'Winter Top']);
    });
  });
});
