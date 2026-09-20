// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Power, UserCheck, UserX } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { EditUserSection } from './EditUserSection';
import { LABELS } from '../../../lib/labels';

type EditUserStatusSectionProps = Readonly<{
  isActive: boolean;
  isSaving: boolean;
  error: string | null;
  /** Deactivating asks for confirmation first (handled by the drawer). */
  onToggle: () => void;
}>;

export function EditUserStatusSection({ isActive, isSaving, error, onToggle }: EditUserStatusSectionProps): ReactElement {
  const ActionIcon = isActive ? UserX : UserCheck;
  return (
    <EditUserSection
      icon={Power}
      title={LABELS.admin.statusLabel}
      subtitle={isActive ? LABELS.admin.statusActiveDescription : LABELS.admin.statusInactiveDescription}
      error={error}
      action={
        <Button
          type="button"
          variant={isActive ? 'destructive' : 'secondary'}
          size="sm"
          onClick={onToggle}
          isLoading={isSaving}
          className="max-sm:w-full"
        >
          {!isSaving && <ActionIcon aria-hidden="true" />}
          {isActive ? LABELS.admin.deactivateUser : LABELS.admin.activateUser}
        </Button>
      }
    />
  );
}
