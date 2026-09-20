// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../../../components/ui/Alert';

type FormErrorAlertProps = Readonly<{
  message: string;
}>;

/** The form-level (non-field) failure on login/register — Alert's own role="alert"
 * announces it the moment it mounts. */
export function FormErrorAlert({ message }: FormErrorAlertProps): ReactElement {
  return (
    <Alert
      variant="destructive"
      className="flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-300"
    >
      <AlertCircle className="mt-0.5 shrink-0" aria-hidden="true" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
