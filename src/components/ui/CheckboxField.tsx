// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { type InputHTMLAttributes, type ReactElement, forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { Checkbox } from './Checkbox';

type CheckboxFieldProps = InputHTMLAttributes<HTMLInputElement> &
  Readonly<{
    label: string;
    description?: string;
  }>;

/** A checkbox with its label as one generous click target, styled as a chip that
 * lights up when checked (the `has-checked:` state never relies on colour alone —
 * the native tick is still there). */
export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(function CheckboxField(
  { label, description, className, ...rest },
  ref,
): ReactElement {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-2.5 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground-soft transition-colors',
        'hover:border-foreground-faint has-checked:border-primary/50 has-checked:bg-accent has-checked:text-foreground',
        'has-focus-visible:ring-2 has-focus-visible:ring-ring has-disabled:cursor-not-allowed has-disabled:opacity-60',
        className,
      )}
    >
      <Checkbox ref={ref} className="mt-0.5" {...rest} />
      <span className="flex flex-col gap-0.5">
        <span className="font-medium">{label}</span>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </span>
    </label>
  );
});
