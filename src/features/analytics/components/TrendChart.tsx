// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { SEVERITY_LABEL, SEVERITY_FILL_CLASS, SEVERITY_SWATCH_CLASS } from '../../../lib/severity';
import { formatDateTime } from '../../../lib/datetime';
import { LABELS } from '../../../lib/labels';
import { cn } from '../../../lib/cn';
import { countScale } from '../lib/chartScale';
import { formatBucketLabel } from '../lib/formatBucketLabel';
import type { PivotedTrend } from '../hooks/useTrend';

type TrendChartProps = Readonly<{ data: PivotedTrend }>;

// SVG user units: each bucket owns a SLOT-wide column, the plot is 100 tall. The
// SVG stretches (preserveAspectRatio="none") to the HTML box, so its columns line
// up exactly with the flex-1 x-axis label slots below it.
const SLOT = 10;
const BAR_WIDTH = 7;
const PLOT_HEIGHT = 100;
const MAX_X_LABELS = 6;
const PLOT_HEIGHT_CLASS = 'h-56 sm:h-64 lg:h-72';

/**
 * Hand-rolled stacked-bar SVG — no charting library is in the confirmed stack, and the
 * data is small and bounded (at most 53 buckets x 4 series), so a dependency isn't
 * justified (build-plan.md Module 9). Axis labels are HTML, not SVG <text>, so they
 * stay a legible text-xs on a phone instead of scaling down with the viewBox. Each
 * segment carries a native `<title>` for a zero-JS tooltip, the whole chart is
 * described by one `aria-label` summary, and the legend spells out every severity,
 * so the information isn't color-only. AnalyticsPage handles loading/error/empty.
 */
export function TrendChart({ data }: TrendChartProps): ReactElement {
  const { buckets, severities, seriesBySeverity } = data;

  const totals = buckets.map((_, i) => severities.reduce((sum, s) => sum + (seriesBySeverity[s][i] ?? 0), 0));
  const maxTotal = Math.max(...totals, 1);
  const scale = countScale(maxTotal);
  const viewWidth = buckets.length * SLOT;
  const labelEvery = Math.max(1, Math.ceil(buckets.length / MAX_X_LABELS));

  const summary = LABELS.analytics.trendSummary(buckets.length, severities.length, maxTotal);
  const toY = (value: number): number => PLOT_HEIGHT - (value / scale.max) * PLOT_HEIGHT;

  return (
    <figure className="space-y-4">
      <div className="flex gap-2">
        <div
          aria-hidden="true"
          className={cn(
            'flex w-9 shrink-0 flex-col-reverse justify-between self-start text-right text-xs tabular-nums text-muted-foreground',
            PLOT_HEIGHT_CLASS,
          )}
        >
          {scale.ticks.map((tick) => (
            <span key={tick} className="flex h-0 items-center justify-end">
              {tick}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1 pr-4">
          <div className={PLOT_HEIGHT_CLASS}>
            <svg
              viewBox={`0 0 ${viewWidth} ${PLOT_HEIGHT}`}
              preserveAspectRatio="none"
              role="img"
              aria-label={summary}
              className="block h-full w-full overflow-visible"
            >
              <title>{summary}</title>
              {scale.ticks.map((tick) => (
                <line
                  key={tick}
                  x1={0}
                  x2={viewWidth}
                  y1={toY(tick)}
                  y2={toY(tick)}
                  vectorEffect="non-scaling-stroke"
                  className={tick === 0 ? 'stroke-input' : 'stroke-border'}
                  strokeDasharray={tick === 0 ? undefined : '3 3'}
                />
              ))}
              {buckets.map((bucket, i) => {
                const x = i * SLOT + (SLOT - BAR_WIDTH) / 2;
                let yCursor = PLOT_HEIGHT;
                return (
                  <g key={bucket}>
                    {severities.map((severity) => {
                      const count = seriesBySeverity[severity][i] ?? 0;
                      if (count === 0) return null;
                      const segmentHeight = (count / scale.max) * PLOT_HEIGHT;
                      yCursor -= segmentHeight;
                      return (
                        <rect
                          key={severity}
                          x={x}
                          y={yCursor}
                          width={BAR_WIDTH}
                          height={segmentHeight}
                          className={SEVERITY_FILL_CLASS[severity]}
                        >
                          <title>
                            {formatDateTime(bucket)} · {SEVERITY_LABEL[severity]}: {count}
                          </title>
                        </rect>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>

          <div aria-hidden="true" className="mt-2 flex h-4 text-xs text-muted-foreground">
            {buckets.map((bucket, i) => (
              <span key={bucket} className="relative min-w-0 flex-1">
                {i % labelEvery === 0 && (
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap">{formatBucketLabel(bucket)}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <figcaption>
        <ul aria-label={LABELS.analytics.trendLegendLabel} className="flex flex-wrap gap-2">
          {severities.map((severity) => (
            <li key={severity}>
              <Badge tone="outline" dotClassName={SEVERITY_SWATCH_CLASS[severity]}>
                {SEVERITY_LABEL[severity]}
              </Badge>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
