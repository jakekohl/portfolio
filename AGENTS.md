# AGENTS.md

> Guidance for AI coding agents (Claude Code, GitHub Copilot, Cursor, etc.) working in this repository.

---

## Repository Overview

Jake Kohl's personal software engineering portfolio site — a full-stack monorepo with a Python/FastAPI backend and a VueJS frontend. The site lives at [jakekohl.dev](https://www.jakekohl.dev).

```
portfolio/
├── backend/          # Python · FastAPI REST API
├── frontend/         # JavaScript · VueJS + SCSS + Cypress + Playwright
├── .github/
│   └── workflows/    # CI/CD GitHub Actions pipelines
├── .cursor/
│   └── rules/        # Cursor IDE agent rules
└── README.md
```

---

## Architecture

| Layer     | Technology          | Notes                                      |
|-----------|---------------------|--------------------------------------------|
| Backend   | Python · FastAPI    | REST API; connects to a configured database |
| Frontend  | VueJS · JavaScript  | SPA; SCSS for styling                      |
| Testing   | Cypress · Playwright| E2E test suites live in the frontend       |
| CI/CD     | GitHub Actions      | Automated build, lint, and test pipelines  |

---

## General Coding Conventions

- **Clarity over cleverness.** Write readable, self-documenting code.
- **Consistent naming:** `snake_case` in Python; `camelCase` / `PascalCase` for Vue components and JS.
- **No commented-out dead code** in committed files — use git history instead.
- **Environment variables** for all secrets and config values; never hardcode credentials.
- **Small, focused commits** with descriptive messages.

---

## Backend (`/backend`)

### Stack
- **Language:** Python 3.x
- **Framework:** FastAPI
- **Database:** Configured via environment variable (check `backend/.env.example` or `backend/README.md`)

### Setup & Running
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Conventions
- Follow **PEP 8** and use type hints throughout.
- Organize routes into logical **APIRouter** modules — avoid putting everything in `main.py`.
- Use **Pydantic models** for all request/response schemas.
- Keep business logic out of route handlers; extract to service/utility modules.
- Return appropriate HTTP status codes; don't swallow exceptions silently.
- Add **docstrings** to all public functions and classes.

### Testing (Backend)
- Write unit tests with **pytest**.
- Test files live alongside source or in a `tests/` subdirectory.
- Run tests with:
  ```bash
  pytest
  ```
- Do **not** hit real external services in unit tests — mock them.

### Do Not
- Modify database schema without a corresponding migration.
- Commit `.env` files or secrets.
- Introduce new direct dependencies without adding them to `requirements.txt`.

---

## Frontend (`/frontend`)

### Stack
- **Framework:** VueJS (check `frontend/package.json` for the exact version — Vue 2 vs 3 affects the Options vs Composition API approach)
- **Language:** JavaScript
- **Styles:** SCSS
- **E2E Testing:** Cypress + Playwright

### Setup & Running
```bash
cd frontend
npm install
npm run dev       # or: npm run serve (depending on Vue version / config)
```

### Conventions
- **Single File Components (SFCs):** Each `.vue` file has `<template>`, `<script>`, and `<style scoped>` sections.
- **Component naming:** PascalCase filenames (`MyComponent.vue`); kebab-case in templates (`<my-component />`).
- **SCSS:** Use component-scoped styles where possible. Shared design tokens/variables go in a dedicated SCSS partial (e.g., `styles/_variables.scss`).
- **Props validation:** Always define prop types and defaults.
- **No inline styles** — keep styling in SCSS.

### Testing (Frontend)

#### Cypress
```bash
cd frontend
npx cypress open    # interactive
npx cypress run     # headless / CI
```
- Tests live in `frontend/cypress/e2e/`.
- Follow the **Page Object** pattern for selectors — don't scatter `cy.get()` calls throughout specs.
- Use `data-test` attributes for test selectors; do **not** rely on CSS classes or text strings.

#### Playwright
```bash
cd frontend
npx playwright test             # headless
npx playwright test --ui        # interactive UI mode
```
- Tests live in `frontend/tests/` (or `frontend/playwright/` — verify in `playwright.config.js`).
- Use Playwright's **locator API**; avoid raw `page.$()` selectors.
- Prefer `data-testid` attributes for stability.

#### General Testing Rules
- Every new user-facing feature should ship with at least one E2E test.
- Tests should be **independent** — no shared mutable state between specs.
- Clean up test data after each test run where possible.

### Building for Production
```bash
npm run build
```
Output goes to `frontend/dist/`.

---

## CI/CD (`.github/workflows/`)

- Pipelines run on **push** to `main` and on **pull requests**.
- Do **not** merge a PR that breaks a CI pipeline without explicit approval.
- When adding a new workflow file, keep jobs focused; separate lint, test, and build steps.
- Secrets are injected via GitHub repository secrets — never hardcode them.

---

## Cursor Rules (`.cursor/rules/`)

IDE-specific agent rules for Cursor are stored here. If you're a Cursor agent, load these rules before making changes. If you're another agent type, treat the conventions in those files as additional context.

---

## What Agents Should Always Do

1. **Read the relevant `README.md`** in `backend/` or `frontend/` before touching that workspace.
2. **Run the existing test suite** before and after making changes to verify nothing regressed.
3. **Scope changes to the task** — don't refactor unrelated files in the same PR.
4. **Add or update tests** for any new behavior introduced.
5. **Check GitHub Actions** — if a workflow file is relevant to your change, update it too.
6. **Prefer existing patterns** in the codebase over introducing new abstractions.

## What Agents Should Never Do

- Commit secrets, API keys, or credentials in any form.
- Delete or downgrade existing test coverage.
- Change the database schema without noting it explicitly in the PR description.
- Introduce a new npm or pip package without justification.
- Break the `npm run build` or `uvicorn` startup without fixing it in the same commit.
- Generate placeholder/lorem-ipsum content in production code paths.

---

## Asking for Clarification

If a task is ambiguous — especially around database schema changes, environment-specific config, or whether to use Cypress vs Playwright for a new test — **pause and ask** rather than making assumptions. The cost of a question is lower than the cost of a wrong migration or a flaky test.

---

*Last updated: 2026/06/06
