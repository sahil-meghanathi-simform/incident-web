import type { ReactElement } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { TextLink } from '../../../components/ui/TextLink';
import { Card } from '../../../components/ui/Card';
import { ReceiptCard } from '../components/ReceiptCard';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';
import type { IncidentReceipt } from '../types/incident.type';

export function SubmissionReceiptPage(): ReactElement {
  useDocumentTitle('Report Submitted');
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const receipt = (location.state as { receipt?: IncidentReceipt } | null)?.receipt;
  const reference = searchParams.get('ref');

  // A hard refresh loses router state — `?ref=` alone can't reconstruct the
  // id/severity/visibleToYou a full ReceiptCard needs, and the receipt is not
  // otherwise readable back (Q9), so this falls back to a plain confirmation.
  if (!receipt) {
    return (
      <PageContainer>
        <Card className="mx-auto max-w-lg space-y-3 p-6 text-center">
          <p className="text-sm text-muted-foreground">{LABELS.incidents.incidentReported}</p>
          {reference ? (
            <p className="font-display text-2xl font-semibold tracking-display text-foreground">{reference}</p>
          ) : (
            <p className="text-sm text-foreground-soft">No submission details are available.</p>
          )}
          <TextLink to={ROUTES.incidentNew}>{LABELS.incidents.reportAnother}</TextLink>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ReceiptCard receipt={receipt} />
    </PageContainer>
  );
}
