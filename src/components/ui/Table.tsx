// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { HTMLAttributes, ReactElement, ReactNode, TdHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type TableProps = Readonly<{
  children: ReactNode;
  className?: string;
  /** Rendered under the table inside the same bordered card (pagination, totals). */
  footer?: ReactNode;
  /** Below `md`, reflow each row into a labelled card (cells need a `label`). The
   * DOM stays one <table> — no duplicated content for a mobile layout. */
  isStacked?: boolean;
  /** Minimum width before the card scrolls horizontally instead of squashing. */
  minWidth?: 'sm' | 'md' | 'lg';
  /** Names the scroll region and makes it a Tab stop, so its arrow keys scroll it.
   * Needed only by a table whose rows hold nothing focusable — one with row links
   * already scrolls as focus moves through them. */
  label?: string;
}>;

// Static strings (not built from the value) so Tailwind's scanner can see them.
const MIN_WIDTH_CLASS = { sm: 'min-w-xl', md: 'min-w-3xl', lg: 'min-w-5xl' } as const;
const MIN_WIDTH_FROM_MD_CLASS = { sm: 'md:min-w-xl', md: 'md:min-w-3xl', lg: 'md:min-w-5xl' } as const;

// A long table scrolls inside its card — header pinned (TableHeader), pagination
// footer always in reach — instead of pushing the page down. 70% of the viewport,
// floored at 24rem so a short window still shows a useful run of rows. A stacked
// table is a list of cards below md, where a nested scroller would only trap touch
// scrolling, so there it keeps the page's own scroll.
const MAX_HEIGHT_CLASS = 'max-h-[max(24rem,70dvh)]';
const MAX_HEIGHT_FROM_MD_CLASS = 'md:max-h-[max(24rem,70dvh)]';

export function Table({
  children,
  className,
  footer,
  isStacked = false,
  minWidth = 'md',
  label,
}: TableProps): ReactElement {
  return (
    <div
      data-stacked={isStacked}
      className="group/table overflow-hidden rounded-xl border border-border bg-card shadow-sm animate-in fade-in duration-300"
    >
      <div
        {...(label ? { role: 'region', 'aria-label': label, tabIndex: 0 } : {})}
        className={cn(
          'overflow-auto overscroll-x-contain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
          isStacked ? MAX_HEIGHT_FROM_MD_CLASS : MAX_HEIGHT_CLASS,
        )}
      >
        <table
          className={cn(
            'w-full border-collapse text-sm',
            isStacked ? cn('max-md:block', MIN_WIDTH_FROM_MD_CLASS[minWidth]) : MIN_WIDTH_CLASS[minWidth],
            className,
          )}
        >
          {children}
        </table>
      </div>
      {footer}
    </div>
  );
}

export function TableBody({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>): ReactElement {
  return (
    <tbody
      className={cn(
        'divide-y divide-border',
        'group-data-[stacked=true]/table:max-md:block group-data-[stacked=true]/table:max-md:divide-y-0 group-data-[stacked=true]/table:max-md:space-y-3 group-data-[stacked=true]/table:max-md:p-3',
        className,
      )}
      {...rest}
    />
  );
}

export function TableRow({ className, ...rest }: HTMLAttributes<HTMLTableRowElement>): ReactElement {
  return (
    <tr
      className={cn(
        'relative transition-colors hover:bg-accent/60 focus-within:bg-accent/60',
        'group-data-[stacked=true]/table:max-md:grid group-data-[stacked=true]/table:max-md:grid-cols-2 group-data-[stacked=true]/table:max-md:gap-x-4 group-data-[stacked=true]/table:max-md:gap-y-2.5',
        'group-data-[stacked=true]/table:max-md:rounded-lg group-data-[stacked=true]/table:max-md:border group-data-[stacked=true]/table:max-md:border-border group-data-[stacked=true]/table:max-md:p-3',
        className,
      )}
      {...rest}
    />
  );
}

type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> &
  Readonly<{
    /** Shown as the field name when the table is stacked on mobile (CSS
     * pseudo-content — not a text node, so it never duplicates page text). */
    label?: string;
    /** Takes the full row width when stacked (titles, primary cells). */
    isWide?: boolean;
    isNumeric?: boolean;
    isMono?: boolean;
    /** Hidden below `sm` in the scrolling (non-stacked) layout — low-priority columns. */
    hideBelow?: 'sm' | 'md' | 'lg';
  }>;

const HIDE_BELOW_CLASS = { sm: 'max-sm:hidden', md: 'max-md:hidden', lg: 'max-lg:hidden' } as const;

export function TableCell({
  className,
  label,
  isWide,
  isNumeric,
  isMono,
  hideBelow,
  ...rest
}: TableCellProps): ReactElement {
  return (
    <td
      data-label={label}
      className={cn(
        'px-4 py-3 align-middle text-foreground-soft',
        isNumeric && 'text-right tabular-nums',
        isMono && 'font-mono text-xs',
        hideBelow && HIDE_BELOW_CLASS[hideBelow],
        'group-data-[stacked=true]/table:max-md:flex group-data-[stacked=true]/table:max-md:min-w-0 group-data-[stacked=true]/table:max-md:flex-col group-data-[stacked=true]/table:max-md:gap-1 group-data-[stacked=true]/table:max-md:p-0 group-data-[stacked=true]/table:max-md:text-left',
        'group-data-[stacked=true]/table:max-md:before:text-xs group-data-[stacked=true]/table:max-md:before:font-medium group-data-[stacked=true]/table:max-md:before:text-muted-foreground group-data-[stacked=true]/table:max-md:before:content-[attr(data-label)]',
        isWide && 'group-data-[stacked=true]/table:max-md:col-span-2',
        className,
      )}
      {...rest}
    />
  );
}
