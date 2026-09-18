---
paths:
  - "e2e/**/*.ts"
  - "**/*.spec.ts"
  - "playwright.config.ts"
---

# Testing

Playwright for end-to-end tests. Specs live in `e2e/`, one file per feature flow.

## Layout

```
e2e/
├── fixtures/
│   ├── auth.ts          # the role-scoped test fixture (see below)
│   └── storage/         # generated storageState files — gitignored
├── pages/               # page objects, one per screen, optional
├── setup/
│   └── auth.setup.ts    # signs each role in once, writes storageState
└── <feature>.spec.ts    # one file per feature flow
```

A page object is worth writing once a screen appears in three or more specs. Below that, inline locators read better than an indirection.

## Selectors

- Select by accessible role and name: `getByRole('button', { name: 'Sign in' })`. Fall back to `getByLabel` or `getByText`. Reach for `data-testid` only when nothing semantic identifies the element — needing one often means the markup isn't semantic enough.
- The name comes from the same `labels.ts` entry the UI renders (`.claude/rules/labels.md`), imported into the spec — not retyped as a literal that a copy edit silently breaks.

## Assertions

- Web-first assertions only: `await expect(locator).toBeVisible()`. Never `waitForTimeout`.
- Assert on what the user can perceive, not on internal state.

## Authentication and roles

`.claude/rules/routing.md` requires every route change to be tested authenticated, unauthenticated, and per affected role. That is only affordable if signing in isn't part of each spec.

- `auth.setup.ts` runs as a setup project, signs in once per role through the real login form, and saves `storageState` to `e2e/fixtures/storage/<role>.json`. Every other spec starts already authenticated by declaring that state — never by driving the login UI again.
- Feature specs declare the role they run as through the fixture. A spec that needs two roles uses two `test.describe` blocks with different storage states, not one test that signs out mid-flow.
- The unauthenticated case gets `storageState: { cookies: [], origins: [] }` and asserts the redirect to login — it does not simply omit the state and inherit whatever ran last.
- Forbidden-route coverage is a positive assertion: a role that must not reach a route is asserted to land on the redirect or the 403 screen, not merely asserted not to see the content.
- Expired or invalid session: force it with `page.route()` returning 401 on the session endpoint, and assert the app redirects to login rather than rendering a broken screen.
- The login flow's own spec is the one place that drives the login form directly.

## Coverage

- Cover every relevant UI state the feature renders, including loading, error, empty, and content states when they exist. Force error and empty paths with `page.route()` rather than hoping the backend produces them.
- Include a keyboard-only pass for each primary flow: Tab to the fields, type, Enter to submit, assert the result.
- A mutation's spec asserts the *result* of invalidation — the list reflects the change without a manual reload (`.claude/rules/queries.md`).

## Isolation

- Tests are independent and run in any order or in parallel. No shared mutable fixtures, no reliance on a previous test's leftovers.
- A test that creates server data cleans it up, or creates it under a unique name it generates itself. Never assume a fixed seed row exists.
- A test that fails intermittently gets fixed or deleted, never retried into passing. `retries` is for CI flake absorption on an already-green suite, not a way to land a flaky test.

## Configuration

- Test credentials and base URLs come from `.env`, unprefixed and read in `playwright.config.ts` — never `VITE_*`, which would ship them in the app bundle (`.claude/rules/security.md`). Never hardcoded. Every key is present in `.env.example` with a blank or placeholder value.
- `trace: 'on-first-retry'` and `screenshot: 'only-on-failure'` — a failure that can't be diagnosed from CI output costs more than the artifacts do.
- CI runs `npm ci` then `npx playwright install --with-deps`, then the suite against a production build via `webServer`, with `forbidOnly: true` and `workers: 1` only if the suite proves order-sensitive (which is a bug to fix, not a setting to keep).
