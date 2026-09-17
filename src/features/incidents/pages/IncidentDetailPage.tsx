import { useState, type ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SkeletonCard } from '../../../components/ui/SkeletonCard';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Tabs } from '../../../components/ui/Tabs';
import { TextLink } from '../../../components/ui/TextLink';
import { AccessRevokedNotice } from '../../../components/feedback/AccessRevokedNotice';
import { IncidentDetailHeader } from '../components/IncidentDetailHeader';
import { IncidentOverviewTab } from '../components/IncidentOverviewTab';
import { useIncident } from '../hooks/useIncident';
import { useAccessRevoked } from '../hooks/useAccessRevoked';
import { isApiError } from '../../../api/ApiError';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'notes', label: 'Notes' },
];

export function IncidentDetailPage(): ReactElement {
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
          title={LABELS.incidents.notFoundTitle}
          body={LABELS.incidents.notFoundBody}
          action={<TextLink to={ROUTES.incidents}>{LABELS.incidents.backToList}</TextLink>}
        />
      )}

      {query.isError && !accessRevoked && !notFound && (
        <ErrorState message={LABELS.incidents.loadDetailError} onRetry={() => query.refetch()} />
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
