import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuditTable } from '../../../../src/features/admin/components/AuditTable';
import type { AuditRow } from '../../../../src/api/contracts/audit.contract';

function row(overrides: Partial<AuditRow> = {}): AuditRow {
  return {
    id: 'evt-1',
    type: 'STAGE_CHANGED',
    occurredAt: new Date('2026-03-01T10:00:00.000Z').toISOString(),
    actor: { id: 'u1', displayName: 'A Manager' },
    incidentId: 'inc-1',
    incidentReference: 'INC-2026-000001',
    fromValue: 'REPORTED',
    toValue: 'TRIAGE',
    reason: null,
    payload: null,
    ...overrides,
  };
}

describe('AuditTable', () => {
  it('links a row with an incident to that incident\'s detail page by reference', () => {
    render(
      <MemoryRouter>
        <AuditTable items={[row()]} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'INC-2026-000001' })).toHaveAttribute('href', '/incidents/inc-1');
  });

  it('renders an em dash, not a link, for a row with no incident (e.g. a future USER_ROLE_CHANGED)', () => {
    render(
      <MemoryRouter>
        <AuditTable items={[row({ incidentId: null, incidentReference: null, type: 'USER_ROLE_CHANGED', fromValue: 'REPORTER', toValue: 'ADMIN' })]} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it('renders the from/to pair and an em dash for a row with neither', () => {
    render(
      <MemoryRouter>
        <AuditTable items={[row(), row({ id: 'evt-2', fromValue: null, toValue: null, type: 'INCIDENT_ACKNOWLEDGED' })]} />
      </MemoryRouter>,
    );
    expect(screen.getByText('REPORTED → TRIAGE')).toBeInTheDocument();
  });
});
