import { api } from '../client';
import {
  EscalationFeedResponseSchema,
  type EscalationFeedResponse,
  EscalationTiersResponseSchema,
  type EscalationTiersResponse,
  IncidentEscalationEventsResponseSchema,
  type IncidentEscalationEventsResponse,
} from '../contracts/escalation.contract';

export function getEscalationFeed(cursor: string | undefined, pageSize: number): Promise<EscalationFeedResponse> {
  return api.get<EscalationFeedResponse>('/api/v1/escalations', EscalationFeedResponseSchema, { cursor, pageSize });
}

export function getEscalationTiers(): Promise<EscalationTiersResponse> {
  return api.get<EscalationTiersResponse>('/api/v1/escalations/tiers', EscalationTiersResponseSchema);
}

export function getIncidentEscalationEvents(incidentId: string): Promise<IncidentEscalationEventsResponse> {
  return api.get<IncidentEscalationEventsResponse>(
    `/api/v1/escalations/${incidentId}/events`,
    IncidentEscalationEventsResponseSchema,
  );
}
