import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getIncident } from '../../../api/endpoints/incidents.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { IncidentDetail } from '../types/incident.type';

/** refetchOnWindowFocus so a 403 arriving mid-session (Q10) surfaces promptly. */
export function useIncident(id: string): UseQueryResult<IncidentDetail, ApiError> {
  return useQuery({
    queryKey: queryKeys.incidents.detail(id),
    queryFn: ({ signal }) => getIncident(id, signal),
    enabled: Boolean(id),
    retry: false,
    refetchOnWindowFocus: true,
  });
}
