import type { ReactElement } from 'react';
import { ROUTES } from '../../app/routes';
import { Heading } from '../ui/Heading';
import { TextLink } from '../ui/TextLink';
import { LABELS } from '../../lib/labels';

/**
 * Rendered in place (never a redirect) so the URL that triggered it stays visible and
 * shareable with support — used both as the standalone `/403` route and inline by
 * RequireRole when a signed-in user's role doesn't permit the current route.
 */
export function Forbidden(): ReactElement {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
      <Heading>{LABELS.feedback.forbiddenTitle}</Heading>
      <p className="max-w-sm text-sm text-slate-500">{LABELS.feedback.forbiddenBody}</p>
      <TextLink to={ROUTES.home}>{LABELS.nav.backToHome}</TextLink>
    </div>
  );
}
