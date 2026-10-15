import { expect } from "@playwright/test";

export class PaymentPage {
  constructor(page) {
    this.page = page;
    this.discountCode = page
      .frameLocator('[data-qa="active-discount-container"]')
      .locator('[data-qa="discount-code"]');
    this.discountInput = page.locator('[data-qa="discount-code-input"]');
    this.activateDiscountButton = page.locator(
      '[data-qa="submit-discount-button"]',
    );
    this.totalValue = page.locator('[data-qa="total-value"]');
    this.discountedValue = page.locator(
      '[data-qa="total-with-discount-value"]',
    );
    this.discountActiveMessage = page.locator(
      '[data-qa="discount-active-message"]',
    );
  }

  activeDiscount = async () => {
    expect(await this.discountedValue.isVisible()).toBe(false);
    expect(await this.discountActiveMessage.isVisible()).toBe(false);

    const code = await this.discountCode.innerText();

    await this.discountCode.waitFor();
    await this.discountInput.click();
    await this.discountInput.fill(code);
    await expect(this.discountInput).toHaveValue(code);
    await this.activateDiscountButton.waitFor();
    await this.activateDiscountButton.click();

    await this.discountActiveMessage.waitFor();

    await this.discountedValue.waitFor();
    const discountValueText = await this.discountedValue.innerText();
    const discountValueOnlyStringNumber = discountValueText.replace("$", "");
    const discountValueNumber = parseInt(discountValueOnlyStringNumber, 10);

    await this.totalValue.waitFor();
    const totalValueText = await this.totalValue.innerText();
    const totalValueOnlyStringNumber = totalValueText.replace("$", "");
    const totalValueNumber = parseInt(totalValueOnlyStringNumber, 10);

    expect(discountValueNumber).toBeLessThan(totalValueNumber);
  };
}
