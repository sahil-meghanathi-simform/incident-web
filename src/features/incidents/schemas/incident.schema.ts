// Re-exported from the vendored contract rather than redefined — the report form
// validates against exactly what the backend's .strict() schema accepts.
export { CreateIncidentRequestSchema as createIncidentSchema } from '../../../api/contracts/incident.contract';
export type { CreateIncidentRequest } from '../../../api/contracts/incident.contract';
