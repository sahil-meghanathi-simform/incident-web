// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { EyeOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/Alert';
import { CopyReferenceButton } from './CopyReferenceButton';
import { LABELS } from '../../../lib/labels';

type ClearanceNoticeProps = Readonly<{
  reference: string;
}>;

/** Q9's landing spot: a reference and no dead link, rather than a 403 discovered later. */
export function ClearanceNotice({ reference }: ClearanceNoticeProps): ReactElement {
  return (
    <Alert variant="warning" role="note" className="flex gap-3 text-left">
      <EyeOff aria-hidden="true" />
      <div className="min-w-0 space-y-3">
        <div>
          <AlertTitle>{LABELS.incidents.clearanceNotice.title}</AlertTitle>
          <AlertDescription>{LABELS.incidents.clearanceNotice.body}</AlertDescription>
        </div>
        <CopyReferenceButton reference={reference} />
      </div>
    </Alert>
  );
}
