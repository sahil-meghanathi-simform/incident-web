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
    <li className="space-y-1 rounded-md border border-slate-200 bg-white p-3" aria-busy={pending}>
      <div className="flex items-baseline justify-between gap-2 text-xs text-slate-500">
        <span className="font-medium text-slate-700">{note.author.displayName}</span>
        <span>{pending ? 'Sending…' : formatRelative(note.createdAt)}</span>
      </div>
      <p className="whitespace-pre-wrap text-sm text-slate-800">{note.body}</p>
    </li>
  );
}
