import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../../components/ui/Modal';
import { Field } from '../../../components/ui/Field';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
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
}>;

/** Back to INVESTIGATION with the RCA text retained server-side — this dialog only
 * collects the reason the investigator will see. */
export function RejectClosureDialog({ incident, isOpen, onClose }: RejectClosureDialogProps): ReactElement {
  const { show } = useToast();
  const mutation = useRejectClosure(incident.id);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RejectClosureRequest>({
    resolver: zodResolver(rejectClosureSchema),
    defaultValues: { reason: '' },
  });

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
    <Modal isOpen={isOpen} onClose={onClose} title={LABELS.closure.rejectModalTitle}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field
          label={LABELS.closure.rejectReasonLabel}
          htmlFor="reject-closure-reason"
          error={errors.reason?.message}
          hint={LABELS.closure.rejectReasonHint}
          required
        >
          <Textarea
            id="reject-closure-reason"
            rows={3}
            hasError={Boolean(errors.reason)}
            disabled={isSubmitting}
            autoFocus
            {...register('reason')}
          />
        </Field>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {LABELS.closure.requestChangesAction}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
