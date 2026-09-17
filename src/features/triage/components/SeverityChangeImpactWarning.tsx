import type { ReactElement } from 'react';
import type { SeverityImpact } from '../hooks/useSeverityImpact';

/** Warns BEFORE submit (Q17) — mirrors the server's own auto-unassign cascade so the
 * manager isn't surprised by it after the fact. */
export function SeverityChangeImpactWarning({ impact }: { impact: SeverityImpact }): ReactElement | null {
  if (!impact.willUnassign || !impact.assigneeName) return null;

  return (
    <p role="alert" className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
      <strong>{impact.assigneeName}</strong> will be unassigned and this incident will return to Triage — their
      clearance doesn&rsquo;t cover this severity.
    </p>
  );
}
