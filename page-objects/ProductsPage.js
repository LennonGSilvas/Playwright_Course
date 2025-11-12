import { expect } from "@playwright/test"

export class ProductsPage{

    constructor(page) {
        //this se refere a classe ProductsPage
        //.page propriedade de classe
        // = page é o valor da propriedade (chama a propriedade page do playwright)
        this.page = page
        this.addButtons = page.locator('[data-qa="product-button"]')


    }


    visit = async () => {
         await this.page.goto("localhost:2221")
    }

    addProductToBasket = async (index) => {
        
        const specficAddButtons = this.addButtons.nth(index)
        await specficAddButtons.waitFor()
        await expect(specficAddButtons).toHaveText("Add to Basket")
        await specficAddButtons.click()
        await expect(specficAddButtons).toHaveText("Remove from Basket")

    }
}