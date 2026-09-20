import { useCallback, useMemo } from 'react';
import { useSearchParamsState } from '../../../hooks/useSearchParamsState';
import {
  analyticsPeriodSchema,
  presetToRange,
  type AnalyticsPeriodFilters,
  type PeriodPreset,
} from '../schemas/analyticsPeriod.schema';

export type AnalyticsPeriodActions = Readonly<{
  setRange: (range: { from: string; to: string }) => void;
  setPreset: (preset: PeriodPreset) => void;
  setBucket: (bucket: AnalyticsPeriodFilters['bucket']) => void;
  setTypes: (types: NonNullable<AnalyticsPeriodFilters['type']>) => void;
  setStages: (stages: NonNullable<AnalyticsPeriodFilters['stage']>) => void;
  /** Drops the type and stage filters; the period stays. */
  clearFilters: () => void;
  /** Back to the defaults: last 30 days, by day, no filters. */
  reset: () => void;
}>;

export type UseAnalyticsPeriodReturn = readonly [AnalyticsPeriodFilters, AnalyticsPeriodActions];

/** Period, bucket, type/stage filters — all in the URL (shareable dashboards, same
 * discipline as useIncidentFilters.ts/useAuditFilters.ts). An empty selection is
 * written as `undefined`, which removes the param rather than leaving `type=` behind. */
export function useAnalyticsPeriod(): UseAnalyticsPeriodReturn {
  const [filters, update] = useSearchParamsState(analyticsPeriodSchema);

  const setRange = useCallback((range: { from: string; to: string }) => update(range), [update]);
  const setPreset = useCallback((preset: PeriodPreset) => update(presetToRange(preset)), [update]);
  const setBucket = useCallback((bucket: AnalyticsPeriodFilters['bucket']) => update({ bucket }), [update]);
  const setTypes = useCallback(
    (types: NonNullable<AnalyticsPeriodFilters['type']>) => update({ type: types.length ? types : undefined }),
    [update],
  );
  const setStages = useCallback(
    (stages: NonNullable<AnalyticsPeriodFilters['stage']>) => update({ stage: stages.length ? stages : undefined }),
    [update],
  );
  const clearFilters = useCallback(() => update({ type: undefined, stage: undefined }), [update]);
  // Deleting every param lets the schema's own defaults apply — one source of truth
  // for what "default" means.
  const reset = useCallback(
    () => update({ from: undefined, to: undefined, bucket: undefined, type: undefined, stage: undefined }),
    [update],
  );

  const actions = useMemo(
    () => ({ setRange, setPreset, setBucket, setTypes, setStages, clearFilters, reset }),
    [setRange, setPreset, setBucket, setTypes, setStages, clearFilters, reset],
  );

  return [filters, actions] as const;
}
