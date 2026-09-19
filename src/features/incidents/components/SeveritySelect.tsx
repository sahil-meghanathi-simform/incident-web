import type { ReactElement } from 'react';
import { cn } from '../../../lib/cn';
import { SEVERITY_RANK } from '../../../lib/severity';
import { LABELS } from '../../../lib/labels';
import type { SeverityOption } from '../types/incident.type';

type SeveritySelectProps = Readonly<{
  options: readonly SeverityOption[];
  value: SeverityOption['value'] | undefined;
  onChange: (value: SeverityOption['value']) => void;
  userClearance: number;
  error?: string;
}>;

/**
 * Per-level help text defuses the Q7+Q9 surprise here, before submit, rather than
 * leaving a clearance-1 reporter to discover it only after their CRITICAL report 403s
 * them on the very next screen.
 */
export function SeveritySelect({
  options,
  value,
  onChange,
  userClearance,
  error,
}: SeveritySelectProps): ReactElement {
  return (
    <fieldset className="space-y-2">
      <legend className="block text-sm font-medium text-foreground-soft">
        Severity<span className="text-destructive"> *</span>
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const aboveClearance = SEVERITY_RANK[option.value] > userClearance;
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer flex-col rounded-md border p-3 text-sm transition-colors',
                selected ? 'border-ring ring-1 ring-ring' : 'border-input hover:bg-accent',
              )}
            >
              <span className="flex items-center gap-2 font-medium text-foreground">
                <input
                  type="radio"
                  name="severity"
                  value={option.value}
                  checked={selected}
                  onChange={() => onChange(option.value)}
                />
                {option.label}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">{LABELS.incidents.severityHelp[option.value]}</span>
              {aboveClearance && (
                <span className="mt-1 text-xs font-medium text-severity-medium">{LABELS.incidents.aboveClearanceWarning}</span>
              )}
            </label>
          );
        })}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </fieldset>
  );
}
