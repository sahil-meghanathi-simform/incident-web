import { describe, it, expect } from 'vitest';
import { scorePassword } from '../../src/lib/passwordStrength';

describe('scorePassword', () => {
  it('scores an empty value 0 with no checks met', () => {
    const result = scorePassword('');
    expect(result.score).toBe(0);
    expect(Object.values(result.checks).every((met) => !met)).toBe(true);
  });

  it('never rates a password under the 8-character minimum above weak', () => {
    // Satisfies mixed case, number and symbol — but not the one enforced rule.
    const result = scorePassword('aB1!');
    expect(result.checks.minLength).toBe(false);
    expect(result.score).toBe(1);
  });

  it('rates a long single-class password weak', () => {
    expect(scorePassword('aaaaaaaa').score).toBe(1);
  });

  it('adds one step per extra character class once the minimum is met', () => {
    expect(scorePassword('aaaaaaa1').score).toBe(2);
    expect(scorePassword('aaaaaaA1').score).toBe(3);
    expect(scorePassword('aaaaaA1!').score).toBe(4);
  });

  it('reports each check independently', () => {
    expect(scorePassword('Test@123').checks).toEqual({
      minLength: true,
      mixedCase: true,
      number: true,
      symbol: true,
    });
  });
});
