// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useState, type ReactElement } from 'react';
import { Info, UserX } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../../../components/ui/Sheet';
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

const SKELETON_ROWS = ['first', 'second', 'third'] as const;

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
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{LABELS.triage.assignDrawerTitle}</SheetTitle>
          <SheetDescription>{LABELS.triage.assignDrawerDescription}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 pb-4">
          {query.isPending && (
            <div role="status" className="space-y-2">
              {SKELETON_ROWS.map((row) => (
                <div key={row} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Skeleton className="size-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/5" />
                    <Skeleton className="h-4 w-20 rounded-full" />
                  </div>
                  <Skeleton className="size-5 rounded-full" />
                </div>
              ))}
              <span className="sr-only">{LABELS.chrome.loading}</span>
            </div>
          )}

          {query.isError && <ErrorState message={LABELS.errors.generic} onRetry={() => query.refetch()} />}

          {query.data && eligible.length === 0 && (
            <EmptyState
              size="sm"
              icon={UserX}
              title={LABELS.triage.noEligibleInvestigatorsTitle}
              body={LABELS.triage.noEligibleInvestigators(requiredClearance)}
            />
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
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="mt-px size-3.5 shrink-0" aria-hidden="true" />
              {LABELS.triage.hiddenInvestigatorsFootnote(hiddenCount)}
            </p>
          )}
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>
            {LABELS.chrome.cancel}
          </Button>
          <Button onClick={handleAssign} disabled={!selectedId} isLoading={mutation.isPending}>
            {incident.assignedInvestigator ? LABELS.triage.reassign : LABELS.triage.assign}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
