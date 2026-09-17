import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IncidentActionBar } from '../../../../src/features/triage/components/IncidentActionBar';
import { AuthContext, type AuthContextValue } from '../../../../src/app/AuthProvider';
import { ToastContext } from '../../../../src/components/ui/ToastContext';
import type { IncidentDetail } from '../../../../src/features/incidents/types/incident.type';

const AUTH_VALUE: AuthContextValue = {
  user: { id: 'manager-1', email: 'm@b.com', displayName: 'Tia Triage', role: 'TRIAGE_MANAGER', clearanceLevel: 4 },
  status: 'authenticated',
  refetch: () => {},
};

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

function renderBar(inc: IncidentDetail) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastContext.Provider value={{ show: () => {} }}>
        <AuthContext.Provider value={AUTH_VALUE}>
          <MemoryRouter>
            <IncidentActionBar incident={inc} />
          </MemoryRouter>
        </AuthContext.Provider>
      </ToastContext.Provider>
    </QueryClientProvider>,
  );
}

describe('IncidentActionBar — driven entirely by _actions (a UI hint, never authority)', () => {
  it('renders nothing when every action is unavailable', () => {
    const { container } = renderBar(incident());
    expect(container).toBeEmptyDOMElement();
  });

  it('shows "Move to triage" only when canTriage is true', () => {
    renderBar(incident({ _actions: { ...incident()._actions, canTriage: true } }));
    expect(screen.getByRole('button', { name: /move to triage/i })).toBeInTheDocument();
  });

  it('shows Acknowledge only when canAcknowledge is true', () => {
    renderBar(incident({ _actions: { ...incident()._actions, canAcknowledge: true } }));
    expect(screen.getByRole('button', { name: /^acknowledge$/i })).toBeInTheDocument();
  });

  it('offers "Assign investigator" (not "Reassign") when nobody is assigned yet', () => {
    renderBar(incident({ _actions: { ...incident()._actions, canAssign: true }, assignedInvestigator: null }));
    expect(screen.getByRole('button', { name: /^assign investigator$/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /unassign/i })).not.toBeInTheDocument();
  });

  it('offers "Reassign investigator" and an Unassign button once someone is assigned', () => {
    renderBar(
      incident({
        _actions: { ...incident()._actions, canAssign: true },
        assignedInvestigator: { id: 'inv-1', displayName: 'Priya Shah' },
      }),
    );
    expect(screen.getByRole('button', { name: /reassign investigator/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^unassign$/i })).toBeInTheDocument();
  });

  it('shows "Change severity" whenever canAssign is true (its guard doubles as the proxy — see the component comment)', () => {
    renderBar(incident({ _actions: { ...incident()._actions, canAssign: true } }));
    expect(screen.getByRole('button', { name: /change severity/i })).toBeInTheDocument();
  });
});
