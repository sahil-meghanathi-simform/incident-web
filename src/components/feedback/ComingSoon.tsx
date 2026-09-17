import type { ReactElement } from 'react';
import { PageContainer } from '../layout/PageContainer';
import { PageHeader } from '../ui/PageHeader';
import { EmptyState } from '../ui/EmptyState';
import { LABELS } from '../../lib/labels';

type ComingSoonProps = Readonly<{
  title: string;
}>;

/** Placeholder for a route whose feature module has not landed yet (Module 0 shell). */
export function ComingSoon({ title }: ComingSoonProps): ReactElement {
  return (
    <PageContainer>
      <PageHeader title={title} />
      <EmptyState title={LABELS.feedback.comingSoonTitle} body={LABELS.feedback.comingSoonBody} />
    </PageContainer>
  );
}
