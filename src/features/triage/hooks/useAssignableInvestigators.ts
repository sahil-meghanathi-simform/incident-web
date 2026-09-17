import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getAssignableInvestigators } from '../../../api/endpoints/users.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { AssignableInvestigator } from '../types/triage.type';

export function useAssignableInvestigators(minClearance: number): UseQueryResult<AssignableInvestigator[], ApiError> {
  return useQuery({
    queryKey: queryKeys.users.assignableInvestigators(minClearance),
    queryFn: () => getAssignableInvestigators(minClearance),
  });
}
