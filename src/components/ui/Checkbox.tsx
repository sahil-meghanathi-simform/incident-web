// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { type InputHTMLAttributes, type ReactElement, forwardRef } from 'react';
import { cn } from '../../lib/cn';

/** Native checkbox, themed via accent-color — keeps real checkbox semantics and
 * keyboard behavior for free. */
export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Checkbox({ className, ...rest }, ref): ReactElement {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          'size-4 shrink-0 cursor-pointer rounded border-input accent-primary disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...rest}
      />
    );
  },
);
