import { expect } from "@playwright/test";
import { timeout } from "../playwright.config";

export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.basketCard = page.locator('[data-qa="basket-card"]');
    this.basketItemPrice = page.locator('[data-qa="basket-item-price"]');
    this.basketRemoveButton = page.locator(
      '[data-qa="basket-card-remove-item"]',
    );
    this.continueToCheckoutButton = page.locator(
      '[data-qa="continue-to-checkout"]',
    );
  }

  removeCheapestProduct = async () => {
    await this.basketCard.first().waitFor();

    //Conta quantos produtos foram adicionados no carrinho
    const itemsBeforeRemoval = await this.basketCard.count();

    await this.basketItemPrice.first().waitFor();

    //Acha todos os preços dos produtos
    const allPriceTexts = await this.basketItemPrice.allInnerTexts();

    //Mapeia e converte para números
    const justNumbers = allPriceTexts.map((element) => {
      //Replace é utilizado para remover o cifrão nesse caso, substindo por nada
      const whitoutDollarSing = element.replace("$", "");

      return parseInt(whitoutDollarSing, 10);
    });

    //Localiza o menor valor dentro da lista e remove o produto
    const smallestPrice = Math.min(...justNumbers);
    const smallestPriceIdx = justNumbers.indexOf(smallestPrice);
    const specficRemoveButton = this.basketRemoveButton.nth(smallestPriceIdx);

    await specficRemoveButton.waitFor();
    await specficRemoveButton.click();

    //Retirado devido a repetição
    // await this.basketRemoveButton.nth(smallestPriceIdx).waitFor()
    // await this.basketRemoveButton.nth(smallestPriceIdx).click()

    //Apos remover o produto, verificar se a quantidade de produtos diminiu
    await expect(this.basketCard).toHaveCount(itemsBeforeRemoval - 1);
  };

  continueToCheckout = async () => {
    await this.continueToCheckoutButton.waitFor();
    await this.continueToCheckoutButton.click();
    await this.page.waitForURL(/\/login/, { timeout: 3000 });
  };
}
