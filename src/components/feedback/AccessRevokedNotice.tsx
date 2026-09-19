import type { ReactElement } from 'react';
import { ROUTES } from '../../app/routes';
import { TextLink } from '../ui/TextLink';
import { LABELS } from '../../lib/labels';

/**
 * The Q10 experience: rendered in place of the incident detail body when a 403 arrives
 * mid-session (severity was raised above the viewer's clearance) — never a navigation
 * away, so the user understands what happened.
 */
export function AccessRevokedNotice(): ReactElement {
  return (
    <div role="alert" className="rounded-lg border border-severity-medium-border bg-severity-medium-surface p-6 text-center">
      <p className="text-sm font-medium text-severity-medium">{LABELS.feedback.accessRevokedTitle}</p>
      <p className="mt-1 text-sm text-severity-medium">{LABELS.feedback.accessRevokedBody}</p>
      <TextLink to={ROUTES.incidents} className="mt-3 inline-block">
        {LABELS.incidents.backToList}
      </TextLink>
    </div>
  );
}
