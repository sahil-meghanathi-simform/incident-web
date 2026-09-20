// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { ErrorState } from '../../../components/ui/ErrorState';
import { useToast } from '../../../components/ui/useToast';
import { IncidentForm } from '../components/IncidentForm';
import { ReportFormSkeleton } from '../components/ReportFormSkeleton';
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
  const toast = useToast();
  const { user } = useAuth();
  const typesQuery = useIncidentTypes();
  const createIncidentMutation = useCreateIncident();

  async function handleSubmit(values: CreateIncidentRequest): Promise<void> {
    const receipt = await createIncidentMutation.mutateAsync(values);
    toast.show(LABELS.incidents.reportSubmittedToast(receipt.reference), 'success');
    navigate(`${ROUTES.incidentNewSubmitted}?ref=${encodeURIComponent(receipt.reference)}`, {
      state: { receipt },
    });
  }

  // Covers both the types request and the brief window before the session user is known.
  const isLoading = typesQuery.isPending || (typesQuery.isSuccess && !user);

  return (
    <PageContainer size="narrow" isFullHeight>
      <PageHeader icon={FilePlus} title={LABELS.incidents.reportTitle} description={LABELS.incidents.reportDescription} />
      {isLoading && <ReportFormSkeleton />}
      {typesQuery.isError && (
        <ErrorState message={LABELS.incidents.loadFormError} onRetry={() => typesQuery.refetch()} />
      )}
      {typesQuery.data && user && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-smooth md:flex md:min-h-0 md:flex-1 md:flex-col">
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
