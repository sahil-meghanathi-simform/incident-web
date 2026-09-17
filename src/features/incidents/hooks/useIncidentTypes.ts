import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { listIncidentTypes } from '../../../api/endpoints/incidents.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { IncidentTypesResponse } from '../types/incident.type';

/** Enum metadata for the report form — fixed for the life of the session. */
export function useIncidentTypes(): UseQueryResult<IncidentTypesResponse, ApiError> {
  return useQuery({
    queryKey: queryKeys.incidents.types,
    queryFn: listIncidentTypes,
    staleTime: Infinity,
  });
}
