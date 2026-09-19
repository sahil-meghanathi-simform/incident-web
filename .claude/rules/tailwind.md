---
paths:
  - "src/**/*.tsx"
  - "src/**/*.css"
---

# Tailwind

Tailwind **v4**. Utilities only — no CSS modules, no styled-components, no inline `style` objects except for genuinely dynamic values like a computed transform or a measured width.

## Where tokens live

v4 is CSS-first: there is no `tailwind.config.ts`. Design tokens — colors, spacing scale, fonts, breakpoints — are declared in one `@theme` block in `src/styles/index.css` and consumed as generated utility names.

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.55 0.22 264);
  --spacing-gutter: 1.5rem;
  --font-sans: "Inter", sans-serif;
}
```

`--color-primary` generates `bg-primary`, `text-primary`, `border-primary`, and so on. Read `src/styles/index.css` before styling anything — it is the single source of truth for the scale.

Adding a token to `@theme` is a design-system change, not a per-feature convenience. Use the nearest existing token and raise the gap instead of appending a new variable mid-feature.

## Rules

- Reference tokens by their generated utility name. No arbitrary values like `text-[#3b82f6]` or `mt-[13px]` unless the scale genuinely can't express it.
- Merge conditional classes with a `cn()` helper (`clsx` + `tailwind-merge`). Never assemble class strings from inline template literals and ternaries.
- Mobile-first. Base styles target small screens, then layer `sm:` `md:` `lg:` upward. Every screen works down to 375px and up through wide desktop.
- Flex and grid over absolute positioning.
- When the same class string appears a third time, extract a shared component — not an `@apply` rule.
- Fluid layouts over fixed pixel widths. Test that long strings and empty values don't break the layout.

## Variants

Component variants are declared with `class-variance-authority` (`cva`) — the shadcn/ui convention, approved 2026-09, superseding the earlier decision against a variant-styling library. One `cva()` call per component, colocated in the component file and exported alongside it so callers can compose (`buttonVariants({ variant: "ghost" })`).

- `cva` declares the matrix; `cn()` still merges the caller's `className` last so a one-off override wins. Both, not either.
- No other styling library. CSS-in-JS (`styled-components`, `@emotion`) remains banned.
- A component with one appearance does not get a `cva()`. Reach for it at the second variant axis.

## Class order

Layout → box model → typography → visual → state variants. A consistent order keeps long strings scannable:

`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary`
