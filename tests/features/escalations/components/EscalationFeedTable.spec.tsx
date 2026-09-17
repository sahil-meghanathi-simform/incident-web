import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EscalationFeedTable } from '../../../../src/features/escalations/components/EscalationFeedTable';
import { AuthContext } from '../../../../src/app/AuthProvider';
import { ToastProvider } from '../../../../src/components/ui/ToastProvider';
import type { EscalationFeedItem } from '../../../../src/features/escalations/types/escalation.type';

vi.mock('../../../../src/api/endpoints/triage.api', () => ({
  acknowledgeIncident: vi.fn(),
}));

const AUTH_USER = { id: 'mgr-1', email: 'mgr@test.local', displayName: 'Manager', role: 'TRIAGE_MANAGER' as const, clearanceLevel: 4 };

function item(overrides: Partial<EscalationFeedItem> = {}): EscalationFeedItem {
  return {
    incidentId: 'inc-1',
    incidentReference: 'INC-2026-000001',
    incidentTitle: 'A slip hazard',
    severity: 'HIGH',
    level: 2,
    cycle: 1,
    dueAt: new Date(Date.now() + 5 * 60_000).toISOString(),
    triggeredAt: new Date().toISOString(),
    assignedInvestigator: null,
    version: 3,
    ...overrides,
  };
}

function renderTable(items: EscalationFeedItem[]) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ status: 'authenticated', user: AUTH_USER, refetch: vi.fn() }}>
        <ToastProvider>
          <MemoryRouter>
            <EscalationFeedTable items={items} />
          </MemoryRouter>
        </ToastProvider>
      </AuthContext.Provider>
    </QueryClientProvider>,
  );
}

describe('EscalationFeedTable', () => {
  it('links each row to its detail page by reference and shows the escalation level', () => {
    renderTable([item()]);
    expect(screen.getByRole('link', { name: 'INC-2026-000001' })).toHaveAttribute('href', '/incidents/inc-1');
    expect(screen.getByText(/Escalated · L2/)).toBeInTheDocument();
  });

  it('shows an em dash for an unassigned incident and the investigator name when assigned', () => {
    renderTable([item({ assignedInvestigator: { id: 'u1', displayName: 'Priya Shah' } })]);
    expect(screen.getByText('Priya Shah')).toBeInTheDocument();
  });

  it('offers an Acknowledge action per row', () => {
    renderTable([item()]);
    expect(screen.getByRole('button', { name: /Acknowledge/i })).toBeInTheDocument();
  });
});
