// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { type InputHTMLAttributes, type ReactElement, forwardRef } from 'react';
import { cn } from '../../lib/cn';

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Checkbox({ className, ...rest }, ref): ReactElement {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn('h-4 w-4 rounded border-input text-primary focus:ring-ring', className)}
        {...rest}
      />
    );
  },
);
