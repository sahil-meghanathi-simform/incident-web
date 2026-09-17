import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PendingClosuresTable } from '../../../../src/features/closure/components/PendingClosuresTable';
import type { IncidentListItem } from '../../../../src/features/incidents/types/incident.type';

function item(overrides: Partial<IncidentListItem> = {}): IncidentListItem {
  return {
    id: 'inc-1',
    reference: 'INC-2026-000001',
    type: 'SAFETY',
    severity: 'HIGH',
    stage: 'PENDING_CLOSURE',
    title: 'A slip hazard',
    assignedInvestigator: { id: 'user-1', displayName: 'An Investigator' },
    acknowledgedAt: null,
    currentEscalationLevel: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('PendingClosuresTable', () => {
  it('links each row to the closure tab of its detail page', () => {
    render(
      <MemoryRouter>
        <PendingClosuresTable items={[item()]} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'INC-2026-000001' })).toHaveAttribute(
      'href',
      '/incidents/inc-1?tab=closure',
    );
  });

  it('shows an em dash for an unassigned incident', () => {
    render(
      <MemoryRouter>
        <PendingClosuresTable items={[item({ assignedInvestigator: null })]} />
      </MemoryRouter>,
    );
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
