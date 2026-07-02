# Instructions for this Playwright project

Before writing or editing any e2e test in this project, read and follow these
canonical guides (they are the single source of truth — do not duplicate them):

@PLAYWRIGHT_BEST_PRACTICES.md
@TEST_STRATEGY.md

- **PLAYWRIGHT_BEST_PRACTICES.md** — how to write the tests: resilient locators,
  always-soft assertions, POM + fixtures, per-test setup in `beforeEach`, test data,
  tags, code-quality tooling, and CI.
- **TEST_STRATEGY.md** — what to test and when: scope, test cases, and the
  smoke (daily) / regression (weekly) split.

## Required checks after editing (every time)
There are **no local git hooks** — nothing runs automatically on save or commit. So
after creating or editing any file under `playwright/`, you must run the quality gate
yourself, from the `playwright/` folder, and make it pass before treating the task as
done. These are the exact checks CI enforces in its `quality` job:

```
npm run check      # runs: lint + format:check + typecheck
```

If it reports problems, fix them and re-run until it passes:
- `npm run format`   — auto-format with Prettier (fixes `format:check` failures)
- `npm run lint:fix` — auto-fix ESLint issues; fix the rest by hand
- type errors from `typecheck` must be fixed by hand

Also decorate every new public async page-object method with `@Step()` (imported from
`@utils/step`) so it shows up in the HTML report as `ClassName.methodName` — see
PLAYWRIGHT_BEST_PRACTICES.md.
