import { api } from '../client';
import {
  type AssignInvestigatorRequest,
  type ChangeSeverityRequest,
  TriageActionResponseSchema,
  type TriageActionResponse,
  TriageQueueResponseSchema,
  type TriageQueueResponse,
} from '../contracts/triage.contract';

export function triageIncident(id: string, version: number): Promise<TriageActionResponse> {
  return api.post<TriageActionResponse>(`/api/v1/incidents/${id}/triage`, TriageActionResponseSchema, undefined, {
    ifMatchVersion: version,
  });
}

export function changeSeverity(
  id: string,
  version: number,
  body: ChangeSeverityRequest,
): Promise<TriageActionResponse> {
  return api.patch<TriageActionResponse>(`/api/v1/incidents/${id}/severity`, TriageActionResponseSchema, body, {
    ifMatchVersion: version,
  });
}

export function assignInvestigator(
  id: string,
  version: number,
  body: AssignInvestigatorRequest,
): Promise<TriageActionResponse> {
  return api.post<TriageActionResponse>(`/api/v1/incidents/${id}/assignment`, TriageActionResponseSchema, body, {
    ifMatchVersion: version,
  });
}

export function unassignInvestigator(id: string, version: number): Promise<TriageActionResponse> {
  return api.delete<TriageActionResponse>(`/api/v1/incidents/${id}/assignment`, TriageActionResponseSchema, {
    ifMatchVersion: version,
  });
}

export function acknowledgeIncident(id: string, version: number): Promise<TriageActionResponse> {
  return api.post<TriageActionResponse>(`/api/v1/incidents/${id}/acknowledge`, TriageActionResponseSchema, undefined, {
    ifMatchVersion: version,
  });
}

export function getTriageQueue(page: number, pageSize: number): Promise<TriageQueueResponse> {
  return api.get<TriageQueueResponse>('/api/v1/triage/queue', TriageQueueResponseSchema, { page, pageSize });
}
