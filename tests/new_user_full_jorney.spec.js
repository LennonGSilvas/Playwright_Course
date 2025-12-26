import { test } from '@playwright/test'
import { ProductsPage } from '../page-objects/ProductsPage'
import { Navegation } from '../page-objects/Navegation'
import { CheckoutPage } from '../page-objects/CheckoutPage' 

test.only("New user full end-to-end test journey", async ({ page }) => {
    //productPage.visit()

    //A nova variavel é uma instancia da classe ProductsPage e passa o page do playwright para o constructor
    const productsPage = new ProductsPage(page)
    // Chama o metodo visit da classe
    await productsPage.visit()

    //chama o metodo productsPage e insere tres produtos no carrinho
    await productsPage.addProductToBasket(0)
    await productsPage.addProductToBasket(1)
    await productsPage.addProductToBasket(2)

    //chama o metodo goToCheckout e redireciona para a pagina de checkout
    const navegation = new Navegation(page)
    await navegation.goToCheckout()

    const checkoutPage = new CheckoutPage(page)
    await checkoutPage.removeCheapestProduct()



})