// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { TrendingUp } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SkeletonCard } from '../../../components/ui/SkeletonCard';
import { ErrorState } from '../../../components/ui/ErrorState';
import { useToast } from '../../../components/ui/useToast';
import { TierEditor } from '../components/TierEditor';
import { useEscalationTiers } from '../hooks/useEscalationTiers';
import { useUpdateTiers } from '../hooks/useUpdateTiers';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { LABELS } from '../../../lib/labels';
import type { TierInput } from '../schemas/tierSet.schema';

const SKELETON_CARDS = ['critical', 'high', 'medium'] as const;

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
      <PageHeader
        icon={TrendingUp}
        title={LABELS.admin.escalationPolicyTitle}
        description={LABELS.admin.escalationPolicyDescription}
      />

      {query.isPending && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {SKELETON_CARDS.map((key) => (
              <SkeletonCard key={key} />
            ))}
          </div>
          <SkeletonCard />
        </div>
      )}
      {query.isError && <ErrorState message={LABELS.admin.loadTiersError} onRetry={() => query.refetch()} />}
      {query.data && (
        <TierEditor initialTiers={query.data.tiers} isSaving={mutation.isPending} onSave={handleSave} />
      )}
    </PageContainer>
  );
}
