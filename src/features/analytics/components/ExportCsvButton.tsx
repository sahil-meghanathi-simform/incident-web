// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Download } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useExportCsv } from '../hooks/useExportCsv';
import { LABELS } from '../../../lib/labels';
import type { AnalyticsPeriodFilters } from '../schemas/analyticsPeriod.schema';

type ExportCsvButtonProps = Readonly<{ filters: AnalyticsPeriodFilters }>;

/** The success/error toasts come from useExportCsv; this only shows progress. */
export function ExportCsvButton({ filters }: ExportCsvButtonProps): ReactElement {
  const { isExporting, exportCsv } = useExportCsv(filters);
  return (
    <Button variant="outline" onClick={() => void exportCsv()} isLoading={isExporting}>
      {!isExporting && <Download aria-hidden="true" />}
      {isExporting ? LABELS.analytics.exportingCsv : LABELS.analytics.exportCsv}
    </Button>
  );
}
