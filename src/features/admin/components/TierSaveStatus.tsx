// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { AlertCircle, CheckCircle2, CircleDot } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

type TierSaveStatusProps = Readonly<{
  unsavedCount: number;
  isValid: boolean;
}>;

/** Icon + words for the save bar's state — never colour alone. */
export function TierSaveStatus({ unsavedCount, isValid }: TierSaveStatusProps): ReactElement {
  if (!isValid) {
    return (
      <p role="alert" className="flex items-center gap-2 text-sm font-medium text-destructive">
        <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
        {LABELS.admin.tierSaveDisabledReason}
      </p>
    );
  }
  const isDirty = unsavedCount > 0;
  const Icon = isDirty ? CircleDot : CheckCircle2;
  return (
    <p role="status" className={cn('flex items-center gap-2 text-sm', isDirty ? 'font-medium text-warning' : 'text-muted-foreground')}>
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {isDirty ? LABELS.admin.unsavedChanges(unsavedCount) : LABELS.admin.noUnsavedChanges}
    </p>
  );
}
