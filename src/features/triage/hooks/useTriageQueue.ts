import { useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import { getTriageQueue } from '../../../api/endpoints/triage.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { TriageQueueResponse } from '../types/triage.type';

export function useTriageQueue(page: number, pageSize = 25): UseQueryResult<TriageQueueResponse, ApiError> {
  return useQuery({
    queryKey: queryKeys.triage.queue({ page, pageSize }),
    queryFn: () => getTriageQueue(page, pageSize),
    placeholderData: keepPreviousData,
  });
}
