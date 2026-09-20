// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { AlertCircle } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { formatMinutes } from '../../../components/ui/SlaCountdown';
import { SEVERITY_LABEL, type Severity } from '../../../lib/severity';
import { LABELS } from '../../../lib/labels';

type TierRowProps = Readonly<{
  severity: Severity;
  level: number;
  thresholdMinutes: number;
  /** The saved value, for the per-row "Edited" marker. */
  savedMinutes: number | undefined;
  error?: string;
  onChange: (thresholdMinutes: number) => void;
}>;

/** One editable tier — build-plan.md §15.2: "rows = (severity, level), cell =
 * threshold minutes". Severity and level are fixed once loaded; only the threshold
 * is editable. The human-readable hint ("= 1h 30m") updates as you type. */
export function TierRow({ severity, level, thresholdMinutes, savedMinutes, error, onChange }: TierRowProps): ReactElement {
  const inputId = `tier-${severity}-${level}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const isEdited = savedMinutes !== undefined && savedMinutes !== thresholdMinutes;
  const hasValue = Number.isFinite(thresholdMinutes) && thresholdMinutes > 0;

  return (
    <li className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:gap-4">
      <div className="flex items-center gap-2 sm:w-32 sm:shrink-0 sm:pt-2">
        <label htmlFor={inputId} className="text-sm font-medium text-foreground-soft">
          <span className="sr-only">{SEVERITY_LABEL[severity]} </span>
          {LABELS.admin.tierLevelLabel(level)}
        </label>
        {isEdited && (
          <Badge tone="warning" dotClassName="bg-warning" className="px-1.5">
            {LABELS.admin.tierEdited}
          </Badge>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="relative w-full sm:max-w-40">
          <Input
            id={inputId}
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            hasError={Boolean(error)}
            value={Number.isFinite(thresholdMinutes) ? thresholdMinutes : ''}
            onChange={(e) => onChange(Number(e.target.value))}
            className="pr-12 tabular-nums"
            aria-describedby={error ? errorId : hintId}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {LABELS.admin.tierMinutesSuffix}
          </span>
        </div>
        {error ? (
          <p id={errorId} role="alert" className="flex items-start gap-1.5 text-xs font-medium text-destructive">
            <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        ) : (
          <p id={hintId} className="text-xs text-muted-foreground">
            {hasValue ? LABELS.admin.tierHumanHint(formatMinutes(thresholdMinutes)) : ' '}
          </p>
        )}
      </div>
    </li>
  );
}
