// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { LABELS } from '../../../lib/labels';
import type { AuditEventType } from '../../../api/contracts/enums';

type AuditEventBadgeProps = Readonly<{
  type: AuditEventType;
}>;

type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'primary';

// The word always carries the meaning; tone only groups related events at a glance.
const EVENT_TONE: Readonly<Record<AuditEventType, BadgeTone>> = {
  INCIDENT_CREATED: 'info',
  STAGE_CHANGED: 'neutral',
  SEVERITY_CHANGED: 'warning',
  INVESTIGATOR_ASSIGNED: 'neutral',
  INVESTIGATOR_UNASSIGNED: 'neutral',
  INCIDENT_ACKNOWLEDGED: 'neutral',
  NOTE_ADDED: 'neutral',
  CLOSURE_PROPOSED: 'info',
  CLOSURE_APPROVED: 'success',
  CLOSURE_REJECTED: 'danger',
  INCIDENT_ESCALATED: 'warning',
  ACCESS_DENIED: 'danger',
  USER_CLEARANCE_CHANGED: 'primary',
  USER_ROLE_CHANGED: 'primary',
};

export function AuditEventBadge({ type }: AuditEventBadgeProps): ReactElement {
  return <Badge tone={EVENT_TONE[type]}>{LABELS.admin.auditEventLabel(type)}</Badge>;
}
