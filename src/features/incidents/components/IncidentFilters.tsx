// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { Card } from '../../../components/ui/Card';
import { FilterPanel } from '../../../components/ui/FilterPanel';
import { IncidentSearchField } from './IncidentSearchField';
import { IncidentFilterControls } from './IncidentFilterControls';
import { ActiveFilterPills } from './ActiveFilterPills';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { useAuth } from '../../../hooks/useAuth';
import { CLEAR_FILTERS_PATCH, countNonSearchFilters } from '../schemas/incidentFilterPatches';
import { LABELS } from '../../../lib/labels';
import type { IncidentFilters as IncidentFiltersState } from '../schemas/incidentFilters.schema';

type IncidentFiltersProps = Readonly<{
  filters: IncidentFiltersState;
  onChange: (patch: Partial<IncidentFiltersState>) => void;
  /** The list query's `isFetching` — drives the search box's spinner. */
  isFetching?: boolean;
}>;

/**
 * The incident list toolbar: one row — search plus a Filters button — then the active
 * filters as removable chips with "Clear all". The button opens every other control in
 * a FilterPanel (popover from `md` up, bottom sheet below it), so the table starts
 * near the top of the page instead of under a wall of controls.
 */
export function IncidentFilters({ filters, onChange, isFetching = false }: IncidentFiltersProps): ReactElement {
  const { user } = useAuth();
  const [qDraft, setQDraft] = useState(filters.q ?? '');
  const debouncedQ = useDebouncedValue(qDraft, 300);
  const isFirstRun = useRef(true);

  // Fires only once the debounced value settles — typing itself never triggers a
  // request or a URL update on every keystroke. Deliberately does NOT sync qDraft back
  // from filters.q on every change (that would risk clobbering fast-typed input with a
  // stale round-tripped value); clearing resets qDraft directly instead.
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const next = debouncedQ || undefined;
    // Already applied (e.g. a chip or "Clear all" cleared both at once) — skip the no-op.
    if (next === filters.q) return;
    onChange({ q: next });
    // Deliberately depends only on debouncedQ — this should fire once the debounced
    // search text settles, not on every onChange identity change.
  }, [debouncedQ]);

  function handleChange(patch: Partial<IncidentFiltersState>): void {
    if ('q' in patch && !patch.q) setQDraft('');
    onChange(patch);
  }

  function handleClearAll(): void {
    setQDraft('');
    onChange(CLEAR_FILTERS_PATCH);
  }

  const clearance = user?.clearanceLevel ?? 1;
  const activeCount = countNonSearchFilters(filters);
  const isSearching = qDraft !== debouncedQ || isFetching;
  return (
    <div className="space-y-3">
      <Card className="flex items-center gap-2 p-2 sm:gap-3 sm:p-3">
        <IncidentSearchField value={qDraft} onChange={setQDraft} isSearching={isSearching} />
        <FilterPanel
          title={LABELS.filters.sheetTitle}
          activeCount={activeCount}
          resetLabel={LABELS.filters.clearAll}
          onReset={handleClearAll}
        >
          <IncidentFilterControls filters={filters} onChange={onChange} clearance={clearance} />
        </FilterPanel>
      </Card>
      <ActiveFilterPills filters={filters} onChange={handleChange} onClearAll={handleClearAll} />
    </div>
  );
}
