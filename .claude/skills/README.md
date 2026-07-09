# Claude Code Skills

This folder holds the [Claude Code](https://docs.claude.com/en/docs/claude-code)
**Agent Skills** that ship with this repo. A skill is a small, self-contained
folder with a `SKILL.md` that teaches the agent a repeatable, project-specific
workflow. Claude loads a skill automatically when a task matches its
`description`, or you can invoke one by name with `/<skill-name>`.

## Skills in this repo

| Skill | What it does |
| --- | --- |
| [`authoring-playwright-test`](authoring-playwright-test/SKILL.md) | Write, edit, or review end-to-end Playwright tests against the project's standards (locators, soft assertions, POM + fixtures, the `@Step` decorator, tags, test data, file placement). |
| [`format-check`](format-check/SKILL.md) | Run the Playwright quality gate (lint + `format:check` + typecheck) after editing anything under `playwright/`, and auto-fix failures. |
| [`test-from-ticket`](test-from-ticket/SKILL.md) | Parse a pasted Jira/GitHub ticket and generate a structured test plan with cases derived from its acceptance criteria. |

## Top resources for Claude Skills

Directories and collections for discovering, learning, and reusing skills:

- **[skills.sh](https://www.skills.sh/)** — searchable directory of community Agent Skills.
- **[alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills)** — a curated GitHub collection of ready-to-use Claude skills.
- **[claudeskills.info](https://claudeskills.info/)** — guides and a catalog for finding and building Claude Skills.

## Adding a new skill

1. Create a folder `.claude/skills/<skill-name>/` with a `SKILL.md`.
2. Give it YAML frontmatter with a `name` and a precise `description` — the
   `description` is what Claude uses to decide when to auto-invoke the skill, so
   state clearly what it does and when to use it.
3. Keep the body focused on the workflow; link out to the canonical docs
   (e.g. `playwright/PLAYWRIGHT_BEST_PRACTICES.md`) rather than duplicating them.
