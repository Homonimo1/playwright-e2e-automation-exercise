import { test } from '../../fixtures';

test.describe('Checkout', () => {
  test('Given a registered user and cart, When placing the order, Then address is preserved and payment opens @smoke', async ({
    loginPage,
    cartPage,
    createdUser,
    productsPage,
    checkoutPage,
    paymentPage,
  }) => {
    await test.step('Given the registered user logs in and adds one product', async () => {
      await loginPage.login(createdUser.email, createdUser.password);
      await productsPage.goto();
      await productsPage.addProductToCart(0);
      await productsPage.goToCart();
      await cartPage.expectProductCount(1);
      await cartPage.proceedToCheckout();
    });

    await test.step('When checkout displays the same address used during registration', async () => {
      await checkoutPage.verifyPage();
      await checkoutPage.expectAllProducts(1);
      await checkoutPage.expectDeliveryAddress(createdUser.registeredAddress);
      await checkoutPage.commentOrder('This is a purchase for automation practice');
      await checkoutPage.placeOrder();
    });

    await test.step('Then the payment page is reached', async () => {
      await paymentPage.verifyPage();
    });
  });
});
