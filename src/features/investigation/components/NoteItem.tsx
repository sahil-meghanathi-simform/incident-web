// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { Spinner } from '../../../components/ui/Spinner';
import { cn } from '../../../lib/cn';
import { formatDateTime, formatRelative } from '../../../lib/datetime';
import { isOptimisticNote } from '../hooks/useAddNote';
import { LABELS } from '../../../lib/labels';
import type { InvestigationNote } from '../types/investigation.type';

type NoteItemProps = Readonly<{
  note: InvestigationNote;
}>;

/** Notes are immutable (Q24b) — there is deliberately no edit/delete affordance here.
 * An optimistic note renders dimmed with a spinner until the server confirms it. */
export function NoteItem({ note }: NoteItemProps): ReactElement {
  const pending = isOptimisticNote(note);

  return (
    <li
      aria-busy={pending}
      className={cn(
        'flex gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-opacity duration-300',
        pending && 'opacity-60 animate-in fade-in slide-in-from-top-1 motion-reduce:animate-none',
      )}
    >
      <Avatar name={note.author.displayName} />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{note.author.displayName}</span>
          {pending ? (
            <span className="inline-flex items-center gap-1.5">
              <Spinner size="sm" />
              {LABELS.investigation.sendingNote}
            </span>
          ) : (
            <time dateTime={note.createdAt} title={formatDateTime(note.createdAt)}>
              {formatRelative(note.createdAt)}
            </time>
          )}
        </div>
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">{note.body}</p>
      </div>
    </li>
  );
}
