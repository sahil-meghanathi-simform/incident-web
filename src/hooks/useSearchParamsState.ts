import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import type { ZodType } from 'zod';

/**
 * URL <-> typed filter state, the source of truth for every table/filter screen (§
 * State responsibilities: "Filters, page, sort — URL search params"). Parses with the
 * given Zod schema and drops malformed params rather than crashing the route.
 */
export function useSearchParamsState<T extends Record<string, unknown>>(
  schema: ZodType<T>,
): [T, (patch: Partial<T>) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo(() => {
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = schema.safeParse(raw);
    return parsed.success ? parsed.data : schema.parse({});
  }, [searchParams, schema]);

  const update = useCallback(
    (patch: Partial<T>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(patch)) {
          if (value === undefined || value === '' || value === null) next.delete(key);
          else next.set(key, String(value));
        }
        return next;
      });
    },
    [setSearchParams],
  );

  return [state, update];
}
