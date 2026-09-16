import { PageContainer } from '../layout/PageContainer';
import { PageHeader } from '../ui/PageHeader';
import { EmptyState } from '../ui/EmptyState';

/** Placeholder for a route whose feature module has not landed yet (Module 0 shell). */
export function ComingSoon({ title }: { title: string }) {
  return (
    <PageContainer>
      <PageHeader title={title} />
      <EmptyState title="Not built yet" body="This screen lands with its feature module." />
    </PageContainer>
  );
}
