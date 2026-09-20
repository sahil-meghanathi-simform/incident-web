// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Info, type LucideIcon } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Tooltip } from '../../../components/ui/Tooltip';
import { LABELS } from '../../../lib/labels';
import { cn } from '../../../lib/cn';

type KpiCardProps = Readonly<{
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  /** One short line of context under the value ("42% of total"). */
  footnote?: string;
  tone?: KpiTone;
}>;

export type KpiTone = 'primary' | 'info' | 'warning' | 'success';

// Bar + icon tile per tone. The tone is decoration only — the label says what the
// number is, so nothing here is carried by colour alone.
const TONE_CLASS: Readonly<Record<KpiTone, Readonly<{ bar: string; tile: string }>>> = {
  primary: { bar: 'bg-primary', tile: 'bg-accent text-accent-foreground ring-primary/10' },
  info: { bar: 'bg-info', tile: 'bg-info-surface text-info ring-info-border' },
  warning: { bar: 'bg-warning', tile: 'bg-warning-surface text-warning ring-warning-border' },
  success: { bar: 'bg-success', tile: 'bg-success-surface text-success ring-success-border' },
};

/** One stat tile: label with an explainer tooltip, a big tabular value with a line of
 * context, an icon tile, and a tone bar along the top edge. */
export function KpiCard({ label, value, hint, icon: Icon, footnote, tone = 'primary' }: KpiCardProps): ReactElement {
  const toneClass = TONE_CLASS[tone];
  return (
    <Card className="relative flex h-full flex-col justify-between gap-3 overflow-hidden p-4 pt-5 transition-shadow duration-200 hover:shadow-md animate-in fade-in duration-300 motion-reduce:animate-none">
      <span className={cn('absolute inset-x-0 top-0 h-1', toneClass.bar)} aria-hidden="true" />
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <p className="text-xs font-medium uppercase tracking-caps text-muted-foreground">{label}</p>
          <Tooltip label={hint}>
            <button
              type="button"
              aria-label={LABELS.analytics.kpiInfoLabel(label)}
              className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-faint transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Info className="size-3.5" aria-hidden="true" />
            </button>
          </Tooltip>
        </div>
        <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-xl ring-1', toneClass.tile)}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <div className="space-y-1.5">
        <p className="font-display text-3xl font-semibold leading-none tabular-nums text-foreground">{value}</p>
        {footnote && <p className="truncate text-xs text-muted-foreground">{footnote}</p>}
      </div>
    </Card>
  );
}
