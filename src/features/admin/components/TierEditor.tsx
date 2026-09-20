// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { Route } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { TierSeverityCard } from './TierSeverityCard';
import { TierPreview } from './TierPreview';
import { TierSaveBar } from './TierSaveBar';
import { tierSetSchema, tierRowErrors, type TierInput } from '../schemas/tierSet.schema';
import { SEVERITY_ORDER, type Severity } from '../../../lib/severity';
import { LABELS } from '../../../lib/labels';

type TierEditorProps = Readonly<{
  initialTiers: readonly TierInput[];
  isSaving: boolean;
  onSave: (tiers: readonly TierInput[]) => void;
}>;

function tierKey(tier: Pick<TierInput, 'severity' | 'level'>): string {
  return `${tier.severity}:${tier.level}`;
}

/** Editable tiers grouped by severity, one local draft, one atomic [Save all] — no
 * per-cell autosave (build-plan.md §15.2's state-responsibilities rule). */
export function TierEditor({ initialTiers, isSaving, onSave }: TierEditorProps): ReactElement {
  const [draft, setDraft] = useState<readonly TierInput[]>(initialTiers);

  // A save's own onSettled refetch hands back a NEW array (even with identical
  // values), which would otherwise look "dirty" forever relative to a draft that
  // already matches it in content — resync whenever the server's copy changes.
  useEffect(() => {
    setDraft(initialTiers);
  }, [initialTiers]);

  const savedMinutes = useMemo(
    () => new Map(initialTiers.map((t) => [tierKey(t), t.thresholdMinutes] as const)),
    [initialTiers],
  );
  const unsavedCount = useMemo(
    () => draft.filter((t) => savedMinutes.get(tierKey(t)) !== t.thresholdMinutes).length,
    [draft, savedMinutes],
  );
  const rowErrors = useMemo(() => tierRowErrors(draft), [draft]);
  const validation = useMemo(() => tierSetSchema.safeParse({ tiers: draft }), [draft]);

  const severitiesPresent = SEVERITY_ORDER.filter((s) => draft.some((t) => t.severity === s)).reverse();

  function updateThreshold(severity: Severity, level: number, thresholdMinutes: number): void {
    setDraft((prev) => prev.map((t) => (t.severity === severity && t.level === level ? { ...t, thresholdMinutes } : t)));
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {severitiesPresent.map((severity) => (
            <TierSeverityCard
              key={severity}
              severity={severity}
              tiers={draft.filter((t) => t.severity === severity).sort((a, b) => a.level - b.level)}
              savedMinutes={savedMinutes}
              rowErrors={rowErrors}
              onChange={(level, thresholdMinutes) => updateThreshold(severity, level, thresholdMinutes)}
            />
          ))}
        </div>

        <Card variant="muted" className="h-fit lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle className="text-base">
              <Route className="size-4 text-primary" aria-hidden="true" />
              {LABELS.admin.tierPreviewTitle}
            </CardTitle>
            <CardDescription>{LABELS.admin.tierPreviewBody}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {severitiesPresent.map((severity) => (
                <TierPreview key={severity} severity={severity} tiers={draft} />
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <TierSaveBar
        unsavedCount={unsavedCount}
        isValid={validation.success}
        isSaving={isSaving}
        onReset={() => setDraft(initialTiers)}
        onSave={() => onSave(draft)}
      />
    </>
  );
}
