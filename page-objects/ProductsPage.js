import { expect } from "@playwright/test"

export class ProductsPage{

    constructor(page) {
        //this se refere a classe ProductsPage
        //.page propriedade de classe
        // = page é o valor da propriedade (chama a propriedade page do playwright)
        this.page = page
        this.addButtons = page.locator('[data-qa="product-button"]')
        this.basketCounter = page.locator('[data-qa="header-basket-count"]')


    }


    visit = async () => {
         await this.page.goto("localhost:2221")
    }

    getBasketCount = async () => {
    //Convertendo um número

    await this.basketCounter.waitFor()

    //Pega o texto do locator
    const text = await this.basketCounter.innerText()
    //Converte o texto para número inteiro
    return parseInt(text, 10)
   

    }

    addProductToBasket = async (index) => {
        
        //Tem cinco botões de add to basket, então precisamos especificar qual queremos
        //Localiza o primeiro botão de add to basket
        const specficAddButtons = this.addButtons.nth(index)

        //Espera o botão estar visível e que tenha o texto "Add to Basket"
        await specficAddButtons.waitFor()
        await expect(specficAddButtons).toHaveText("Add to Basket")

        //Verifica a contagem do carrinho antes de clicar no botão e clica no botão
        const basketCountBeforeAdding = await this.getBasketCount()
        await specficAddButtons.click()

        //Verifica a contgem do carrinho depois de clicar no botão e verifica se o texto do botão foi alterado
        const basketCountAfterAdding = await this.getBasketCount()
        await expect(specficAddButtons).toHaveText("Remove from Basket")

        //Verifica se a contagem do carrinho está maior
        expect(basketCountAfterAdding).toBeGreaterThan(basketCountBeforeAdding)

    }
}