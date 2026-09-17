import { useMutation, useQueryClient, type InfiniteData, type UseMutationResult } from '@tanstack/react-query';
import { markNotificationRead } from '../../../api/endpoints/notification.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { NotificationItem, NotificationsResponse } from '../types/notification.type';

type MarkReadContext = Readonly<{ previous: InfiniteData<NotificationsResponse> | undefined }>;

/** Optimistic: flips the one item's `readAt` and decrements `unreadCount` on every
 * cached page (every page reports the same server-computed total), rolled back on
 * error via the snapshot taken in onMutate — same pattern as useAcknowledgeIncident. */
export function useMarkNotificationRead(): UseMutationResult<NotificationItem, ApiError, string, MarkReadContext> {
  const queryClient = useQueryClient();
  const listKey = queryKeys.notifications.list;

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onMutate: async (id: string): Promise<MarkReadContext> => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<InfiniteData<NotificationsResponse>>(listKey);

      if (previous) {
        let wasUnread = false;
        const pages = previous.pages.map((page) => ({
          ...page,
          items: page.items.map((item) => {
            if (item.id !== id) return item;
            wasUnread = item.readAt === null;
            return { ...item, readAt: new Date().toISOString() };
          }),
        }));
        queryClient.setQueryData<InfiniteData<NotificationsResponse>>(listKey, {
          ...previous,
          pages: pages.map((page) => (wasUnread ? { ...page, unreadCount: Math.max(0, page.unreadCount - 1) } : page)),
        });
      }

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(listKey, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}
