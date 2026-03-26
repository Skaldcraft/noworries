# Security Review — noworries

---

## Artifact Metadata

| Field | Value |
|---|---|
| Project | noworries |
| Date | 2026-03-26 |
| Mode | Comprehensive |
| Upstream Artifact | noworries_handoff-packager_20260326.md |
| Workflow | 05_security-review.md — antigravity skills framework |
| Producing Role | Security Reviewer |

---

## 1. Security Assessment Summary

**Scope evaluated:**
All six analysis domains were assessed. Source artifacts reviewed: `server/amazon-api.js`, `server/static-server.js`, `server/api-proxy.js`, `src/config.js`, `src/api/products.js`, `src/lib/paapi.js`, `src/lib/cacheDebug.js`, `src/lib/telemetry.js`, `src/lib/geminiPrompts.js`, `src/pages/HomePage.jsx`, `src/pages/ProductDetailPage.jsx`, `src/pages/ProfilePage.jsx`, `app-config.js`, `vite.config.js`, `index.html`, `package.json`, `.env.example`, `.gitignore`. npm audit was run against the installed dependency tree.

**Top 3 most critical findings:**

1. **SEC-003** — `isConfigured()` in `src/config.js` has inverted return logic: returns `false` for both known valid production partner tags, silently disabling any feature gated on this function.
2. **SEC-001** — The Express production server sets no HTTP security headers: no CSP, no X-Frame-Options, no X-Content-Type-Options, no Referrer-Policy, no HSTS via Strict-Transport-Security header.
3. **SEC-006** — The rate limiter uses `trust proxy: 1` with no validation that Hostinger strips client-supplied X-Forwarded-For headers before the app receives them, creating a potential rate limit bypass path.

**Security maturity snapshot:**
The project demonstrates strong fundamentals in credential management (AWS credentials in environment variables only, never transmitted to the client), input validation (strict ASIN regex), graceful error handling, and correct external link hygiene. The main gaps are defensive-layer gaps: missing security headers, incomplete server hardening, and an incomplete logging posture. There are no injection vulnerabilities, no hardcoded secrets, no XSS vectors, and no CVEs in any installed dependency. The overall posture is appropriate for a pre-launch affiliate SPA with one confirmed logic bug requiring resolution before launch.

**Overall confidence:** High. All findings are based on direct source code review. The npm audit confirmed zero known CVEs.

**What was not assessed:**
- Runtime behavior on Hostinger's actual infrastructure (X-Forwarded-For handling, TLS termination point, environment variable exposure)
- Amazon PA API credential validity and quota status
- Browser-side security tool scanning (Lighthouse, CSP evaluator)
- Penetration testing of any kind

---

## 2. Vulnerability Inventory

| ID | Title | Domain | Severity | Confidence | Component | Status |
|---|---|---|---|---|---|---|
| SEC-001 | Missing HTTP Security Headers | Configuration and Infrastructure | Medium | High | `server/static-server.js` | Confirmed |
| SEC-002 | Unvalidated `tag` Parameter Enables Affiliate Tag Injection | Input Handling and Injection | Low | High | `server/amazon-api.js` | Confirmed |
| SEC-003 | `isConfigured()` Inverted Logic Silently Disables Features | Authentication and Access Control | High | High | `src/config.js` | Confirmed |
| SEC-004 | Unused Production Dependencies Increase Attack Surface | Dependency and Supply Chain | Low | High | `package.json` | Confirmed |
| SEC-005 | `.env.example` Incomplete — Two Vite Variables Undocumented | Configuration and Infrastructure | Low | High | `.env.example` | Confirmed |
| SEC-006 | Rate Limiter IP Trust Misconfiguration Risk | Configuration and Infrastructure | Medium | Medium | `server/static-server.js` | Suspected |
| SEC-007 | No Security Event Logging | Observability and Incident Response | Low | High | `server/static-server.js`, `server/amazon-api.js` | Confirmed |
| SEC-008 | `react-helmet` 6.1.0 — Deprecated and Unmaintained | Dependency and Supply Chain | Low | High | `package.json` | Confirmed |

---

### Full Detail — High Finding

**SEC-003: `isConfigured()` Inverted Logic Silently Disables Features**
- **Domain:** Authentication and Access Control
- **Type:** CWE-670 (Always-Incorrect Control Flow Implementation)
- **Severity:** High
- **Confidence:** High
- **Affected Component:** `src/config.js`, lines 56–58
- **Status:** Confirmed
- **Evidence:** The function reads:
  ```
  export const isConfigured = () => {
    return AMAZON_CONFIG.PARTNER_TAG !== 'skaldcraft-21' && AMAZON_CONFIG.PARTNER_TAG !== 'noworriesgift-20';
  };
  ```
  Both production partner tags (`skaldcraft-21` for ES, `noworriesgift-20` for US) are the condition under which the function returns `false`. In any legitimate production or development context, the function will always return `false`.
- **Risk Narrative:** Any conditional logic guarded by `isConfigured()` will never execute in production. If the frontend uses this function to gate live-data fetching, affiliate URL construction, or feature display, those code paths are silently dead. The bug introduces invisible behavioral differences between what the developer expects and what users experience, with no error surface to diagnose.
- **Remediation:** Invert the boolean condition. The function should return `true` when a valid known partner tag is present:
  ```
  return AMAZON_CONFIG.PARTNER_TAG === 'skaldcraft-21' || AMAZON_CONFIG.PARTNER_TAG === 'noworriesgift-20';
  ```
  This is the existing ACT-002 action in the Action Planner.
- **Acceptance Criterion:** `isConfigured()` returns `true` when called in the ES market context (tag: `skaldcraft-21`) and in the US market context (tag: `noworriesgift-20`). Returns `false` for an empty string or an unrecognized tag.
- **Effort:** S
- **Rollback Note:** Revert the single-line change in `src/config.js`. No data loss. Any feature currently gated by `isConfigured()` will return to the broken state, which is the current production behavior.

---

### Full Detail — Medium Findings

**SEC-001: Missing HTTP Security Headers**
- **Domain:** Configuration and Infrastructure
- **Type:** CWE-16 (Configuration)
- **Severity:** Medium
- **Confidence:** High
- **Affected Component:** `server/static-server.js`
- **Status:** Confirmed
- **Evidence:** A full read of `server/static-server.js` confirms no security headers are set manually and the `helmet` package is not installed or imported. The `index.html` contains no CSP meta tag. Headers absent from every response:
  - `Content-Security-Policy` — no restriction on script, style, or image sources
  - `X-Content-Type-Options: nosniff` — browsers may sniff MIME types
  - `X-Frame-Options` / CSP `frame-ancestors` — the app can be iframed by any origin (clickjacking vector)
  - `Referrer-Policy` — full URL sent in `Referer` header to external sites including Amazon
  - `Permissions-Policy` — no restriction on browser API access (camera, microphone, etc.)
  - `Strict-Transport-Security` — HTTP→HTTPS redirect is implemented in middleware, but without HSTS a user's first-ever HTTP request can be intercepted before the redirect occurs
- **Risk Narrative:** The missing headers represent defense-in-depth gaps rather than active vulnerabilities in the current codebase. No XSS vectors were found during this review. However, without a CSP, any future XSS introduced through a dependency update or data injection would have no browser-level containment. The missing Referrer-Policy means that when users click Amazon affiliate links, the full URL of the originating page (including any `?lang=en` parameters) is sent to Amazon. Clickjacking is a low-risk concern given there are no auth flows, but the lack of `frame-ancestors` is a gap.
- **Remediation:** Install `helmet` npm package (`npm install helmet`) and add `app.use(helmet())` as the first middleware in `static-server.js`. Then tune CSP specifically to allow Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`), Amazon image CDN (`m.media-amazon.com`), and same-origin scripts. Reference: https://helmetjs.github.io/
- **Acceptance Criterion:** A response from the production server includes at minimum: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and a `Content-Security-Policy` that passes a CSP evaluator without `unsafe-eval` or `unsafe-inline` for script-src.
- **Effort:** S
- **Rollback Note:** Remove the `helmet()` call and uninstall the package. No data loss. Verify all static assets and fonts still load after adding CSP.

**SEC-006: Rate Limiter IP Trust Misconfiguration Risk**
- **Domain:** Configuration and Infrastructure
- **Type:** CWE-290 (Authentication Bypass by Spoofing)
- **Severity:** Medium
- **Confidence:** Medium
- **Affected Component:** `server/static-server.js`, line 26 (`app.set('trust proxy', 1)`)
- **Status:** Suspected
- **Evidence:** `app.set('trust proxy', 1)` tells Express to trust exactly one hop of reverse-proxy forwarding. The rate limiter (`express-rate-limit`) uses the resolved client IP as the rate limit key. On Hostinger, the server sits behind a reverse proxy that sets `X-Forwarded-For`. If that proxy does not strip client-supplied `X-Forwarded-For` headers before appending its own, an attacker could supply a spoofed IP (e.g., `X-Forwarded-For: 1.2.3.4`) and the Express app would use `1.2.3.4` as the rate limit key. This is a structural concern with the `trust proxy` setting and cannot be confirmed without knowledge of Hostinger's proxy behavior.
- **Risk Narrative:** Rate limit bypass would allow an attacker to call `/api/products` at higher frequency than 1 req/s, potentially draining the Amazon PA API quota and triggering account-level throttling or suspension by Amazon. The Amazon PA API has strict rate limits; sustained abuse could disable live product data for all users.
- **Remediation:** Confirm with Hostinger documentation or support that the hosting platform's reverse proxy strips and replaces `X-Forwarded-For` before the Node.js app receives the request. If confirmed, `trust proxy: 1` is correct. If unconfirmed, consider using a custom `keyGenerator` in the rate limiter that uses `req.socket.remoteAddress` (the actual TCP connection IP) rather than the forwarded header. Low effort once Hostinger's proxy behavior is confirmed.
- **Acceptance Criterion:** Documented confirmation that Hostinger's reverse proxy replaces (not appends) `X-Forwarded-For`, OR the rate limiter uses the socket remote address as its key.
- **Effort:** S
- **Rollback Note:** No code change required if the investigation confirms Hostinger's proxy behavior is safe. If a keyGenerator is added, revert the single function addition.

---

### Medium and Low Finding Summaries

**SEC-002: Unvalidated `tag` Parameter**
`server/amazon-api.js` line 136 accepts any string as the `tag` request body field without validating it against the two known partner tags. The tag is used in the Amazon PA API request body and in the `affiliate_url` returned to the client. A direct caller of the API could supply their own Amazon Associates tag to generate affiliate URLs benefiting them. Normal users cannot influence the `tag` field (it is set by the frontend config). Amazon validates tags against the authenticated AWS account, so unauthorized tags will not generate valid affiliate commissions. Remediation: add a whitelist check against `['skaldcraft-21', 'noworriesgift-20']` and reject unrecognized tags with 400. Effort: S.

**SEC-004: Unused Production Dependencies**
Two packages in `dependencies` (not `devDependencies`) are not imported anywhere in the source code: `@google/generative-ai` (the Google Gemini SDK) and `cors`. Since Vite performs tree-shaking, neither package is included in the production JS bundle. However, both packages are installed in `node_modules` and contribute to the installed attack surface and supply chain risk. `@google/generative-ai` should be moved to `devDependencies` if needed for tooling, or removed entirely. `cors` should be removed unless a future cross-origin use case is planned. Effort: S.

**SEC-005: `.env.example` Incomplete**
The `.env.example` documents `AMAZON_ACCESS_KEY`, `AMAZON_SECRET_KEY`, and `PORT` but omits `VITE_API_URL` and `VITE_MANUAL_PRODUCT_MODE`, both of which are read in `src/config.js` at build time. Without these documented, a new deployer configuring a fresh environment may leave them unset. `VITE_MANUAL_PRODUCT_MODE` defaults to enabled (line 16: `import.meta.env.VITE_MANUAL_PRODUCT_MODE !== 'false'`), which silently disables live product fetching if not explicitly set to `'false'`. Remediation: add both variables to `.env.example` with inline comments. Effort: S.

**SEC-007: No Security Event Logging**
The server logs API errors via `console.error` but does not produce structured, queryable log output. Security-relevant events — rate limit violations, invalid ASIN submission patterns, repeated 503 responses (indicating credential absence) — are not captured in any log format that would support incident investigation. There is no alerting. Remediation: adopt a structured logging library (e.g., `pino`) and emit structured log events for security-relevant conditions. Effort: M.

**SEC-008: `react-helmet` 6.1.0 — Deprecated**
`react-helmet` version 6.1.0 is the last published version of this package (2020). The maintainer recommends `react-helmet-async` as a drop-in replacement. No CVEs are known for client-side-rendering usage. The risk is limited to the absence of future security patches. In an SSR context this package has a known memory leak, but this project is CSR-only. Remediation: replace with `react-helmet-async` (compatible API). Effort: S.

---

## 3. Dependency Risk Report

npm audit result (run 2026-03-26 against installed node_modules, 550 total packages):

| Severity | Count |
|---|---|
| Critical | 0 |
| High | 0 |
| Moderate | 0 |
| Low | 0 |
| Info | 0 |

**Result: Zero known CVEs in any installed dependency.**

| Dependency | Version | CVE(s) | CVSS | Status | Upgrade Path | Blocked? |
|---|---|---|---|---|---|---|
| `express` | ^4.21.2 | None | — | Clean | N/A | No |
| `express-rate-limit` | ^8.2.1 | None | — | Clean | N/A | No |
| `node-fetch` | ^3.3.2 | None | — | Clean | N/A | No |
| `react` | ^18.3.1 | None | — | Clean | N/A | No |
| `react-router-dom` | ^7.1.1 | None | — | Clean | N/A | No |
| `@google/generative-ai` | ^0.24.1 | None known | — | Clean but unused | Remove or move to devDeps | No |
| `react-helmet` | ^6.1.0 | None (CSR) | — | Deprecated, no CVEs | `react-helmet-async` | No |
| `vite` | ^7.3.1 | None | — | Clean | N/A | No |
| `cors` | ^2.8.6 | None | — | Clean but unused | Remove | No |

No package upgrades are required for security reasons. The npm audit is clean.

---

## 4. Configuration and Infrastructure Findings

**Hardcoded secrets:** None found. `AMAZON_ACCESS_KEY` and `AMAZON_SECRET_KEY` are read exclusively from `process.env` in `server/amazon-api.js` lines 116–117. They do not appear in any source file, configuration file, or build artifact. The `.gitignore` explicitly excludes `.env`. `.env.example` contains only placeholder values.

**Default credentials:** None applicable. The application has no user authentication system.

**Security headers:** As documented in SEC-001. The production Express server (`server/static-server.js`) sets no security response headers.

**CORS configuration:** No CORS headers are set. The `cors` npm package is installed but never imported. Since the SPA and API are same-origin, cross-origin API requests are blocked by browser policy by default. This is correct for the current architecture but is an implicit rather than explicit control.

**Debug panel:** The debug panel in `src/pages/HomePage.jsx` (lines 331–406) is correctly guarded by `{IS_DEV && (` where `IS_DEV = import.meta.env.DEV`. In a production Vite build, `import.meta.env.DEV` is compiled to `false`, so the panel is never rendered in production. Risk R5 from the handoff package is **not confirmed** — the guard already exists. No action required.

**Logging and observability gaps:** `console.error` is the only logging mechanism for server-side errors. Server process logs on Hostinger are only available through the hosting panel and are not queryable or alertable. The telemetry module (`src/lib/telemetry.js`) has a placeholder for Sentry integration but it is not wired up.

**Legacy server file:** `server/api-proxy.js` is a legacy static-file-only server that does not include the `/api/products` handler. It is not referenced by `package.json` scripts but exists in the repository. If accidentally used as the entry point instead of `static-server.js`, the Amazon proxy functionality would be silently absent (404 on `/api/products`, no 503 signal to the frontend's fallback logic). This is an operational risk, not a security risk, but it warrants a comment or removal.

---

## 5. Remediation Roadmap

| Priority | Finding ID | Objective | Effort | Acceptance Criterion | Dependencies |
|---|---|---|---|---|---|
| Now (High) | SEC-003 | Fix inverted logic in `isConfigured()` | S | `isConfigured()` returns `true` for both valid production partner tags | None |
| Next (Medium) | SEC-001 | Add HTTP security headers via `helmet` middleware | S | Production responses include nosniff, frame-ancestors, Referrer-Policy, and CSP without unsafe-inline on script-src | None |
| Next (Medium) | SEC-006 | Confirm Hostinger proxy X-Forwarded-For behavior; document or fix rate limiter key source | S | Written confirmation or code change per acceptance criterion in SEC-006 | None |
| Later (Low) | SEC-002 | Add partner tag whitelist validation in API handler | S | POST /api/products with an unrecognized tag returns HTTP 400 | None |
| Later (Low) | SEC-004 | Remove or reclassify unused dependencies | S | `@google/generative-ai` and `cors` removed from production `dependencies` | None |
| Later (Low) | SEC-005 | Add `VITE_API_URL` and `VITE_MANUAL_PRODUCT_MODE` to `.env.example` | S | Both variables documented with default values and inline comments | None |
| Later (Low) | SEC-007 | Adopt structured logging for security events | M | Rate limit violations and invalid ASIN attempts emit structured log records | Hosting infrastructure review |
| Later (Low) | SEC-008 | Replace `react-helmet` with `react-helmet-async` | S | App builds and all four routes render with correct SEO metadata | None |

---

## 6. Hardening Recommendations

The following recommendations go beyond fixing specific findings and address structural posture improvements specific to this project's architecture.

**1. Adopt a Content Security Policy tailored to this application's external dependencies.** The app loads assets from Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) and Amazon image CDN (`m.media-amazon.com`). A CSP `script-src 'self'`, `style-src 'self' fonts.googleapis.com`, `img-src 'self' m.media-amazon.com data:` policy would be a tight fit for this stack. The absence of any server-side rendering or inline event handlers makes a strict CSP achievable without `unsafe-inline`.

**2. Retire or remove `server/api-proxy.js`.** This file is a pre-integration legacy artifact. Leaving it in the repository creates a deployment trap: if a future operator reads the file header ("Static file server for Hostinger Node.js hosting") and uses it as the entry point, the Amazon API proxy is silently absent with no error. Add a comment at the top warning it is superseded by `static-server.js`, or delete the file.

**3. Document the `VITE_MANUAL_PRODUCT_MODE` default behavior in operator-facing documentation.** The default is `true` (manual/static mode) unless the variable is explicitly set to the string `'false'`. This is counterintuitive: a missing variable enables manual mode, not disables it. Any operator who does not explicitly set this variable will deploy with live Amazon fetching silently disabled. This should be called out in the README deployment section and in `.env.example` (see SEC-005).

**4. Wire up the telemetry error integration before public launch.** `src/lib/telemetry.js` has a placeholder for Sentry. Without an error reporting integration, server-side Amazon API failures, rate limit abuse patterns, and client-side rendering errors will be invisible until a user reports them. This is a pre-launch operational recommendation, not a post-launch concern.

---

## 7. Gatekeeper Input: Gate G4 Evidence

Gate G4 evaluates whether all Critical security findings are Mitigated or Accepted with rationale.

**Critical findings from this Security Review: None.**

The npm audit is clean. No finding in this review was assigned Critical severity. All injection surfaces reviewed were either properly validated (ASIN: strict regex) or low-exploitability (tag: no direct user access in normal flow). AWS credentials are correctly managed via environment variables only.

**Gate G4 result for this Security Review: PASSES.**

However, the following note applies to the overall Gatekeeper assessment: SEC-003 (High) is the same logical defect as the pre-existing finding ACT-002 in the handoff package. It does not trigger Gate G4 failure, but it must be resolved (as a Now action) before launch. The Gatekeeper's existing Conditional status is unchanged — the four mandatory conditions from the handoff package remain open.

---

## 8. Action Planner Input: Security Actions

The following entries are ready to import into the Project Action Planner backlog.

**SEC-ACT-001 — Fix `isConfigured()` inverted logic**
- Priority: Now (High)
- Effort: S
- Owner profile: Frontend Engineer
- Acceptance criterion: `isConfigured()` returns `true` when `AMAZON_CONFIG.PARTNER_TAG` is `'skaldcraft-21'` or `'noworriesgift-20'`; returns `false` for any other value
- Dependency: None
- Note: This is the same as existing ACT-002. Merge into ACT-002 rather than creating a duplicate action.

**SEC-ACT-002 — Add HTTP security headers (`helmet` middleware)**
- Priority: Next (Medium)
- Effort: S
- Owner profile: Backend Engineer or DevOps
- Acceptance criterion: Production server responses include `X-Content-Type-Options: nosniff`, a frame-restricting directive, `Referrer-Policy: strict-origin-when-cross-origin`, and a CSP that blocks `unsafe-eval` on script-src without breaking fonts or Amazon images
- Dependency: None

**SEC-ACT-003 — Confirm Hostinger proxy X-Forwarded-For behavior**
- Priority: Next (Medium)
- Effort: S
- Owner profile: DevOps / Platform Engineer
- Acceptance criterion: Written documentation confirming whether Hostinger strips or appends X-Forwarded-For, and corresponding code or documentation update to the rate limiter configuration
- Dependency: Hostinger environment access

---

## 9. Assumptions and Unknowns

**Access limitations:**
- Hostinger production environment was not accessible. Infrastructure behavior (TLS termination, proxy header handling, environment variable scoping) was inferred from standard Hostinger Node.js hosting conventions.
- No runtime execution was performed. All findings are based on static code analysis.
- The Amazon PA API credentials have not been configured in any environment. API behavior under live credentials was not tested.

**Low-confidence findings requiring confirmation:**
- **SEC-006** (Medium confidence): Rate limiter IP spoofing risk. Requires confirmation of Hostinger's proxy behavior before this can be upgraded to Confirmed or closed. Contact Hostinger support or review their Node.js hosting documentation for proxy header handling.

**Recommended follow-up activities:**
1. Once the Amazon PA API credentials are configured (mandatory condition from handoff), perform a live end-to-end validation that includes monitoring server logs for unexpected error patterns.
2. After `helmet` is added (SEC-ACT-002), run the CSP through a CSP evaluator (e.g., https://csp-evaluator.withgoogle.com/) to confirm it is correctly tuned for the app's external dependencies.
3. Before the first significant public traffic volume, investigate adopting Sentry or an equivalent error monitoring service to operationalize the telemetry module.
4. A full penetration test is not warranted at this stage of the project lifecycle, but a basic OWASP ASVS Level 1 self-assessment is recommended before exceeding 1,000 daily active users.

---

*Artifact: `noworries_security-review_20260326.md` — v1.0*
*Workflow: 05_security-review.md — antigravity skills framework*
*Mode: Comprehensive*
*npm audit: 0 vulnerabilities (550 packages)*
*Gate G4: PASSES — no Critical findings*
