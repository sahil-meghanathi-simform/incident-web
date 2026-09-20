// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { FilterChips, type FilterChip } from '../../../components/ui/FilterChips';
import { SEVERITY_LABEL } from '../../../lib/severity';
import { STAGE_LABEL } from '../../../lib/stage';
import { LABELS } from '../../../lib/labels';
import { TOGGLE_FILTER_KEYS, togglePatch } from '../schemas/incidentFilterPatches';
import type { IncidentFilters as IncidentFiltersState } from '../schemas/incidentFilters.schema';

type ActiveFilterPillsProps = Readonly<{
  filters: IncidentFiltersState;
  onChange: (patch: Partial<IncidentFiltersState>) => void;
  onClearAll: () => void;
}>;

const COPY = LABELS.filters;

function removeFromArray<T extends string>(current: T[] | undefined, value: T): T[] | undefined {
  const next = (current ?? []).filter((v) => v !== value);
  return next.length ? next : undefined;
}

function chip(id: string, label: string, onRemove: () => void): FilterChip {
  return { id, label, removeLabel: COPY.chips.remove(label), onRemove };
}

/** The dismissible chip row under the toolbar — the single clearest signal of what's
 * currently filtering the list, with "Clear all" right beside it. Chip text comes from
 * the same label map as the controls themselves. */
export function ActiveFilterPills({ filters, onChange, onClearAll }: ActiveFilterPillsProps): ReactElement | null {
  const type = filters.type?.[0];
  const chips: FilterChip[] = [
    ...(filters.severity ?? []).map((s) =>
      chip(`severity:${s}`, SEVERITY_LABEL[s], () => onChange({ severity: removeFromArray(filters.severity, s) })),
    ),
    ...(filters.stage ?? []).map((s) =>
      chip(`stage:${s}`, STAGE_LABEL[s], () => onChange({ stage: removeFromArray(filters.stage, s) })),
    ),
    ...(type ? [chip('type', LABELS.incidents.typeName(type), () => onChange({ type: undefined }))] : []),
    ...(filters.q ? [chip('q', COPY.chips.search(filters.q), () => onChange({ q: undefined }))] : []),
    ...TOGGLE_FILTER_KEYS.filter((key) => filters[key]).map((key) =>
      chip(key, COPY.toggles[key], () => onChange(togglePatch(key, false))),
    ),
    ...(filters.from || filters.to
      ? [chip('dateRange', COPY.chips.dateRange(filters.from, filters.to), () => onChange({ from: undefined, to: undefined }))]
      : []),
  ];

  return <FilterChips chips={chips} clearAllLabel={COPY.clearAll} onClearAll={onClearAll} />;
}
