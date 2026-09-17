import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { RouteErrorBoundary } from '../components/feedback/RouteErrorBoundary';
import { ComingSoon } from '../components/feedback/ComingSoon';
import { Forbidden } from '../components/feedback/Forbidden';
import { RequireAuth } from './guards/RequireAuth';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ReportIncidentPage from '../features/incidents/pages/ReportIncidentPage';
import SubmissionReceiptPage from '../features/incidents/pages/SubmissionReceiptPage';
import { ROUTES } from './routes';

/**
 * Login/register are public, top-level routes (siblings of the AppShell tree). Every
 * child of AppShell now requires a session via RequireAuth — an anonymous visit to any
 * of them redirects to /login?next=<pathname+search>. Feature modules replace each
 * remaining ComingSoon element as they land (Modules 2-10 per build-plan.md).
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.login,
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: ROUTES.register,
    element: <RegisterPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <ComingSoon title="Home" /> },
      { path: 'incidents', element: <ComingSoon title="Incidents" /> },
      { path: 'incidents/new', element: <ReportIncidentPage /> },
      { path: 'incidents/new/submitted', element: <SubmissionReceiptPage /> },
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
      { path: '403', element: <Forbidden /> },
      { path: '*', element: <ComingSoon title="Not Found" /> },
    ],
  },
]);
