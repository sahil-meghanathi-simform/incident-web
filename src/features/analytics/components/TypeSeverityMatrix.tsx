import type { CSSProperties, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '../../../components/ui/Table';
import { TableHeader } from '../../../components/ui/TableHeader';
import type { TypeSeverityMatrixResponse } from '../../../api/contracts/analytics.contract';
import { SEVERITY_LABEL, type Severity } from '../../../lib/severity';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

type TypeSeverityMatrixProps = Readonly<{ data: TypeSeverityMatrixResponse }>;

/** 'DATA_PRIVACY' -> 'Data Privacy' — a plain enum-to-label transform, not worth a
 * network round trip to `/incidents/types` just for a heatmap row label. */
function typeLabel(type: string): string {
  return type
    .toLowerCase()
    .split('_')
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(' ');
}

const SEVERITY_HEX: Record<Severity, string> = {
  LOW: '37 99 235',
  MEDIUM: '217 119 6',
  HIGH: '234 88 12',
  CRITICAL: '220 38 38',
};

/** Per-column relative intensity (each severity scales against its OWN column max, not
 * the grand max) — otherwise a single CRITICAL outlier would wash out every other
 * column to near-white. */
function cellStyle(count: number, columnMax: number, severity: Severity): CSSProperties {
  if (columnMax === 0 || count === 0) return {};
  const alpha = 0.08 + 0.5 * (count / columnMax);
  return { backgroundColor: `rgb(${SEVERITY_HEX[severity]} / ${alpha})` };
}

/** The matrix table itself — AnalyticsPage handles loading/error/empty (same
 * discipline as IncidentListPage/IncidentTable) before this ever renders. */
export function TypeSeverityMatrix({ data }: TypeSeverityMatrixProps): ReactElement {
  const navigate = useNavigate();

  const cellByKey = new Map(data.cells.map((c) => [`${c.type}:${c.severity}`, c.count]));
  const columnMax = Object.fromEntries(
    data.severities.map((severity) => [severity, Math.max(...data.cells.filter((c) => c.severity === severity).map((c) => c.count), 0)]),
  ) as Record<Severity, number>;

  return (
    <Table>
      <TableHeader>
        <th scope="col" className="px-3 py-2">
          Type
        </th>
        {data.severities.map((severity) => (
          <th key={severity} scope="col" className="px-3 py-2 text-right">
            {SEVERITY_LABEL[severity]}
          </th>
        ))}
        <th scope="col" className="px-3 py-2 text-right">
          {LABELS.analytics.matrixRowTotal}
        </th>
      </TableHeader>
      <tbody className="divide-y divide-slate-100">
        {data.rowTotals.map((row) => (
          <tr key={row.type}>
            <th scope="row" className="px-3 py-2 text-left font-medium text-slate-700">
              {typeLabel(row.type)}
            </th>
            {data.severities.map((severity) => {
              const count = cellByKey.get(`${row.type}:${severity}`) ?? 0;
              return (
                <td
                  key={severity}
                  className="px-3 py-2 text-right"
                  // rules-ok: heat-shading alpha is derived from live data per cell — no
                  // fixed set of Tailwind classes can express a continuous scale.
                  style={cellStyle(count, columnMax[severity], severity)}
                >
                  {count > 0 ? (
                    <button
                      type="button"
                      className="underline decoration-dotted underline-offset-2 hover:decoration-solid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label={`${count} ${typeLabel(row.type)} incidents at ${SEVERITY_LABEL[severity]} severity — view list`}
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
                </td>
              );
            })}
            <td className="px-3 py-2 text-right font-medium text-slate-900">{row.count}</td>
          </tr>
        ))}
        <tr className="bg-slate-50 font-medium">
          <th scope="row" className="px-3 py-2 text-left">
            {LABELS.analytics.matrixColumnTotal}
          </th>
          {data.columnTotals.map((col) => (
            <td key={col.severity} className="px-3 py-2 text-right">
              {col.count}
            </td>
          ))}
          <td className="px-3 py-2 text-right">{data.grandTotal}</td>
        </tr>
      </tbody>
    </Table>
  );
}
