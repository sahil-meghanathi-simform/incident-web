import { api } from '../client';
import {
  type CreateIncidentRequest,
  IncidentDetailSchema,
  type IncidentDetail,
  IncidentListResponseSchema,
  type IncidentListResponse,
  IncidentReceiptSchema,
  type IncidentReceipt,
  IncidentSummarySchema,
  type IncidentSummary,
  IncidentTypesResponseSchema,
  type IncidentTypesResponse,
} from '../contracts/incident.contract';
import type { IncidentFilters } from '../../features/incidents/schemas/incidentFilters.schema';

/**
 * Always multipart, whether or not a photo is attached — one request shape for the
 * backend's multer-then-validate pipeline (incident.router.ts) rather than branching
 * between JSON and multipart at the call site.
 */
export function createIncident(body: CreateIncidentRequest, image: File | null): Promise<IncidentReceipt> {
  const formData = new FormData();
  formData.set('type', body.type);
  formData.set('severity', body.severity);
  formData.set('title', body.title);
  formData.set('description', body.description);
  if (image) {
    formData.set('image', image);
  } else if (body.noImageReason) {
    formData.set('noImageReason', body.noImageReason);
  }
  return api.post<IncidentReceipt>('/api/v1/incidents', IncidentReceiptSchema, formData);
}

export function listIncidentTypes(): Promise<IncidentTypesResponse> {
  return api.get<IncidentTypesResponse>('/api/v1/incidents/types', IncidentTypesResponseSchema);
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
  return api.get<IncidentListResponse>('/api/v1/incidents', IncidentListResponseSchema, serializeListFilters(filters));
}

export function getIncident(id: string, signal?: AbortSignal): Promise<IncidentDetail> {
  return api.get<IncidentDetail>(`/api/v1/incidents/${id}`, IncidentDetailSchema, undefined, signal);
}

export function listMyIncidents(page: number, pageSize: number): Promise<IncidentListResponse> {
  return api.get<IncidentListResponse>('/api/v1/incidents/mine', IncidentListResponseSchema, { page, pageSize });
}

export function getIncidentSummary(): Promise<IncidentSummary> {
  return api.get<IncidentSummary>('/api/v1/incidents/summary', IncidentSummarySchema);
}
