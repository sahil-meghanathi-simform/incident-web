import { z } from 'zod';
import { AuditEventTypeSchema } from '../../../api/contracts/enums';

/** Mirrors incidentFilters.schema.ts's csv() helper — URL search params are always
 * strings, so this parses and coerces them, dropping malformed values rather than
 * crashing the route (used via useSearchParamsState). */
function csv<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((v) => {
    if (typeof v !== 'string' || v === '') return undefined;
    return v.split(',');
  }, z.array(schema).optional());
}

export const auditSearchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  type: csv(AuditEventTypeSchema),
  actorId: z.string().optional(),
  incidentId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});
export type AuditSearchFilters = z.infer<typeof auditSearchSchema>;
