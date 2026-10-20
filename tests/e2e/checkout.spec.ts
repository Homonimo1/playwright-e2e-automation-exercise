import { test } from '../../fixtures';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loginPage, cartPage, createdUser, productsPage }) => {
    await loginPage.login(createdUser.email, createdUser.password);
    await productsPage.goto();
    await productsPage.addProductToCart(0);
    await productsPage.goToCart();
    await cartPage.expectProductCount(1);
    await cartPage.proceedToCheckout();
  });

  test('places an order after filling the checkout form @smoke', async ({ checkoutPage }) => {
    await checkoutPage.verifyPage();
    await checkoutPage.expectAllProducts(1);
    await checkoutPage.commentOrder('This is a purchase for automation practice');
    await checkoutPage.placeOrder();
  });
});
