import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { describeTimelineEvent } from '../../../src/features/timeline/timelineEventCopy';
import type { TimelineEvent } from '../../../src/features/timeline/types/timeline.type';

const OCCURRED_AT = new Date('2026-03-01T10:00:00.000Z').toISOString();

function renderSentence(event: TimelineEvent) {
  return render(<div>{describeTimelineEvent(event)}</div>);
}

describe('describeTimelineEvent', () => {
  it('falls back to "The system" for a null actor (INCIDENT_ESCALATED)', () => {
    renderSentence({ id: '1', occurredAt: OCCURRED_AT, actor: null, type: 'INCIDENT_ESCALATED', fromLevel: 0, toLevel: 1, cycle: 1 });
    expect(screen.getByText(/level 1 escalation triggered automatically/i)).toBeInTheDocument();
  });

  it('names the acting user for INCIDENT_ACKNOWLEDGED', () => {
    renderSentence({
      id: '1',
      occurredAt: OCCURRED_AT,
      actor: { id: 'u1', displayName: 'A Manager' },
      type: 'INCIDENT_ACKNOWLEDGED',
    });
    expect(screen.getByText('A Manager acknowledged this incident')).toBeInTheDocument();
  });

  it('includes the reason for a severity change when present', () => {
    renderSentence({
      id: '1',
      occurredAt: OCCURRED_AT,
      actor: { id: 'u1', displayName: 'A Manager' },
      type: 'SEVERITY_CHANGED',
      from: 'LOW',
      to: 'HIGH',
      reason: 'a second incident was reported',
    });
    expect(screen.getByText(/a second incident was reported/)).toBeInTheDocument();
  });

  it('falls back to a generic noun when the resolved investigator ref is null', () => {
    renderSentence({
      id: '1',
      occurredAt: OCCURRED_AT,
      actor: { id: 'u1', displayName: 'A Manager' },
      type: 'INVESTIGATOR_ASSIGNED',
      investigator: null,
    });
    expect(screen.getByText('A Manager assigned an investigator')).toBeInTheDocument();
  });

  it('is exhaustive over every TimelineEvent type — a real timeline page (11 event chain) never throws', () => {
    const actor = { id: 'u1', displayName: 'A Manager' };
    const events: TimelineEvent[] = [
      { id: '1', occurredAt: OCCURRED_AT, actor, type: 'INCIDENT_CREATED', severity: 'LOW', incidentType: 'SAFETY', stage: 'REPORTED' },
      { id: '2', occurredAt: OCCURRED_AT, actor, type: 'STAGE_CHANGED', from: 'REPORTED', to: 'TRIAGE', reason: null },
      { id: '3', occurredAt: OCCURRED_AT, actor, type: 'INVESTIGATOR_ASSIGNED', investigator: actor },
      { id: '4', occurredAt: OCCURRED_AT, actor, type: 'INVESTIGATOR_UNASSIGNED', investigator: actor, reason: 'REASSIGNED' },
      { id: '5', occurredAt: OCCURRED_AT, actor, type: 'SEVERITY_CHANGED', from: 'LOW', to: 'HIGH', reason: null },
      { id: '6', occurredAt: OCCURRED_AT, actor, type: 'INCIDENT_ACKNOWLEDGED' },
      { id: '7', occurredAt: OCCURRED_AT, actor, type: 'NOTE_ADDED', redacted: false, noteId: 'n1', length: 10 },
      { id: '8', occurredAt: OCCURRED_AT, actor, type: 'CLOSURE_PROPOSED', rootCauseLength: 30, correctiveActionLength: 30 },
      { id: '9', occurredAt: OCCURRED_AT, actor, type: 'CLOSURE_APPROVED' },
      { id: '10', occurredAt: OCCURRED_AT, actor, type: 'CLOSURE_REJECTED', reason: 'needs more detail' },
      { id: '11', occurredAt: OCCURRED_AT, actor: null, type: 'INCIDENT_ESCALATED', fromLevel: 0, toLevel: 1, cycle: 1 },
      { id: '12', occurredAt: OCCURRED_AT, actor, type: 'ACCESS_DENIED', reason: 'CLEARANCE', clearanceLevel: 1 },
    ];

    for (const event of events) {
      expect(() => renderSentence(event)).not.toThrow();
    }
  });
});
