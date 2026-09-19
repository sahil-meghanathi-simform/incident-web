// rules-ok: naming — component files in this repo are PascalCase by convention;
// this file is superseded by the shadcn textarea in a later migration phase.
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
