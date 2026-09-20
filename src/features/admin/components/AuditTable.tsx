// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { Table, TableBody, TableCell, TableRow } from '../../../components/ui/Table';
import { TableHeader } from '../../../components/ui/TableHeader';
import { Avatar } from '../../../components/ui/Avatar';
import { AuditEventBadge } from './AuditEventBadge';
import { AuditReasonCell } from './AuditReasonCell';
import { formatDateTime, formatRelative } from '../../../lib/datetime';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';
import type { AuditRow } from '../../../api/contracts/audit.contract';

type AuditTableProps = Readonly<{
  items: readonly AuditRow[];
  /** Pagination, rendered inside the table card. */
  footer?: ReactNode;
}>;

const COLUMNS = LABELS.admin.auditColumns;
const EMPTY = '—';

function fromToText(row: AuditRow): string {
  // One text node on purpose — "REPORTED → TRIAGE" reads (and is queried) as a unit.
  return row.fromValue || row.toValue ? `${row.fromValue ?? EMPTY} → ${row.toValue ?? EMPTY}` : EMPTY;
}

/** The flat, unredacted admin view (§13.1) — this route is ADMIN-gated server-side, so
 * unlike the per-incident timeline there is no NOTE_ADDED redaction to render here. */
export function AuditTable({ items, footer }: AuditTableProps): ReactElement {
  return (
    <Table isStacked footer={footer} minWidth="lg">
      <TableHeader>
        <th>{COLUMNS.occurredAt}</th>
        <th>{COLUMNS.type}</th>
        <th>{COLUMNS.actor}</th>
        <th>{COLUMNS.incident}</th>
        <th>{COLUMNS.fromTo}</th>
        <th>{COLUMNS.reason}</th>
      </TableHeader>
      <TableBody>
        {items.map((row) => (
          <TableRow key={row.id}>
            <TableCell label={COLUMNS.occurredAt} className="whitespace-nowrap">
              <time dateTime={row.occurredAt} className="flex flex-col">
                <span className="text-sm text-foreground">{formatRelative(row.occurredAt)}</span>
                <span className="text-xs text-muted-foreground">{formatDateTime(row.occurredAt)}</span>
              </time>
            </TableCell>
            <TableCell label={COLUMNS.type}>
              <AuditEventBadge type={row.type} />
            </TableCell>
            <TableCell label={COLUMNS.actor}>
              {row.actor ? (
                <span className="flex min-w-0 items-center gap-2">
                  <Avatar name={row.actor.displayName} className="h-7 w-7 text-xs" />
                  <span className="truncate text-foreground">{row.actor.displayName}</span>
                </span>
              ) : (
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted" aria-hidden="true">
                    <Bot className="size-3.5" />
                  </span>
                  {LABELS.admin.auditSystemActor}
                </span>
              )}
            </TableCell>
            <TableCell label={COLUMNS.incident} isMono>
              {row.incidentId && row.incidentReference ? (
                <Link
                  to={ROUTES.incidentDetail(row.incidentId)}
                  className="rounded-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {row.incidentReference}
                </Link>
              ) : (
                <span className="text-muted-foreground">{EMPTY}</span>
              )}
            </TableCell>
            <TableCell label={COLUMNS.fromTo} className="text-xs">
              <span className="font-mono">{fromToText(row)}</span>
            </TableCell>
            <TableCell label={COLUMNS.reason} isWide>
              {row.reason ? <AuditReasonCell reason={row.reason} /> : <span className="text-muted-foreground">{EMPTY}</span>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
