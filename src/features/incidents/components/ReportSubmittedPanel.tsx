// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useEffect, useRef, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { Button } from '../../../components/ui/Button';
import { ClearanceNotice } from './ClearanceNotice';
import { CopyReferenceButton } from './CopyReferenceButton';
import { ReceiptNextSteps } from './ReceiptNextSteps';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';
import type { IncidentReceipt } from '../types/incident.type';

type ReportSubmittedPanelProps = Readonly<{
  receipt: IncidentReceipt;
  /** Called when the reporter follows a link out of the dialog, so the host can
   * close it rather than leave a modal open over the new screen. */
  onNavigate: () => void;
}>;

const COPY = LABELS.incidents.receipt;

/**
 * What the report dialog shows once the report is in: the reference to keep, what
 * happens next, and — only when the reporter can still see it (Q9) — a way through
 * to the incident. Filed above their clearance, the ClearanceNotice takes that
 * link's place, so there is no dead end to discover later.
 *
 * Focus moves here on mount: the form that had focus is gone, and this is the
 * dialog's new content (accessibility.md).
 */
export function ReportSubmittedPanel({ receipt, onNavigate }: ReportSubmittedPanelProps): ReactElement {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div ref={panelRef} tabIndex={-1} className="space-y-6 p-5 outline-none sm:p-6">
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
            <Link to={ROUTES.incidentDetail(receipt.id)} onClick={onNavigate}>
              {LABELS.incidents.viewIncident}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      ) : (
        <ClearanceNotice reference={receipt.reference} />
      )}

      <ReceiptNextSteps />
    </div>
  );
}
