import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { getNotifications } from '../../../api/endpoints/notification.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { NotificationsResponse } from '../types/notification.type';

const PAGE_SIZE = 20;

/** Polled every 60s, not sockets (Q31) — the bell and the full page both use this, so
 * they always agree on the unread count without a second, separate query. */
export function useNotifications(): UseInfiniteQueryResult<InfiniteData<NotificationsResponse>, ApiError> {
  return useInfiniteQuery({
    queryKey: queryKeys.notifications.list,
    queryFn: ({ pageParam }) => getNotifications(pageParam, PAGE_SIZE),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor ?? undefined : undefined),
    refetchInterval: 60_000,
  });
}
