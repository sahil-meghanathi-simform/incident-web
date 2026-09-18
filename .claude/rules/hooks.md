---
paths:
  - "src/**/use*Hook.ts"
---

# Feature hooks

Each feature root holds one hook file, `use<Feature>Hook.ts`, exporting exactly one custom hook of the same name. It owns the feature's logic and returns a view-model the component can render directly.

The file is `.ts`, not `.tsx`. That is deliberate: JSX in a feature hook is a compiler error rather than a review comment.

## What a feature hook owns

A feature hook is not a query wrapper. It orchestrates the whole feature:

- local state
- derived state
- form state and handlers
- selection, filter, tab, and modal state
- event handlers
- query and mutation orchestration
- navigation decisions
- feature-specific business rules
- transformations the UI specifically needs

Server-state lifecycle — loading, error, caching, refetching, server data — belongs to TanStack Query. Consume the query and mutation hooks from `src/queries/` and orchestrate them. Never reimplement that lifecycle with local state and effects.

## Return contract

The return is feature-specific: exactly the state, derived state, data, and handlers the component needs to render and operate the feature. Nothing padded in for the sake of consistency.

```ts
export type UseUsersHookReturn = Readonly<{
  users: readonly User[];
  selectedUser: User | null;
  isDeleteDialogOpen: boolean;
  onDeleteClick: (user: User) => void;
  onConfirmDelete: () => void;
  onCloseDeleteDialog: () => void;
}>;
```

There is no mandatory field set. `isLoading` and `isError` are not required on every hook — expose them only when the component renders something for that state, and take them from the query rather than tracking them yourself.

Declare the return type in `<feature>.type.ts` and annotate the hook with it explicitly.

## Rules

- No JSX in a feature hook file. Ever — and the `.ts` extension enforces it.
- Never return raw setters. Return named handlers — `onDeleteClick`, `onConfirmDelete`, `onCloseDeleteDialog` — that encapsulate the transition. React Hook Form's `form` object is the one sanctioned exception: it is returned whole so the component can `register` fields and read `formState`, even though it carries `setValue` (see `.claude/rules/forms.md`). Submission still goes through a named handler from the hook, not a bare `form.handleSubmit` call assembled in the component.
- Data access goes through `src/queries/`. A feature hook calls a query or mutation hook; it never calls the HTTP client directly.
- This doesn't make the feature hook the exclusive caller of `src/queries/` — a `shared/components/` component or a feature's own `components/` subcomponent may own its own self-contained query, per `.claude/rules/components.md`. The feature hook still owns the feature's primary orchestration, business rules, and any data more than one part of the page depends on.
- Derive, don't store. Compute values from query data and existing state instead of mirroring them into new state.
- Use `useCallback` when stable handler identity provides a real benefit, particularly when passing handlers to memoized children. Use `useMemo` for genuinely expensive derivations. Don't memoize reflexively.
- Side effects belong in `useEffect` with an honest dependency array. Never disable the exhaustive-deps rule to make one pass.
- A feature hook does not catch its own render errors — it has no render. A throw from the feature's component is caught by the `ErrorBoundary` wrapping that route (`.claude/rules/components.md`).
- If a feature hook approaches 300 lines, stop and identify a cohesive extraction. Reusable logic may move to `src/shared/hooks/`; feature-specific logic should remain within the feature architecture. Mention the proposed extraction before adding files.
