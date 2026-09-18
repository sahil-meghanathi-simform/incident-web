import { z } from 'zod';
import { IncidentTypeSchema, StageSchema } from '../../../api/contracts/enums';
import { ANALYTICS_MAX_RANGE_DAYS } from '../../../api/contracts/analytics.contract';

/** Mirrors auditSearch.schema.ts's csv() helper — URL search params are always
 * strings, so this parses and coerces them, dropping malformed values rather than
 * crashing the route (used via useSearchParamsState). */
function csv<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((v) => {
    if (typeof v !== 'string' || v === '') return undefined;
    return v.split(',');
  }, z.array(schema).optional());
}

function isoDate(defaultValue: () => string) {
  return z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), 'must be a valid date')
    .default(defaultValue);
}

function isoDateString(daysAgo: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

export const BUCKET_VALUES = ['day', 'week', 'month'] as const;
export const BucketSchema = z.enum(BUCKET_VALUES);
export type Bucket = z.infer<typeof BucketSchema>;

/**
 * Mirrors the backend's own periodRefinement (analytics.contract.ts) exactly — a
 * reversed or too-wide range fails `safeParse`, which useSearchParamsState already
 * treats as "malformed" and falls back to the schema's own defaults (implementation-
 * plan.md §14.2: "a hand-edited URL degrades to the default period instead of
 * erroring"), so the SPA never even fires a request that the server would 422.
 */
function periodRefinement(val: { from: string; to: string }, ctx: z.RefinementCtx): void {
  const fromMs = Date.parse(val.from);
  const toMs = Date.parse(val.to);
  if (Number.isNaN(fromMs) || Number.isNaN(toMs)) return; // isoDate's own refine already flags this
  if (toMs < fromMs) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['to'], message: '"to" must not be before "from".' });
    return;
  }
  const days = (toMs - fromMs) / 86_400_000;
  if (days > ANALYTICS_MAX_RANGE_DAYS) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['to'], message: `Range cannot exceed ${ANALYTICS_MAX_RANGE_DAYS} days.` });
  }
}

export const analyticsPeriodSchema = z
  .object({
    from: isoDate(() => isoDateString(30)),
    to: isoDate(() => isoDateString(0)),
    bucket: BucketSchema.default('day'),
    type: csv(IncidentTypeSchema),
    stage: csv(StageSchema),
  })
  .superRefine(periodRefinement);
export type AnalyticsPeriodFilters = z.infer<typeof analyticsPeriodSchema>;

export type PeriodPreset = '7d' | '30d' | '90d' | 'quarter';

export function presetToRange(preset: PeriodPreset): { from: string; to: string } {
  const days = preset === '7d' ? 7 : preset === '30d' ? 30 : preset === '90d' ? 90 : 90;
  return { from: isoDateString(preset === 'quarter' ? 91 : days), to: isoDateString(0) };
}
