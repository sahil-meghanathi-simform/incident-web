import { useMutation, useQueryClient, type InfiniteData, type UseMutationResult } from '@tanstack/react-query';
import { markNotificationRead } from '../../../api/endpoints/notification.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { NotificationsResponse } from '../types/notification.type';

type MarkAllContext = Readonly<{ previous: InfiniteData<NotificationsResponse> | undefined }>;

/**
 * Marks the given notifications read in one gesture. The API has no bulk endpoint
 * (POST /notifications/:id/read only), so this fans out one request per id — bounded
 * by what the page has loaded, 20 at a time — behind a single optimistic update and a
 * single invalidation, rather than N of each as N separate useMarkNotificationRead
 * calls would cost.
 *
 * `unreadCount` is the server's total, which can exceed what is loaded, so it drops by
 * the number actually marked instead of being zeroed. A partial failure rejects; the
 * refetch in onSettled then restores whichever items the server didn't take.
 */
export function useMarkAllNotificationsRead(): UseMutationResult<void, ApiError, readonly string[], MarkAllContext> {
  const queryClient = useQueryClient();
  const listKey = queryKeys.notifications.list;

  return useMutation({
    mutationFn: async (ids: readonly string[]): Promise<void> => {
      await Promise.all(ids.map((id) => markNotificationRead(id)));
    },
    onMutate: async (ids): Promise<MarkAllContext> => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<InfiniteData<NotificationsResponse>>(listKey);

      if (previous) {
        const marking = new Set(ids);
        const readAt = new Date().toISOString();
        let markedCount = 0;
        const pages = previous.pages.map((page) => ({
          ...page,
          items: page.items.map((item) => {
            if (!marking.has(item.id) || item.readAt !== null) return item;
            markedCount += 1;
            return { ...item, readAt };
          }),
        }));
        queryClient.setQueryData<InfiniteData<NotificationsResponse>>(listKey, {
          ...previous,
          pages: pages.map((page) => ({ ...page, unreadCount: Math.max(0, page.unreadCount - markedCount) })),
        });
      }

      return { previous };
    },
    onError: (_err, _ids, context) => {
      if (context?.previous) queryClient.setQueryData(listKey, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}
