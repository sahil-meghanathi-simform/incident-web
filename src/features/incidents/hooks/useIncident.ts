import { useQuery } from '@tanstack/react-query';
import { getIncident } from '../../../api/endpoints/incidents.api';
import { queryKeys } from '../../../api/queryKeys';

/** refetchOnWindowFocus so a 403 arriving mid-session (Q10) surfaces promptly. */
export function useIncident(id: string) {
  return useQuery({
    queryKey: queryKeys.incidents.detail(id),
    queryFn: ({ signal }) => getIncident(id, signal),
    retry: false,
    refetchOnWindowFocus: true,
  });
}
