// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '../../../components/ui/Alert';
import { LABELS } from '../../../lib/labels';

/** Sits above the composer (§10.2) — a standing reminder of who else can read this.
 * A static notice, so role="note" rather than Alert's default live "alert". */
export function NotesConfidentialityBanner(): ReactElement {
  return (
    <Alert variant="info" role="note" className="flex items-start gap-2.5 py-2.5">
      <EyeOff aria-hidden="true" />
      <AlertDescription className="text-xs">{LABELS.investigation.confidentialityBanner}</AlertDescription>
    </Alert>
  );
}
