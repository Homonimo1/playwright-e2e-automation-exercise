import {test} from "../../fixtures";

test.describe('Interaccion con el Checkout de la pagina', () => {
    
    test.beforeEach(async ({ loginPage, cartPage, usuarioCreado, productsPage }) => {
        await loginPage.login(usuarioCreado.email, usuarioCreado.password);
        await productsPage.goto()
        await productsPage.addProductToCart(0);
        await productsPage.goToCart();
        await cartPage.expectProductCount(1);
        await cartPage.proceedToCheckout();
    
    })
    test('Completar la compra @smoke', async ({ checkoutPage }) => {
        await checkoutPage.verifyPage();
        await checkoutPage.expectAllProducts(1);
        await checkoutPage.commentOrder("Esto es una compra, 'Automatizacion de compra'")
        await checkoutPage.placeOrder() 
        
    })
    
})
