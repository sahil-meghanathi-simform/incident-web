// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { KeyRound, Save } from 'lucide-react';
import { Field } from '../../../components/ui/Field';
import { Button } from '../../../components/ui/Button';
import { EditUserSection } from './EditUserSection';
import { ClearanceSelect } from './ClearanceSelect';
import { LABELS } from '../../../lib/labels';

type EditUserClearanceSectionProps = Readonly<{
  savedLevel: number;
  draftLevel: number;
  isSelf: boolean;
  isSaving: boolean;
  error: string | null;
  onDraftChange: (level: number) => void;
  onSave: () => void;
}>;

function saveHint(isSelf: boolean, savedLevel: number, draftLevel: number): string | undefined {
  if (isSelf) return undefined;
  if (draftLevel === savedLevel) return LABELS.admin.clearanceUnchangedHint;
  if (draftLevel < savedLevel) return LABELS.admin.clearanceLoweringHint;
  return undefined;
}

export function EditUserClearanceSection({
  savedLevel,
  draftLevel,
  isSelf,
  isSaving,
  error,
  onDraftChange,
  onSave,
}: EditUserClearanceSectionProps): ReactElement {
  const isDirty = draftLevel !== savedLevel;
  return (
    <EditUserSection
      icon={KeyRound}
      title={LABELS.admin.clearanceSectionTitle}
      subtitle={LABELS.admin.currentValue(LABELS.admin.clearanceLevelLabel(savedLevel))}
      isDirty={isDirty}
      error={error}
      hint={saveHint(isSelf, savedLevel, draftLevel)}
      action={
        <Button
          type="button"
          variant={isDirty ? 'default' : 'outline'}
          size="sm"
          onClick={onSave}
          isLoading={isSaving}
          disabled={isSelf || !isDirty}
          className="max-sm:w-full"
        >
          {!isSaving && <Save aria-hidden="true" />}
          {LABELS.admin.saveClearance}
        </Button>
      }
    >
      <Field
        label={LABELS.admin.clearanceLabel}
        htmlFor="edit-user-clearance"
        hint={LABELS.admin.clearanceDescription(draftLevel)}
      >
        <ClearanceSelect id="edit-user-clearance" value={draftLevel} disabled={isSelf} onChange={onDraftChange} />
      </Field>
    </EditUserSection>
  );
}
