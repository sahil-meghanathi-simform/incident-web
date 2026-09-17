import { useEffect, useRef, useState } from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { DateRangePicker } from '../../../components/ui/DateRangePicker';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { useAuth } from '../../../hooks/useAuth';
import { SEVERITY_ORDER, SEVERITY_LABEL, SEVERITY_RANK } from '../../../lib/severity';
import { STAGE_ORDER, STAGE_LABEL } from '../../../lib/stage';
import { IncidentTypeValues } from '../../../api/contracts/enums';
import type { IncidentFilters as IncidentFiltersState } from '../schemas/incidentFilters.schema';
import type { Severity } from '../../../lib/severity';
import type { Stage } from '../../../lib/stage';

interface IncidentFiltersProps {
  filters: IncidentFiltersState;
  onChange: (patch: Partial<IncidentFiltersState>) => void;
}

function toggleInArray<T extends string>(current: T[] | undefined, value: T): T[] | undefined {
  const set = new Set(current ?? []);
  if (set.has(value)) set.delete(value);
  else set.add(value);
  return set.size ? Array.from(set) : undefined;
}

export function IncidentFilters({ filters, onChange }: IncidentFiltersProps) {
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
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <span className="block text-xs font-medium text-slate-500">Severity</span>
          <div className="mt-1 flex flex-wrap gap-3">
            {availableSeverities.map((s) => (
              <label key={s} className="flex items-center gap-1.5 text-sm text-slate-700">
                <Checkbox
                  checked={filters.severity?.includes(s) ?? false}
                  onChange={() => onChange({ severity: toggleInArray(filters.severity as Severity[], s) })}
                />
                {SEVERITY_LABEL[s]}
              </label>
            ))}
          </div>
          {hiddenCount > 0 && (
            <p className="mt-1 text-xs text-slate-400">
              {hiddenCount} higher {hiddenCount === 1 ? 'severity is' : 'severities are'} hidden by your clearance.
            </p>
          )}
        </div>

        <div>
          <span className="block text-xs font-medium text-slate-500">Stage</span>
          <div className="mt-1 flex flex-wrap gap-3">
            {STAGE_ORDER.map((s) => (
              <label key={s} className="flex items-center gap-1.5 text-sm text-slate-700">
                <Checkbox
                  checked={filters.stage?.includes(s) ?? false}
                  onChange={() => onChange({ stage: toggleInArray(filters.stage as Stage[], s) })}
                />
                {STAGE_LABEL[s]}
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-xs font-medium text-slate-500">Type</span>
          <Select
            className="mt-1"
            value={filters.type?.[0] ?? ''}
            onChange={(e) => onChange({ type: e.target.value ? [e.target.value as (typeof IncidentTypeValues)[number]] : undefined })}
          >
            <option value="">Any type</option>
            {IncidentTypeValues.map((t) => (
              <option key={t} value={t}>
                {t.replace('_', ' ')}
              </option>
            ))}
          </Select>
        </div>

        <div className="min-w-[16rem] flex-1">
          <span className="block text-xs font-medium text-slate-500">Search</span>
          <Input
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
          <label className="flex items-center gap-1.5 text-sm text-slate-700">
            <Checkbox checked={filters.assignedToMe ?? false} onChange={(e) => onChange({ assignedToMe: e.target.checked || undefined })} />
            Assigned to me
          </label>
          <label className="flex items-center gap-1.5 text-sm text-slate-700">
            <Checkbox checked={filters.reportedByMe ?? false} onChange={(e) => onChange({ reportedByMe: e.target.checked || undefined })} />
            Reported by me
          </label>
          <label className="flex items-center gap-1.5 text-sm text-slate-700">
            <Checkbox
              checked={filters.unacknowledged ?? false}
              onChange={(e) => onChange({ unacknowledged: e.target.checked || undefined })}
            />
            Unacknowledged
          </label>
          <label className="flex items-center gap-1.5 text-sm text-slate-700">
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
    </div>
  );
}
