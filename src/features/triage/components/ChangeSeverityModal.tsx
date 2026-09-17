import { useEffect, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../../components/ui/Modal';
import { Field } from '../../../components/ui/Field';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/useToast';
import { useChangeSeverity } from '../hooks/useChangeSeverity';
import { useAssignableInvestigators } from '../hooks/useAssignableInvestigators';
import { useSeverityImpact } from '../hooks/useSeverityImpact';
import { changeSeveritySchema } from '../schemas/triage.schema';
import { SeverityChangeImpactWarning } from './SeverityChangeImpactWarning';
import { applyApiErrorToForm } from '../../../lib/formErrors';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { isApiError } from '../../../api/ApiError';
import { SEVERITY_ORDER, SEVERITY_LABEL } from '../../../lib/severity';
import { LABELS } from '../../../lib/labels';
import type { ChangeSeverityRequest } from '../types/triage.type';
import type { IncidentDetail } from '../../incidents/types/incident.type';

type ChangeSeverityModalProps = Readonly<{
  incident: IncidentDetail;
  isOpen: boolean;
  onClose: () => void;
}>;

export function ChangeSeverityModal({ incident, isOpen, onClose }: ChangeSeverityModalProps): ReactElement {
  const { show } = useToast();
  const investigatorsQuery = useAssignableInvestigators(1);
  const mutation = useChangeSeverity(incident.id);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangeSeverityRequest>({
    resolver: zodResolver(changeSeveritySchema(incident.severity)),
    defaultValues: { severity: incident.severity, reason: '' },
  });

  // Reopening the modal (e.g. after an earlier cancel) starts from the incident's
  // CURRENT severity, not whatever was left over from a previous edit.
  useEffect(() => {
    if (isOpen) reset({ severity: incident.severity, reason: '' });
  }, [isOpen, incident.severity, reset]);

  const nextSeverity = watch('severity');
  const impact = useSeverityImpact(incident, nextSeverity, investigatorsQuery.data);

  const submit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({ version: incident.version, body: values });
      show(LABELS.triage.severityChangedToast, 'success');
      onClose();
    } catch (err) {
      if (isApiError(err) && err.status === 422) {
        applyApiErrorToForm(err, setError);
        return;
      }
      if (isApiError(err) && err.code === 'STALE_VERSION') {
        show(LABELS.triage.staleVersionError, 'error');
        onClose();
        return;
      }
      // A self-inflicted raise (Q10): the write already committed — reaching this
      // modal at all means the actor could see the incident's PRE-change state, so
      // the only way changeSeverity now returns 403 is the post-write read-back
      // being denied to the actor who just raised their own incident out of view.
      // Confirm the change succeeded rather than reporting it as a failure.
      if (isApiError(err) && err.code === 'INSUFFICIENT_CLEARANCE') {
        show(LABELS.triage.selfInflictedRaiseToast, 'success');
        onClose();
        return;
      }
      show(getErrorMessage(err), 'error');
    }
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={LABELS.triage.changeSeverityModalTitle}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label={LABELS.incidents.columns.severity} htmlFor="change-severity" error={errors.severity?.message} required>
          {/* SEVERITY_ORDER/SEVERITY_LABEL are static, contract-defined constants — never
              fetched — so the option list exists synchronously at mount and the form's
              defaultValues/reset always has a matching <option> to bind to. Loading these
              from useIncidentTypes() instead raced the async fetch against RHF's initial
              bind: with no HIGH option yet in the DOM, reset() silently fell back to
              whatever option rendered first, leaving the select showing "Low" while the
              real, submitted value stayed whatever reset() had set internally. */}
          <Select id="change-severity" hasError={Boolean(errors.severity)} disabled={isSubmitting} {...register('severity')}>
            {SEVERITY_ORDER.map((severity) => (
              <option key={severity} value={severity}>
                {SEVERITY_LABEL[severity]}
              </option>
            ))}
          </Select>
        </Field>

        <SeverityChangeImpactWarning impact={impact} />

        <Field
          label={LABELS.triage.reasonLabel}
          htmlFor="change-severity-reason"
          error={errors.reason?.message}
          hint={LABELS.triage.reasonHint}
          required
        >
          <Textarea id="change-severity-reason" rows={3} hasError={Boolean(errors.reason)} disabled={isSubmitting} {...register('reason')} />
        </Field>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {LABELS.triage.changeSeverity}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
