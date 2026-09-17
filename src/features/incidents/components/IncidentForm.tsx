import { useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { IncidentTypeSelect } from './IncidentTypeSelect';
import { SeveritySelect } from './SeveritySelect';
import { createIncidentSchema, type CreateIncidentRequest } from '../schemas/incident.schema';
import { applyApiErrorToForm } from '../../../lib/formErrors';
import { isApiError } from '../../../api/ApiError';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { LABELS } from '../../../lib/labels';
import type { IncidentTypeOption, SeverityOption } from '../types/incident.type';

type IncidentFormProps = Readonly<{
  typeOptions: readonly IncidentTypeOption[];
  severityOptions: readonly SeverityOption[];
  userClearance: number;
  onSubmit: (values: CreateIncidentRequest) => Promise<void>;
}>;

export function IncidentForm({
  typeOptions,
  severityOptions,
  userClearance,
  onSubmit,
}: IncidentFormProps): ReactElement {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateIncidentRequest>({
    resolver: zodResolver(createIncidentSchema),
    defaultValues: { severity: 'LOW' },
  });

  const severity = watch('severity');

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      if (isApiError(err) && err.status === 422) {
        applyApiErrorToForm(err, setError);
      } else {
        setFormError(getErrorMessage(err));
      }
    }
  });

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <Field label="Type" htmlFor="type" error={errors.type?.message} required>
        <IncidentTypeSelect
          id="type"
          options={typeOptions}
          hasError={Boolean(errors.type)}
          disabled={isSubmitting}
          {...register('type')}
        />
      </Field>

      <SeveritySelect
        options={severityOptions}
        value={severity}
        onChange={(value) => setValue('severity', value, { shouldValidate: true })}
        userClearance={userClearance}
        error={errors.severity?.message}
      />

      <Field label="Title" htmlFor="title" error={errors.title?.message} required>
        <Input id="title" hasError={Boolean(errors.title)} disabled={isSubmitting} {...register('title')} />
      </Field>

      <Field
        label="Description"
        htmlFor="description"
        error={errors.description?.message}
        required
        hint="At least 20 characters."
      >
        <Textarea
          id="description"
          rows={6}
          hasError={Boolean(errors.description)}
          disabled={isSubmitting}
          {...register('description')}
        />
      </Field>

      {formError && (
        <p className="text-sm text-red-600" role="alert">
          {formError}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
        {LABELS.incidents.submitReport}
      </Button>
    </form>
  );
}
