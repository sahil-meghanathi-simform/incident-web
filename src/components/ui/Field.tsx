// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

type FieldProps = Readonly<{
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  /** Rendered at the right of the hint row — typically a CharacterCount. */
  counter?: ReactNode;
  /** The control to render, or a render function receiving the computed
   * `aria-describedby` value for a control nested inside other markup (e.g.
   * PasswordField's show/hide button) — see the describedBy wiring below. */
  children: ReactNode | ((describedBy: string | undefined) => ReactNode);
}>;

type DescribableElement = ReactElement<{ 'aria-describedby'?: string }>;

/**
 * Wires label + control + error/hint text together, per the UI kit contract.
 * `aria-describedby` must land on the actual input/select/textarea — not a wrapping
 * element — or a screen reader never announces it (accessibility.md), so a single
 * control child is cloned with the id directly; a function child gets it as an
 * argument to attach itself.
 *
 * An error replaces the hint rather than stacking under it — the validation
 * messages restate the rule ("…at least 20 characters"), so showing both would say
 * the same thing twice. The counter slot stays visible either way.
 */
export function Field({ label, htmlFor, error, hint, required, counter, children }: FieldProps): ReactElement {
  const hintId = `${htmlFor}-hint`;
  const errorId = `${htmlFor}-error`;
  // Not a class list — cn()/twMerge is for Tailwind utilities, not for joining DOM
  // ids, so this builds the aria-describedby value directly instead.
  const isHintShown = Boolean(hint) && !error;
  const describedBy = [isHintShown && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  const control =
    typeof children === 'function'
      ? children(describedBy)
      : isValidElement(children)
        ? cloneElement(children as DescribableElement, { 'aria-describedby': describedBy })
        : children;

  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground-soft">
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {control}
      {(isHintShown || counter) && (
        <div className="flex items-start justify-between gap-3">
          {isHintShown ? (
            <p id={hintId} className="text-xs text-muted-foreground">
              {hint}
            </p>
          ) : (
            <span />
          )}
          {counter}
        </div>
      )}
      {error && (
        <p id={errorId} className="flex items-start gap-1.5 text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
