import { useState, type ReactElement } from 'react';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useToast } from '../../../components/ui/useToast';
import { useApproveClosure } from '../hooks/useApproveClosure';
import { RejectClosureDialog } from './RejectClosureDialog';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { LABELS } from '../../../lib/labels';
import type { IncidentDetail } from '../../incidents/types/incident.type';

type ClosureReviewPanelProps = Readonly<{
  incident: IncidentDetail;
}>;

/**
 * A manager's read-only review of the proposed RCA (build-plan.md §Module 6). The
 * assignee sees this same read-only text while their proposal is under review — only
 * `_actions.canApproveClosure` gates the Approve/Request-changes buttons themselves;
 * the server re-checks both on every call regardless of what this screen shows.
 */
export function ClosureReviewPanel({ incident }: ClosureReviewPanelProps): ReactElement {
  const { show } = useToast();
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const approveMutation = useApproveClosure(incident.id);

  async function handleApprove(): Promise<void> {
    try {
      await approveMutation.mutateAsync(incident.version);
      show(LABELS.closure.approvedToast, 'success');
    } catch (err) {
      show(getErrorMessage(err), 'error');
    } finally {
      setApproveConfirmOpen(false);
    }
  }

  return (
    <div className="space-y-4 py-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground-soft">{LABELS.closure.reviewTitle}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{LABELS.closure.reviewDescription}</p>
      </div>

      <div className="space-y-3 rounded-md border border-border bg-muted p-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">{LABELS.closure.rootCauseLabel}</h3>
          <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{incident.rootCause}</p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
            {LABELS.closure.correctiveActionLabel}
          </h3>
          <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{incident.correctiveAction}</p>
        </div>
      </div>

      {incident._actions.canApproveClosure && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setRejectOpen(true)}>
            {LABELS.closure.requestChangesAction}
          </Button>
          <Button onClick={() => setApproveConfirmOpen(true)}>{LABELS.closure.approveAction}</Button>
        </div>
      )}

      <ConfirmDialog
        isOpen={approveConfirmOpen}
        title={LABELS.closure.approveConfirmTitle}
        description={LABELS.closure.approveConfirmBody}
        confirmLabel={LABELS.closure.approveAction}
        isLoading={approveMutation.isPending}
        onConfirm={() => void handleApprove()}
        onCancel={() => setApproveConfirmOpen(false)}
      />
      {rejectOpen && <RejectClosureDialog incident={incident} isOpen={rejectOpen} onClose={() => setRejectOpen(false)} />}
    </div>
  );
}
