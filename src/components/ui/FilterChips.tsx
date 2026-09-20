// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { X } from 'lucide-react';

export type FilterChip = Readonly<{
  /** Stable identity for the chip (the filter key plus value). */
  id: string;
  label: string;
  /** Accessible name for the remove button, e.g. "Remove filter: Severity High". */
  removeLabel: string;
  onRemove: () => void;
}>;

type FilterChipsProps = Readonly<{
  chips: readonly FilterChip[];
  clearAllLabel: string;
  onClearAll: () => void;
}>;

/** Removable summary of the active filters, with "Clear all" right beside them. */
export function FilterChips({ chips, clearAllLabel, onClearAll }: FilterChipsProps): ReactElement | null {
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 animate-in fade-in duration-200">
      <ul className="contents">
        {chips.map((chip) => (
          <li key={chip.id}>
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-accent py-0.5 pl-2.5 pr-1 text-xs font-medium text-accent-foreground">
              {chip.label}
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={chip.removeLabel}
                className="inline-flex size-5 items-center justify-center rounded-full transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClearAll}
        className="rounded-md px-2 py-1 text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {clearAllLabel}
      </button>
    </div>
  );
}
