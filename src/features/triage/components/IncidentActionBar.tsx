import { useState, type ReactElement } from 'react';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useToast } from '../../../components/ui/useToast';
import { useTriageIncident } from '../hooks/useTriageIncident';
import { useUnassignInvestigator } from '../hooks/useUnassignInvestigator';
import { AcknowledgeButton } from './AcknowledgeButton';
import { ChangeSeverityModal } from './ChangeSeverityModal';
import { AssignInvestigatorDrawer } from './AssignInvestigatorDrawer';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { LABELS } from '../../../lib/labels';
import type { IncidentDetail } from '../../incidents/types/incident.type';

type IncidentActionBarProps = Readonly<{
  incident: IncidentDetail;
}>;

/**
 * Driven entirely by `_actions` — a UI hint only; every action endpoint re-checks
 * server-side (§8.1). `_actions` has no dedicated `canChangeSeverity` flag: its own
 * server-side guard (canManage + stage !== CLOSED) is identical to `canAssign`'s, so
 * that flag doubles as the proxy here — split it out if the two guards ever diverge.
 */
export function IncidentActionBar({ incident }: IncidentActionBarProps): ReactElement | null {
  const { show } = useToast();
  const [severityModalOpen, setSeverityModalOpen] = useState(false);
  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false);
  const [unassignConfirmOpen, setUnassignConfirmOpen] = useState(false);

  const triageMutation = useTriageIncident(incident.id);
  const unassignMutation = useUnassignInvestigator(incident.id);

  const { canTriage, canAssign, canAcknowledge } = incident._actions;
  const canChangeSeverity = canAssign;

  if (!canTriage && !canAssign && !canAcknowledge) return null;

  async function handleTriage(): Promise<void> {
    try {
      await triageMutation.mutateAsync(incident.version);
      show(LABELS.triage.triagedToast, 'success');
    } catch (err) {
      show(getErrorMessage(err), 'error');
    }
  }

  async function handleUnassign(): Promise<void> {
    try {
      await unassignMutation.mutateAsync(incident.version);
      show(LABELS.triage.unassignedToast, 'success');
    } catch (err) {
      show(getErrorMessage(err), 'error');
    } finally {
      setUnassignConfirmOpen(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2 border-b border-border py-3">
      {canTriage && (
        <Button variant="outline" onClick={handleTriage} isLoading={triageMutation.isPending}>
          {LABELS.triage.triageAction}
        </Button>
      )}
      {canAcknowledge && <AcknowledgeButton incidentId={incident.id} version={incident.version} />}
      {canChangeSeverity && (
        <Button variant="outline" onClick={() => setSeverityModalOpen(true)}>
          {LABELS.triage.changeSeverity}
        </Button>
      )}
      {canAssign && (
        <Button variant="outline" onClick={() => setAssignDrawerOpen(true)}>
          {incident.assignedInvestigator ? LABELS.triage.reassign : LABELS.triage.assign}
        </Button>
      )}
      {canAssign && incident.assignedInvestigator && (
        <Button variant="ghost" onClick={() => setUnassignConfirmOpen(true)}>
          {LABELS.triage.unassign}
        </Button>
      )}

      {severityModalOpen && (
        <ChangeSeverityModal incident={incident} isOpen={severityModalOpen} onClose={() => setSeverityModalOpen(false)} />
      )}
      {assignDrawerOpen && (
        <AssignInvestigatorDrawer incident={incident} isOpen={assignDrawerOpen} onClose={() => setAssignDrawerOpen(false)} />
      )}
      <ConfirmDialog
        isOpen={unassignConfirmOpen}
        title={LABELS.triage.unassignConfirmTitle}
        description={LABELS.triage.unassignConfirmBody}
        confirmLabel={LABELS.triage.unassign}
        isDanger
        isLoading={unassignMutation.isPending}
        onConfirm={handleUnassign}
        onCancel={() => setUnassignConfirmOpen(false)}
      />
    </div>
  );
}
