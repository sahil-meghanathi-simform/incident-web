import { describe, it, expect } from 'vitest';
import { SEVERITY_RANK, compareSeverity } from '../src/lib/severity';

describe('severity ordering', () => {
  it('LOW < MEDIUM < HIGH < CRITICAL', () => {
    expect(SEVERITY_RANK.LOW).toBeLessThan(SEVERITY_RANK.MEDIUM);
    expect(SEVERITY_RANK.MEDIUM).toBeLessThan(SEVERITY_RANK.HIGH);
    expect(SEVERITY_RANK.HIGH).toBeLessThan(SEVERITY_RANK.CRITICAL);
  });

  it('compareSeverity sorts ascending', () => {
    const sorted = (['CRITICAL', 'LOW', 'HIGH', 'MEDIUM'] as const).slice().sort(compareSeverity);
    expect(sorted).toEqual(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
  });
});
