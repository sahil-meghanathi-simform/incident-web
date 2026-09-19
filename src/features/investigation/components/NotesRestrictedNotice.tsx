import type { ReactElement } from 'react';
import { Card } from '../../../components/ui/Card';
import { LABELS } from '../../../lib/labels';
import type { NotesAccessReason } from '../types/investigation.type';

type NotesRestrictedNoticeProps = Readonly<{
  reason: Exclude<NotesAccessReason, 'granted'>;
}>;

/**
 * Explains WHY, driven by the error code (§10.2) — a clearance refusal and an
 * assignment refusal are different situations with different next steps, so they get
 * different copy rather than one generic "access denied".
 */
export function NotesRestrictedNotice({ reason }: NotesRestrictedNoticeProps): ReactElement {
  const copy =
    reason === 'clearance'
      ? { title: LABELS.investigation.restrictedClearanceTitle, body: LABELS.investigation.restrictedClearanceBody }
      : { title: LABELS.investigation.restrictedNotAssignedTitle, body: LABELS.investigation.restrictedNotAssignedBody };

  return (
    <Card role="status" className="bg-muted p-6 text-center">
      <p className="text-sm font-medium text-foreground">{copy.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{copy.body}</p>
    </Card>
  );
}
