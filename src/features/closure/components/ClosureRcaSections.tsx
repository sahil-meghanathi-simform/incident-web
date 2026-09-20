// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Lightbulb, Wrench } from 'lucide-react';
import { LABELS } from '../../../lib/labels';
import type { IncidentDetail } from '../../incidents/types/incident.type';

type ClosureRcaSectionsProps = Readonly<{
  incident: Pick<IncidentDetail, 'rootCause' | 'correctiveAction'>;
}>;

/** The read-only root cause / corrective action pair shared by the review panel and
 * the closed summary. Each body stays ONE whitespace-preserving <p>, so multi-line RCA
 * text renders as written and remains a single text node. */
export function ClosureRcaSections({ incident }: ClosureRcaSectionsProps): ReactElement {
  const sections = [
    { key: 'root-cause', icon: Lightbulb, title: LABELS.closure.rootCauseLabel, body: incident.rootCause },
    {
      key: 'corrective-action',
      icon: Wrench,
      title: LABELS.closure.correctiveActionLabel,
      body: incident.correctiveAction,
    },
  ] as const;

  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
      {sections.map(({ key, icon: Icon, title, body }) => (
        <section key={key} className="space-y-2 bg-card p-4">
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-caps text-muted-foreground">
            <Icon className="size-3.5 text-primary" aria-hidden="true" />
            {title}
          </h3>
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">{body}</p>
        </section>
      ))}
    </div>
  );
}
