// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { MousePointerClick } from 'lucide-react';
import { LABELS } from '../../../lib/labels';

/** The heatmap key, in words and a gradient — deliberately no numerals, so it never
 * reads as (or collides with) a count in the table above. */
export function MatrixHeatLegend(): ReactElement {
  return (
    <div className="flex flex-col gap-2 border-t border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <p className="inline-flex items-center gap-1.5">
        <MousePointerClick className="size-3.5 shrink-0" aria-hidden="true" />
        {LABELS.analytics.matrixDescription}
      </p>
      <div className="flex items-center gap-2">
        <span className="sr-only">{LABELS.analytics.matrixLegendLabel}</span>
        <span>{LABELS.analytics.matrixLegendFewer}</span>
        <span
          className="h-2 w-24 rounded-full bg-linear-to-r from-card via-primary/30 to-primary/70 ring-1 ring-border"
          aria-hidden="true"
        />
        <span>{LABELS.analytics.matrixLegendMore}</span>
      </div>
    </div>
  );
}
