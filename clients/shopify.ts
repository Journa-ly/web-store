import axios from 'axios';

// Read environment variables at build time
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN as string;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN as string;
const API_VERSION = '2023-07'; // or also store this in an env var if needed

// Create a single Axios instance
const shopifyAxios = axios.create({
  baseURL: `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}`,
  headers: {
    'X-Shopify-Storefront-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
    'Content-Type': 'application/json'
  }
});

export async function createShopifyCustomer(email: string, acceptsMarketing = true) {
  const response = await shopifyAxios.post('/customers.json', {
    customer: {
      email,
      accepts_marketing: acceptsMarketing
    }
  });
  return response.data;
}
