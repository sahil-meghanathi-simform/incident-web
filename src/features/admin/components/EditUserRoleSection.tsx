// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import { Field } from '../../../components/ui/Field';
import { Button } from '../../../components/ui/Button';
import { EditUserSection } from './EditUserSection';
import { RoleSelect } from './RoleSelect';
import { LABELS } from '../../../lib/labels';
import type { Role } from '../../../api/contracts/enums';

type EditUserRoleSectionProps = Readonly<{
  savedRole: Role;
  draftRole: Role;
  isSelf: boolean;
  isSaving: boolean;
  error: string | null;
  onDraftChange: (role: Role) => void;
  onSave: () => void;
}>;

export function EditUserRoleSection({
  savedRole,
  draftRole,
  isSelf,
  isSaving,
  error,
  onDraftChange,
  onSave,
}: EditUserRoleSectionProps): ReactElement {
  const isDirty = draftRole !== savedRole;
  return (
    <EditUserSection
      icon={ShieldCheck}
      title={LABELS.admin.roleSectionTitle}
      subtitle={LABELS.admin.currentValue(LABELS.admin.roleLabelFor(savedRole))}
      isDirty={isDirty}
      error={error}
      hint={!isSelf && !isDirty ? LABELS.admin.roleUnchangedHint : undefined}
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
          {LABELS.admin.saveRole}
        </Button>
      }
    >
      <Field label={LABELS.admin.roleLabel} htmlFor="edit-user-role" hint={LABELS.admin.roleDescription(draftRole)}>
        <RoleSelect id="edit-user-role" value={draftRole} disabled={isSelf} onChange={onDraftChange} />
      </Field>
    </EditUserSection>
  );
}
