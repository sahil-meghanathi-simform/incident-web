import { useQuery } from '@tanstack/react-query';
import { listIncidentTypes } from '../../../api/endpoints/incidents.api';
import { queryKeys } from '../../../api/queryKeys';

/** Enum metadata for the report form — fixed for the life of the session. */
export function useIncidentTypes() {
  return useQuery({
    queryKey: queryKeys.incidents.types,
    queryFn: listIncidentTypes,
    staleTime: Infinity,
  });
}
