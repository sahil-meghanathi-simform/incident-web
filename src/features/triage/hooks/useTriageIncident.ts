import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { triageIncident } from '../../../api/endpoints/triage.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { TriageActionResponse } from '../types/triage.type';

/** `POST /:id/triage` — REPORTED -> TRIAGE. */
export function useTriageIncident(incidentId: string): UseMutationResult<TriageActionResponse, ApiError, number> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (version: number) => triageIncident(incidentId, version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.detail(incidentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.triage.all });
    },
  });
}
