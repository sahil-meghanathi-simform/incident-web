import type { ReactElement } from 'react';
import { SEVERITY_LABEL, SEVERITY_FILL_CLASS, SEVERITY_SWATCH_CLASS } from '../../../lib/severity';
import { formatDateTime } from '../../../lib/datetime';
import { cn } from '../../../lib/cn';
import type { PivotedTrend } from '../hooks/useTrend';

type TrendChartProps = Readonly<{ data: PivotedTrend }>;

const WIDTH = 720;
const HEIGHT = 220;
const PADDING = { top: 8, right: 8, bottom: 24, left: 8 };

/**
 * Hand-rolled stacked-bar SVG — no charting library is in the confirmed stack, and the
 * data is small and bounded (at most 53 buckets x 4 series), so a dependency isn't
 * justified (build-plan.md Module 9). Each segment carries a native `<title>` for a
 * zero-JS tooltip, and the whole chart is described by one `aria-label` summary plus a
 * legend, so the information isn't color-only (accessibility). AnalyticsPage handles
 * loading/error/empty before this ever renders.
 */
export function TrendChart({ data }: TrendChartProps): ReactElement {
  const { buckets, severities, seriesBySeverity } = data;

  const totals = buckets.map((_, i) => severities.reduce((sum, s) => sum + (seriesBySeverity[s][i] ?? 0), 0));
  const maxTotal = Math.max(...totals, 1);

  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const barGap = 4;
  const barWidth = Math.max(2, plotWidth / buckets.length - barGap);

  // At most ~10 x-axis labels regardless of bucket count, or 53 daily buckets collide.
  const labelEvery = Math.max(1, Math.ceil(buckets.length / 10));

  const summary = `Trend chart: ${buckets.length} periods, ${severities.length} severities, peak ${maxTotal} incidents in one period.`;

  return (
    <div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={summary} className="w-full">
        <title>{summary}</title>
        {buckets.map((bucket, i) => {
          const x = PADDING.left + i * (barWidth + barGap);
          let yCursor = HEIGHT - PADDING.bottom;
          return (
            <g key={bucket}>
              {severities.map((severity) => {
                const count = seriesBySeverity[severity][i] ?? 0;
                if (count === 0) return null;
                const segmentHeight = (count / maxTotal) * plotHeight;
                yCursor -= segmentHeight;
                return (
                  <rect
                    key={severity}
                    x={x}
                    y={yCursor}
                    width={barWidth}
                    height={segmentHeight}
                    className={SEVERITY_FILL_CLASS[severity]}
                  >
                    <title>
                      {formatDateTime(bucket)} · {SEVERITY_LABEL[severity]}: {count}
                    </title>
                  </rect>
                );
              })}
              {i % labelEvery === 0 && (
                <text
                  x={x + barWidth / 2}
                  y={HEIGHT - PADDING.bottom + 14}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[9px]"
                >
                  {new Date(bucket).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-3">
        {severities.map((severity) => (
          <span key={severity} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span aria-hidden="true" className={cn('h-2.5 w-2.5 rounded-sm', SEVERITY_SWATCH_CLASS[severity])} />
            {SEVERITY_LABEL[severity]}
          </span>
        ))}
      </div>
    </div>
  );
}
