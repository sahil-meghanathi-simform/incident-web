// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useId, type ReactElement, type ReactNode } from 'react';
import { Button } from './Button';
import { FiltersButton } from './FiltersButton';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from './Popover';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './Sheet';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { LABELS } from '../../lib/labels';

type FilterPanelProps = Readonly<{
  title: string;
  /** How many filters are on — the button's badge and the panel's status line. */
  activeCount: number;
  resetLabel: string;
  onReset: () => void;
  /** Defaults to "nothing is on". A panel whose reset also restores non-counted state
   * (the analytics period) passes `false` to keep it available. */
  isResetDisabled?: boolean;
  /** The filter controls. They apply as they change; the panel has no "Apply". */
  children: ReactNode;
}>;

const COPY = LABELS.filters;

/**
 * The "Filters" button and the panel it opens — one component for every filtered list
 * (incidents, analytics, audit log), so they can't drift apart. From `md` up the panel
 * is a popover under the button; below that a popover is too cramped, so the same
 * controls rise in a bottom sheet instead. Rendered once, never both.
 *
 * In the popover the header and footer stay put while the controls scroll between
 * them, and the whole panel is capped to the room Radix reports around the button — a
 * short window scrolls inside the panel rather than pushing it off screen. Filters
 * apply as they're changed, with the list updating behind the panel, so "Done" only
 * closes it.
 */
export function FilterPanel({
  title,
  activeCount,
  resetLabel,
  onReset,
  isResetDisabled = activeCount === 0,
  children,
}: FilterPanelProps): ReactElement {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const titleId = useId();
  const descriptionId = useId();
  const status = (
    <p aria-live="polite" className="text-xs text-muted-foreground">
      {COPY.activeCount(activeCount)}
    </p>
  );

  if (!isDesktop) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <FiltersButton activeCount={activeCount} />
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{COPY.sheetDescription}</SheetDescription>
            {status}
          </SheetHeader>
          {children}
          <SheetFooter className="mt-6">
            <Button variant="ghost" onClick={onReset} disabled={isResetDisabled}>
              {resetLabel}
            </Button>
            <SheetClose asChild>
              <Button>{COPY.done}</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FiltersButton activeCount={activeCount} />
      </PopoverTrigger>
      <PopoverContent
        role="dialog"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        collisionPadding={16}
        className="flex max-h-(--radix-popover-content-available-height) w-md flex-col overflow-hidden p-0"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="font-display text-base font-semibold tracking-snug text-foreground">
              {title}
            </h2>
            <p id={descriptionId} className="text-xs text-muted-foreground">
              {COPY.sheetDescription}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onReset} disabled={isResetDisabled} className="-mr-2 shrink-0">
            {resetLabel}
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-muted px-5 py-3">
          {status}
          <PopoverClose asChild>
            <Button size="sm">{COPY.done}</Button>
          </PopoverClose>
        </footer>
      </PopoverContent>
    </Popover>
  );
}
