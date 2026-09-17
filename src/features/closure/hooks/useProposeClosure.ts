import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { proposeClosure } from '../../../api/endpoints/closure.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { ClosureActionResponse, ProposeClosureRequest } from '../types/closure.type';

type ProposeClosureInput = Readonly<{ version: number; body: ProposeClosureRequest }>;

/** `POST /:id/closure-proposal`, sent with `If-Match` — INVESTIGATION -> PENDING_CLOSURE. */
export function useProposeClosure(
  incidentId: string,
): UseMutationResult<ClosureActionResponse, ApiError, ProposeClosureInput> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ version, body }: ProposeClosureInput) => proposeClosure(incidentId, version, body),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.detail(incidentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.closures.all });
    },
  });
}
