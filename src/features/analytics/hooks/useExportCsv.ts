import { useState, useCallback } from 'react';
import { exportAnalyticsCsv } from '../../../api/endpoints/analytics.api';
import { useToast } from '../../../components/ui/useToast';
import { isApiError } from '../../../api/ApiError';
import { LABELS } from '../../../lib/labels';
import type { AnalyticsPeriodFilters } from '../schemas/analyticsPeriod.schema';

export type UseExportCsvReturn = Readonly<{ isExporting: boolean; exportCsv: () => Promise<void> }>;

/**
 * Cannot be a plain `<a href>` (see analytics.api.ts::exportAnalyticsCsv) — fetches the
 * CSV as a Blob with the in-memory access token attached, then clicks a synthetic
 * `<a download>` pointed at an object URL, and revokes it immediately after.
 */
export function useExportCsv(filters: AnalyticsPeriodFilters): UseExportCsvReturn {
  const [isExporting, setIsExporting] = useState(false);
  const toast = useToast();

  const exportCsv = useCallback(async () => {
    setIsExporting(true);
    try {
      const { blob, filename } = await exportAnalyticsCsv(filters);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.show(LABELS.analytics.exportSuccessToast, 'success');
    } catch (err) {
      toast.show(isApiError(err) ? err.message : LABELS.analytics.exportError, 'error');
    } finally {
      setIsExporting(false);
    }
  }, [filters, toast]);

  return { isExporting, exportCsv };
}
