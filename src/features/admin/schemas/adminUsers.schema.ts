import { z } from 'zod';
import { RoleSchema } from '../../../api/contracts/enums';

/** Mirrors incidentFilters.schema.ts's csv()/boolParam() helpers — URL search params
 * are always strings, so these parse and coerce them, dropping malformed values
 * rather than crashing the route (used via useSearchParamsState). */
function csv<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((v) => {
    if (typeof v !== 'string' || v === '') return undefined;
    return v.split(',');
  }, z.array(schema).optional());
}

function boolParam() {
  return z.preprocess((v) => (v === 'true' ? true : v === 'false' ? false : undefined), z.boolean().optional());
}

export const adminUsersFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  role: csv(RoleSchema),
  isActive: boolParam(),
  q: z.string().optional(),
});
export type AdminUsersFilters = z.infer<typeof adminUsersFiltersSchema>;
