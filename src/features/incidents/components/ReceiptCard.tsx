// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, FilePlus } from 'lucide-react';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { TextLink } from '../../../components/ui/TextLink';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { ClearanceNotice } from './ClearanceNotice';
import { CopyReferenceButton } from './CopyReferenceButton';
import { ReceiptHero } from './ReceiptHero';
import { ReceiptNextSteps } from './ReceiptNextSteps';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';
import type { IncidentReceipt } from '../types/incident.type';

type ReceiptCardProps = Readonly<{
  receipt: IncidentReceipt;
}>;

const COPY = LABELS.incidents.receipt;

/** The post-submit confirmation. When the report landed above the reporter's clearance
 * (Q9) there is no "View incident" link at all — the ClearanceNotice, with its own
 * copy button, takes its place. */
export function ReceiptCard({ receipt }: ReceiptCardProps): ReactElement {
  return (
    <Card
      variant="elevated"
      className="mx-auto max-w-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300 ease-smooth"
    >
      <ReceiptHero />
      <div className="space-y-6 p-5 sm:p-6">
        <div className="rounded-xl border border-dashed border-primary/30 bg-accent/40 px-4 py-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">{COPY.referenceLabel}</p>
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <p className="break-all font-mono text-xl font-semibold text-foreground sm:text-2xl">{receipt.reference}</p>
            {receipt.visibleToYou && <CopyReferenceButton reference={receipt.reference} appearance="icon" />}
          </div>
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>{COPY.severityLabel}</span>
            <SeverityBadge severity={receipt.severity} />
          </div>
        </div>

        {receipt.visibleToYou ? (
          <div className="flex justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to={ROUTES.incidentDetail(receipt.id)}>
                {LABELS.incidents.viewIncident}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        ) : (
          <ClearanceNotice reference={receipt.reference} />
        )}

        <ReceiptNextSteps />

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
  );
}
