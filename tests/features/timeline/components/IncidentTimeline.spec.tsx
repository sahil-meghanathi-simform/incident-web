import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { IncidentTimeline } from '../../../../src/features/timeline/components/IncidentTimeline';

const { getIncidentTimelineMock } = vi.hoisted(() => ({ getIncidentTimelineMock: vi.fn() }));

vi.mock('../../../../src/api/endpoints/timeline.api', () => ({
  getIncidentTimeline: getIncidentTimelineMock,
}));

beforeEach(() => {
  getIncidentTimelineMock.mockReset();
});

function renderTimeline() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <IncidentTimeline incidentId="inc-1" />
      </TooltipProvider>
    </QueryClientProvider>,
  );
}

const BASE = { id: 'evt-1', occurredAt: new Date('2026-03-01T10:00:00.000Z').toISOString(), actor: { id: 'u1', displayName: 'A Manager' } };

describe('IncidentTimeline', () => {
  it('renders the empty state when there are no events', async () => {
    getIncidentTimelineMock.mockResolvedValueOnce({ items: [], nextCursor: null, hasMore: false });
    renderTimeline();

    await waitFor(() => expect(screen.getByText(/nothing recorded yet/i)).toBeInTheDocument());
  });

  it('renders a STAGE_CHANGED sentence with both stage badges', async () => {
    getIncidentTimelineMock.mockResolvedValueOnce({
      items: [{ ...BASE, type: 'STAGE_CHANGED', from: 'REPORTED', to: 'TRIAGE', reason: null }],
      nextCursor: null,
      hasMore: false,
    });
    renderTimeline();

    await waitFor(() => expect(screen.getByText(/a manager moved this incident from/i)).toBeInTheDocument());
    expect(screen.getByText('Reported')).toBeInTheDocument();
    expect(screen.getByText('Triage')).toBeInTheDocument();
  });

  it('renders a redacted NOTE_ADDED row without the author or length, distinct from a full one', async () => {
    getIncidentTimelineMock.mockResolvedValueOnce({
      items: [
        { id: 'evt-2', occurredAt: BASE.occurredAt, actor: null, type: 'NOTE_ADDED', redacted: true, noteId: null, length: null },
      ],
      nextCursor: null,
      hasMore: false,
    });
    renderTimeline();

    await waitFor(() => expect(screen.getByText(/investigation note added · restricted/i)).toBeInTheDocument());
    expect(screen.queryByText(/characters\)/)).not.toBeInTheDocument();
  });

  it('renders a full NOTE_ADDED row with the author and character count', async () => {
    getIncidentTimelineMock.mockResolvedValueOnce({
      items: [{ ...BASE, type: 'NOTE_ADDED', redacted: false, noteId: 'note-1', length: 42 }],
      nextCursor: null,
      hasMore: false,
    });
    renderTimeline();

    await waitFor(() => expect(screen.getByText(/a manager added an investigation note \(42 characters\)/i)).toBeInTheDocument());
  });

  it('shows a Load more control when hasMore is true, and fetches the next page on click', async () => {
    getIncidentTimelineMock.mockResolvedValueOnce({
      items: [{ ...BASE, type: 'INCIDENT_ACKNOWLEDGED' }],
      nextCursor: 'cursor-1',
      hasMore: true,
    });
    renderTimeline();

    await waitFor(() => expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument());

    getIncidentTimelineMock.mockResolvedValueOnce({
      items: [{ ...BASE, id: 'evt-3', type: 'INCIDENT_ACKNOWLEDGED' }],
      nextCursor: null,
      hasMore: false,
    });
    screen.getByRole('button', { name: /load more/i }).click();

    await waitFor(() => expect(getIncidentTimelineMock).toHaveBeenCalledTimes(2));
    expect(getIncidentTimelineMock).toHaveBeenLastCalledWith('inc-1', 'cursor-1', 20);
  });

  it('groups two same-day events under a single day divider', async () => {
    getIncidentTimelineMock.mockResolvedValueOnce({
      items: [
        { ...BASE, id: 'evt-a', occurredAt: '2026-03-01T10:00:00.000Z', type: 'INCIDENT_ACKNOWLEDGED' },
        { ...BASE, id: 'evt-b', occurredAt: '2026-03-01T09:00:00.000Z', type: 'INCIDENT_ACKNOWLEDGED' },
      ],
      nextCursor: null,
      hasMore: false,
    });
    renderTimeline();

    await waitFor(() => expect(screen.getAllByText(/acknowledged this incident/i)).toHaveLength(2));
    expect(screen.getAllByText(new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date('2026-03-01T10:00:00.000Z')))).toHaveLength(1);
  });

  it('shows an error state on a failed request', async () => {
    getIncidentTimelineMock.mockRejectedValueOnce(new Error('network error'));
    renderTimeline();

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  });
});
