import { useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field } from '../../../components/ui/Field';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useToast } from '../../../components/ui/useToast';
import { useProposeClosure } from '../hooks/useProposeClosure';
import { proposeClosureSchema } from '../schemas/closure.schema';
import { ClosureRequirementsHint } from './ClosureRequirementsHint';
import { applyApiErrorToForm } from '../../../lib/formErrors';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { isApiError } from '../../../api/ApiError';
import { LABELS } from '../../../lib/labels';
import type { ProposeClosureRequest } from '../types/closure.type';
import type { IncidentDetail } from '../../incidents/types/incident.type';

const MAX_LENGTH = 4000;

type ClosureProposalFormProps = Readonly<{
  incident: IncidentDetail;
}>;

/**
 * The investigator's own draft. Gate 1 of the four-layer closure defence (build-
 * plan.md §Module 6) lives in proposeClosureSchema, mirrored exactly from the server's
 * ProposeClosureRequestSchema — the submit button stays enabled through client
 * validation, but the §6 "not merely discouraged by the form" requirement is proven by
 * the backend test that calls the endpoint directly, not by this component.
 */
export function ClosureProposalForm({ incident }: ClosureProposalFormProps): ReactElement {
  const { show } = useToast();
  const mutation = useProposeClosure(incident.id);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<ProposeClosureRequest | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProposeClosureRequest>({
    resolver: zodResolver(proposeClosureSchema),
    // A rejected proposal retains its RCA text server-side (build-plan.md §Module 6) so
    // the investigator edits rather than retypes — this is what surfaces that text
    // back into the form rather than silently discarding it on the client.
    defaultValues: { rootCause: incident.rootCause ?? '', correctiveAction: incident.correctiveAction ?? '' },
  });

  const rootCauseLength = watch('rootCause')?.length ?? 0;
  const correctiveActionLength = watch('correctiveAction')?.length ?? 0;

  const openConfirm = handleSubmit((values) => {
    setPendingValues(values);
    setConfirmOpen(true);
  });

  async function confirmPropose(): Promise<void> {
    if (!pendingValues) return;
    try {
      await mutation.mutateAsync({ version: incident.version, body: pendingValues });
      show(LABELS.closure.proposedToast, 'success');
      setConfirmOpen(false);
    } catch (err) {
      setConfirmOpen(false);
      if (isApiError(err) && err.status === 422) {
        applyApiErrorToForm(err, setError);
        return;
      }
      show(getErrorMessage(err), 'error');
    }
  }

  return (
    <form onSubmit={openConfirm} noValidate className="space-y-4 py-4">
      <ClosureRequirementsHint />

      <div className="space-y-1">
        <Field
          label={LABELS.closure.rootCauseLabel}
          htmlFor="closure-root-cause"
          error={errors.rootCause?.message}
          required
        >
          <Textarea
            id="closure-root-cause"
            rows={4}
            placeholder={LABELS.closure.rootCausePlaceholder}
            hasError={Boolean(errors.rootCause)}
            disabled={isSubmitting}
            {...register('rootCause')}
          />
        </Field>
        <p className="text-right text-xs text-muted-foreground">{rootCauseLength} / {MAX_LENGTH}</p>
      </div>

      <div className="space-y-1">
        <Field
          label={LABELS.closure.correctiveActionLabel}
          htmlFor="closure-corrective-action"
          error={errors.correctiveAction?.message}
          required
        >
          <Textarea
            id="closure-corrective-action"
            rows={4}
            placeholder={LABELS.closure.correctiveActionPlaceholder}
            hasError={Boolean(errors.correctiveAction)}
            disabled={isSubmitting}
            {...register('correctiveAction')}
          />
        </Field>
        <p className="text-right text-xs text-muted-foreground">{correctiveActionLength} / {MAX_LENGTH}</p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          {LABELS.closure.proposeAction}
        </Button>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title={LABELS.closure.proposeConfirmTitle}
        description={LABELS.closure.proposeConfirmBody}
        confirmLabel={LABELS.closure.proposeAction}
        isLoading={mutation.isPending}
        onConfirm={() => void confirmPropose()}
        onCancel={() => setConfirmOpen(false)}
      />
    </form>
  );
}
