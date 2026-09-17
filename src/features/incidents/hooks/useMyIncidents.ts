import { useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import { listMyIncidents } from '../../../api/endpoints/incidents.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { IncidentListResponse } from '../types/incident.type';

export function useMyIncidents(page: number, pageSize = 25): UseQueryResult<IncidentListResponse, ApiError> {
  return useQuery({
    queryKey: queryKeys.incidents.mine(page),
    queryFn: () => listMyIncidents(page, pageSize),
    placeholderData: keepPreviousData,
  });
}
