import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { changeUserClearance } from '../../../api/endpoints/admin.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { AdminUserMutationResponse } from '../../../api/contracts/admin.contract';

type ChangeUserClearanceInput = Readonly<{ userId: string; clearanceLevel: number }>;

/**
 * A lowering can cascade into unassigning incidents and returning them to TRIAGE
 * (build-plan.md §15.1 rule 3, the mirror of Q17) — so this invalidates the incident
 * and triage caches too, not just the admin users table, mirroring
 * useChangeSeverity.ts's own invalidation scope for the identical cascade from the
 * other direction. No optimistic update (§15.2): the cascade makes the true result
 * unknowable client-side, so the UI waits for the server's `affectedIncidentCount`.
 */
export function useChangeUserClearance(): UseMutationResult<AdminUserMutationResponse, ApiError, ChangeUserClearanceInput> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, clearanceLevel }: ChangeUserClearanceInput) => changeUserClearance(userId, clearanceLevel),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.usersAll });
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.triage.all });
    },
  });
}
