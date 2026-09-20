// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useEffect, type ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/Dialog';
import { Field } from '../../../components/ui/Field';
import { OptionSelect, type SelectOption } from '../../../components/ui/OptionSelect';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { CharacterCount } from '../../../components/ui/CharacterCount';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { useToast } from '../../../components/ui/useToast';
import { useChangeSeverity } from '../hooks/useChangeSeverity';
import { useAssignableInvestigators } from '../hooks/useAssignableInvestigators';
import { useSeverityImpact } from '../hooks/useSeverityImpact';
import { changeSeveritySchema } from '../schemas/triage.schema';
import { SeverityChangeImpactWarning } from './SeverityChangeImpactWarning';
import { applyApiErrorToForm } from '../../../lib/formErrors';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { isApiError } from '../../../api/ApiError';
import { cn } from '../../../lib/cn';
import { SEVERITY_ORDER, SEVERITY_LABEL, type Severity } from '../../../lib/severity';
import { LABELS } from '../../../lib/labels';
import type { ChangeSeverityRequest } from '../types/triage.type';
import type { IncidentDetail } from '../../incidents/types/incident.type';

type ChangeSeverityModalProps = Readonly<{
  incident: IncidentDetail;
  isOpen: boolean;
  onClose: () => void;
}>;

/** Mirrors ChangeSeverityRequestSchema's reason bounds (triage.contract.ts) for the
 * live counter only — validation itself stays with the schema. */
// SEVERITY_ORDER/SEVERITY_LABEL are static, contract-defined constants — never
// fetched — so the option list exists synchronously at mount and the form's
// defaultValues/reset always has a matching option to show. (Loading these from
// useIncidentTypes() instead once raced the async fetch against the form's initial
// bind and left the select showing "Low" over a different submitted value.)
const SEVERITY_OPTIONS: ReadonlyArray<SelectOption<Severity>> = SEVERITY_ORDER.map((severity) => ({
  value: severity,
  label: SEVERITY_LABEL[severity],
}));

const REASON_MIN = 10;
const REASON_MAX = 500;

export function ChangeSeverityModal({ incident, isOpen, onClose }: ChangeSeverityModalProps): ReactElement {
  const { show } = useToast();
  const investigatorsQuery = useAssignableInvestigators(1);
  const mutation = useChangeSeverity(incident.id);

  const {
    register,
    control,
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
  const reasonLength = watch('reason')?.length ?? 0;
  const impact = useSeverityImpact(incident, nextSeverity, investigatorsQuery.data);
  const isUnchanged = nextSeverity === incident.severity;

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{LABELS.triage.changeSeverityModalTitle}</DialogTitle>
          <DialogDescription>{LABELS.triage.changeSeverityModalDescription}</DialogDescription>
        </DialogHeader>

        <div
          role="group"
          aria-label={LABELS.triage.severityChangePreview}
          className="mb-5 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-muted/60 px-4 py-3"
        >
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">{LABELS.triage.severityCurrent}</span>
            <SeverityBadge severity={incident.severity} />
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className={cn('flex flex-col gap-1 transition-opacity duration-200', isUnchanged && 'opacity-50')}>
            <span className="text-xs font-medium text-muted-foreground">{LABELS.triage.severityNext}</span>
            <SeverityBadge severity={nextSeverity} />
          </div>
        </div>

        <form onSubmit={submit} noValidate className="space-y-4">
          <Field label={LABELS.incidents.columns.severity} htmlFor="change-severity" error={errors.severity?.message} required>
            {(describedBy) => (
              <Controller
                control={control}
                name="severity"
                render={({ field }) => (
                  <OptionSelect
                    triggerRef={field.ref}
                    id="change-severity"
                    options={SEVERITY_OPTIONS}
                    value={field.value}
                    onChange={(next) => next && field.onChange(next)}
                    onBlur={field.onBlur}
                    hasError={Boolean(errors.severity)}
                    disabled={isSubmitting}
                    aria-describedby={describedBy}
                  />
                )}
              />
            )}
          </Field>

          <SeverityChangeImpactWarning impact={impact} />

          <Field
            label={LABELS.triage.reasonLabel}
            htmlFor="change-severity-reason"
            error={errors.reason?.message}
            hint={LABELS.triage.reasonHint}
            counter={<CharacterCount count={reasonLength} max={REASON_MAX} min={REASON_MIN} />}
            required
          >
            <Textarea
              id="change-severity-reason"
              rows={3}
              hasError={Boolean(errors.reason)}
              disabled={isSubmitting}
              {...register('reason')}
            />
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              {LABELS.chrome.cancel}
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {LABELS.triage.changeSeverity}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
