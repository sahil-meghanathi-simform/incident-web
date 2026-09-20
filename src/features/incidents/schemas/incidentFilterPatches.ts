import type { IncidentFilters } from './incidentFilters.schema';

/** The four boolean quick filters, in display order. */
export const TOGGLE_FILTER_KEYS = ['assignedToMe', 'reportedByMe', 'unacknowledged', 'escalatedOnly'] as const;
export type ToggleFilterKey = (typeof TOGGLE_FILTER_KEYS)[number];

/** The one "clear every filter" patch — the list page's empty state, the toolbar's
 * "Clear all" and the mobile sheet all send exactly this. Page, size and sort are
 * deliberately untouched (useIncidentFilters resets the page itself). */
export const CLEAR_FILTERS_PATCH: Partial<IncidentFilters> = Object.freeze({
  severity: undefined,
  stage: undefined,
  type: undefined,
  assignedToMe: undefined,
  reportedByMe: undefined,
  unacknowledged: undefined,
  escalatedOnly: undefined,
  from: undefined,
  to: undefined,
  q: undefined,
});

/** `{ assignedToMe: true }` / `{ assignedToMe: undefined }` — the same single-key patch
 * shape the checkboxes and chips have always sent. */
export function togglePatch(key: ToggleFilterKey, isOn: boolean): Partial<IncidentFilters> {
  const patch: Partial<IncidentFilters> = {};
  patch[key] = isOn || undefined;
  return patch;
}

/** How many filters other than the search text are active (a date range counts once). */
export function countNonSearchFilters(filters: IncidentFilters): number {
  return (
    (filters.severity?.length ?? 0) +
    (filters.stage?.length ?? 0) +
    (filters.type?.length ?? 0) +
    TOGGLE_FILTER_KEYS.filter((key) => filters[key]).length +
    (filters.from || filters.to ? 1 : 0)
  );
}

export function hasAnyFilter(filters: IncidentFilters): boolean {
  return countNonSearchFilters(filters) > 0 || Boolean(filters.q);
}
