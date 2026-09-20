import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSidebarCollapsed } from '../../src/hooks/useSidebarCollapsed';

describe('useSidebarCollapsed', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('starts expanded and remembers a toggle', () => {
    const { result } = renderHook(() => useSidebarCollapsed());
    expect(result.current.isCollapsed).toBe(false);

    act(() => result.current.toggle());
    expect(result.current.isCollapsed).toBe(true);
    expect(window.localStorage.getItem('ui:sidebar-collapsed')).toBe('true');

    const second = renderHook(() => useSidebarCollapsed());
    expect(second.result.current.isCollapsed).toBe(true);
  });

  it('keeps working when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const { result } = renderHook(() => useSidebarCollapsed());
    expect(result.current.isCollapsed).toBe(false);
    expect(() => act(() => result.current.toggle())).not.toThrow();
  });
});
