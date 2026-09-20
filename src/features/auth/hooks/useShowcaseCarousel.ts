import { useCallback, useEffect, useState, useSyncExternalStore, type FocusEvent } from 'react';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

type UseShowcaseCarouselOptions = Readonly<{
  count: number;
  intervalMs: number;
}>;

type CarouselRegionHandlers = Readonly<{
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: (event: FocusEvent<HTMLElement>) => void;
}>;

export type UseShowcaseCarouselReturn = Readonly<{
  index: number;
  isAutoplaying: boolean;
  isUserPaused: boolean;
  /** False under prefers-reduced-motion — autoplay never runs, so there is nothing to pause. */
  canAutoplay: boolean;
  goTo: (next: number) => void;
  next: () => void;
  previous: () => void;
  togglePause: () => void;
  regionHandlers: CarouselRegionHandlers;
}>;

function subscribeToVisibility(onChange: () => void): () => void {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}

function getIsVisible(): boolean {
  return document.visibilityState !== 'hidden';
}

/**
 * Index + autoplay for the auth showcase. Autoplay stops while the pointer or keyboard
 * focus is inside the region, while the tab is hidden, when the user pauses it, and
 * entirely under prefers-reduced-motion (accessibility.md). The timer is a timeout keyed
 * on `index`, so any manual navigation restarts the countdown.
 */
export function useShowcaseCarousel({ count, intervalMs }: UseShowcaseCarouselOptions): UseShowcaseCarouselReturn {
  const [index, setIndex] = useState(0);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);

  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isVisible = useSyncExternalStore(subscribeToVisibility, getIsVisible, () => true);

  const canAutoplay = !prefersReducedMotion && count > 1;
  const isAutoplaying = canAutoplay && !isUserPaused && !isHovered && !isFocusWithin && isVisible;

  useEffect(() => {
    if (!isAutoplaying) return undefined;
    const id = window.setTimeout(() => setIndex((current) => (current + 1) % count), intervalMs);
    return () => window.clearTimeout(id);
  }, [isAutoplaying, index, count, intervalMs]);

  const goTo = useCallback(
    (next: number) => {
      if (count <= 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );
  const next = useCallback(() => setIndex((current) => (current + 1) % count), [count]);
  const previous = useCallback(() => setIndex((current) => (current - 1 + count) % count), [count]);
  const togglePause = useCallback(() => setIsUserPaused((paused) => !paused), []);

  const regionHandlers: CarouselRegionHandlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onFocus: () => setIsFocusWithin(true),
    onBlur: (event) => {
      const movedTo = event.relatedTarget;
      if (movedTo instanceof Node && event.currentTarget.contains(movedTo)) return;
      setIsFocusWithin(false);
    },
  };

  return { index, isAutoplaying, isUserPaused, canAutoplay, goTo, next, previous, togglePause, regionHandlers };
}
