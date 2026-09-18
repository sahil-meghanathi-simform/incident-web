import type { ReactElement } from 'react';
import { Field } from '../../../components/ui/Field';
import { Select } from '../../../components/ui/Select';
import { DateRangePicker } from '../../../components/ui/DateRangePicker';
import { LABELS } from '../../../lib/labels';
import type { AnalyticsPeriodFilters, Bucket, PeriodPreset } from '../schemas/analyticsPeriod.schema';

type PeriodPickerProps = Readonly<{
  filters: AnalyticsPeriodFilters;
  onRangeChange: (range: { from: string; to: string }) => void;
  onPresetChange: (preset: PeriodPreset) => void;
  onBucketChange: (bucket: Bucket) => void;
}>;

const PRESET_OPTIONS: ReadonlyArray<{ value: PeriodPreset; label: string }> = [
  { value: '7d', label: LABELS.analytics.preset7d },
  { value: '30d', label: LABELS.analytics.preset30d },
  { value: '90d', label: LABELS.analytics.preset90d },
  { value: 'quarter', label: LABELS.analytics.presetQuarter },
];

/** Presets + a custom range (implementation-plan.md §14.2); bucket only affects the
 * trend chart's grouping, kept alongside since it's the same "period" URL state. */
export function PeriodPicker({ filters, onRangeChange, onPresetChange, onBucketChange }: PeriodPickerProps): ReactElement {
  return (
    <div className="mb-6 flex flex-wrap items-end gap-4">
      <Field label={LABELS.analytics.presetLabel} htmlFor="period-preset">
        <Select
          id="period-preset"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) onPresetChange(e.target.value as PeriodPreset);
          }}
        >
          <option value="">{LABELS.analytics.presetCustom}</option>
          {PRESET_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </Field>

      <DateRangePicker from={filters.from} to={filters.to} onChange={onRangeChange} />

      <Field label={LABELS.analytics.bucketLabel} htmlFor="period-bucket">
        <Select id="period-bucket" value={filters.bucket} onChange={(e) => onBucketChange(e.target.value as Bucket)}>
          <option value="day">{LABELS.analytics.bucketDay}</option>
          <option value="week">{LABELS.analytics.bucketWeek}</option>
          <option value="month">{LABELS.analytics.bucketMonth}</option>
        </Select>
      </Field>
    </div>
  );
}
