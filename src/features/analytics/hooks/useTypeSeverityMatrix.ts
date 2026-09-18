import { useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import { getTypeSeverityMatrix } from '../../../api/endpoints/analytics.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { TypeSeverityMatrixResponse } from '../../../api/contracts/analytics.contract';
import type { AnalyticsPeriodFilters } from '../schemas/analyticsPeriod.schema';

export function useTypeSeverityMatrix(filters: AnalyticsPeriodFilters): UseQueryResult<TypeSeverityMatrixResponse, ApiError> {
  return useQuery({
    queryKey: queryKeys.analytics.matrix(filters),
    queryFn: () => getTypeSeverityMatrix(filters),
    placeholderData: keepPreviousData,
  });
}
