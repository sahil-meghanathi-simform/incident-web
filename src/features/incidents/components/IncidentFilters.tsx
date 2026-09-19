import { useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { ToggleGroup, ToggleGroupItem } from '../../../components/ui/ToggleGroup';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { DateRangePicker } from '../../../components/ui/DateRangePicker';
import { Card } from '../../../components/ui/Card';
import { Checkbox } from '../../../components/ui/Checkbox';
import { ActiveFilterPills } from './ActiveFilterPills';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { useAuth } from '../../../hooks/useAuth';
import { SEVERITY_ORDER, SEVERITY_LABEL, SEVERITY_RANK, type Severity } from '../../../lib/severity';
import { STAGE_ORDER, STAGE_LABEL, type Stage } from '../../../lib/stage';
import { IncidentTypeValues } from '../../../api/contracts/enums';
import type { IncidentFilters as IncidentFiltersState } from '../schemas/incidentFilters.schema';

type IncidentFiltersProps = Readonly<{
  filters: IncidentFiltersState;
  onChange: (patch: Partial<IncidentFiltersState>) => void;
}>;

function isIncidentType(value: string): value is (typeof IncidentTypeValues)[number] {
  return (IncidentTypeValues as readonly string[]).includes(value);
}

/** Shared label styling — one occurrence eliminates the duplicated class string
 * (tailwind.md). */
function FilterFieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }): ReactElement {
  const className = 'block text-xs font-medium text-muted-foreground';
  return htmlFor ? (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  ) : (
    <span className={className}>{children}</span>
  );
}

export function IncidentFilters({ filters, onChange }: IncidentFiltersProps): ReactElement {
  const { user } = useAuth();
  const [qDraft, setQDraft] = useState(filters.q ?? '');
  const debouncedQ = useDebouncedValue(qDraft, 300);
  const isFirstRun = useRef(true);

  // Fires only once the debounced value settles — typing itself never triggers a
  // request or a URL update on every keystroke. Deliberately does NOT sync qDraft back
  // from filters.q on every change (that would risk clobbering fast-typed input with a
  // stale round-tripped value); "Clear all" below resets qDraft directly instead.
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    onChange({ q: debouncedQ || undefined });
    // Deliberately depends only on debouncedQ — this should fire once the debounced
    // search text settles, not on every onChange identity change.
  }, [debouncedQ]);

  const clearance = user?.clearanceLevel ?? 1;
  const availableSeverities = SEVERITY_ORDER.filter((s) => SEVERITY_RANK[s] <= clearance);
  const hiddenCount = SEVERITY_ORDER.length - availableSeverities.length;

  const hasAnyFilter =
    !!filters.severity?.length ||
    !!filters.stage?.length ||
    !!filters.type?.length ||
    filters.assignedToMe ||
    filters.reportedByMe ||
    filters.unacknowledged ||
    filters.escalatedOnly ||
    !!filters.from ||
    !!filters.to ||
    !!filters.q;

  return (
    <Card className="space-y-4 p-4">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <FilterFieldLabel>Severity</FilterFieldLabel>
          <ToggleGroup
            type="multiple"
            className="mt-1 flex flex-wrap gap-1.5"
            value={filters.severity ?? []}
            onValueChange={(value: Severity[]) => onChange({ severity: value.length ? value : undefined })}
          >
            {availableSeverities.map((s) => (
              <ToggleGroupItem key={s} value={s}>
                {SEVERITY_LABEL[s]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {hiddenCount > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {hiddenCount} higher {hiddenCount === 1 ? 'severity is' : 'severities are'} hidden by your clearance.
            </p>
          )}
        </div>

        <div>
          <FilterFieldLabel>Stage</FilterFieldLabel>
          <ToggleGroup
            type="multiple"
            className="mt-1 flex flex-wrap gap-1.5"
            value={filters.stage ?? []}
            onValueChange={(value: Stage[]) => onChange({ stage: value.length ? value : undefined })}
          >
            {STAGE_ORDER.map((s) => (
              <ToggleGroupItem key={s} value={s}>
                {STAGE_LABEL[s]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div>
          <FilterFieldLabel htmlFor="incident-filter-type">Type</FilterFieldLabel>
          <Select
            id="incident-filter-type"
            className="mt-1"
            value={filters.type?.[0] ?? ''}
            onChange={(e) => {
              const { value } = e.target;
              onChange({ type: value && isIncidentType(value) ? [value] : undefined });
            }}
          >
            <option value="">Any type</option>
            {IncidentTypeValues.map((t) => (
              <option key={t} value={t}>
                {t.replace('_', ' ')}
              </option>
            ))}
          </Select>
        </div>

        <div className="min-w-64 flex-1">
          <FilterFieldLabel htmlFor="incident-filter-search">Search</FilterFieldLabel>
          <Input
            id="incident-filter-search"
            className="mt-1"
            placeholder="Title or reference…"
            value={qDraft}
            onChange={(e) => setQDraft(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <DateRangePicker
            from={filters.from ?? ''}
            to={filters.to ?? ''}
            onChange={({ from, to }) => onChange({ from: from || undefined, to: to || undefined })}
          />
          <label className="flex items-center gap-1.5 text-sm text-foreground-soft">
            <Checkbox checked={filters.assignedToMe ?? false} onChange={(e) => onChange({ assignedToMe: e.target.checked || undefined })} />
            Assigned to me
          </label>
          <label className="flex items-center gap-1.5 text-sm text-foreground-soft">
            <Checkbox checked={filters.reportedByMe ?? false} onChange={(e) => onChange({ reportedByMe: e.target.checked || undefined })} />
            Reported by me
          </label>
          <label className="flex items-center gap-1.5 text-sm text-foreground-soft">
            <Checkbox checked={filters.unacknowledged ?? false} onChange={(e) => onChange({ unacknowledged: e.target.checked || undefined })} />
            Unacknowledged
          </label>
          <label className="flex items-center gap-1.5 text-sm text-foreground-soft">
            <Checkbox checked={filters.escalatedOnly ?? false} onChange={(e) => onChange({ escalatedOnly: e.target.checked || undefined })} />
            Escalated only
          </label>
        </div>

        {hasAnyFilter && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setQDraft('');
              onChange({
                severity: undefined,
                stage: undefined,
                type: undefined,
                assignedToMe: undefined,
                reportedByMe: undefined,
                unacknowledged: undefined,
                escalatedOnly: undefined,
                from: undefined,
                to: undefined,
                q: undefined,
              });
            }}
          >
            Clear all
          </Button>
        )}
      </div>

      <ActiveFilterPills filters={filters} onChange={onChange} />
    </Card>
  );
}
