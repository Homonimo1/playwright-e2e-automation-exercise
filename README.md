# Playwright E2E Automation Exercise

[![Playwright Tests](https://github.com/Homonimo1/playwright-e2e-automation-exercise/actions/workflows/playwright.yml/badge.svg)](https://github.com/Homonimo1/playwright-e2e-automation-exercise/actions/workflows/playwright.yml)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](#license)

UI and API test automation for [automationexercise.com](https://automationexercise.com), built with Playwright and TypeScript.

The suite covers the full purchase journey: user lifecycle (create, log in, delete), product search, shopping cart, checkout, payment with a card, and order confirmation. Test users are created and removed through the site API, so every test runs with its own data and leaves no residue.

## Stack

| Tool            | Version           |
| --------------- | ----------------- |
| Playwright Test | 1.64              |
| TypeScript      | 7.0 (strict mode) |
| Node.js         | >= 20             |
| pnpm            | 11                |
| Faker           | 10                |
| Prettier        | 3                 |

## Features

- Page Object Model with one class per page.
- Custom fixtures that wrap page objects and expose a disposable test user.
- API setup and teardown: `createAccount` before the test, `deleteAccount` after it.
- One user factory (`data/userFactory.ts`) shared by fixtures and API specs, so the account payload is defined once.
- Unique test data generated with `@faker-js/faker`.
- UI and API suites in the same project, sharing `baseURL` and configuration.
- Payment flow asserted end to end: form heading, order confirmation URL and marker, and return to the home page.
- HTML report, traces on first retry, screenshots and video on failure.
- GitHub Actions pipeline that runs type checking, formatting and the full suite on every push and pull request.

## Project structure

```text
.
├── .github/workflows/playwright.yml
├── data/
│   └── userFactory.ts
├── pages/
│   ├── cart.page.ts
│   ├── checkout.page.ts
│   ├── login.page.ts
│   ├── payment.page.ts
│   └── products.page.ts
├── fixtures/
│   └── index.ts
├── tests/
│   ├── Api/
│   │   ├── account.spec.ts
│   │   └── loginApi.spec.ts
│   └── e2e/
│       ├── cart.spec.ts
│       ├── checkout.spec.ts
│       ├── login.spec.ts
│       └── payment.spec.ts
├── .env.example
├── .prettierrc
├── package.json
├── playwright.config.ts
├── pnpm-lock.yaml
├── tsconfig.json
└── README.md
```

## Test coverage

| Suite          | File                         | Scenarios                                                                                                            |
| -------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| API · Account  | `tests/Api/account.spec.ts`  | Create account with valid data (201), reject duplicate email (400), reject missing required fields (400)             |
| API · Login    | `tests/Api/loginApi.spec.ts` | Verify login (200), wrong password (404), missing password (400), invalid email (404), missing email (400)           |
| E2E · Login    | `tests/e2e/login.spec.ts`    | Invalid credentials show an error, empty form is blocked, valid user logs in                                         |
| E2E · Cart     | `tests/e2e/cart.spec.ts`     | Log in, add three products (two by position, one by name), verify the cart count                                     |
| E2E · Checkout | `tests/e2e/checkout.spec.ts` | Log in, add a product, proceed to checkout, verify address details and product count, add a comment, place the order |
| E2E · Payment  | `tests/e2e/payment.spec.ts`  | Complete the checkout, pay with a valid card, verify the order confirmation and return to the home page              |

All 11 tests pass locally against the public site (verified with a serial run).

## Getting started

```bash
pnpm install
pnpm exec playwright install
```

Create a local `.env` file from the example if you want to point the suite at another environment:

```bash
cp .env.example .env        # macOS / Linux
Copy-Item .env.example .env # Windows PowerShell
```

```env
BASE_URL=https://automationexercise.com
```

The `.env` file is optional: the config falls back to the public site. Keep it in UTF-8.

## Running the tests

```bash
# Run the whole suite
pnpm test

# UI mode
pnpm test:ui

# With a visible browser
pnpm test:headed

# Debug a single test
pnpm test:debug

# Only the UI or only the API suite
pnpm exec playwright test tests/e2e
pnpm exec playwright test tests/Api

# Only tests tagged @smoke
pnpm exec playwright test --grep @smoke

# Static type check
pnpm typecheck

# Format the code (or only check it)
pnpm format
pnpm format:check
```

Reports are written to `playwright-report/` and opened with:

```bash
pnpm report
```

## Configuration and design decisions

- **`testIdAttribute: 'data-qa'`** — the site exposes its hooks as `data-qa` (for example the payment form fields), not `data-testid`.
- **Fixtures instead of setup code** — `fixtures/index.ts` builds the page objects and the test user, so specs stay focused on behaviour.
- **API for setup and cleanup** — creating and deleting users through `/api/*` keeps UI tests fast and independent.
- **One factory for test data** — `data/userFactory.ts` builds the user and the full `createAccount` payload once, instead of repeating the form in every spec.
- **One class per page** — each page object owns its locators and actions; specs never use raw selectors.
- **Assertions live in the page objects** — `verifyPage`, `verifyOrderPlaced` and `continueToHome` check the expected state, so the payment spec reads as a sequence of user steps.
- **`@smoke` tags** — the happy paths that must always work are tagged, so `--grep @smoke` gives a fast regression check.
- **Artifacts on failure** — trace on first retry, screenshot and video only on failure, to keep reports small.
- **CI defaults** — two retries and a single worker on CI; full parallelism locally.
- **Strict TypeScript** — `tsconfig.json` enables `strict`, `noUnusedLocals`, `noUnusedParameters` and `noEmit`.
- **Prettier** — formatting is enforced with `format:check` in CI, so style never depends on the editor.

## CI

`.github/workflows/playwright.yml` runs on every push and pull request to `main`/`master`:

1. Installs pnpm (version pinned in `package.json`) and dependencies from the lockfile.
2. Runs `pnpm typecheck`.
3. Runs `pnpm format:check`.
4. Installs Playwright browsers with system dependencies.
5. Runs the full suite.
6. Uploads the HTML report as a build artifact.

## Known limitations

- The suite runs against a live third-party site, so response times vary and a run can occasionally fail on network latency. If that happens locally, run with `--workers=1`.
- Only Chromium is enabled. Firefox and WebKit are already listed in `playwright.config.ts` and can be enabled by uncommenting their projects.
- Card data is fake. The site displays a confirmation screen but does not process real payments.

## License

ISC
