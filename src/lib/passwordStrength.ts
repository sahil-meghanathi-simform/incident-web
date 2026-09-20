export const PASSWORD_CHECK_KEYS = ['minLength', 'mixedCase', 'number', 'symbol'] as const;

export type PasswordCheckKey = (typeof PASSWORD_CHECK_KEYS)[number];

export type PasswordScore = 0 | 1 | 2 | 3 | 4;

export type PasswordStrengthResult = Readonly<{
  score: PasswordScore;
  checks: Readonly<Record<PasswordCheckKey, boolean>>;
}>;

const MIN_LENGTH = 8;

const SCORES: readonly PasswordScore[] = [0, 1, 2, 3, 4];

/**
 * Purely advisory — the only rule the backend contract enforces is the 8-character
 * minimum (auth.contract.ts). The score drives the register screen's strength meter
 * and never blocks a submit.
 */
export function scorePassword(value: string): PasswordStrengthResult {
  const checks = {
    minLength: value.length >= MIN_LENGTH,
    mixedCase: /[a-z]/.test(value) && /[A-Z]/.test(value),
    number: /\d/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value),
  };

  if (value.length === 0) return { score: 0, checks };

  const met = PASSWORD_CHECK_KEYS.filter((key) => checks[key]).length;
  // A password under the real minimum never reads better than "weak", however
  // many optional tips it happens to satisfy.
  const capped = checks.minLength ? Math.max(met, 1) : 1;
  return { score: SCORES[capped] ?? 1, checks };
}
