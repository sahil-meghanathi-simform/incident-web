import { z } from 'zod';
import { IncidentTypeSchema, SeveritySchema, StageSchema } from '../../../api/contracts/enums';

/** URL search params are always strings — this parses and coerces them, dropping
 * malformed params rather than crashing the route (used via useSearchParamsState). */
function csv<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((v) => {
    if (typeof v !== 'string' || v === '') return undefined;
    return v.split(',');
  }, z.array(schema).optional());
}

function boolParam() {
  return z.preprocess((v) => (v === 'true' ? true : v === 'false' ? false : undefined), z.boolean().optional());
}

export const incidentFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  severity: csv(SeveritySchema),
  stage: csv(StageSchema),
  type: csv(IncidentTypeSchema),
  assignedToMe: boolParam(),
  reportedByMe: boolParam(),
  unacknowledged: boolParam(),
  escalatedOnly: boolParam(),
  from: z.string().optional(),
  to: z.string().optional(),
  q: z.string().optional(),
  sort: z.enum(['createdAt', 'severity', 'updatedAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});
export type IncidentFilters = z.infer<typeof incidentFiltersSchema>;
