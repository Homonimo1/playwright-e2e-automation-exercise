import { LoginPage } from "../Page/login";
import { ProductsPage } from "../Page/productsPage";
import { CartPage } from "../Page/cartPage";
import { CheckoutPage } from "../Page/pageCheckout";

import { test as base, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

type Usuario = {
  email: string;
  password: string;
  name: string;
};

type MisFixtures = {
  loginPage: LoginPage;
  usuarioCreado: Usuario;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage:CheckoutPage
  
};

export const test = base.extend<MisFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  usuarioCreado: async ({ request }, use) => {
    const usuario: Usuario = {
      name: faker.person.firstName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
    };

    // SETUP: CREAR USUARIO POR API
    const res = await request.post("/api/createAccount", {
      form: {
        ...usuario,
        title: "Mr",
        birth_date: "1",
        birth_month: "1",
        birth_year: "1990",
        firstname: usuario.name,
        lastname: faker.person.lastName(),
        company: "QA",
        address1: faker.location.streetAddress(),
        address2: "Apto1",
        country: "Canada",
        zipcode: "1234",
        state: "State",
        city: faker.location.city(),
        mobile_number: "3202245566",
      },
    });

    const body = (await res.json()) as { responseCode: number };
    expect(body.responseCode).toBe(201);

    await use(usuario);

    // TEARDOWN: BORRAR USUARIO
       const deleteRes = await request.delete("/api/deleteAccount", {
      form: {
        email: usuario.email,
        password: usuario.password,
       },
    });
    const info= JSON.parse(await deleteRes.text());
    expect(info.responseCode).toBe(200)
    
  },

  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await use(productsPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  checkoutPage: async({page},use)=>{
    const checkoutPage= new CheckoutPage(page);
    await use(checkoutPage);
  }

});

export { expect };
