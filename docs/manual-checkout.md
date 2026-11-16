# Manual Test Suite — Automation Exercise Checkout

**System under test:** [Automation Exercise](https://www.automationexercise.com/)
**Objective:** document and execute representative manual checkout scenarios from guest cart through order confirmation.
**Scope:** functional web testing only. Test flows are based on the site's published Test Cases 14, 16, 20, and 23.
**Status:** browser-assisted live execution on 2026-11-15: eight cases have observed passing outcomes; CHK-008's updated three-part acceptance criterion also passed in the full online Playwright suite. These are Playwright Chromium observations, not a human-operated manual run.

## Execution rules

- Use a fresh browser session and a disposable account where a signed-in state is required.
- Generate a unique email for signup; do not use personal or third-party account data.
- Use only the site's fake/demo payment details. The demo does not process real payments.
- Record the date, browser, actual result, status, and sanitized evidence for each case.
- Delete any disposable account after the run. If cleanup fails, record it as blocked and do not claim the environment is clean.
- The published guest-checkout flow starts in the cart and leads to **Register / Login**. This suite does not assume that a direct visit to `/checkout` must redirect to login.

## Cases

### CHK-001 — Guest is offered authentication when proceeding from cart

| Field               | Value                                                        |
| ------------------- | ------------------------------------------------------------ |
| **Type / priority** | Functional / High                                            |
| **Source**          | Official Test Case 14: Place Order — Register while Checkout |
| **Preconditions**   | No authenticated session; cart is empty                      |
| **Test data**       | Product: `Blue Top`                                          |

**Steps**

1. Open the home page and add `Blue Top` to the cart.
2. Open the cart and select **Proceed To Checkout**.

**Expected:** the guest flow offers **Register / Login** before the user continues with checkout.

**Actual:** the cart contained `Blue Top`, and proceeding as a guest displayed the **Register / Login** offer.

**Status:** `Passed`

**Evidence:** browser-assisted UI observation, 2026-11-15 (Chromium 156.0.8078.4); no screenshot retained.

---

### CHK-002 — Registration from the guest checkout flow establishes a session

| Field               | Value                                                                    |
| ------------------- | ------------------------------------------------------------------------ |
| **Type / priority** | Functional / High                                                        |
| **Source**          | Official Test Case 14                                                    |
| **Preconditions**   | Guest has a product in the cart and has selected **Proceed To Checkout** |
| **Test data**       | Unique synthetic name, email, and password; no real personal data        |

**Steps**

1. Select **Register / Login** from the guest checkout flow.
2. Register a new disposable account using synthetic test data.
3. Complete the account form and continue.

**Expected:** the page displays **Logged in as `<username>`** after registration.

**Actual:** registration through the guest flow displayed **Account Created!**; after continuing, **Logged in as** displayed the synthetic account name. The disposable account was deleted after the run.

**Status:** `Passed`

**Evidence:** browser-assisted UI observation, 2026-11-15; account identifiers and credentials omitted.

---

### CHK-003 — Checkout shows address details for an authenticated user

| Field               | Value                                                                     |
| ------------------- | ------------------------------------------------------------------------- |
| **Type / priority** | Functional / High                                                         |
| **Source**          | Official Test Case 16: Place Order — Login before Checkout                |
| **Preconditions**   | A disposable account exists; user is signed in; cart contains one product |
| **Test data**       | Product: `Blue Top`                                                       |

**Steps**

1. Open the cart while signed in.
2. Select **Proceed To Checkout**.

**Expected:** the checkout page displays the **Address Details** section.

**Actual:** **Address Details** was visible after proceeding from the authenticated cart.

**Status:** `Passed`

**Evidence:** browser-assisted UI observation, 2026-11-15.

---

### CHK-004 — Checkout shows the order review for an authenticated user

| Field               | Value                                                      |
| ------------------- | ---------------------------------------------------------- |
| **Type / priority** | Functional / High                                          |
| **Source**          | Official Test Case 16: Place Order — Login before Checkout |
| **Preconditions**   | Signed-in disposable account; cart contains one product    |
| **Test data**       | Product: `Blue Top`                                        |

**Steps**

1. Open the cart while signed in.
2. Select **Proceed To Checkout**.

**Expected:** the checkout page displays the **Review Your Order** section.

**Actual:** **Review Your Order** was visible on checkout.

**Status:** `Passed`

**Evidence:** browser-assisted UI observation, 2026-11-15.

---

### CHK-005 — Delivery address matches the registered account address

| Field               | Value                                                                              |
| ------------------- | ---------------------------------------------------------------------------------- |
| **Type / priority** | Data validation / High                                                             |
| **Source**          | Official Test Case 23: Verify address details in checkout page                     |
| **Preconditions**   | Signed-in disposable account has a known delivery address; cart contains a product |
| **Test data**       | Synthetic address values entered during account registration                       |

**Steps**

1. Open the cart and proceed to checkout.
2. Compare each displayed delivery-address field with the values entered for the account.

**Expected:** every displayed delivery-address field matches the registered account values.

**Actual:** the displayed delivery name, street, state, city, postal code and country matched the synthetic registration inputs.

**Status:** `Passed`

**Evidence:** field-by-field browser comparison, 2026-11-15; account identifiers omitted.

---

### CHK-006 — Billing address matches the registered account address

| Field               | Value                                                        |
| ------------------- | ------------------------------------------------------------ |
| **Type / priority** | Data validation / High                                       |
| **Source**          | Official Test Case 23                                        |
| **Preconditions**   | Same disposable account and checkout setup as CHK-004        |
| **Test data**       | Synthetic address values entered during account registration |

**Steps**

1. Open the cart and proceed to checkout.
2. Compare each displayed billing-address field with the values entered for the account.

**Expected:** every displayed billing-address field matches the registered account values.

**Actual:** the displayed billing name, street, state, city, postal code and country matched the synthetic registration inputs.

**Status:** `Passed`

**Evidence:** field-by-field browser comparison, 2026-11-15; account identifiers omitted.

---

### CHK-007 — Cart contents persist after login

| Field               | Value                                                           |
| ------------------- | --------------------------------------------------------------- |
| **Type / priority** | Functional / High                                               |
| **Source**          | Based on the post-login cart assertion in Official Test Case 20 |
| **Preconditions**   | Guest session; product has been added to the cart               |
| **Test data**       | Product: `Blue Top`                                             |

**Steps**

1. Add `Blue Top` to the cart as a guest.
2. Sign in with a valid disposable account.
3. Reopen the cart.

**Expected:** the cart still contains `Blue Top` after login.

**Actual:** after logging out, `Blue Top` remained in the guest cart; after signing back in with the disposable account, `Blue Top` was still in the cart.

**Status:** `Passed`

**Evidence:** browser-assisted guest-to-login cart observation, 2026-11-15.

---

### CHK-008 — Order confirmation appears after placing a demo order

| Field               | Value                                                                                |
| ------------------- | ------------------------------------------------------------------------------------ |
| **Type / priority** | Functional / High                                                                    |
| **Source**          | Official Test Case 16                                                                |
| **Preconditions**   | Signed-in disposable account; one product in cart; checkout details completed        |
| **Test data**       | Demo payment values from the repository's Playwright example; no real payment method |

**Steps**

1. Enter a comment in the order comment field.
2. Select **Place Order** and enter the site's fake/demo card details.
3. Select **Pay and Confirm Order**.

**Expected:** after demo payment, the browser redirects to `/payment_done/<order-id>`; the visible `[data-qa="order-placed"]` heading has DOM text **Order Placed!** (rendered visually as **ORDER PLACED!**); and the page displays **Congratulations! Your order has been confirmed!**. The order ID is generated by the site and must not be fixed to a particular value.

**Actual:** in the isolated browser flow, the site redirected to `/payment_done/500`; the visible `[data-qa="order-placed"]` heading displayed **ORDER PLACED!**, and the page text contained **Congratulations! Your order has been confirmed!**. The full Playwright suite confirmed the heading's DOM text is **Order Placed!** and verified all three acceptance signals. The synthetic account from the isolated flow was deleted and **Account Deleted!** was observed.

**Status:** `Passed` — all three acceptance signals observed in the isolated full-flow execution.

**Evidence:** live Chromium full-flow observation on 2026-11-15, including final URL, heading, page message and account cleanup; the online Chromium suite passed 14/14 (exit 0). No screenshot or account/payment identifier retained. The automated payment check uses its own account fixture.

## Run summary

| Run date   | Browser / environment                                                                          | Passed | Failed | Blocked | Not run | Evidence location                                                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------- | -----: | -----: | ------: | ------: | ----------------------------------------------------------------------------------------------------------------------------------- |
| 2026-11-15 | Chromium 156.0.8078.4, headless; public live site; isolated full flow and automated regression |      8 |      0 |       0 |       0 | Sanitized per-case notes above; final URL, heading and page message observed; Chromium suite 14/14 passed; no screenshots retained. |

## References

- [Automation Exercise official test cases](https://www.automationexercise.com/test_cases): cases 14, 16, 20, and 23.
- Existing automated checkout example: [checkout.spec.ts](https://github.com/Homonimo1/playwright-e2e-automation-exercise/blob/main/tests/e2e/checkout.spec.ts).
- Existing fake-card payment example: [payment.spec.ts](https://github.com/Homonimo1/playwright-e2e-automation-exercise/blob/main/tests/e2e/payment.spec.ts).
