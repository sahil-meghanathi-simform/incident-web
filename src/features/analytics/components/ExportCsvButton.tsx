import type { ReactElement } from 'react';
import { Button } from '../../../components/ui/Button';
import { useExportCsv } from '../hooks/useExportCsv';
import { LABELS } from '../../../lib/labels';
import type { AnalyticsPeriodFilters } from '../schemas/analyticsPeriod.schema';

export function ExportCsvButton({ filters }: { filters: AnalyticsPeriodFilters }): ReactElement {
  const { isExporting, exportCsv } = useExportCsv(filters);
  return (
    <Button variant="outline" onClick={() => void exportCsv()} isLoading={isExporting}>
      {isExporting ? LABELS.analytics.exportingCsv : LABELS.analytics.exportCsv}
    </Button>
  );
}
