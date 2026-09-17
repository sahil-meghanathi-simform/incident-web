import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { listNotes } from '../../../api/endpoints/investigation.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { NotesPageResponse } from '../types/investigation.type';

const PAGE_SIZE = 20;

/**
 * `enabled: canReadNotes` (§10.2) — a REPORTER or clearance-only viewer never even
 * issues the request; NotesPanel reads the disabled query's lack of data, not an
 * error, to decide what to render instead.
 */
export function useIncidentNotes(
  incidentId: string,
  canReadNotes: boolean,
): UseInfiniteQueryResult<InfiniteData<NotesPageResponse>, ApiError> {
  return useInfiniteQuery({
    queryKey: queryKeys.investigations.notes(incidentId),
    queryFn: ({ pageParam }) => listNotes(incidentId, pageParam, PAGE_SIZE),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor ?? undefined : undefined),
    enabled: canReadNotes,
  });
}
