// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '../../../components/ui/Alert';
import { LABELS } from '../../../lib/labels';

/** Explains the 20-character minimum before a submit ever produces a 422 (build-plan.md
 * §Module 6) — documentation for the human, not the enforcement; the server's own
 * gates are that. A static notice, so role="note" rather than a live alert. */
export function ClosureRequirementsHint(): ReactElement {
  return (
    <Alert variant="info" role="note" className="flex items-start gap-2.5 py-2.5">
      <Info aria-hidden="true" />
      <AlertDescription className="text-xs">{LABELS.closure.requirementsHint}</AlertDescription>
    </Alert>
  );
}
