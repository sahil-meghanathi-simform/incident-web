import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { createIncident } from '../../../api/endpoints/incidents.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { CreateIncidentVariables, IncidentReceipt } from '../types/incident.type';

export function useCreateIncident(): UseMutationResult<IncidentReceipt, ApiError, CreateIncidentVariables> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body, image }: CreateIncidentVariables) => createIncident(body, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
    },
  });
}
