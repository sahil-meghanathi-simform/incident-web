// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { useWatch } from 'react-hook-form';
import { ArrowRight, Mail, User } from 'lucide-react';
import { Field } from '../../../components/ui/Field';
import { Button } from '../../../components/ui/Button';
import { TextLink } from '../../../components/ui/TextLink';
import { AuthCard } from '../components/AuthCard';
import { ClearanceExplainer } from '../components/ClearanceExplainer';
import { FormErrorAlert } from '../components/FormErrorAlert';
import { IconInput } from '../components/IconInput';
import { PasswordField } from '../components/PasswordField';
import { PasswordStrength } from '../components/PasswordStrength';
import { useRegister } from '../hooks/useRegister';
import { ROUTES } from '../../../app/routes';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { cn } from '../../../lib/cn';
import { LABELS } from '../../../lib/labels';

const ENTRANCE = 'animate-in fade-in slide-in-from-bottom-1 fill-mode-backwards duration-500';

export function RegisterPage(): ReactElement {
  useDocumentTitle(LABELS.auth.register);
  const { form, formError, onSubmit } = useRegister();
  const {
    register,
    control,
    formState: { errors, isSubmitting },
  } = form;
  const password = useWatch({ control, name: 'password' }) ?? '';

  return (
    <AuthCard
      title={LABELS.auth.registerHeading}
      subtitle={LABELS.auth.registerSubtitle}
      footer={
        <>
          {LABELS.auth.hasAccountPrompt}{' '}
          {/* py-1 lifts the inline link past the 24px minimum touch target on a phone. */}
          <TextLink to={ROUTES.login} className="group inline-flex items-center gap-1 py-1">
            {LABELS.auth.logIn}
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
            <Field label={LABELS.auth.nameLabel} htmlFor="displayName" error={errors.displayName?.message}>
              <IconInput
                id="displayName"
                icon={User}
                autoComplete="name"
                placeholder={LABELS.auth.namePlaceholder}
                autoFocus
                readOnly={isSubmitting}
                hasError={Boolean(errors.displayName)}
                {...register('displayName')}
              />
            </Field>
          </div>
          <div className={cn(ENTRANCE, 'delay-150')}>
            <Field label={LABELS.auth.emailLabel} htmlFor="email" error={errors.email?.message}>
              <IconInput
                id="email"
                icon={Mail}
                type="email"
                autoComplete="email"
                placeholder={LABELS.auth.emailPlaceholder}
                readOnly={isSubmitting}
                hasError={Boolean(errors.email)}
                {...register('email')}
              />
            </Field>
          </div>
          <div className={cn(ENTRANCE, 'space-y-2 delay-200')}>
            <PasswordField
              label={LABELS.auth.passwordLabel}
              autoComplete="new-password"
              readOnly={isSubmitting}
              error={errors.password?.message}
              {...register('password')}
            />
            <PasswordStrength value={password} />
          </div>
        </div>
        <div className={cn(ENTRANCE, 'delay-300')}>
          <ClearanceExplainer />
        </div>
        {formError && <FormErrorAlert message={formError} />}
        <div className={cn(ENTRANCE, 'delay-300')}>
          {/* Matches IconInput's h-11 / sm:h-10 step — a 44px primary action on a phone. */}
          <Button type="submit" className="h-11 w-full sm:h-10" isLoading={isSubmitting}>
            {isSubmitting ? LABELS.auth.creatingAccount : LABELS.auth.createAccount}
          </Button>
        </div>
        <p role="status" className="sr-only">
          {isSubmitting ? LABELS.auth.creatingAccount : ''}
        </p>
      </form>
    </AuthCard>
  );
}
