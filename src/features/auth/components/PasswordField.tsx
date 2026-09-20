// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { forwardRef, useState, type InputHTMLAttributes, type KeyboardEvent } from 'react';
import { AlertTriangle, Eye, EyeOff, Lock } from 'lucide-react';
import { Field } from '../../../components/ui/Field';
import { LABELS } from '../../../lib/labels';
import { IconInput } from './IconInput';

type PasswordFieldProps = InputHTMLAttributes<HTMLInputElement> &
  Readonly<{
    label: string;
    error?: string;
    hint?: string;
  }>;

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { label, error, hint, id, onKeyDown, onKeyUp, ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const inputId = id ?? 'password';

  const syncCapsLock = (event: KeyboardEvent<HTMLInputElement>): void => {
    setIsCapsLockOn(event.getModifierState('CapsLock'));
  };

  return (
    <div className="space-y-1">
      <Field label={label} htmlFor={inputId} error={error} hint={hint}>
        {(describedBy) => (
          <IconInput
            ref={ref}
            id={inputId}
            icon={Lock}
            type={visible ? 'text' : 'password'}
            hasError={Boolean(error)}
            aria-describedby={describedBy}
            onKeyDown={(event) => {
              syncCapsLock(event);
              onKeyDown?.(event);
            }}
            onKeyUp={(event) => {
              syncCapsLock(event);
              onKeyUp?.(event);
            }}
            trailing={
              // The label stays constant and aria-pressed carries the state — flipping
              // both would announce the change twice (accessibility.md).
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={LABELS.auth.showPassword}
                aria-pressed={visible}
                className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-3 text-muted-foreground transition-colors hover:text-foreground-soft"
              >
                {visible ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            }
            {...rest}
          />
        )}
      </Field>
      {isCapsLockOn && (
        <p
          role="status"
          className="flex items-center gap-1.5 text-xs text-severity-medium animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {LABELS.auth.capsLockOn}
        </p>
      )}
    </div>
  );
});
