import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChangeSeverityModal } from '../../../../src/features/triage/components/ChangeSeverityModal';
import { ToastContext } from '../../../../src/components/ui/ToastContext';
import { ApiError } from '../../../../src/api/ApiError';
import type { IncidentDetail } from '../../../../src/features/incidents/types/incident.type';

const { changeSeverityMock } = vi.hoisted(() => ({ changeSeverityMock: vi.fn() }));

vi.mock('../../../../src/api/endpoints/triage.api', () => ({
  changeSeverity: changeSeverityMock,
}));

vi.mock('../../../../src/api/endpoints/users.api', () => ({
  getAssignableInvestigators: vi.fn().mockResolvedValue([]),
}));

function incident(overrides: Partial<IncidentDetail> = {}): IncidentDetail {
  return {
    id: 'inc-1',
    reference: 'INC-2026-000001',
    type: 'SAFETY',
    severity: 'HIGH',
    stage: 'REPORTED',
    title: 'A slip hazard',
    description: 'Long enough description for validation purposes.',
    reporter: { id: 'reporter-1', displayName: 'A Reporter' },
    assignedInvestigator: null,
    rootCause: null,
    correctiveAction: null,
    version: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _actions: {
      canTriage: false,
      canAssign: true,
      canAcknowledge: false,
      canReadNotes: false,
      canAddNote: false,
      canProposeClosure: false,
      canApproveClosure: false,
    },
    ...overrides,
  };
}

function renderModal(onClose: () => void, show: (message: string, variant?: string) => void) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastContext.Provider value={{ show }}>
        <ChangeSeverityModal incident={incident()} isOpen onClose={onClose} />
      </ToastContext.Provider>
    </QueryClientProvider>,
  );
}

async function submitCriticalChange() {
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'CRITICAL' } });
  fireEvent.change(screen.getByRole('textbox', { name: /reason/i }), {
    target: { value: 'Raising after a closer look at the reported conditions.' },
  });
  fireEvent.click(screen.getByRole('button', { name: /^change severity$/i }));
}

describe('ChangeSeverityModal — the self-inflicted-raise 403 (Q10)', () => {
  it('confirms success (not an error) when the write commits but the read-back is denied to the acting user', async () => {
    changeSeverityMock.mockRejectedValueOnce(
      new ApiError({
        code: 'INSUFFICIENT_CLEARANCE',
        status: 403,
        message: 'You do not have sufficient clearance to view this incident.',
        requestId: 'req-1',
      }),
    );
    const onClose = vi.fn();
    const show = vi.fn();
    renderModal(onClose, show);

    await submitCriticalChange();

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(show).toHaveBeenCalledWith(expect.stringMatching(/severity updated/i), 'success');
    expect(show).not.toHaveBeenCalledWith(expect.anything(), 'error');
  });

  it('shows a plain success toast on an ordinary (non-self-inflicted) change', async () => {
    changeSeverityMock.mockResolvedValueOnce(incident({ severity: 'CRITICAL', version: 1 }));
    const onClose = vi.fn();
    const show = vi.fn();
    renderModal(onClose, show);

    await submitCriticalChange();

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(show).toHaveBeenCalledWith(expect.stringMatching(/severity updated/i), 'success');
  });

  it('shows a real error toast for a genuine failure unrelated to clearance', async () => {
    changeSeverityMock.mockRejectedValueOnce(
      new ApiError({ code: 'INTERNAL', status: 500, message: 'Something went wrong.', requestId: 'req-2' }),
    );
    const onClose = vi.fn();
    const show = vi.fn();
    renderModal(onClose, show);

    await submitCriticalChange();

    await waitFor(() => expect(show).toHaveBeenCalledWith(expect.anything(), 'error'));
    expect(onClose).not.toHaveBeenCalled();
  });
});
