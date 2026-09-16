import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { AuthCard } from '../components/AuthCard';
import { PasswordField } from '../components/PasswordField';
import { loginSchema, type LoginRequest } from '../schemas/auth.schema';
import { useLogin } from '../hooks/useLogin';
import { applyApiErrorToForm } from '../../../lib/formErrors';
import { isApiError } from '../../../api/ApiError';
import { roleHomeFor } from '../../../types/auth.type';
import { ROUTES } from '../../../app/routes';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';

export default function LoginPage() {
  useDocumentTitle('Log in');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useLogin();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const { user } = await login.mutateAsync(values);
      const next = searchParams.get('next');
      navigate(next && next.startsWith('/') ? next : roleHomeFor(user.role), { replace: true });
    } catch (err) {
      if (isApiError(err)) {
        if (err.status === 429) {
          const retryAfter = err.meta?.retryAfterSeconds;
          setFormError(`Too many attempts. Try again in ${retryAfter ?? 'a few'} seconds.`);
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
      title="Log in"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to={ROUTES.register} className="font-medium text-blue-600 hover:underline">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" hasError={Boolean(errors.email)} {...register('email')} />
        </Field>
        <PasswordField
          label="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        {formError && <p className="text-sm text-red-600">{formError}</p>}
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Log in
        </Button>
      </form>
    </AuthCard>
  );
}
