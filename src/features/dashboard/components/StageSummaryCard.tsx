// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { ErrorState } from '../../../components/ui/ErrorState';
import { useIncidentSummary } from '../../incidents/hooks/useIncidentSummary';
import { STAGE_ORDER, STAGE_LABEL, STAGE_DOT_CLASS, type Stage } from '../../../lib/stage';
import { ROUTES } from '../../../app/routes';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

// Five tiles: 2 columns on phones, 3 on tablets, 5 in one row from lg. The last
// tile spans two columns below lg so neither layout leaves an orphan gap.
const GRID_CLASS = 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5';
const LAST_TILE_CLASS = 'col-span-2 lg:col-span-1';

function stageHref(stage: Stage): string {
  return `${ROUTES.incidents}?stage=${stage}`;
}

/** Composite shared component: owns its own query, like NotificationBell. Each
 * tile opens the incident list pre-filtered to that stage. */
export function StageSummaryCard(): ReactElement {
  const query = useIncidentSummary();
  const total = query.data ? STAGE_ORDER.reduce((sum, stage) => sum + (query.data.counts[stage] ?? 0), 0) : null;
  const lastStage = STAGE_ORDER.at(-1);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <CardTitle>
            <Layers className="size-4 text-primary" aria-hidden="true" />
            {LABELS.dashboard.byStageTitle}
          </CardTitle>
          <CardDescription>{LABELS.dashboard.byStageDescription}</CardDescription>
        </div>
        {total !== null && <Badge tone="neutral">{LABELS.dashboard.stageTotal(total)}</Badge>}
      </CardHeader>
      <CardContent>
        {query.isPending && (
          <div role="status" className={GRID_CLASS}>
            {STAGE_ORDER.map((stage) => (
              <div
                key={stage}
                className={cn('space-y-3 rounded-xl border border-border bg-muted/40 p-4', stage === lastStage && LAST_TILE_CLASS)}
              >
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-12" />
              </div>
            ))}
            <span className="sr-only">{LABELS.chrome.loading}</span>
          </div>
        )}
        {query.isError && (
          <ErrorState message={LABELS.dashboard.loadSummaryError} requestId={query.error.requestId} onRetry={() => query.refetch()} />
        )}
        {query.data && (
          <ul className={GRID_CLASS}>
            {STAGE_ORDER.map((stage) => {
              const count = query.data.counts[stage] ?? 0;
              return (
                <li key={stage} className={cn(stage === lastStage && LAST_TILE_CLASS)}>
                  <Link
                    to={stageHref(stage)}
                    aria-label={LABELS.dashboard.stageTileLabel(STAGE_LABEL[stage], count)}
                    className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xs transition-[box-shadow,border-color,transform] duration-200 ease-smooth hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2 text-xs font-medium text-muted-foreground">
                        <span className={cn('size-2 shrink-0 rounded-full', STAGE_DOT_CLASS[stage])} aria-hidden="true" />
                        <span className="truncate">{STAGE_LABEL[stage]}</span>
                      </span>
                      <ArrowUpRight
                        className="size-3.5 shrink-0 text-foreground-faint transition-colors group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="font-display text-3xl font-semibold tabular-nums leading-none text-foreground">{count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
