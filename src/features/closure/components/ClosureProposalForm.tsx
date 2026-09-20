// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, FileCheck2, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Field } from '../../../components/ui/Field';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { CharacterCount } from '../../../components/ui/CharacterCount';
import { Alert, AlertDescription } from '../../../components/ui/Alert';
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

/** Mirrors ProposeClosureRequestSchema's bounds (closure.contract.ts) for the live
 * counters only — validation itself stays with the schema. */
const MIN_LENGTH = 20;
const MAX_LENGTH = 4000;

type ClosureProposalFormProps = Readonly<{
  incident: IncidentDetail;
}>;

/**
 * The investigator's own draft. Gate 1 of the four-layer closure defence (build-
 * plan.md §Module 6) lives in proposeClosureSchema, mirrored exactly from the server's
 * ProposeClosureRequestSchema — the submit button stays enabled through client
 * validation (only an over-limit field, which can never pass, disables it), but the §6
 * "not merely discouraged by the form" requirement is proven by the backend test that
 * calls the endpoint directly, not by this component.
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
  const isOverLimit = rootCauseLength > MAX_LENGTH || correctiveActionLength > MAX_LENGTH;
  const isBusy = isSubmitting || mutation.isPending;

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
    <form onSubmit={openConfirm} noValidate className="py-4">
      <Card className="animate-in fade-in duration-300 motion-reduce:animate-none">
        <CardHeader>
          <CardTitle>
            <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <FileCheck2 className="size-4" aria-hidden="true" />
            </span>
            {LABELS.closure.formTitle}
          </CardTitle>
          <CardDescription>{LABELS.closure.formDescription}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <ClosureRequirementsHint />

          <Field
            label={LABELS.closure.rootCauseLabel}
            htmlFor="closure-root-cause"
            error={errors.rootCause?.message}
            counter={<CharacterCount count={rootCauseLength} max={MAX_LENGTH} min={MIN_LENGTH} />}
            required
          >
            <Textarea
              id="closure-root-cause"
              rows={4}
              placeholder={LABELS.closure.rootCausePlaceholder}
              hasError={Boolean(errors.rootCause) || rootCauseLength > MAX_LENGTH}
              disabled={isSubmitting}
              {...register('rootCause')}
            />
          </Field>

          <Field
            label={LABELS.closure.correctiveActionLabel}
            htmlFor="closure-corrective-action"
            error={errors.correctiveAction?.message}
            counter={<CharacterCount count={correctiveActionLength} max={MAX_LENGTH} min={MIN_LENGTH} />}
            required
          >
            <Textarea
              id="closure-corrective-action"
              rows={4}
              placeholder={LABELS.closure.correctiveActionPlaceholder}
              hasError={Boolean(errors.correctiveAction) || correctiveActionLength > MAX_LENGTH}
              disabled={isSubmitting}
              {...register('correctiveAction')}
            />
          </Field>

          {isOverLimit && (
            <Alert variant="destructive" className="flex items-start gap-2.5">
              <AlertCircle aria-hidden="true" />
              <AlertDescription className="text-xs">{LABELS.closure.overLimitWarning(MAX_LENGTH)}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="justify-end bg-muted/40">
          <Button type="submit" isLoading={isBusy} disabled={isOverLimit}>
            {!isBusy && <Send aria-hidden="true" />}
            {LABELS.closure.proposeAction}
          </Button>
        </CardFooter>
      </Card>

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
