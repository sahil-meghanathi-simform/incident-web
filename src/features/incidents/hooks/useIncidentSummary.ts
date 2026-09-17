import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getIncidentSummary } from '../../../api/endpoints/incidents.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { IncidentSummary } from '../types/incident.type';

export function useIncidentSummary(): UseQueryResult<IncidentSummary, ApiError> {
  return useQuery({
    queryKey: queryKeys.incidents.summary,
    queryFn: getIncidentSummary,
  });
}
