// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Siren } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { EscalationBadge } from '../../../components/ui/EscalationBadge';
import { SlaCountdown } from '../../../components/ui/SlaCountdown';
import { TextLink } from '../../../components/ui/TextLink';
import { useEscalationFeed } from '../../escalations/hooks/useEscalationFeed';
import { ROUTES } from '../../../app/routes';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

type RecentEscalationsCardProps = Readonly<{ className?: string | undefined }>;

const PREVIEW_COUNT = 5;
const SKELETON_ROWS = ['a', 'b', 'c'] as const;

/** Composite shared component: owns its own query, like NotificationBell.
 * Shows only the first PREVIEW_COUNT rows of the same feed /escalations uses in
 * full — "View all" is the one route to the real, paginated screen. */
export function RecentEscalationsCard({ className }: RecentEscalationsCardProps): ReactElement {
  const query = useEscalationFeed();
  const items = (query.data?.pages[0]?.items ?? []).slice(0, PREVIEW_COUNT);

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader>
        <CardTitle>
          <Siren className="size-4 text-primary" aria-hidden="true" />
          {LABELS.dashboard.recentEscalationsTitle}
        </CardTitle>
        <CardDescription>{LABELS.dashboard.recentEscalationsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {query.isPending && (
          <div role="status" className="space-y-2">
            {SKELETON_ROWS.map((row) => (
              <div key={row} className="space-y-2 rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
            <span className="sr-only">{LABELS.chrome.loading}</span>
          </div>
        )}
        {query.isError && (
          <ErrorState message={LABELS.dashboard.loadEscalationsError} requestId={query.error.requestId} onRetry={() => query.refetch()} />
        )}
        {query.isSuccess && items.length === 0 && (
          <EmptyState
            size="sm"
            icon={CheckCircle2}
            title={LABELS.dashboard.noEscalations}
            body={LABELS.dashboard.recentEscalationsEmptyBody}
          />
        )}
        {items.length > 0 && (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.incidentId}
                className="relative rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40 hover:bg-accent/60 focus-within:bg-accent/60"
              >
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                  <Link
                    to={ROUTES.incidentDetail(item.incidentId)}
                    className="font-mono text-xs font-medium text-primary after:absolute after:inset-0 after:rounded-lg after:content-[''] hover:underline focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
                  >
                    {item.incidentReference}
                  </Link>
                  <SlaCountdown dueAt={item.dueAt} />
                </div>
                <p className="mt-1 line-clamp-2 text-sm font-medium text-foreground">{item.incidentTitle}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <SeverityBadge severity={item.severity} />
                  <EscalationBadge level={item.level} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <TextLink to={ROUTES.escalations} className="group inline-flex items-center gap-1">
          {LABELS.dashboard.viewAllEscalations}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
        </TextLink>
      </CardFooter>
    </Card>
  );
}
