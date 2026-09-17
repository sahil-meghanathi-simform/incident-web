import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IncidentListEmpty } from '../../../../src/features/incidents/components/IncidentListEmpty';

describe('IncidentListEmpty — three distinct reasons a table can be empty', () => {
  it('no data at all', () => {
    render(<IncidentListEmpty hasAnyFilter={false} clearanceLimited={false} onClearFilters={vi.fn()} />);
    expect(screen.getByText('No incidents yet')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('filters match nothing — offers a clear-filters action', () => {
    const onClear = vi.fn();
    render(<IncidentListEmpty hasAnyFilter={true} clearanceLimited={false} onClearFilters={onClear} />);
    expect(screen.getByText('No incidents match these filters')).toBeInTheDocument();
    screen.getByRole('button', { name: /clear all filters/i }).click();
    expect(onClear).toHaveBeenCalled();
  });

  it('clearance hides everything — takes priority over the generic filter-mismatch copy', () => {
    render(<IncidentListEmpty hasAnyFilter={true} clearanceLimited={true} onClearFilters={vi.fn()} />);
    expect(screen.getByText('Your clearance hides everything here')).toBeInTheDocument();
    expect(screen.queryByText('No incidents match these filters')).not.toBeInTheDocument();
  });
});
