---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# TypeScript

Strict mode is on and stays on. `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `noUnusedLocals`, and `noUnusedParameters` are all enabled in `tsconfig.json`.

## Banned

- `any` — in every form: annotations, generics, `as any`, implicit any from untyped parameters or callbacks.
- `@ts-ignore` — never, in any circumstance. It silences the error without recording that one exists, and it keeps silencing it after the underlying cause is gone.
- Non-null assertion `!` — narrow with a guard instead.
- Unsafe `as` casts — any cast that widens, narrows, or forces a type the compiler cannot verify (`as User`, `as unknown as T`, `as any`). Narrow with a type guard or validate with Zod instead. `as const` is allowed and encouraged: it only makes a literal more specific, it never asserts something unproven.
- The `enum` keyword — use an `as const` object plus a derived union type instead.
- `React.FC` — see the React section below.

A parameter that must stay unused to satisfy `noUnusedParameters` is prefixed with `_`.

## The one escape hatch

`@ts-expect-error` is the single sanctioned last resort, and only when the cause is genuinely outside this codebase — a third-party library shipping wrong or missing types, a DOM API the installed `lib` doesn't yet describe. It is never for our own code: if a type you control doesn't fit, the model is wrong and the model gets fixed.

It carries a comment on the line above naming the upstream cause and what would let it go:

```ts
// @ts-expect-error — @acme/chart 3.2 types `data` as any[]; drop when they ship the generic (acme/chart#412)
chart.setData(points);
```

`@ts-expect-error` over `@ts-ignore` always, because it fails the build once the upstream problem is fixed — which is what makes it self-cleaning rather than permanent. Reach for a type guard, a Zod parse, or a narrow local `declare module` augmentation before reaching for this. More than a couple in the codebase means a dependency needs replacing, not more suppressions.

## Data crossing the boundary

Anything originating outside the app — API responses, `localStorage`, URL and route params, `postMessage`, user-provided input — enters as `unknown`. It must be narrowed by a type guard or validated with Zod before any use. A declared type on an unvalidated payload is a lie, not a check. This boundary is a security boundary too, not only a typing one — `.claude/rules/security.md`.

## Preferred

- `type` is the default for every new declaration — object shapes included. Reach for `interface` only when you need an object contract that is extended or implemented: a class `implements` it, or it relies on declaration merging (augmenting a third-party module's types). If neither applies, write `type`.
- Unions, intersections, function types, mapped and derived types are `type` by definition — there is no choice to make there.
- Discriminated unions over objects full of optional booleans.
- `import type { X } from './X'` for type-only imports.
- Derive types instead of duplicating them: `type LoginFormValues = z.infer<typeof loginSchema>`.
- Explicit return types on exported functions and hooks.
- Immutability comes from the `Readonly<...>` utility, not a `readonly` modifier repeated on every property — see below.

### Immutability comes from utility types

Wrap the whole object shape in `Readonly<...>` once. Do not restate `readonly` on every property: it is the same rule written N times, and the one line that gets forgotten silently opts a field out.

```ts
// no — the modifier repeated per property
type ItemFormProps = {
  readonly form: UseFormReturn<ItemFormValues>;
  readonly editingItem: Item | null;
  readonly isSaving: boolean;
  readonly onCancelEdit: () => void;
};

// yes — stated once, for the shape
type ItemFormProps = Readonly<{
  form: UseFormReturn<ItemFormValues>;
  editingItem: Item | null;
  isSaving: boolean;
  onCancelEdit: () => void;
}>;
```

`Readonly<T>` is shallow — it locks the properties, not what they point at. Anything mutable behind a property still declares its own immutability: `readonly T[]` for arrays, and a nested object shape is its own `Readonly<...>` type.

```ts
type UsersPanelProps = Readonly<{
  users: readonly User[];
  filters: UserFilters; // itself declared as Readonly<{ ... }>
}>;
```

Two shapes that don't take the wrapper directly:

- A union of prop shapes wraps each member — `type X = Readonly<{ kind: 'a'; a: string }> | Readonly<{ kind: 'b'; b: number }>` — not the union.
- An extension composes: `type IconButtonProps = ButtonProps & Readonly<{ icon: IconName }>`, where `ButtonProps` is already wrapped.
- An ambient `interface` that augments a third-party module by declaration merging — `ImportMetaEnv` in `src/vite-env.d.ts` is the one in this codebase. A utility type cannot wrap an interface declaration, so its properties keep the per-property modifier.

The same preference holds for every other shape a utility type can express. Compose `Pick`, `Omit`, `Partial`, `Required`, `Record`, `NonNullable`, `ReturnType`, `Awaited` instead of hand-copying fields from another type — a derived type follows its source, a copied one drifts from it.

### `type` vs `interface`

| Situation | Use |
| --- | --- |
| New object shape, props, API model, any default case | `type` |
| Union, intersection, function type, mapped or derived type | `type` |
| A class will `implements` it | `interface` |
| Declaration merging / augmenting a third-party module | `interface` |
| Contract designed for consumers to `extends` and grow | `interface` |

## React

- `React.FC` is banned. Type the props parameter directly, and annotate the return type explicitly — every exported component carries one (see below). `React.FC` adds an implicit `children`, fights generics, and hides the real signature.
- Components are functions. The single exception is `shared/components/errorBoundary.tsx`: React implements error boundaries only as class components, with no hook equivalent, and `.claude/rules/components.md` requires one per feature route. A class written for any other reason is a bug in the design, not a style choice.
- `children` is typed explicitly as `React.ReactNode` on the props type of any component that renders it. Nothing is implicit.
- Props types are `type` declarations named after the component with a `Props` suffix — `ButtonProps`, `UserCardProps`.
- Exported components, functions, and hooks carry explicit return types. A hook returning an object gets a named return type when the shape is non-trivial.

```tsx
type ButtonProps = Readonly<{
  children: React.ReactNode;
  onPress: PressHandler;
}>;

export function Button({ children, onPress }: ButtonProps): React.ReactElement {
  // ...
}
```

## Naming

- Files are camelCase, folders are lowercase (camelCase when multi-word) — `shared/components/button.tsx`, `features/userProfile/userProfile.type.ts`. See `.claude/rules/architecture.md`.
- A file's name does not constrain its export's name. `button.tsx` exports `Button`; `routes.ts` exports `ROUTES`. Type names, component names, and constant names follow their own rules below, unaffected by the file they sit in.
- Feature type files: `camelCase.type.ts` — the camelCase feature name plus the `.type.ts` suffix (`login.type.ts`, `userProfile.type.ts`).
- The feature hook file is `use<Feature>Hook.ts` and exports the hook of that name (`.claude/rules/hooks.md`).
- Type names are singular and PascalCase: `User`, `Order`, `ButtonProps` — not `Users` or `IUser`. A collection is `User[]` or `readonly User[]`, not a pluralized type name.
- Component props take the `Props` suffix: `ButtonProps`, `LoginFormProps`.
- Callback and handler types take the `Handler` suffix: `PressHandler`, `SearchChangeHandler`. The prop that holds one is still named `on` + the event (`onPress`, `onSearchChange`) — see `.claude/rules/components.md`.

## Where types live

All types for a feature go in that feature's `<feature>.type.ts` — camelCase feature name plus the `.type.ts` suffix (`login.type.ts`, `userProfile.type.ts`), holding that feature's `type` declarations and the rare `interface` that qualifies under the table above. The `.type` in the filename names the file's job; it does not restrict the declaration form. Only types shared by two or more features belong in `src/types/`. A type used in one file and nowhere else can stay in that file.

The one carve-out is the API layer: a query's request and response types live beside that query in `src/queries/`, never in a feature's `<feature>.type.ts` (`.claude/rules/queries.md`). A feature's own view-model types stay in the feature.

This describes the `features/` three-file pattern. A component outside it — in `shared/components/` or a feature's own `components/` subfolder — follows the same default: a type used only in that component's file stays there; shared with its own colocated hook, it can live in either file. Promote it to `<feature>.type.ts` or `src/types/` only once something outside that component actually needs it.

## Placement within a file

Type and interface declarations sit at the top of the file that holds them — after the imports, before the first constant, component, or hook. A reader meets the shapes before the code that operates on them, and there is one place to look rather than a scattering of declarations between functions.

## Imports

- Prefer the `@/` path alias over deep relative imports, once configured in `tsconfig.json`/`vite.config.ts`.
- Order: `react` → third-party → `@/types` → `@/queries` → `@/shared` (including `shared/constants`, `shared/hooks`) → relative (feature-local, e.g. `./login.type`).
