import { test, expect } from '../../fixtures';

test.describe('Login page', () => {
  test('shows an error with invalid credentials @smoke', async ({ loginPage }) => {
    await loginPage.login('invalidEmail@gmail.com', 'InvalidPass');
    await loginPage.expectLoginError();
  });

  test('blocks the form when both fields are empty', async ({ loginPage }) => {
    await loginPage.loginButton.click();

    await expect
      .poll(() =>
        loginPage.emailInput.evaluate((input: HTMLInputElement) => input.validity.valueMissing),
      )
      .toBe(true);
    await expect
      .poll(() =>
        loginPage.passwordInput.evaluate((input: HTMLInputElement) => input.validity.valueMissing),
      )
      .toBe(true);
  });

  test('logs in with a valid user @smoke', async ({ loginPage, createdUser }) => {
    await loginPage.login(createdUser.email, createdUser.password);
    await loginPage.expectLoggedIn();
  });
});
