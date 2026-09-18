import { api } from '../client';
import { TimelineResponseSchema, type TimelineResponse } from '../contracts/audit.contract';

export function getIncidentTimeline(
  incidentId: string,
  cursor: string | undefined,
  pageSize: number,
): Promise<TimelineResponse> {
  return api.get<TimelineResponse>(`/api/v1/incidents/${incidentId}/timeline`, TimelineResponseSchema, {
    cursor,
    pageSize,
  });
}
