import { type ReactElement } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { SkeletonCard } from '../../../components/ui/SkeletonCard';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Tabs, type TabItem } from '../../../components/ui/Tabs';
import { TextLink } from '../../../components/ui/TextLink';
import { AccessRevokedNotice } from '../../../components/feedback/AccessRevokedNotice';
import { IncidentDetailHeader } from '../components/IncidentDetailHeader';
import { IncidentOverviewTab } from '../components/IncidentOverviewTab';
import { IncidentActionBar } from '../../triage/components/IncidentActionBar';
import { NotesPanel } from '../../investigation/components/NotesPanel';
import { useIncident } from '../hooks/useIncident';
import { useAccessRevoked } from '../hooks/useAccessRevoked';
import { isApiError } from '../../../api/ApiError';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';
import type { IncidentDetail } from '../types/incident.type';

const BASE_TABS: readonly TabItem[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'timeline', label: 'Timeline' },
];

/**
 * §10.2: the Notes tab isn't merely disabled without access — it is absent entirely.
 * A force-navigated `?tab=notes` still resolves through NotesPanel's own gate below,
 * which renders NotesRestrictedNotice rather than faking the tab open.
 */
function tabsFor(incident: IncidentDetail): readonly TabItem[] {
  const canSeeNotesTab = incident._actions.canReadNotes || incident._actions.canAddNote;
  return canSeeNotesTab ? [...BASE_TABS, { key: 'notes', label: LABELS.investigation.notesTab }] : BASE_TABS;
}

type IncidentDetailBodyProps = Readonly<{
  incident: IncidentDetail;
}>;

/** Tab state lives in the URL (§10.2's `/incidents/:id?tab=notes`), split out so the
 * outer page stays a plain load/error/access switchboard. */
function IncidentDetailBody({ incident }: IncidentDetailBodyProps): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabs = tabsFor(incident);
  const requested = searchParams.get('tab');
  // A force-navigated `?tab=notes` still resolves to the Notes body even when the tab
  // isn't in the clickable strip (§10.2) — NotesPanel does its own gating and renders
  // NotesRestrictedNotice rather than this page silently redirecting to Overview,
  // which would be indistinguishable from the incident having no notes at all.
  const activeTab =
    requested === 'notes' ? 'notes' : tabs.some((t) => t.key === requested) ? (requested as string) : (tabs[0]?.key ?? 'overview');

  function setTab(key: string): void {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', key);
        return next;
      },
      { replace: true },
    );
  }

  return (
    <>
      <IncidentDetailHeader incident={incident} />
      <IncidentActionBar incident={incident} />
      <Tabs tabs={tabs} activeKey={activeTab} onChange={setTab} />
      {activeTab === 'overview' && <IncidentOverviewTab incident={incident} />}
      {activeTab === 'timeline' && <p className="py-6 text-sm text-slate-500">The timeline lands in a later module.</p>}
      {activeTab === 'notes' && <NotesPanel incident={incident} />}
    </>
  );
}

export function IncidentDetailPage(): ReactElement {
  const { id = '' } = useParams<{ id: string }>();
  useDocumentTitle('Incident');
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

      {/*
       * query.data deliberately does NOT clear on a failed refetch (TanStack Query
       * keeps the last successful value around), so a mutation that flips this
       * incident from visible to 403 for the ACTING user (e.g. a self-inflicted
       * severity raise, Module 4) would otherwise render the stale header/action
       * bar/tabs — including a still-open mutation modal — underneath the
       * AccessRevokedNotice banner. Gating on !accessRevoked here is what actually
       * makes the "swaps in place" comment above true for a live refetch, not only a
       * fresh navigation that never had data to begin with.
       */}
      {query.data && !accessRevoked && <IncidentDetailBody incident={query.data} />}
    </PageContainer>
  );
}
