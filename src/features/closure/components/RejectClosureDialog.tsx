// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useEffect, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Undo2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/Dialog';
import { Field } from '../../../components/ui/Field';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { CharacterCount } from '../../../components/ui/CharacterCount';
import { useToast } from '../../../components/ui/useToast';
import { useRejectClosure } from '../hooks/useRejectClosure';
import { rejectClosureSchema } from '../schemas/closure.schema';
import { applyApiErrorToForm } from '../../../lib/formErrors';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { isApiError } from '../../../api/ApiError';
import { LABELS } from '../../../lib/labels';
import type { RejectClosureRequest } from '../types/closure.type';
import type { IncidentDetail } from '../../incidents/types/incident.type';

type RejectClosureDialogProps = Readonly<{
  incident: IncidentDetail;
  isOpen: boolean;
  onClose: () => void;
  /** Lets the opener mirror the in-flight request on its own trigger button. */
  onPendingChange?: (isPending: boolean) => void;
}>;

/** Mirrors RejectClosureRequestSchema's reason bounds (closure.contract.ts) for the
 * live counter only — validation itself stays with the schema. */
const REASON_MIN = 10;
const REASON_MAX = 1000;

/** Back to INVESTIGATION with the RCA text retained server-side — this dialog only
 * collects the reason the investigator will see. */
export function RejectClosureDialog({ incident, isOpen, onClose, onPendingChange }: RejectClosureDialogProps): ReactElement {
  const { show } = useToast();
  const mutation = useRejectClosure(incident.id);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RejectClosureRequest>({
    resolver: zodResolver(rejectClosureSchema),
    defaultValues: { reason: '' },
  });

  const reasonLength = watch('reason')?.length ?? 0;
  const isOverLimit = reasonLength > REASON_MAX;

  useEffect(() => {
    onPendingChange?.(mutation.isPending);
  }, [mutation.isPending, onPendingChange]);

  const submit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({ version: incident.version, body: values });
      show(LABELS.closure.rejectedToast, 'success');
      reset({ reason: '' });
      onClose();
    } catch (err) {
      if (isApiError(err) && err.status === 422) {
        applyApiErrorToForm(err, setError);
        return;
      }
      show(getErrorMessage(err), 'error');
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-warning-surface text-warning">
              <Undo2 className="size-4" aria-hidden="true" />
            </span>
            {LABELS.closure.rejectModalTitle}
          </DialogTitle>
          <DialogDescription>{LABELS.closure.rejectModalDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate className="space-y-4">
          <Field
            label={LABELS.closure.rejectReasonLabel}
            htmlFor="reject-closure-reason"
            error={errors.reason?.message}
            hint={LABELS.closure.rejectReasonHint}
            counter={<CharacterCount count={reasonLength} max={REASON_MAX} min={REASON_MIN} />}
            required
          >
            <Textarea
              id="reject-closure-reason"
              rows={4}
              hasError={Boolean(errors.reason) || isOverLimit}
              disabled={isSubmitting}
              autoFocus
              {...register('reason')}
            />
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              {LABELS.chrome.cancel}
            </Button>
            <Button type="submit" isLoading={isSubmitting} disabled={isOverLimit}>
              {LABELS.closure.requestChangesAction}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
