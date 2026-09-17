import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClosureTab } from '../../../../src/features/closure/components/ClosureTab';
import { ToastContext } from '../../../../src/components/ui/ToastContext';
import type { IncidentDetail } from '../../../../src/features/incidents/types/incident.type';

vi.mock('../../../../src/api/endpoints/closure.api', () => ({
  proposeClosure: vi.fn(),
  approveClosure: vi.fn(),
  rejectClosure: vi.fn(),
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
      canProposeClosure: false,
      canApproveClosure: false,
    },
    ...overrides,
  };
}

function renderTab(inc: IncidentDetail) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastContext.Provider value={{ show: vi.fn() }}>
        <ClosureTab incident={inc} />
      </ToastContext.Provider>
    </QueryClientProvider>,
  );
}

describe('ClosureTab', () => {
  it('shows the proposal form to the assignee while INVESTIGATION and canProposeClosure is true', () => {
    renderTab(incident({ stage: 'INVESTIGATION', _actions: { ...incident()._actions, canProposeClosure: true } }));
    expect(screen.getByLabelText(/root cause/i)).toBeInTheDocument();
  });

  it('shows an idle message during INVESTIGATION when the viewer cannot propose', () => {
    renderTab(incident({ stage: 'INVESTIGATION' }));
    expect(screen.getByText(/no closure has been proposed/i)).toBeInTheDocument();
  });

  it('shows the read-only review panel while PENDING_CLOSURE', () => {
    renderTab(
      incident({
        stage: 'PENDING_CLOSURE',
        rootCause: 'A root cause long enough to pass review.',
        correctiveAction: 'A corrective action long enough to pass review.',
      }),
    );
    expect(screen.getByText(/closure review/i)).toBeInTheDocument();
    expect(screen.getByText(/A root cause long enough to pass review\./)).toBeInTheDocument();
  });

  it('shows the permanent summary once CLOSED', () => {
    renderTab(
      incident({
        stage: 'CLOSED',
        rootCause: 'A root cause long enough to pass review.',
        correctiveAction: 'A corrective action long enough to pass review.',
        closure: { closedAt: new Date().toISOString(), closedBy: { id: 'manager-1', displayName: 'A Manager' } },
      }),
    );
    expect(screen.getByText(/A root cause long enough to pass review\./)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /approve/i })).not.toBeInTheDocument();
  });
});
