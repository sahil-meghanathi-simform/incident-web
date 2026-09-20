// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Card } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { LABELS } from '../../../lib/labels';

const SEVERITY_SLOTS = ['low', 'medium', 'high', 'critical'] as const;

function SectionHeadingSkeleton(): ReactElement {
  return (
    <div className="flex items-start gap-3">
      <Skeleton className="size-9 rounded-lg" />
      <div className="flex-1 space-y-2 pt-0.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}

/** The report form's own shape — three sections, the 2×2 severity grid, the submit
 * bar — so the real form lands without anything jumping. */
export function ReportFormSkeleton(): ReactElement {
  return (
    <div role="status">
      <Card variant="elevated" className="divide-y divide-border overflow-hidden" aria-hidden="true">
        <div className="space-y-4 p-5 sm:p-6">
          <SectionHeadingSkeleton />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-4 p-5 sm:p-6">
          <SectionHeadingSkeleton />
          <div className="grid gap-2.5 sm:grid-cols-2">
            {SEVERITY_SLOTS.map((slot) => (
              <div key={slot} className="flex gap-3 rounded-xl border border-border p-3.5">
                <Skeleton className="size-9 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4 p-5 sm:p-6">
          <SectionHeadingSkeleton />
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="flex justify-end bg-muted/40 p-5 sm:px-6">
          <Skeleton className="h-10 w-full sm:w-36" />
        </div>
      </Card>
      <span className="sr-only">{LABELS.chrome.loading}</span>
    </div>
  );
}
