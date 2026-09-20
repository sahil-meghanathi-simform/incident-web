// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useCallback, type ReactElement } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import { useDebouncedDraft } from '../hooks/useDebouncedDraft';

type FilterTextInputProps = Readonly<{
  id: string;
  label: string;
  icon: LucideIcon;
  /** The committed (URL) value. */
  value: string | undefined;
  /** Called ~300ms after typing pauses, with `undefined` for an empty box. */
  onCommit: (next: string | undefined) => void;
  placeholder?: string;
  hint?: string;
  type?: 'text' | 'search';
}>;

/** A labelled text filter with a leading icon, debounced so the URL and the query
 * update once per pause rather than on every keystroke. */
export function FilterTextInput({
  id,
  label,
  icon: Icon,
  value,
  onCommit,
  placeholder,
  hint,
  type = 'text',
}: FilterTextInputProps): ReactElement {
  const commit = useCallback((next: string) => onCommit(next || undefined), [onCommit]);
  const [draft, setDraft] = useDebouncedDraft(value ?? '', commit);

  return (
    <Field label={label} htmlFor={id} hint={hint}>
      {(describedBy) => (
        <div className="relative">
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id={id}
            type={type}
            className="pl-9"
            placeholder={placeholder}
            value={draft}
            aria-describedby={describedBy}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setDraft(e.target.value)}
          />
        </div>
      )}
    </Field>
  );
}
