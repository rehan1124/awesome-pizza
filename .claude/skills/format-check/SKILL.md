---
name: format-check
description: Run the Playwright quality gate (lint + format:check + typecheck) after editing files under playwright/, and auto-fix failures.
---

# Playwright quality gate

Run this after creating or editing **any** file under `playwright/`. There are no local
git hooks, so nothing runs automatically — you must run and pass this gate yourself
before treating the task as done. These are the exact checks CI enforces in its
`quality` job (`.github/workflows/playwright.yml`).

All commands run from the `playwright/` folder.

## 1. Run the gate

```
cd playwright
npm run check
```

`check` runs three read-only checks in sequence and stops at the first failure (`&&`):

| Step | Command | Fixer |
|---|---|---|
| lint | `eslint .` | `npm run lint:fix` |
| format:check | `prettier --check .` | `npm run format` |
| typecheck | `tsc --noEmit` | fix by hand |

If it passes, you're done.

## 2. If it fails, fix and re-run

- **Format failures** → `npm run format` (Prettier writes the fixes). Never hand-format;
  let Prettier own whitespace/quotes/semicolons/line-endings.
- **Lint failures** → `npm run lint:fix` for the auto-fixable ones; fix the rest by hand.
- **Type errors** → fix by hand (`tsc --noEmit` is the only gate that catches types,
  since Playwright transpiles each file in isolation and never fails on type errors).

Re-run `npm run check` until it is green. Because `&&` short-circuits, a lint error hides
the format/type results — clear each stage before trusting the next.

## Notes
- `check` is the read-only gate; `format` and `lint:fix` are the writers. Don't confuse
  `format:check` (verify) with `format` (write), or `lint` (verify) with `lint:fix` (write).
- See `playwright/PLAYWRIGHT_BEST_PRACTICES.md` → "Code quality" for the rationale.
