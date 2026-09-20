// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { Field } from '../../../components/ui/Field';
import { Button } from '../../../components/ui/Button';
import { TextLink } from '../../../components/ui/TextLink';
import { AuthCard } from '../components/AuthCard';
import { FormErrorAlert } from '../components/FormErrorAlert';
import { IconInput } from '../components/IconInput';
import { PasswordField } from '../components/PasswordField';
import { useLogin } from '../hooks/useLogin';
import { ROUTES } from '../../../app/routes';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

const ENTRANCE = 'animate-in fade-in slide-in-from-bottom-1 fill-mode-backwards duration-500';

export function LoginPage(): ReactElement {
  useDocumentTitle(LABELS.auth.logIn);
  const { form, formError, onSubmit } = useLogin();
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <AuthCard
      title={LABELS.auth.loginHeading}
      subtitle={LABELS.auth.loginSubtitle}
      footer={
        <>
          {LABELS.auth.noAccountPrompt}{' '}
          <TextLink to={ROUTES.register} className="group inline-flex items-center gap-1">
            {LABELS.auth.register}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </TextLink>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate aria-busy={isSubmitting} className="space-y-5">
        {/* readOnly, not disabled, while submitting: a disabled input drops focus and
            react-hook-form omits its value. */}
        <div className={cn('space-y-4 transition-opacity', isSubmitting && 'pointer-events-none opacity-70')}>
          <div className={cn(ENTRANCE, 'delay-75')}>
            <Field label={LABELS.auth.emailLabel} htmlFor="email" error={errors.email?.message}>
              <IconInput
                id="email"
                icon={Mail}
                type="email"
                autoComplete="email"
                placeholder={LABELS.auth.emailPlaceholder}
                autoFocus
                readOnly={isSubmitting}
                hasError={Boolean(errors.email)}
                {...register('email')}
              />
            </Field>
          </div>
          <div className={cn(ENTRANCE, 'delay-150')}>
            <PasswordField
              label={LABELS.auth.passwordLabel}
              autoComplete="current-password"
              readOnly={isSubmitting}
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
        </div>
        {formError && <FormErrorAlert message={formError} />}
        <div className={cn(ENTRANCE, 'delay-200')}>
          <Button type="submit" className="w-full py-2.5" isLoading={isSubmitting}>
            {isSubmitting ? LABELS.auth.signingIn : LABELS.auth.logIn}
          </Button>
        </div>
        <p role="status" className="sr-only">
          {isSubmitting ? LABELS.auth.signingIn : ''}
        </p>
      </form>
    </AuthCard>
  );
}
