// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { type InputHTMLAttributes, type ReactElement, forwardRef } from 'react';
import { cn } from '../../lib/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> &
  Readonly<{
    hasError?: boolean;
  }>;

/** Shared by Input, Textarea and Select so every form control has the same edge,
 * focus ring, error and disabled treatment. */
export const controlClasses = [
  // Tailwind's preflight makes native form elements background-transparent by
  // default — an explicit background is still required even with no dark theme
  // to defeat, since the control would otherwise show whatever it's layered over.
  'w-full rounded-md border bg-card px-3 text-sm text-foreground shadow-xs placeholder:text-muted-foreground',
  'transition-[border-color,box-shadow] duration-150 ease-smooth',
  'hover:border-foreground-faint',
  'focus-visible:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20',
  'disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-80',
  'read-only:bg-muted/50',
].join(' ');

export function controlStateClass(hasError: boolean | undefined): string {
  return hasError
    ? 'border-destructive hover:border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20'
    : 'border-input';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, hasError, ...rest },
  ref,
): ReactElement {
  return (
    <input
      ref={ref}
      className={cn(controlClasses, 'h-9 py-2', controlStateClass(hasError), className)}
      aria-invalid={hasError}
      {...rest}
    />
  );
});
