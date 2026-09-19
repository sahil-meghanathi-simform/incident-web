import type { ReactElement } from 'react';
import { LABELS } from '../../../lib/labels';

/** Sits above the composer (§10.2) — a standing reminder of who else can read this. */
export function NotesConfidentialityBanner(): ReactElement {
  return (
    <p className="rounded-md border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
      {LABELS.investigation.confidentialityBanner}
    </p>
  );
}
