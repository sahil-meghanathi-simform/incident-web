// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { CheckCircle2, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { ClosureRcaSections } from './ClosureRcaSections';
import { LABELS } from '../../../lib/labels';
import type { IncidentDetail } from '../../incidents/types/incident.type';

type ClosureSummaryCardProps = Readonly<{
  incident: IncidentDetail;
}>;

/** The permanent, read-only closed-state record — CLOSED has no outgoing transitions
 * (stage.policy.ts), so nothing here ever needs an action button again. The "Closed on
 * … by …" banner itself renders once, in IncidentDetailHeader, visible on every tab. */
export function ClosureSummaryCard({ incident }: ClosureSummaryCardProps): ReactElement {
  return (
    <div className="py-4">
      <Card className="overflow-hidden border-success-border animate-in fade-in duration-300 motion-reduce:animate-none">
        <CardHeader className="border-b border-success-border bg-success-surface pb-4">
          <CardTitle className="text-success">
            <CheckCircle2 className="size-5" aria-hidden="true" />
            {LABELS.closure.summaryTitle}
          </CardTitle>
          <CardDescription className="flex items-center gap-1.5">
            <Lock className="size-3.5 shrink-0" aria-hidden="true" />
            {LABELS.closure.summaryDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <ClosureRcaSections incident={incident} />
        </CardContent>
      </Card>
    </div>
  );
}
