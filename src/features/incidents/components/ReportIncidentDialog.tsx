// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useState, type ReactElement } from 'react';
import { CircleCheck, FilePlus } from 'lucide-react';
import { FormDialog } from '../../../components/ui/FormDialog';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { ErrorState } from '../../../components/ui/ErrorState';
import { Button } from '../../../components/ui/Button';
import { IncidentForm } from './IncidentForm';
import { ReportFormSkeleton } from './ReportFormSkeleton';
import { ReportSubmittedPanel } from './ReportSubmittedPanel';
import { useIncidentTypes } from '../hooks/useIncidentTypes';
import { useCreateIncident } from '../hooks/useCreateIncident';
import { useAuth } from '../../../hooks/useAuth';
import { LABELS } from '../../../lib/labels';
import type { IncidentFormValues } from '../schemas/incident.schema';
import type { IncidentReceipt } from '../types/incident.type';

type ReportIncidentDialogProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
}>;

const COPY = LABELS.incidents;

/**
 * Reporting an incident, as a dialog over whatever the reporter was already
 * looking at — the list they were scanning, the dashboard they landed on — so
 * filing one never costs them their place. It carries the whole flow: the form,
 * and the receipt that replaces it once the report is in, without a second screen.
 */
export function ReportIncidentDialog({ isOpen, onClose }: ReportIncidentDialogProps): ReactElement {
  const { user } = useAuth();
  const typesQuery = useIncidentTypes();
  const createIncidentMutation = useCreateIncident();
  const [receipt, setReceipt] = useState<IncidentReceipt | null>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);

  async function handleSubmit({ image, ...body }: IncidentFormValues): Promise<void> {
    setReceipt(await createIncidentMutation.mutateAsync({ body, image }));
    setIsFormDirty(false);
  }

  // Escape and the close button run through here: a part-filled report is worth a
  // question, a submitted one (or an untouched form) is not.
  function requestClose(): void {
    if (!receipt && isFormDirty) {
      setIsDiscardOpen(true);
      return;
    }
    onClose();
  }

  function discard(): void {
    setIsDiscardOpen(false);
    onClose();
  }

  function reportAnother(): void {
    setReceipt(null);
    setIsFormDirty(false);
  }

  // Covers both the types request and the brief window before the session user is known.
  const isLoading = typesQuery.isPending || (typesQuery.isSuccess && !user);

  return (
    <>
      <FormDialog
        isOpen={isOpen}
        onClose={requestClose}
        icon={receipt ? CircleCheck : FilePlus}
        title={receipt ? COPY.receipt.title : COPY.reportTitle}
        description={receipt ? COPY.receipt.body : COPY.reportDescription}
        footer={
          receipt && (
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={reportAnother}>
                <FilePlus aria-hidden="true" />
                {COPY.reportAnother}
              </Button>
              <Button type="button" onClick={onClose}>
                {LABELS.chrome.done}
              </Button>
            </div>
          )
        }
      >
        {receipt ? (
          <ReportSubmittedPanel receipt={receipt} onNavigate={onClose} />
        ) : (
          <>
            {isLoading && <ReportFormSkeleton />}
            {typesQuery.isError && (
              <div className="p-5 sm:p-6">
                <ErrorState message={COPY.loadFormError} onRetry={() => typesQuery.refetch()} />
              </div>
            )}
            {typesQuery.data && user && (
              <IncidentForm
                typeOptions={typesQuery.data.types}
                severityOptions={typesQuery.data.severities}
                userClearance={user.clearanceLevel}
                onSubmit={handleSubmit}
                onCancel={requestClose}
                onDirtyChange={setIsFormDirty}
              />
            )}
          </>
        )}
      </FormDialog>

      {isDiscardOpen && (
        <ConfirmDialog
          isOpen={isDiscardOpen}
          title={COPY.discardReport.title}
          description={COPY.discardReport.body}
          confirmLabel={COPY.discardReport.confirm}
          isDanger
          onConfirm={discard}
          onCancel={() => setIsDiscardOpen(false)}
        />
      )}
    </>
  );
}
