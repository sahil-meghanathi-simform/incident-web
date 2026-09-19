import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { SlaCountdown } from '../../../components/ui/SlaCountdown';
import { TextLink } from '../../../components/ui/TextLink';
import { useEscalationFeed } from '../../escalations/hooks/useEscalationFeed';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

const PREVIEW_COUNT = 5;

/** Composite shared component: owns its own query, like NotificationBell.
 * Shows only the first PREVIEW_COUNT rows of the same feed /escalations uses in
 * full — "View all" is the one route to the real, paginated screen. */
export function RecentEscalationsCard(): ReactElement {
  const query = useEscalationFeed();
  const items = (query.data?.pages[0]?.items ?? []).slice(0, PREVIEW_COUNT);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{LABELS.dashboard.recentEscalationsTitle}</CardTitle>
        <CardDescription>{LABELS.dashboard.recentEscalationsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {query.isPending && (
          <div role="status" className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <span className="sr-only">Loading…</span>
          </div>
        )}
        {query.isError && <ErrorState message={LABELS.dashboard.loadEscalationsError} onRetry={() => query.refetch()} />}
        {query.isSuccess && items.length === 0 && <EmptyState title={LABELS.dashboard.noEscalations} body={LABELS.dashboard.recentEscalationsDescription} />}
        {items.length > 0 && (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.incidentId} className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted p-2.5">
                <div className="min-w-0">
                  <Link to={ROUTES.incidentDetail(item.incidentId)} className="truncate font-mono text-xs text-primary hover:underline">
                    {item.incidentReference}
                  </Link>
                  <p className="truncate text-sm text-foreground-soft">{item.incidentTitle}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <SeverityBadge severity={item.severity} />
                  <SlaCountdown dueAt={item.dueAt} />
                </div>
              </li>
            ))}
          </ul>
        )}
        <TextLink to={ROUTES.escalations}>{LABELS.dashboard.viewAllEscalations}</TextLink>
      </CardContent>
    </Card>
  );
}
