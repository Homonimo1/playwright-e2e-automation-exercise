import { Locator, Page, expect } from "@playwright/test"

export class CartPage{

    readonly page:Page;
    readonly cartRows: Locator;


    constructor(page:Page){

        this.page= page;
        this.cartRows= page.locator('#cart_info_table tbody tr')
    };

    async goto(){
        await this.page.goto('/view_cart');
    };

    async expectProductCount(count: number){
        await expect(this.cartRows).toHaveCount(count);

    };

};