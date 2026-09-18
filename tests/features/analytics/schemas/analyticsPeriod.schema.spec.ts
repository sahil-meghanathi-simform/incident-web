import { describe, it, expect } from 'vitest';
import { analyticsPeriodSchema } from '../../../../src/features/analytics/schemas/analyticsPeriod.schema';

describe('analyticsPeriodSchema', () => {
  it('defaults to a 30-day window and day bucket when nothing is present', () => {
    const parsed = analyticsPeriodSchema.parse({});
    expect(parsed.bucket).toBe('day');
    expect(parsed.type).toBeUndefined();
    expect(parsed.stage).toBeUndefined();
    const days = (Date.parse(parsed.to) - Date.parse(parsed.from)) / 86_400_000;
    expect(days).toBeCloseTo(30, 0);
  });

  it('splits a comma-separated type list into a typed array', () => {
    const parsed = analyticsPeriodSchema.parse({ from: '2026-01-01', to: '2026-01-31', type: 'SAFETY,SECURITY' });
    expect(parsed.type).toEqual(['SAFETY', 'SECURITY']);
  });

  it('rejects a reversed range (to before from)', () => {
    const result = analyticsPeriodSchema.safeParse({ from: '2026-02-01', to: '2026-01-01' });
    expect(result.success).toBe(false);
  });

  it('rejects a range wider than 366 days — this is what lets a hand-edited URL fall back to defaults via useSearchParamsState', () => {
    const result = analyticsPeriodSchema.safeParse({ from: '2025-01-01', to: '2026-06-01' });
    expect(result.success).toBe(false);
  });

  it('accepts a range at exactly the 366-day cap', () => {
    const result = analyticsPeriodSchema.safeParse({ from: '2026-01-01', to: '2027-01-02' });
    expect(result.success).toBe(true);
  });
});
