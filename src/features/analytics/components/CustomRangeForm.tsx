// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useId, useState, type ReactElement } from 'react';
import { AlertCircle } from 'lucide-react';
import { DateRangePicker } from '../../../components/ui/DateRangePicker';
import { ANALYTICS_MAX_RANGE_DAYS } from '../../../api/contracts/analytics.contract';
import { LABELS } from '../../../lib/labels';
import { RANGE_PROBLEM, rangeDays, rangeProblem, type RangeProblem } from '../lib/periodRange';

type CustomRangeFormProps = Readonly<{
  /** The applied range. */
  from: string;
  to: string;
  onApply: (range: { from: string; to: string }) => void;
}>;

const COPY = LABELS.analytics;

const PROBLEM_MESSAGE: Readonly<Record<RangeProblem, string>> = {
  [RANGE_PROBLEM.incomplete]: COPY.rangeIncomplete,
  [RANGE_PROBLEM.reversed]: COPY.rangeReversed,
  [RANGE_PROBLEM.tooWide]: COPY.rangeTooWide(ANALYTICS_MAX_RANGE_DAYS),
};

/**
 * The custom period. It keeps its own draft and only hands a range to the dashboard
 * once it is valid: the URL schema answers an invalid range by silently resetting the
 * whole page to the default period (right for a bad link, baffling mid-edit), so a
 * half-edited or reversed range stays here with a message until it makes sense.
 */
export function CustomRangeForm({ from, to, onApply }: CustomRangeFormProps): ReactElement {
  const labelId = useId();
  const [draft, setDraft] = useState({ from, to });
  // When the applied range changes from outside (a preset, Reset, the back button) the
  // draft follows it — adjusted during render, React's documented alternative to an
  // effect, and deliberately not a `key` on this form: re-mounting on every applied
  // range would drop focus from the date input in the middle of typing.
  const [applied, setApplied] = useState({ from, to });
  if (applied.from !== from || applied.to !== to) {
    setApplied({ from, to });
    setDraft({ from, to });
  }
  const problem = rangeProblem(draft);

  function handleChange(next: { from: string; to: string }): void {
    setDraft(next);
    if (rangeProblem(next) === null) onApply(next);
  }

  return (
    <div role="group" aria-labelledby={labelId} className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span id={labelId} className="block text-xs font-semibold uppercase tracking-caps text-muted-foreground">
          {COPY.customRangeLabel}
        </span>
        {problem === null && <span className="text-xs tabular-nums text-muted-foreground">{COPY.rangeDays(rangeDays(draft))}</span>}
      </div>
      <DateRangePicker from={draft.from} to={draft.to} onChange={handleChange} />
      {problem !== null && (
        <p role="alert" className="flex items-start gap-1.5 text-xs font-medium text-destructive animate-in fade-in duration-200">
          <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          {PROBLEM_MESSAGE[problem]}
        </p>
      )}
    </div>
  );
}
