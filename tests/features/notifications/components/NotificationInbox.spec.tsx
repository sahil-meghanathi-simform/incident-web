import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationInbox } from '../../../../src/features/notifications/components/NotificationInbox';
import { ToastContext } from '../../../../src/components/ui/ToastContext';
import type { NotificationItem } from '../../../../src/features/notifications/types/notification.type';

const { markNotificationReadMock } = vi.hoisted(() => ({ markNotificationReadMock: vi.fn() }));

vi.mock('../../../../src/api/endpoints/notification.api', () => ({
  markNotificationRead: markNotificationReadMock,
}));

function notification(overrides: Partial<NotificationItem>): NotificationItem {
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

const ITEMS: readonly NotificationItem[] = [
  notification({ id: 'n1', incidentId: 'inc-1', incidentReference: 'INC-2026-000001', incidentTitle: 'A slip hazard' }),
  notification({ id: 'n2', incidentId: 'inc-2', incidentReference: 'INC-2026-000002', incidentTitle: 'Badge reader offline' }),
  notification({
    id: 'n3',
    incidentId: 'inc-3',
    incidentReference: 'INC-2026-000003',
    incidentTitle: 'Coolant leak',
    readAt: new Date().toISOString(),
  }),
];

function renderInbox(props: Partial<Parameters<typeof NotificationInbox>[0]> = {}) {
  const show = vi.fn();
  const onLoadMore = vi.fn();
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ToastContext.Provider value={{ show }}>
        <MemoryRouter>
          <NotificationInbox items={ITEMS} unreadCount={2} hasMore={false} isLoadingMore={false} onLoadMore={onLoadMore} {...props} />
        </MemoryRouter>
      </ToastContext.Provider>
    </QueryClientProvider>,
  );
  return { show, onLoadMore };
}

beforeEach(() => {
  markNotificationReadMock.mockReset();
  markNotificationReadMock.mockImplementation((id: string) => Promise.resolve(notification({ id, readAt: new Date().toISOString() })));
});

describe('NotificationInbox', () => {
  it('lists every notification under its day, each title linking to its incident', () => {
    renderInbox();
    const today = screen.getByRole('region', { name: /today/i });
    expect(within(today).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('link', { name: /a slip hazard/i })).toHaveAttribute('href', '/incidents/inc-1');
    // Unread is carried in the accessible name, not by colour alone.
    expect(screen.getByRole('link', { name: /^unread:\s*a slip hazard$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Coolant leak' })).toBeInTheDocument();
  });

  it('narrows to unread notifications and back', () => {
    renderInbox();
    fireEvent.click(screen.getByRole('radio', { name: /unread/i }));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByRole('link', { name: 'Coolant leak' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('radio', { name: 'All' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('marks one notification read from its row without following the link', async () => {
    renderInbox();
    fireEvent.click(screen.getByRole('button', { name: /mark the INC-2026-000002 notification as read/i }));
    await waitFor(() => expect(markNotificationReadMock).toHaveBeenCalledWith('n2'));
    expect(markNotificationReadMock).toHaveBeenCalledTimes(1);
  });

  it('offers no mark-as-read button on a notification that is already read', () => {
    renderInbox();
    expect(screen.queryByRole('button', { name: /INC-2026-000003/ })).not.toBeInTheDocument();
  });

  it('marks every loaded unread notification read in one go and confirms it', async () => {
    const { show } = renderInbox();
    fireEvent.click(screen.getByRole('button', { name: /mark all as read/i }));

    await waitFor(() => expect(show).toHaveBeenCalledWith(expect.stringMatching(/marked 2 notifications as read/i), 'success'));
    expect(markNotificationReadMock.mock.calls.map(([id]) => id)).toEqual(['n1', 'n2']);
  });

  it('disables "Mark all as read" and explains the empty Unread view when everything is read', () => {
    const allRead = ITEMS.map((item) => ({ ...item, readAt: item.readAt ?? new Date().toISOString() }));
    renderInbox({ items: allRead, unreadCount: 0 });
    expect(screen.getByRole('button', { name: /mark all as read/i })).toBeDisabled();

    fireEvent.click(screen.getByRole('radio', { name: /unread/i }));
    expect(screen.getByText(/you're all caught up/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /show all notifications/i }));
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('loads older notifications from the end of the list', () => {
    const { onLoadMore } = renderInbox({ hasMore: true });
    fireEvent.click(screen.getByRole('button', { name: /load more/i }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });
});
