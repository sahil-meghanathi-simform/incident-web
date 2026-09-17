import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TriageQueueTable } from '../../../../src/features/triage/components/TriageQueueTable';
import type { IncidentListItem } from '../../../../src/features/incidents/types/incident.type';

function item(overrides: Partial<IncidentListItem> = {}): IncidentListItem {
  return {
    id: 'inc-1',
    reference: 'INC-2026-000001',
    type: 'SAFETY',
    severity: 'HIGH',
    stage: 'REPORTED',
    title: 'A slip hazard',
    assignedInvestigator: null,
    acknowledgedAt: null,
    currentEscalationLevel: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('TriageQueueTable', () => {
  it('links each row to its detail page by reference', () => {
    render(
      <MemoryRouter>
        <TriageQueueTable items={[item()]} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'INC-2026-000001' })).toHaveAttribute('href', '/incidents/inc-1');
  });

  it('renders an escalation badge only when the level is above zero', () => {
    render(
      <MemoryRouter>
        <TriageQueueTable items={[item({ currentEscalationLevel: 3 })]} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Escalated · L3/)).toBeInTheDocument();
  });

  it('shows an em dash for an unassigned incident', () => {
    render(
      <MemoryRouter>
        <TriageQueueTable items={[item({ assignedInvestigator: null })]} />
      </MemoryRouter>,
    );
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
