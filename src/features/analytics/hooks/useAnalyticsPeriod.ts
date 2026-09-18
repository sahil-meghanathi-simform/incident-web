import { useCallback } from 'react';
import { useSearchParamsState } from '../../../hooks/useSearchParamsState';
import {
  analyticsPeriodSchema,
  presetToRange,
  type AnalyticsPeriodFilters,
  type PeriodPreset,
} from '../schemas/analyticsPeriod.schema';

export type UseAnalyticsPeriodReturn = readonly [
  AnalyticsPeriodFilters,
  {
    setRange: (range: { from: string; to: string }) => void;
    setPreset: (preset: PeriodPreset) => void;
    setBucket: (bucket: AnalyticsPeriodFilters['bucket']) => void;
  },
];

/** Period, bucket, type/stage filters — all in the URL (shareable dashboards, same
 * discipline as useIncidentFilters.ts/useAuditFilters.ts). */
export function useAnalyticsPeriod(): UseAnalyticsPeriodReturn {
  const [filters, update] = useSearchParamsState(analyticsPeriodSchema);

  const setRange = useCallback((range: { from: string; to: string }) => update(range), [update]);
  const setPreset = useCallback((preset: PeriodPreset) => update(presetToRange(preset)), [update]);
  const setBucket = useCallback((bucket: AnalyticsPeriodFilters['bucket']) => update({ bucket }), [update]);

  return [filters, { setRange, setPreset, setBucket }] as const;
}
