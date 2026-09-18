import { useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import { searchAudit } from '../../../api/endpoints/audit.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { AuditSearchFilters } from '../schemas/auditSearch.schema';
import type { AuditSearchResponse } from '../../../api/contracts/audit.contract';

/** keepPreviousData so paging/filtering doesn't flash an empty table between pages
 * (same discipline as useIncidentList.ts). */
export function useAuditSearch(filters: AuditSearchFilters): UseQueryResult<AuditSearchResponse, ApiError> {
  return useQuery({
    queryKey: queryKeys.admin.audit(filters),
    queryFn: () => searchAudit(filters),
    placeholderData: keepPreviousData,
  });
}
