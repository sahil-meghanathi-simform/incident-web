import { useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import { getTrend } from '../../../api/endpoints/analytics.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { TrendResponse } from '../../../api/contracts/analytics.contract';
import type { Severity } from '../../../lib/severity';
import type { AnalyticsPeriodFilters } from '../schemas/analyticsPeriod.schema';

export type PivotedTrend = Readonly<{
  buckets: readonly string[];
  severities: readonly Severity[];
  seriesBySeverity: Readonly<Record<Severity, readonly number[]>>;
}>;

/** Pivots the flat `{bucketStart, severity, count}[]` response into per-severity series
 * aligned to a shared bucket axis (zero-filled) — exactly what TrendChart's stacked
 * bars need, computed once here so the component stays presentation-only. */
/** Exported only for tests/features/analytics/hooks/useTrend.spec.ts. */
export function pivot(data: TrendResponse): PivotedTrend {
  const buckets = [...new Set(data.points.map((p) => p.bucketStart))].sort();
  const bucketIndex = new Map(buckets.map((b, i) => [b, i]));

  const seriesBySeverity = Object.fromEntries(
    data.severities.map((severity) => [severity, new Array<number>(buckets.length).fill(0)]),
  ) as Record<Severity, number[]>;

  for (const point of data.points) {
    const idx = bucketIndex.get(point.bucketStart);
    if (idx === undefined) continue;
    seriesBySeverity[point.severity][idx] = point.count;
  }

  return { buckets, severities: data.severities, seriesBySeverity };
}

export function useTrend(filters: AnalyticsPeriodFilters): UseQueryResult<PivotedTrend, ApiError> {
  return useQuery({
    queryKey: queryKeys.analytics.trend(filters, filters.bucket),
    queryFn: () => getTrend(filters),
    placeholderData: keepPreviousData,
    select: pivot,
  });
}
