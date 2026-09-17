import { api } from '../client';
import type {
  CreateIncidentRequest,
  IncidentDetail,
  IncidentListResponse,
  IncidentReceipt,
  IncidentSummary,
  IncidentTypesResponse,
} from '../contracts/incident.contract';
import type { IncidentFilters } from '../../features/incidents/schemas/incidentFilters.schema';

export function createIncident(body: CreateIncidentRequest): Promise<IncidentReceipt> {
  return api.post<IncidentReceipt>('/api/v1/incidents', body);
}

export function listIncidentTypes(): Promise<IncidentTypesResponse> {
  return api.get<IncidentTypesResponse>('/api/v1/incidents/types');
}

/** Arrays serialize via `Array.prototype.toString` (comma-joined) — matches the
 * backend's csvArrayQueryParam, which accepts exactly that spelling. */
function serializeListFilters(filters: IncidentFilters): Record<string, string | number | boolean | undefined> {
  return {
    page: filters.page,
    pageSize: filters.pageSize,
    severity: filters.severity?.join(','),
    stage: filters.stage?.join(','),
    type: filters.type?.join(','),
    assignedToMe: filters.assignedToMe,
    reportedByMe: filters.reportedByMe,
    unacknowledged: filters.unacknowledged,
    escalatedOnly: filters.escalatedOnly,
    from: filters.from,
    to: filters.to,
    q: filters.q,
    sort: filters.sort,
    order: filters.order,
  };
}

export function listIncidents(filters: IncidentFilters): Promise<IncidentListResponse> {
  return api.get<IncidentListResponse>('/api/v1/incidents', serializeListFilters(filters));
}

export function getIncident(id: string, signal?: AbortSignal): Promise<IncidentDetail> {
  return api.get<IncidentDetail>(`/api/v1/incidents/${id}`, undefined, signal);
}

export function listMyIncidents(page: number, pageSize: number): Promise<IncidentListResponse> {
  return api.get<IncidentListResponse>('/api/v1/incidents/mine', { page, pageSize });
}

export function getIncidentSummary(): Promise<IncidentSummary> {
  return api.get<IncidentSummary>('/api/v1/incidents/summary');
}
