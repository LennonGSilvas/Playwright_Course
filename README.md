# Curso Playwright

Projeto de estudos de automação de testes end-to-end com [Playwright](https://playwright.dev/), usando o padrão **Page Objects**.

Os testes são executados contra uma loja virtual de exemplo que roda localmente em `http://localhost:2221`.

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- A aplicação da loja rodando em `http://localhost:2221`

## Dependências

- [`@playwright/test`](https://playwright.dev/): framework de testes
- [`@faker-js/faker`](https://fakerjs.dev/): gera dados falsos, como o e-mail do novo usuário
- [`node-fetch`](https://www.npmjs.com/package/node-fetch): faz a requisição de login direto na API
- [`dotenv`](https://www.npmjs.com/package/dotenv): lê as variáveis de ambiente do arquivo `.env`

## Instalação

```bash
npm install
```

```bash
npx playwright install chromium
```

## Variáveis de ambiente

A senha do admin não fica no código: ela é lida de `process.env.ADMIN_PASSWORD` (em `data/userDetails.js`).

Crie um arquivo `.env` na raiz do projeto:

```
ADMIN_PASSWORD=Admin123
```

O `globalSetup.js` carrega o `.env` com o `dotenv` antes de todos os testes. O `.env` está no `.gitignore`, então não é enviado para o repositório.

Também é possível definir a variável direto no terminal (PowerShell):

```powershell
$env:ADMIN_PASSWORD="Admin123"; npx playwright test --headed
```

## Executando os testes

Rodar todos os testes (modo headless):

```bash
npm test
```

Rodar com o navegador visível:

```bash
npm run test:headed
```

Rodar um arquivo específico:

```bash
npx playwright test tests/new_user_full_jorney.spec.js
```

## Estrutura do projeto

```
.
├── api-calls/
│   └── getLoginToken.js     # Login pela API (POST /api/login) e retorno do token
├── data/
│   ├── deliveryDetails.js   # Massa de teste do endereço de entrega
│   ├── paymentDetails.js    # Massa de teste do cartão de crédito
│   └── userDetails.js       # Usuário admin (senha vinda do .env)
├── page-objects/
│   ├── Navegation.js        # Cabeçalho: contador do carrinho e link para o checkout
│   ├── ProductsPage.js      # Página de produtos: visitar, ordenar e adicionar ao carrinho
│   ├── CheckoutPage.js      # Carrinho: remover o produto mais barato e seguir para o checkout
│   ├── LoginPage.js         # Login: ir para a página de cadastro
│   ├── SingupPage.js        # Cadastro: preencher e-mail (gerado com Faker) e senha e registrar
│   ├── DeliveryDetails.js   # Entrega: preencher, salvar e conferir o endereço
│   ├── PaymentPage.js       # Pagamento: aplicar desconto, preencher o cartão e pagar
│   └── MyAccountPage.js     # Minha conta: visitar e esperar o título e a mensagem de erro
├── tests/
│   ├── new_user_full_jorney.spec.js   # Jornada completa de um novo usuário
│   ├── my_account.spec.js             # Minha conta com injeção de cookie e mock de requisição
│   ├── product_page_add_item.spec.js  # Adicionar produto ao carrinho (sem Page Objects)
│   └── example.spec.js                # Exemplo gerado pelo Playwright
├── globalSetup.js           # Carrega o .env antes dos testes
└── playwright.config.js     # Configuração (baseURL, timeouts, navegador, globalSetup)
```

## Page Objects

| Classe                | Métodos                                                         |
| --------------------- | --------------------------------------------------------------- |
| `ProductsPage`        | `visit()`, `addProductToBasket(index)`, `sortByCheapest()`      |
| `Navegation`          | `getBasketCount()`, `goToCheckout()`                            |
| `CheckoutPage`        | `removeCheapestProduct()`, `continueToCheckout()`               |
| `LoginPage`           | `moveToSingup()`                                                |
| `SingupPage`          | `newUser()`                                                     |
| `DeliveryDetailsPage` | `fillDetails(data)`, `saveDetails()`, `continueToPayment()`     |
| `PaymentPage`         | `activeDiscount()`, `fillPaymentDetails(data)`, `completePayment()` |
| `MyAccountPage`       | `visit()`, `waitForPageHeading()`, `waitForMessage()`           |

## Testes

### Jornada completa do novo usuário

O teste `new_user_full_jorney.spec.js` faz o seguinte:

1. Acessa a página de produtos.
2. Ordena os produtos do mais barato para o mais caro.
3. Adiciona três produtos ao carrinho e confere se o contador aumentou.
4. Vai para o carrinho.
5. Remove o produto de menor valor (usando `allInnerTexts()` e `map()`).
6. Continua para o checkout e confere o redirecionamento para `/login`.
7. Clica em **Register** e confere o redirecionamento para a página de cadastro.
8. Cadastra um novo usuário com um e-mail aleatório gerado pelo Faker.
9. Preenche o endereço de entrega com a massa de `data/deliveryDetails.js`, salva e confere se o endereço salvo bate com o preenchido.
10. Continua para o pagamento.
11. Pega o código de desconto dentro de um iframe, aplica e confere se o valor com desconto é menor que o total.
12. Preenche o cartão com a massa de `data/paymentDetails.js`, paga e confere o redirecionamento para `/thank-you`.

### Minha conta

O teste `my_account.spec.js` faz o seguinte:

1. Faz login pela API (`getLoginToken`) e recebe o token.
2. Simula (mock) a requisição `**/api/user**` com `page.route()`, devolvendo um erro 500.
3. Acessa `/my-account` e injeta o token no cookie com `page.evaluate()`.
4. Acessa `/my-account` de novo, já logado, sem passar pela tela de login.
5. Espera o título **My Account** e a mensagem de erro gerada pelo mock.

## Conceitos praticados

- Page Objects com classes e o `constructor(page)`
- Um Page Object usando outro (`ProductsPage` usa `Navegation`)
- Locators por `data-qa`, `getByRole` e `getByPlaceholder`
- `nth(index)`, `first()` e `count()` para lidar com listas de elementos
- `allInnerTexts()` com `map()`, `replace()`, `Math.min()` e `indexOf()`
- Asserções: `toHaveText`, `toHaveCount`, `toEqual`, `toBeGreaterThan`, `toBeLessThan`, `toHaveValue`
- `waitFor()` e `waitForURL()` para esperar elementos e navegação
- `test.only` para rodar um teste isolado
- Geração de dados de teste com Faker (`faker.internet.email()`)
- Massa de testes separada em arquivos na pasta `data/`
- `selectOption()` em dropdowns e `inputValue()` para ler campos preenchidos
- `frameLocator()` para acessar elementos dentro de um iframe
- Login pela API com `node-fetch` e injeção do token no cookie com `page.evaluate()`
- Mock de requisições com `page.route()` e `route.fulfill()`
- Variáveis de ambiente com `dotenv`, `.env` e `globalSetup`

## Pontos a melhorar

Este projeto é a base dos meus estudos. Os pontos abaixo serão corrigidos em outro projeto, mostrando a evolução:

- [ ] Remover imports que não são usados (`Network` em `ProductsPage`, `timeout` em `CheckoutPage` e `LoginPage`).
- [ ] `sortByCheapest()`: trocar `allInnerTexts()` + `toEqual` por uma asserção que espera a lista reordenar (`await expect(locator).not.toHaveText(...)`).
- [ ] `SingupPage.newUser()`: gerar a senha com Faker (hoje é fixa) e retornar os dados criados.
- [ ] Conferir que o cadastro deu certo (por exemplo, com `waitForURL` ou uma asserção) depois do clique em Register.
- [x] Remover o pacote `faker` antigo do `package.json` (descontinuado); usar só o `@faker-js/faker`.
- [ ] `Navegation.goToCheckout()`: remover o `page.goto('/basket')` depois do clique, ou trocar por `waitForURL`.
- [ ] Remover o `test.only` e os `page.pause()` dos testes.
- [ ] Corrigir a grafia dos nomes (`Navegation` → `Navigation`, `Singup` → `Signup`, `jorney` → `journey`).
- [ ] Remover as linhas duplicadas do `.gitignore`.

## Configuração

Principais opções em `playwright.config.js`:

- `baseURL`: `http://localhost:2221`
- `timeout` do teste: 30s; `timeout` do `expect`: 5s
- Navegador: Chromium (Desktop Chrome)
- Reporter: `line`
- `globalSetup`: `globalSetup.js` (carrega o `.env`)
