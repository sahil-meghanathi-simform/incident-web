import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SkeletonCard } from '../../../components/ui/SkeletonCard';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Tabs } from '../../../components/ui/Tabs';
import { AccessRevokedNotice } from '../../../components/feedback/AccessRevokedNotice';
import { IncidentDetailHeader } from '../components/IncidentDetailHeader';
import { IncidentOverviewTab } from '../components/IncidentOverviewTab';
import { useIncident } from '../hooks/useIncident';
import { useAccessRevoked } from '../hooks/useAccessRevoked';
import { isApiError } from '../../../api/ApiError';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { ROUTES } from '../../../app/routes';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'notes', label: 'Notes' },
];

export default function IncidentDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  useDocumentTitle('Incident');
  const [tab, setTab] = useState('overview');
  const query = useIncident(id);
  const accessRevoked = useAccessRevoked(query.error);
  const notFound = isApiError(query.error) && query.error.status === 404;

  return (
    <PageContainer>
      {query.isPending && <SkeletonCard />}

      {/* A 403 arriving on a focus-refetch (Q10) swaps the body in place — the user
          never gets navigated away, so they see exactly what happened. */}
      {accessRevoked && <AccessRevokedNotice />}

      {notFound && (
        <EmptyState
          title="Incident not found"
          body="It may have been removed, or the link is incorrect."
          action={
            <Link to={ROUTES.incidents} className="text-sm font-medium text-blue-600 hover:underline">
              Back to incident list
            </Link>
          }
        />
      )}

      {query.isError && !accessRevoked && !notFound && (
        <ErrorState message="Could not load this incident." onRetry={() => query.refetch()} />
      )}

      {query.data && (
        <>
          <IncidentDetailHeader incident={query.data} />
          <Tabs tabs={TABS} activeKey={tab} onChange={setTab} />
          {tab === 'overview' && <IncidentOverviewTab incident={query.data} />}
          {tab === 'timeline' && (
            <p className="py-6 text-sm text-slate-500">The timeline lands in a later module.</p>
          )}
          {tab === 'notes' && <p className="py-6 text-sm text-slate-500">Notes land in a later module.</p>}
        </>
      )}
    </PageContainer>
  );
}
