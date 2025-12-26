import { expect } from "@playwright/test"
import { Navegation } from "./Navegation"
import { Network } from "inspector/promises"
export class ProductsPage {

    constructor(page) {
        //this se refere a classe ProductsPage
        //.page propriedade de classe
        // = page é o valor da propriedade (chama a propriedade page do playwright)
        this.page = page
        this.addButtons = page.locator('[data-qa="product-button"]')
        this.basketCounter = page.locator('[data-qa="header-basket-count"]')


    }


    visit = async () => {

        //Acessa a URL configurada no playwright.config.js
        await this.page.goto("/")
    }

  
    addProductToBasket = async (index) => {

        //Tem cinco botões de add to basket, então precisamos especificar qual queremos
        //Localiza o primeiro botão de add to basket

        const specficAddButtons = this.addButtons.nth(index)

        //Espera o botão estar visível e que tenha o texto "Add to Basket"
        await specficAddButtons.waitFor()
        await expect(specficAddButtons).toHaveText("Add to Basket")

        //Instancia a classe Navegation para usar o metodo getBasketCount
        const navegation = new Navegation(this.page)
                   
        //Verifica a contagem do carrinho antes de clicar no botão e clica no botão
        const basketCountBeforeAdding = await navegation.getBasketCount()
        await specficAddButtons.click()

        //Verifica a contgem do carrinho depois de clicar no botão e verifica se o texto do botão foi alterado
        const basketCountAfterAdding = await navegation.getBasketCount()
        await expect(specficAddButtons).toHaveText("Remove from Basket")

        //Verifica se a contagem do carrinho está maior
        expect(basketCountAfterAdding).toBeGreaterThan(basketCountBeforeAdding)

    }
}