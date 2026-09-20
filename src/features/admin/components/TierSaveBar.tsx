// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useState, type ReactElement } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { TierSaveStatus } from './TierSaveStatus';
import { LABELS } from '../../../lib/labels';

type TierSaveBarProps = Readonly<{
  unsavedCount: number;
  isValid: boolean;
  isSaving: boolean;
  onReset: () => void;
  onSave: () => void;
}>;

/** Pinned to the bottom of the viewport while editing, so Save is always in reach.
 * Reset asks first — it throws away every unsaved threshold at once. */
export function TierSaveBar({ unsavedCount, isValid, isSaving, onReset, onSave }: TierSaveBarProps): ReactElement {
  const [isResetOpen, setIsResetOpen] = useState(false);
  const isDirty = unsavedCount > 0;

  return (
    <>
      <div className="sticky bottom-4 z-10 mt-6 flex flex-col gap-3 rounded-xl border border-border bg-card/95 p-3 shadow-md backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <TierSaveStatus unsavedCount={unsavedCount} isValid={isValid} />
        <div className="flex gap-2 max-sm:[&>button]:flex-1">
          <Button type="button" variant="ghost" onClick={() => setIsResetOpen(true)} disabled={!isDirty || isSaving}>
            <RotateCcw aria-hidden="true" />
            {LABELS.admin.resetTiers}
          </Button>
          <Button type="button" onClick={onSave} isLoading={isSaving} disabled={!isDirty || !isValid}>
            {!isSaving && <Save aria-hidden="true" />}
            {LABELS.admin.saveAllTiers}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isResetOpen}
        title={LABELS.admin.resetTiersTitle}
        description={LABELS.admin.resetTiersBody}
        confirmLabel={LABELS.admin.resetTiersAction}
        isDanger
        onConfirm={() => {
          onReset();
          setIsResetOpen(false);
        }}
        onCancel={() => setIsResetOpen(false)}
      />
    </>
  );
}
