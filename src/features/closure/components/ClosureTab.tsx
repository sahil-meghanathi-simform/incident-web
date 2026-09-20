// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Hourglass } from 'lucide-react';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ClosureProposalForm } from './ClosureProposalForm';
import { ClosureReviewPanel } from './ClosureReviewPanel';
import { ClosureSummaryCard } from './ClosureSummaryCard';
import { LABELS } from '../../../lib/labels';
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
  return (
    <div className="py-4">
      <EmptyState size="sm" icon={Hourglass} title={LABELS.closure.idleTitle} body={LABELS.closure.idleBody} />
    </div>
  );
}
