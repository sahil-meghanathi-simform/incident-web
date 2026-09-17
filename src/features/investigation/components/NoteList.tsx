import type { ReactElement } from 'react';
import { NoteItem } from './NoteItem';
import type { InvestigationNote } from '../types/investigation.type';

type NoteListProps = Readonly<{
  notes: readonly InvestigationNote[];
}>;

export function NoteList({ notes }: NoteListProps): ReactElement {
  return (
    <ul className="space-y-2">
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </ul>
  );
}
