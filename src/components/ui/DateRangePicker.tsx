import { useId, type ReactElement } from 'react';
import { Field } from './Field';
import { Input } from './Input';

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
    <div className="flex gap-3">
      <Field label="From" htmlFor={fromId}>
        <Input id={fromId} type="date" value={from} onChange={(e) => onChange({ from: e.target.value, to })} />
      </Field>
      <Field label="To" htmlFor={toId}>
        <Input id={toId} type="date" value={to} onChange={(e) => onChange({ from, to: e.target.value })} />
      </Field>
    </div>
  );
}
