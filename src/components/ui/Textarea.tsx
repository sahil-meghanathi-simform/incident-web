import { type TextareaHTMLAttributes, type ReactElement, forwardRef } from 'react';
import { cn } from '../../lib/cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  Readonly<{
    hasError?: boolean;
  }>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, hasError, ...rest },
  ref,
): ReactElement {
  return (
    <textarea
      ref={ref}
      className={cn(
        // Same preflight-transparency fix as Input.tsx — see the comment there.
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
