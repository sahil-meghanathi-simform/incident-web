// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ClipboardList, FilePlus } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { TextLink } from '../../../components/ui/TextLink';
import { Card } from '../../../components/ui/Card';
import { ReceiptCard } from '../components/ReceiptCard';
import { ReceiptHero } from '../components/ReceiptHero';
import { CopyReferenceButton } from '../components/CopyReferenceButton';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';
import { IncidentReceiptSchema } from '../../../api/contracts/incident.contract';
import type { IncidentReceipt } from '../types/incident.type';

const COPY = LABELS.incidents.receipt;

/** Router state is `unknown` — validated against the receipt contract, not cast. */
function receiptFromState(state: unknown): IncidentReceipt | undefined {
  if (typeof state !== 'object' || state === null || !('receipt' in state)) return undefined;
  const parsed = IncidentReceiptSchema.safeParse(state.receipt);
  return parsed.success ? parsed.data : undefined;
}

export function SubmissionReceiptPage(): ReactElement {
  useDocumentTitle(COPY.pageTitle);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const receipt = receiptFromState(location.state);
  const reference = searchParams.get('ref');

  // A hard refresh loses router state — `?ref=` alone can't reconstruct the
  // id/severity/visibleToYou a full ReceiptCard needs, and the receipt is not
  // otherwise readable back (Q9), so this falls back to a plain confirmation.
  if (!receipt) {
    return (
      <PageContainer size="narrow">
        <Card variant="elevated" className="mx-auto max-w-xl overflow-hidden animate-in fade-in duration-300">
          <ReceiptHero />
          <div className="space-y-5 p-5 text-center sm:p-6">
            {reference ? (
              <div className="rounded-xl border border-dashed border-primary/30 bg-accent/40 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">{COPY.referenceLabel}</p>
                <div className="mt-1 flex items-center justify-center gap-1.5">
                  <p className="break-all font-mono text-xl font-semibold text-foreground sm:text-2xl">{reference}</p>
                  <CopyReferenceButton reference={reference} appearance="icon" />
                </div>
              </div>
            ) : (
              <p className="text-sm text-foreground-soft">{COPY.noDetails}</p>
            )}
            <div className="flex flex-col items-center justify-center gap-3 border-t border-border pt-5 sm:flex-row sm:gap-6">
              <TextLink to={ROUTES.incidentNew} className="inline-flex items-center gap-1.5">
                <FilePlus className="size-4" aria-hidden="true" />
                {LABELS.incidents.reportAnother}
              </TextLink>
              <TextLink to={ROUTES.incidentMine} className="inline-flex items-center gap-1.5">
                <ClipboardList className="size-4" aria-hidden="true" />
                {COPY.viewMyReports}
              </TextLink>
            </div>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer size="narrow">
      <ReceiptCard receipt={receipt} />
    </PageContainer>
  );
}
