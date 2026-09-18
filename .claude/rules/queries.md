---
paths:
  - "src/queries/**"
---

# API layer

All queries and mutations live in `src/queries/`. Nothing outside this folder touches the HTTP client.

## Layout

```
src/queries/
├── client.ts                 # configured client, base URL from env
├── auth/
│   ├── loginMutation.ts
│   └── sessionQuery.ts
└── users/
    └── usersQuery.ts
```

Folders lowercase, files camelCase (`.claude/rules/architecture.md`). One file per query or mutation. Each exports its hook (`useLoginMutation`, `useUsersQuery`) and its key — the export keeps its own casing, the file does not.

A transport or storage helper that a domain's queries share — not itself a query — sits beside them as `<name>Store.ts`. It is internal to `src/queries/`: a feature never imports one.

## Rules

- Type-safe end to end: request params typed, response parsed and typed, hook return typed.
- Parse every response with a Zod schema at the boundary. A server contract is an assumption until it's validated — never cast a JSON body into a type.
- Request and response types live beside the query in this folder, not in a feature's `<feature>.type.ts`.
- Base URL, keys, and flags come from `import.meta.env`. Never a literal. Only values that are safe to publish belong there — `.claude/rules/security.md` covers which are.
- Normalize failures into a predictable application-level error shape before they reach feature code. Raw HTTP/client-library errors must never leak into feature hooks or components. The normalized error should preserve the information the feature needs to present or recover from the failure.
- No JSX, and no imports from `src/features/`, in this folder.

## Query keys

Query keys are defined once, beside the query they belong to, and exported — never inlined at a call site. Shape the key for how it needs to be invalidated:

- A whole collection that a mutation invalidates in bulk (e.g. `USERS_QUERY_KEY = 'users'`) can be a plain string.
- A key with a variable part — a detail view, a filtered list — is a factory function returning a tuple: `userDetailKey = (id: string) => ['users', id] as const`. This keeps entity-specific invalidation possible without touching the whole collection.

## Caching defaults

`client.ts` configures the query client's defaults once, application-wide: `staleTime`, `gcTime`, `retry`, and `refetchOnWindowFocus`. Individual queries inherit these and only override `staleTime` when that query's freshness requirement genuinely differs from the default — not as a routine per-query setting.

## Invalidation

A mutation's `onSuccess` invalidates exactly what it changed:

- Create or delete → invalidate the collection key.
- Update → invalidate the collection key and the entity's detail key.
- Logout → `queryClient.clear()`, not a targeted invalidation.

## Dependent queries

A query that needs a value that may not exist yet (an ID from a param, a prior query's result) must guard with `enabled`, e.g. `enabled: Boolean(id)`. Never let it fire with an empty or undefined key segment.

## Error handling

Turning a normalized failure into user-facing copy goes through one shared helper in `shared/utils` (e.g. `getErrorMessage`). Every mutation's `onError` calls it — never re-derive a message inline or duplicate the mapping logic per mutation.
