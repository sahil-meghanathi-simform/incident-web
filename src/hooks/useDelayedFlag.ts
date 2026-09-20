import { useEffect, useRef, useState } from 'react';

type DelayedFlagOptions = Readonly<{
  /** How long `value` must stay true before the flag turns on. */
  showAfterMs?: number;
  /** Once on, the flag stays on at least this long — no one-frame flashes. */
  minVisibleMs?: number;
}>;

/**
 * Debounces a busy signal for display: quick work (a 100ms poll) never shows an
 * indicator at all, and slower work shows one that doesn't flicker off the instant
 * the request settles.
 */
export function useDelayedFlag(value: boolean, { showAfterMs = 200, minVisibleMs = 400 }: DelayedFlagOptions = {}): boolean {
  const [isShown, setIsShown] = useState(false);
  const shownAtRef = useRef(0);

  useEffect(() => {
    if (value && !isShown) {
      const id = window.setTimeout(() => {
        shownAtRef.current = Date.now();
        setIsShown(true);
      }, showAfterMs);
      return () => window.clearTimeout(id);
    }
    if (!value && isShown) {
      const remaining = Math.max(0, minVisibleMs - (Date.now() - shownAtRef.current));
      const id = window.setTimeout(() => setIsShown(false), remaining);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [value, isShown, showAfterMs, minVisibleMs]);

  return isShown;
}
