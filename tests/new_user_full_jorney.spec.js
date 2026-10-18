import { test } from "@playwright/test";
import { ProductsPage } from "../page-objects/ProductsPage";
import { Navegation } from "../page-objects/Navegation";
import { CheckoutPage } from "../page-objects/CheckoutPage";
import { LoginPage } from "../page-objects/LoginPage";
import { SingupPage } from "../page-objects/SingupPage";
import { DeliveryDetailsPage } from "../page-objects/DeliveryDetails";
import { deliveryDetailsData } from "../data/deliveryDetails";
import { PaymentPage } from "../page-objects/PaymentPage";
import { paymentDetails } from "../data/paymentDetails";

test("New user full end-to-end test journey", async ({ page }) => {
  //productPage.visit()

  //A nova variavel é uma instancia da classe ProductsPage e passa o page do playwright para o constructor
  const productsPage = new ProductsPage(page);
  // Chama o metodo visit da classe
  await productsPage.visit();
  await productsPage.sortByCheapest();

  //chama o metodo productsPage e insere tres produtos no carrinho
  await productsPage.addProductToBasket(0);
  await productsPage.addProductToBasket(1);
  await productsPage.addProductToBasket(2);

  //chama o metodo goToCheckout e redireciona para a pagina de checkout
  const navegation = new Navegation(page);
  await navegation.goToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.removeCheapestProduct();
  await checkoutPage.continueToCheckout();

  const loginPage = new LoginPage(page);
  await loginPage.moveToSingup();

  const newUser = new SingupPage(page);
  await newUser.newUser();

  const deliveryDetails = new DeliveryDetailsPage(page);
  await deliveryDetails.fillDetails(deliveryDetailsData);
  await deliveryDetails.saveDetails();
  await deliveryDetails.continueToPayment();

  const payment = new PaymentPage(page);
  await payment.activeDiscount();
  await payment.fillPaymentDetails(paymentDetails);
  await payment.completePayment();
});
