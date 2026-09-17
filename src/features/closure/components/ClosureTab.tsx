import type { ReactElement } from 'react';
import { ClosureProposalForm } from './ClosureProposalForm';
import { ClosureReviewPanel } from './ClosureReviewPanel';
import { ClosureSummaryCard } from './ClosureSummaryCard';
import type { IncidentDetail } from '../../incidents/types/incident.type';

type ClosureTabProps = Readonly<{
  incident: IncidentDetail;
}>;

/**
 * The tab's whole body, switched purely on stage — the tab itself is only ever shown
 * to the population that can see it in the first place (IncidentDetailPage's
 * `tabsFor`), so no further gating happens here beyond which stage-appropriate view to
 * render. `_actions.canProposeClosure`/`canApproveClosure` still gate the actual
 * mutating buttons inside each child.
 */
export function ClosureTab({ incident }: ClosureTabProps): ReactElement {
  if (incident.stage === 'PENDING_CLOSURE') return <ClosureReviewPanel incident={incident} />;
  if (incident.stage === 'CLOSED') return <ClosureSummaryCard incident={incident} />;
  if (incident._actions.canProposeClosure) return <ClosureProposalForm incident={incident} />;
  return <p className="py-6 text-sm text-slate-500">No closure has been proposed for this incident yet.</p>;
}
