---
paths:
  - "src/**/*Component.tsx"
  - "src/**/use*Hook.ts"
  - "src/features/**/components/**"
  - "src/**/*.type.ts"
  - "src/queries/**"
  - "src/shared/constants/**"
  - "src/shared/utils/**"
---

# Labels

All user-visible strings live in `shared/constants/labels.ts` (or split per domain under `shared/constants/` once it grows). Never hardcode UI copy inside a component.

- Validation messages and toast/error copy also come from the centralized labels source, not inline strings.
- Number and date formatting goes through helpers in `shared/utils/` — no inline `toLocaleString` or manual date-string building in components or feature hooks.

## Never branch on a display string

Conditional logic never compares against user-visible text. Branch on a stable key — a discriminant field, a status code, a lookup in an `as const` object — and resolve the label for display only at the point of render.

```ts
// no — copy edit silently breaks the branch
if (status === 'Awaiting review') { … }

// yes
export const REVIEW_STATUS = { pending: 'pending', approved: 'approved' } as const;
export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS];

if (status === REVIEW_STATUS.pending) { … }
```

The same holds for keying styling, icons, or behavior off a label: map from the key to those through a lookup object, so copy and logic change independently. The `enum` keyword stays banned — an `as const` object plus its derived union is the project's idiom (`.claude/rules/typescript.md`).
