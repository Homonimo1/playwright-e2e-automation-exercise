import { Locator, Page, expect } from "@playwright/test"

export class CartPage{

    readonly page:Page;
    readonly cartRows: Locator;
    readonly proceedToCheckOutButton: Locator;
  


    constructor(page:Page){

        this.page= page;
        this.cartRows= page.locator('#cart_info_table tbody tr')
        this.proceedToCheckOutButton= this.page.getByText('Proceed To Checkout');


    };

    async goto(){
        await this.page.goto('/view_cart');
    };

    async expectProductCount(count: number){
        await expect(this.cartRows).toHaveCount(count);

    };

    async proceedToCheckout(){
        await this.proceedToCheckOutButton.click()
    }

};