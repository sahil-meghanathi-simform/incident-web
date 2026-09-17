import type { ReactElement, ReactNode } from 'react';
import { formatDateTime } from '../../../lib/datetime';
import type { IncidentDetail } from '../types/incident.type';

function Field({ label, value }: { label: string; value: ReactNode }): ReactElement {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-900">{value}</dd>
    </div>
  );
}

type IncidentOverviewTabProps = Readonly<{
  incident: IncidentDetail;
}>;

/** Core fields + the meta panel — everyone who passed the clearance gate sees this much. */
export function IncidentOverviewTab({ incident }: IncidentOverviewTabProps): ReactElement {
  return (
    <div className="grid gap-6 py-4 sm:grid-cols-3">
      <div className="space-y-4 sm:col-span-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">Description</h2>
          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{incident.description}</p>
        </div>
        {(incident.rootCause || incident.correctiveAction) && (
          <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3">
            {incident.rootCause && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Root cause</h3>
                <p className="mt-1 text-sm text-slate-800">{incident.rootCause}</p>
              </div>
            )}
            {incident.correctiveAction && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Corrective action</h3>
                <p className="mt-1 text-sm text-slate-800">{incident.correctiveAction}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <dl className="space-y-3">
        <Field label="Type" value={incident.type.replace('_', ' ')} />
        <Field label="Reported by" value={incident.reporter.displayName} />
        {incident.assignedInvestigator !== undefined && (
          <Field label="Assigned investigator" value={incident.assignedInvestigator?.displayName ?? 'Unassigned'} />
        )}
        {incident.acknowledgement !== undefined && (
          <Field
            label="Acknowledged"
            value={
              incident.acknowledgement
                ? `${formatDateTime(incident.acknowledgement.acknowledgedAt)} by ${incident.acknowledgement.acknowledgedBy?.displayName ?? 'someone since removed'}`
                : 'Not yet acknowledged'
            }
          />
        )}
        <Field label="Created" value={formatDateTime(incident.createdAt)} />
        <Field label="Last updated" value={formatDateTime(incident.updatedAt)} />
      </dl>
    </div>
  );
}
