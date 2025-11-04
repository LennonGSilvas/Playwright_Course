import { test, expect } from "@playwright/test"


test("Product Page Add To Basket", async ({ page }) => {
    await page.goto("localhost:2221")

    const addToBasketButton = page.locator('[data-qa="product-button"]').first()
    const basketCount = page.locator('[data-qa="header-basket-count"]')

    //Espera até o contador Basket esteja visivel e o valor seja 0
    await basketCount.waitFor()
    await expect(basketCount).toHaveText("0")
    await page.pause()

    //Espera até o botão esteja visivel na tela e que tenha a descrição Add to... e clica
    await addToBasketButton.waitFor()
    await expect(addToBasketButton).toHaveText("Add to Basket")
    await addToBasketButton.click()

    //Espera até o contador Basket esteja visivel e o valor seja 1
    await basketCount.waitFor()
    await expect(basketCount).toHaveText("1")
    await page.pause()

    //Espera até o botão esteja visivel na tela e que tenha a descrição Remove from to...
    await addToBasketButton.waitFor()
    await expect(addToBasketButton).toHaveText("Remove from Basket")

    await page.pause()

})
