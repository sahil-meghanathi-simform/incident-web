import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IncidentTable } from '../../../../src/features/incidents/components/IncidentTable';
import type { IncidentListItem } from '../../../../src/features/incidents/types/incident.type';

function item(overrides: Partial<IncidentListItem> = {}): IncidentListItem {
  return {
    id: 'inc-1',
    reference: 'INC-2026-000001',
    type: 'SAFETY',
    severity: 'HIGH',
    stage: 'TRIAGE',
    title: 'A slip hazard',
    assignedInvestigator: null,
    acknowledgedAt: null,
    currentEscalationLevel: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('IncidentTable', () => {
  it('links each row to its detail page by reference', () => {
    render(
      <MemoryRouter>
        <IncidentTable items={[item()]} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'INC-2026-000001' })).toHaveAttribute('href', '/incidents/inc-1');
  });

  it('shows an em dash for an unassigned row and the name for an assigned one', () => {
    render(
      <MemoryRouter>
        <IncidentTable
          items={[
            item({ id: 'a', reference: 'INC-A', assignedInvestigator: null }),
            item({ id: 'b', reference: 'INC-B', assignedInvestigator: { id: 'u1', displayName: 'Priya Shah' } }),
          ]}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('Priya Shah')).toBeInTheDocument();
  });

  it('renders an escalation badge only when the level is above zero', () => {
    render(
      <MemoryRouter>
        <IncidentTable items={[item({ currentEscalationLevel: 2 })]} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Escalated · L2/)).toBeInTheDocument();
  });
});
