import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { previewClearanceImpact } from '../../../api/endpoints/admin.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { ClearanceImpactResponse } from '../../../api/contracts/admin.contract';

/**
 * Read-only preview of changeClearance's own cascade — the ClearanceImpactDialog calls
 * this BEFORE the PATCH so affected incidents can be listed by reference first
 * (build-plan.md §15.2). `enabled` guards it to only fire once a candidate clearance
 * has actually been picked, per queries.md's dependent-query rule.
 */
export function useClearanceImpactPreview(
  userId: string,
  clearanceLevel: number | null,
): UseQueryResult<ClearanceImpactResponse, ApiError> {
  return useQuery({
    queryKey: queryKeys.admin.clearanceImpact(userId, clearanceLevel ?? -1),
    queryFn: () => previewClearanceImpact(userId, clearanceLevel as number),
    enabled: clearanceLevel !== null,
  });
}
