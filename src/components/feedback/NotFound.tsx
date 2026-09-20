// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Compass, LayoutDashboard, List } from 'lucide-react';
import { Button } from '../ui/Button';
import { StatusPage } from './StatusPage';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ROUTES } from '../../app/routes';
import { LABELS } from '../../lib/labels';

/** The catch-all route inside the app shell. */
export function NotFound(): ReactElement {
  useDocumentTitle(LABELS.feedback.notFoundTitle);
  return (
    <StatusPage
      icon={Compass}
      eyebrow="404"
      title={LABELS.feedback.notFoundTitle}
      body={LABELS.feedback.notFoundBody}
      actions={
        <>
          <Button asChild>
            <Link to={ROUTES.home}>
              <LayoutDashboard aria-hidden="true" />
              {LABELS.feedback.goToDashboard}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={ROUTES.incidents}>
              <List aria-hidden="true" />
              {LABELS.nav.items.incidents}
            </Link>
          </Button>
        </>
      }
    />
  );
}
