import { useMutation, useQueryClient, type UseMutationResult, type InfiniteData } from '@tanstack/react-query';
import { addNote } from '../../../api/endpoints/investigation.api';
import { queryKeys } from '../../../api/queryKeys';
import { useAuth } from '../../../hooks/useAuth';
import type { ApiError } from '../../../api/ApiError';
import type { InvestigationNote, NotesPageResponse } from '../types/investigation.type';

const OPTIMISTIC_ID_PREFIX = 'optimistic-';

export function isOptimisticNote(note: InvestigationNote): boolean {
  return note.id.startsWith(OPTIMISTIC_ID_PREFIX);
}

/**
 * Optimistic prepend with rollback (§10.2). The composer keeps the typed text in its
 * own local state and only clears it on success, so a rollback here — restoring the
 * cache to its pre-mutation snapshot — never loses what the user wrote.
 */
type AddNoteContext = Readonly<{ previous: InfiniteData<NotesPageResponse> | undefined }>;

export function useAddNote(incidentId: string): UseMutationResult<InvestigationNote, ApiError, string, AddNoteContext> {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const queryKey = queryKeys.investigations.notes(incidentId);

  return useMutation({
    mutationFn: (body: string) => addNote(incidentId, { body }),
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<InfiniteData<NotesPageResponse>>(queryKey);

      if (previous && user) {
        const optimisticNote: InvestigationNote = {
          id: `${OPTIMISTIC_ID_PREFIX}${crypto.randomUUID()}`,
          incidentId,
          author: { id: user.id, displayName: user.displayName },
          body,
          createdAt: new Date().toISOString(),
        };
        const [firstPage, ...rest] = previous.pages;
        if (firstPage) {
          queryClient.setQueryData<InfiniteData<NotesPageResponse>>(queryKey, {
            ...previous,
            pages: [{ ...firstPage, items: [optimisticNote, ...firstPage.items] }, ...rest],
          });
        }
      }

      return { previous };
    },
    onError: (_err, _body, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.incidents.detail(incidentId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.timeline(incidentId) });
    },
  });
}
