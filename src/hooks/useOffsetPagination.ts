import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

/** page/pageSize from the URL + total-pages math, shared by every offset table screen. */
export function useOffsetPagination(defaultPageSize = 25) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = useMemo(() => Math.max(1, Number(searchParams.get('page')) || 1), [searchParams]);
  const pageSize = useMemo(
    () => Math.max(1, Number(searchParams.get('pageSize')) || defaultPageSize),
    [searchParams, defaultPageSize],
  );

  const setPage = useCallback(
    (next: number) => {
      setSearchParams((prev) => {
        const p = new URLSearchParams(prev);
        p.set('page', String(Math.max(1, next)));
        return p;
      });
    },
    [setSearchParams],
  );

  return { page, pageSize, setPage };
}
