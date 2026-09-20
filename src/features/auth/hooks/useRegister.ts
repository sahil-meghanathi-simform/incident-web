import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { registerRequest } from '../../../api/endpoints/auth.api';
import { setAccessToken } from '../../../api/client';
import { queryKeys } from '../../../api/queryKeys';
import { isApiError } from '../../../api/ApiError';
import { applyApiErrorToForm } from '../../../lib/formErrors';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { LABELS } from '../../../lib/labels';
import { roleHomeFor } from '../../../types/auth.type';
import { registerSchema, type RegisterRequest } from '../schemas/auth.schema';
import { AUTH_TOAST_ID, SILENT_ERROR_TOAST } from '../authToastId';

export type UseRegisterReturn = Readonly<{
  form: UseFormReturn<RegisterRequest>;
  formError: string | null;
  onSubmit: () => void;
}>;

/** Register auto-logs-in (the backend returns the same shape as /login) — one flow.
 * Owns the form's validation and submission; the component only renders `form` and
 * calls `onSubmit` (forms.md). */
export function useRegister(): UseRegisterReturn {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<RegisterRequest>({ resolver: zodResolver(registerSchema) });

  const registerMutation = useMutation({
    mutationFn: (input: RegisterRequest) => registerRequest(input),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(queryKeys.session, data.user);
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      const { user } = await registerMutation.mutateAsync(values);
      toast.success(LABELS.auth.accountCreated, { id: AUTH_TOAST_ID });
      navigate(roleHomeFor(user.role), { replace: true });
    } catch (err) {
      if (isApiError(err) && err.status === 409) {
        form.setError('email', { type: 'EMAIL_ALREADY_EXISTS', message: LABELS.auth.emailAlreadyExists });
        toast.error(LABELS.auth.checkHighlightedFields, { id: AUTH_TOAST_ID });
      } else if (isApiError(err) && err.status === 422) {
        applyApiErrorToForm(err, form.setError);
        toast.error(LABELS.auth.checkHighlightedFields, { id: AUTH_TOAST_ID });
      } else {
        setFormError(getErrorMessage(err));
        toast.error(getErrorMessage(err), SILENT_ERROR_TOAST);
      }
    }
  });

  return { form, formError, onSubmit };
}
