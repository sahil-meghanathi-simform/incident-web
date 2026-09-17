import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationItem } from '../../../../src/features/notifications/components/NotificationItem';
import type { NotificationItem as NotificationItemData } from '../../../../src/features/notifications/types/notification.type';

const { markNotificationReadMock } = vi.hoisted(() => ({ markNotificationReadMock: vi.fn() }));

vi.mock('../../../../src/api/endpoints/notification.api', () => ({
  markNotificationRead: markNotificationReadMock,
}));

function notification(overrides: Partial<NotificationItemData> = {}): NotificationItemData {
  return {
    id: 'notif-1',
    incidentId: 'inc-1',
    incidentReference: 'INC-2026-000001',
    incidentTitle: 'A slip hazard',
    severity: 'CRITICAL',
    level: 1,
    dueAt: new Date().toISOString(),
    readAt: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function renderItem(data: NotificationItemData, onNavigate = vi.fn()) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ul>
          <NotificationItem notification={data} onNavigate={onNavigate} />
        </ul>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  markNotificationReadMock.mockReset();
  markNotificationReadMock.mockResolvedValue(notification({ readAt: new Date().toISOString() }));
});

describe('NotificationItem', () => {
  it('links to the incident and marks an unread notification read on click', async () => {
    const onNavigate = vi.fn();
    renderItem(notification({ readAt: null }), onNavigate);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/incidents/inc-1');
    fireEvent.click(link);

    await waitFor(() => expect(markNotificationReadMock).toHaveBeenCalledWith('notif-1'));
    expect(onNavigate).toHaveBeenCalled();
  });

  it('does not re-mark an already-read notification', async () => {
    renderItem(notification({ readAt: new Date().toISOString() }));
    fireEvent.click(screen.getByRole('link'));
    await Promise.resolve();
    expect(markNotificationReadMock).not.toHaveBeenCalled();
  });
});
