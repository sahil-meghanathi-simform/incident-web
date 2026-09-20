// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Card } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { LABELS } from '../../../lib/labels';

const STEP_SLOTS = ['reported', 'triage', 'investigation', 'pending', 'closed'] as const;
const TAB_SLOTS = ['overview', 'timeline', 'notes'] as const;
const META_SLOTS = ['type', 'reporter', 'assignee', 'created', 'updated'] as const;

/** The detail page's own silhouette — breadcrumb, reference and title, badge pills,
 * stage progress, action row, tab strip and the two-column body. */
export function IncidentDetailSkeleton(): ReactElement {
  return (
    <div role="status" className="space-y-5">
      <div aria-hidden="true" className="space-y-5">
        <Skeleton className="h-4 w-48" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-8 w-72 max-w-full" />
          </div>
          <div className="flex gap-2 sm:pt-8">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
        <div className="flex gap-2 overflow-hidden">
          {STEP_SLOTS.map((slot) => (
            <Skeleton key={slot} className="h-6 w-24 shrink-0 rounded-full" />
          ))}
        </div>
        <div className="flex gap-2 border-y border-border py-3">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex gap-4 border-b border-border pb-2.5">
          {TAB_SLOTS.map((slot) => (
            <Skeleton key={slot} className="h-5 w-20" />
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="space-y-3 p-5 lg:col-span-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
          <Card className="order-first space-y-4 p-5 lg:order-none">
            {META_SLOTS.map((slot) => (
              <div key={slot} className="flex gap-3">
                <Skeleton className="size-8 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
      <span className="sr-only">{LABELS.incidents.detail.loading}</span>
    </div>
  );
}
