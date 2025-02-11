import axios from 'axios';

const PRINTFUL_API_URL = 'https://api.printful.com';

class PrintfulClient {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.PRINTFUL_API_KEY || '';
    if (!this.apiKey) {
      console.warn('PRINTFUL_API_KEY is not set in environment variables');
    }
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  async getProductDetails(storeProductId: string) {
    try {
      const response = await axios.get(`${PRINTFUL_API_URL}/store/products/${storeProductId}`, {
        headers: this.headers
      });
      return response.data.result;
    } catch (error) {
      console.error('Error fetching Printful product details:', error);
      throw error;
    }
  }

  async getTemplateDetails(productId: number) {
    try {
      const response = await axios.get(`${PRINTFUL_API_URL}/products/templates/${productId}`, {
        headers: this.headers
      });
      return response.data.result;
    } catch (error) {
      console.error('Error fetching Printful template details:', error);
      throw error;
    }
  }

  async getSyncProduct(storeVariantId: string) {
    try {
      const response = await axios.get(`${PRINTFUL_API_URL}/store/variants/${storeVariantId}`, {
        headers: this.headers
      });
      return response.data.result;
    } catch (error) {
      console.error('Error fetching Printful sync product:', error);
      throw error;
    }
  }
}

export const printfulClient = new PrintfulClient();
