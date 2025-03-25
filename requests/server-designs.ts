import { serverClient } from '../clients/server';
import { TrendingDesign } from '../types/design';

/**
 * getTrendingDesigns - fetches trending designs for homepage display
 * This version is specifically for server components
 */
export async function getTrendingDesigns(pageSize: number = 8): Promise<TrendingDesign[]> {
  try {
    const response = await serverClient.get(`/designs/trending/?page_size=${pageSize}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching trending designs:', error);
    return [];
  }
}
