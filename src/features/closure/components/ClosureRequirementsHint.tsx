import type { ReactElement } from 'react';
import { LABELS } from '../../../lib/labels';

/** Explains the 20-character minimum before a submit ever produces a 422 (build-plan.md
 * §Module 6) — the form disables submit until both fields validate, but this is
 * documentation for the human, not the enforcement; the server's own gates are that. */
export function ClosureRequirementsHint(): ReactElement {
  return <p className="text-xs text-slate-500">{LABELS.closure.requirementsHint}</p>;
}
