import { useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import { getMyInvestigations } from '../../../api/endpoints/investigation.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { MyInvestigationsResponse } from '../types/investigation.type';

export function useMyInvestigations(page: number, pageSize: number): UseQueryResult<MyInvestigationsResponse, ApiError> {
  return useQuery({
    queryKey: queryKeys.investigations.mine({ page, pageSize }),
    queryFn: () => getMyInvestigations(page, pageSize),
    placeholderData: keepPreviousData,
  });
}
