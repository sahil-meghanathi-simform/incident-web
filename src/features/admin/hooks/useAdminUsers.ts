import { useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import { listAdminUsers } from '../../../api/endpoints/admin.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { AdminUsersFilters } from '../schemas/adminUsers.schema';
import type { AdminUsersResponse } from '../../../api/contracts/admin.contract';

/** keepPreviousData so paging/filtering doesn't flash an empty table (same discipline
 * as useAuditSearch.ts / useIncidentList.ts). */
export function useAdminUsers(filters: AdminUsersFilters): UseQueryResult<AdminUsersResponse, ApiError> {
  return useQuery({
    queryKey: queryKeys.admin.users(filters),
    queryFn: () => listAdminUsers(filters),
    placeholderData: keepPreviousData,
  });
}
