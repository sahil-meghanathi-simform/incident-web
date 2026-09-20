// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Lock, ShieldAlert } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { LABELS } from '../../../lib/labels';
import type { NotesAccessReason } from '../types/investigation.type';

type NotesRestrictedNoticeProps = Readonly<{
  reason: Exclude<NotesAccessReason, 'granted'>;
}>;

/**
 * Explains WHY, driven by the error code (§10.2) — a clearance refusal and an
 * assignment refusal are different situations with different next steps, so they get
 * different copy (and a different icon) rather than one generic "access denied".
 */
export function NotesRestrictedNotice({ reason }: NotesRestrictedNoticeProps): ReactElement {
  const isClearance = reason === 'clearance';
  const Icon = isClearance ? ShieldAlert : Lock;
  const copy = isClearance
    ? { title: LABELS.investigation.restrictedClearanceTitle, body: LABELS.investigation.restrictedClearanceBody }
    : { title: LABELS.investigation.restrictedNotAssignedTitle, body: LABELS.investigation.restrictedNotAssignedBody };

  return (
    <div className="py-4">
      <Card
        role="status"
        variant="muted"
        className="flex flex-col items-center gap-2 px-6 py-10 text-center animate-in fade-in duration-300 motion-reduce:animate-none"
      >
        <span className="mb-1 flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground ring-8 ring-accent/40">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <p className="font-display text-base font-semibold tracking-snug text-foreground">{copy.title}</p>
        <p className="max-w-md text-sm text-muted-foreground">{copy.body}</p>
      </Card>
    </div>
  );
}
