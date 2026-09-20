// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription } from '../../../components/ui/Alert';
import { LABELS } from '../../../lib/labels';

/**
 * States "new accounts start at clearance 1" up front on the register screen — defuses
 * the Q7+Q9 interaction (a brand-new reporter's own CRITICAL report can 403 them) before
 * it ever surprises anyone.
 */
export function ClearanceExplainer(): ReactElement {
  return (
    // role="note" overrides Alert's default role="alert": this is static guidance, and
    // an alert would be announced assertively the moment the page loads.
    <Alert role="note" className="flex items-start gap-2 border-border bg-accent text-accent-foreground">
      <ShieldAlert className="mt-0.5 shrink-0" aria-hidden="true" />
      <AlertDescription className="text-xs leading-relaxed">{LABELS.auth.clearanceNotice}</AlertDescription>
    </Alert>
  );
}
