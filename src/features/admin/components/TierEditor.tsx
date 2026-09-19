import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { Table } from '../../../components/ui/Table';
import { TableHeader } from '../../../components/ui/TableHeader';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { TierRow } from './TierRow';
import { TierPreview } from './TierPreview';
import { tierSetSchema, tierRowErrors, type TierInput } from '../schemas/tierSet.schema';
import { SEVERITY_ORDER, type Severity } from '../../../lib/severity';
import { LABELS } from '../../../lib/labels';

type TierEditorProps = Readonly<{
  initialTiers: readonly TierInput[];
  isSaving: boolean;
  onSave: (tiers: readonly TierInput[]) => void;
}>;

/** Editable grid, one local draft, one atomic [Save all] — no per-cell autosave
 * (build-plan.md §15.2's state-responsibilities rule). */
export function TierEditor({ initialTiers, isSaving, onSave }: TierEditorProps): ReactElement {
  const [draft, setDraft] = useState<readonly TierInput[]>(initialTiers);

  // A save's own onSettled refetch hands back a NEW array (even with identical
  // values), which would otherwise look "dirty" forever relative to a draft that
  // already matches it in content — resync whenever the server's copy changes.
  useEffect(() => {
    setDraft(initialTiers);
  }, [initialTiers]);

  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(initialTiers), [draft, initialTiers]);
  const rowErrors = useMemo(() => tierRowErrors(draft), [draft]);
  const validation = useMemo(() => tierSetSchema.safeParse({ tiers: draft }), [draft]);
  const canSave = isDirty && validation.success;

  const severitiesPresent = SEVERITY_ORDER.filter((s) => draft.some((t) => t.severity === s));

  function updateThreshold(severity: Severity, level: number, thresholdMinutes: number): void {
    setDraft((prev) => prev.map((t) => (t.severity === severity && t.level === level ? { ...t, thresholdMinutes } : t)));
  }

  const sortedDraft = [...draft].sort((a, b) => {
    const severityDiff = SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity);
    return severityDiff !== 0 ? severityDiff : a.level - b.level;
  });

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <th className="px-4 py-2">{LABELS.admin.tierColumns.severity}</th>
          <th className="px-4 py-2">{LABELS.admin.tierColumns.level}</th>
          <th className="px-4 py-2">{LABELS.admin.tierColumns.thresholdMinutes}</th>
        </TableHeader>
        <tbody className="divide-y divide-slate-100">
          {sortedDraft.map((tier) => (
            <TierRow
              key={`${tier.severity}-${tier.level}`}
              severity={tier.severity}
              level={tier.level}
              thresholdMinutes={tier.thresholdMinutes}
              error={rowErrors.get(`${tier.severity}:${tier.level}`)}
              onChange={(thresholdMinutes) => updateThreshold(tier.severity, tier.level, thresholdMinutes)}
            />
          ))}
        </tbody>
      </Table>

      <Card className="space-y-1 p-4">
        {severitiesPresent.map((severity) => (
          <TierPreview key={severity} severity={severity} tiers={draft} />
        ))}
      </Card>

      <div className="flex items-center justify-end gap-3">
        {!validation.success && <p role="alert" className="text-xs text-red-600">{LABELS.admin.tierSaveDisabledReason}</p>}
        <Button type="button" variant="outline" onClick={() => setDraft(initialTiers)} disabled={!isDirty || isSaving}>
          Reset
        </Button>
        <Button type="button" onClick={() => onSave(draft)} isLoading={isSaving} disabled={!canSave}>
          {LABELS.admin.saveAllTiers}
        </Button>
      </div>
    </div>
  );
}
