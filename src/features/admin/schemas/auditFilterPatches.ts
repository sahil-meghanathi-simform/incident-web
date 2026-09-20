import type { AuditSearchFilters } from './auditSearch.schema';

/** The one "clear every filter" patch — the toolbar, the filter panel and the page's
 * empty state all send exactly this. Page size is untouched; useAuditFilters resets
 * the page number itself. */
export const CLEAR_AUDIT_FILTERS_PATCH: Partial<AuditSearchFilters> = Object.freeze({
  type: undefined,
  actorId: undefined,
  incidentId: undefined,
  from: undefined,
  to: undefined,
});

export function hasAnyAuditFilter(filters: AuditSearchFilters): boolean {
  return Boolean(filters.type?.length || filters.actorId || filters.incidentId || filters.from || filters.to);
}
