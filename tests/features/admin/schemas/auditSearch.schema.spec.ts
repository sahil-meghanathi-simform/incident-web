import { describe, it, expect } from 'vitest';
import { auditSearchSchema } from '../../../../src/features/admin/schemas/auditSearch.schema';

describe('auditSearchSchema', () => {
  it('defaults page and pageSize when nothing is present', () => {
    const parsed = auditSearchSchema.parse({});
    expect(parsed).toMatchObject({ page: 1, pageSize: 25 });
    expect(parsed.type).toBeUndefined();
  });

  it('splits a comma-separated type list into a typed array', () => {
    const parsed = auditSearchSchema.parse({ type: 'STAGE_CHANGED,SEVERITY_CHANGED' });
    expect(parsed.type).toEqual(['STAGE_CHANGED', 'SEVERITY_CHANGED']);
  });

  it('rejects an invalid event type rather than silently passing it through', () => {
    const result = auditSearchSchema.safeParse({ type: 'NOT_REAL' });
    expect(result.success).toBe(false);
  });

  it('passes actorId/incidentId/from/to through as plain strings', () => {
    const parsed = auditSearchSchema.parse({ actorId: 'u1', incidentId: 'inc1', from: '2026-01-01', to: '2026-02-01' });
    expect(parsed).toMatchObject({ actorId: 'u1', incidentId: 'inc1', from: '2026-01-01', to: '2026-02-01' });
  });
});
