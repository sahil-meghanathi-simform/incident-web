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
import type { CreateIncidentRequest } from '../schemas/incident.schema';

export default function ReportIncidentPage() {
  useDocumentTitle('Report Incident');
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
      <PageHeader
        title="Report an incident"
        description="Fill in what you know — invalid input is rejected before it reaches anyone."
      />
      {typesQuery.isPending && (
        <div className="max-w-xl space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}
      {typesQuery.isError && (
        <ErrorState message="Could not load the report form." onRetry={() => typesQuery.refetch()} />
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
