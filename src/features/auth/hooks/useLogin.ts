import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
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
import { AUTH_TOAST_ID, SILENT_ERROR_TOAST } from '../authToastId';

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
    onSuccess: async (data) => {
      setAccessToken(data.accessToken);
      // Deliberately NOT queryClient.setQueryData(queryKeys.session, data.user) here.
      // A direct cache write like that is documented elsewhere as the standard
      // optimistic-update pattern, but empirically (Module 11 hardening,
      // docs/decisions.md) it does not reliably reach useSession's already-mounted
      // observer in AuthProvider — the cache ends up holding the right value
      // (confirmed via getQueryData) while that observer's own React state stays on
      // the previous user, with no further update ever arriving, only fixable by a
      // full reload. Calling the observer's actual refetch cycle — which invalidate +
      // the active observer's auto-refetch triggers — was confirmed (by directly
      // invoking a live observer's refetch()) to update correctly every time.
      // setAccessToken above is already the new token, so this refetch calls the real
      // `/me` with the new user's credentials — authoritative, not a duplicate of the
      // login response.
      await queryClient.invalidateQueries({ queryKey: queryKeys.session });
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      const { user } = await loginMutation.mutateAsync(values);
      toast.success(LABELS.auth.welcomeBack(user.displayName), { id: AUTH_TOAST_ID });
      const next = resolvePostLoginRedirect(searchParams.get('next'), roleHomeFor(user.role));
      navigate(next, { replace: true });
    } catch (err) {
      if (isApiError(err) && err.status === 429) {
        setFormError(LABELS.auth.tooManyAttempts(err.meta?.retryAfterSeconds));
        toast.error(LABELS.auth.tooManyAttempts(err.meta?.retryAfterSeconds), SILENT_ERROR_TOAST);
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
