// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { FileCheck, Inbox, UserSearch, type LucideIcon } from 'lucide-react';
import { LABELS } from '../../../lib/labels';

type StepId = (typeof LABELS.incidents.receipt.nextSteps)[number]['id'];

const STEP_ICON: Readonly<Record<StepId, LucideIcon>> = {
  triage: Inbox,
  investigate: UserSearch,
  close: FileCheck,
};

/** "What happens next" — the three workflow stages a report moves through. */
export function ReceiptNextSteps(): ReactElement {
  const copy = LABELS.incidents.receipt;
  return (
    <section className="space-y-3">
      <h2 className="font-display text-sm font-semibold uppercase tracking-caps text-muted-foreground">
        {copy.nextStepsTitle}
      </h2>
      <ol className="space-y-2.5">
        {copy.nextSteps.map((step) => {
          const Icon = STEP_ICON[step.id];
          return (
            <li key={step.id} className="flex items-start gap-3 text-sm text-foreground-soft">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              <span className="pt-1">{step.text}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
