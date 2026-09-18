import type { ReactNode } from 'react';
import { SeverityBadge } from '../../components/ui/SeverityBadge';
import { StageBadge } from '../../components/ui/StageBadge';
import { LABELS } from '../../lib/labels';
import type { TimelineEvent } from './types/timeline.type';

function actorName(event: TimelineEvent): string {
  return event.actor?.displayName ?? 'The system';
}

/**
 * One small sentence-builder per event type (build-plan.md's per-type renderer
 * requirement), consolidated into one exhaustive switch rather than one file per type
 * — same guarantee (a new AuditEventType that reaches this union without a case here
 * fails the BUILD via the `never` check below, not just a runtime fallback), fewer
 * files for a set this small. `IncidentTimeline.tsx` renders the redacted NOTE_ADDED
 * case separately (a muted row, not a sentence) — see LABELS.timeline.redactedNote.
 */
export function describeTimelineEvent(event: TimelineEvent): ReactNode {
  switch (event.type) {
    case 'INCIDENT_CREATED':
      return (
        <>
          {actorName(event)} reported this incident at <SeverityBadge severity={event.severity} />
        </>
      );
    case 'STAGE_CHANGED':
      return (
        <>
          {actorName(event)} moved this incident from <StageBadge stage={event.from} /> to{' '}
          <StageBadge stage={event.to} />
          {event.reason ? ` — ${event.reason}` : null}
        </>
      );
    case 'SEVERITY_CHANGED':
      return (
        <>
          {actorName(event)} changed severity from <SeverityBadge severity={event.from} /> to{' '}
          <SeverityBadge severity={event.to} />
          {event.reason ? ` — ${event.reason}` : null}
        </>
      );
    case 'INVESTIGATOR_ASSIGNED':
      return (
        <>
          {actorName(event)} assigned {event.investigator?.displayName ?? 'an investigator'}
        </>
      );
    case 'INVESTIGATOR_UNASSIGNED':
      return (
        <>
          {actorName(event)} unassigned {event.investigator?.displayName ?? 'the investigator'}
          {event.reason === 'CLEARANCE_BELOW_NEW_SEVERITY' && ' — their clearance no longer covers this severity'}
          {event.reason === 'REASSIGNED' && ' — reassigned to someone else'}
        </>
      );
    case 'INCIDENT_ACKNOWLEDGED':
      return <>{actorName(event)} acknowledged this incident</>;
    case 'NOTE_ADDED':
      return <>{actorName(event)} added an investigation note ({event.length} characters)</>;
    case 'CLOSURE_PROPOSED':
      return <>{actorName(event)} proposed closure with a root cause and corrective action</>;
    case 'CLOSURE_APPROVED':
      return <>{actorName(event)} approved closure — this incident is now closed</>;
    case 'CLOSURE_REJECTED':
      return (
        <>
          {actorName(event)} requested changes{event.reason ? ` — ${event.reason}` : null}
        </>
      );
    case 'INCIDENT_ESCALATED':
      return <>{LABELS.escalations.dueLabel(event.toLevel)} escalation triggered automatically</>;
    case 'ACCESS_DENIED':
      return (
        <>
          {actorName(event)} was denied access to this incident{event.reason ? ` (${event.reason})` : null}
        </>
      );
    default: {
      const _exhaustive: never = event;
      throw new Error(`unhandled timeline event type: ${JSON.stringify(_exhaustive)}`);
    }
  }
}
