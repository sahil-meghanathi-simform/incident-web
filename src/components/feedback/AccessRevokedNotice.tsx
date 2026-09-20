// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { ArrowLeft, ShieldOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/Alert';
import { TextLink } from '../ui/TextLink';
import { ROUTES } from '../../app/routes';
import { LABELS } from '../../lib/labels';

/**
 * The Q10 experience: rendered in place of the incident detail body when a 403 arrives
 * mid-session (severity was raised above the viewer's clearance) — never a navigation
 * away, so the user understands what happened.
 */
export function AccessRevokedNotice(): ReactElement {
  return (
    <Alert variant="warning" className="flex gap-3 p-5 animate-in fade-in duration-300">
      <ShieldOff aria-hidden="true" />
      <div>
        <AlertTitle>{LABELS.feedback.accessRevokedTitle}</AlertTitle>
        <AlertDescription>{LABELS.feedback.accessRevokedBody}</AlertDescription>
        <TextLink to={ROUTES.incidents} className="mt-3 inline-flex items-center gap-1.5">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {LABELS.incidents.backToList}
        </TextLink>
      </div>
    </Alert>
  );
}
