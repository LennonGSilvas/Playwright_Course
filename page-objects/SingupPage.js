import { faker } from "@faker-js/faker";

export class SingupPage {
  constructor(page) {
    this.page = page;

    this.email = page.getByPlaceholder("E-Mail");
    this.password = page.getByPlaceholder("Password");
    this.singupButton = page.getByRole("button", { name: "Register" });
  }

  newUser = async () => {
    const email = faker.internet.email();
    await this.email.fill(email);
    await this.password.fill("teste1");
    await this.singupButton.click();
  };
}
