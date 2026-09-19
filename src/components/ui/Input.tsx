// rules-ok: naming — component files in this repo are PascalCase by convention;
// this file is superseded by the shadcn input in a later migration phase.
import { type InputHTMLAttributes, type ReactElement, forwardRef } from 'react';
import { cn } from '../../lib/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> &
  Readonly<{
    hasError?: boolean;
  }>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, hasError, ...rest },
  ref,
): ReactElement {
  return (
    <input
      ref={ref}
      className={cn(
        // Tailwind's preflight makes native form elements background-transparent by
        // default — an explicit background is still required even with no dark theme
        // to defeat, since the input would otherwise show whatever it's layered over.
        'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring',
        hasError ? 'border-destructive' : 'border-input',
        className,
      )}
      aria-invalid={hasError}
      {...rest}
    />
  );
});
