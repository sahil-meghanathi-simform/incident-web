import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { assignInvestigator } from '../../../api/endpoints/triage.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { AssignInvestigatorRequest, TriageActionResponse } from '../types/triage.type';

type AssignInvestigatorInput = Readonly<{ version: number; body: AssignInvestigatorRequest }>;

/** `POST /:id/assignment`, sent with `If-Match`. */
export function useAssignInvestigator(
  incidentId: string,
): UseMutationResult<TriageActionResponse, ApiError, AssignInvestigatorInput> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ version, body }: AssignInvestigatorInput) => assignInvestigator(incidentId, version, body),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.detail(incidentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.triage.all });
    },
  });
}
