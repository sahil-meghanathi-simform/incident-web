import type { ReactElement } from 'react';
import { Input } from '../../../components/ui/Input';
import { SEVERITY_LABEL, type Severity } from '../../../lib/severity';

type TierRowProps = Readonly<{
  severity: Severity;
  level: number;
  thresholdMinutes: number;
  error?: string;
  onChange: (thresholdMinutes: number) => void;
}>;

/** One row of the editable grid — build-plan.md §15.2: "rows = (severity, level),
 * cell = threshold minutes". Severity and level are fixed once loaded; only the
 * threshold cell is editable. */
export function TierRow({ severity, level, thresholdMinutes, error, onChange }: TierRowProps): ReactElement {
  const inputId = `tier-${severity}-${level}`;
  return (
    <tr className="hover:bg-accent">
      <td className="px-4 py-2 text-foreground-soft">{SEVERITY_LABEL[severity]}</td>
      <td className="px-4 py-2 text-foreground-soft">{level}</td>
      <td className="px-4 py-2">
        <label htmlFor={inputId} className="sr-only">
          {SEVERITY_LABEL[severity]} level {level} threshold minutes
        </label>
        <Input
          id={inputId}
          type="number"
          min={1}
          hasError={Boolean(error)}
          value={thresholdMinutes}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-28"
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        {error && (
          <p id={`${inputId}-error`} role="alert" className="mt-1 text-xs text-destructive">
            {error}
          </p>
        )}
      </td>
    </tr>
  );
}
