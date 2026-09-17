import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useMarkNotificationRead } from '../../../../src/features/notifications/hooks/useMarkNotificationRead';
import { queryKeys } from '../../../../src/api/queryKeys';
import { ApiError } from '../../../../src/api/ApiError';
import type { NotificationsResponse } from '../../../../src/features/notifications/types/notification.type';

const { markNotificationReadMock } = vi.hoisted(() => ({ markNotificationReadMock: vi.fn() }));

vi.mock('../../../../src/api/endpoints/notification.api', () => ({
  markNotificationRead: markNotificationReadMock,
}));

function wrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

function seededPage(): NotificationsResponse {
  return {
    items: [
      {
        id: 'notif-1',
        incidentId: 'inc-1',
        incidentReference: 'INC-2026-000001',
        incidentTitle: 'A slip hazard',
        severity: 'HIGH',
        level: 1,
        dueAt: new Date().toISOString(),
        readAt: null,
        createdAt: new Date().toISOString(),
      },
    ],
    nextCursor: null,
    hasMore: false,
    unreadCount: 1,
  };
}

beforeEach(() => {
  markNotificationReadMock.mockReset();
});

describe('useMarkNotificationRead', () => {
  it('optimistically flips readAt and decrements unreadCount before the request settles', async () => {
    const queryClient = new QueryClient();
    const key = queryKeys.notifications.list;
    queryClient.setQueryData(key, { pages: [seededPage()], pageParams: [undefined] });
    markNotificationReadMock.mockImplementation(() => new Promise(() => {})); // never resolves in this test

    const { result } = renderHook(() => useMarkNotificationRead(), { wrapper: wrapper(queryClient) });
    result.current.mutate('notif-1');

    await waitFor(() => {
      const cached = queryClient.getQueryData<{ pages: NotificationsResponse[] }>(key);
      expect(cached?.pages[0]?.items[0]?.readAt).not.toBeNull();
      expect(cached?.pages[0]?.unreadCount).toBe(0);
    });
  });

  it('marking an already-read notification again does not decrement unreadCount below zero', async () => {
    const queryClient = new QueryClient();
    const key = queryKeys.notifications.list;
    const page = seededPage();
    page.items[0]!.readAt = new Date().toISOString();
    queryClient.setQueryData(key, { pages: [page], pageParams: [undefined] });
    markNotificationReadMock.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useMarkNotificationRead(), { wrapper: wrapper(queryClient) });
    result.current.mutate('notif-1');

    await waitFor(() => {
      const cached = queryClient.getQueryData<{ pages: NotificationsResponse[] }>(key);
      expect(cached?.pages[0]?.unreadCount).toBe(1);
    });
  });

  it('rolls back on failure, restoring the exact pre-mutation cache', async () => {
    const queryClient = new QueryClient();
    const key = queryKeys.notifications.list;
    const original = { pages: [seededPage()], pageParams: [undefined] };
    queryClient.setQueryData(key, original);
    markNotificationReadMock.mockRejectedValueOnce(new ApiError({ code: 'NOT_FOUND', status: 404, message: 'gone', requestId: 'r1' }));

    const { result } = renderHook(() => useMarkNotificationRead(), { wrapper: wrapper(queryClient) });
    result.current.mutate('notif-1');

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(queryClient.getQueryData(key)).toEqual(original);
  });
});
