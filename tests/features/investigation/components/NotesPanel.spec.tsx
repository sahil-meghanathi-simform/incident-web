import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotesPanel } from '../../../../src/features/investigation/components/NotesPanel';
import { AuthContext } from '../../../../src/app/AuthProvider';
import { ToastContext } from '../../../../src/components/ui/ToastContext';
import type { IncidentDetail } from '../../../../src/features/incidents/types/incident.type';

const { listNotesMock } = vi.hoisted(() => ({ listNotesMock: vi.fn() }));

vi.mock('../../../../src/api/endpoints/investigation.api', () => ({
  listNotes: listNotesMock,
}));

const AUTH_USER = { id: 'me-1', email: 'me@test.local', displayName: 'Me', role: 'INVESTIGATOR' as const, clearanceLevel: 3 };

function incident(canReadNotes: boolean, canAddNote: boolean): IncidentDetail {
  return {
    id: 'inc-1',
    reference: 'INC-2026-000001',
    type: 'SAFETY',
    severity: 'HIGH',
    stage: 'INVESTIGATION',
    title: 'A slip hazard',
    description: 'Long enough description for validation purposes.',
    imageUrl: null,
    noImageReason: 'No camera was available at the time.',
    reporter: { id: 'reporter-1', displayName: 'A Reporter' },
    assignedInvestigator: { id: 'me-1', displayName: 'Me' },
    rootCause: null,
    closure: null,
    correctiveAction: null,
    version: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _actions: {
      canTriage: false,
      canAssign: false,
      canAcknowledge: false,
      canReadNotes,
      canAddNote,
      canProposeClosure: false,
      canApproveClosure: false,
    },
  };
}

function renderPanel(inc: IncidentDetail) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ status: 'authenticated', user: AUTH_USER, refetch: vi.fn() }}>
        <ToastContext.Provider value={{ show: vi.fn() }}>
          <NotesPanel incident={inc} />
        </ToastContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>,
  );
}

describe('NotesPanel', () => {
  it('renders NotesRestrictedNotice, and never calls the notes endpoint, when _actions.canReadNotes is false', () => {
    renderPanel(incident(false, false));

    expect(screen.getByText(/limited to the assigned investigator/i)).toBeInTheDocument();
    expect(listNotesMock).not.toHaveBeenCalled();
  });

  it('shows the empty state and an auto-focused composer when granted with no notes yet', async () => {
    listNotesMock.mockResolvedValueOnce({ items: [], nextCursor: null, hasMore: false });
    renderPanel(incident(true, true));

    await waitFor(() => expect(screen.getByText(/no investigation notes yet/i)).toBeInTheDocument());
    // jsdom doesn't actually move focus for a programmatically-set `autofocus`
    // attribute the way a real browser does on initial paint, so this asserts the
    // attribute itself rather than document.activeElement.
    expect(screen.getByRole('textbox')).toHaveAttribute('autofocus');
  });

  it('renders existing notes and a confidentiality banner when granted', async () => {
    listNotesMock.mockResolvedValueOnce({
      items: [
        {
          id: 'note-1',
          incidentId: 'inc-1',
          author: { id: 'inv-2', displayName: 'Another Investigator' },
          body: 'Reviewed the CCTV footage from the loading dock.',
          createdAt: new Date().toISOString(),
        },
      ],
      nextCursor: null,
      hasMore: false,
    });
    renderPanel(incident(true, true));

    await waitFor(() => expect(screen.getByText(/reviewed the cctv footage/i)).toBeInTheDocument());
    expect(screen.getByText(/visible only to you and administrators/i)).toBeInTheDocument();
  });

  it('does not render a composer for a read-only viewer (canReadNotes true, canAddNote false)', async () => {
    listNotesMock.mockResolvedValueOnce({ items: [], nextCursor: null, hasMore: false });
    renderPanel(incident(true, false));

    await waitFor(() => expect(screen.getByText(/no investigation notes yet/i)).toBeInTheDocument());
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
