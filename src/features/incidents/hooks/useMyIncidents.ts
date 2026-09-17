import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { listMyIncidents } from '../../../api/endpoints/incidents.api';
import { queryKeys } from '../../../api/queryKeys';

export function useMyIncidents(page: number, pageSize = 25) {
  return useQuery({
    queryKey: queryKeys.incidents.mine(page),
    queryFn: () => listMyIncidents(page, pageSize),
    placeholderData: keepPreviousData,
  });
}
