import { SEVERITY_RANK, type Severity } from '../../../lib/severity';
import type { IncidentDetail } from '../../incidents/types/incident.type';
import type { AssignableInvestigator } from '../types/triage.type';

export type SeverityImpact = Readonly<{
  willUnassign: boolean;
  assigneeName: string | null;
  requiredClearance: number;
}>;

/**
 * Pure — computes the ChangeSeverityModal warning from already-cached data, mirroring
 * assignment.policy.ts::mustUnassignOnRaise so the warning appears BEFORE submit
 * (Q17), not just after the server's own cascade. `_actions`/this warning are UI hints
 * only; the server re-derives the same decision from its own fresh read regardless of
 * what this returns. The incident detail's `assignedInvestigator` carries no
 * clearanceLevel (redacted like every other field the mapper doesn't need to expose),
 * so the assignee's clearance is looked up from the full active-investigator roster
 * the caller already fetches for the assignment drawer.
 */
export function useSeverityImpact(
  incident: Pick<IncidentDetail, 'assignedInvestigator'>,
  nextSeverity: Severity,
  investigators: readonly AssignableInvestigator[] | undefined,
): SeverityImpact {
  const requiredClearance = SEVERITY_RANK[nextSeverity];
  const assignee = incident.assignedInvestigator;
  const assigneeRecord = assignee ? investigators?.find((inv) => inv.id === assignee.id) : undefined;
  const willUnassign = Boolean(assignee) && assigneeRecord !== undefined && assigneeRecord.clearanceLevel < requiredClearance;

  return {
    willUnassign,
    assigneeName: assignee?.displayName ?? null,
    requiredClearance,
  };
}
