import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SeveritySelect } from '../../../../src/features/incidents/components/SeveritySelect';

const OPTIONS = [
  { value: 'LOW' as const, label: 'Low' },
  { value: 'MEDIUM' as const, label: 'Medium' },
  { value: 'HIGH' as const, label: 'High' },
  { value: 'CRITICAL' as const, label: 'Critical' },
];

describe('SeveritySelect', () => {
  it('warns only on options above the given clearance (Q7+Q9 defused before submit)', () => {
    render(
      <SeveritySelect options={OPTIONS} value="LOW" onChange={() => {}} userClearance={1} />,
    );

    const warnings = screen.getAllByText(/you may not be able to view this report/i);
    // Clearance 1 can only see LOW — the other three options warn.
    expect(warnings).toHaveLength(3);
  });

  it('shows no warnings for a clearance-4 user', () => {
    render(
      <SeveritySelect options={OPTIONS} value="LOW" onChange={() => {}} userClearance={4} />,
    );

    expect(screen.queryByText(/you may not be able to view this report/i)).not.toBeInTheDocument();
  });

  it('calls onChange with the selected severity', () => {
    const onChange = vi.fn();
    render(<SeveritySelect options={OPTIONS} value="LOW" onChange={onChange} userClearance={4} />);

    fireEvent.click(screen.getByRole('radio', { name: /critical/i }));

    expect(onChange).toHaveBeenCalledWith('CRITICAL');
  });
});
