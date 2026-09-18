---
paths:
  - "src/**/*.tsx"
---

# Accessibility

The entire app is operable by keyboard alone — navigating between views, interacting with every component, and submitting every form. This is a requirement, not a polish pass. Verify it as you build, not afterward.

## Keyboard

- Every interactive element is reachable by Tab in a logical order. Never set a positive `tabIndex`.
- Enter and Space activate buttons. Enter submits forms. Using real `button` and `form` elements gives this for free.
- Escape closes modals, dialogs, popovers, and dropdowns.
- Arrow keys move within composite widgets — menus, tabs, listboxes, radio groups.
- Focus is visible everywhere. Never remove an outline without replacing it: `focus-visible:ring-2 focus-visible:ring-offset-2`.
- Modals and dialogs trap focus while open and return focus to the trigger on close.
- Move focus intentionally when navigation or an async action meaningfully replaces the current view or changes the user's context. Do not move focus unnecessarily for routine background updates.

## Semantics

- Semantic elements are mandatory, not stylistic — `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `button`, `form`, `label`. The element list and page-structure rules live in `.claude/rules/components.md`.
- Native elements over ARIA. A `button` doesn't need `role="button"`.
- Every input has an associated `label` — visible where the design allows, `sr-only` when it can't. A placeholder is not a label.
- Icon-only buttons carry `aria-label`. Icons used decoratively alongside visible text carry `aria-hidden="true"` so screen readers don't announce them twice.
- Images carry `alt`; decorative images get `alt=""`.
- Loading and error states announce through `aria-live` — `polite` for status, `assertive` for errors.
- Field errors link to their input with `aria-describedby` and set `aria-invalid`.
- When a control is unavailable, communicate why through visible or accessible adjacent text. Do not rely solely on a tooltip attached to a disabled control.

## Motion and contrast

- Respect `prefers-reduced-motion` on any transition longer than a hover state.
- Body text meets 4.5:1 contrast. Large text and UI borders meet 3:1.
- Never signal state with color alone — pair it with an icon, label, or shape.
