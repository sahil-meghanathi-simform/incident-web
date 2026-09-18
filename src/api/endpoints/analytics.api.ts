import { api, getAccessToken } from '../client';
import { env } from '../../lib/env';
import { ApiError } from '../ApiError';
import {
  AnalyticsOverviewResponseSchema,
  type AnalyticsOverviewResponse,
  TypeSeverityMatrixResponseSchema,
  type TypeSeverityMatrixResponse,
  TrendResponseSchema,
  type TrendResponse,
  EscalationPerformanceResponseSchema,
  type EscalationPerformanceResponse,
} from '../contracts/analytics.contract';
import type { AnalyticsPeriodFilters } from '../../features/analytics/schemas/analyticsPeriod.schema';

/** Arrays serialize via comma-join — matches the backend's csvArrayQueryParam. */
function serializePeriod(filters: AnalyticsPeriodFilters): Record<string, string | undefined> {
  return {
    from: filters.from,
    to: filters.to,
    type: filters.type?.join(','),
    stage: filters.stage?.join(','),
  };
}

export function getAnalyticsOverview(filters: AnalyticsPeriodFilters): Promise<AnalyticsOverviewResponse> {
  return api.get<AnalyticsOverviewResponse>('/api/v1/analytics/overview', AnalyticsOverviewResponseSchema, serializePeriod(filters));
}

export function getTypeSeverityMatrix(filters: AnalyticsPeriodFilters): Promise<TypeSeverityMatrixResponse> {
  return api.get<TypeSeverityMatrixResponse>(
    '/api/v1/analytics/by-type-severity',
    TypeSeverityMatrixResponseSchema,
    serializePeriod(filters),
  );
}

export function getTrend(filters: AnalyticsPeriodFilters): Promise<TrendResponse> {
  return api.get<TrendResponse>('/api/v1/analytics/trend', TrendResponseSchema, {
    ...serializePeriod(filters),
    bucket: filters.bucket,
  });
}

export function getEscalationPerformance(filters: AnalyticsPeriodFilters): Promise<EscalationPerformanceResponse> {
  return api.get<EscalationPerformanceResponse>(
    '/api/v1/analytics/escalation-performance',
    EscalationPerformanceResponseSchema,
    serializePeriod(filters),
  );
}

/**
 * NOT `api.get` — a plain `<a href>`/`window.open` would send no Authorization header
 * (the access token is deliberately in-memory only, docs/decisions.md), so this has to
 * `fetch` with the header itself and hand the caller a Blob to save via a synthetic
 * `<a download>` click on an object URL (see ExportCsvButton).
 */
export async function exportAnalyticsCsv(filters: AnalyticsPeriodFilters): Promise<{ blob: Blob; filename: string }> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(serializePeriod(filters))) {
    if (value !== undefined) query.set(key, value);
  }
  const token = getAccessToken();
  const res = await fetch(`${env.apiBaseUrl}/api/v1/analytics/export.csv?${query.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: 'include',
  });
  if (!res.ok) {
    const message = `Export failed with status ${res.status}`;
    try {
      const body = (await res.json()) as { error?: { message?: string; code?: string; requestId?: string } };
      throw new ApiError({
        code: body.error?.code ?? 'INTERNAL',
        status: res.status,
        message: body.error?.message ?? message,
        requestId: body.error?.requestId ?? 'unknown',
      });
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError({ code: 'INTERNAL', status: res.status, message, requestId: 'unknown' });
    }
  }
  const disposition = res.headers.get('Content-Disposition') ?? '';
  const match = /filename="([^"]+)"/.exec(disposition);
  const blob = await res.blob();
  return { blob, filename: match?.[1] ?? `incident-analytics-${filters.from}-to-${filters.to}.csv` };
}
