import { ChangeSeverityRequestSchema } from '../../../api/contracts/triage.contract';
import type { Severity } from '../../../lib/severity';

/**
 * A refinement on top of the vendored contract schema (never redefined — see
 * incident.schema.ts's own comment) that forbids a no-op selection client-side, before
 * the server's own 409 SEVERITY_UNCHANGED round trip.
 */
export function changeSeveritySchema(currentSeverity: Severity) {
  return ChangeSeverityRequestSchema.refine((values) => values.severity !== currentSeverity, {
    path: ['severity'],
    message: 'Choose a different severity — this incident is already at this level.',
  });
}

export { AssignInvestigatorRequestSchema as assignInvestigatorSchema } from '../../../api/contracts/triage.contract';
