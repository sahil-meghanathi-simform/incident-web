// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, List, ShieldCheck, UserRound } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ReportIncidentButton } from '../../incidents/components/ReportIncidentButton';
import { cn } from '../../../lib/cn';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

// Glass chip on the plum gradient — the same treatment as the login showcase.
const CHIP_CLASS =
  'inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-xs font-medium text-primary-foreground ring-1 ring-primary-foreground/20';

// On the dark band the default plum focus ring would vanish — swap to cream.
const ON_DARK_FOCUS = 'focus-visible:outline-primary-foreground! focus-visible:ring-primary-foreground focus-visible:ring-offset-brand-deep';

/** The dashboard's welcome band: greeting, the viewer's access chips and the two
 * actions everyone has. It carries the page's single <h1>. */
export function DashboardHero(): ReactElement {
  const { user } = useAuth();

  return (
    <section
      aria-labelledby="dashboard-greeting"
      className="relative isolate mb-6 overflow-hidden rounded-xl bg-brand-deep bg-linear-to-br from-foreground via-brand-deep to-primary px-5 py-6 text-primary-foreground shadow-md animate-in fade-in slide-in-from-bottom-1 duration-300 motion-reduce:animate-none sm:mb-8 sm:px-8 sm:py-8"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-24 -z-10 size-72 rounded-full bg-primary-foreground/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-28 -left-16 -z-10 size-80 rounded-full bg-primary/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="font-display text-xs font-semibold uppercase tracking-caps text-primary-foreground/90">
            {LABELS.dashboard.heroEyebrow}
          </p>
          <h1 id="dashboard-greeting" className="mt-1.5 font-display text-2xl font-semibold tracking-display sm:text-3xl">
            {user ? LABELS.dashboard.greeting(user.displayName) : LABELS.dashboard.pageTitle}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-foreground/90">{LABELS.dashboard.description}</p>

          {user && (
            <ul aria-label={LABELS.dashboard.heroChipsLabel} className="mt-4 flex flex-wrap gap-2">
              <li className={CHIP_CLASS}>
                <UserRound className="size-3.5" aria-hidden="true" />
                {LABELS.nav.roleLabel[user.role]}
              </li>
              <li className={CHIP_CLASS}>
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                {LABELS.nav.clearanceLevel(user.clearanceLevel)}
              </li>
            </ul>
          )}
        </div>

        <div aria-label={LABELS.dashboard.heroActionsLabel} role="group" className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
          <ReportIncidentButton
            size="lg"
            icon={FilePlus}
            label={LABELS.dashboard.reportIncident}
            className={cn('bg-primary-foreground text-brand-deep shadow-sm hover:bg-primary-foreground/90 hover:shadow-md', ON_DARK_FOCUS)}
          />
          <Button
            asChild
            size="lg"
            variant="ghost"
            className={cn('bg-primary-foreground/10 text-primary-foreground ring-1 ring-primary-foreground/25 hover:bg-primary-foreground/20', ON_DARK_FOCUS)}
          >
            <Link to={ROUTES.incidents}>
              <List aria-hidden="true" />
              {LABELS.dashboard.viewIncidents}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
