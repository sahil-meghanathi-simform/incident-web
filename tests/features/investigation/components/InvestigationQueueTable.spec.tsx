import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { InvestigationQueueTable } from '../../../../src/features/investigation/components/InvestigationQueueTable';
import type { IncidentListItem } from '../../../../src/features/incidents/types/incident.type';

function item(overrides: Partial<IncidentListItem> = {}): IncidentListItem {
  return {
    id: 'inc-1',
    reference: 'INC-2026-000001',
    type: 'SAFETY',
    severity: 'HIGH',
    stage: 'INVESTIGATION',
    title: 'A slip hazard',
    assignedInvestigator: { id: 'me-1', displayName: 'Me' },
    acknowledgedAt: null,
    currentEscalationLevel: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('InvestigationQueueTable', () => {
  it('links each row to its detail page by reference', () => {
    render(
      <MemoryRouter>
        <InvestigationQueueTable items={[item()]} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'INC-2026-000001' })).toHaveAttribute('href', '/incidents/inc-1');
  });

  it('has no assignee column — every row is already assigned to the viewer', () => {
    render(
      <MemoryRouter>
        <InvestigationQueueTable items={[item()]} />
      </MemoryRouter>,
    );
    expect(screen.queryByText('Assignee')).not.toBeInTheDocument();
  });
});
