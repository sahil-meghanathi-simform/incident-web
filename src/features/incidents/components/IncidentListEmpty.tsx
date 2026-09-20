// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import { Inbox, SearchX, ShieldAlert, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LABELS } from '../../../lib/labels';

type IncidentListEmptyProps = Readonly<{
  hasAnyFilter: boolean;
  clearanceLimited: boolean;
  onClearFilters: () => void;
  /** Shown in the no-data branch — a link, never a button (the page supplies it, so
   * this component needs no router of its own). */
  noDataAction?: ReactNode;
}>;

/** Distinguishes three real reasons an incident table can be empty (§8.2). */
export function IncidentListEmpty({
  hasAnyFilter,
  clearanceLimited,
  onClearFilters,
  noDataAction,
}: IncidentListEmptyProps): ReactElement {
  const clearButton = (
    <Button variant="outline" onClick={onClearFilters}>
      <X aria-hidden="true" />
      {LABELS.incidents.clearAllFilters}
    </Button>
  );
  if (clearanceLimited) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title={LABELS.incidents.clearanceHidesEverythingTitle}
        body={LABELS.incidents.clearanceHidesEverythingBody}
        action={clearButton}
      />
    );
  }
  if (hasAnyFilter) {
    return (
      <EmptyState
        icon={SearchX}
        title={LABELS.incidents.noMatchTitle}
        body={LABELS.incidents.noMatchBody}
        action={clearButton}
      />
    );
  }
  return (
    <EmptyState
      icon={Inbox}
      title={LABELS.incidents.noIncidentsYetTitle}
      body={LABELS.incidents.noIncidentsYetBody}
      action={noDataAction}
    />
  );
}
