import { api } from '../client';
import {
  EscalationFeedResponseSchema,
  type EscalationFeedResponse,
  EscalationTiersResponseSchema,
  type EscalationTiersResponse,
  IncidentEscalationEventsResponseSchema,
  type IncidentEscalationEventsResponse,
  RunEscalationJobResponseSchema,
  type RunEscalationJobResponse,
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

/**
 * `POST /jobs/escalation/run` (ADMIN) — the manual trigger Module 10's Job
 * Diagnostics screen uses to demonstrate double-run safety live (build-plan.md §15.2:
 * pressing [Run now] twice shows SKIPPED_LOCKED or 0 escalated). Lives here, not
 * admin.api.ts, mirroring the backend's own S7 decision to keep this route in the
 * escalation module rather than duplicating it.
 */
export function runEscalationJob(): Promise<RunEscalationJobResponse> {
  return api.post<RunEscalationJobResponse>('/api/v1/jobs/escalation/run', RunEscalationJobResponseSchema);
}
