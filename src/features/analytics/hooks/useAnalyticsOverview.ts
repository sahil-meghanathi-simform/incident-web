import { useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import { getAnalyticsOverview } from '../../../api/endpoints/analytics.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { AnalyticsOverviewResponse } from '../../../api/contracts/analytics.contract';
import type { AnalyticsPeriodFilters } from '../schemas/analyticsPeriod.schema';

/** keepPreviousData so changing the period dims the KPI row rather than blanking it
 * (implementation-plan.md §14.2 state responsibilities). */
export function useAnalyticsOverview(filters: AnalyticsPeriodFilters): UseQueryResult<AnalyticsOverviewResponse, ApiError> {
  return useQuery({
    queryKey: queryKeys.analytics.overview(filters),
    queryFn: () => getAnalyticsOverview(filters),
    placeholderData: keepPreviousData,
  });
}
