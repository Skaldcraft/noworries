# Essential Configuration Guardrail

## Purpose
Protect essential project configuration from accidental changes while allowing aggressive-but-safe UI, CSS, accessibility, and performance polish in application code.

## Protected Configuration Files
- `package.json`
- `vite.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `eslint.config.mjs`
- `jsconfig.json`
- `app-config.js`
- `components.json`

## Required Behavior
1. Do not edit protected configuration files unless the user explicitly approves the exact change.
2. Do not auto-install, remove, or upgrade dependencies without explicit approval.
3. Do not alter build, lint, bundling, runtime, or deployment behavior without explicit approval.
4. Keep logic and architecture unchanged during aesthetic or polish tasks.
5. If a requested improvement depends on protected config changes, stop and ask for approval with:
   - The minimal proposed change
   - The expected benefit
   - The rollback approach

## Default Mode For Frontend Polish
- Apply aggressive-but-safe improvements in app code and styles.
- Preserve design identity and readability.
- Keep changes reversible and grouped by category in the summary.

## Approval Template
Use this format before touching protected config:

"This improvement requires a protected config change in <file>. Proposed minimal change: <summary>. Benefit: <summary>. Rollback: revert <file> diff. Approve?"