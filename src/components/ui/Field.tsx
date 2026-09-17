import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

type FieldProps = Readonly<{
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
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
 */
export function Field({ label, htmlFor, error, hint, required, children }: FieldProps): ReactElement {
  const hintId = `${htmlFor}-hint`;
  const errorId = `${htmlFor}-error`;
  const describedBy = cn(hint && hintId, error && errorId) || undefined;

  const control =
    typeof children === 'function'
      ? children(describedBy)
      : isValidElement(children)
        ? cloneElement(children as DescribableElement, { 'aria-describedby': describedBy })
        : children;

  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {control}
      {hint && !error && (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
