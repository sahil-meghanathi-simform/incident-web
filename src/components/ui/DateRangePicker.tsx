// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useId, type ReactElement } from 'react';
import { Field } from './Field';
import { Input } from './Input';
import { LABELS } from '../../lib/labels';

type DateRangePickerProps = Readonly<{
  from: string;
  to: string;
  onChange: (range: { from: string; to: string }) => void;
}>;

/** Native date inputs — no extra dependency. useId() rather than hardcoded ids —
 * this renders in three places (IncidentFilters, AuditFilters, PeriodPicker), and
 * two on the same page previously collided on id="date-from"/"date-to". */
export function DateRangePicker({ from, to, onChange }: DateRangePickerProps): ReactElement {
  const fromId = useId();
  const toId = useId();

  return (
    <div className="grid grid-cols-2 gap-3">
      <Field label={LABELS.chrome.dateFrom} htmlFor={fromId}>
        <Input id={fromId} type="date" value={from} onChange={(e) => onChange({ from: e.target.value, to })} />
      </Field>
      <Field label={LABELS.chrome.dateTo} htmlFor={toId}>
        <Input id={toId} type="date" value={to} onChange={(e) => onChange({ from, to: e.target.value })} />
      </Field>
    </div>
  );
}
