---
paths:
  - "src/**/*Component.tsx"
  - "src/shared/components/**"
  - "src/features/**/components/**"
---

# Components

Only `<feature>Component.tsx` — the file paired with `use<Feature>Hook.ts` in the three-file pattern — must stay pure presentation. It calls `use<Feature>Hook` from the feature's hook file, receives a feature-specific view-model, and renders it.

## What `<feature>Component.tsx` owns

- JSX and rendering logic
- styling
- accessibility
- trivial JSX conditionals
- event wiring to the handlers the feature hook returns

Nothing else. No business logic, no data fetching, no validation, no server-state management, no non-trivial derived calculations. It never imports from `src/queries/` — every value it renders arrives through the hook.

## Everywhere else

A component in `shared/components/`, or in a feature's own `components/` subfolder (see below), may hold local state and call `src/queries/` directly wherever it makes sense — that's normal, not a special case requiring justification. The one boundary: it owns its own self-contained concern (a widget's own data, an autocomplete's own options) — it's not a way to move a feature's actual business or orchestration logic out of that feature's hook.

This applies to **composite** shared components — a `UserPicker` that loads its own options, a `NotificationBell` that polls its own count. It does not apply to the presentational primitives in `shared/components/` — `Button`, `Panel`, the `field/` controls, `Dialog`, `Alert`, `PageSkeleton`, `ErrorBoundary`: those take everything through props, hold no query, and stay usable in any context including tests and stories.

## Splitting a large page

A page too big for one `<feature>Component.tsx` splits into `features/<feature>/components/<subComponent>.tsx` — camelCase filenames, not the `<feature>Component.tsx` suffix. No forced file split for logic: keep state and JSX together in the one file until it's large enough to justify pulling the logic into a colocated hook alongside it.

## State rendering

Render every state that is relevant to the feature and exposed by the feature hook. There is no universal requirement for `isLoading`, `isError`, `isEmpty`, or `data`.

When these states exist and affect the UI, handle them explicitly so the feature never falls through to an unexplained blank screen.

- **Loading** — use a content-shaped skeleton where the layout is known ahead of time rather than a generic centered spinner.
- **Error** — explain what failed and provide a clear recovery action where recovery is possible. Never use a bare "Something went wrong."
- **Empty** — explain the situation and provide a relevant next action when one exists. Don't use only "No results."
- **Content** — render the actual feature UI.

The Component receives a feature-specific view-model from `use<Feature>Hook` and renders it. It must not access `src/queries/` directly.

Separately from data state, every interactive element implements its full set of interaction states — hover, active/pressed, disabled, and focus-visible — not just the resting appearance. A disabled control looks and behaves disabled; a busy action gives visible feedback rather than appearing to do nothing.

## Error boundaries

Every feature route in `src/routes.tsx` is wrapped in `ErrorBoundary` from `shared/components/errorBoundary.tsx`:

```tsx
<Route
  path={ROUTES.items}
  element={
    <ErrorBoundary>
      <ItemsPage />
    </ErrorBoundary>
  }
/>
```

- The boundary goes **inside** the route-level `Suspense`, wrapping each feature element. The catch-all `<Navigate>` route is exempt — it renders no feature.
- It catches **render throws**, nothing else. A failed query is not a throw: that surfaces as the `isError` state above, rendered by the feature's own component. Do not use the boundary as a substitute for handling `isError`.
- The fallback explains what happened and offers recovery — a retry that clears the boundary's state and remounts the feature, not a full page reload. Copy comes from `LABELS.errors` (`.claude/rules/labels.md`).
- `componentDidCatch` logging is the one sanctioned `console.error` in the app; it is the only place a render throw is observable before the fallback replaces it.
- The boundary is a class component — React offers no hook equivalent. It is the single sanctioned exception to the function-component default in `.claude/rules/typescript.md`.
- Never lazy-load it (`.claude/rules/state-management.md`): a boundary in a lazy chunk cannot catch that chunk failing to load.

## One component per file

A page file exports one function component. When a piece of its JSX earns promotion to a component of its own, it moves to `features/<feature>/components/` — it does not stack as a second component in the page file. The same holds in `shared/components/`: one exported primitive per file.

Logic follows the same instinct. Anything reused across components, or long enough to bury the JSX beside it, becomes a custom hook instead of a duplicated block — `shared/hooks/` when more than one feature needs it, colocated next to the component when only that component does.

## Semantic HTML

Mandatory, not a stylistic preference. The element that means what you're doing comes before `div` every time: semantic structure is what search engines index and what assistive technology navigates by. `div` is for layout and grouping that carries no meaning of its own.

- `header`, `nav`, `main`, `aside`, `section`, `article`, `footer` for page structure. One `main` per page.
- `button` for actions, `a` for navigation. Never a `div` with `onClick`.
- `ul` / `ol` / `li` for lists. `table` / `thead` / `tbody` / `th` for tabular data.
- One `h1` per page, heading levels descending without skips.
- `form` wrapping form fields so Enter submits, `label` bound to every control, `fieldset` + `legend` around a group of related inputs.

## Reuse a primitive, don't rebuild it

Every reusable piece of UI is a component in `shared/components/`, not markup rebuilt per feature — buttons, dialogs, panels and cards, form controls, accordions, badges, toasts, and anything else that appears more than once. A feature composes those primitives; it does not hand-roll a second copy.

Form controls specifically: every labelled control goes through `shared/components/field/`. `TextField` is the one built so far; `TextAreaField`, `SelectField` and `CheckboxField` are the intended set and get added there when a feature first needs one — never rebuilt inside the feature. Each owns its own `id`/`htmlFor` pairing and its `aria-invalid` / `aria-describedby` wiring, so a caller cannot ship an unlabelled or unannounced control.

A raw `<input>`, `<textarea>`, or `<select>` in feature code needs a comment naming why no primitive fits. The one sanctioned case is a visually hidden file input whose `<label>` is the trigger — the `Field/` chrome is exactly what must not render there. Name the case in the comment; the hook accepts it as a `rules-ok:` acknowledgement.

Where a primitive must be a different element to work — a file input's `label`, a drop zone that needs drag handlers on a `div` — take the appearance from the shared recipe (`buttonClasses`, `panelClasses`) rather than re-deriving the class string, so it can't drift from the real component.

Missing a primitive? Add it to `shared/components/`. Don't inline it "just this once" — that is how the second copy starts.

## Rendering lists

Every loop that returns JSX — `map`, `flatMap`, a spread of generated elements, an `Array.from` — puts a `key` on the outermost element it returns. Not optional, not "React will warn me": without it React cannot match an element to its data across renders, so it reuses the wrong DOM node and the input state, focus, animation, and scroll position attached to it follow the wrong row.

- The key is a **stable ID that belongs to the item** — `user.id`, `order.id`, `option.value`, a status slug. It survives sorting, filtering, insertion, and removal.
- Never the array index, and never `Math.random()` or a value computed at render time. An index is a position, not an identity: delete row 2 and every row after it silently changes key.
- No stable ID in the data? Derive one from the fields that make the item unique (`` `${start}-${end}-${category}` ``) rather than falling back to the index. If even that isn't unique, the data model is the problem — fix it at the source.
- When the loop returns a `Fragment`, use `<Fragment key={id}>` — the `<>` shorthand takes no key.
- The key goes on the element the loop returns, not on a child inside it.

## Prop naming

Props are read far more often than they are written, so keep the names short and obvious. One word wherever one word says it.

- `label`, `value`, `error`, `hint`, `options`, `heading`, `actions`, `tone`, `size`, `variant` — not `labelText`, `inputValue`, `errorMessage`, `headingTitle`.
- Never repeat the component's own name in its prop: `Panel` takes `heading`, not `panelHeading`; `SearchBar` takes `query`, not `searchBarQuery`.
- Booleans read as a claim about the component: `isActive`, `isSaving`, `isLabelHidden`, `hasChanges`. Prefix with `is` or `has`; don't negate in the name (`isDisabled`, never `isNotEnabled`).
- Handlers are `on` + the event in the caller's language: `onEdit`, `onDelete`, `onSearchChange`. Name what happened, not the mechanics. The prop is `on<Event>`; the type behind it takes the `Handler` suffix — `onSearchChange: SearchChangeHandler`.
- Short is not cryptic. `cat`, `val`, `txt`, `idx`, `cfg` are abbreviations, not names — spell the word.
- The same concept keeps the same prop name across every component that takes it. A thing called `heading` in one primitive is not `title` in the next.

## Structure

- Function components with an explicit props type. `React.FC` is banned — type the props parameter directly.
- The props type is a `type` declaration (not an `interface`) named after the component with a `Props` suffix — `ButtonProps`, `UserCardProps` — imported from `<feature>.type.ts` when the component belongs to a feature.
- A component that renders `children` declares it explicitly as `React.ReactNode`. Nothing implicit.
- Exported components carry an explicit return type, as do exported hooks colocated beside them.
- The props type is wrapped in `Readonly<...>` once, never a `readonly` modifier repeated per property; arrays inside it stay `readonly T[]`. Full typing rules live in `.claude/rules/typescript.md`.
- Named exports, not default exports.
- Icons come from `lucide-react` exclusively — no ad hoc inline SVGs, no second icon set.
- A presentational sub-piece used only here goes in `features/<feature>/components/`, not a second component in the page file. The moment a second feature needs it, it moves to `shared/components/` instead.
- Repeated JSX gets extracted into a shared component, not copy-pasted.
- Elements on the same page that share structure or behavior are **one** component taking props — never several near-identical components. A row of buttons, a grid of cards, a set of inputs, a pair of dialogs: one component each. Variation belongs in a prop (`variant`, `size`, `tone`, `children`), not in a second file. The moment two components differ only in content or styling, they are one component with a prop.
