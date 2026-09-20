// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { StatusPage } from './StatusPage';
import { ROUTES } from '../../app/routes';
import { LABELS } from '../../lib/labels';

/**
 * Rendered in place (never a redirect) so the URL that triggered it stays visible and
 * shareable with support — used both as the standalone `/403` route and inline by
 * RequireRole when a signed-in user's role doesn't permit the current route.
 */
export function Forbidden(): ReactElement {
  return (
    <StatusPage
      icon={Lock}
      eyebrow="403"
      title={LABELS.feedback.forbiddenTitle}
      body={LABELS.feedback.forbiddenBody}
      actions={
        <Button asChild variant="outline">
          <Link to={ROUTES.home}>
            <LayoutDashboard aria-hidden="true" />
            {LABELS.nav.backToHome}
          </Link>
        </Button>
      }
    />
  );
}
