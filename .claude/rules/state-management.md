---
paths:
  - "src/**/*.tsx"
  - "src/shared/hooks/**"
---

# State Management & Code Splitting

## Context

Use React Context only for state that is genuinely global to the app: auth session, theme, feature flags, active permissions. Never reach for Context to avoid prop drilling for feature-local state — pass props, or keep the state in the feature's own hook.

- A Context provider lives in `shared/` (e.g. `shared/hooks/useAuthContext.ts` plus its provider component), since it's consumed across features.
- The auth Context holds the session in memory. It is not backed by `localStorage` — see `.claude/rules/security.md` for where tokens may live.
- Consume Context through a typed hook (`useAuthContext()`), never `useContext(AuthContext)` at the call site — this keeps the implementation swappable and gives one place to guard against a missing provider.
- A feature hook never creates its own Context. If two features need to share state, that state belongs in `shared/` or should be lifted to a shared ancestor — it's not a reason to introduce Context.

## Route-level code splitting

Every route component is lazy-loaded. Components use named exports (`.claude/rules/components.md`), so the dynamic import must map the named export onto `default` — `lazy()` resolves nothing else:

```tsx
import { lazy } from 'react';

const LoginPage = lazy(() =>
  import('@/features/login/loginComponent').then((m) => ({ default: m.LoginComponent })),
);
```

Wrap route definitions in `Suspense` with a real fallback — a content-shaped skeleton consistent with the loading states in `.claude/rules/components.md`, never a blank screen. Inside it, each feature route is wrapped in `ErrorBoundary`, so the two failure modes of a lazy route — the chunk not arriving, and the feature throwing once it renders — are both covered:

```tsx
<Suspense fallback={<PageSkeleton />}>
  <RouterRoutes>
    <Route
      path={ROUTES.login}
      element={
        <ErrorBoundary>
          <LoginPage />
        </ErrorBoundary>
      }
    />
  </RouterRoutes>
</Suspense>
```

- Split at the route/feature boundary, not for every small component. Splitting inside a feature only pays off for something genuinely heavy (a chart library, a rich text editor) that isn't needed on initial render.
- Never lazy-load `shared/components/` — they're used everywhere and belong in the main bundle. `ErrorBoundary` especially: a boundary inside a lazy chunk cannot catch that chunk failing to load.
