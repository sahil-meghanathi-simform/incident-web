---
name: add-primitive
description: Use when adding or changing a reusable UI building block in `src/shared/components/` — "add a Badge component", "we need a Tooltip", "make this card reusable", "extract this into a shared component", "add a Tabs primitive". Covers the discovery check, the props API, all four interaction states, and the accessibility wiring. Do NOT use for a feature screen (`new-feature`), for a piece used by exactly one feature (that goes in `features/<feature>/components/`), or for data-layer work (`add-query`).
---

## Overview

A primitive in `shared/components/` is used by code you can't see and can't test against, which is what makes its API and its states worth more care than a feature component's. Get the props right and it composes everywhere; get them wrong and every caller works around them.

Full rules in `.claude/rules/components.md`, `.claude/rules/accessibility.md`, `.claude/rules/tailwind.md`.

## Workflow

### 1. Prove it doesn't exist, and that it belongs here

Read `src/shared/components/` in full first. Two failure modes to rule out:

- **It already exists** under a different name, or an existing primitive covers this with one more prop. Adding a prop to `Button` beats adding `IconButton`. Elements that differ only in content or styling are **one** component with a `variant`, `size`, or `tone` prop — never a second file.
- **It doesn't belong here yet.** Used by exactly one feature and not obviously about to be reused? It goes in `features/<feature>/components/`. Promote it to `shared/` the moment a second feature needs it — not in anticipation.

### 2. Decide which kind of primitive it is

This determines whether it may hold state or call queries at all:

- **Presentational primitive** — `Button`, `Panel`, the `Field/` controls, `Toast`, `Dialog`, `Alert`. Takes everything through props, holds no query, stays usable in any context including tests. This is the default; assume it unless proven otherwise.
- **Composite** — a `UserPicker` that loads its own options, a `NotificationBell` that polls its own count. May hold local state and call `src/queries/` for **its own self-contained concern only**. It is never a way to move a feature's orchestration logic out of that feature's hook.

### 3. Design the props API

Read far more often than written, so short and obvious wins:

- One word wherever one word says it — `label`, `value`, `error`, `hint`, `options`, `heading`, `tone`, `size`, `variant`. Not `labelText`, `inputValue`, `errorMessage`.
- Never repeat the component's name in its prop: `Panel` takes `heading`, not `panelHeading`.
- Booleans read as a claim, prefixed `is` or `has`, never negated: `isActive`, `hasChanges`. Not `isNotEnabled`.
- Handlers are `on` + what happened in the caller's language: `onEdit`, `onDelete`, `onSearchChange`. The type behind one takes the `Handler` suffix.
- Short is not cryptic. `cat`, `val`, `idx`, `cfg` are abbreviations, not names.
- **The same concept keeps the same prop name as every other component that takes it.** Check the neighbours before naming. A thing called `heading` in one primitive is not `title` in the next.

Variation goes in a prop. A second near-identical component is the wrong answer every time.

### 4. Build it

- One exported component per file, named export, explicit props `type` with the `Props` suffix, wrapped in `Readonly<...>` rather than per-property `readonly`.
- The file is camelCase, the export is PascalCase: `src/shared/components/badge.tsx` exports `Badge` (`.claude/rules/architecture.md`).
- `React.FC` is banned — type the props parameter directly. `children` is declared explicitly as `React.ReactNode`.
- The semantic element that means what the component does: `button` for actions, `a` for navigation, `ul`/`li` for lists. Never a `div` with `onClick`.
- Tailwind utilities merged with `cn()`. Tokens from the `@theme` block in `src/index.css` by their generated names — read that block first, and never a raw hex or a one-off pixel value.
- Icons from `lucide-react` exclusively.

Where the element has to differ for the thing to work — a file input's `label`, a drop zone needing drag handlers on a `div` — take the appearance from the shared recipe (`buttonClasses`, `panelClasses`) rather than re-deriving the class string, so it can't drift from the real component.

### 5. All four interaction states

Not just the resting appearance. Every interactive primitive implements hover, active/pressed, disabled, and focus-visible. A disabled control looks and behaves disabled; a busy one gives visible feedback instead of appearing to do nothing.

Focus is never removed without replacement: `focus-visible:ring-2 focus-visible:ring-offset-2` with a ring color that clears 3:1 against its background.

### 6. Accessibility, built in rather than added

The point of a primitive is that a caller **cannot** ship an inaccessible control through it:

- A labelled input owns its own `id`/`htmlFor` pairing and its `aria-invalid` / `aria-describedby` wiring internally — that's why `Field/` exists and why feature code never writes a raw `<input>`.
- Icon-only controls require `aria-label`; make the prop required in the type rather than hoping.
- Decorative icons alongside visible text get `aria-hidden="true"`.
- A dialog traps focus while open, closes on Escape, and returns focus to its trigger.
- Composite widgets — menus, tabs, listboxes — support arrow-key navigation.
- Async state changes announce through `aria-live`.
- Never signal state with color alone; pair it with an icon, label, or shape.

### 7. Check it composes

Before calling it done, verify against real use:

- Does it survive a long string and an empty value without breaking layout?
- Does it work at 375px and up through wide desktop?
- Does `prefers-reduced-motion` suppress any transition longer than a hover?
- Can a caller reach the underlying element if they need to, or have you closed a door they'll have to work around?

### 8. Validate

`npm run lint` and `npm run typecheck` clean. If you extracted this from existing markup, replace **every** hand-rolled copy with the new primitive in the same change — leaving one behind defeats the purpose.

## Rules

- Never a second copy of something in `shared/components/`. Missing a primitive? Add it here rather than inlining it "just this once" — that is how the second copy starts.
- Never two components differing only in content or styling. One component, one prop.
- Presentational primitives take everything through props and hold no query.
- No hardcoded hex, no arbitrary pixel values, no inline `style` except genuinely dynamic values.
- Never lazy-load anything in `shared/components/` — they belong in the main bundle (`.claude/rules/state-management.md`).
- An interactive primitive without all four interaction states, or an input primitive without its own label wiring, is not finished.
