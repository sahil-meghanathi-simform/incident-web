import { z } from 'zod';
import { SeveritySchema, type Severity } from '../../../api/contracts/enums';

export const tierInputSchema = z.object({
  severity: SeveritySchema,
  level: z.number().int().min(1),
  thresholdMinutes: z.number().int().min(1),
});
export type TierInput = z.infer<typeof tierInputSchema>;

/**
 * Mirrors incident-api's TierSetRequestSchema exactly (build-plan.md §15.2 — "the
 * contiguity and monotonicity refinements mirrored exactly from the server"): tier
 * levels contiguous from 1 within each severity, thresholds strictly increasing within
 * each severity. Gates the [Save all] button; the server re-validates the same rules
 * regardless of what this returns.
 */
export const tierSetSchema = z.object({ tiers: z.array(tierInputSchema).min(1) }).superRefine((val, ctx) => {
  const bySeverity = new Map<string, TierInput[]>();
  for (const tier of val.tiers) {
    const list = bySeverity.get(tier.severity) ?? [];
    list.push(tier);
    bySeverity.set(tier.severity, list);
  }

  for (const [severity, list] of bySeverity) {
    const levels = [...new Set(list.map((t) => t.level))].sort((a, b) => a - b);
    if (!levels.every((level, index) => level === index + 1)) {
      ctx.addIssue({ code: 'custom', path: ['tiers'], message: `${severity} tier levels must be contiguous starting at 1` });
    }

    const byLevel = [...list].sort((a, b) => a.level - b.level);
    for (let i = 1; i < byLevel.length; i += 1) {
      const previous = byLevel[i - 1]!;
      const current = byLevel[i]!;
      if (current.thresholdMinutes <= previous.thresholdMinutes) {
        ctx.addIssue({ code: 'custom', path: ['tiers'], message: `${severity} thresholds must strictly increase with level` });
      }
    }
  }
});
export type TierSetInput = z.infer<typeof tierSetSchema>;

/**
 * Per-row error map for the editor grid's inline highlighting — `tierSetSchema`
 * itself reports whole-set issues, not which specific cell to highlight, so the
 * TierEditor UI derives row-level messages separately with the same underlying rules.
 */
export function tierRowErrors(tiers: readonly TierInput[]): ReadonlyMap<string, string> {
  const errors = new Map<string, string>();
  const bySeverity = new Map<Severity, TierInput[]>();
  for (const tier of tiers) {
    const list = bySeverity.get(tier.severity) ?? [];
    list.push(tier);
    bySeverity.set(tier.severity, list);
  }

  for (const list of bySeverity.values()) {
    const byLevel = [...list].sort((a, b) => a.level - b.level);
    const levels = byLevel.map((t) => t.level);
    const seenLevels = new Set<number>();
    for (const tier of byLevel) {
      const key = `${tier.severity}:${tier.level}`;
      if (seenLevels.has(tier.level)) errors.set(key, `Duplicate level ${tier.level}`);
      seenLevels.add(tier.level);
    }
    if (!levels.every((level, index) => level === index + 1)) {
      for (const tier of byLevel) errors.set(`${tier.severity}:${tier.level}`, 'Levels must be contiguous starting at 1');
    }
    for (let i = 1; i < byLevel.length; i += 1) {
      const previous = byLevel[i - 1]!;
      const current = byLevel[i]!;
      if (current.thresholdMinutes <= previous.thresholdMinutes) {
        errors.set(`${current.severity}:${current.level}`, 'Must be greater than the previous level');
      }
    }
  }
  return errors;
}
