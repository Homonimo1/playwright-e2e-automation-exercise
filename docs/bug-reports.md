# Defect Log

Defects found while building and running this suite. Only findings that were reproduced against
the live site are listed; nothing here is reported from reading code alone.

| ID      | Title                                                         | Severity | Priority | Status         | Reported   |
| ------- | ------------------------------------------------------------- | -------- | -------- | -------------- | ---------- |
| BUG-001 | Sample API errors return HTTP 200 instead of their error code | Medium   | Low      | Open, upstream | 2026-10-20 |

---

## BUG-001 — Sample API errors return HTTP 200 instead of their error code

| Field       | Value                                                 |
| ----------- | ----------------------------------------------------- |
| Component   | `automationexercise.com` API (`/api/*`)               |
| Severity    | Medium                                                |
| Priority    | Low (third-party demo site; no fix under our control) |
| Environment | Public site, 2026-10-21, Node.js `fetch`, no browser  |
| Status      | Open, upstream — workaround applied in this suite     |

### Summary

Reproduced on sample routes: `POST /api/verifyLogin` returns HTTP `200 OK` for invalid credentials,
and `DELETE /api/verifyLogin` returns HTTP `200 OK` for an unsupported method. The actual outcome is
only represented in the JSON body's `responseCode`. This report is limited to the reproduced routes;
it does not claim every endpoint behaves identically.

### Steps to reproduce

```bash
# Wrong credentials: the body says 404
curl -s -o /dev/null -w "%{http_code}\n" -X POST \
  -d "email=noexiste_qa@example.com&password=wrong" \
  https://automationexercise.com/api/verifyLogin

# Missing parameter: the body says 400
curl -s -o /dev/null -w "%{http_code}\n" -X POST \
  -d "email=noexiste_qa@example.com" \
  https://automationexercise.com/api/verifyLogin

# Unsupported method: the body says 405
curl -s -o /dev/null -w "%{http_code}\n" -X DELETE \
  https://automationexercise.com/api/verifyLogin
```

### Expected

The HTTP status reflects the result, so a caller can rely on the transport layer:

| Case               | Expected HTTP | Expected body       |
| ------------------ | ------------- | ------------------- |
| Wrong credentials  | `404`         | `responseCode: 404` |
| Missing parameter  | `400`         | `responseCode: 400` |
| Unsupported method | `405`         | `responseCode: 405` |

### Actual

| Request                                  | HTTP status | Body                                                                                                       |
| ---------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| `POST /api/verifyLogin` (wrong password) | **200**     | `{"responseCode": 404, "message": "User not found!"}`                                                      |
| `POST /api/verifyLogin` (no password)    | **200**     | `{"responseCode": 400, "message": "Bad request, email or password parameter is missing in POST request."}` |
| `DELETE /api/verifyLogin`                | **200**     | `{"responseCode": 405, "message": "This request method is not supported."}`                                |
| `POST /api/productsList`                 | **200**     | `{"responseCode": 405, "message": "This request method is not supported."}`                                |

### Reproduction evidence (2026-10-21)

Verified with Node.js `fetch` against the public site. Raw observed results:

```text
POST /api/verifyLogin with a non-existent email and wrong password
HTTP 200; body: {"responseCode": 404, "message": "User not found!"}

DELETE /api/verifyLogin
HTTP 200; body: {"responseCode": 405, "message": "This request method is not supported."}
```

The response bodies are copied from the observed run; no account was created or modified by these
two requests.

### Impact

- Monitoring and alerting based on status codes cannot detect failures: a broken endpoint looks
  healthy.
- Generic HTTP clients, API gateways, retry policies and contract tests treat errors as success.
- Error code duplication: the same information travels twice, and they can disagree.

### Workaround in this suite

Assertions read `responseCode` from the body instead of the HTTP status, for example:

```ts
const body = JSON.parse(await response.text()) as { responseCode: number };
expect(body.responseCode).toBe(404);
```

The HTTP status is not asserted for API error cases, because it is always `200`.

---

## Reporting template

Copy this block for each new defect and delete the sections that do not apply.

```markdown
## BUG-XXX — <short, factual title>

| Field       | Value                                            |
| ----------- | ------------------------------------------------ |
| Component   | <page, endpoint or area>                         |
| Severity    | Blocker / High / Medium / Low                    |
| Priority    | High / Medium / Low                              |
| Environment | <browser, OS, commit, date>                      |
| Status      | New / Open / Fixed / Retest / Closed / Won't fix |

### Summary

One or two sentences: what is wrong and where.

### Steps to reproduce

1. Numbered, minimal steps another person can follow without guessing.

### Expected

What should happen, and why (requirement, spec or common behaviour).

### Actual

What happens instead. Add screenshots, traces or the raw response when possible.

### Impact

Who is affected and how severe it is for them.

### Evidence

Attach the trace, screenshot, report artifact link or request/response pair.
```
