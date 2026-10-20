import { test } from '../../fixtures';
import type { CardInfo } from '../../pages/payment.page';

test.describe('Payment gateway', () => {
  test.beforeEach(async ({ loginPage, createdUser, cartPage, checkoutPage, productsPage }) => {
    await loginPage.login(createdUser.email, createdUser.password);
    await productsPage.goto();
    await productsPage.addProductToCart(0);
    await productsPage.goToCart();
    await cartPage.expectProductCount(1);
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyPage();
    await checkoutPage.expectAllProducts(1);
    await checkoutPage.commentOrder('This is a purchase for automation practice');
    await checkoutPage.placeOrder();
  });

  test('pays with a valid card and confirms the order @smoke', async ({ paymentPage }) => {
    const card: CardInfo = {
      name: 'Omar QA',
      number: '4242424242424242',
      cvc: '123',
      month: '12',
      expirationYear: '2030',
    };

    await paymentPage.verifyPage();
    await paymentPage.fillCardInfo(card);
    await paymentPage.payAndConfirmOrder();
    await paymentPage.verifyOrderPlaced();
    await paymentPage.continueToHome();
  });
});
