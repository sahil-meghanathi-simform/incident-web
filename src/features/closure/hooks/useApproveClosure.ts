import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { approveClosure } from '../../../api/endpoints/closure.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { ClosureActionResponse } from '../types/closure.type';

/** `POST /:id/closure-approval` — PENDING_CLOSURE -> CLOSED. Never optimistic (build-
 * plan.md §11.2): the CHECK constraint is a real, independent gate, so the true result
 * isn't knowable client-side until the server has actually checked it. */
export function useApproveClosure(incidentId: string): UseMutationResult<ClosureActionResponse, ApiError, number> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (version: number) => approveClosure(incidentId, version),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.detail(incidentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.closures.all });
    },
  });
}
