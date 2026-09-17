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
    <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
      <p className="text-sm font-medium text-amber-900">{LABELS.feedback.accessRevokedTitle}</p>
      <p className="mt-1 text-sm text-amber-700">{LABELS.feedback.accessRevokedBody}</p>
      <TextLink to={ROUTES.incidents} className="mt-3 inline-block">
        {LABELS.incidents.backToList}
      </TextLink>
    </div>
  );
}
