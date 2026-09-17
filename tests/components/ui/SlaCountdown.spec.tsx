import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SlaCountdown } from '../../../src/components/ui/SlaCountdown';

describe('SlaCountdown', () => {
  it('shows "Due in" for a future dueAt', () => {
    render(<SlaCountdown dueAt={new Date(Date.now() + 10 * 60_000).toISOString()} />);
    expect(screen.getByText(/Due in 10m/)).toBeInTheDocument();
  });

  it('shows "Overdue" for a past dueAt', () => {
    render(<SlaCountdown dueAt={new Date(Date.now() - 5 * 60_000).toISOString()} />);
    expect(screen.getByText(/Overdue 5m/)).toBeInTheDocument();
  });
});
