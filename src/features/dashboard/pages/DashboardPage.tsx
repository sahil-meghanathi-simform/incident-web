// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DashboardHero } from '../components/DashboardHero';
import { StageSummaryCard } from '../components/StageSummaryCard';
import { RecentEscalationsCard } from '../components/RecentEscalationsCard';
import { QuickLinksCard } from '../components/QuickLinksCard';
import { AdminLinksCard } from '../components/AdminLinksCard';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { usePermissions } from '../../../hooks/usePermissions';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

/** The app's front door. Composes existing endpoints only (incident summary,
 * escalation feed); no backend change. The hero carries the page's <h1>.
 *
 * Grid: 1 column on phones, 2 from md, 3 from xl. Escalations take two columns;
 * the link cards fill the rest so no breakpoint leaves a lone half-width card. */
export function DashboardPage(): ReactElement {
  useDocumentTitle(LABELS.dashboard.pageTitle);
  const { canAdminister } = usePermissions();

  return (
    <PageContainer size="wide">
      <DashboardHero />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 sm:gap-6">
        <div className="md:col-span-2 xl:col-span-3">
          <StageSummaryCard />
        </div>
        <RecentEscalationsCard className={cn('md:col-span-2', canAdminister && 'xl:row-span-2')} />
        <QuickLinksCard className={cn(!canAdminister && 'md:col-span-2 xl:col-span-1')} />
        {canAdminister && <AdminLinksCard />}
      </div>
    </PageContainer>
  );
}
