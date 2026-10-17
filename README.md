# Playwright E2E Automation Exercise

[![Playwright Tests](https://github.com/Homonimo1/playwright-e2e-automation-exercise/actions/workflows/playwright.yml/badge.svg)](https://github.com/Homonimo1/playwright-e2e-automation-exercise/actions/workflows/playwright.yml)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](#license)

End-to-end test automation framework built with [Playwright](https://playwright.dev/) and TypeScript, targeting [automationexercise.com](https://automationexercise.com).

## Features

- TypeScript with strict Page Object Model
- Reusable Playwright fixtures for `LoginPage`, `ProductsPage`, and `CartPage`
- Test user creation/deletion through the site API
- Fake test data generation with `@faker-js/faker`
- HTML, list, trace, screenshot, and video reporting
- GitHub Actions CI pipeline

## Project structure

```text
.
├── .github/workflows/playwright.yml
├── Page/
│   ├── cartPage.ts
│   ├── login.ts
│   └── productsPage.ts
├── fixtures/
│   └── index.ts
├── tests/e2e/
│   ├── cart.spec.ts
│   └── login.spec.ts
├── playwright.config.ts
└── package.json
```

## Getting started

```bash
pnpm install
pnpm exec playwright install
```

Create a local `.env` file if you want to override the base URL:

```env
BASE_URL=https://automationexercise.com
```

## Run tests

```bash
# Run all tests
pnpm test

# Open UI mode
pnpm test:ui

# Run with a visible browser
pnpm test:headed

# Debug a test
pnpm test:debug
```

## Reports

```bash
pnpm report
```

## Notes

- The invalid login test asserts the error message is visible.
- The product test creates a user through the API, logs in, adds two products to the cart, and checks the cart item count.
- Test artifacts and reports are ignored by Git, except through CI uploads.

## License

ISC
