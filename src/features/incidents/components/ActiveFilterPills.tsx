import type { ReactElement } from 'react';
import { X } from 'lucide-react';
import { SEVERITY_LABEL, type Severity } from '../../../lib/severity';
import { STAGE_LABEL, type Stage } from '../../../lib/stage';
import type { IncidentFilters as IncidentFiltersState } from '../schemas/incidentFilters.schema';

type Pill = Readonly<{ key: string; label: string; onRemove: () => void }>;

type ActiveFilterPillsProps = Readonly<{
  filters: IncidentFiltersState;
  onChange: (patch: Partial<IncidentFiltersState>) => void;
}>;

function removeFromArray<T extends string>(current: T[] | undefined, value: T): T[] | undefined {
  const next = (current ?? []).filter((v) => v !== value);
  return next.length ? next : undefined;
}

/** The dismissible chip row above the results — the single clearest signal of
 * what's currently filtering the list, replacing the old design's total
 * reliance on scanning every checkbox to find what's checked. */
export function ActiveFilterPills({ filters, onChange }: ActiveFilterPillsProps): ReactElement | null {
  const pills: Pill[] = [
    ...(filters.severity ?? []).map((s: Severity) => ({
      key: `severity:${s}`,
      label: SEVERITY_LABEL[s],
      onRemove: () => onChange({ severity: removeFromArray(filters.severity, s) }),
    })),
    ...(filters.stage ?? []).map((s: Stage) => ({
      key: `stage:${s}`,
      label: STAGE_LABEL[s],
      onRemove: () => onChange({ stage: removeFromArray(filters.stage, s) }),
    })),
    ...(filters.type?.[0] ? [{ key: 'type', label: filters.type[0].replace('_', ' '), onRemove: () => onChange({ type: undefined }) }] : []),
    ...(filters.q ? [{ key: 'q', label: `"${filters.q}"`, onRemove: () => onChange({ q: undefined }) }] : []),
    ...(filters.assignedToMe ? [{ key: 'assignedToMe', label: 'Assigned to me', onRemove: () => onChange({ assignedToMe: undefined }) }] : []),
    ...(filters.reportedByMe ? [{ key: 'reportedByMe', label: 'Reported by me', onRemove: () => onChange({ reportedByMe: undefined }) }] : []),
    ...(filters.unacknowledged ? [{ key: 'unacknowledged', label: 'Unacknowledged', onRemove: () => onChange({ unacknowledged: undefined }) }] : []),
    ...(filters.escalatedOnly ? [{ key: 'escalatedOnly', label: 'Escalated only', onRemove: () => onChange({ escalatedOnly: undefined }) }] : []),
    ...(filters.from || filters.to
      ? [{ key: 'dateRange', label: [filters.from, filters.to].filter(Boolean).join(' – '), onRemove: () => onChange({ from: undefined, to: undefined }) }]
      : []),
  ];

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((pill) => (
        <button
          key={pill.key}
          type="button"
          onClick={pill.onRemove}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground hover:bg-accent/70"
        >
          {pill.label}
          <X className="h-3 w-3" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
