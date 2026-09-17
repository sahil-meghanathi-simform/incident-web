import type { ReactElement } from 'react';
import { Field } from './Field';
import { Input } from './Input';

type DateRangePickerProps = Readonly<{
  from: string;
  to: string;
  onChange: (range: { from: string; to: string }) => void;
}>;

/** Native date inputs — no extra dependency. */
export function DateRangePicker({ from, to, onChange }: DateRangePickerProps): ReactElement {
  return (
    <div className="flex gap-3">
      <Field label="From" htmlFor="date-from">
        <Input id="date-from" type="date" value={from} onChange={(e) => onChange({ from: e.target.value, to })} />
      </Field>
      <Field label="To" htmlFor="date-to">
        <Input id="date-to" type="date" value={to} onChange={(e) => onChange({ from, to: e.target.value })} />
      </Field>
    </div>
  );
}
