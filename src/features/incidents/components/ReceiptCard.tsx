import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { TextLink } from '../../../components/ui/TextLink';
import { ClearanceNotice } from './ClearanceNotice';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';
import type { IncidentReceipt } from '../types/incident.type';

type ReceiptCardProps = Readonly<{
  receipt: IncidentReceipt;
}>;

export function ReceiptCard({ receipt }: ReceiptCardProps): ReactElement {
  return (
    <div className="mx-auto max-w-lg space-y-4 rounded-lg border border-slate-200 bg-white p-6 text-center">
      <p className="text-sm text-slate-500">{LABELS.incidents.incidentReported}</p>
      <p className="text-2xl font-semibold tracking-tight text-slate-900">{receipt.reference}</p>
      <div className="flex justify-center">
        <SeverityBadge severity={receipt.severity} />
      </div>
      {receipt.visibleToYou ? (
        <Link
          to={ROUTES.incidentDetail(receipt.id)}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {LABELS.incidents.viewIncident}
        </Link>
      ) : (
        <ClearanceNotice reference={receipt.reference} />
      )}
      <div>
        <TextLink to={ROUTES.incidentNew}>{LABELS.incidents.reportAnother}</TextLink>
      </div>
    </div>
  );
}
