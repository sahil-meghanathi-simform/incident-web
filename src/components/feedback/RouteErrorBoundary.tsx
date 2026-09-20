// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { useRouteError, isRouteErrorResponse, Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, LayoutDashboard, RotateCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { StatusPage } from './StatusPage';
import { ROUTES } from '../../app/routes';
import { LABELS } from '../../lib/labels';

function describe(error: unknown): string | null {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`;
  if (error instanceof Error) return error.message;
  return null;
}

/**
 * Per-route errorElement — catches contract/parse failures and render throws. Shows
 * plain-language copy with the raw error tucked behind a disclosure for support, and
 * "Try again" re-runs the current route (navigate(0)) instead of a full page reload.
 */
export function RouteErrorBoundary(): ReactElement {
  const error = useRouteError();
  const navigate = useNavigate();
  const details = describe(error);

  return (
    <StatusPage
      icon={AlertTriangle}
      tone="danger"
      title={LABELS.feedback.routeErrorTitle}
      body={LABELS.feedback.routeErrorBody}
      actions={
        <>
          <Button onClick={() => navigate(0)}>
            <RotateCw aria-hidden="true" />
            {LABELS.feedback.tryAgain}
          </Button>
          <Button asChild variant="outline">
            <Link to={ROUTES.home}>
              <LayoutDashboard aria-hidden="true" />
              {LABELS.feedback.goToDashboard}
            </Link>
          </Button>
        </>
      }
    >
      {details && (
        <details className="mt-8 w-full max-w-md rounded-lg border border-border bg-card px-4 py-3 text-left text-xs text-muted-foreground">
          <summary className="cursor-pointer font-medium text-foreground-soft">{LABELS.feedback.routeErrorDetails}</summary>
          <pre className="mt-2 whitespace-pre-wrap break-words font-mono">{details}</pre>
        </details>
      )}
    </StatusPage>
  );
}
