import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { AuthCard } from '../components/AuthCard';
import { PasswordField } from '../components/PasswordField';
import { useLogin } from '../hooks/useLogin';
import { ROUTES } from '../../../app/routes';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { LABELS } from '../../../lib/labels';

export function LoginPage(): ReactElement {
  useDocumentTitle(LABELS.auth.logIn);
  const { form, formError, onSubmit } = useLogin();
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <AuthCard
      title={LABELS.auth.logIn}
      footer={
        <>
          {LABELS.auth.noAccountPrompt}{' '}
          <Link to={ROUTES.register} className="font-medium text-blue-600 hover:underline">
            {LABELS.auth.register}
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
        {formError && (
          <p className="text-sm text-red-600" role="alert">
            {formError}
          </p>
        )}
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          {LABELS.auth.logIn}
        </Button>
      </form>
    </AuthCard>
  );
}
