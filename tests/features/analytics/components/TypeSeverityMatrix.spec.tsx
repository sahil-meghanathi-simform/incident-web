import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TypeSeverityMatrix } from '../../../../src/features/analytics/components/TypeSeverityMatrix';
import type { TypeSeverityMatrixResponse } from '../../../../src/api/contracts/analytics.contract';

function matrix(overrides: Partial<TypeSeverityMatrixResponse> = {}): TypeSeverityMatrixResponse {
  return {
    period: { from: '2026-03-01', to: '2026-03-31' },
    severities: ['LOW', 'MEDIUM'],
    cells: [
      { type: 'SAFETY', severity: 'LOW', count: 3 },
      { type: 'SAFETY', severity: 'MEDIUM', count: 0 },
      { type: 'SECURITY', severity: 'LOW', count: 0 },
      { type: 'SECURITY', severity: 'MEDIUM', count: 0 },
    ],
    rowTotals: [
      { type: 'SAFETY', count: 3 },
      { type: 'SECURITY', count: 0 },
    ],
    columnTotals: [
      { severity: 'LOW', count: 3 },
      { severity: 'MEDIUM', count: 0 },
    ],
    grandTotal: 3,
    ...overrides,
  };
}

describe('TypeSeverityMatrix', () => {
  it('renders a zero-filled cell as plain text, never a link', () => {
    render(
      <MemoryRouter>
        <TypeSeverityMatrix data={matrix()} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: /Security incidents at Low severity/ })).not.toBeInTheDocument();
  });

  it('clicking a non-zero cell navigates to the incident list filtered by its type/severity/period', async () => {
    render(
      <MemoryRouter initialEntries={['/analytics']}>
        <Routes>
          <Route path="/analytics" element={<TypeSeverityMatrix data={matrix()} />} />
          <Route path="/incidents" element={<div>incident list page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /3 Safety incidents at Low severity/ }));
    expect(await screen.findByText('incident list page')).toBeInTheDocument();
  });

  it('shows row and column totals', () => {
    render(
      <MemoryRouter>
        <TypeSeverityMatrix data={matrix()} />
      </MemoryRouter>,
    );
    expect(screen.getAllByText('3')).toHaveLength(4); // the cell, its row total, its column total, and the grand total
  });
});
