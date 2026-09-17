import type { ReactElement } from 'react';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LABELS } from '../../../lib/labels';

type IncidentListEmptyProps = Readonly<{
  hasAnyFilter: boolean;
  clearanceLimited: boolean;
  onClearFilters: () => void;
}>;

/** Distinguishes three real reasons an incident table can be empty (§8.2). */
export function IncidentListEmpty({
  hasAnyFilter,
  clearanceLimited,
  onClearFilters,
}: IncidentListEmptyProps): ReactElement {
  if (clearanceLimited) {
    return (
      <EmptyState
        title={LABELS.incidents.clearanceHidesEverythingTitle}
        body={LABELS.incidents.clearanceHidesEverythingBody}
      />
    );
  }
  if (hasAnyFilter) {
    return (
      <EmptyState
        title={LABELS.incidents.noMatchTitle}
        body={LABELS.incidents.noMatchBody}
        action={
          <Button variant="secondary" onClick={onClearFilters}>
            {LABELS.incidents.clearAllFilters}
          </Button>
        }
      />
    );
  }
  return <EmptyState title={LABELS.incidents.noIncidentsYetTitle} body={LABELS.incidents.noIncidentsYetBody} />;
}
