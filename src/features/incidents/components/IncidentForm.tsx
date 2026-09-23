// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useEffect, useState, type ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Camera, Gauge, NotebookPen, Send, Tag } from 'lucide-react';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { CharacterCount } from '../../../components/ui/CharacterCount';
import { Alert, AlertDescription } from '../../../components/ui/Alert';
import { dialogFooterClass } from '../../../components/ui/FormDialog';
import { IncidentTypeSelect } from './IncidentTypeSelect';
import { SeveritySelect } from './SeveritySelect';
import { IncidentImageInput } from './IncidentImageInput';
import { FormSection } from './FormSection';
import {
  createIncidentSchema,
  incidentFormSchema,
  NO_IMAGE_REASON_MAX,
  NO_IMAGE_REASON_MIN,
  type IncidentFormValues,
} from '../schemas/incident.schema';
import { incidentFormErrorMap } from '../schemas/incidentFormErrorMap';
import { applyApiErrorToForm } from '../../../lib/formErrors';
import { isApiError } from '../../../api/ApiError';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { LABELS } from '../../../lib/labels';
import { cn } from '../../../lib/cn';
import type { IncidentTypeOption, SeverityOption } from '../types/incident.type';

type IncidentFormProps = Readonly<{
  typeOptions: readonly IncidentTypeOption[];
  severityOptions: readonly SeverityOption[];
  userClearance: number;
  onSubmit: (values: IncidentFormValues) => Promise<void>;
  /** Dismisses the form's host. Rendered beside Submit. */
  onCancel?: () => void;
  /** Lets the host warn before throwing away a part-filled report. */
  onDirtyChange?: (isDirty: boolean) => void;
}>;

// Read from the contract schema itself so the counter can never disagree with validation.
const DESCRIPTION_RULE = createIncidentSchema.shape.description;
const DESCRIPTION_MIN = DESCRIPTION_RULE.minLength ?? 0;
const DESCRIPTION_MAX = DESCRIPTION_RULE.maxLength ?? 5000;

const COPY = LABELS.incidents.form;

// The order the fields appear on screen. react-hook-form focuses the first invalid
// field in *registration* order, and a Controller registers after every plain
// register() call — so left alone, an empty submit skipped past Type to Title.
const FOCUS_ORDER = ['type', 'title', 'description', 'image', 'noImageReason'] as const;

export function IncidentForm({
  typeOptions,
  severityOptions,
  userClearance,
  onSubmit,
  onCancel,
  onDirtyChange,
}: IncidentFormProps): ReactElement {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    setFocus,
    formState: { errors, dirtyFields, isSubmitting, submitCount },
  } = useForm<IncidentFormValues>({
    // path/async are ParseParams' own defaults, spelled out only because the resolver
    // types the whole object as required — errorMap is the one option that matters.
    resolver: zodResolver(incidentFormSchema, { errorMap: incidentFormErrorMap, path: [], async: true }),
    defaultValues: { severity: 'LOW', image: null },
    shouldFocusError: false,
  });

  // The host (a dialog) closes on Escape and on its own close button, so it has to
  // know whether anything would be lost before it goes. `dirtyFields` — populated
  // per field on a real change — rather than RHF's own top-level `isDirty`: paired
  // with the async zodResolver, `isDirty` was observed flipping true for a render
  // pass with an EMPTY dirtyFields (an internal deep-equal artifact, not a real
  // edit), which asked to discard a form nobody had touched.
  const hasDirtyField = Object.keys(dirtyFields).length > 0;
  useEffect(() => {
    onDirtyChange?.(hasDirtyField);
  }, [hasDirtyField, onDirtyChange]);

  const severity = watch('severity');
  const image = watch('image');
  const descriptionLength = (watch('description') ?? '').length;
  // Only after a submit attempt — the count would otherwise nag while someone is
  // still halfway through a field.
  const errorCount = submitCount > 0 ? Object.keys(errors).length : 0;

  const submit = handleSubmit(
    async (values) => {
      setFormError(null);
      try {
        await onSubmit(values);
      } catch (err) {
        if (isApiError(err) && err.code === 'IMAGE_OR_REASON_REQUIRED') {
          setError('noImageReason', { type: err.code, message: err.message });
        } else if (isApiError(err) && err.status === 422) {
          applyApiErrorToForm(err, setError);
        } else {
          setFormError(getErrorMessage(err));
        }
      }
    },
    (invalid) => {
      const first = FOCUS_ORDER.find((name) => invalid[name]);
      if (first) setFocus(first);
    },
  );

  return (
    // The form fills its host's scroll area: the sections scroll and the submit bar
    // sticks to the bottom of that same scroller — the bar has to stay *inside* the
    // <form>, so it can't live in the dialog's own footer slot. `min-h-full` keeps
    // it pinned to the bottom edge even when the fields don't fill the panel.
    <form onSubmit={submit} noValidate className="flex min-h-full flex-col">
      <div className="divide-y divide-border">
        <FormSection icon={Tag} title={COPY.sections.what.title} description={COPY.sections.what.body}>
          {/* Controller, not register: the shadcn select is a button + listbox with
              no native change event. Its ref still reaches the trigger, so a failed
              submit focuses it like any other field. Field's function form hands
              over the describedby id — cloned onto a Controller it would be lost. */}
          <Field label={COPY.typeLabel} htmlFor="type" error={errors.type?.message} required>
            {(describedBy) => (
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <IncidentTypeSelect
                    ref={field.ref}
                    id="type"
                    options={typeOptions}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    hasError={Boolean(errors.type)}
                    disabled={isSubmitting}
                    aria-describedby={describedBy}
                  />
                )}
              />
            )}
          </Field>
        </FormSection>

        <FormSection icon={Gauge} title={COPY.sections.severity.title} description={COPY.sections.severity.body}>
          <SeveritySelect
            options={severityOptions}
            value={severity}
            onChange={(value) => setValue('severity', value, { shouldValidate: true, shouldDirty: true })}
            userClearance={userClearance}
            error={errors.severity?.message}
            isLegendHidden
          />
        </FormSection>

        <FormSection icon={NotebookPen} title={COPY.sections.details.title} description={COPY.sections.details.body}>
          <div className="space-y-5">
            <Field label={COPY.titleLabel} htmlFor="title" error={errors.title?.message} required>
              <Input
                id="title"
                className="h-10"
                placeholder={COPY.titlePlaceholder}
                hasError={Boolean(errors.title)}
                disabled={isSubmitting}
                {...register('title')}
              />
            </Field>

            <Field
              label={COPY.descriptionLabel}
              htmlFor="description"
              error={errors.description?.message}
              required
              hint={COPY.descriptionHint}
              counter={<CharacterCount count={descriptionLength} max={DESCRIPTION_MAX} min={DESCRIPTION_MIN} />}
            >
              <Textarea
                id="description"
                rows={6}
                placeholder={COPY.descriptionPlaceholder}
                hasError={Boolean(errors.description)}
                disabled={isSubmitting}
                {...register('description')}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection icon={Camera} title={COPY.sections.evidence.title} description={COPY.sections.evidence.body}>
          <div className="space-y-5">
            <Field label={COPY.imageLabel} htmlFor="image" error={errors.image?.message} hint={COPY.imageHint}>
              {(describedBy) => (
                <Controller
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <IncidentImageInput
                      ref={field.ref}
                      id="image"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      hasError={Boolean(errors.image)}
                      disabled={isSubmitting}
                      aria-describedby={describedBy}
                    />
                  )}
                />
              )}
            </Field>

            {!image && (
              <Field
                label={COPY.noImageReasonLabel}
                htmlFor="noImageReason"
                error={errors.noImageReason?.message}
                required
                hint={COPY.noImageReasonHint}
                counter={
                  <CharacterCount
                    count={(watch('noImageReason') ?? '').length}
                    max={NO_IMAGE_REASON_MAX}
                    min={NO_IMAGE_REASON_MIN}
                  />
                }
              >
                <Textarea
                  id="noImageReason"
                  rows={3}
                  placeholder={COPY.noImageReasonPlaceholder}
                  hasError={Boolean(errors.noImageReason)}
                  disabled={isSubmitting}
                  {...register('noImageReason')}
                />
              </Field>
            )}
          </div>
        </FormSection>
      </div>

      <div className={cn('sticky bottom-0 z-10 mt-auto space-y-4', dialogFooterClass)}>
        {formError && (
          <Alert variant="destructive" className="flex gap-2.5 animate-in fade-in duration-200">
            <AlertCircle aria-hidden="true" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p
            aria-live="polite"
            className={cn('text-xs', errorCount > 0 ? 'font-medium text-destructive' : 'text-muted-foreground')}
          >
            {errorCount > 0 ? COPY.fixErrors(errorCount) : COPY.requiredNote}
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                {LABELS.chrome.cancel}
              </Button>
            )}
            <Button type="submit" size="lg" className="w-full sm:w-auto" isLoading={isSubmitting} disabled={isSubmitting}>
              {!isSubmitting && <Send aria-hidden="true" />}
              {LABELS.incidents.submitReport}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
