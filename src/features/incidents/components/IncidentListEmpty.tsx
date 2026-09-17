import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';

interface IncidentListEmptyProps {
  hasAnyFilter: boolean;
  clearanceLimited: boolean;
  onClearFilters: () => void;
}

/** Distinguishes three real reasons an incident table can be empty (§8.2). */
export function IncidentListEmpty({ hasAnyFilter, clearanceLimited, onClearFilters }: IncidentListEmptyProps) {
  if (clearanceLimited) {
    return (
      <EmptyState
        title="Your clearance hides everything here"
        body="Every incident matching these filters is above your clearance level. An investigator or manager with higher clearance can still act on them."
      />
    );
  }
  if (hasAnyFilter) {
    return (
      <EmptyState
        title="No incidents match these filters"
        body="Try widening the date range or clearing a filter."
        action={
          <Button variant="secondary" onClick={onClearFilters}>
            Clear all filters
          </Button>
        }
      />
    );
  }
  return <EmptyState title="No incidents yet" body="Reports will show up here once they're filed." />;
}
