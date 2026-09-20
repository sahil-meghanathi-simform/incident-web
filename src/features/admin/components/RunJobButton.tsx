// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Play } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/useToast';
import { useRunEscalationJob } from '../hooks/useRunEscalationJob';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { LABELS } from '../../../lib/labels';

/**
 * Pressing this twice in a row is the live demonstration of §6's idempotency claim
 * (build-plan.md §15.2) — the second press's row in JobRunsTable shows SKIPPED_LOCKED
 * or 0 escalated, proven against the real job, not a mock.
 */
export function RunJobButton(): ReactElement {
  const { show } = useToast();
  const mutation = useRunEscalationJob();

  async function handleRun(): Promise<void> {
    try {
      const result = await mutation.mutateAsync();
      show(LABELS.admin.runJobToast(result.outcome), 'success');
    } catch (err) {
      show(getErrorMessage(err), 'error');
    }
  }

  return (
    <Button type="button" onClick={handleRun} isLoading={mutation.isPending}>
      {!mutation.isPending && <Play aria-hidden="true" />}
      {LABELS.admin.runJobNow}
    </Button>
  );
}
