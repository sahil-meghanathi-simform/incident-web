// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { AlertCircle, Check, CircleAlert, EyeOff, ShieldCheck, Siren, TriangleAlert, type LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { SEVERITY_RANK, type Severity } from '../../../lib/severity';
import { LABELS } from '../../../lib/labels';
import type { SeverityOption } from '../types/incident.type';

type SeveritySelectProps = Readonly<{
  options: readonly SeverityOption[];
  value: SeverityOption['value'] | undefined;
  onChange: (value: SeverityOption['value']) => void;
  userClearance: number;
  error?: string;
  /** Visually hide the legend when a surrounding section heading already says it. */
  isLegendHidden?: boolean;
}>;

const SEVERITY_ICON: Readonly<Record<Severity, LucideIcon>> = {
  LOW: ShieldCheck,
  MEDIUM: CircleAlert,
  HIGH: TriangleAlert,
  CRITICAL: Siren,
};

const SEVERITY_TILE_CLASS: Readonly<Record<Severity, string>> = {
  LOW: 'bg-severity-low-surface text-severity-low ring-severity-low-border',
  MEDIUM: 'bg-severity-medium-surface text-severity-medium ring-severity-medium-border',
  HIGH: 'bg-severity-high-surface text-severity-high ring-severity-high-border',
  CRITICAL: 'bg-severity-critical text-severity-critical-foreground ring-severity-critical',
};

/**
 * Rich radio cards. The native radio stays in the DOM (visually hidden) so keyboard,
 * form and screen-reader behaviour are the platform's own; the checked card gets a
 * ring, a tint AND a check mark, so selection never relies on colour alone.
 *
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
  isLegendHidden = false,
}: SeveritySelectProps): ReactElement {
  return (
    <fieldset className="space-y-2">
      <legend className={cn('mb-2 block text-sm font-medium text-foreground-soft', isLegendHidden && 'sr-only')}>
        {LABELS.incidents.form.severityLabel}
        <span className="text-destructive" aria-hidden="true">
          {' '}
          *
        </span>
      </legend>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {options.map((option) => {
          const aboveClearance = SEVERITY_RANK[option.value] > userClearance;
          const isSelected = value === option.value;
          const Icon = SEVERITY_ICON[option.value];
          return (
            <label
              key={option.value}
              className={cn(
                'relative flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-3.5 pr-10 text-sm',
                'transition-[border-color,background-color,box-shadow] duration-150 ease-smooth',
                'has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background',
                isSelected
                  ? 'border-primary bg-accent/60 shadow-sm ring-1 ring-primary'
                  : 'border-input hover:border-primary/40 hover:bg-accent/30',
              )}
            >
              <input
                type="radio"
                name="severity"
                className="peer sr-only"
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
              />
              <span
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-lg ring-1',
                  SEVERITY_TILE_CLASS[option.value],
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-foreground">{option.label}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                  {LABELS.incidents.severityHelp[option.value]}
                </span>
                {aboveClearance && (
                  <span className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-warning">
                    <EyeOff className="mt-px size-3.5 shrink-0" aria-hidden="true" />
                    {LABELS.incidents.aboveClearanceWarning}
                  </span>
                )}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'absolute right-3 top-3 flex size-5 items-center justify-center rounded-full border transition-colors',
                  isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-card',
                )}
              >
                {isSelected && <Check className="size-3" strokeWidth={3} />}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p className="flex items-start gap-1.5 text-xs font-medium text-destructive">
          <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </fieldset>
  );
}
