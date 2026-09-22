import { describe, it, expect } from 'vitest';
import { useNotesAccess } from '../../../../src/features/investigation/hooks/useNotesAccess';
import { ApiError } from '../../../../src/api/ApiError';
import type { IncidentDetail } from '../../../../src/features/incidents/types/incident.type';

function incident(canReadNotes: boolean): IncidentDetail {
  return {
    id: 'inc-1',
    reference: 'INC-2026-000001',
    type: 'SAFETY',
    severity: 'HIGH',
    stage: 'INVESTIGATION',
    title: 'A slip hazard',
    description: 'Long enough description for validation purposes.',
    imageUrl: null,
    noImageReason: 'No camera was available at the time.',
    reporter: { id: 'reporter-1', displayName: 'A Reporter' },
    assignedInvestigator: null,
    rootCause: null,
    closure: null,
    correctiveAction: null,
    version: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _actions: {
      canTriage: false,
      canAssign: false,
      canAcknowledge: false,
      canReadNotes,
      canAddNote: false,
      canProposeClosure: false,
      canApproveClosure: false,
    },
  };
}

describe('useNotesAccess', () => {
  it('reports "granted" when _actions.canReadNotes is true and there is no error', () => {
    expect(useNotesAccess(incident(true), undefined)).toBe('granted');
  });

  it('reports "not-assigned" when _actions.canReadNotes is false and there is no error', () => {
    expect(useNotesAccess(incident(false), undefined)).toBe('not-assigned');
  });

  it('a live NOT_ASSIGNED_INVESTIGATOR error wins even if _actions still says granted (stale cache)', () => {
    const error = new ApiError({ code: 'NOT_ASSIGNED_INVESTIGATOR', status: 403, message: 'x', requestId: 'r1' });
    expect(useNotesAccess(incident(true), error)).toBe('not-assigned');
  });

  it('a live INSUFFICIENT_CLEARANCE error reports "clearance" — a revocation race (Q10)', () => {
    const error = new ApiError({ code: 'INSUFFICIENT_CLEARANCE', status: 403, message: 'x', requestId: 'r2' });
    expect(useNotesAccess(incident(true), error)).toBe('clearance');
  });
});
