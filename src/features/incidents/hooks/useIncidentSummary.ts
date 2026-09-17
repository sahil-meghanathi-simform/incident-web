import { useQuery } from '@tanstack/react-query';
import { getIncidentSummary } from '../../../api/endpoints/incidents.api';
import { queryKeys } from '../../../api/queryKeys';

export function useIncidentSummary() {
  return useQuery({
    queryKey: queryKeys.incidents.summary,
    queryFn: getIncidentSummary,
  });
}
