---
paths:
  - "src/**/use*Hook.ts"
  - "src/**/*Component.tsx"
  - "src/**/*.type.ts"
---

# Forms

React Hook Form + Zod for every form. No hand-rolled validation, no reading values off the DOM.

## Pattern

Schema and inferred type live in the feature's types file (`<feature>.type.ts`):

```ts
import { LABELS } from '@/shared/Constants/labels';

export const loginSchema = z.object({
  email: z.string().email(LABELS.auth.invalidEmail),
  password: z.string().min(8, LABELS.auth.passwordTooShort),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
```

Wired up in the feature hook:

```ts
const form = useForm<LoginFormValues>({
  resolver: zodResolver(loginSchema),
  mode: 'onBlur',
});
```

The component receives `form` from the hook and renders fields. It never constructs its own `useForm`.

## Rules

- The Zod schema is the single source of truth for the form's type. Never hand-write the type beside it.
- Validation messages are user-facing copy pulled from the centralized labels source (see `.claude/rules/labels.md`) — name what's wrong and what to do, e.g. `LABELS.auth.invalidEmail`, not a literal `'Invalid'`.
- Field errors render next to their field, wired with `aria-describedby` and `aria-invalid`.
- Disable submit while `formState.isSubmitting`, and show the pending state on the button.
- Server-side failures come back through `setError` so they surface in the same place as client validation.
- A form schema is not a substitute for validating the API response — see `.claude/rules/queries.md`.
