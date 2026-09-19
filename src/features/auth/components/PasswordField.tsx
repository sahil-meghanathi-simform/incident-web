import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import { LABELS } from '../../../lib/labels';

type PasswordFieldProps = InputHTMLAttributes<HTMLInputElement> &
  Readonly<{
    label: string;
    error?: string;
    hint?: string;
  }>;

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { label, error, hint, id, ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? 'password';

  return (
    <Field label={label} htmlFor={inputId} error={error} hint={hint}>
      {(describedBy) => (
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            hasError={Boolean(error)}
            aria-describedby={describedBy}
            className="pr-16"
            {...rest}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-muted-foreground hover:text-foreground-soft"
          >
            {visible ? LABELS.auth.passwordHide : LABELS.auth.passwordShow}
          </button>
        </div>
      )}
    </Field>
  );
});
