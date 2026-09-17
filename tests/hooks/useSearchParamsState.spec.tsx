import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { z } from 'zod';
import { useSearchParamsState } from '../../src/hooks/useSearchParamsState';

const schema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  severity: z.preprocess((v) => (typeof v === 'string' && v !== '' ? v.split(',') : undefined), z.array(z.string()).optional()),
});

function wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter initialEntries={['/incidents?page=2&severity=LOW,HIGH']}>{children}</MemoryRouter>;
}

/**
 * Regression test: the original `schema: ZodType<T>` signature let TypeScript infer T
 * as `{}` for every real caller (a ZodObject satisfies ZodType<T> for many different
 * T), so callers compiled fine but got no real type safety on the returned filter
 * state or the patch they could pass to update it. Fixed by inferring from the schema
 * value itself (`S extends ZodTypeAny`) and deriving the output via `z.infer<S>`.
 */
describe('useSearchParamsState', () => {
  it('parses existing URL params through the schema on mount', () => {
    const { result } = renderHook(() => useSearchParamsState(schema), { wrapper });
    const [state] = result.current;
    expect(state.page).toBe(2);
    expect(state.severity).toEqual(['LOW', 'HIGH']);
  });

  it('update() sets a new param and removes one when patched to undefined', () => {
    const { result } = renderHook(() => useSearchParamsState(schema), { wrapper });

    act(() => {
      const [, update] = result.current;
      update({ severity: undefined, page: 3 });
    });

    const [state] = result.current;
    expect(state.page).toBe(3);
    expect(state.severity).toBeUndefined();
  });

  it('a malformed param is dropped rather than crashing the route', () => {
    function badWrapper({ children }: { children: React.ReactNode }) {
      return <MemoryRouter initialEntries={['/incidents?page=not-a-number']}>{children}</MemoryRouter>;
    }
    const { result } = renderHook(() => useSearchParamsState(schema), { wrapper: badWrapper });
    // page falls back to the schema's own default rather than throwing.
    expect(result.current[0].page).toBe(1);
  });
});
