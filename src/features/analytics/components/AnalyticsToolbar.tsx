// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { CalendarRange } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { FilterChips, type FilterChip } from '../../../components/ui/FilterChips';
import { ToggleGroup, ToggleGroupItem } from '../../../components/ui/ToggleGroup';
import { STAGE_LABEL } from '../../../lib/stage';
import { formatDateRange } from '../../../lib/datetime';
import { LABELS } from '../../../lib/labels';
import { AnalyticsFilters } from './AnalyticsFilters';
import { PERIOD_PRESETS, matchingPreset, rangeDays } from '../lib/periodRange';
import type { AnalyticsPeriodFilters, PeriodPreset } from '../schemas/analyticsPeriod.schema';
import type { AnalyticsPeriodActions } from '../hooks/useAnalyticsPeriod';

type AnalyticsToolbarProps = Readonly<{
  filters: AnalyticsPeriodFilters;
  actions: AnalyticsPeriodActions;
}>;

const COPY = LABELS.analytics;
const PRESET_SHORT_LABEL: Readonly<Record<PeriodPreset, string>> = {
  '7d': COPY.presetShort7d,
  '30d': COPY.presetShort30d,
  '90d': COPY.presetShort90d,
  quarter: COPY.presetShortQuarter,
};

function isPreset(value: string): value is PeriodPreset {
  return (PERIOD_PRESETS as readonly string[]).includes(value);
}

function buildChips(filters: AnalyticsPeriodFilters, actions: AnalyticsPeriodActions): FilterChip[] {
  const types = filters.type ?? [];
  const stages = filters.stage ?? [];
  return [
    ...types.map((type) => {
      const label = COPY.chipType(LABELS.incidents.typeName(type));
      return {
        id: `type:${type}`,
        label,
        removeLabel: LABELS.filters.chips.remove(label),
        onRemove: () => actions.setTypes(types.filter((t) => t !== type)),
      };
    }),
    ...stages.map((stage) => {
      const label = COPY.chipStage(STAGE_LABEL[stage]);
      return {
        id: `stage:${stage}`,
        label,
        removeLabel: LABELS.filters.chips.remove(label),
        onRemove: () => actions.setStages(stages.filter((s) => s !== stage)),
      };
    }),
  ];
}

/**
 * The dashboard's one control row. Left: what is being shown, in words — the period,
 * its length and the trend grouping — so the scope is readable without opening
 * anything. Middle (from lg): the presets as one-click pills, lit when the dates match
 * one. Right: the Filters button and its popover. Underneath, the type / stage filters
 * as removable chips.
 */
export function AnalyticsToolbar({ filters, actions }: AnalyticsToolbarProps): ReactElement {
  const chips = buildChips(filters, actions);
  const preset = matchingPreset(filters);
  const bucketLabel = { day: COPY.bucketDay, week: COPY.bucketWeek, month: COPY.bucketMonth }[filters.bucket];

  return (
    <div className="mb-6 space-y-3">
      <Card className="flex flex-wrap items-center gap-x-4 gap-y-3 p-3 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground ring-1 ring-primary/10">
            <CalendarRange className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold tracking-snug text-foreground">
              {formatDateRange(filters.from, filters.to)}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {COPY.periodSummary(rangeDays(filters), bucketLabel.toLowerCase())}
            </p>
          </div>
        </div>

        <ToggleGroup
          type="single"
          aria-label={COPY.presetLabel}
          className="hidden gap-1.5 lg:flex"
          value={preset ?? ''}
          onValueChange={(next: string) => {
            if (isPreset(next)) actions.setPreset(next);
          }}
        >
          {PERIOD_PRESETS.map((value) => (
            <ToggleGroupItem key={value} value={value}>
              {PRESET_SHORT_LABEL[value]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <AnalyticsFilters filters={filters} actions={actions} activeCount={chips.length} />
      </Card>

      <FilterChips chips={chips} clearAllLabel={LABELS.filters.clearAll} onClearAll={actions.clearFilters} />
    </div>
  );
}
