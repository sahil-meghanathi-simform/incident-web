import { useState, type ReactElement } from 'react';
import { Drawer } from '../../../components/ui/Drawer';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/useToast';
import { useAssignableInvestigators } from '../hooks/useAssignableInvestigators';
import { useAssignInvestigator } from '../hooks/useAssignInvestigator';
import { InvestigatorOption } from './InvestigatorOption';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { SEVERITY_RANK } from '../../../lib/severity';
import { LABELS } from '../../../lib/labels';
import type { IncidentDetail } from '../../incidents/types/incident.type';

type AssignInvestigatorDrawerProps = Readonly<{
  incident: IncidentDetail;
  isOpen: boolean;
  onClose: () => void;
}>;

/**
 * Fetches the full active-investigator roster (minClearance=1) once and filters
 * client-side to this incident's required clearance — one request instead of two,
 * and it lets the footnote below report an accurate hidden-count without a second
 * round trip. `useSeverityImpact` reuses the same cache entry.
 */
export function AssignInvestigatorDrawer({ incident, isOpen, onClose }: AssignInvestigatorDrawerProps): ReactElement {
  const { show } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const requiredClearance = SEVERITY_RANK[incident.severity];
  const query = useAssignableInvestigators(1);
  const mutation = useAssignInvestigator(incident.id);

  const all = query.data ?? [];
  const eligible = all.filter((investigator) => investigator.clearanceLevel >= requiredClearance);
  const hiddenCount = all.length - eligible.length;

  async function handleAssign(): Promise<void> {
    if (!selectedId) return;
    try {
      await mutation.mutateAsync({ version: incident.version, body: { investigatorId: selectedId } });
      show(LABELS.triage.assignedToast, 'success');
      setSelectedId(null);
      onClose();
    } catch (err) {
      show(getErrorMessage(err), 'error');
    }
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={LABELS.triage.assignDrawerTitle}>
      <div className="space-y-4">
        {query.isPending && (
          <div role="status" className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <span className="sr-only">Loading…</span>
          </div>
        )}

        {query.isError && <ErrorState message={LABELS.errors.generic} onRetry={() => query.refetch()} />}

        {query.data && eligible.length === 0 && (
          <EmptyState title="No eligible investigators" body={LABELS.triage.noEligibleInvestigators(requiredClearance)} />
        )}

        {query.data && eligible.length > 0 && (
          <div role="radiogroup" aria-label={LABELS.triage.assignDrawerTitle} className="space-y-2">
            {eligible.map((investigator) => (
              <InvestigatorOption
                key={investigator.id}
                investigator={investigator}
                selected={selectedId === investigator.id}
                onSelect={() => setSelectedId(investigator.id)}
              />
            ))}
          </div>
        )}

        {hiddenCount > 0 && (
          <p className="text-xs text-slate-500">{LABELS.triage.hiddenInvestigatorsFootnote(hiddenCount)}</p>
        )}

        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
          <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedId} isLoading={mutation.isPending}>
            {incident.assignedInvestigator ? LABELS.triage.reassign : LABELS.triage.assign}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
