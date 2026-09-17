import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { createIncident } from '../../../api/endpoints/incidents.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { CreateIncidentInput, IncidentReceipt } from '../types/incident.type';

export function useCreateIncident(): UseMutationResult<IncidentReceipt, ApiError, CreateIncidentInput> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateIncidentInput) => createIncident(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
    },
  });
}
