import { api } from '../client';
import { AuditSearchResponseSchema, type AuditSearchResponse } from '../contracts/audit.contract';
import type { AuditSearchFilters } from '../../features/admin/schemas/auditSearch.schema';

/** Arrays serialize via comma-join — matches the backend's csvArrayQueryParam, same
 * convention as incidents.api.ts::serializeListFilters. */
function serializeAuditFilters(filters: AuditSearchFilters): Record<string, string | number | boolean | undefined> {
  return {
    page: filters.page,
    pageSize: filters.pageSize,
    type: filters.type?.join(','),
    actorId: filters.actorId,
    incidentId: filters.incidentId,
    from: filters.from,
    to: filters.to,
  };
}

export function searchAudit(filters: AuditSearchFilters): Promise<AuditSearchResponse> {
  return api.get<AuditSearchResponse>('/api/v1/audit', AuditSearchResponseSchema, serializeAuditFilters(filters));
}
