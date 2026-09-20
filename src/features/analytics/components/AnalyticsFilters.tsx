// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useId, type ReactElement, type ReactNode } from 'react';
import { FilterPanel } from '../../../components/ui/FilterPanel';
import { ToggleGroup, ToggleGroupItem } from '../../../components/ui/ToggleGroup';
import { IncidentTypeValues, type IncidentType } from '../../../api/contracts/enums';
import { STAGE_LABEL, STAGE_ORDER, type Stage } from '../../../lib/stage';
import { LABELS } from '../../../lib/labels';
import { CustomRangeForm } from './CustomRangeForm';
import { BUCKET_VALUES, type AnalyticsPeriodFilters, type Bucket, type PeriodPreset } from '../schemas/analyticsPeriod.schema';
import { PERIOD_PRESETS, matchingPreset } from '../lib/periodRange';
import type { AnalyticsPeriodActions } from '../hooks/useAnalyticsPeriod';

type AnalyticsFiltersProps = Readonly<{
  filters: AnalyticsPeriodFilters;
  actions: AnalyticsPeriodActions;
  /** Type + stage selections — what the button's badge counts. */
  activeCount: number;
}>;

const COPY = LABELS.analytics;
const PRESET_LABEL: Readonly<Record<PeriodPreset, string>> = {
  '7d': COPY.preset7d,
  '30d': COPY.preset30d,
  '90d': COPY.preset90d,
  quarter: COPY.presetQuarter,
};
const BUCKET_LABEL: Readonly<Record<Bucket, string>> = {
  day: COPY.bucketDay,
  week: COPY.bucketWeek,
  month: COPY.bucketMonth,
};

function isPreset(value: string): value is PeriodPreset {
  return (PERIOD_PRESETS as readonly string[]).includes(value);
}

function isBucket(value: string): value is Bucket {
  return (BUCKET_VALUES as readonly string[]).includes(value);
}

function FilterGroup({ labelId, label, hint, children }: { labelId: string; label: string; hint?: string; children: ReactNode }): ReactElement {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span id={labelId} className="block text-xs font-semibold uppercase tracking-caps text-muted-foreground">
          {label}
        </span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/**
 * Everything that scopes the dashboard, behind one button: period (presets or a custom
 * range), how the trend is grouped, and the type / stage filters — which the API and
 * the URL always supported but no control ever exposed. The shell (button, popover or
 * sheet, header, footer) is the shared FilterPanel. Reset is always available here:
 * it also restores the default period, which the badge count doesn't include.
 */
export function AnalyticsFilters({ filters, actions, activeCount }: AnalyticsFiltersProps): ReactElement {
  const presetLabelId = useId();
  const bucketLabelId = useId();
  const typeLabelId = useId();
  const stageLabelId = useId();
  const preset = matchingPreset(filters);

  return (
    <FilterPanel
      title={COPY.filtersTitle}
      activeCount={activeCount}
      resetLabel={COPY.filtersReset}
      onReset={actions.reset}
      isResetDisabled={false}
    >
      <div className="space-y-5">
        <FilterGroup labelId={presetLabelId} label={COPY.presetLabel}>
          <ToggleGroup
            type="single"
            aria-labelledby={presetLabelId}
            className="flex flex-wrap gap-1.5"
            // '' = no preset matches, i.e. a custom range; Radix also reports '' when
            // the pressed preset is pressed again, which changes nothing.
            value={preset ?? ''}
            onValueChange={(next: string) => {
              if (isPreset(next)) actions.setPreset(next);
            }}
          >
            {PERIOD_PRESETS.map((value) => (
              <ToggleGroupItem key={value} value={value}>
                {PRESET_LABEL[value]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FilterGroup>

        <CustomRangeForm from={filters.from} to={filters.to} onApply={actions.setRange} />

        <FilterGroup labelId={bucketLabelId} label={COPY.bucketLabel} hint={COPY.bucketHint}>
          <ToggleGroup
            type="single"
            aria-labelledby={bucketLabelId}
            className="flex flex-wrap gap-1.5"
            value={filters.bucket}
            onValueChange={(next: string) => {
              if (isBucket(next)) actions.setBucket(next);
            }}
          >
            {BUCKET_VALUES.map((value) => (
              <ToggleGroupItem key={value} value={value}>
                {BUCKET_LABEL[value]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FilterGroup>

        <FilterGroup labelId={typeLabelId} label={COPY.typeFilterLabel} hint={COPY.multiSelectHint}>
          <ToggleGroup
            type="multiple"
            aria-labelledby={typeLabelId}
            className="flex flex-wrap gap-1.5"
            value={filters.type ?? []}
            onValueChange={(next: IncidentType[]) => actions.setTypes(next)}
          >
            {IncidentTypeValues.map((value) => (
              <ToggleGroupItem key={value} value={value}>
                {LABELS.incidents.typeName(value)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FilterGroup>

        <FilterGroup labelId={stageLabelId} label={COPY.stageFilterLabel} hint={COPY.multiSelectHint}>
          <ToggleGroup
            type="multiple"
            aria-labelledby={stageLabelId}
            className="flex flex-wrap gap-1.5"
            value={filters.stage ?? []}
            onValueChange={(next: Stage[]) => actions.setStages(next)}
          >
            {STAGE_ORDER.map((value) => (
              <ToggleGroupItem key={value} value={value}>
                {STAGE_LABEL[value]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FilterGroup>
      </div>
    </FilterPanel>
  );
}
