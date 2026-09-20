// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useState, type KeyboardEvent, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Send } from 'lucide-react';
import { Field } from '../../../components/ui/Field';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { CharacterCount } from '../../../components/ui/CharacterCount';
import { Alert, AlertDescription } from '../../../components/ui/Alert';
import { useToast } from '../../../components/ui/useToast';
import { useAddNote } from '../hooks/useAddNote';
import { addNoteSchema } from '../schemas/notes.schema';
import { isApiError } from '../../../api/ApiError';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { LABELS } from '../../../lib/labels';
import type { AddNoteRequest } from '../types/investigation.type';

/** Mirrors AddNoteRequestSchema's bounds (investigation.contract.ts) for the counter. */
const MIN_LENGTH = 5;
const MAX_LENGTH = 4000;

type NoteComposerProps = Readonly<{
  incidentId: string;
  /** Only the empty state auto-focuses the composer (§10.2) — never on every render. */
  autoFocus?: boolean;
}>;

/**
 * Owns its own mutation (same pattern as AcknowledgeButton/ChangeSeverityModal) so
 * NotesPanel stays a pure layout container. On error the typed text is never cleared —
 * `reset()` only runs after a confirmed success — so a rollback or a stage-closed
 * refusal both leave the composer exactly as the user left it, ready to copy out.
 *
 * Ctrl/⌘ + Enter submits through the same handler as the button, and only when the
 * button itself would be enabled; plain Enter still inserts a newline.
 */
export function NoteComposer({ incidentId, autoFocus = false }: NoteComposerProps): ReactElement {
  const { show } = useToast();
  const mutation = useAddNote(incidentId);
  const [closedWhileComposing, setClosedWhileComposing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddNoteRequest>({
    resolver: zodResolver(addNoteSchema),
    defaultValues: { body: '' },
  });

  const length = watch('body')?.length ?? 0;
  const overLimit = length > MAX_LENGTH;
  const disabled = closedWhileComposing || isSubmitting;

  const submit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values.body);
      reset({ body: '' });
      show(LABELS.investigation.addNoteToast, 'success');
    } catch (err) {
      if (isApiError(err) && err.code === 'INVALID_STAGE_TRANSITION' && err.meta?.reason === 'NOTES_CLOSED') {
        setClosedWhileComposing(true);
        return;
      }
      show(getErrorMessage(err), 'error');
    }
  });

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key !== 'Enter' || !(event.ctrlKey || event.metaKey)) return;
    event.preventDefault();
    if (disabled || overLimit) return;
    void submit();
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow focus-within:shadow-md"
    >
      {closedWhileComposing && (
        <Alert variant="warning" className="flex items-start gap-2.5">
          <Lock aria-hidden="true" />
          <AlertDescription className="text-xs">{LABELS.investigation.notesClosedNotice}</AlertDescription>
        </Alert>
      )}
      <Field
        label={LABELS.investigation.composerLabel}
        htmlFor="note-composer"
        error={errors.body?.message}
        counter={<CharacterCount count={length} max={MAX_LENGTH} min={MIN_LENGTH} />}
      >
        <Textarea
          id="note-composer"
          rows={3}
          placeholder={LABELS.investigation.composerPlaceholder}
          hasError={Boolean(errors.body) || overLimit}
          disabled={disabled}
          autoFocus={autoFocus && !disabled}
          onKeyDown={handleKeyDown}
          {...register('body')}
        />
      </Field>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground max-sm:hidden">{LABELS.investigation.composerShortcutHint}</span>
        <Button type="submit" isLoading={isSubmitting} disabled={disabled || overLimit} className="ml-auto">
          {!isSubmitting && <Send aria-hidden="true" />}
          {LABELS.investigation.addNote}
        </Button>
      </div>
    </form>
  );
}
