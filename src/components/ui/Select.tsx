// rules-ok: naming — component files in this repo are PascalCase by convention;
// this file stays as a native <select> (accessibility.md: native elements over
// ARIA) and is restyled, not replaced, in a later migration phase.
import { type SelectHTMLAttributes, type ReactElement, forwardRef } from 'react';
import { cn } from '../../lib/cn';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> &
  Readonly<{
    hasError?: boolean;
  }>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, hasError, children, ...rest },
  ref,
): ReactElement {
  return (
    <select
      ref={ref}
      className={cn(
        'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring',
        hasError ? 'border-destructive' : 'border-input',
        className,
      )}
      aria-invalid={hasError}
      {...rest}
    >
      {children}
    </select>
  );
});
