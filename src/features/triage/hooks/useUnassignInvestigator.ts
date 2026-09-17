import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { unassignInvestigator } from '../../../api/endpoints/triage.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { TriageActionResponse } from '../types/triage.type';

/** `DELETE /:id/assignment`, sent with `If-Match`. */
export function useUnassignInvestigator(incidentId: string): UseMutationResult<TriageActionResponse, ApiError, number> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (version: number) => unassignInvestigator(incidentId, version),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.detail(incidentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.triage.all });
    },
  });
}
