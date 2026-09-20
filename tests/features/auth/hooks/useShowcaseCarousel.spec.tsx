import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useShowcaseCarousel } from '../../../../src/features/auth/hooks/useShowcaseCarousel';

const OPTIONS = { count: 3, intervalMs: 1000 };

function stubReducedMotion(matches: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe('useShowcaseCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    stubReducedMotion(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('auto-advances on the interval and wraps around', () => {
    const { result } = renderHook(() => useShowcaseCarousel(OPTIONS));
    expect(result.current.index).toBe(0);
    expect(result.current.isAutoplaying).toBe(true);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.index).toBe(1);
    // One act per tick: the next timeout is only armed once React has re-rendered.
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.index).toBe(2);
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.index).toBe(0);
  });

  it('wraps manual navigation in both directions', () => {
    const { result } = renderHook(() => useShowcaseCarousel(OPTIONS));
    act(() => result.current.previous());
    expect(result.current.index).toBe(2);
    act(() => result.current.next());
    expect(result.current.index).toBe(0);
    act(() => result.current.goTo(2));
    expect(result.current.index).toBe(2);
  });

  it('restarts the countdown after manual navigation', () => {
    const { result } = renderHook(() => useShowcaseCarousel(OPTIONS));
    act(() => vi.advanceTimersByTime(900));
    act(() => result.current.next());
    expect(result.current.index).toBe(1);
    act(() => vi.advanceTimersByTime(900));
    expect(result.current.index).toBe(1);
    act(() => vi.advanceTimersByTime(100));
    expect(result.current.index).toBe(2);
  });

  it('stops while hovered or user-paused and resumes after', () => {
    const { result } = renderHook(() => useShowcaseCarousel(OPTIONS));

    act(() => result.current.regionHandlers.onMouseEnter());
    expect(result.current.isAutoplaying).toBe(false);
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.index).toBe(0);
    act(() => result.current.regionHandlers.onMouseLeave());

    act(() => result.current.togglePause());
    expect(result.current.isUserPaused).toBe(true);
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.index).toBe(0);

    act(() => result.current.togglePause());
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.index).toBe(1);
  });

  it('never autoplays under prefers-reduced-motion', () => {
    stubReducedMotion(true);
    const { result } = renderHook(() => useShowcaseCarousel(OPTIONS));
    expect(result.current.canAutoplay).toBe(false);
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.index).toBe(0);
  });
});
