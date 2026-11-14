import { test } from '../../fixtures';

test.describe('Products page', () => {
  test('Given a registered shopper, When three products are selected, Then each appears in the cart @smoke', async ({
    loginPage,
    cartPage,
    productsPage,
    createdUser,
  }) => {
    await test.step('Given the registered shopper logs in', async () => {
      await loginPage.login(createdUser.email, createdUser.password);
      await loginPage.expectLoggedIn();
    });

    await test.step('When three named products are selected', async () => {
      await productsPage.goto();
      await productsPage.addProductByName('Blue Top');
      await productsPage.continueShopping();
      await productsPage.addProductByName('Men Tshirt');
      await productsPage.continueShopping();
      await productsPage.addProductByName('Winter Top');
      await productsPage.goToCart();
    });

    await test.step('Then the cart contains each selected product once', async () => {
      await cartPage.expectProductCount(3);
      await cartPage.expectProducts(['Blue Top', 'Men Tshirt', 'Winter Top']);
      await cartPage.expectQuantitiesAndTotals();
    });
  });
});
