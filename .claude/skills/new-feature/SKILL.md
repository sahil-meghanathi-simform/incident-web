---
name: new-feature
description: Use when adding a new screen or flow to this app — "add a users list page", "create a login screen", "new settings feature", "scaffold the X feature". Creates a `src/features/<feature>/` folder following the three-file pattern (type file, feature hook, Component) with the route, labels, and queries wired up. Do NOT use for editing an existing feature (extend its three files directly), for a reusable primitive (that's `add-primitive`), for a query or mutation alone (`add-query`), or when building from a Figma design (`figma-ui`).
---

## Overview

Scaffold a new feature the way this codebase already works. The pattern is defined in `.claude/rules/architecture.md`; this skill is the order of operations for applying it without leaving loose ends.

The three files are not a template to fill in mechanically. Every one of them should contain only what this particular feature needs — an empty state field, an unused handler, or a placeholder type is worse than its absence.

## Workflow

### 1. Settle the name and the shape

Settle the feature name in PascalCase first — `Login`, `UserProfile`, `Users` — because the hook and type names derive from it. On disk it lowercases: the folder is `src/features/login/`, `src/features/userProfile/`, and the files are camelCase (`.claude/rules/architecture.md`).

```
src/features/userProfile/
  userProfile.type.ts
  useUserProfileHook.ts
  userProfileComponent.tsx
  components/          optional
```

Before writing anything, be clear on three things, and ask if the request doesn't settle them:

- **What data does the screen need?** Which endpoints, and do they already exist in `src/queries/`?
- **What can the user do here?** Each action becomes a named handler on the hook.
- **Is it reachable, and by whom?** A route, and whether it's behind auth or a role.

### 2. Look before you build

- `src/shared/components/` — the primitives that already exist. Compose them; never rebuild one (`.claude/rules/components.md`).
- `src/queries/` — whether the queries this screen needs are already written.
- `src/shared/constants/labels.ts` and `routes.ts` — existing copy and paths.
- An existing feature of similar shape — the closest working example beats this document.

### 3. `<feature>.type.ts`

camelCase feature name plus `.type.ts`. Holds, in this order after the imports:

- The Zod schema and its inferred type, if the feature has a form (`.claude/rules/forms.md`).
- The hook's return type — a `type`, not an `interface`, wrapped in `Readonly<...>` rather than per-property `readonly`.
- Props types for anything in a `components/` subfolder.

No JSX. Full rules in `.claude/rules/typescript.md`.

### 4. `use<Feature>Hook.ts`

Exports exactly one hook, `use<Feature>Hook`, annotated with the return type from step 3.

It owns local and derived state, form state, selection/filter/modal state, handlers, query and mutation orchestration, and navigation decisions. It returns **named handlers** — `onDeleteClick`, `onConfirmDelete` — never raw setters.

No JSX, ever. Full rules in `.claude/rules/hooks.md`.

### 5. `<feature>Component.tsx`

JSX only. Consumes `use<Feature>Hook`, renders what the hook exposes, and never imports from `src/queries/`.

Render every state the feature actually has — loading as a content-shaped skeleton, error with an explanation and a recovery action, empty with a next action, and content. Give every interactive element its hover, active, disabled, and focus-visible states. Full rules in `.claude/rules/components.md`, styling in `.claude/rules/tailwind.md`, accessibility in `.claude/rules/accessibility.md`.

### 6. Wire it up

None of these are optional, and all of them are easy to forget:

- **Copy** → add every user-visible string to `src/shared/constants/labels.ts`, including validation and error messages.
- **Route** → add the path to `ROUTES` in `src/shared/constants/routes.ts`, then register the route in `src/routes.tsx` lazily, mapping the named export onto `default` (`.claude/rules/state-management.md`), **wrapped in `ErrorBoundary`** (`.claude/rules/components.md`):

  ```tsx
  const UserProfilePage = lazy(() =>
    import('@/features/userProfile/userProfileComponent').then((m) => ({
      default: m.UserProfileComponent,
    })),
  );

  <Route
    path={ROUTES.userProfile}
    element={
      <ErrorBoundary>
        <UserProfilePage />
      </ErrorBoundary>
    }
  />
  ```

  The boundary is not optional and it is not per-feature: it is the same shared `ErrorBoundary`, applied once per route. A route without one fails `.claude/hooks/check-rules.sh`.
- **Access control** → apply whatever auth or role guard this route needs, and say explicitly which roles reach it (`.claude/rules/routing.md`).
- **Queries** → if the data layer is missing, build it first via the `add-query` skill; don't inline a fetch.

### 7. Test

Add `e2e/<feature>.spec.ts` covering the primary flow, selected by accessible role and name, plus a keyboard-only pass. Force the error and empty paths with `page.route()` (`.claude/rules/testing.md`).

### 8. Validate and report

`npm run lint` and `npm run typecheck` clean. Then report: the files added, the route and who can reach it, the labels added, and anything you had to decide that the request didn't specify.

## Rules

- Exactly three files at the feature root. A `components/` subfolder is the sanctioned split for an oversized page; anything else gets raised first.
- Never scaffold a state, handler, or type the feature doesn't use. No placeholders.
- Never inline copy or a route path — `labels.ts` and `ROUTES` or it isn't done.
- Never let a Component reach `src/queries/` directly.
- Never register a feature route without wrapping it in `ErrorBoundary`.
- Folders lowercase, files camelCase, exports keep their own casing — `userProfileComponent.tsx` exports `UserProfileComponent`.
- If the feature needs a primitive that doesn't exist, add it to `shared/components/` via `add-primitive` — don't hand-roll it inside the feature.
