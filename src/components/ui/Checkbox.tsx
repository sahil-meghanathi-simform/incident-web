import { type InputHTMLAttributes, type ReactElement, forwardRef } from 'react';
import { cn } from '../../lib/cn';

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Checkbox({ className, ...rest }, ref): ReactElement {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn('h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500', className)}
        {...rest}
      />
    );
  },
);
