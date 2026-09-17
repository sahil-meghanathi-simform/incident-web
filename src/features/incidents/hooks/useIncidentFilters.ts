import { useCallback } from 'react';
import { useSearchParamsState } from '../../../hooks/useSearchParamsState';
import { incidentFiltersSchema, type IncidentFilters } from '../schemas/incidentFilters.schema';

/** Filters, page and sort live in the URL — shareable, back-button-correct, refresh-stable. */
export function useIncidentFilters(): readonly [IncidentFilters, (patch: Partial<IncidentFilters>) => void] {
  const [filters, update] = useSearchParamsState(incidentFiltersSchema);

  const setFilters = useCallback(
    (patch: Partial<IncidentFilters>) => {
      // Any filter change resets to page 1 — a stale page number past the new,
      // narrower result set would just render an empty page for no obvious reason.
      const patchesPageItself = 'page' in patch;
      update(patchesPageItself ? patch : { ...patch, page: 1 });
    },
    [update],
  );

  return [filters, setFilters] as const;
}
