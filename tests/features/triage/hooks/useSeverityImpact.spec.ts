import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSeverityImpact } from '../../../../src/features/triage/hooks/useSeverityImpact';
import type { AssignableInvestigator } from '../../../../src/features/triage/types/triage.type';

const INVESTIGATORS: AssignableInvestigator[] = [
  { id: 'u1', displayName: 'Priya Shah', clearanceLevel: 3 },
  { id: 'u2', displayName: 'Theo Triage', clearanceLevel: 4 },
];

describe('useSeverityImpact — mirrors assignment.policy.ts::mustUnassignOnRaise for the pre-submit warning', () => {
  it('no assignee at all never warns', () => {
    const { result } = renderHook(() => useSeverityImpact({ assignedInvestigator: null }, 'CRITICAL', INVESTIGATORS));
    expect(result.current.willUnassign).toBe(false);
    expect(result.current.assigneeName).toBeNull();
  });

  it('an assignee whose clearance covers the new severity is not flagged', () => {
    const { result } = renderHook(() =>
      useSeverityImpact({ assignedInvestigator: { id: 'u2', displayName: 'Theo Triage' } }, 'CRITICAL', INVESTIGATORS),
    );
    expect(result.current.willUnassign).toBe(false);
  });

  it('an assignee whose clearance falls below the new severity is flagged, by name', () => {
    const { result } = renderHook(() =>
      useSeverityImpact({ assignedInvestigator: { id: 'u1', displayName: 'Priya Shah' } }, 'CRITICAL', INVESTIGATORS),
    );
    expect(result.current.willUnassign).toBe(true);
    expect(result.current.assigneeName).toBe('Priya Shah');
    expect(result.current.requiredClearance).toBe(4);
  });

  it('an assignee not found in the roster (e.g. deactivated) is not flagged — unknown, not assumed', () => {
    const { result } = renderHook(() =>
      useSeverityImpact({ assignedInvestigator: { id: 'gone', displayName: 'Former Investigator' } }, 'CRITICAL', INVESTIGATORS),
    );
    expect(result.current.willUnassign).toBe(false);
  });

  it('an undefined roster (still loading) never warns rather than guessing', () => {
    const { result } = renderHook(() =>
      useSeverityImpact({ assignedInvestigator: { id: 'u1', displayName: 'Priya Shah' } }, 'CRITICAL', undefined),
    );
    expect(result.current.willUnassign).toBe(false);
  });
});
