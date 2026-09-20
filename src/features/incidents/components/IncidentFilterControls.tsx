// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useId, type ReactElement, type ReactNode } from 'react';
import { ToggleGroup, ToggleGroupItem } from '../../../components/ui/ToggleGroup';
import { OptionSelect, type SelectOption } from '../../../components/ui/OptionSelect';
import { DateRangePicker } from '../../../components/ui/DateRangePicker';
import { CheckboxField } from '../../../components/ui/CheckboxField';
import { SEVERITY_ORDER, SEVERITY_LABEL, SEVERITY_RANK, type Severity } from '../../../lib/severity';
import { STAGE_ORDER, STAGE_LABEL, type Stage } from '../../../lib/stage';
import { IncidentTypeValues } from '../../../api/contracts/enums';
import { LABELS } from '../../../lib/labels';
import { TOGGLE_FILTER_KEYS, togglePatch } from '../schemas/incidentFilterPatches';
import type { IncidentFilters as IncidentFiltersState } from '../schemas/incidentFilters.schema';

type IncidentFilterControlsProps = Readonly<{
  filters: IncidentFiltersState;
  onChange: (patch: Partial<IncidentFiltersState>) => void;
  clearance: number;
}>;

const COPY = LABELS.filters;
const GROUP_LABEL_CLASS = 'block text-xs font-semibold uppercase tracking-caps text-muted-foreground';

const TYPE_OPTIONS: ReadonlyArray<SelectOption<(typeof IncidentTypeValues)[number]>> = IncidentTypeValues.map((type) => ({
  value: type,
  label: LABELS.incidents.typeName(type),
}));

function FilterGroup({ labelId, label, children }: { labelId: string; label: string; children: ReactNode }): ReactElement {
  return (
    <div className="min-w-0 space-y-2">
      <span id={labelId} className={GROUP_LABEL_CLASS}>
        {label}
      </span>
      {children}
    </div>
  );
}

/** Every filter control except search, stacked — the body of the list's FilterPanel. */
export function IncidentFilterControls({ filters, onChange, clearance }: IncidentFilterControlsProps): ReactElement {
  const severityLabelId = useId();
  const stageLabelId = useId();
  const quickLabelId = useId();
  const availableSeverities = SEVERITY_ORDER.filter((s) => SEVERITY_RANK[s] <= clearance);
  const hiddenCount = SEVERITY_ORDER.length - availableSeverities.length;

  return (
    <div className="space-y-5">
      <div className="grid gap-5">
        <FilterGroup labelId={severityLabelId} label={COPY.severityLabel}>
          <ToggleGroup
            type="multiple"
            aria-labelledby={severityLabelId}
            className="flex flex-wrap gap-1.5"
            value={filters.severity ?? []}
            onValueChange={(value: Severity[]) => onChange({ severity: value.length ? value : undefined })}
          >
            {availableSeverities.map((s) => (
              <ToggleGroupItem key={s} value={s}>
                {SEVERITY_LABEL[s]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {hiddenCount > 0 && <p className="text-xs text-muted-foreground">{COPY.hiddenSeverities(hiddenCount)}</p>}
        </FilterGroup>

        <FilterGroup labelId={stageLabelId} label={COPY.stageLabel}>
          <ToggleGroup
            type="multiple"
            aria-labelledby={stageLabelId}
            className="flex flex-wrap gap-1.5"
            value={filters.stage ?? []}
            onValueChange={(value: Stage[]) => onChange({ stage: value.length ? value : undefined })}
          >
            {STAGE_ORDER.map((s) => (
              <ToggleGroupItem key={s} value={s}>
                {STAGE_LABEL[s]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FilterGroup>
      </div>

      <div className="grid gap-5">
        <div className="space-y-2">
          <label htmlFor="incident-filter-type" className={GROUP_LABEL_CLASS}>
            {COPY.typeLabel}
          </label>
          <OptionSelect
            id="incident-filter-type"
            options={TYPE_OPTIONS}
            anyLabel={COPY.anyType}
            value={filters.type?.[0]}
            onChange={(type) => onChange({ type: type ? [type] : undefined })}
          />
        </div>
        <div className="space-y-2">
          <span className={GROUP_LABEL_CLASS}>{COPY.dateRangeLabel}</span>
          <DateRangePicker
            from={filters.from ?? ''}
            to={filters.to ?? ''}
            onChange={({ from, to }) => onChange({ from: from || undefined, to: to || undefined })}
          />
        </div>
      </div>

      <div role="group" aria-labelledby={quickLabelId} className="space-y-2">
        <span id={quickLabelId} className={GROUP_LABEL_CLASS}>
          {COPY.quickFiltersLabel}
        </span>
        <div className="grid grid-cols-2 gap-2">
          {TOGGLE_FILTER_KEYS.map((key) => (
            <CheckboxField
              key={key}
              label={COPY.toggles[key]}
              checked={filters[key] ?? false}
              onChange={(e) => onChange(togglePatch(key, e.target.checked))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
