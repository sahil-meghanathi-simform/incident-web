import type { CreateIncidentRequest } from '../../../api/contracts/incident.contract';

export type {
  CreateIncidentRequest as CreateIncidentInput,
  IncidentReceipt,
  IncidentTypeOption,
  SeverityOption,
  IncidentTypesResponse,
  IncidentListItem,
  IncidentListResponse,
  IncidentDetail,
  IncidentActions,
  IncidentSummary,
} from '../../../api/contracts/incident.contract';

export type { IncidentFilters } from '../schemas/incidentFilters.schema';

/** The image travels as a separate multipart field, never inside the JSON body
 * (incidents.api.ts) — so the mutation takes it as a sibling, not a body property. */
export type CreateIncidentVariables = Readonly<{
  body: CreateIncidentRequest;
  image: File | null;
}>;
