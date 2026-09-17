import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { getEscalationFeed } from '../../../api/endpoints/escalation.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { EscalationFeedResponse } from '../types/escalation.type';

const PAGE_SIZE = 25;

export function useEscalationFeed(): UseInfiniteQueryResult<InfiniteData<EscalationFeedResponse>, ApiError> {
  return useInfiniteQuery({
    queryKey: queryKeys.escalations.feed,
    queryFn: ({ pageParam }) => getEscalationFeed(pageParam, PAGE_SIZE),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor ?? undefined : undefined),
  });
}
