import type { ReactElement } from 'react';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/useToast';
import { useAcknowledgeIncident } from '../hooks/useAcknowledgeIncident';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { LABELS } from '../../../lib/labels';

type AcknowledgeButtonProps = Readonly<{
  incidentId: string;
  version: number;
}>;

/** Q18: stops the escalation clock. Optimistic on the detail cache — see
 * useAcknowledgeIncident — so the badge flips before the round trip returns. */
export function AcknowledgeButton({ incidentId, version }: AcknowledgeButtonProps): ReactElement {
  const { show } = useToast();
  const mutation = useAcknowledgeIncident(incidentId);

  async function handleClick(): Promise<void> {
    try {
      await mutation.mutateAsync(version);
      show(LABELS.triage.acknowledgedToast, 'success');
    } catch (err) {
      show(getErrorMessage(err), 'error');
    }
  }

  return (
    <Button variant="outline" onClick={handleClick} isLoading={mutation.isPending}>
      {LABELS.triage.acknowledge}
    </Button>
  );
}
