import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getAdminTiers } from '../../../api/endpoints/admin.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { EscalationTiersResponse } from '../../../api/contracts/escalation.contract';

export function useEscalationTiers(): UseQueryResult<EscalationTiersResponse, ApiError> {
  return useQuery({
    queryKey: queryKeys.admin.tiers,
    queryFn: getAdminTiers,
  });
}
