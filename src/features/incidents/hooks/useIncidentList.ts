import { useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import { listIncidents } from '../../../api/endpoints/incidents.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { IncidentFilters } from '../schemas/incidentFilters.schema';
import type { IncidentListResponse } from '../types/incident.type';

/** keepPreviousData so paging/filtering doesn't flash an empty table between pages. */
export function useIncidentList(filters: IncidentFilters): UseQueryResult<IncidentListResponse, ApiError> {
  return useQuery({
    queryKey: queryKeys.incidents.list(filters),
    queryFn: () => listIncidents(filters),
    placeholderData: keepPreviousData,
  });
}
