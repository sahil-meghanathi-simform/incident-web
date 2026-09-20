// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { NoteItem } from './NoteItem';
import { LABELS } from '../../../lib/labels';
import type { InvestigationNote } from '../types/investigation.type';

type NoteListProps = Readonly<{
  notes: readonly InvestigationNote[];
}>;

export function NoteList({ notes }: NoteListProps): ReactElement {
  return (
    <ul aria-label={LABELS.investigation.notesListLabel} className="space-y-3">
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </ul>
  );
}
