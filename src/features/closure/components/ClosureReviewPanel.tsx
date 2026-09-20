// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useState, type ReactElement } from 'react';
import { CheckCircle2, ClipboardCheck, Clock, Undo2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useToast } from '../../../components/ui/useToast';
import { useApproveClosure } from '../hooks/useApproveClosure';
import { RejectClosureDialog } from './RejectClosureDialog';
import { ClosureRcaSections } from './ClosureRcaSections';
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
  const [isRejectPending, setIsRejectPending] = useState(false);
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
    <div className="py-4">
      <Card className="animate-in fade-in duration-300 motion-reduce:animate-none">
        <CardHeader className="gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle>
              <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <ClipboardCheck className="size-4" aria-hidden="true" />
              </span>
              <span>{LABELS.closure.reviewTitle}</span>
            </CardTitle>
            <CardDescription>{LABELS.closure.reviewDescription}</CardDescription>
          </div>
          <Badge tone="warning">
            <Clock className="size-3" aria-hidden="true" />
            {LABELS.closure.awaitingReview}
          </Badge>
        </CardHeader>

        <CardContent>
          <ClosureRcaSections incident={incident} />
        </CardContent>

        {incident._actions.canApproveClosure && (
          <CardFooter className="flex-col-reverse items-stretch bg-muted/40 sm:flex-row sm:items-center sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setRejectOpen(true)}
              disabled={approveMutation.isPending}
              isLoading={isRejectPending}
            >
              {!isRejectPending && <Undo2 aria-hidden="true" />}
              {LABELS.closure.requestChangesAction}
            </Button>
            <Button
              onClick={() => setApproveConfirmOpen(true)}
              disabled={isRejectPending}
              isLoading={approveMutation.isPending}
            >
              {!approveMutation.isPending && <CheckCircle2 aria-hidden="true" />}
              {LABELS.closure.approveAction}
            </Button>
          </CardFooter>
        )}
      </Card>

      <ConfirmDialog
        isOpen={approveConfirmOpen}
        title={LABELS.closure.approveConfirmTitle}
        description={LABELS.closure.approveConfirmBody}
        confirmLabel={LABELS.closure.approveAction}
        isLoading={approveMutation.isPending}
        onConfirm={() => void handleApprove()}
        onCancel={() => setApproveConfirmOpen(false)}
      />
      {rejectOpen && (
        <RejectClosureDialog
          incident={incident}
          isOpen={rejectOpen}
          onClose={() => {
            setRejectOpen(false);
            setIsRejectPending(false);
          }}
          onPendingChange={setIsRejectPending}
        />
      )}
    </div>
  );
}
