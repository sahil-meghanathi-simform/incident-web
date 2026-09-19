import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { TextLink } from '../../../components/ui/TextLink';
import { Card } from '../../../components/ui/Card';
import { ClearanceNotice } from './ClearanceNotice';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';
import type { IncidentReceipt } from '../types/incident.type';

type ReceiptCardProps = Readonly<{
  receipt: IncidentReceipt;
}>;

export function ReceiptCard({ receipt }: ReceiptCardProps): ReactElement {
  return (
    <Card className="mx-auto max-w-lg space-y-4 p-6 text-center">
      <p className="text-sm text-muted-foreground">{LABELS.incidents.incidentReported}</p>
      <p className="font-display text-2xl font-semibold tracking-display text-foreground">{receipt.reference}</p>
      <div className="flex justify-center">
        <SeverityBadge severity={receipt.severity} />
      </div>
      {receipt.visibleToYou ? (
        <Link
          to={ROUTES.incidentDetail(receipt.id)}
          className="inline-flex items-center justify-center rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          {LABELS.incidents.viewIncident}
        </Link>
      ) : (
        <ClearanceNotice reference={receipt.reference} />
      )}
      <div>
        <TextLink to={ROUTES.incidentNew}>{LABELS.incidents.reportAnother}</TextLink>
      </div>
    </Card>
  );
}
