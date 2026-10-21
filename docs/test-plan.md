# Test Plan — automationexercise.com

Reference document for the automated suite in this repository: what is covered, what is
deliberately left out, and how a change is judged ready to reach `main`.

| Field             | Value                                                                        |
| ----------------- | ---------------------------------------------------------------------------- |
| Project           | `playwright-e2e-automation-exercise`                                         |
| Version           | 1.0                                                                          |
| Last review       | 2026-10-20                                                                   |
| Framework         | Playwright Test 1.64, TypeScript 7                                           |
| System under test | [automationexercise.com](https://automationexercise.com) (live, third party) |

## 1. Objective

Verify that the critical journeys of an e-commerce site — user lifecycle, authentication, cart,
checkout and payment — keep working after every change, with a suite that is fast, independent
and repeatable in CI.

## 2. Scope

### In scope

| Area              | What is verified                                                             |
| ----------------- | ---------------------------------------------------------------------------- |
| Account (API)     | Creation with valid data, duplicate email rejection, missing required fields |
| Login (API)       | Valid login, wrong password, missing password, invalid email, missing email  |
| Login (UI)        | Error on invalid credentials, empty form blocked, valid login                |
| Products and cart | Adding three products selected by name, validating cart count and identities |
| Checkout          | Delivery address and product count, comment field, order placement           |
| Payment           | Card form, order confirmation URL and marker, return to the home page        |

### Out of scope

- Product search — not automated yet (see §9).
- Contact form, newsletter, product reviews, brand and category filters.
- Visual regression, accessibility (WCAG) and performance testing.
- Cross-browser execution: only Chromium is enabled. Firefox and WebKit are declared in
  `playwright.config.ts` and stay commented.
- Real payments: card data is fake and the site does not process it.
- Load, stress, security and penetration testing.

## 3. Strategy

- **Risk-based:** the money path (login → cart → checkout → payment) is covered end to end,
  while low-risk static pages are ignored.
- **Two levels:** API tests for account and authentication contracts; UI tests for the journeys
  that only exist in the browser.
- **API for setup and cleanup:** test users are created through `/api/createAccount` before the
  test and cleanup is attempted through `/api/deleteAccount` after it, including when assertions
  fail. Cleanup depends on the availability of the public third-party API, so residual data cannot
  be ruled out during an outage.
- **Behaviour over selectors:** specs describe user steps; locators live in page objects and
  assertions live in `verify*` methods, so a selector change touches one file.
- **Tagged smoke set:** `@smoke` marks the happy paths that must always pass, enabling a fast
  `pnpm exec playwright test --grep @smoke` regression check.

## 4. Environments

| Environment | URL                                       | Notes                                                   |
| ----------- | ----------------------------------------- | ------------------------------------------------------- |
| Local       | `BASE_URL` or the public site as fallback | Full parallelism, no retries, HTML report on demand     |
| CI          | Same public site                          | `workers: 1`, 2 retries, report uploaded as an artifact |

Requires Node.js >= 20 and pnpm 11. `.env` is optional; the config falls back to the public site.
The API base URL is the same `baseURL` used by the UI tests.

## 5. Test data

- One factory (`data/userFactory.ts`) builds the user and the `/api/createAccount` payload, so the
  account shape is defined once.
- Every run generates unique data with `@faker-js/faker` to avoid collisions on a shared public
  site.
- Cleanup runs after the test even when its assertions fail. Because the API is a shared public
  service, cleanup can itself fail during an outage; the failure is reported and the test's original
  error is preserved when both fail.

## 6. Coverage matrix

| ID           | Suite          | Scenario                                        | File                         | Tag      |
| ------------ | -------------- | ----------------------------------------------- | ---------------------------- | -------- |
| API-ACC-01   | API · Account  | Creates an account with valid data (201)        | `tests/Api/account.spec.ts`  | `@smoke` |
| API-ACC-02   | API · Account  | Rejects a duplicate email (400)                 | `tests/Api/account.spec.ts`  | —        |
| API-ACC-03   | API · Account  | Rejects a payload without required fields (400) | `tests/Api/account.spec.ts`  | —        |
| API-LOG-01   | API · Login    | Logs in a user through the API (200)            | `tests/Api/loginApi.spec.ts` | —        |
| API-LOG-02.1 | API · Login    | Wrong password (404)                            | `tests/Api/loginApi.spec.ts` | —        |
| API-LOG-02.2 | API · Login    | Missing password (400)                          | `tests/Api/loginApi.spec.ts` | —        |
| API-LOG-02.3 | API · Login    | Invalid email (404)                             | `tests/Api/loginApi.spec.ts` | —        |
| API-LOG-02.4 | API · Login    | Missing email (400)                             | `tests/Api/loginApi.spec.ts` | —        |
| UI-LOG-01    | E2E · Login    | Shows an error with invalid credentials         | `tests/e2e/login.spec.ts`    | `@smoke` |
| UI-LOG-02    | E2E · Login    | Blocks the form when both fields are empty      | `tests/e2e/login.spec.ts`    | —        |
| UI-LOG-03    | E2E · Login    | Logs in with a valid user                       | `tests/e2e/login.spec.ts`    | `@smoke` |
| UI-CART-01   | E2E · Cart     | Adds three products to the cart                 | `tests/e2e/cart.spec.ts`     | —        |
| UI-CHK-01    | E2E · Checkout | Places an order after filling the checkout form | `tests/e2e/checkout.spec.ts` | `@smoke` |
| UI-PAY-01    | E2E · Payment  | Pays with a valid card and confirms the order   | `tests/e2e/payment.spec.ts`  | `@smoke` |

Totals: **14 automated tests**, **14 scenarios** and **5 smoke scenarios**. Each API login scenario
is an independent test, so a failure in one credential case does not prevent the other cases from
running.

## 7. Entry and exit criteria

**Entry**

- Dependencies installed from the lockfile and browsers installed.
- The public site is reachable and the API answers `/api/productsList`.
- `pnpm typecheck` passes before the suite is executed.

**Exit**

- `pnpm typecheck` and `pnpm format:check` pass.
- 14 of 14 tests pass in CI and the HTML report is uploaded. A local pass does not confirm the
  status of CI for unpushed changes.
- No open defect of severity High or Medium that blocks the money path.
- Any accepted limitation is written in `README.md` and in §8 of this document.

## 8. Risks and mitigations

| Risk                                        | Impact                                | Mitigation                                                                                |
| ------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------- |
| Live third-party site, no control over data | Intermittent failures from latency    | 2 retries and 1 worker in CI; `--workers=1` locally if needed                             |
| Shared public environment                   | Account collisions, dirty state       | Unique faker data; cleanup attempted after each test; API outages can leave residual data |
| Single browser enabled                      | Browser-specific defects go unnoticed | Documented limitation; Firefox and WebKit ready to enable                                 |
| API answers HTTP 200 for every outcome      | Status codes are not trustworthy      | Assertions read `responseCode` from the body (see BUG-001)                                |
| DOM hooks are not guaranteed                | Selector breakage on redesign         | `data-qa` via `testIdAttribute` plus role-based locators                                  |
| Payment is simulated                        | No real transaction validation        | Documented as out of scope                                                                |

## 9. Backlog

- Product search on `/products` (`#search_product` and `#submit_search`): the README mentions it
  as future work, not as current coverage.
- Order history and invoice download.
- Firefox in CI with the API project excluded (`testIgnore: /Api/`), to avoid duplicating calls
  that do not use a browser.
- Accessibility scan on the main journeys.

## 10. Defect management

Confirmed defects live in [`bug-reports.md`](bug-reports.md) with reproduction steps, expected and
actual results, and recorded evidence. Only verified findings are reported.

## 11. Reporting

Each run produces `playwright-report/` (opened with `pnpm report`), a trace on the first retry, and
screenshots and video on failure. CI uploads the HTML report as an artifact with 30 days of
retention, so a failure can be reviewed without reproducing it locally.

## 12. Version history

| Version | Date       | Change                                                  |
| ------- | ---------- | ------------------------------------------------------- |
| 1.0     | 2026-10-20 | First version, matching commit `de7ac7a` and suite 1.64 |
