import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClosureProposalForm } from '../../../../src/features/closure/components/ClosureProposalForm';
import { ToastContext } from '../../../../src/components/ui/ToastContext';
import type { IncidentDetail } from '../../../../src/features/incidents/types/incident.type';

const { proposeClosureMock } = vi.hoisted(() => ({ proposeClosureMock: vi.fn() }));

vi.mock('../../../../src/api/endpoints/closure.api', () => ({
  proposeClosure: proposeClosureMock,
}));

function incident(overrides: Partial<IncidentDetail> = {}): IncidentDetail {
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
    assignedInvestigator: { id: 'investigator-1', displayName: 'An Investigator' },
    rootCause: null,
    correctiveAction: null,
    closure: null,
    version: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _actions: {
      canTriage: false,
      canAssign: false,
      canAcknowledge: false,
      canReadNotes: false,
      canAddNote: false,
      canProposeClosure: true,
      canApproveClosure: false,
    },
    ...overrides,
  };
}

function renderForm() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastContext.Provider value={{ show: vi.fn() }}>
        <ClosureProposalForm incident={incident()} />
      </ToastContext.Provider>
    </QueryClientProvider>,
  );
}

describe('ClosureProposalForm', () => {
  it('rejects a too-short rootCause/correctiveAction client-side and never calls the mutation', async () => {
    renderForm();

    fireEvent.change(screen.getByLabelText(/root cause/i), { target: { value: 'too short' } });
    fireEvent.change(screen.getByLabelText(/corrective action/i), { target: { value: 'also short' } });
    fireEvent.click(screen.getByRole('button', { name: /propose closure/i }));

    await waitFor(() => expect(screen.getAllByText(/at least 20 character/i).length).toBeGreaterThan(0));
    expect(proposeClosureMock).not.toHaveBeenCalled();
  });

  it('opens a confirm dialog before actually submitting a well-formed proposal', async () => {
    renderForm();

    fireEvent.change(screen.getByLabelText(/root cause/i), { target: { value: 'A'.repeat(25) } });
    fireEvent.change(screen.getByLabelText(/corrective action/i), { target: { value: 'B'.repeat(25) } });
    fireEvent.click(screen.getByRole('button', { name: /propose closure/i }));

    await waitFor(() => expect(screen.getByText(/propose closure\?/i)).toBeInTheDocument());
    expect(proposeClosureMock).not.toHaveBeenCalled();
  });
});
