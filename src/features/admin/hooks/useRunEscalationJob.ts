import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { runEscalationJob } from '../../../api/endpoints/escalation.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { RunEscalationJobResponse } from '../../../api/contracts/escalation.contract';

/** [Run now] — pressing it twice in a row is how §6's idempotency claim gets
 * demonstrated live (the second press shows SKIPPED_LOCKED or 0 escalated). Also
 * invalidates the escalation feed/notifications, since a real run can change both. */
export function useRunEscalationJob(): UseMutationResult<RunEscalationJobResponse, ApiError, void> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => runEscalationJob(),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.jobRuns });
      queryClient.invalidateQueries({ queryKey: queryKeys.escalations.feed });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount });
    },
  });
}
