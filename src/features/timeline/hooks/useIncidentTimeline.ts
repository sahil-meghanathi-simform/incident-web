import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from '@tanstack/react-query';
import { getIncidentTimeline } from '../../../api/endpoints/timeline.api';
import { queryKeys } from '../../../api/queryKeys';
import type { ApiError } from '../../../api/ApiError';
import type { TimelineResponse } from '../types/timeline.type';

const PAGE_SIZE = 20;

/**
 * No `enabled` gate (unlike useIncidentNotes) — the timeline has no static role or
 * assignment gate, only the same clearance check every incident read already passed to
 * reach this tab at all (build-plan.md §13.1: getByIdForActor, then per-viewer
 * redaction server-side). The mutation invalidation key `queryKeys.timeline(id)` has
 * existed since Module 5 for exactly this endpoint.
 */
export function useIncidentTimeline(incidentId: string): UseInfiniteQueryResult<InfiniteData<TimelineResponse>, ApiError> {
  return useInfiniteQuery({
    queryKey: queryKeys.timeline(incidentId),
    queryFn: ({ pageParam }) => getIncidentTimeline(incidentId, pageParam, PAGE_SIZE),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor ?? undefined : undefined),
  });
}
