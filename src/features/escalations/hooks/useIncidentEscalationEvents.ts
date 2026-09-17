import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getIncidentEscalationEvents } from '../../../api/endpoints/escalation.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { IncidentEscalationEventsResponse } from '../types/escalation.type';

/** `enabled` — the incident detail's Overview tab only calls this once it already knows
 * `currentEscalationLevel > 0` and the viewer can see the `escalation` field at all
 * (§8.1: TRIAGE_MANAGER/ADMIN), so this never fires a request only to get a 403 back. */
export function useIncidentEscalationEvents(incidentId: string, enabled: boolean): UseQueryResult<IncidentEscalationEventsResponse, ApiError> {
  return useQuery({
    queryKey: queryKeys.escalations.events(incidentId),
    queryFn: () => getIncidentEscalationEvents(incidentId),
    enabled,
  });
}
