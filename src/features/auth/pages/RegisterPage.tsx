import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { AuthCard } from '../components/AuthCard';
import { PasswordField } from '../components/PasswordField';
import { ClearanceExplainer } from '../components/ClearanceExplainer';
import { registerSchema, type RegisterRequest } from '../schemas/auth.schema';
import { useRegister } from '../hooks/useRegister';
import { applyApiErrorToForm } from '../../../lib/formErrors';
import { isApiError } from '../../../api/ApiError';
import { roleHomeFor } from '../../../types/auth.type';
import { ROUTES } from '../../../app/routes';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';

export default function RegisterPage() {
  useDocumentTitle('Register');
  const navigate = useNavigate();
  const registerAccount = useRegister();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequest>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const { user } = await registerAccount.mutateAsync(values);
      navigate(roleHomeFor(user.role), { replace: true });
    } catch (err) {
      if (isApiError(err)) {
        if (err.status === 409) {
          setError('email', { type: 'EMAIL_ALREADY_EXISTS', message: 'An account with this email already exists.' });
        } else if (err.status === 422) {
          applyApiErrorToForm(err, setError);
        } else {
          setFormError(err.message);
        }
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    }
  });

  return (
    <AuthCard
      title="Register"
      footer={
        <>
          Already have an account?{' '}
          <Link to={ROUTES.login} className="font-medium text-blue-600 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <div className="mb-4">
        <ClearanceExplainer />
      </div>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="Name" htmlFor="displayName" error={errors.displayName?.message}>
          <Input id="displayName" autoComplete="name" hasError={Boolean(errors.displayName)} {...register('displayName')} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" hasError={Boolean(errors.email)} {...register('email')} />
        </Field>
        <PasswordField
          label="Password"
          autoComplete="new-password"
          hint="At least 8 characters."
          error={errors.password?.message}
          {...register('password')}
        />
        {formError && <p className="text-sm text-red-600">{formError}</p>}
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
