import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { listIncidents } from '../../../api/endpoints/incidents.api';
import { queryKeys } from '../../../api/queryKeys';
import type { IncidentFilters } from '../schemas/incidentFilters.schema';

/** keepPreviousData so paging/filtering doesn't flash an empty table between pages. */
export function useIncidentList(filters: IncidentFilters) {
  return useQuery({
    queryKey: queryKeys.incidents.list(filters),
    queryFn: () => listIncidents(filters),
    placeholderData: keepPreviousData,
  });
}
