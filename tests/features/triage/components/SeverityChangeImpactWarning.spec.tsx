import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SeverityChangeImpactWarning } from '../../../../src/features/triage/components/SeverityChangeImpactWarning';
import type { SeverityImpact } from '../../../../src/features/triage/hooks/useSeverityImpact';

describe('SeverityChangeImpactWarning', () => {
  it('renders nothing when the change does not strand the assignee', () => {
    const impact: SeverityImpact = { willUnassign: false, assigneeName: 'Priya Shah', requiredClearance: 3 };
    const { container } = render(<SeverityChangeImpactWarning impact={impact} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('names the assignee who will be unassigned', () => {
    const impact: SeverityImpact = { willUnassign: true, assigneeName: 'Priya Shah', requiredClearance: 4 };
    render(<SeverityChangeImpactWarning impact={impact} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Priya Shah');
    expect(screen.getByRole('alert')).toHaveTextContent(/return to Triage/i);
  });
});
