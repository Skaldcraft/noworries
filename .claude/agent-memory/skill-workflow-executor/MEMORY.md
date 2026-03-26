# Skill Workflow Executor — Memory

## Project: noworries

- Skills directory: `C:\Users\tradu\.antigravity\skills\Workflow\`
- Workflow files: 00_implementation-guide.md through 06_post-delivery-seo-optimizer.md
- Project root: `C:\Users\tradu\OneDrive\Documentos\Aplicaciones\NoWorries`
- Handoff artifacts saved to: `.claude/handoff/` within the project root

## Artifacts produced

| Artifact | Date | Workflow |
|---|---|---|
| `noworries_handoff-packager_20260326.md` | 2026-03-26 | 04_handoff-packager |
| `noworries_security-review_20260326.md` | 2026-03-26 | 05_security-review |

## Last execution (2026-03-26) — Skill 05 Security Review

- Mode: Comprehensive (first security review; no prior review existed)
- npm audit: 0 vulnerabilities across 550 packages (clean)
- Gate G4: PASSES — no Critical findings
- One High finding: SEC-003 = ACT-002 isConfigured() bug (pre-existing)
- Two Medium findings: SEC-001 missing security headers, SEC-006 rate limiter IP trust
- Debug panel (R5 from handoff) is NOT a confirmed issue — already guarded by `import.meta.env.DEV`

## Workflow execution pattern

When the user asks to "run workflow 04", execute the full upstream chain first:
1. Read all skill files (00–04) to understand the contract
2. Explore the project source to gather evidence
3. Execute skills 01, 02, 03 internally, then produce 04 output
4. Write the artifact to `.claude/handoff/{slug}_handoff-packager_{YYYYMMDD}.md`

For skill 05, read the skill file, load the prior handoff artifact as context, then do comprehensive source code analysis before writing output.

## Key project facts

- Bilingual SPA: ES (es.noworries.gift) and US (en.noworries.gift)
- Amazon PA API 5.0 backend proxy in `server/amazon-api.js`
- Active server entry point: `server/static-server.js` (NOT `server/api-proxy.js` — that is legacy)
- Graceful fallback to static JSON when Amazon API unavailable
- Partner tags: `skaldcraft-21` (ES), `noworriesgift-20` (US)
- Hosting: Hostinger Node.js
- Frontend: Vite + React 18 + Tailwind + i18next
- No test suite, no CI/CD

## Known bugs (as of 2026-03-26)

- `isConfigured()` in `src/config.js` has inverted return logic (ACT-002 / SEC-003)
- `DEPLOYMENT_CONFIG.PORT` not set in `app-config.js` (ACT-003)
- `VITE_MANUAL_PRODUCT_MODE` defaults to true (manual/static mode) unless explicitly set to `'false'` — counterintuitive default

## Key security posture facts

- AWS credentials: environment variables only, never client-exposed — clean
- ASIN validation: strict regex `^[A-Z0-9]{10}$` — clean
- No dangerouslySetInnerHTML, no eval, no document.write — clean
- External links: `rel="noopener noreferrer sponsored"` — clean
- Security headers: NONE set in production server (SEC-001, Medium)
- Debug panel: correctly guarded by `import.meta.env.DEV` — no production exposure
