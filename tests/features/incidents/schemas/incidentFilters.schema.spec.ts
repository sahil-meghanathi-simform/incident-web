import { describe, it, expect } from 'vitest';
import { incidentFiltersSchema } from '../../../../src/features/incidents/schemas/incidentFilters.schema';

describe('incidentFiltersSchema', () => {
  it('defaults page, pageSize, sort and order when nothing is present', () => {
    const parsed = incidentFiltersSchema.parse({});
    expect(parsed).toMatchObject({ page: 1, pageSize: 25, sort: 'createdAt', order: 'desc' });
    expect(parsed.severity).toBeUndefined();
  });

  it('splits a comma-separated severity/stage/type list into a typed array', () => {
    const parsed = incidentFiltersSchema.parse({ severity: 'LOW,HIGH', stage: 'TRIAGE', type: 'SAFETY,SECURITY' });
    expect(parsed.severity).toEqual(['LOW', 'HIGH']);
    expect(parsed.stage).toEqual(['TRIAGE']);
    expect(parsed.type).toEqual(['SAFETY', 'SECURITY']);
  });

  it('maps the string "true"/"false" to real booleans, not JS truthiness', () => {
    const parsed = incidentFiltersSchema.parse({ unacknowledged: 'false', escalatedOnly: 'true' });
    expect(parsed.unacknowledged).toBe(false);
    expect(parsed.escalatedOnly).toBe(true);
  });

  it('rejects an invalid severity value rather than silently passing it through', () => {
    const result = incidentFiltersSchema.safeParse({ severity: 'NOT_REAL' });
    expect(result.success).toBe(false);
  });
});
