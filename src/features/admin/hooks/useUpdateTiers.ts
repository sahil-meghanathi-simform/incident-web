import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { putAdminTiers } from '../../../api/endpoints/admin.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { TierSetRequest } from '../../../api/contracts/admin.contract';
import type { EscalationTiersResponse } from '../../../api/contracts/escalation.contract';

/** One atomic PUT (build-plan.md §15.2) — no per-cell autosave. Invalidates the
 * public GET /escalations/tiers cache too, since severity-picker help text and the
 * report form both read the thresholds this same PUT just replaced. */
export function useUpdateTiers(): UseMutationResult<EscalationTiersResponse, ApiError, TierSetRequest> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: TierSetRequest) => putAdminTiers(body),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.tiers });
      queryClient.invalidateQueries({ queryKey: queryKeys.escalations.tiers });
    },
  });
}
