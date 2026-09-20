// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, Ref } from 'react';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from './Select';

export type SelectOption<T extends string> = Readonly<{
  value: T;
  label: string;
  isDisabled?: boolean;
}>;

type OptionSelectProps<T extends string> = Readonly<{
  id: string;
  options: readonly SelectOption<T>[];
  /** Undefined = nothing chosen. */
  value: T | undefined;
  /** Receives undefined only when `anyLabel` is set and its row is picked. */
  onChange: (value: T | undefined) => void;
  /** Muted trigger text while nothing is chosen — for a required form field. */
  placeholder?: string;
  /** Adds a first "Any …" row that clears the value — for a filter. While nothing is
   * chosen that row reads as the current choice, so the trigger never looks empty. */
  anyLabel?: string;
  hasError?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
  /** The trigger button — a form library focuses it on a failed submit. A prop, not
   * forwardRef, because forwardRef can't carry this component's generic `T`. */
  triggerRef?: Ref<HTMLButtonElement>;
  /** Classes for the trigger (height, width). */
  className?: string;
  /** Set by Field, which clones it onto its direct child. */
  'aria-describedby'?: string;
  'aria-label'?: string;
}>;

// Radix reserves '' for "no value", so the clearing row needs a real one. Nothing
// outside this file ever sees it.
const ANY_VALUE = '__any__';

/**
 * The select every screen uses: a shadcn Select built from an options array. Radix
 * hands back a plain string, so the choice is looked up in `options` before it
 * reaches `onChange` — callers get their own union type back with no cast and no
 * per-call-site type guard.
 */
export function OptionSelect<T extends string>({
  id,
  options,
  value,
  onChange,
  placeholder,
  anyLabel,
  hasError,
  disabled,
  onBlur,
  triggerRef,
  className,
  'aria-describedby': describedBy,
  'aria-label': ariaLabel,
}: OptionSelectProps<T>): ReactElement {
  function handleValueChange(next: string): void {
    if (next === ANY_VALUE) {
      onChange(undefined);
      return;
    }
    const match = options.find((opt) => opt.value === next);
    if (match) onChange(match.value);
  }

  // Always a string, so the root is controlled from the first render.
  const rootValue = value ?? (anyLabel ? ANY_VALUE : '');

  return (
    <Select value={rootValue} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger
        ref={triggerRef}
        id={id}
        hasError={hasError}
        onBlur={onBlur}
        className={className}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {anyLabel && (
          <>
            <SelectItem value={ANY_VALUE}>{anyLabel}</SelectItem>
            <SelectSeparator />
          </>
        )}
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} disabled={opt.isDisabled}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
