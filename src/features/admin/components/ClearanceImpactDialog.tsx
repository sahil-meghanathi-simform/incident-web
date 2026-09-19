import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { useClearanceImpactPreview } from '../hooks/useClearanceImpactPreview';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

type ClearanceImpactDialogProps = Readonly<{
  isOpen: boolean;
  userId: string;
  nextClearanceLevel: number | null;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}>;

/**
 * build-plan.md §15.2: lists affected incidents BY REFERENCE before the clearance
 * PATCH is ever sent — the preview call is a separate, read-only round trip
 * (useClearanceImpactPreview), not a client-side guess, since the drawer has no
 * cached view of this user's assignments. [Confirm] stays disabled until the preview
 * has actually resolved, so the admin never confirms a change whose impact they
 * haven't seen yet.
 */
export function ClearanceImpactDialog({
  isOpen,
  userId,
  nextClearanceLevel,
  isSubmitting,
  onConfirm,
  onCancel,
}: ClearanceImpactDialogProps): ReactElement | null {
  const preview = useClearanceImpactPreview(userId, isOpen ? nextClearanceLevel : null);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={LABELS.admin.clearanceImpactDialogTitle}>
      <div className="space-y-4">
        {preview.isPending && (
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <Spinner className="h-4 w-4" /> {LABELS.admin.clearanceImpactLoading}
          </p>
        )}

        {preview.isError && <p role="alert" className="text-sm text-red-600">{LABELS.errors.generic}</p>}

        {preview.data && preview.data.count === 0 && (
          <p className="text-sm text-slate-600">{LABELS.admin.clearanceImpactNone}</p>
        )}

        {preview.data && preview.data.count > 0 && (
          <div className="space-y-2">
            <p role="alert" className="text-sm font-medium text-amber-800">
              {LABELS.admin.clearanceImpactWarning(preview.data.count)}
            </p>
            <ul className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-amber-200 bg-amber-50 p-3 text-sm">
              {preview.data.affectedIncidents.map((incident) => (
                <li key={incident.id}>
                  <Link to={ROUTES.incidentDetail(incident.id)} className="font-mono text-blue-700 hover:underline">
                    {incident.reference}
                  </Link>{' '}
                  <span className="text-slate-500">({incident.severity})</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} isLoading={isSubmitting} disabled={!preview.data}>
            {LABELS.admin.clearanceImpactConfirm}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
