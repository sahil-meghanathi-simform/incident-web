// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useEffect, type ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useReportIncident } from '../hooks/useReportIncident';
import { ROUTES } from '../../../app/routes';

/**
 * Reporting an incident is a dialog now, not a screen. `/incidents/new` stays
 * routable for bookmarks and old links: it opens that dialog and puts the reporter
 * on their own reports, so there is a real page behind it rather than a modal over
 * nothing.
 */
export function ReportIncidentRedirect(): ReactElement {
  const { open } = useReportIncident();

  useEffect(() => {
    open();
  }, [open]);

  return <Navigate to={ROUTES.incidentMine} replace />;
}
