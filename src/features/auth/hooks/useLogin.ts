import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginRequest } from '../../../api/endpoints/auth.api';
import { setAccessToken } from '../../../api/client';
import { queryKeys } from '../../../api/queryKeys';
import { isApiError } from '../../../api/ApiError';
import { applyApiErrorToForm } from '../../../lib/formErrors';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { LABELS } from '../../../lib/labels';
import { resolvePostLoginRedirect } from '../../../lib/safeRedirect';
import { roleHomeFor } from '../../../types/auth.type';
import { loginSchema, type LoginRequest } from '../schemas/auth.schema';

export type UseLoginReturn = Readonly<{
  form: UseFormReturn<LoginRequest>;
  formError: string | null;
  onSubmit: () => void;
}>;

/** Owns the login form's validation, submission, and the post-login redirect decision
 * — the component only renders `form` and calls `onSubmit` (forms.md). */
export function useLogin(): UseLoginReturn {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginRequest>({ resolver: zodResolver(loginSchema) });

  const loginMutation = useMutation({
    mutationFn: (input: LoginRequest) => loginRequest(input),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.setQueryData(queryKeys.session, data.user);
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      const { user } = await loginMutation.mutateAsync(values);
      const next = resolvePostLoginRedirect(searchParams.get('next'), roleHomeFor(user.role));
      navigate(next, { replace: true });
    } catch (err) {
      if (isApiError(err) && err.status === 429) {
        setFormError(LABELS.auth.tooManyAttempts(err.meta?.retryAfterSeconds));
      } else if (isApiError(err) && err.status === 422) {
        applyApiErrorToForm(err, form.setError);
      } else {
        setFormError(getErrorMessage(err));
      }
    }
  });

  return { form, formError, onSubmit };
}
