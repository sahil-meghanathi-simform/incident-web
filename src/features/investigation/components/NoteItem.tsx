import type { ReactElement } from 'react';
import { formatRelative } from '../../../lib/datetime';
import { isOptimisticNote } from '../hooks/useAddNote';
import type { InvestigationNote } from '../types/investigation.type';

type NoteItemProps = Readonly<{
  note: InvestigationNote;
}>;

/** Notes are immutable (Q24b) — there is deliberately no edit/delete affordance here. */
export function NoteItem({ note }: NoteItemProps): ReactElement {
  const pending = isOptimisticNote(note);

  return (
    <li className="space-y-1 rounded-md border border-border bg-card p-3" aria-busy={pending}>
      <div className="flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground-soft">{note.author.displayName}</span>
        <span>{pending ? 'Sending…' : formatRelative(note.createdAt)}</span>
      </div>
      <p className="whitespace-pre-wrap text-sm text-foreground">{note.body}</p>
    </li>
  );
}
