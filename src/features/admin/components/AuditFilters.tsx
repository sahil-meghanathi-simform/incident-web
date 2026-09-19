import type { ReactElement } from 'react';
import { Field } from '../../../components/ui/Field';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { DateRangePicker } from '../../../components/ui/DateRangePicker';
import { Card } from '../../../components/ui/Card';
import { AuditEventTypeValues } from '../../../api/contracts/enums';
import { LABELS } from '../../../lib/labels';
import type { AuditSearchFilters } from '../schemas/auditSearch.schema';

type AuditFiltersProps = Readonly<{
  filters: AuditSearchFilters;
  onChange: (patch: Partial<AuditSearchFilters>) => void;
}>;

function isAuditEventType(value: string): value is (typeof AuditEventTypeValues)[number] {
  return (AuditEventTypeValues as readonly string[]).includes(value);
}

export function AuditFilters({ filters, onChange }: AuditFiltersProps): ReactElement {
  const hasAnyFilter = !!filters.type?.length || !!filters.actorId || !!filters.incidentId || !!filters.from || !!filters.to;

  return (
    <Card className="space-y-4 p-4">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <Field label={LABELS.admin.auditFilterType} htmlFor="audit-filter-type">
            <Select
              id="audit-filter-type"
              value={filters.type?.[0] ?? ''}
              onChange={(e) => {
                const { value } = e.target;
                onChange({ type: value && isAuditEventType(value) ? [value] : undefined });
              }}
            >
              <option value="">{LABELS.admin.auditFilterTypeAny}</option>
              {AuditEventTypeValues.map((t) => (
                <option key={t} value={t}>
                  {t.replaceAll('_', ' ')}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="min-w-56">
          <Field label={LABELS.admin.auditFilterActor} htmlFor="audit-filter-actor">
            <Input
              id="audit-filter-actor"
              placeholder={LABELS.admin.auditFilterActorPlaceholder}
              value={filters.actorId ?? ''}
              onChange={(e) => onChange({ actorId: e.target.value || undefined })}
            />
          </Field>
        </div>

        <div className="min-w-56">
          <Field label={LABELS.admin.auditFilterIncident} htmlFor="audit-filter-incident">
            <Input
              id="audit-filter-incident"
              placeholder={LABELS.admin.auditFilterIncidentPlaceholder}
              value={filters.incidentId ?? ''}
              onChange={(e) => onChange({ incidentId: e.target.value || undefined })}
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <DateRangePicker
          from={filters.from ?? ''}
          to={filters.to ?? ''}
          onChange={({ from, to }) => onChange({ from: from || undefined, to: to || undefined })}
        />

        {hasAnyFilter && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => onChange({ type: undefined, actorId: undefined, incidentId: undefined, from: undefined, to: undefined })}
          >
            {LABELS.admin.auditClearFilters}
          </Button>
        )}
      </div>
    </Card>
  );
}
