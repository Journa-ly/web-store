import useSWR from 'swr';
import { printfulService } from '../lib/printful/service';

export function usePrintfulDetails(productId: string, variantId?: string) {
  const { data: productPrintDetails, error: productError } = useSWR(
    productId ? ['printful-product', productId] : null,
    () => printfulService.getProductPrintDetails(productId)
  );

  const { data: variantPrintDetails, error: variantError } = useSWR(
    variantId ? ['printful-variant', variantId] : null,
    () => (variantId ? printfulService.getVariantPrintDetails(variantId) : null)
  );

  return {
    productPrintDetails,
    variantPrintDetails,
    isLoading: !productError && !productPrintDetails,
    isError: productError || variantError
  };
}
