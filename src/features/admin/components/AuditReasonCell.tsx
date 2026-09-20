// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useState, type ReactElement } from 'react';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

type AuditReasonCellProps = Readonly<{
  reason: string;
}>;

/** Reasons longer than this are clamped to two lines with a toggle. */
const LONG_REASON_CHARS = 90;

/** A long reason is clamped, with a toggle that expands it in place — the text is
 * rendered once; only the clamp changes. */
export function AuditReasonCell({ reason }: AuditReasonCellProps): ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);

  if (reason.length <= LONG_REASON_CHARS) {
    return <p className="max-w-xs text-xs text-foreground-soft">{reason}</p>;
  }

  return (
    <div className="max-w-xs">
      <p className={cn('text-xs text-foreground-soft', !isExpanded && 'line-clamp-2')}>{reason}</p>
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((v) => !v)}
        className="mt-1 rounded-sm text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {isExpanded ? LABELS.admin.auditShowLessReason : LABELS.admin.auditShowFullReason}
      </button>
    </div>
  );
}
