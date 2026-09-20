// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useState, type ReactElement } from 'react';
import { CircleArrowRight, Gauge, UserCog, UserMinus, UserPlus } from 'lucide-react';
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

type PrimaryAction = 'triage' | 'acknowledge' | 'assign' | null;

/** The one action worth leading with: moving a fresh report along, then silencing an
 * escalation, then getting an unassigned incident into someone's hands. Everything
 * else stays outline so the bar never has two competing calls to action. */
function primaryActionFor(incident: IncidentDetail): PrimaryAction {
  const { canTriage, canAcknowledge, canAssign } = incident._actions;
  if (canTriage) return 'triage';
  if (canAcknowledge) return 'acknowledge';
  if (canAssign && !incident.assignedInvestigator) return 'assign';
  return null;
}

/**
 * Driven entirely by `_actions` — a UI hint only; every action endpoint re-checks
 * server-side (§8.1). `_actions` has no dedicated `canChangeSeverity` flag: its own
 * server-side guard (canManage + stage !== CLOSED) is identical to `canAssign`'s, so
 * that flag doubles as the proxy here — split it out if the two guards ever diverge.
 *
 * Below `md` the bar docks to the bottom of the viewport with horizontally scrolling
 * buttons, so the actions stay in thumb reach while the tabs scroll underneath.
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

  const primary = primaryActionFor(incident);
  const isAssigned = Boolean(incident.assignedInvestigator);

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
    <section
      aria-label={LABELS.triage.actionsRegionLabel}
      className="mb-4 flex items-center gap-3 md:rounded-xl md:border md:border-border md:bg-card md:px-4 md:py-3 md:shadow-sm max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-30 max-md:border-t max-md:border-border max-md:bg-card/95 max-md:p-3 max-md:shadow-lg max-md:backdrop-blur animate-in fade-in duration-300 motion-reduce:animate-none"
    >
      <span className="shrink-0 text-xs font-semibold uppercase tracking-caps text-muted-foreground max-md:sr-only">
        {LABELS.triage.actionsHeading}
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-2 max-md:-my-1 max-md:overflow-x-auto max-md:overscroll-x-contain max-md:py-1 md:flex-wrap">
        {canTriage && (
          <Button
            variant={primary === 'triage' ? 'default' : 'outline'}
            onClick={handleTriage}
            isLoading={triageMutation.isPending}
          >
            {!triageMutation.isPending && <CircleArrowRight aria-hidden="true" />}
            {LABELS.triage.triageAction}
          </Button>
        )}
        {canAcknowledge && (
          <AcknowledgeButton
            incidentId={incident.id}
            version={incident.version}
            variant={primary === 'acknowledge' ? 'default' : 'outline'}
          />
        )}
        {canAssign && (
          <Button variant={primary === 'assign' ? 'default' : 'outline'} onClick={() => setAssignDrawerOpen(true)}>
            {isAssigned ? <UserCog aria-hidden="true" /> : <UserPlus aria-hidden="true" />}
            {isAssigned ? LABELS.triage.reassign : LABELS.triage.assign}
          </Button>
        )}
        {canChangeSeverity && (
          <Button variant="outline" onClick={() => setSeverityModalOpen(true)}>
            <Gauge aria-hidden="true" />
            {LABELS.triage.changeSeverity}
          </Button>
        )}
        {canAssign && isAssigned && (
          <div className="flex shrink-0 items-center gap-2 border-l border-border pl-2 md:ml-auto">
            <Button
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setUnassignConfirmOpen(true)}
              isLoading={unassignMutation.isPending}
            >
              {!unassignMutation.isPending && <UserMinus aria-hidden="true" />}
              {LABELS.triage.unassign}
            </Button>
          </div>
        )}
      </div>

      {severityModalOpen && (
        <ChangeSeverityModal incident={incident} isOpen={severityModalOpen} onClose={() => setSeverityModalOpen(false)} />
      )}
      {assignDrawerOpen && (
        <AssignInvestigatorDrawer incident={incident} isOpen={assignDrawerOpen} onClose={() => setAssignDrawerOpen(false)} />
      )}
      {unassignConfirmOpen && (
        <ConfirmDialog
          isOpen={unassignConfirmOpen}
          title={LABELS.triage.unassignConfirmTitle}
          description={LABELS.triage.unassignConfirmBody}
          confirmLabel={LABELS.triage.unassign}
          isDanger
          isLoading={unassignMutation.isPending}
          onConfirm={() => void handleUnassign()}
          onCancel={() => setUnassignConfirmOpen(false)}
        />
      )}
    </section>
  );
}
