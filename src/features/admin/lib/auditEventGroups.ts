import type { AuditEventType } from '../../../api/contracts/enums';
import { LABELS } from '../../../lib/labels';

export type AuditEventGroup = Readonly<{
  key: 'lifecycle' | 'assignment' | 'closure' | 'access';
  label: string;
  types: readonly AuditEventType[];
}>;

/**
 * The fourteen event types, in the four families an auditor actually asks about —
 * "what happened to incidents", "who was put on them", "how did they close", "who got
 * in or was given access". The toolbar's one-click views and the filter panel's
 * sections both read this list, so a new event type only needs a home here.
 */
export const AUDIT_EVENT_GROUPS: readonly AuditEventGroup[] = [
  {
    key: 'lifecycle',
    label: LABELS.admin.auditGroups.lifecycle,
    types: ['INCIDENT_CREATED', 'STAGE_CHANGED', 'SEVERITY_CHANGED', 'INCIDENT_ACKNOWLEDGED', 'INCIDENT_ESCALATED'],
  },
  {
    key: 'assignment',
    label: LABELS.admin.auditGroups.assignment,
    types: ['INVESTIGATOR_ASSIGNED', 'INVESTIGATOR_UNASSIGNED', 'NOTE_ADDED'],
  },
  {
    key: 'closure',
    label: LABELS.admin.auditGroups.closure,
    types: ['CLOSURE_PROPOSED', 'CLOSURE_APPROVED', 'CLOSURE_REJECTED'],
  },
  {
    key: 'access',
    label: LABELS.admin.auditGroups.access,
    types: ['ACCESS_DENIED', 'USER_CLEARANCE_CHANGED', 'USER_ROLE_CHANGED'],
  },
];

/** The group whose types are exactly the selected ones (in any order), if any — what
 * lights up a one-click view, derived so a shared link lights it up too. */
export function matchingGroup(selected: readonly AuditEventType[] | undefined): AuditEventGroup | undefined {
  if (!selected?.length) return undefined;
  return AUDIT_EVENT_GROUPS.find(
    (group) => group.types.length === selected.length && group.types.every((type) => selected.includes(type)),
  );
}

/** Replaces one group's share of the selection, leaving the other groups' picks alone
 * — each group is its own toggle set in the panel. Order follows AUDIT_EVENT_GROUPS so
 * the URL is stable however the pills were clicked. */
export function withGroupSelection(
  selected: readonly AuditEventType[] | undefined,
  group: AuditEventGroup,
  groupSelection: readonly AuditEventType[],
): AuditEventType[] {
  const kept = (selected ?? []).filter((type) => !group.types.includes(type));
  const next = new Set<AuditEventType>([...kept, ...groupSelection]);
  return AUDIT_EVENT_GROUPS.flatMap((g) => g.types).filter((type) => next.has(type));
}
