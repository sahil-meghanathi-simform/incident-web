import { ANALYTICS_MAX_RANGE_DAYS } from '../../../api/contracts/analytics.contract';
import { presetToRange, type PeriodPreset } from '../schemas/analyticsPeriod.schema';

export const PERIOD_PRESETS = ['7d', '30d', '90d', 'quarter'] as const satisfies readonly PeriodPreset[];

export const RANGE_PROBLEM = { incomplete: 'incomplete', reversed: 'reversed', tooWide: 'tooWide' } as const;
export type RangeProblem = (typeof RANGE_PROBLEM)[keyof typeof RANGE_PROBLEM];

type DateRange = Readonly<{ from: string; to: string }>;

const MS_PER_DAY = 86_400_000;

/** Whole days from `from` to `to`, counting both ends ("1–7 Sep" is 7 days). */
export function rangeDays(range: DateRange): number {
  return Math.round((Date.parse(range.to) - Date.parse(range.from)) / MS_PER_DAY) + 1;
}

/**
 * The same rules as the period schema's refinement, checked BEFORE a range reaches the
 * URL. The schema is a safety net for hand-edited links: a range it rejects silently
 * resets the whole dashboard to the default period — the right call for a bad link,
 * but a baffling one for somebody who has just picked an end date ahead of the start.
 * The custom-range form asks this first and explains the problem in place instead.
 */
export function rangeProblem(range: DateRange): RangeProblem | null {
  const fromMs = Date.parse(range.from);
  const toMs = Date.parse(range.to);
  if (Number.isNaN(fromMs) || Number.isNaN(toMs)) return RANGE_PROBLEM.incomplete;
  if (toMs < fromMs) return RANGE_PROBLEM.reversed;
  if ((toMs - fromMs) / MS_PER_DAY > ANALYTICS_MAX_RANGE_DAYS) return RANGE_PROBLEM.tooWide;
  return null;
}

/** The preset whose dates the current range matches exactly, if any — derived, never
 * stored, so a shared link or the back button lights up the right preset too. */
export function matchingPreset(range: DateRange): PeriodPreset | undefined {
  return PERIOD_PRESETS.find((preset) => {
    const candidate = presetToRange(preset);
    return candidate.from === range.from && candidate.to === range.to;
  });
}
