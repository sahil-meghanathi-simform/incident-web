// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/cn';
import { LABELS } from '../../lib/labels';

type FiltersButtonProps = Omit<ComponentPropsWithoutRef<typeof Button>, 'children'> &
  Readonly<{ activeCount: number }>;

/**
 * The "Filters" button that opens a filter popover or sheet (incident list,
 * analytics). forwardRef plus the prop spread because each is handed to a Radix `asChild`
 * trigger, which attaches its ref, aria-expanded and handlers this way.
 *
 * The count is a badge, not "(2)" in the text; the accessible name still says
 * "Filters (2)", which starts with the visible word (WCAG 2.5.3 label-in-name).
 */
export const FiltersButton = forwardRef<HTMLButtonElement, FiltersButtonProps>(
  function FiltersButton({ activeCount, className, ...rest }, ref) {
    const isActive = activeCount > 0;
    return (
      <Button
        ref={ref}
        type="button"
        variant="outline"
        size="lg"
        aria-label={LABELS.filters.openFilters(activeCount)}
        className={cn(
          'shrink-0 gap-2 px-3.5 data-[state=open]:border-ring data-[state=open]:bg-accent',
          isActive && 'border-primary/50 bg-accent text-accent-foreground',
          className,
        )}
        {...rest}
      >
        <SlidersHorizontal aria-hidden="true" />
        <span aria-hidden="true">{LABELS.filters.filtersButton}</span>
        {isActive && (
          <span
            aria-hidden="true"
            className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold tabular-nums text-primary-foreground animate-in zoom-in-50 duration-200"
          >
            {activeCount}
          </span>
        )}
      </Button>
    );
  },
);
