import { expect } from "@playwright/test";
import { deliveryDetailsData } from "../data/deliveryDetails";

export class DeliveryDetailsPage {
  constructor(page) {
    this.page = page;
    this.inputFirstName = page.getByRole("textbox", { name: "First name" });
    this.inputLastName = page.getByRole("textbox", { name: "Last name" });
    this.inputStreet = page.getByRole("textbox", { name: "Street" });
    this.inputPostCode = page.getByRole("textbox", { name: "Post code" });
    this.inputCity = page.getByRole("textbox", { name: "City" });
    this.selectCountry = page.locator('[data-qa="country-dropdown"]');
    this.saveAdressButton = page.getByRole("button", {
      name: "Save address for next time",
    });
    this.containerAdress = page.locator('[data-qa="saved-address-container"]');
    this.saveAdressFirstName = page.locator(
      '[data-qa="saved-address-firstName"]',
    );
    this.saveAdressLastName = page.locator(
      '[data-qa="saved-address-lastName"]',
    );
    this.saveAdressStreet = page.locator('[data-qa="saved-address-street"]');
    this.saveAdressPostCode = page.locator(
      '[data-qa="saved-address-postcode"]',
    );
    this.saveAdressCity = page.locator('[data-qa="saved-address-city"]');
    this.saveAdressCountry = page.locator('[data-qa="saved-address-country"]');

    this.continueToPaymentButton = page.getByRole("button", {
      name: "Continue to payment",
    });
  }

  fillDetails = async (deliveryDetailsData) => {
    await this.inputFirstName.waitFor();
    await this.inputFirstName.fill(deliveryDetailsData.firstName);
    await this.inputLastName.waitFor();
    await this.inputLastName.fill(deliveryDetailsData.lastName);
    await this.inputStreet.waitFor();
    await this.inputStreet.fill(deliveryDetailsData.street);
    await this.inputPostCode.waitFor();
    await this.inputPostCode.fill(deliveryDetailsData.postCode);
    await this.inputCity.waitFor();
    await this.inputCity.fill(deliveryDetailsData.city);
    await this.selectCountry.waitFor();
    await this.selectCountry.selectOption(deliveryDetailsData.country);
  };

  saveDetails = async () => {
    const adressCountBeforeSaving = await this.containerAdress.count();
    await this.saveAdressButton.waitFor();
    await this.saveAdressButton.click();
    await expect(this.containerAdress).toHaveCount(adressCountBeforeSaving + 1);
    await this.saveAdressFirstName.first().waitFor();
    expect(await this.saveAdressFirstName.first().innerText()).toBe(
      await this.inputFirstName.inputValue(),
    );
    await this.saveAdressLastName.first().waitFor();
    expect(await this.saveAdressLastName.first().innerText()).toBe(
      await this.inputLastName.inputValue(),
    );
    await this.saveAdressStreet.first().waitFor();
    expect(await this.saveAdressStreet.first().innerText()).toBe(
      await this.inputStreet.inputValue(),
    );
    await this.saveAdressPostCode.first().waitFor();
    expect(await this.saveAdressPostCode.first().innerText()).toBe(
      await this.inputPostCode.inputValue(),
    );
    await this.saveAdressCity.first().waitFor();
    expect(await this.saveAdressCity.first().innerText()).toBe(
      await this.inputCity.inputValue(),
    );
    await this.saveAdressCountry.first().waitFor();
    expect(await this.saveAdressCountry.first().innerText()).toBe(
      await this.selectCountry.inputValue(),
    );
  };

  continueToPayment = async () => {
    await this.continueToPaymentButton.waitFor();
    await this.continueToPaymentButton.click();
    await this.page.waitForURL(/\/payment/, { timeout: 3000 });
  };
}

// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('http://localhost:2221/login?redirect=/delivery-details');
//   await page.getByRole('textbox', { name: 'E-Mail' }).click();
//   await page.getByRole('textbox', { name: 'Password' }).click();
//   await page.getByRole('textbox', { name: 'Password' }).fill('a');
//   await page.getByRole('textbox', { name: 'E-Mail' }).click();
//   await page.getByRole('textbox', { name: 'E-Mail' }).fill('a');
//   await page.getByRole('button', { name: 'Login' }).click();
//   await page.getByRole('textbox', { name: 'E-Mail' }).click();
//   await page.getByRole('button', { name: 'Register' }).click();
//   await page.getByRole('textbox', { name: 'E-Mail' }).click();
//   await page.getByRole('textbox', { name: 'E-Mail' }).fill('a');
//   await page.getByRole('textbox', { name: 'Password' }).click();
//   await page.getByRole('textbox', { name: 'Password' }).fill('a');
//   await page.getByRole('button', { name: 'Register' }).click();
//   await page.getByRole('textbox', { name: 'First name' }).click();
//   await page.getByRole('textbox', { name: 'Last name' }).click();
//   await page.getByRole('textbox', { name: 'Street' }).click();
//   await page.getByRole('textbox', { name: 'Post code' }).click();
//   await page.getByRole('textbox', { name: 'City' }).click();
//   await page.locator('.flex-1.md\\:pl-4').click();
//   await page.getByRole('button', { name: 'Save address for next time' }).click();
//   await page.getByRole('button', { name: 'Continue to payment' }).click();
// });
