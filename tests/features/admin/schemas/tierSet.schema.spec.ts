import { describe, it, expect } from 'vitest';
import { tierSetSchema, tierRowErrors, type TierInput } from '../../../../src/features/admin/schemas/tierSet.schema';

function tier(severity: TierInput['severity'], level: number, thresholdMinutes: number): TierInput {
  return { severity, level, thresholdMinutes };
}

const VALID_TIERS: TierInput[] = [
  tier('HIGH', 1, 15),
  tier('HIGH', 2, 60),
  tier('HIGH', 3, 240),
  tier('CRITICAL', 1, 5),
  tier('CRITICAL', 2, 30),
  tier('CRITICAL', 3, 120),
];

describe('tierSetSchema — mirrors incident-api TierSetRequestSchema (build-plan.md §15.2)', () => {
  it('accepts a valid, contiguous, strictly-increasing set', () => {
    expect(tierSetSchema.safeParse({ tiers: VALID_TIERS }).success).toBe(true);
  });

  it('rejects a gap in levels (1, 3 — missing 2)', () => {
    const tiers = [tier('HIGH', 1, 15), tier('HIGH', 3, 60)];
    expect(tierSetSchema.safeParse({ tiers }).success).toBe(false);
  });

  it('rejects thresholds that do not strictly increase with level', () => {
    const tiers = [tier('HIGH', 1, 60), tier('HIGH', 2, 30)];
    expect(tierSetSchema.safeParse({ tiers }).success).toBe(false);
  });

  it('rejects equal thresholds across adjacent levels', () => {
    const tiers = [tier('HIGH', 1, 30), tier('HIGH', 2, 30)];
    expect(tierSetSchema.safeParse({ tiers }).success).toBe(false);
  });

  it('validates each severity independently — a valid HIGH set does not require CRITICAL to be present', () => {
    const tiers = [tier('HIGH', 1, 15), tier('HIGH', 2, 60)];
    expect(tierSetSchema.safeParse({ tiers }).success).toBe(true);
  });
});

describe('tierRowErrors — per-cell highlighting for the editor grid', () => {
  it('returns no errors for a valid set', () => {
    expect(tierRowErrors(VALID_TIERS).size).toBe(0);
  });

  it('flags every row of a severity whose levels are non-contiguous', () => {
    const tiers = [tier('HIGH', 1, 15), tier('HIGH', 3, 60)];
    const errors = tierRowErrors(tiers);
    expect(errors.get('HIGH:1')).toBeDefined();
    expect(errors.get('HIGH:3')).toBeDefined();
  });

  it('flags only the offending (later) row of a non-increasing threshold pair', () => {
    const tiers = [tier('HIGH', 1, 60), tier('HIGH', 2, 30), tier('HIGH', 3, 90)];
    const errors = tierRowErrors(tiers);
    expect(errors.get('HIGH:2')).toBeDefined();
    expect(errors.has('HIGH:1')).toBe(false);
  });

  it('flags a duplicate level', () => {
    const tiers = [tier('CRITICAL', 1, 5), tier('CRITICAL', 1, 10)];
    const errors = tierRowErrors(tiers);
    expect(errors.get('CRITICAL:1')).toBeDefined();
  });
});
