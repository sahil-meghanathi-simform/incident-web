import type { ReactElement } from 'react';
import { ROUTES } from '../../app/routes';
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
      <h1 className="font-display text-lg font-semibold tracking-display text-foreground">{LABELS.feedback.forbiddenTitle}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{LABELS.feedback.forbiddenBody}</p>
      <TextLink to={ROUTES.home}>{LABELS.nav.backToHome}</TextLink>
    </div>
  );
}
