import { describe, it, expect } from 'vitest';
import { pivot } from '../../../../src/features/analytics/hooks/useTrend';
import type { TrendResponse } from '../../../../src/api/contracts/analytics.contract';

function response(points: TrendResponse['points']): TrendResponse {
  return { period: { from: '2026-03-01', to: '2026-03-31' }, bucket: 'week', severities: ['LOW', 'HIGH'], points };
}

describe('pivot — flat trend rows into per-severity series aligned to a shared bucket axis', () => {
  it('zero-fills a (bucket, severity) combination that has no matching row', () => {
    const result = pivot(
      response([
        { bucketStart: '2026-03-01T00:00:00.000Z', severity: 'LOW', count: 5 },
        { bucketStart: '2026-03-08T00:00:00.000Z', severity: 'HIGH', count: 2 },
      ]),
    );
    expect(result.buckets).toEqual(['2026-03-01T00:00:00.000Z', '2026-03-08T00:00:00.000Z']);
    expect(result.seriesBySeverity.LOW).toEqual([5, 0]);
    expect(result.seriesBySeverity.HIGH).toEqual([0, 2]);
  });

  it('an empty points array produces an empty bucket axis, not a crash', () => {
    const result = pivot(response([]));
    expect(result.buckets).toEqual([]);
    expect(result.seriesBySeverity.LOW).toEqual([]);
  });

  it('sorts buckets chronologically regardless of input order', () => {
    const result = pivot(
      response([
        { bucketStart: '2026-03-08T00:00:00.000Z', severity: 'LOW', count: 1 },
        { bucketStart: '2026-03-01T00:00:00.000Z', severity: 'LOW', count: 2 },
      ]),
    );
    expect(result.buckets).toEqual(['2026-03-01T00:00:00.000Z', '2026-03-08T00:00:00.000Z']);
    expect(result.seriesBySeverity.LOW).toEqual([2, 1]);
  });
});
