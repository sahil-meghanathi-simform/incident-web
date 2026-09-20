// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/Alert';
import { LABELS } from '../../../lib/labels';
import type { SeverityImpact } from '../hooks/useSeverityImpact';

type SeverityChangeImpactWarningProps = Readonly<{
  impact: SeverityImpact;
}>;

/** Warns BEFORE submit (Q17) — mirrors the server's own auto-unassign cascade so the
 * manager isn't surprised by it after the fact. */
export function SeverityChangeImpactWarning({ impact }: SeverityChangeImpactWarningProps): ReactElement | null {
  if (!impact.willUnassign || !impact.assigneeName) return null;

  return (
    <Alert
      variant="warning"
      className="flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200 motion-reduce:animate-none"
    >
      <TriangleAlert aria-hidden="true" />
      <div className="min-w-0">
        <AlertTitle>{LABELS.triage.impactWarningTitle}</AlertTitle>
        <AlertDescription>
          <strong>{impact.assigneeName}</strong>
          {LABELS.triage.impactWarningBody}
        </AlertDescription>
      </div>
    </Alert>
  );
}
