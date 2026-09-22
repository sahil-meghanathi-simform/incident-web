// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { ShieldAlert } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

type BrandTone = 'onDark' | 'onLight';

type AuthBrandMarkProps = Readonly<{
  tone?: BrandTone;
  className?: string;
}>;

// One axis with two values — a lookup, not a cva() (tailwind.md: reach for cva at
// the second variant axis).
const BADGE_BY_TONE: Readonly<Record<BrandTone, string>> = {
  onDark: 'bg-primary-foreground/15 text-primary-foreground ring-primary-foreground/20',
  onLight: 'bg-primary/10 text-primary ring-primary/20',
};

const TITLE_BY_TONE: Readonly<Record<BrandTone, string>> = {
  onDark: 'text-primary-foreground',
  onLight: 'text-foreground',
};

/**
 * The product lockup on the auth screens. It appears twice: on the deep-plum showcase
 * panel at `lg` and up, and above the form below `lg` where that panel is hidden — so
 * a phone still gets the branding instead of an unmarked form on a bare ground.
 */
export function AuthBrandMark({ tone = 'onLight', className }: AuthBrandMarkProps): ReactElement {
  return (
    <p
      className={cn(
        'flex items-center gap-2.5 font-display text-sm font-semibold tracking-snug sm:text-base',
        TITLE_BY_TONE[tone],
        className,
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1',
          BADGE_BY_TONE[tone],
        )}
      >
        <ShieldAlert className="h-5 w-5" aria-hidden="true" />
      </span>
      {LABELS.nav.appTitle}
    </p>
  );
}
