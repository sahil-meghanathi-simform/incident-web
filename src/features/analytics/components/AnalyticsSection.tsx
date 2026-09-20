// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useId, type ReactElement, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader } from '../../../components/ui/Card';
import { BusyRegion } from '../../../components/ui/BusyRegion';
import { cn } from '../../../lib/cn';

type AnalyticsSectionProps = Readonly<{
  title: string;
  description?: string | undefined;
  icon: LucideIcon;
  /** True while stale data is shown and the new period's data is on its way. */
  isBusy?: boolean;
  children: ReactNode;
  className?: string;
}>;

/** One titled analytics panel. Each section owns its own query state, so a slow
 * trend query dims only the chart, never the whole page. */
export function AnalyticsSection({ title, description, icon: Icon, isBusy = false, children, className }: AnalyticsSectionProps): ReactElement {
  const headingId = useId();
  return (
    <Card className={cn('min-w-0', className)}>
      <section aria-labelledby={headingId}>
        <CardHeader>
          <h2 id={headingId} className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-snug text-foreground">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground ring-1 ring-primary/10">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            {title}
          </h2>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <BusyRegion isBusy={isBusy}>{children}</BusyRegion>
        </CardContent>
      </section>
    </Card>
  );
}
