// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { CheckCircle2, Lock, XCircle, type LucideIcon } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Spinner } from '../../../components/ui/Spinner';
import { LABELS } from '../../../lib/labels';
import type { AdminJobRun } from '../../../api/contracts/admin.contract';

type JobOutcome = NonNullable<AdminJobRun['outcome']>;

type JobOutcomeBadgeProps = Readonly<{
  /** null while the run is still in progress. */
  outcome: AdminJobRun['outcome'];
}>;

const OUTCOME_STYLE: Readonly<Record<JobOutcome, { tone: 'success' | 'warning' | 'danger'; icon: LucideIcon }>> = {
  COMPLETED: { tone: 'success', icon: CheckCircle2 },
  SKIPPED_LOCKED: { tone: 'warning', icon: Lock },
  FAILED: { tone: 'danger', icon: XCircle },
};

/** Icon + word + tone, so an outcome reads the same in greyscale. */
export function JobOutcomeBadge({ outcome }: JobOutcomeBadgeProps): ReactElement {
  if (outcome === null) {
    return (
      <Badge tone="info">
        <Spinner size="sm" className="size-3 text-info" />
        {LABELS.admin.jobRunning}
      </Badge>
    );
  }
  const { tone, icon: Icon } = OUTCOME_STYLE[outcome];
  return (
    <Badge tone={tone}>
      <Icon className="size-3" aria-hidden="true" />
      {LABELS.admin.jobOutcomeLabel(outcome)}
    </Badge>
  );
}
