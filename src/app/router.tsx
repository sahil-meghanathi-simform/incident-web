import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { RouteErrorBoundary } from '../components/feedback/RouteErrorBoundary';
import { ComingSoon } from '../components/feedback/ComingSoon';
import { ROUTES } from './routes';

/**
 * Placeholder tree (Module 0). Every branch already carries a RouteErrorBoundary as
 * its errorElement; RootErrorBoundary wraps the whole router in main.tsx. Feature
 * modules replace each ComingSoon element as they land — auth screens and guards in
 * Module 1, incidents in Modules 2-3, and so on per build-plan.md's module table.
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.login,
    element: <ComingSoon title="Login" />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: ROUTES.register,
    element: <ComingSoon title="Register" />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/',
    element: <AppShell />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <ComingSoon title="Home" /> },
      { path: 'incidents', element: <ComingSoon title="Incidents" /> },
      { path: 'incidents/new', element: <ComingSoon title="Report Incident" /> },
      { path: 'incidents/new/submitted', element: <ComingSoon title="Submitted" /> },
      { path: 'incidents/mine', element: <ComingSoon title="My Reports" /> },
      { path: 'incidents/:id', element: <ComingSoon title="Incident Detail" /> },
      { path: 'triage/queue', element: <ComingSoon title="Triage Queue" /> },
      { path: 'investigations', element: <ComingSoon title="Investigations" /> },
      { path: 'closures/pending', element: <ComingSoon title="Pending Closures" /> },
      { path: 'escalations', element: <ComingSoon title="Escalations" /> },
      { path: 'notifications', element: <ComingSoon title="Notifications" /> },
      { path: 'analytics', element: <ComingSoon title="Analytics" /> },
      { path: 'admin/users', element: <ComingSoon title="Admin · Users" /> },
      { path: 'admin/escalation-policy', element: <ComingSoon title="Admin · Escalation Policy" /> },
      { path: 'admin/jobs', element: <ComingSoon title="Admin · Job Diagnostics" /> },
      { path: 'admin/audit', element: <ComingSoon title="Admin · Audit Log" /> },
      { path: '403', element: <ComingSoon title="Forbidden" /> },
      { path: '*', element: <ComingSoon title="Not Found" /> },
    ],
  },
]);
