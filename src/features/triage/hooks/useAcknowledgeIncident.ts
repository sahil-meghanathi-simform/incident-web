import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { acknowledgeIncident } from '../../../api/endpoints/triage.api';
import { queryKeys } from '../../../api/queryKeys';
import { useAuth } from '../../../hooks/useAuth';
import type { ApiError } from '../../../api/ApiError';
import type { IncidentDetail } from '../../incidents/types/incident.type';
import type { TriageActionResponse } from '../types/triage.type';

type AcknowledgeContext = Readonly<{ previous: IncidentDetail | undefined }>;

/** `POST /:id/acknowledge` — optimistic on the detail cache (Q18), rolled back on
 * error via the snapshot taken in onMutate. */
export function useAcknowledgeIncident(
  incidentId: string,
): UseMutationResult<TriageActionResponse, ApiError, number, AcknowledgeContext> {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const detailKey = queryKeys.incidents.detail(incidentId);

  return useMutation({
    mutationFn: (version: number) => acknowledgeIncident(incidentId, version),
    onMutate: async (): Promise<AcknowledgeContext> => {
      await queryClient.cancelQueries({ queryKey: detailKey });
      const previous = queryClient.getQueryData<IncidentDetail>(detailKey);
      if (previous && user) {
        queryClient.setQueryData<IncidentDetail>(detailKey, {
          ...previous,
          acknowledgement: {
            acknowledgedAt: new Date().toISOString(),
            acknowledgedBy: { id: user.id, displayName: user.displayName },
          },
        });
      }
      return { previous };
    },
    onError: (_err, _version, context) => {
      if (context?.previous) queryClient.setQueryData(detailKey, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
      queryClient.invalidateQueries({ queryKey: detailKey });
      queryClient.invalidateQueries({ queryKey: queryKeys.triage.all });
    },
  });
}
