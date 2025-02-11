import { printfulClient } from './client';
import type { PrintfulSyncProduct, PrintfulProductTemplate } from './types';

export class PrintfulService {
  async getProductPrintDetails(shopifyProductId: string): Promise<PrintfulProductTemplate | null> {
    try {
      // Get the Printful sync product using Shopify's product ID
      const syncProduct = await printfulClient.getProductDetails(shopifyProductId);

      if (!syncProduct) {
        return null;
      }

      // Get template details for the product
      const templateDetails = await printfulClient.getTemplateDetails(syncProduct.sync_product.id);

      return templateDetails;
    } catch (error) {
      console.error('Error getting print details:', error);
      return null;
    }
  }

  async getVariantPrintDetails(shopifyVariantId: string) {
    try {
      const syncVariant = await printfulClient.getSyncProduct(shopifyVariantId);

      if (!syncVariant) {
        return null;
      }

      return {
        printFiles: syncVariant.sync_variants[0].files,
        templateDetails: syncVariant.template_details
      };
    } catch (error) {
      console.error('Error getting variant print details:', error);
      return null;
    }
  }
}

export const printfulService = new PrintfulService();
