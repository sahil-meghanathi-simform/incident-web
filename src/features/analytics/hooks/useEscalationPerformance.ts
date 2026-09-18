import { useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import { getEscalationPerformance } from '../../../api/endpoints/analytics.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { EscalationPerformanceResponse } from '../../../api/contracts/analytics.contract';
import { usePermissions } from '../../../hooks/usePermissions';
import type { AnalyticsPeriodFilters } from '../schemas/analyticsPeriod.schema';

/**
 * `enabled: canTriage` — a UI convenience only (the server 403s TRIAGE_MANAGER/ADMIN
 * itself either way, escalation.router.ts's role gate mirror); this just avoids firing
 * a request a REPORTER/INVESTIGATOR would only ever see rejected.
 */
export function useEscalationPerformance(filters: AnalyticsPeriodFilters): UseQueryResult<EscalationPerformanceResponse, ApiError> {
  const { canTriage } = usePermissions();
  return useQuery({
    queryKey: queryKeys.analytics.escalationPerformance(filters),
    queryFn: () => getEscalationPerformance(filters),
    placeholderData: keepPreviousData,
    enabled: canTriage,
  });
}
