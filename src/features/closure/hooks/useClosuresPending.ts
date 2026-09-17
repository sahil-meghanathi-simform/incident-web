import { useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import { getClosuresPending } from '../../../api/endpoints/closure.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { ClosuresPendingResponse } from '../types/closure.type';

export function useClosuresPending(page: number, pageSize = 25): UseQueryResult<ClosuresPendingResponse, ApiError> {
  return useQuery({
    queryKey: queryKeys.closures.pending({ page, pageSize }),
    queryFn: () => getClosuresPending(page, pageSize),
    placeholderData: keepPreviousData,
  });
}
