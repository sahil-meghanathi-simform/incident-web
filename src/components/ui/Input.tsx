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
        // default — without an explicit bg-white here (as Select.tsx already has),
        // this text is invisible over the dark theme's body background.
        'w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        hasError ? 'border-red-400' : 'border-slate-300',
        className,
      )}
      aria-invalid={hasError}
      {...rest}
    />
  );
});
