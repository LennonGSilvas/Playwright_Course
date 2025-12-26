export class CheckoutPage {

    constructor(page) {
        this.page = page
        this.basketCard = page.locator('[data-qa="basket-card"]')
        this.basketItemPrice = page.locator('[data-qa="basket-item-price"]')
        this.basketRemoveButton = page.locator('[data-qa="basket-card-remove-item"]')
    }


    removeCheapestProduct = async () => {
        await this.basketCard.first().waitFor()
        await this.basketItemPrice.first().waitFor()


        //Pega todos os textos de preços do card de produtos
        const allPriceTexts = await this.basketItemPrice.allInnerTexts()

        //Mapeia todos os textos do array
        const justNumbers = allPriceTexts.map((element) => {

            //Remove o cifrão e converte os textos para números inteiros
            const whitoutDollarSing = element.replace("$", "")
            return parseInt(whitoutDollarSing, 10)

   

        })

        //Achar o menor preço na Arrey 
        const smallestPrice = Math.min(...justNumbers)

        //Acha o Index do menor preço
        const smallestPriceIdx = justNumbers.indexOf(smallestPrice)

        //Espera que o botão remover do produto com menor valor e clica nele
        await this.basketRemoveButton.nth(smallestPriceIdx).waitFor()
        await this.basketRemoveButton.nth(smallestPriceIdx).click()


        await this.page.pause()



    }
}