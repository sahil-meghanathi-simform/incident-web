// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { useDelayedFlag } from '../../../hooks/useDelayedFlag';
import { LABELS } from '../../../lib/labels';

type IncidentSearchFieldProps = Readonly<{
  value: string;
  onChange: (value: string) => void;
  /** True while the typed text is still debouncing or the list is refetching. */
  isSearching: boolean;
}>;

/** Search box with a leading icon and a trailing spinner, so typing never looks
 * like it did nothing while the debounced request is on its way. */
export function IncidentSearchField({ value, onChange, isSearching }: IncidentSearchFieldProps): ReactElement {
  const isSpinnerShown = useDelayedFlag(isSearching, { showAfterMs: 150, minVisibleMs: 400 });
  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor="incident-filter-search" className="sr-only">
        {LABELS.filters.searchLabel}
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        id="incident-filter-search"
        type="search"
        className="h-10 pl-9 pr-9"
        placeholder={LABELS.filters.searchPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {isSpinnerShown && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          <Spinner size="sm" label={LABELS.filters.searching} />
        </span>
      )}
    </div>
  );
}
