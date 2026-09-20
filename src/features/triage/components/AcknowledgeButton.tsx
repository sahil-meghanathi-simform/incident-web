// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { BellOff } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/useToast';
import { useAcknowledgeIncident } from '../hooks/useAcknowledgeIncident';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { LABELS } from '../../../lib/labels';

type AcknowledgeButtonProps = Readonly<{
  incidentId: string;
  version: number;
  /** `default` when acknowledging is the most relevant next step; outline otherwise. */
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md';
  /** e.g. `relative z-10` to sit above a table row's stretched link. */
  className?: string;
}>;

/** Q18: stops the escalation clock. Optimistic on the detail cache — see
 * useAcknowledgeIncident — so the badge flips before the round trip returns. */
export function AcknowledgeButton({
  incidentId,
  version,
  variant = 'outline',
  size = 'md',
  className,
}: AcknowledgeButtonProps): ReactElement {
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
    <Button variant={variant} size={size} className={className} onClick={handleClick} isLoading={mutation.isPending}>
      {!mutation.isPending && <BellOff aria-hidden="true" />}
      {LABELS.triage.acknowledge}
    </Button>
  );
}
