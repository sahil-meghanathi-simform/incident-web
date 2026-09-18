import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { listAdminJobRuns } from '../../../api/endpoints/admin.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { AdminJobRunsResponse } from '../../../api/contracts/admin.contract';

/**
 * Polls every 10s "only while the page is focused" (build-plan.md §15.2) —
 * `refetchIntervalInBackground: false` (the TanStack Query default) already pauses
 * the interval whenever the tab loses focus/visibility, so no extra plumbing is
 * needed to satisfy that requirement.
 */
export function useJobRuns(): UseQueryResult<AdminJobRunsResponse, ApiError> {
  return useQuery({
    queryKey: queryKeys.admin.jobRuns,
    queryFn: () => listAdminJobRuns(),
    refetchInterval: 10_000,
    refetchIntervalInBackground: false,
  });
}
