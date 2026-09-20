// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useState, type ReactElement } from 'react';
import { Info } from 'lucide-react';
import { Sheet, SheetContent } from '../../../components/ui/Sheet';
import { Alert, AlertDescription } from '../../../components/ui/Alert';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { useToast } from '../../../components/ui/useToast';
import { useChangeUserRole } from '../hooks/useChangeUserRole';
import { useChangeUserClearance } from '../hooks/useChangeUserClearance';
import { useToggleUserStatus } from '../hooks/useToggleUserStatus';
import { EditUserHeader } from './EditUserHeader';
import { EditUserRoleSection } from './EditUserRoleSection';
import { EditUserClearanceSection } from './EditUserClearanceSection';
import { EditUserStatusSection } from './EditUserStatusSection';
import { ClearanceImpactDialog } from './ClearanceImpactDialog';
import { getErrorMessage } from '../../../lib/getErrorMessage';
import { isApiError } from '../../../api/ApiError';
import { useAuth } from '../../../hooks/useAuth';
import { LABELS } from '../../../lib/labels';
import type { AdminUserRow } from '../../../api/contracts/admin.contract';
import type { Role } from '../../../api/contracts/enums';

type EditUserDrawerProps = Readonly<{
  user: AdminUserRow | null;
  onClose: () => void;
}>;

/**
 * Three independent sections, one per backend endpoint (role/clearance/status,
 * build-plan.md §15.1) — each saves on its own, mirroring the three separate
 * PATCH routes rather than one combined form submit. Self-modification and
 * last-admin refusals surface INLINE here, in plain language (§15.2's loading/error
 * states), not just as a toast.
 */
export function EditUserDrawer({ user, onClose }: EditUserDrawerProps): ReactElement | null {
  const { user: currentUser } = useAuth();
  const { show } = useToast();
  const changeRole = useChangeUserRole();
  const changeClearance = useChangeUserClearance();
  const toggleStatus = useToggleUserStatus();

  const [roleDraft, setRoleDraft] = useState<Role | null>(null);
  const [clearanceDraft, setClearanceDraft] = useState<number | null>(null);
  const [pendingClearance, setPendingClearance] = useState<number | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [clearanceError, setClearanceError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

  const isSelf = user !== null && currentUser !== null && currentUser.id === user.id;
  const isOpen = user !== null;
  const isDirty =
    user !== null &&
    ((roleDraft !== null && roleDraft !== user.role) ||
      (clearanceDraft !== null && clearanceDraft !== user.clearanceLevel));

  function handleClose(): void {
    setRoleDraft(null);
    setClearanceDraft(null);
    setPendingClearance(null);
    setRoleError(null);
    setClearanceError(null);
    setStatusError(null);
    setIsDiscardOpen(false);
    setIsDeactivateOpen(false);
    onClose();
  }

  function requestClose(): void {
    if (isDirty) {
      setIsDiscardOpen(true);
      return;
    }
    handleClose();
  }

  async function submitRole(): Promise<void> {
    if (!user || roleDraft === null || roleDraft === user.role) return;
    setRoleError(null);
    try {
      await changeRole.mutateAsync({ userId: user.id, role: roleDraft });
      show(LABELS.admin.roleChangedToast, 'success');
      setRoleDraft(null);
    } catch (err) {
      setRoleError(inlineErrorMessage(err));
    }
  }

  function requestClearanceChange(next: number): void {
    if (!user) return;
    setClearanceError(null);
    if (next < user.clearanceLevel) {
      setPendingClearance(next); // opens ClearanceImpactDialog — preview first, then confirm
      return;
    }
    void applyClearanceChange(next);
  }

  async function applyClearanceChange(next: number): Promise<void> {
    if (!user) return;
    try {
      const result = await changeClearance.mutateAsync({ userId: user.id, clearanceLevel: next });
      show(LABELS.admin.clearanceChangedToast(result.affectedIncidentCount), 'success');
      setClearanceDraft(null);
      setPendingClearance(null);
    } catch (err) {
      setClearanceError(inlineErrorMessage(err));
      setPendingClearance(null);
    }
  }

  async function toggleStatusFor(nextIsActive: boolean): Promise<void> {
    if (!user) return;
    setStatusError(null);
    try {
      await toggleStatus.mutateAsync({ userId: user.id, isActive: nextIsActive });
      show(LABELS.admin.statusChangedToast(nextIsActive), 'success');
    } catch (err) {
      setStatusError(inlineErrorMessage(err));
    } finally {
      setIsDeactivateOpen(false);
    }
  }

  if (!user) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && requestClose()}>
        <SheetContent className="max-w-lg">
          <EditUserHeader user={user} />

          <div className="space-y-4">
            {isSelf && (
              <Alert variant="info" role="note" className="flex gap-2">
                <Info aria-hidden="true" />
                <AlertDescription>{LABELS.admin.selfModificationForbidden}</AlertDescription>
              </Alert>
            )}

            <EditUserRoleSection
              savedRole={user.role}
              draftRole={roleDraft ?? user.role}
              isSelf={isSelf}
              isSaving={changeRole.isPending}
              error={roleError}
              onDraftChange={setRoleDraft}
              onSave={submitRole}
            />

            <EditUserClearanceSection
              savedLevel={user.clearanceLevel}
              draftLevel={clearanceDraft ?? user.clearanceLevel}
              isSelf={isSelf}
              isSaving={changeClearance.isPending}
              error={clearanceError}
              onDraftChange={setClearanceDraft}
              onSave={() => clearanceDraft !== null && requestClearanceChange(clearanceDraft)}
            />

            <EditUserStatusSection
              isActive={user.isActive}
              isSaving={toggleStatus.isPending}
              error={statusError}
              onToggle={() => (user.isActive ? setIsDeactivateOpen(true) : void toggleStatusFor(true))}
            />
          </div>
        </SheetContent>
      </Sheet>

      <ClearanceImpactDialog
        isOpen={pendingClearance !== null}
        userId={user.id}
        currentClearanceLevel={user.clearanceLevel}
        nextClearanceLevel={pendingClearance}
        isSubmitting={changeClearance.isPending}
        onConfirm={() => pendingClearance !== null && void applyClearanceChange(pendingClearance)}
        onCancel={() => setPendingClearance(null)}
      />

      <ConfirmDialog
        isOpen={isDeactivateOpen}
        title={LABELS.admin.deactivateConfirmTitle(user.displayName)}
        description={LABELS.admin.deactivateConfirmBody}
        confirmLabel={LABELS.admin.deactivateConfirmAction}
        isDanger
        isLoading={toggleStatus.isPending}
        onConfirm={() => void toggleStatusFor(false)}
        onCancel={() => setIsDeactivateOpen(false)}
      />

      <ConfirmDialog
        isOpen={isDiscardOpen}
        title={LABELS.admin.discardTitle}
        description={LABELS.admin.discardBody}
        confirmLabel={LABELS.admin.discardAction}
        isDanger
        onConfirm={handleClose}
        onCancel={() => setIsDiscardOpen(false)}
      />
    </>
  );
}

function inlineErrorMessage(err: unknown): string {
  if (isApiError(err) && err.code === 'SELF_MODIFICATION_FORBIDDEN') return LABELS.admin.selfModificationForbidden;
  if (isApiError(err) && err.code === 'LAST_ADMIN') return LABELS.admin.lastAdminError;
  return getErrorMessage(err);
}
