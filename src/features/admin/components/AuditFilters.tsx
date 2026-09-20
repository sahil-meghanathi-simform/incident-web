// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Card } from '../../../components/ui/Card';
import { FilterChips, type FilterChip } from '../../../components/ui/FilterChips';
import { FilterPanel } from '../../../components/ui/FilterPanel';
import { ToggleGroup, ToggleGroupItem } from '../../../components/ui/ToggleGroup';
import { AuditFilterControls } from './AuditFilterControls';
import { AUDIT_EVENT_GROUPS, matchingGroup } from '../lib/auditEventGroups';
import { CLEAR_AUDIT_FILTERS_PATCH } from '../schemas/auditFilterPatches';
import { LABELS } from '../../../lib/labels';
import type { AuditSearchFilters } from '../schemas/auditSearch.schema';

type AuditFiltersProps = Readonly<{
  filters: AuditSearchFilters;
  onChange: (patch: Partial<AuditSearchFilters>) => void;
}>;

const COPY = LABELS.admin;
const ALL_VIEW = 'all';

function chip(id: string, label: string, onRemove: () => void): FilterChip {
  return { id, label, removeLabel: COPY.removeFilter(label), onRemove };
}

/** A whole family of event types reads as one chip ("Events: Closure"), not one chip
 * per type — five chips for a single click would bury the other filters. */
function buildChips(filters: AuditSearchFilters, onChange: AuditFiltersProps['onChange']): FilterChip[] {
  const chips: FilterChip[] = [];
  const types = filters.type ?? [];
  const group = matchingGroup(types);
  if (group) {
    chips.push(chip(`group-${group.key}`, COPY.auditChip.group(group.label), () => onChange({ type: undefined })));
  } else {
    for (const type of types) {
      const remaining = types.filter((t) => t !== type);
      chips.push(
        chip(`type-${type}`, COPY.auditChip.type(COPY.auditEventLabel(type)), () =>
          onChange({ type: remaining.length ? remaining : undefined }),
        ),
      );
    }
  }
  if (filters.actorId) chips.push(chip('actor', COPY.auditChip.actor(filters.actorId), () => onChange({ actorId: undefined })));
  if (filters.incidentId) {
    chips.push(chip('incident', COPY.auditChip.incident(filters.incidentId), () => onChange({ incidentId: undefined })));
  }
  if (filters.from) chips.push(chip('from', COPY.auditChip.from(filters.from), () => onChange({ from: undefined })));
  if (filters.to) chips.push(chip('to', COPY.auditChip.to(filters.to), () => onChange({ to: undefined })));
  return chips;
}

/**
 * The audit log's control row. Left: one-click views — all events, or one of the four
 * event families — lit when the selected types are exactly that family, and scrolling
 * sideways (bar hidden) rather than wrapping on a narrow screen. Right: the Filters
 * button, whose panel holds the finer controls: individual event types, actor,
 * incident and dates. Underneath, the active filters as removable chips.
 */
export function AuditFilters({ filters, onChange }: AuditFiltersProps): ReactElement {
  const chips = buildChips(filters, onChange);
  const group = matchingGroup(filters.type);
  // '' = a hand-picked mix of types: no view is lit, which is the truth.
  const view = group?.key ?? (filters.type?.length ? '' : ALL_VIEW);

  return (
    <div className="mb-4 space-y-3">
      <Card className="flex items-center gap-3 p-2 sm:p-3">
        <ToggleGroup
          type="single"
          aria-label={COPY.auditViewsLabel}
          className="scrollbar-none -m-1 flex min-w-0 flex-1 gap-1.5 overflow-x-auto overscroll-x-contain p-1"
          value={view}
          onValueChange={(next: string) => {
            if (next === ALL_VIEW) onChange({ type: undefined });
            const picked = AUDIT_EVENT_GROUPS.find((g) => g.key === next);
            if (picked) onChange({ type: [...picked.types] });
          }}
        >
          <ToggleGroupItem value={ALL_VIEW} className="shrink-0">
            {COPY.auditViewAll}
          </ToggleGroupItem>
          {AUDIT_EVENT_GROUPS.map((g) => (
            <ToggleGroupItem key={g.key} value={g.key} className="shrink-0">
              {g.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <FilterPanel
          title={COPY.auditFiltersTitle}
          activeCount={chips.length}
          resetLabel={COPY.auditClearFilters}
          onReset={() => onChange(CLEAR_AUDIT_FILTERS_PATCH)}
        >
          <AuditFilterControls filters={filters} onChange={onChange} />
        </FilterPanel>
      </Card>

      <FilterChips chips={chips} clearAllLabel={COPY.auditClearFilters} onClearAll={() => onChange(CLEAR_AUDIT_FILTERS_PATCH)} />
    </div>
  );
}
