# Curso Playwright

Projeto de estudos de automação de testes end-to-end com [Playwright](https://playwright.dev/), usando o padrão **Page Objects**.

Os testes são executados contra uma loja virtual de exemplo que roda localmente em `http://localhost:2221`.

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- A aplicação da loja rodando em `http://localhost:2221`

## Dependências

- [`@playwright/test`](https://playwright.dev/): framework de testes
- [`@faker-js/faker`](https://fakerjs.dev/): gera dados falsos, como o e-mail do novo usuário

## Instalação

```bash
npm install
```

```bash
npx playwright install chromium
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
├── page-objects/
│   ├── Navegation.js        # Cabeçalho: contador do carrinho e link para o checkout
│   ├── ProductsPage.js      # Página de produtos: visitar, ordenar e adicionar ao carrinho
│   ├── CheckoutPage.js      # Carrinho: remover o produto mais barato e seguir para o checkout
│   ├── LoginPage.js         # Login: ir para a página de cadastro
│   └── SingupPage.js        # Cadastro: preencher e-mail (gerado com Faker) e senha e registrar
├── e2e/
│   └── example.spec.js      # Exemplo gerado pelo Playwright (fora do testDir)
├── tests/
│   ├── new_user_full_jorney.spec.js   # Jornada completa de um novo usuário
│   ├── product_page_add_item.spec.js  # Adicionar produto ao carrinho (sem Page Objects)
│   └── example.spec.js                # Exemplo gerado pelo Playwright
└── playwright.config.js     # Configuração (baseURL, timeouts, navegador)
```

## Page Objects

| Classe         | Métodos                                                    |
| -------------- | ---------------------------------------------------------- |
| `ProductsPage` | `visit()`, `addProductToBasket(index)`, `sortByCheapest()` |
| `Navegation`   | `getBasketCount()`, `goToCheckout()`                       |
| `CheckoutPage` | `removeCheapestProduct()`, `continueToCheckout()`          |
| `LoginPage`    | `moveToSingup()`                                           |
| `SingupPage`   | `newUser()`                                                |

## Jornada testada

O teste `new_user_full_jorney.spec.js` faz o seguinte:

1. Acessa a página de produtos.
2. Ordena os produtos do mais barato para o mais caro.
3. Adiciona três produtos ao carrinho e confere se o contador aumentou.
4. Vai para o carrinho.
5. Remove o produto de menor valor (usando `allInnerTexts()` e `map()`).
6. Continua para o checkout e confere o redirecionamento para `/login`.
7. Clica em **Register** e confere o redirecionamento para a página de cadastro.
8. Cadastra um novo usuário com um e-mail aleatório gerado pelo Faker.

## Conceitos praticados

- Page Objects com classes e o `constructor(page)`
- Um Page Object usando outro (`ProductsPage` usa `Navegation`)
- Locators por `data-qa`, `getByRole` e `getByPlaceholder`
- `nth(index)`, `first()` e `count()` para lidar com listas de elementos
- `allInnerTexts()` com `map()`, `replace()`, `Math.min()` e `indexOf()`
- Asserções: `toHaveText`, `toHaveCount`, `toEqual`, `toBeGreaterThan`
- `waitFor()` e `waitForURL()` para esperar elementos e navegação
- `test.only` para rodar um teste isolado
- Geração de dados de teste com Faker (`faker.internet.email()`)

## Pontos a melhorar

Este projeto é a base dos meus estudos. Os pontos abaixo serão corrigidos em outro projeto, mostrando a evolução:

- [ ] Remover imports que não são usados (`Network` em `ProductsPage`, `timeout` em `CheckoutPage` e `LoginPage`).
- [ ] `sortByCheapest()`: trocar `allInnerTexts()` + `toEqual` por uma asserção que espera a lista reordenar (`await expect(locator).not.toHaveText(...)`).
- [ ] `SingupPage.newUser()`: gerar a senha com Faker (hoje é fixa) e retornar os dados criados.
- [ ] Conferir que o cadastro deu certo (por exemplo, com `waitForURL` ou uma asserção) depois do clique em Register.
- [ ] Remover o pacote `faker` antigo do `package.json` (descontinuado); usar só o `@faker-js/faker`.
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
