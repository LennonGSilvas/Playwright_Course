export class Navegation {

    //Arquivo criado no intuito de demonstrar o uso de page objects dentro de outros page objects

    constructor(page) {
        this.page = page
        this.basketCounter = page.locator('[data-qa="header-basket-count"]')
        this.checkoutLink = page.getByRole('link', { name: 'Checkout' })
    }

    //Converte o texto do carrinho, para número inteiro
    getBasketCount = async () => {

        await this.basketCounter.waitFor()

        const text = await this.basketCounter.innerText()
        return parseInt(text, 10)

    }

    //Navega para a pagina de checkout(basket)
   goToCheckout = async () => {

        await this.checkoutLink.waitFor()
        await this.checkoutLink.click()

        await this.page.goto('/basket')

        
    }

 
}

