import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import type { z, ZodTypeAny } from 'zod';

/**
 * URL <-> typed filter state, the source of truth for every table/filter screen (§
 * State responsibilities: "Filters, page, sort — URL search params"). Parses with the
 * given Zod schema and drops malformed params rather than crashing the route.
 *
 * Generic over the SCHEMA (`S`), not its output — `schema: ZodType<T>` looked
 * equivalent but left T unconstrained by any concrete argument (a ZodObject satisfies
 * `ZodType<T>` for many different T), so TypeScript silently inferred T as `{}` for
 * every real caller. Inferring `S` from the schema value itself, then deriving the
 * output type via `z.infer<S>`, is the reliable pattern.
 */
export function useSearchParamsState<S extends ZodTypeAny>(
  schema: S,
): [z.infer<S>, (patch: Partial<z.infer<S>>) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo((): z.infer<S> => {
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = schema.safeParse(raw);
    return parsed.success ? parsed.data : schema.parse({});
  }, [searchParams, schema]);

  const update = useCallback(
    (patch: Partial<z.infer<S>>) => {
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
