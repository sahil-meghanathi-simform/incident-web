import type { ReactElement } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SkeletonTable } from '../../../components/ui/SkeletonTable';
import { ErrorState } from '../../../components/ui/ErrorState';
import { useToast } from '../../../components/ui/useToast';
import { TierEditor } from '../components/TierEditor';
import { useEscalationTiers } from '../hooks/useEscalationTiers';
import { useUpdateTiers } from '../hooks/useUpdateTiers';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { LABELS } from '../../../lib/labels';
import type { TierInput } from '../schemas/tierSet.schema';

export function EscalationPolicyPage(): ReactElement {
  useDocumentTitle(LABELS.admin.escalationPolicyTitle);
  const { show } = useToast();
  const query = useEscalationTiers();
  const mutation = useUpdateTiers();

  async function handleSave(tiers: readonly TierInput[]): Promise<void> {
    try {
      await mutation.mutateAsync({ tiers: [...tiers] });
      show(LABELS.admin.tiersSavedToast, 'success');
    } catch (err) {
      show(getErrorMessage(err), 'error');
    }
  }

  return (
    <PageContainer>
      <PageHeader title={LABELS.admin.escalationPolicyTitle} description={LABELS.admin.escalationPolicyDescription} />

      {query.isPending && <SkeletonTable columns={3} />}
      {query.isError && <ErrorState message={LABELS.admin.loadTiersError} onRetry={() => query.refetch()} />}
      {query.data && (
        <TierEditor initialTiers={query.data.tiers} isSaving={mutation.isPending} onSave={handleSave} />
      )}
    </PageContainer>
  );
}
