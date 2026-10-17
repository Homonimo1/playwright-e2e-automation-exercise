import { test, expect } from "../../fixtures";

test.describe("Login page", () => {
  test("Muestra error con las credenciales invalidas @smoke", async ({loginPage,}) => {
    await loginPage.login("invalidEmail@gmail.com", "InvalidPass");
    await loginPage.expectLoginError();
  });

  test("No permite enviar formulario con campos vacios", async ({
    loginPage,
    page,
  }) => {
    await loginPage.loginButton.click();
    await expect(page).toHaveURL(/login/);
  });

  test("Login exitoso @smoke", async ({ loginPage, usuarioCreado }) => {
    await loginPage.login(usuarioCreado.email, usuarioCreado.password);
    await expect(loginPage.loggedInLabel).toBeVisible();
  });
});
