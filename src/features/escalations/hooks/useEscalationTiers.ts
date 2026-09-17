import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getEscalationTiers } from '../../../api/endpoints/escalation.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { EscalationTiersResponse } from '../types/escalation.type';

/** Auth-open on the backend (any role) — used for the feed's empty state ("here's what
 * we watch for") and safe to call regardless of the viewer's role or clearance. */
export function useEscalationTiers(): UseQueryResult<EscalationTiersResponse, ApiError> {
  return useQuery({
    queryKey: queryKeys.escalations.tiers,
    queryFn: getEscalationTiers,
    staleTime: 5 * 60_000,
  });
}
