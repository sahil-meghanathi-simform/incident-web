// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { CSSProperties, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableRow } from '../../../components/ui/Table';
import { TableHeader } from '../../../components/ui/TableHeader';
import type { TypeSeverityMatrixResponse } from '../../../api/contracts/analytics.contract';
import { SEVERITY_LABEL, SEVERITY_VAR, type Severity } from '../../../lib/severity';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';
import { cn } from '../../../lib/cn';
import { MatrixHeatLegend } from './MatrixHeatLegend';

type TypeSeverityMatrixProps = Readonly<{ data: TypeSeverityMatrixResponse }>;

// The row-header column stays pinned while the matrix scrolls sideways on a phone.
// Opaque backgrounds so scrolled cells never show through it.
const STICKY_CELL = 'sticky left-0 z-10 bg-card px-4 py-3 text-left';

/** 'DATA_PRIVACY' -> 'Data Privacy' — a plain enum-to-label transform, not worth a
 * network round trip to `/incidents/types` just for a heatmap row label. */
function typeLabel(type: string): string {
  return type
    .toLowerCase()
    .split('_')
    .map((w) => (w[0] ?? '').toUpperCase() + w.slice(1))
    .join(' ');
}

/** Per-column relative intensity (each severity scales against its OWN column max, not
 * the grand max) — otherwise a single CRITICAL outlier would wash out every other
 * column to near-white. Mixes toward --color-card (not transparent) so cells stay
 * opaque over the table's row hover — a translucent cell would show two different
 * effective colors depending on the row state. At the maximum mix (58%) cell text
 * still measures 6.12:1, comfortably AA. */
function cellStyle(count: number, columnMax: number, severity: Severity): CSSProperties {
  if (columnMax === 0 || count === 0) return {};
  const pct = Math.round((0.08 + 0.5 * (count / columnMax)) * 100);
  return { backgroundColor: `color-mix(in oklab, var(${SEVERITY_VAR[severity]}) ${pct}%, var(--color-card))` };
}

/** The matrix table itself — AnalyticsPage handles loading/error/empty (same
 * discipline as IncidentListPage/IncidentTable) before this ever renders. */
export function TypeSeverityMatrix({ data }: TypeSeverityMatrixProps): ReactElement {
  const navigate = useNavigate();

  const cellByKey = new Map(data.cells.map((c) => [`${c.type}:${c.severity}`, c.count]));
  const columnMax = new Map<Severity, number>(
    data.severities.map((severity) => [
      severity,
      Math.max(...data.cells.filter((c) => c.severity === severity).map((c) => c.count), 0),
    ]),
  );

  return (
    <Table minWidth="sm" footer={<MatrixHeatLegend />}>
      <TableHeader>
        {/* Pinned on both axes, so it outranks the header row (z-20) it sits in. */}
        <th scope="col" className="left-0 z-30!">
          {LABELS.analytics.matrixTypeColumn}
        </th>
        {data.severities.map((severity) => (
          <th key={severity} scope="col" className="text-right">
            {SEVERITY_LABEL[severity]}
          </th>
        ))}
        <th scope="col" className="text-right">
          {LABELS.analytics.matrixRowTotal}
        </th>
      </TableHeader>
      <TableBody>
        {data.rowTotals.map((row) => (
          <TableRow key={row.type}>
            <th scope="row" className={cn(STICKY_CELL, 'font-medium text-foreground-soft')}>
              {typeLabel(row.type)}
            </th>
            {data.severities.map((severity) => {
              const count = cellByKey.get(`${row.type}:${severity}`) ?? 0;
              return (
                <TableCell
                  key={severity}
                  isNumeric
                  className={count === 0 ? 'text-foreground-faint' : 'text-foreground'}
                  // rules-ok: heat-shading alpha is derived from live data per cell — no
                  // fixed set of Tailwind classes can express a continuous scale.
                  style={cellStyle(count, columnMax.get(severity) ?? 0, severity)}
                >
                  {count > 0 ? (
                    <button
                      type="button"
                      className="-mx-1.5 -my-0.5 rounded-md px-1.5 py-0.5 font-medium underline decoration-dotted underline-offset-2 transition-colors hover:bg-card/70 hover:decoration-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={LABELS.analytics.matrixCellLabel(count, typeLabel(row.type), SEVERITY_LABEL[severity])}
                      onClick={() =>
                        navigate(
                          `${ROUTES.incidents}?type=${row.type}&severity=${severity}&from=${data.period.from}&to=${data.period.to}`,
                        )
                      }
                    >
                      {count}
                    </button>
                  ) : (
                    count
                  )}
                </TableCell>
              );
            })}
            <TableCell isNumeric className="font-semibold text-foreground">
              {row.count}
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="bg-muted font-semibold hover:bg-muted">
          <th scope="row" className={cn(STICKY_CELL, 'bg-muted text-foreground')}>
            {LABELS.analytics.matrixColumnTotal}
          </th>
          {data.columnTotals.map((col) => (
            <TableCell key={col.severity} isNumeric className="text-foreground">
              {col.count}
            </TableCell>
          ))}
          <TableCell isNumeric className="text-foreground">
            {data.grandTotal}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
