import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { changeSeverity } from '../../../api/endpoints/triage.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { ChangeSeverityRequest, TriageActionResponse } from '../types/triage.type';

type ChangeSeverityInput = Readonly<{ version: number; body: ChangeSeverityRequest }>;

/** `PATCH /:id/severity`, sent with `If-Match`. On 409 STALE_VERSION the caller
 * refetches the incident — TanStack Query already does this via invalidation on
 * settle, so a rejected mutation still leaves the cache pointing at fresh data. */
export function useChangeSeverity(
  incidentId: string,
): UseMutationResult<TriageActionResponse, ApiError, ChangeSeverityInput> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ version, body }: ChangeSeverityInput) => changeSeverity(incidentId, version, body),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.detail(incidentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.triage.all });
    },
  });
}
