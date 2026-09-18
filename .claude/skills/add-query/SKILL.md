---
name: add-query
description: Use when adding or changing data access — "add an endpoint for X", "wire up the users API", "add a delete mutation", "fetch the order detail", "this needs to call the API". Creates a query or mutation in `src/queries/` with a Zod-parsed response, an exported key, correct invalidation, and a normalized error. Do NOT use for UI work (`new-feature`, `add-primitive`), for form validation schemas (those live in the feature's `.type.ts`), or for changing the query client's global defaults without raising it first.
---

## Overview

Every network call in this app lives in `src/queries/`, and nothing outside that folder touches the HTTP client. This skill is the checklist for adding one without leaving a hole — an unparsed response, an inlined key, or a mutation that changes data and forgets to invalidate it.

Full rules in `.claude/rules/queries.md`.

## Workflow

### 1. Check it doesn't already exist

Read `src/queries/` for the domain folder. An existing query you can reuse, or extend with a parameter, beats a second file hitting the same endpoint. Two queries against one endpoint with different keys means two caches that drift apart.

### 2. Establish the real contract

Before writing the schema, know what the endpoint actually returns — from the API docs, an example response, or by asking. Do not infer a response shape from what the UI wants; that is how a schema passes review and fails in production.

For each field, settle: is it nullable, is it optional, and is it ever absent versus explicitly `null`? Zod treats those differently and the distinction is where boundary bugs live.

### 3. Place the file

```
src/queries/<domain>/<name>Query.ts      # a read
src/queries/<domain>/<name>Mutation.ts   # a write
```

One operation per file. Request and response types live beside the query here, never in a feature's `<feature>.type.ts`.

### 4. Parse the response

A Zod schema at the boundary, always. A server contract is an assumption until it's validated, and this parse is a security boundary, not a typing convenience (`.claude/rules/security.md`).

Never cast a JSON body into a type. `as Response` compiles and proves nothing.

### 5. Export the key

Defined once, beside the query, and exported. Never inlined at a call site.

- A whole collection a mutation invalidates in bulk → a plain string, `USERS_QUERY_KEY = 'users'`.
- Anything with a variable part → a factory returning a tuple, `userDetailKey = (id: string) => ['users', id] as const`.

Shape the key for how it needs to be invalidated, not for how it reads.

### 6. Guard a dependent query

If the query needs a value that may not exist yet — an ID from a route param, a prior query's result — it guards with `enabled: Boolean(id)`. Never let it fire with an `undefined` segment in the key.

### 7. For a mutation: invalidate exactly what changed

- Create or delete → the collection key.
- Update → the collection key **and** the entity's detail key.
- Logout → `queryClient.clear()`.

Walk through what the mutation actually changed and confirm each affected key is covered. A missing invalidation shows up as stale UI that a refresh fixes — the most annoying class of bug to diagnose later.

### 8. Normalize the failure

Raw HTTP or client-library errors must never reach a feature hook or component. Normalize into the application error shape, preserving what the feature needs to present or recover.

`onError` turns that into copy through the single shared helper (`getErrorMessage` in `shared/utils`), never a message re-derived inline. The copy itself comes from `labels.ts` (`.claude/rules/labels.md`).

### 9. Caching

Inherit the defaults from `client.ts`. Override `staleTime` only when this query's freshness requirement genuinely differs — not routinely. Changing the global defaults in `client.ts` is an application-wide decision; raise it rather than making it in passing.

### 10. Validate

`npm run typecheck` clean. Then confirm the consuming feature hook compiles against the new hook, and report the key you exported plus what invalidates it — that's the part a reviewer needs.

## Rules

- Nothing outside `src/queries/` touches the HTTP client. A feature hook calls a query hook; it never fetches.
- Every response is Zod-parsed. No exceptions, no casts.
- Keys are exported from beside their query, never written at a call site.
- No JSX in this folder, and no imports from `src/features/`.
- Base URLs, keys, and flags come from `import.meta.env`, never a literal — and only publishable values carry `VITE_` (`.claude/rules/security.md`).
- A mutation that changes server data and invalidates nothing is incomplete, even if it works on screen.
