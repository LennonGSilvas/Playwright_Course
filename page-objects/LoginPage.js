import { timeout } from "../playwright.config";

export class LoginPage {
  constructor(page) {
    this.page = page;

    this.registerButton = page.getByRole("button", { name: "Register" });
  }

  moveToSingup = async () => {
    await this.registerButton.waitFor();
    await this.registerButton.click();
    await this.page.waitForURL(/\/signup/, { timeout: 3000 });
  };
}
