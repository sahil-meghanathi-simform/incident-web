# Architecture

React + TypeScript + Vite single-page app. Tailwind v4 for styling, TanStack Query for server state, React Router for navigation, React Hook Form + Zod for forms, Playwright for end-to-end tests.

This file has no `paths:` frontmatter, so it is always in context. It defines the shape of the codebase; the other files in `.claude/rules/` define the rules for each part of it and load only when you touch matching files.

## Naming

**Folders are lowercase** — camelCase when the name needs more than one word (`shared/components/`, `features/userProfile/`).

**Files are camelCase** — `button.tsx`, `itemsQuery.ts`, `pageSkeleton.tsx`, `useLoginHook.ts`.

**The exported symbol keeps its own casing**, independent of the file name: `button.tsx` exports `Button`, `routes.ts` exports `ROUTES`. JSX requires a capitalized identifier, so a component file's name and its export deliberately differ. Import by the export name, from the camelCase path:

```ts
import { Button } from '@/shared/components/button';
```

The only names that carry a suffix are the two that the rule files and `.claude/hooks/check-rules.sh` match on: `<feature>Component.tsx` and `use<Feature>Hook.ts`.

## Folder tree

```
src/
├── features/                  one folder per screen or flow
│   └── <feature>/
│       ├── <feature>.type.ts        types, Zod schema, hook return type
│       ├── use<Feature>Hook.ts      logic — no JSX; `.ts` makes that a compiler error
│       ├── <feature>Component.tsx   JSX only — consumes the hook
│       └── components/              optional, for a page too large for one file
├── shared/
│   ├── components/            reusable primitives — button, panel, field/, dialog, alert, errorBoundary, pageSkeleton
│   ├── hooks/                 hooks used by more than one feature, Context providers
│   ├── constants/             labels.ts, routes.ts
│   └── utils/                 formatting and shared helpers (getErrorMessage, date/number)
├── queries/                   every query and mutation; the only place the HTTP client is touched
├── types/                     types shared by two or more features
├── routes.tsx                 route table — every feature route wrapped in ErrorBoundary
└── index.css                  the single @theme block — all design tokens
e2e/                           Playwright specs, one file per feature flow
```

## The three-file feature pattern

A feature root holds **exactly three files**. Raise it before adding a fourth there.

| File | Holds | Never holds |
|---|---|---|
| `<feature>.type.ts` | Props types, the hook's return type, the Zod schema and its inferred type | JSX |
| `use<Feature>Hook.ts` | `use<Feature>Hook` — state, derived state, handlers, query/mutation orchestration, navigation | JSX, ever |
| `<feature>Component.tsx` | JSX, styling, accessibility, event wiring | Business logic, data fetching, `src/queries/` imports |

Data flows one way: `src/queries/` → the feature hook → the component's props. A `<feature>Component.tsx` never imports from `src/queries/`; every value it renders arrives through the hook.

A page too large for one Component file splits into `features/<feature>/components/<subComponent>.tsx` — camelCase names, no `Component` suffix. That subfolder does not count against the three-file rule.

Details: `.claude/rules/hooks.md`, `.claude/rules/components.md`, `.claude/rules/typescript.md`.

## Where a new piece of code goes

| What you're adding | Where |
|---|---|
| A new screen or flow | New `src/features/<feature>/` with the three files, plus a route wrapped in `ErrorBoundary` |
| An addition to an existing screen | Extend that feature's existing three files |
| UI reused across features, or obviously about to be | `src/shared/components/` — presentational primitives take everything through props; a composite may own its own self-contained query (`.claude/rules/components.md`) |
| A sub-piece of one oversized page | `src/features/<feature>/components/` |
| Logic reused across features | `src/shared/hooks/` |
| A query or mutation | `src/queries/<domain>/<name>Query.ts` or `<name>Mutation.ts` |
| A transport or storage helper for the query layer | `src/queries/<domain>/<name>Store.ts` — used by that domain's queries, never imported by a feature |
| A user-visible string | `src/shared/constants/labels.ts` |
| A route path | `src/shared/constants/routes.ts` |
| A design token | The `@theme` block in `src/index.css` — a design-system change, raise it first |

## Hard limits

- **300 lines per file.** Split before crossing it, not after. For a feature hook, identify a cohesive extraction and mention it before adding files (`.claude/rules/hooks.md`). For a component, promote a piece of JSX into `components/` (`.claude/rules/components.md`).
- **One exported component per file.** Named exports, never default.
- **Three files at a feature root.** A `components/` subfolder is the sanctioned split.
- **Every feature route is wrapped in `ErrorBoundary`** in `src/routes.tsx`. A feature that throws takes down its own screen, never the app (`.claude/rules/components.md`).
- **Folders lowercase, files camelCase.** See Naming above.

## Environment variables

Never hardcode a value that belongs in `.env` — base URLs, keys, and flags come from `import.meta.env`.

Only values safe to publish may carry the `VITE_` prefix: Vite inlines them into the client bundle where anyone can read them. Secrets do not belong in this app at all. `.claude/rules/security.md` covers exactly which values qualify and where auth tokens may live.

## Acknowledging a sanctioned exception

A few rules here have narrow, named exceptions — a genuinely dynamic inline `style`, a visually hidden file input, a `@ts-expect-error` with an upstream cause. `.claude/hooks/check-rules.sh` cannot tell those from a violation, so mark one with a `rules-ok:` comment on the offending line or the line directly above, naming the reason:

```tsx
{/* rules-ok: measured width from ResizeObserver, tailwind.md permits dynamic values */}
<div style={{ width }} />
```

The acknowledgement suppresses that one line, and nothing else. It is a claim you have to defend in review, not a mute button — if you can't name the sanctioned case the rule allows, fix the code instead.

## Commands

```
npm run lint          eslint
npm run typecheck     tsc --noEmit
npm run build         production build
npm run preview       serve the build
npm run test:e2e      playwright
```

`npm run lint` and `npm run typecheck` must both pass clean before any change is handed over.

## Rule map

| Working on | Read |
|---|---|
| Anything | this file |
| `use<Feature>Hook.ts` | `hooks.md`, `forms.md`, `routing.md`, `labels.md` |
| `<feature>Component.tsx` | `components.md`, `tailwind.md`, `accessibility.md`, `labels.md` |
| `<feature>.type.ts` | `typescript.md`, `forms.md`, `labels.md` |
| `src/queries/**` | `queries.md`, `labels.md` |
| `src/shared/components/**` | `components.md`, `tailwind.md`, `accessibility.md` |
| Routing, error boundaries, or Context | `routing.md`, `state-management.md`, `components.md` |
| `e2e/**` | `testing.md` |
| Anything touching auth, env, or untrusted input | `security.md` |
