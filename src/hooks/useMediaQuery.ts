import { useCallback, useSyncExternalStore } from 'react';

/** Subscribes to a CSS media query. Reports `false` where `matchMedia` doesn't exist
 * (jsdom), so callers behave as if the query simply doesn't match. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window.matchMedia !== 'function') return () => undefined;
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => (typeof window.matchMedia === 'function' ? window.matchMedia(query).matches : false),
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
