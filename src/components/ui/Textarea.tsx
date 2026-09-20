// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { type TextareaHTMLAttributes, type ReactElement, forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { controlClasses, controlStateClass } from './Input';

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
      className={cn(controlClasses, 'min-h-20 resize-y py-2 leading-relaxed', controlStateClass(hasError), className)}
      aria-invalid={hasError}
      {...rest}
    />
  );
});
