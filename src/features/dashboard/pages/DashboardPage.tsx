import type { ReactElement } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StageSummaryCard } from '../components/StageSummaryCard';
import { RecentEscalationsCard } from '../components/RecentEscalationsCard';
import { QuickLinksCard } from '../components/QuickLinksCard';
import { useAuth } from '../../../hooks/useAuth';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { LABELS } from '../../../lib/labels';

/** The app's front door — was a ComingSoon placeholder. Composes existing
 * endpoints only (incident summary, escalation feed); no backend change. */
export function DashboardPage(): ReactElement {
  useDocumentTitle(LABELS.dashboard.pageTitle);
  const { user } = useAuth();

  return (
    <PageContainer>
      <PageHeader
        title={user ? LABELS.dashboard.greeting(user.displayName) : LABELS.dashboard.pageTitle}
        description={LABELS.dashboard.description}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <StageSummaryCard />
        </div>
        <QuickLinksCard />
        <RecentEscalationsCard />
      </div>
    </PageContainer>
  );
}
