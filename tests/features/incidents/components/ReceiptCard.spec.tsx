import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ReceiptCard } from '../../../../src/features/incidents/components/ReceiptCard';
import type { IncidentReceipt } from '../../../../src/features/incidents/types/incident.type';

function receipt(overrides: Partial<IncidentReceipt> = {}): IncidentReceipt {
  return {
    id: 'inc-1',
    reference: 'INC-2026-000123',
    createdAt: new Date().toISOString(),
    severity: 'LOW',
    visibleToYou: true,
    ...overrides,
  };
}

describe('ReceiptCard', () => {
  beforeEach(() => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });

  it('offers a "View incident" link when visibleToYou is true', () => {
    render(
      <MemoryRouter>
        <ReceiptCard receipt={receipt({ visibleToYou: true })} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /view incident/i })).toHaveAttribute('href', '/incidents/inc-1');
    expect(screen.queryByText(/you may not be able to view/i)).not.toBeInTheDocument();
  });

  it('shows the clearance notice with no dead link when visibleToYou is false (Q9)', () => {
    render(
      <MemoryRouter>
        <ReceiptCard receipt={receipt({ visibleToYou: false, severity: 'CRITICAL' })} />
      </MemoryRouter>,
    );

    expect(screen.queryByRole('link', { name: /view incident/i })).not.toBeInTheDocument();
    expect(screen.getByText(/you may not be able to view this report/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy reference/i })).toBeInTheDocument();
  });

  it('always shows the reference', () => {
    render(
      <MemoryRouter>
        <ReceiptCard receipt={receipt({ reference: 'INC-2026-000999' })} />
      </MemoryRouter>,
    );

    expect(screen.getByText('INC-2026-000999')).toBeInTheDocument();
  });
});
