import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { AuthCard } from '../components/AuthCard';
import { PasswordField } from '../components/PasswordField';
import { ClearanceExplainer } from '../components/ClearanceExplainer';
import { useRegister } from '../hooks/useRegister';
import { ROUTES } from '../../../app/routes';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { LABELS } from '../../../lib/labels';

export function RegisterPage(): ReactElement {
  useDocumentTitle(LABELS.auth.register);
  const { form, formError, onSubmit } = useRegister();
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <AuthCard
      title={LABELS.auth.register}
      footer={
        <>
          {LABELS.auth.hasAccountPrompt}{' '}
          <Link to={ROUTES.login} className="font-medium text-primary hover:underline">
            {LABELS.auth.logIn}
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
          hint={LABELS.auth.passwordMinLengthHint}
          error={errors.password?.message}
          {...register('password')}
        />
        {formError && (
          <p className="text-sm text-destructive" role="alert">
            {formError}
          </p>
        )}
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          {LABELS.auth.createAccount}
        </Button>
      </form>
    </AuthCard>
  );
}
