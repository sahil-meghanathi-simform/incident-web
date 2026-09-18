---
paths:
  - "src/**/use*Hook.ts"
  - "src/**/*Component.tsx"
  - "src/app.tsx"
  - "src/main.tsx"
  - "src/routes.tsx"
  - "src/router/**"
  - "src/shared/constants/**"
---

# Routing

React Router. Navigate with `useNavigate()`; link with `<Link to={...}>`.

Route changes must preserve existing access-control behavior — authentication, role-based permissions, and feature flags — exactly as it stood before the change.

## When adding or modifying a route

- Review all auth and permission checks for every route the change affects.
- Confirm no route is exposed to a user who shouldn't reach it.
- Add or update tests covering: authenticated vs. unauthenticated, each affected role, and edge cases like an expired session.
- Summarize the access-control impact when handing the change over — which routes were touched, which roles reach them, and what was verified. Once a PR workflow exists this belongs in the PR description.

## Navigation paths

All route paths come from a single `ROUTES` source in `shared/constants/routes.ts`. Never hardcode a path string in `navigate()` or `<Link>` — import it from `ROUTES` instead.
