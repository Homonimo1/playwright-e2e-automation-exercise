import {test, expect} from  "../../fixtures"
test.describe("Interaccion con pagina de productos", () => {
  test("Agregar productos al carrito", async ({
    loginPage,
    cartPage,
    productsPage,
    usuarioCreado,
  }) => {
    await test.step("Login con usuario creado", async () => {
      await loginPage.login(usuarioCreado.email, usuarioCreado.password);
      await expect(loginPage.loggedInLabel).toBeVisible();
    });

    await test.step("Agregar tres productos al carrito", async () => {
      await productsPage.goto();
      await productsPage.addProductToCart(0);
      await productsPage.continueShoppingButton.click();
      await productsPage.addProductToCart(1);
      await productsPage.continueShoppingButton.click();
      await productsPage.addProductForName("Winter Top")
      await productsPage.goToCart();
    });

    await test.step("Validar cantidad en carrito", async () => {
      await cartPage.expectProductCount(3);
    });
  });
});
