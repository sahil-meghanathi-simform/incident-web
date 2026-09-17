import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Skeleton } from '../../../components/ui/Skeleton';
import { ErrorState } from '../../../components/ui/ErrorState';
import { IncidentForm } from '../components/IncidentForm';
import { useIncidentTypes } from '../hooks/useIncidentTypes';
import { useCreateIncident } from '../hooks/useCreateIncident';
import { useAuth } from '../../../hooks/useAuth';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';
import type { CreateIncidentRequest } from '../schemas/incident.schema';

export function ReportIncidentPage(): ReactElement {
  useDocumentTitle(LABELS.incidents.reportPageTitle);
  const navigate = useNavigate();
  const { user } = useAuth();
  const typesQuery = useIncidentTypes();
  const createIncidentMutation = useCreateIncident();

  async function handleSubmit(values: CreateIncidentRequest): Promise<void> {
    const receipt = await createIncidentMutation.mutateAsync(values);
    navigate(`${ROUTES.incidentNewSubmitted}?ref=${encodeURIComponent(receipt.reference)}`, {
      state: { receipt },
    });
  }

  return (
    <PageContainer>
      <PageHeader title={LABELS.incidents.reportTitle} description={LABELS.incidents.reportDescription} />
      {typesQuery.isPending && (
        <div role="status" className="max-w-xl space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
          <span className="sr-only">Loading…</span>
        </div>
      )}
      {typesQuery.isError && (
        <ErrorState message={LABELS.incidents.loadFormError} onRetry={() => typesQuery.refetch()} />
      )}
      {typesQuery.data && user && (
        <div className="max-w-xl">
          <IncidentForm
            typeOptions={typesQuery.data.types}
            severityOptions={typesQuery.data.severities}
            userClearance={user.clearanceLevel}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </PageContainer>
  );
}
