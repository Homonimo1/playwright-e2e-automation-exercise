import { Locator, Page, expect } from "@playwright/test";

export class CheckoutPage{

    readonly page: Page
    readonly addressDetail:Locator;
    readonly placeOrderButton: Locator
    readonly textAreaComment:Locator;
    readonly cartRows:Locator;

    constructor(page:Page){
        this.page= page;
        this.addressDetail= this.page.getByRole("heading",{name:"Address Details"});
        this.placeOrderButton= this.page.getByRole('link', { name: 'Place Order' });
        this.textAreaComment= this.page.locator("#ordermsg").getByRole("textbox",{name:"message"});
        this.cartRows= this.page.locator("#cart_info tbody tr");
    };
    
    async goToCheckout(){
        await this.page.goto("/checkout");

    };

    async verifyPage (){
        await expect(this.addressDetail).toBeVisible();
    };

    async expectAllProducts(number:number){
        await expect(this.cartRows).toHaveCount(number)

    }

    async placeOrder (){
        await this.placeOrderButton.click()
    };

    async commentOrder(comment:string){
        await this.textAreaComment.fill(comment);
    }
}