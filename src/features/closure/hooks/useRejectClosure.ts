import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { rejectClosure } from '../../../api/endpoints/closure.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { ClosureActionResponse, RejectClosureRequest } from '../types/closure.type';

type RejectClosureInput = Readonly<{ version: number; body: RejectClosureRequest }>;

/** `POST /:id/closure-rejection` — PENDING_CLOSURE -> INVESTIGATION. The RCA text is
 * retained server-side; nothing here needs to restore it locally. */
export function useRejectClosure(
  incidentId: string,
): UseMutationResult<ClosureActionResponse, ApiError, RejectClosureInput> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ version, body }: RejectClosureInput) => rejectClosure(incidentId, version, body),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.detail(incidentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.closures.all });
    },
  });
}
