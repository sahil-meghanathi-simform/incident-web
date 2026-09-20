// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useCallback, useId, type ReactElement } from 'react';
import { Hash, UserRound } from 'lucide-react';
import { DateRangePicker } from '../../../components/ui/DateRangePicker';
import { ToggleGroup, ToggleGroupItem } from '../../../components/ui/ToggleGroup';
import { FilterTextInput } from './FilterTextInput';
import { AUDIT_EVENT_GROUPS, withGroupSelection } from '../lib/auditEventGroups';
import { LABELS } from '../../../lib/labels';
import type { AuditEventType } from '../../../api/contracts/enums';
import type { AuditSearchFilters } from '../schemas/auditSearch.schema';

type AuditFilterControlsProps = Readonly<{
  filters: AuditSearchFilters;
  onChange: (patch: Partial<AuditSearchFilters>) => void;
}>;

const COPY = LABELS.admin;
const GROUP_LABEL_CLASS = 'block text-xs font-semibold uppercase tracking-caps text-muted-foreground';

/**
 * The body of the audit log's FilterPanel. Event types are multi-select — the API
 * always took a list; the old single dropdown could only ever send one — and sit in
 * their four families, each its own toggle set, so "everything about closures" is
 * three adjacent pills rather than a hunt through fourteen options.
 */
export function AuditFilterControls({ filters, onChange }: AuditFilterControlsProps): ReactElement {
  const baseId = useId();
  const dateLabelId = useId();
  const commitActor = useCallback((actorId: string | undefined) => onChange({ actorId }), [onChange]);
  const commitIncident = useCallback((incidentId: string | undefined) => onChange({ incidentId }), [onChange]);

  return (
    <div className="space-y-5">
      <fieldset className="space-y-3.5">
        <legend className="mb-3 flex w-full items-baseline justify-between gap-3">
          <span className={GROUP_LABEL_CLASS}>{COPY.auditFilterType}</span>
          <span className="text-xs text-muted-foreground">{COPY.auditFilterTypeHint}</span>
        </legend>
        {AUDIT_EVENT_GROUPS.map((group) => {
          const labelId = `${baseId}-${group.key}`;
          return (
            <div key={group.key} className="space-y-1.5">
              <span id={labelId} className="block text-xs font-medium text-foreground-soft">
                {group.label}
              </span>
              <ToggleGroup
                type="multiple"
                aria-labelledby={labelId}
                className="flex flex-wrap gap-1.5"
                value={(filters.type ?? []).filter((type) => group.types.includes(type))}
                onValueChange={(next: AuditEventType[]) => {
                  const types = withGroupSelection(filters.type, group, next);
                  onChange({ type: types.length ? types : undefined });
                }}
              >
                {group.types.map((type) => (
                  <ToggleGroupItem key={type} value={type}>
                    {COPY.auditEventLabel(type)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          );
        })}
      </fieldset>

      <FilterTextInput
        id="audit-filter-actor"
        icon={UserRound}
        label={COPY.auditFilterActor}
        placeholder={COPY.auditFilterActorPlaceholder}
        hint={COPY.auditFilterActorHint}
        value={filters.actorId}
        onCommit={commitActor}
      />

      <FilterTextInput
        id="audit-filter-incident"
        icon={Hash}
        label={COPY.auditFilterIncident}
        placeholder={COPY.auditFilterIncidentPlaceholder}
        hint={COPY.auditFilterIncidentHint}
        value={filters.incidentId}
        onCommit={commitIncident}
      />

      <div role="group" aria-labelledby={dateLabelId} className="space-y-2">
        <span id={dateLabelId} className={GROUP_LABEL_CLASS}>
          {COPY.auditFilterDates}
        </span>
        <DateRangePicker
          from={filters.from ?? ''}
          to={filters.to ?? ''}
          onChange={({ from, to }) => onChange({ from: from || undefined, to: to || undefined })}
        />
      </div>
    </div>
  );
}
