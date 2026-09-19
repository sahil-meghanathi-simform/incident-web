import { useState, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field } from '../../../components/ui/Field';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/useToast';
import { useAddNote } from '../hooks/useAddNote';
import { addNoteSchema } from '../schemas/notes.schema';
import { isApiError } from '../../../api/ApiError';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { LABELS } from '../../../lib/labels';
import type { AddNoteRequest } from '../types/investigation.type';

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

  return (
    <form onSubmit={submit} noValidate className="space-y-2">
      {closedWhileComposing && (
        <p role="alert" className="rounded-md border border-severity-medium-border bg-severity-medium-surface px-3 py-2 text-xs text-severity-medium">
          {LABELS.investigation.notesClosedNotice}
        </p>
      )}
      <Field label={LABELS.investigation.composerLabel} htmlFor="note-composer" error={errors.body?.message}>
        <Textarea
          id="note-composer"
          rows={3}
          placeholder={LABELS.investigation.composerPlaceholder}
          hasError={Boolean(errors.body) || overLimit}
          disabled={disabled}
          autoFocus={autoFocus && !disabled}
          {...register('body')}
        />
      </Field>
      <div className="flex items-center justify-between">
        <span className={overLimit ? 'text-xs font-medium text-destructive' : 'text-xs text-muted-foreground'}>
          {LABELS.investigation.composerCharacterCount(length, MAX_LENGTH)}
        </span>
        <Button type="submit" isLoading={isSubmitting} disabled={disabled || overLimit}>
          {LABELS.investigation.addNote}
        </Button>
      </div>
    </form>
  );
}
