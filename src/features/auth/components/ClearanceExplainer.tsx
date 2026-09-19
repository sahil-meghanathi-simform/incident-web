import type { ReactElement } from 'react';

/**
 * States "new accounts start at clearance 1" up front on the register screen — defuses
 * the Q7+Q9 interaction (a brand-new reporter's own CRITICAL report can 403 them) before
 * it ever surprises anyone.
 */
export function ClearanceExplainer(): ReactElement {
  return (
    <p className="rounded-md border border-border bg-accent px-3 py-2 text-xs text-accent-foreground">
      New accounts start at clearance 1. If you report a high-severity incident, you may
      not be able to view it afterwards — an investigator or manager can still act on it.
    </p>
  );
}
