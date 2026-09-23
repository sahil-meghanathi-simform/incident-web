// rules-ok: state-management.md — this IS the typed hook it asks for. The one
// useContext() call for this Context lives here, guarding a missing provider,
// so no call site ever touches useContext directly.
import { useContext } from 'react';
import { ReportIncidentContext, type ReportIncidentContextValue } from '../reportIncidentContext';

/** Reporting an incident is reachable from the sidebar, the command palette, the
 * dashboard and both incident lists, so the dialog is mounted once by
 * ReportIncidentProvider and opened through this hook rather than re-mounted per
 * screen. */
export function useReportIncident(): ReportIncidentContextValue {
  const ctx = useContext(ReportIncidentContext);
  if (!ctx) throw new Error('useReportIncident must be used within a ReportIncidentProvider');
  return ctx;
}
