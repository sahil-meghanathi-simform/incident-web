import { useState, type ReactElement } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../../components/ui/Sheet';
import { Field } from '../../../components/ui/Field';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Separator } from '../../../components/ui/Separator';
import { useToast } from '../../../components/ui/useToast';
import { useChangeUserRole } from '../hooks/useChangeUserRole';
import { useChangeUserClearance } from '../hooks/useChangeUserClearance';
import { useToggleUserStatus } from '../hooks/useToggleUserStatus';
import { RoleSelect } from './RoleSelect';
import { ClearanceSelect } from './ClearanceSelect';
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

  const isSelf = user !== null && currentUser !== null && currentUser.id === user.id;
  const isOpen = user !== null;

  function handleClose(): void {
    setRoleDraft(null);
    setClearanceDraft(null);
    setPendingClearance(null);
    setRoleError(null);
    setClearanceError(null);
    setStatusError(null);
    onClose();
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
    }
  }

  if (!user) return null;

  const currentRole = roleDraft ?? user.role;
  const currentClearance = clearanceDraft ?? user.clearanceLevel;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{LABELS.admin.editUserDrawerTitle(user.displayName)}</SheetTitle>
          </SheetHeader>
          <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-foreground-soft">
            <span>{user.email}</span>
            <Badge className={user.isActive ? 'border-border bg-muted text-stage-closed' : 'border-border bg-muted text-muted-foreground'}>
              {user.isActive ? LABELS.admin.statusActive : LABELS.admin.statusInactive}
            </Badge>
          </div>

          {isSelf && <p className="text-xs text-muted-foreground">{LABELS.admin.selfModificationForbidden}</p>}

          <section className="space-y-2">
            <Field label={LABELS.admin.roleLabel} htmlFor="edit-user-role">
              <RoleSelect id="edit-user-role" value={currentRole} disabled={isSelf} onChange={setRoleDraft} />
            </Field>
            {roleError && <p role="alert" className="text-xs text-destructive">{roleError}</p>}
            <Button
              type="button"
              variant="outline"
              onClick={submitRole}
              isLoading={changeRole.isPending}
              disabled={isSelf || roleDraft === null || roleDraft === user.role}
            >
              {LABELS.admin.saveRole}
            </Button>
          </section>

          <Separator />
          <section className="space-y-2">
            <Field label={LABELS.admin.clearanceLabel} htmlFor="edit-user-clearance">
              <ClearanceSelect
                id="edit-user-clearance"
                value={currentClearance}
                disabled={isSelf}
                onChange={(next) => {
                  setClearanceDraft(next);
                }}
              />
            </Field>
            {clearanceError && <p role="alert" className="text-xs text-destructive">{clearanceError}</p>}
            <Button
              type="button"
              variant="outline"
              onClick={() => clearanceDraft !== null && requestClearanceChange(clearanceDraft)}
              isLoading={changeClearance.isPending}
              disabled={isSelf || clearanceDraft === null || clearanceDraft === user.clearanceLevel}
            >
              {LABELS.admin.saveClearance}
            </Button>
          </section>

          <Separator />
          <section className="space-y-2">
            <p className="text-sm font-medium text-foreground-soft">{LABELS.admin.statusLabel}</p>
            {statusError && <p role="alert" className="text-xs text-destructive">{statusError}</p>}
            <Button
              type="button"
              variant={user.isActive ? 'destructive' : 'default'}
              onClick={() => toggleStatusFor(!user.isActive)}
              isLoading={toggleStatus.isPending}
            >
              {user.isActive ? LABELS.admin.deactivateUser : LABELS.admin.activateUser}
            </Button>
          </section>
          </div>
        </SheetContent>
      </Sheet>

      <ClearanceImpactDialog
        isOpen={pendingClearance !== null}
        userId={user.id}
        nextClearanceLevel={pendingClearance}
        isSubmitting={changeClearance.isPending}
        onConfirm={() => pendingClearance !== null && void applyClearanceChange(pendingClearance)}
        onCancel={() => setPendingClearance(null)}
      />
    </>
  );
}

function inlineErrorMessage(err: unknown): string {
  if (isApiError(err) && err.code === 'SELF_MODIFICATION_FORBIDDEN') return LABELS.admin.selfModificationForbidden;
  if (isApiError(err) && err.code === 'LAST_ADMIN') return LABELS.admin.lastAdminError;
  return getErrorMessage(err);
}
