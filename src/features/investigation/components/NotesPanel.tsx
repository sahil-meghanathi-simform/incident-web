// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { NotebookPen } from 'lucide-react';
import { SkeletonCard } from '../../../components/ui/SkeletonCard';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LoadMore } from '../../../components/ui/LoadMore';
import { NotesConfidentialityBanner } from './NotesConfidentialityBanner';
import { NotesRestrictedNotice } from './NotesRestrictedNotice';
import { NoteList } from './NoteList';
import { NoteComposer } from './NoteComposer';
import { useIncidentNotes } from '../hooks/useIncidentNotes';
import { useNotesAccess } from '../hooks/useNotesAccess';
import { LABELS } from '../../../lib/labels';
import type { IncidentDetail } from '../../incidents/types/incident.type';

type NotesPanelProps = Readonly<{
  incident: IncidentDetail;
}>;

const SKELETON_KEYS = ['first', 'second', 'third'] as const;

/**
 * The Notes tab's whole body (§10.2). Gated on `_actions.canReadNotes` — a viewer
 * without it never issues the request at all (`useIncidentNotes`'s `enabled`), so a
 * NotesRestrictedNotice, not a spinner or an error toast, is what they see.
 *
 * The composer sits above the list: notes are newest-first, so a freshly added
 * (optimistic) note appears directly under the box it was typed into.
 */
export function NotesPanel({ incident }: NotesPanelProps): ReactElement {
  const query = useIncidentNotes(incident.id, incident._actions.canReadNotes);
  const accessReason = useNotesAccess(incident, query.error);

  if (accessReason !== 'granted') {
    return <NotesRestrictedNotice reason={accessReason} />;
  }

  const notes = query.data?.pages.flatMap((page) => page.items) ?? [];
  const hasMore = query.data?.pages.at(-1)?.hasMore ?? false;

  return (
    <div className="space-y-4 py-4">
      {incident._actions.canAddNote && (
        <div className="space-y-3">
          <NotesConfidentialityBanner />
          <NoteComposer incidentId={incident.id} autoFocus={query.isSuccess && notes.length === 0} />
        </div>
      )}

      {query.isPending && (
        <div className="space-y-3">
          {SKELETON_KEYS.map((key) => (
            <SkeletonCard key={key} variant="list-item" />
          ))}
        </div>
      )}

      {query.isError && (
        <ErrorState message={LABELS.investigation.loadNotesError} onRetry={() => query.refetch()} />
      )}

      {query.isSuccess && notes.length === 0 && (
        <EmptyState
          size="sm"
          icon={NotebookPen}
          title={LABELS.investigation.noNotesYetTitle}
          body={LABELS.investigation.noNotesYetBody}
        />
      )}

      {notes.length > 0 && <NoteList notes={notes} />}

      {query.isSuccess && (
        <LoadMore
          hasMore={hasMore}
          isLoading={query.isFetchingNextPage}
          onClick={() => void query.fetchNextPage()}
          label={LABELS.investigation.loadMoreNotes}
        />
      )}
    </div>
  );
}
