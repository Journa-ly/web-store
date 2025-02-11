import useSWR from 'swr';
import { fetcher } from 'clients/server';

interface PrintAreaData {
  print_area: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
  dpi: number;
  available_techniques: string[];
}

export function usePrintfulPrintArea(sku: string | undefined) {
  const { data, error, isLoading } = useSWR<PrintAreaData>(
    sku ? `/api/printful/product-print-data/${sku}/` : null,
    (url: string) => fetcher<PrintAreaData>(url)
  );

  return {
    printArea: data?.print_area,
    dpi: data?.dpi,
    availableTechniques: data?.available_techniques,
    isLoading,
    isError: error
  };
}
